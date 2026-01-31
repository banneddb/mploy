import Fastify, { FastifyInstance } from "fastify";
import { registerCors } from "./plugins/cors.js";
import { registerMultipart } from "./plugins/multipart.js";

import { healthRoutes } from "./routes/health.js";
import { parseResumeRoutes } from "./routes/parseResume.js";
import { analyzeRoutes } from "./routes/analyze.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  registerCors(app);
  registerMultipart(app);

  app.register(healthRoutes);
  app.register(parseResumeRoutes, { prefix: "/api" });
  app.register(analyzeRoutes, { prefix: "/api" });

  return app;
}