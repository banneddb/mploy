import { useEffect, useMemo, useRef, useState } from "react";
import { analyzeResume, parseResume } from "../api/resume";
import { FileUp, Sparkles, Wand2, X, Loader2 } from "lucide-react";

/* ----------------------------- UI helpers ----------------------------- */

function Chip({
  label,
  type,
}: {
  label: string;
  type: "good" | "bad" | "neutral";
}) {
  const cls =
    type === "good"
      ? "bg-green-100 text-green-800 border-green-200"
      : type === "bad"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${cls}`}
    >
      {label}
    </span>
  );
}

function ScoreRing({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-5xl font-extrabold text-[#142d4c]">{value}%</div>
      <div className="text-sm text-gray-600">
        <div className="font-semibold text-gray-700">Skill Match</div>
        <div className="text-xs text-gray-400">based on extracted JD skills</div>
      </div>
    </div>
  );
}

function AdviceCard({
  keyword,
  whyImportant,
  howToImprove,
}: {
  keyword: string;
  whyImportant?: string;
  howToImprove?: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg text-[#142d4c]">{keyword}</div>
      </div>
      {whyImportant && <p className="mt-2 text-gray-700">{whyImportant}</p>}
      {howToImprove?.length ? (
        <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
          {howToImprove.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function AnalysisResult({ result }: { result: any }) {
  const matchPercent = result?.matchPercent ?? 0;
  const matched = (result?.matchedKeywords ?? []) as string[];
  const missing = (result?.missingKeywords ?? []) as string[];
  const ranked = (result?.rankedImportant ?? []) as Array<{
    keyword: string;
    whyImportant?: string;
    howToImprove?: string[];
  }>;

  // Sort advice so missing keywords appear first
  const rankedSorted = [...ranked].sort((a, b) => {
    const am = missing.includes(a.keyword.toLowerCase()) ? 0 : 1;
    const bm = missing.includes(b.keyword.toLowerCase()) ? 0 : 1;
    return am - bm;
  });

  return (
    <div className="mt-8 space-y-6 animate-[fadeInUp_500ms_ease-out]">
      {/* Top summary */}
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <ScoreRing value={matchPercent} />
          <div className="text-sm text-gray-500">
            LLM:{" "}
            <span className="font-semibold text-gray-700">
              {result?.llmStatus ?? "unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Matched / Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="font-semibold mb-3 text-[#142d4c]">Matched skills</div>
          <div className="flex flex-wrap gap-2">
            {matched.length ? (
              matched.map((k) => <Chip key={k} label={k} type="good" />)
            ) : (
              <span className="text-gray-500">None found</span>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="font-semibold mb-3 text-[#142d4c]">Missing skills</div>
          <div className="flex flex-wrap gap-2">
            {missing.length ? (
              missing.map((k) => <Chip key={k} label={k} type="bad" />)
            ) : (
              <span className="text-gray-500">No gaps detected 🎉</span>
            )}
          </div>
        </div>
      </div>

      {/* AI Advice */}
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-[#142d4c]">AI suggestions for gaps</div>
          <div className="text-xs text-gray-500">focus on top 1–2 missing skills</div>
        </div>

        {rankedSorted.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rankedSorted.map((item) => (
              <AdviceCard
                key={item.keyword}
                keyword={item.keyword}
                whyImportant={item.whyImportant}
                howToImprove={item.howToImprove}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No AI suggestions returned.</div>
        )}
      </div>

      {/* Debug toggle */}
      <details className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer font-medium text-[#142d4c]">
          View raw JSON
        </summary>
        <pre className="mt-3 text-xs overflow-auto bg-gray-50 border border-gray-200 rounded-xl p-4">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}

/* ----------------------------- Main page ----------------------------- */

export default function ResumeRefiner() {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const jdCount = useMemo(() => jdText.trim().length, [jdText]);

  function pickFile() {
    inputRef.current?.click();
  }

  function clearFile() {
    setFile(null);
  }

  async function handleAnalyze() {
    if (!file) return setError("Upload a resume PDF first.");
    if (!jdText.trim()) return setError("Paste a job description.");

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const { resumeText } = await parseResume(file);
      const analysis = await analyzeResume(resumeText, jdText, true);
      setResult(analysis);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Tiny keyframes (Tailwind arbitrary animate uses these names) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={[
          "rounded-3xl border border-gray-200 bg-white shadow-sm p-8 transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-[#385170]" />
              Resume Refiner
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#142d4c]">
              Resume Refiner
            </h1>
            <p className="mt-2 text-gray-600">
              Upload your resume PDF + paste a job description to get match %, missing
              skills, and AI gap-focused suggestions.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
              Fastify + FastAPI
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
              deterministic + LLM
            </span>
          </div>
        </div>

        {/* Upload + JD */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload card */}
          <div>
            <div className="font-semibold text-[#142d4c] mb-2">Resume PDF</div>

            <div
              onClick={pickFile}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) setFile(f);
              }}
              className={[
                "cursor-pointer rounded-2xl border p-6 transition-all",
                "bg-gray-50 hover:bg-white",
                dragOver ? "border-[#385170] ring-2 ring-[#385170]/20" : "border-gray-200",
              ].join(" ")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#385170]/10 flex items-center justify-center">
                  <FileUp className="w-6 h-6 text-[#385170]" />
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-[#142d4c]">
                    {file ? "File selected" : "Click to upload or drag & drop"}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {file ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-400">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </span>
                    ) : (
                      "PDF only • We’ll extract text on the backend"
                    )}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Tip: use a text-based PDF (not a scanned image).
                  </div>
                </div>

                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-2 rounded-xl hover:bg-gray-100 transition"
                    title="Remove file"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* JD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[#142d4c]">Job Description</div>
              <div className="text-xs text-gray-500">{jdCount} chars</div>
            </div>

            <textarea
              className="w-full border border-gray-200 rounded-2xl p-4 min-h-[180px] bg-gray-50
                         focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25
                         transition"
              placeholder="Paste the job description here… (try the Requirements section for best results)"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            <div className="mt-2 text-xs text-gray-500">
              Pro tip: paste the “Qualifications / Requirements” part to avoid fluff keywords.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#142d4c] text-white font-semibold
                       hover:bg-[#0f223a] disabled:opacity-50 transition shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setJdText("");
              setResult(null);
              setError(null);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white
                       font-semibold text-[#142d4c] hover:bg-gray-50 transition"
          >
            Clear
          </button>

          {error && <div className="text-red-600 font-medium">{error}</div>}
        </div>

        {/* Result */}
        {result && <AnalysisResult result={result} />}
      </div>
    </div>
  );
}