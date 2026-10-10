import { sign, verify } from "hono/jwt";

export interface TokenPayload {
  sub: string;
  exp: number;
}

export class TokenService {
  private static readonly alg = "HS256";

  constructor(
    private readonly secret: string,
    private readonly ttlSeconds = 60 * 60 * 24 * 30,
  ) {}

  issue(userId: string): Promise<string> {
    const exp = Math.floor(Date.now() / 1000) + this.ttlSeconds;
    return sign({ sub: userId, exp }, this.secret, TokenService.alg);
  }

  async parse(token: string): Promise<TokenPayload | null> {
    try {
      const payload = await verify(token, this.secret, TokenService.alg);
      if (typeof payload.sub !== "string") return null;
      return payload as unknown as TokenPayload;
    } catch {
      return null;
    }
  }
}
