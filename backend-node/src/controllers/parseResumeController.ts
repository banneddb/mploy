import type { FastifyReply, FastifyRequest } from "fastify";
import { extractTextFromPdfBuffer } from "../services/pdf/pdfExtract.js";

export async function parseResumeController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Expect multipart form with a single file field: resumePdf
  const parts = req.parts();

  let pdfBuffer: Buffer | null = null;
  let filename: string | undefined;

  for await (const part of parts) {
    if (part.type === "file" && part.fieldname === "resumePdf") {
      filename = part.filename;
      const chunks: Buffer[] = [];
      for await (const chunk of part.file) chunks.push(chunk);
      pdfBuffer = Buffer.concat(chunks);
      break;
    }
  }

  if (!pdfBuffer) {
    return reply.code(400).send({
      error: "Missing resumePdf file field (multipart/form-data)."
    });
  }

  try {
    const resumeText = await extractTextFromPdfBuffer(pdfBuffer);

    // Heuristic: if it's too short, likely scanned or failed parse
    if (resumeText.length < 200) {
      return reply.code(422).send({
        error:
          "Could not extract enough text from PDF. If this is a scanned PDF, please upload a text-based PDF or provide text manually.",
        meta: { filename, extractedChars: resumeText.length }
      });
    }

    return reply.send({
      resumeText,
      meta: { filename, extractedChars: resumeText.length }
    });
  } catch {
    return reply.code(422).send({
      error:
        "Failed to parse PDF. Try a different PDF or provide resume text manually.",
      meta: { filename }
    });
  }
}