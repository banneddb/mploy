from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()


class RankRequest(BaseModel):
    jdText: str
    resumeText: str
    candidates: List[str]
    topK: int = 20
    

@app.post("/llm/rank")
def rank(req: RankRequest):
    
    ranked = []
    for i, kw in enumerate(req.candidates[:req.topK]):
        ranked.append({
            "keyword": kw,
            "importance": round(1.0 - i * 0.05, 2),
            "whyImportant": f"{kw} is commonly required for modern SWE roles.",
            "howToImprove": [
                f"Add {kw} to a project",
                f"Mention {kw} explicitly in a resume bullet",
                f"Practice with a small demo using {kw}"
            ]
        })
    return {"rankedImportant": ranked}