export function scoreResumeAgainstKeywords(resumeText: string, keywords: string[]) {
    const resume = resumeText.toLowerCase();
  
    const matched: string[] = [];
    const missing: string[] = [];
  
    for (const kw of keywords) {
      if (resume.includes(kw.toLowerCase())) matched.push(kw);
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