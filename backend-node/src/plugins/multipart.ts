import type { FastifyInstance } from "fastify";
import multipart from "@fastify/multipart";

export function registerMultipart(app: FastifyInstance) {
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 1
    }
  });
}