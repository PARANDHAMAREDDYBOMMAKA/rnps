import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { LoginSchema, RegisterSchema } from "@rnp/shared";
import type { Container } from "../container.ts";
import { requireAuth, type AuthEnv } from "../middleware/auth.ts";

export const authRoutes = (c: Container) =>
  new Hono<AuthEnv>()
    .post("/register", zValidator("json", RegisterSchema), async (ctx) =>
      ctx.json(await c.auth.register(ctx.req.valid("json")), 201),
    )
    .post("/login", zValidator("json", LoginSchema), async (ctx) =>
      ctx.json(await c.auth.login(ctx.req.valid("json"))),
    )
    .get("/me", requireAuth(c.tokens), async (ctx) => ctx.json(await c.auth.me(ctx.get("userId"))));
