import type { FastifyReply, FastifyRequest } from "fastify";
import { AnalyzeBodySchema } from "../schemas/analyze.schema.js";
import { extractCandidateKeywords } from "../services/nlp/candidateKeywords.js";
import { scoreResumeAgainstKeywords } from "../services/nlp/scoring.js";
import { rankKeywordsWithLlm } from "../services/llm/llmClient.js";

type LlmStatus = "ok" | "timeout" | "error" | "skipped";

export async function analyzeController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // 0) Validate request body
  const parsed = AnalyzeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: "Invalid JSON body",
      details: parsed.error.flatten(),
    });
  }

  const { resumeText, jdText } = parsed.data;
  const topK = parsed.data.options?.topK ?? 20;
  const useLlm = parsed.data.options?.useLlm ?? true;

  // 1) Deterministic candidate extraction from JD
  const candidates = extractCandidateKeywords(jdText);

  // 2) Deterministic scoring (ALWAYS runs)
  const importantKeywords = candidates.slice(0, topK);
  const scoring = scoreResumeAgainstKeywords(resumeText, importantKeywords);

  // 3) Optional LLM advice ONLY for missing keywords
  let rankedImportant: any[] = [];
  let llmStatus: LlmStatus = "skipped";

  const missingForLlm = scoring.missingKeywords;

  if (useLlm && missingForLlm.length > 0) {
    try {
      const llmRes = await rankKeywordsWithLlm({
        jdText,
        resumeText,
        candidates: missingForLlm, // <-- ONLY missing
        topK,
      });

      rankedImportant = llmRes?.rankedImportant ?? [];
      llmStatus = "ok";
    } catch (e: any) {
      llmStatus = e?.name === "AbortError" ? "timeout" : "error";
    }
  }

  // 4) Final response
  return reply.send({
    matchPercent: scoring.matchPercent,
    matchedKeywords: scoring.matchedKeywords,
    missingKeywords: scoring.missingKeywords,
    rankedImportant,
    llmStatus,
  });
}