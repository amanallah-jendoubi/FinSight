"""
FinSight ML sidecar — transaction categorization service.

Express remains the sole DB accessor; this service is stateless (aside
from the persisted model file) and only ever sees transaction data passed
in from the Node backend, per the sidecar pattern.

Per-transaction routing:
  - type == "expense" -> run the ML categorizer, category is filled
  - type == "income"  -> skip the categorizer, source (employer/payer) is filled
  - type == ""        -> guess the type first via text heuristics, then
                          apply the rule above

Run locally:
    uvicorn app.main:app --reload --port 8001
"""

from fastapi import FastAPI, HTTPException

from .categories import CATEGORIES
from .model import CategoryModel
from .schemas import (
    CategorizeRequest,
    CategorizeResponse,
    CategoryResult,
    TrainRequest,
    TrainResponse,
)
from .source_extractor import extract_source
from .type_detector import detect_type

app = FastAPI(
    title="FinSight Categorization Service",
    description="TF-IDF + LogisticRegression transaction categorizer, constrained to a fixed category taxonomy.",
    version="1.1.0",
)

# Loaded once at startup and reused across requests — not reloaded per call.
model = CategoryModel()


@app.get("/health")
def health():
    return {"status": "ok", "categories": len(CATEGORIES)}


@app.get("/categories")
def list_categories():
    return {"categories": CATEGORIES}


@app.post("/predict-category-batch", response_model=CategorizeResponse)
def predict_category_batch(payload: CategorizeRequest):
    """
    Batch endpoint — always use this from the Node backend for CSV imports
    instead of calling per transaction in a loop.
    """
    if not payload.transactions:
        raise HTTPException(status_code=400, detail="transactions must not be empty")

    # Split into expense vs income (resolving blank types first) so the
    # ML model only ever runs on the batch of descriptions it needs to.
    resolved = []  # (description, resolved_type, type_guessed)
    for tx in payload.transactions:
        if tx.type in ("expense", "income"):
            resolved.append((tx.description, tx.type, False))
        else:
            guessed_type, _ = detect_type(tx.description)
            resolved.append((tx.description, guessed_type, True))

    expense_indices = [i for i, (_, t, _) in enumerate(resolved) if t == "expense"]
    expense_descriptions = [resolved[i][0] for i in expense_indices]

    predictions_by_index = {}
    if expense_descriptions:
        predictions = model.predict(expense_descriptions)
        for idx, (category, confidence) in zip(expense_indices, predictions):
            predictions_by_index[idx] = (category, confidence)

    results = []
    for i, (description, resolved_type, type_guessed) in enumerate(resolved):
        if resolved_type == "expense":
            category, confidence = predictions_by_index[i]
            results.append(CategoryResult(
                description=description,
                type=resolved_type,
                type_guessed=type_guessed,
                category=category,
                confidence=round(confidence, 3),
                source=None,
            ))
        else:  # income
            results.append(CategoryResult(
                description=description,
                type=resolved_type,
                type_guessed=type_guessed,
                category=None,
                confidence=None,
                source=extract_source(description),
            ))

    return CategorizeResponse(results=results)


@app.post("/train", response_model=TrainResponse)
def retrain(payload: TrainRequest):
    """
    Retrain the model with user-corrected examples on top of the seed
    dataset. Call this periodically (e.g. nightly, or after N new
    corrections) rather than on every single correction.
    """
    examples = [(ex.description, ex.category) for ex in payload.examples]
    try:
        stats = model.train(extra_examples=examples)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return TrainResponse(status="trained", **stats)
