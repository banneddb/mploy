import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export function registerCors(app: FastifyInstance) {
  app.register(cors, {
    origin: true
  });
}