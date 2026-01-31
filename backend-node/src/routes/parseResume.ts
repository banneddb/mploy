import type { FastifyInstance } from "fastify";
import { parseResumeController } from "../controllers/parseResumeController.js";

export async function parseResumeRoutes(app: FastifyInstance) {
  app.post("/parse-resume", parseResumeController);
}