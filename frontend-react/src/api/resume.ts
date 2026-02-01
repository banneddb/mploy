import { apiFetch } from "./client";

export async function parseResume(file: File) {
  const form = new FormData();
  form.append("resumePdf", file);

  return apiFetch<{
    resumeText: string;
    meta: { filename: string; extractedChars: number };
  }>("/api/parse-resume", {
    method: "POST",
    body: form,
  });
}

export async function analyzeResume(
  resumeText: string,
  jdText: string,
  useLlm = true
) {
  return apiFetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resumeText,
      jdText,
      options: { useLlm, topK: 10 },
    }),
  });
}