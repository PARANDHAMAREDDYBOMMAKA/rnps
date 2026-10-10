import { createMiddleware } from "hono/factory";
import { HttpError } from "../core/HttpError.ts";
import type { TokenService } from "../services/TokenService.ts";

export type AuthEnv = { Variables: { userId: string } };

export const requireAuth = (tokens: TokenService) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const header = c.req.header("Authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const payload = token ? await tokens.parse(token) : null;
    if (!payload) throw HttpError.unauthorized();
    c.set("userId", payload.sub);
    await next();
  });
