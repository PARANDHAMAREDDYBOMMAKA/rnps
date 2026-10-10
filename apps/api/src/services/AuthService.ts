import type { AuthResponse, LoginInput, RegisterInput, UserDto } from "@rnp/shared";
import { HttpError } from "../core/HttpError.ts";
import type { UserRow } from "../db/schema.ts";
import type { UserRepository } from "../repositories/UserRepository.ts";
import type { PasswordHasher } from "./PasswordHasher.ts";
import type { TokenService } from "./TokenService.ts";

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw HttpError.conflict("Email already registered");
    const passwordHash = await this.hasher.hash(input.password);
    const user = await this.users.create({ name: input.name, email: input.email, passwordHash });
    return this.respond(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw HttpError.unauthorized("Invalid credentials");
    const ok = await this.hasher.verify(input.password, user.passwordHash);
    if (!ok) throw HttpError.unauthorized("Invalid credentials");
    return this.respond(user);
  }

  async me(userId: string): Promise<UserDto> {
    const user = await this.users.findById(userId);
    if (!user) throw HttpError.notFound("User");
    return AuthService.toDto(user);
  }

  private async respond(user: UserRow): Promise<AuthResponse> {
    return { token: await this.tokens.issue(user.id), user: AuthService.toDto(user) };
  }

  static toDto(user: UserRow): UserDto {
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() };
  }
}
