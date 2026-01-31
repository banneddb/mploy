import pdf from "pdf-parse";
import { normalizeText } from "../../utils/text.js";

export async function extractTextFromPdfBuffer(buf: Buffer): Promise<string> {
  const data = await pdf(buf);
  return normalizeText(data.text ?? "");
}