import type { LoginInput, RegisterInput, UserDto } from "@rnp/shared";
import { ApiRequestError, type ApiClient } from "@/core/ApiClient";
import { Store } from "@/core/Store";
import type { SessionStorage } from "@/core/SessionStorage";
import type { AuthService } from "@/services/AuthService";

export interface AuthState {
  ready: boolean;
  user: UserDto | null;
}

export class AuthStore extends Store<AuthState> {
  constructor(
    private readonly api: ApiClient,
    private readonly auth: AuthService,
    private readonly storage: SessionStorage,
  ) {
    super({ ready: false, user: null });
    this.api.setUnauthorizedHandler(() => void this.logout());
  }

  async bootstrap(): Promise<void> {
    const session = await this.storage.read();
    if (!session) return this.setState({ ready: true });
    this.api.setToken(session.token);
    this.setState({ ready: true, user: session.user });
    try {
      const user = await this.auth.me();
      this.setState({ user });
      void this.storage.write({ token: session.token, user });
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) await this.logout();
    }
  }

  async login(input: LoginInput): Promise<void> {
    this.accept(await this.auth.login(input));
  }

  async register(input: RegisterInput): Promise<void> {
    this.accept(await this.auth.register(input));
  }

  async logout(): Promise<void> {
    await this.storage.clear();
    this.api.setToken(null);
    this.setState({ user: null });
  }

  private accept(res: { token: string; user: UserDto }): void {
    this.api.setToken(res.token);
    void this.storage.write({ token: res.token, user: res.user });
    this.setState({ user: res.user, ready: true });
  }
}
