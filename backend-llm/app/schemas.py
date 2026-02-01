from pydantic import BaseModel
from typing import List

class RankRequest(BaseModel):
    jdText: str
    resumeText: str
    candidates: List[str]
    topK: int = 20

class RankedItem(BaseModel):
    keyword: str
    importance: float
    whyImportant: str
    howToImprove: List[str]

class RankResponse(BaseModel):
    rankedImportant: List[RankedItem]