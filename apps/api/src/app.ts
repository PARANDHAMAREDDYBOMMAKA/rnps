import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { Container } from "./container.ts";
import { HttpError } from "./core/HttpError.ts";
import { authRoutes } from "./routes/auth.ts";
import { contentRoutes } from "./routes/content.ts";
import { progressRoutes } from "./routes/progress.ts";

export class App {
  readonly hono: Hono;
  readonly container: Container;

  constructor() {
    this.container = new Container();
    this.hono = new Hono();
    this.configure();
  }

  private configure(): void {
    const { hono, container } = this;
    hono.use(logger());
    hono.use(secureHeaders());
    hono.use(cors({ origin: "*", allowHeaders: ["Content-Type", "Authorization"] }));
    hono.get("/health", (c) => c.json({ ok: true, redis: container.env.hasRedis }));
    hono.route("/auth", authRoutes(container));
    hono.route("/content", contentRoutes(container));
    hono.route("/progress", progressRoutes(container));
    hono.notFound((c) => c.json({ error: "Route not found" }, 404));
    hono.onError((err, c) => {
      if (err instanceof HttpError) return c.json({ error: err.message, details: err.details }, err.status);
      console.error(err);
      return c.json({ error: "Internal server error" }, 500);
    });
  }
}
