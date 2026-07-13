"""
TF-IDF + LogisticRegression categorization pipeline.

Design notes:
- LogisticRegression's `classes_` are exactly the labels seen during
  training. Since we always train on app.categories.CATEGORIES (directly
  or via SEED_DATA), the model can never predict a category outside that
  set — it literally has no other classes to choose from.
- class_weight="balanced" compensates for categories with few seed
  examples (e.g. "Home Insurance") versus ones with many (e.g. "Groceries").
- Below CONFIDENCE_THRESHOLD, we try a high-precision keyword rule before
  trusting the (possibly shaky) ML prediction. This matters most early on,
  when the seed dataset is thin.
"""

from pathlib import Path
from typing import List, Tuple

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from .categories import CATEGORIES, KEYWORD_RULES
from .preprocessing import clean_text
from .seed_data import SEED_DATA

MODEL_PATH = Path(__file__).resolve().parent.parent / "data" / "model.joblib"
CONFIDENCE_THRESHOLD = 0.35

_VALID_CATEGORIES = set(CATEGORIES)


class CategoryModel:
    def __init__(self, auto_load: bool = True):
        self.pipeline: Pipeline | None = None
        if auto_load:
            self._load_or_train()

    # ---------------------------------------------------------------- #
    # Training / persistence
    # ---------------------------------------------------------------- #
    def _load_or_train(self) -> None:
        if MODEL_PATH.exists():
            self.pipeline = joblib.load(MODEL_PATH)
        else:
            self.train()

    def train(self, extra_examples: List[Tuple[str, str]] | None = None) -> dict:
        """
        Train (or retrain) the pipeline on SEED_DATA plus any extra
        user-corrected examples, then persist it to disk.

        extra_examples: list of (description, category) tuples. Any
        category not in CATEGORIES is rejected up front — silently
        accepting an unknown label would let the model start predicting
        categories outside the fixed taxonomy.
        """
        data = list(SEED_DATA)

        if extra_examples:
            invalid = [c for _, c in extra_examples if c not in _VALID_CATEGORIES]
            if invalid:
                raise ValueError(
                    f"Unknown category label(s) in training data: {sorted(set(invalid))}. "
                    f"Must be one of: {CATEGORIES}"
                )
            data.extend(extra_examples)

        texts = [clean_text(desc) for desc, _ in data]
        labels = [cat for _, cat in data]

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                min_df=1,
                sublinear_tf=True,
                strip_accents="unicode",
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                C=2.0,
            )),
        ])
        self.pipeline.fit(texts, labels)

        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.pipeline, MODEL_PATH)

        return {
            "trained_examples": len(data),
            "categories": len(set(labels)),
        }

    # ---------------------------------------------------------------- #
    # Inference
    # ---------------------------------------------------------------- #
    def predict(self, descriptions: List[str]) -> List[Tuple[str, float]]:
        """Return a list of (category, confidence) for each description."""
        if self.pipeline is None:
            raise RuntimeError("Model not trained/loaded yet.")

        cleaned = [clean_text(d) for d in descriptions]
        probs = self.pipeline.predict_proba(cleaned)
        classes = self.pipeline.classes_

        results = []
        for raw_desc, cleaned_desc, prob_row in zip(descriptions, cleaned, probs):
            best_idx = prob_row.argmax()
            category = classes[best_idx]
            confidence = float(prob_row[best_idx])

            if confidence < CONFIDENCE_THRESHOLD:
                rule_match = self._keyword_fallback(raw_desc)
                if rule_match:
                    category, confidence = rule_match, max(confidence, 0.5)

            results.append((category, confidence))

        return results

    @staticmethod
    def _keyword_fallback(description: str) -> str | None:
        upper = description.upper()
        for category, keywords in KEYWORD_RULES.items():
            if any(kw in upper for kw in keywords):
                return category
        return None
