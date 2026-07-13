"""
Text cleaning for raw bank transaction descriptions.

Bank labels are noisy: "CB CARREFOUR MONTPELLIER 12/03 REF88231" — dates,
reference numbers and card codes are near-unique tokens that add noise to
TF-IDF rather than signal, so they're stripped before vectorization.
"""

import re

_DATE_PATTERN = re.compile(r"\b\d{1,2}[/\-]\d{1,2}(?:[/\-]\d{2,4})?\b")
_REF_PATTERN = re.compile(r"\b(?:REF|N°|NO|NUM)\S*\b", re.IGNORECASE)
_LONG_DIGIT_PATTERN = re.compile(r"\b\d{4,}\b")
_NON_ALPHANUM_PATTERN = re.compile(r"[^A-ZÀ-Ÿ0-9\s]")
_WHITESPACE_PATTERN = re.compile(r"\s+")


def clean_text(text: str) -> str:
    """Normalize a raw transaction description for the ML pipeline."""
    if not text:
        return ""

    cleaned = text.upper()
    cleaned = _DATE_PATTERN.sub(" ", cleaned)
    cleaned = _REF_PATTERN.sub(" ", cleaned)
    cleaned = _LONG_DIGIT_PATTERN.sub(" ", cleaned)
    cleaned = _NON_ALPHANUM_PATTERN.sub(" ", cleaned)
    cleaned = _WHITESPACE_PATTERN.sub(" ", cleaned).strip()
    return cleaned
