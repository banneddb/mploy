import type { FastifyReply, FastifyRequest } from "fastify";
import { AnalyzeBodySchema } from "../schemas/analyze.schema.js";
import { extractCandidateKeywords } from "../services/nlp/candidateKeywords.js";
import { scoreResumeAgainstKeywords } from "../services/nlp/scoring.js";
import { rankKeywordsWithLlm } from "../services/llm/llmClient.js";

type LlmStatus = "ok" | "timeout" | "error" | "skipped";

export async function analyzeController(req: FastifyRequest, reply: FastifyReply) {
  const parsed = AnalyzeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.code(400).send({
      error: "Invalid JSON body",
      details: parsed.error.flatten()
    });
  }

  const { resumeText, jdText } = parsed.data;
  const topK = parsed.data.options?.topK ?? 20;
  const useLlm = parsed.data.options?.useLlm ?? true;

  // 1) deterministic candidate keywords
  const candidates = extractCandidateKeywords(jdText);

  // 2) LLM ranks candidates (best-effort)
  let rankedImportant: any[] = [];
  let llmStatus: LlmStatus = "skipped";

  if (useLlm) {
    try {
      rankedImportant = await rankKeywordsWithLlm({ jdText, candidates, topK });
      llmStatus = "ok";
    } catch (e: any) {
      llmStatus = e?.name === "AbortError" ? "timeout" : "error";
    }
  }

  // fallback if LLM fails
  const importantKeywords =
    rankedImportant.length > 0
      ? rankedImportant.map((x) => String(x.keyword).toLowerCase())
      : candidates.slice(0, topK);

  // 3) deterministic scoring
  const scoring = scoreResumeAgainstKeywords(resumeText, importantKeywords);

  return reply.send({
    matchPercent: scoring.matchPercent,
    matchedKeywords: scoring.matchedKeywords,
    missingKeywords: scoring.missingKeywords,
    rankedImportant,
    llmStatus
  });
}