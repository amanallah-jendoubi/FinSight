from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class TransactionInput(BaseModel):
    description: str
    type: Optional[Literal["expense", "income", ""]] = ""


class CategorizeRequest(BaseModel):
    transactions: List[TransactionInput] = Field(..., min_length=1, examples=[[
        {"description": "CARREFOUR MONTPELLIER", "type": "expense"},
        {"description": "VIR SALAIRE TEAMWILL GROUPE", "type": "income"},
        {"description": "SNCF VOYAGE PARIS LYON", "type": ""},
    ]])


class CategoryResult(BaseModel):
    description: str
    type: Literal["expense", "income"]
    type_guessed: bool
    category: Optional[str] = None
    confidence: Optional[float] = None  # category confidence, expense only
    source: Optional[str] = None        # counterparty/employer, income only


class CategorizeResponse(BaseModel):
    results: List[CategoryResult]


class TrainExample(BaseModel):
    description: str
    category: str


class TrainRequest(BaseModel):
    examples: List[TrainExample] = Field(..., min_length=1)


class TrainResponse(BaseModel):
    status: str
    trained_examples: int
    categories: int
