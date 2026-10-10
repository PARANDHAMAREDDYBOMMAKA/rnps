import { serve } from "@hono/node-server";
import { App } from "./app.ts";

const app = new App();

serve({ fetch: app.hono.fetch, port: app.container.env.port, hostname: "0.0.0.0" }, (info) => {
  console.log(`API listening on http://0.0.0.0:${info.port}`);
});
