import type { AuthResponse, LoginInput, RegisterInput, UserDto } from "@rnp/shared";
import type { ApiClient } from "@/core/ApiClient";

export class AuthService {
  constructor(private readonly api: ApiClient) {}

  register(input: RegisterInput): Promise<AuthResponse> {
    return this.api.post<AuthResponse>("/auth/register", input);
  }

  login(input: LoginInput): Promise<AuthResponse> {
    return this.api.post<AuthResponse>("/auth/login", input);
  }

  me(): Promise<UserDto> {
    return this.api.get<UserDto>("/auth/me");
  }
}
