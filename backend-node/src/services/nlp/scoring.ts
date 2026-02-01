const ROLE_STOPWORDS = new Set([
  "software",
  "engineer",
  "engineering",
  "intern",
  "internship",
  "developer",
  "development"
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeyword(resume: string, keyword: string): boolean {
  const k = keyword.toLowerCase().trim();
  if (!k || ROLE_STOPWORDS.has(k)) return false;

  // Variants
  if (k === "node" || k === "nodejs" || k === "node.js") {
    return /\bnode(\.?js)?\b/.test(resume);
  }

  if (k === "rest" || k === "rest api" || k === "restful") {
    return /\brest\b|restful|rest\s+api/.test(resume);
  }

  // Short tokens (sql, aws, etc.)
  if (k.length <= 3) {
    const re = new RegExp(`(^|\\W)${escapeRegExp(k)}(\\W|$)`, "i");
    return re.test(resume);
  }

  // Normal word / phrase
  const re = new RegExp(
    `(^|\\W)${escapeRegExp(k).replace(/\s+/g, "\\s+")}(\\W|$)`,
    "i"
  );
  return re.test(resume);
}

export function scoreResumeAgainstKeywords(
  resumeText: string,
  keywords: string[]
) {
  const resume = normalize(resumeText);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    if (matchesKeyword(resume, kw)) matched.push(kw);
    else missing.push(kw);
  }

  const denom = keywords.length || 1;
  const matchPercent = Math.round((matched.length / denom) * 100);

  return {
    matchPercent,
    matchedKeywords: matched.slice(0, 50),
    missingKeywords: missing.slice(0, 50)
  };
}