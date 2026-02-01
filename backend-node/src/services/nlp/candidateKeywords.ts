// Candidate keyword extraction focused on SKILLS (not generic company words).
// Strategy:
// 1) Find high-precision skills from a curated dictionary
// 2) If none found, fall back to filtered tokens

const ROLE_STOPWORDS = new Set([
  "the","and","or","to","of","in","for","a","an","with","on","at","by","from",
  "is","are","as","be","will","you","we","our","your","this","that","they","their",
  "software","engineer","engineering","intern","internship","developer","development",
  "come","join","growing","company","leading","marketplace","both","marketing",
  "role","team","job","work","working","ability","skills","skill","experience"
]);

// Curated skills dictionary (expand anytime)
const SKILL_PHRASES: string[] = [
  // Languages
  "typescript","javascript","python","java","c++","c#","c","go","golang","rust","sql",

  // Frontend
  "react","next.js","nextjs","vue","angular","html","css","tailwind",

  // Backend / APIs
  "node.js","nodejs","node","express","fastify","rest","rest api","restful","graphql",

  // Databases
  "mysql","postgres","postgresql","mongodb","redis",

  // Cloud / DevOps
  "aws","gcp","google cloud","azure","docker","kubernetes","ci/cd","github actions",

  // Testing
  "jest","junit","pytest"
];

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasSkill(text: string, skill: string): boolean {
  const s = skill.toLowerCase().trim();

  if (s === "node" || s === "nodejs" || s === "node.js") {
    return /\bnode(\.?js)?\b/.test(text);
  }

  if (s === "ci/cd") {
    return /(ci\s*\/\s*cd|cicd|continuous integration|continuous delivery)/i.test(text);
  }

  const pattern = escapeRegExp(s).replace(/\s+/g, "\\s+");
  const re = new RegExp(`(^|\\W)${pattern}(\\W|$)`, "i");
  return re.test(text);
}

export function extractCandidateKeywords(jdText: string): string[] {
  const text = jdText
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\n \-]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  // 1) High-precision: dictionary skills
  const seen = new Set<string>();
  const skillsFound: string[] = [];

  for (const skill of SKILL_PHRASES) {
    if (hasSkill(text, skill)) {
      const k = skill.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        skillsFound.push(k);
      }
    }
  }

  // If we found real skills, return ONLY those (prevents junk tokens)
  if (skillsFound.length > 0) {
    return skillsFound.slice(0, 200);
  }

  // 2) Fallback: filtered tokens (only when no skills found)
  const tokens = text
    .replace(/\n/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "")) // strip punctuation
    .filter((t) => t.length >= 3)
    .filter((t) => !ROLE_STOPWORDS.has(t));

  const unique: string[] = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
    if (unique.length >= 200) break;
  }

  return unique;
}