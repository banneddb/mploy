import { z } from "zod";

export const AnalyzeBodySchema = z.object({
  resumeText: z.string().min(1),
  jdText: z.string().min(1),
  options: z
    .object({
      topK: z.number().int().min(5).max(50).default(20),
      useLlm: z.boolean().default(true)
    })
    .optional()
});

export type AnalyzeBody = z.infer<typeof AnalyzeBodySchema>;