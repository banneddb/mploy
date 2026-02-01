import { env } from "../../config/env.js";

export async function rankKeywordsWithLlm(input: {
  jdText: string;
  resumeText: string;
  candidates: string[];
  topK: number;
}) {
  const url = `${env.LLM_URL}/llm/rank`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.LLM_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`LLM HTTP ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}