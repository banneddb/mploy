const STOPWORDS = new Set([
    "the","and","or","to","of","in","for","a","an","with","on","at","by","from",
    "is","are","as","be","will","you","we","our","your","this","that","they","their"
  ]);
  
  export function extractCandidateKeywords(jdText: string): string[] {
    const text = jdText.toLowerCase();
  
    // Keep simple tokens; hackathon-safe.
    const tokens = text
      .replace(/[^a-z0-9+.#/ -]/g, " ")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => t.length >= 3)
      .filter((t) => !STOPWORDS.has(t));
  
    // Deduplicate preserving first appearance
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const t of tokens) {
      if (!seen.has(t)) {
        seen.add(t);
        unique.push(t);
      }
    }
  
    return unique.slice(0, 200);
  }