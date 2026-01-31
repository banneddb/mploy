import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  HOST: process.env.HOST ?? "0.0.0.0",
  LLM_URL: process.env.LLM_URL ?? "http://localhost:8000",
  LLM_TIMEOUT_MS: Number(process.env.LLM_TIMEOUT_MS ?? 9000)
};