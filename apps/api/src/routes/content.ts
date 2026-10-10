import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { IdParamSchema } from "@rnp/shared";
import type { Container } from "../container.ts";

export const contentRoutes = (c: Container) =>
  new Hono()
    .get("/tracks", async (ctx) => ctx.json(await c.content.listTracks()))
    .get("/tracks/:id", zValidator("param", IdParamSchema), async (ctx) =>
      ctx.json(await c.content.getTrack(ctx.req.valid("param").id)),
    )
    .get("/lessons/:id", zValidator("param", IdParamSchema), async (ctx) =>
      ctx.json(await c.content.getLesson(ctx.req.valid("param").id)),
    )
    .get("/lessons/:id/problems", zValidator("param", IdParamSchema), async (ctx) =>
      ctx.json(await c.content.getLessonProblems(ctx.req.valid("param").id)),
    )
    .get("/problems/:id", zValidator("param", IdParamSchema), async (ctx) =>
      ctx.json(await c.content.getProblem(ctx.req.valid("param").id)),
    );
