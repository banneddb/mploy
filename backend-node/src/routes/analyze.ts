import type { FastifyInstance } from "fastify";
import { analyzeController } from "../controllers/analyzeController.js";

export async function analyzeRoutes(app: FastifyInstance) {
  app.post("/analyze", analyzeController);
}