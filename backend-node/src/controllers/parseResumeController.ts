import type { FastifyReply, FastifyRequest } from "fastify";
import { extractTextFromPdfBuffer } from "../services/pdf/pdfExtract.js";

export async function parseResumeController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  req.log.info("parse-resume: route hit");

  const file = await (req as any).file();
  req.log.info(
    { hasFile: !!file, fieldname: file?.fieldname, filename: file?.filename },
    "parse-resume: got file"
  );

  if (!file) {
    return reply.code(400).send({
      error: "Missing resumePdf file field (multipart/form-data)."
    });
  }

  if (file.fieldname !== "resumePdf") {
    return reply.code(400).send({
      error: "Expected file field name to be 'resumePdf'."
    });
  }

  const buf = await file.toBuffer();
  req.log.info({ bytes: buf.length }, "parse-resume: buffered file");

  try {
    const resumeText = await extractTextFromPdfBuffer(buf);
    req.log.info(
      { extractedChars: resumeText.length },
      "parse-resume: extracted text"
    );

    if (resumeText.length < 200) {
      return reply.code(422).send({
        error:
          "Could not extract enough text from PDF. If this is a scanned PDF, please upload a text-based PDF or provide text manually.",
        meta: { filename: file.filename, extractedChars: resumeText.length }
      });
    }

    return reply.send({
      resumeText,
      meta: { filename: file.filename, extractedChars: resumeText.length }
    });
  } catch (err) {
    req.log.error(err, "parse-resume: pdf extraction failed");

    return reply.code(422).send({
      error:
        "Failed to parse PDF. Try a different PDF or provide resume text manually.",
      meta: { filename: file.filename }
    });
  }
}