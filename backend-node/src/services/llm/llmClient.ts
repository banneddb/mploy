import { z } from "zod";
import { env } from "../../config/env.js";

const RankedItem = z.object({
  keyword: z.string(),
  importance: z.number().min(0).max(1).optional(),
  whyImportant: z.string().optional(),
  howToImprove: z.array(z.string()).optional()
});

const LlmResponse = z.object({
  rankedImportant: z.array(RankedItem)
});

type RankReq = {
  jdText: string;
  candidates: string[];
  topK: number;
};

export async function rankKeywordsWithLlm(req: RankReq) {
  const url = `${env.LLM_URL}/llm/rank`;

  const attempt = async () => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), env.LLM_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(req)
      });

      if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
      const json = await res.json();

      const parsed = LlmResponse.safeParse(json);
      if (!parsed.success) throw new Error("LLM response schema invalid");

      return parsed.data.rankedImportant;
    } finally {
      clearTimeout(t);
    }
  };

  // One retry
  try {
    return await attempt();
  } catch {
    return await attempt();
  }
}