import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { IdParamSchema, SubmitAnswerSchema } from "@rnp/shared";
import type { Container } from "../container.ts";
import { requireAuth, type AuthEnv } from "../middleware/auth.ts";

export const progressRoutes = (c: Container) =>
  new Hono<AuthEnv>()
    .use(requireAuth(c.tokens))
    .get("/summary", async (ctx) => ctx.json(await c.progress.summary(ctx.get("userId"))))
    .get("/leaderboard", async (ctx) => ctx.json(await c.progress.leaderboard()))
    .post("/lessons/:id/complete", zValidator("param", IdParamSchema), async (ctx) =>
      ctx.json(await c.progress.completeLesson(ctx.get("userId"), ctx.req.valid("param").id)),
    )
    .post(
      "/problems/:id/submit",
      zValidator("param", IdParamSchema),
      zValidator("json", SubmitAnswerSchema),
      async (ctx) =>
        ctx.json(
          await c.progress.submitAnswer(
            ctx.get("userId"),
            ctx.req.valid("param").id,
            ctx.req.valid("json").answer,
          ),
        ),
    );
