# FinSight Categorization Service

FastAPI + scikit-learn sidecar that classifies transaction descriptions into
a **fixed** set of 32 categories and heuristically extracts the counterparty
("source" — employer for salary, merchant for purchases).

## How it works

1. **Preprocessing** (`app/preprocessing.py`) strips dates, reference
   numbers, and card codes from raw bank labels before vectorization —
   these are near-unique tokens that add noise, not signal.
2. **Vectorization + classification** (`app/model.py`): `TfidfVectorizer`
   (unigrams + bigrams) feeds a `LogisticRegression` with
   `class_weight="balanced"`.
3. **Fixed taxonomy guarantee**: the model is only ever trained on labels
   from `app/categories.py::CATEGORIES`. scikit-learn's `classes_` is
   derived directly from the training labels, so the model *cannot*
   predict a category outside that list — there's no need to filter
   output after the fact.
4. **Low-confidence fallback**: if the top prediction's probability is
   below `CONFIDENCE_THRESHOLD` (0.35), a small high-precision keyword
   dictionary (`KEYWORD_RULES`) is checked before trusting the ML guess.
   This matters most early on, before you've accumulated much real
   training data.
5. **Source extraction** (`app/source_extractor.py`) is rule-based, not
   ML-based: it strips transaction-type boilerplate (VIR, CB, PRLV...)
   and treats what's left as the counterparty. If salary/payroll keywords
   are detected, it's treated as an employer name instead of a merchant.
   This is a v1 heuristic — worth replacing with a trained NER model once
   you have enough real corrected data.

## Cold start

New FinSight users have zero categorized transactions on day one, so the
model ships pre-trained on `app/seed_data.py` — ~150 hand-written
French/Tunisian/English bank labels covering all 32 categories. Extend or
replace this over time with real corrected transactions via `/train`.

**Known limitation:** the given category list has no explicit "Income" or
"Salary" category, so salary transactions are seeded under "Savings" as
the closest fit. If FinSight later adds an "Income" category, update
`seed_data.py` and retrain — don't leave salary mapped to Savings
long-term, it will skew that category's precision.

## Setup

```bash
cd ml-service
pip install -r requirements.txt
python train.py          # trains and saves data/model.joblib
uvicorn app.main:app --reload --port 8001
```

## Endpoints

### `POST /predict-category-batch` (use this for CSV imports)

Each transaction is routed by `type`:
- `"expense"` → the ML categorizer runs, `category` is filled, `source` is `null`
- `"income"` → the categorizer is skipped, `source` (employer/payer) is filled, `category` is `null`
- `""` (unknown — some CSV formats don't give you a reliable type) → the
  service guesses via text heuristics (`app/type_detector.py`) first, then
  applies the rule above. The response tells you whether it guessed via
  `type_guessed`.

```json
// Request
{
  "transactions": [
    { "description": "CARREFOUR MONTPELLIER", "type": "expense" },
    { "description": "VIR SALAIRE TEAMWILL GROUPE", "type": "income" },
    { "description": "SNCF VOYAGE PARIS LYON", "type": "" }
  ]
}
```

```json
// Response
{
  "results": [
    { "description": "CARREFOUR MONTPELLIER", "type": "expense", "type_guessed": false, "category": "Groceries", "confidence": 0.5, "source": null },
    { "description": "VIR SALAIRE TEAMWILL GROUPE", "type": "income", "type_guessed": false, "category": null, "confidence": null, "source": "Teamwill Groupe" },
    { "description": "SNCF VOYAGE PARIS LYON", "type": "expense", "type_guessed": true, "category": "Transport", "confidence": 0.5, "source": null }
  ]
}
```

**On `type_guessed` + `confidence`:** when `type` was blank and had to be
guessed, or when `confidence` on a category prediction is below ~0.4, it's
worth flagging that transaction as "needs review" in the UI rather than
silently trusting the guess — especially early on, before the seed dataset
has been supplemented with your users' real corrected data.

**Type-guessing caveat:** `app/type_detector.py` is a pure text heuristic
(keyword lists for salary/refund/etc. vs card-payment/withdrawal/etc.). It
has no amount data to work with, so it defaults to "expense" whenever
nothing matches — expenses dominate personal-finance data, so that's the
safer default, but it will misclassify unusual income descriptions it
hasn't seen a keyword for.

### `POST /predict-category?description=...`
Single-transaction convenience endpoint. Prefer the batch endpoint for
imports — one HTTP round trip instead of N.

### `POST /train`
Retrain on seed data + user-corrected examples:
```json
{ "examples": [{ "description": "CARREFOUR ARIANA", "category": "Groceries" }] }
```
Call this periodically (cron, or after N new corrections accumulate) —
not on every single correction, since retraining on the full seed set
each time is cheap now but will get slower as your real dataset grows.

### `GET /categories`
Returns the fixed list of 32 categories — useful for validating on the
Express side too.

### `GET /health`

## Wiring into the Express monolith

Per the sidecar pattern: Express stays the sole DB accessor. It sends raw
`description` strings to this service and gets back `{category, source,
confidence}` per transaction — it never queries the DB from here, and this
service never touches Postgres directly.

```js
// Express side, batch call during CSV import
const { data } = await axios.post('http://localhost:8001/predict-category-batch', {
  descriptions: transactions.map(t => t.rawLabel),
});
```

## Next steps worth doing before this is production-ready

- Persist user corrections somewhere Express controls (e.g. a
  `CategoryCorrection` table), then feed them into `/train` on a schedule.
- Swap the keyword-only cold-start fallback for a bigger, curated seed set
  once you've seen a sample of real FinSight transaction labels.
- Add basic auth / network restriction on this service — it currently has
  no auth of its own and assumes it only receives traffic from Express.
- Docker containerization (deferred per your notes) — a `Dockerfile` here
  would just be `python:3.12-slim` + `pip install -r requirements.txt` +
  `uvicorn app.main:app --host 0.0.0.0 --port 8001`.
