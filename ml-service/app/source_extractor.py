"""
Heuristic "source" extraction — who the money came from or went to.

This is intentionally rule-based rather than ML-based: there's no labeled
dataset for source extraction yet, and merchant/employer names are proper
nouns that a small TF-IDF model trained on ~250 seed rows would generalize
to poorly. This heuristic strips transaction-type boilerplate (VIR, CB,
PRLV...), dates, and reference numbers, then treats whatever remains as the
counterparty name. It's a v1 — swap in a proper NER approach once you have
enough real, corrected transactions to justify it.
"""

import re

_DATE_PATTERN = re.compile(r"\b\d{1,2}[/\-]\d{1,2}(?:[/\-]\d{2,4})?\b")
_REF_PATTERN = re.compile(r"\b(?:REF|N°|NO|NUM)\S*\b", re.IGNORECASE)
_LONG_DIGIT_PATTERN = re.compile(r"\b\d{4,}\b")
_NON_ALPHANUM_PATTERN = re.compile(r"[^A-ZÀ-Ÿ0-9\s]")

# Transaction mechanics — not part of who the counterparty is.
_TRANSACTION_TYPE_WORDS = {
    "VIR", "VIREMENT", "VIREMENTS", "SEPA", "CB", "CARTE", "PRLV",
    "PRELEVEMENT", "ACHAT", "PAIEMENT", "PAYMENT", "RETRAIT", "TRANSFER",
    "TRANSFERT", "POS", "ATM", "DAB", "ECOM", "VAD", "REMISE", "CHEQUE",
    "CHQ", "INT", "INTERNATIONAL", "OP", "OPERATION", "OF",
}

# Signals that this transaction is income (salary/fees paid to the user),
# so the "source" is an employer/payer rather than a merchant.
_INCOME_HINTS = {"SALAIRE", "SALARY", "PAIE", "PAYROLL", "HONORAIRES", "REMUNERATION", "SAL"}

_MAX_SOURCE_TOKENS = 4


def extract_source(description: str) -> str:
    """Return a best-guess counterparty name (employer, merchant, payer)."""
    if not description:
        return "Unknown"

    upper = description.upper()
    cleaned = _DATE_PATTERN.sub(" ", upper)
    cleaned = _REF_PATTERN.sub(" ", cleaned)
    cleaned = _LONG_DIGIT_PATTERN.sub(" ", cleaned)
    cleaned = _NON_ALPHANUM_PATTERN.sub(" ", cleaned)

    tokens = [t for t in cleaned.split() if len(t) > 1]
    is_income = any(hint in tokens for hint in _INCOME_HINTS)

    filtered = [
        t for t in tokens
        if t not in _TRANSACTION_TYPE_WORDS and t not in _INCOME_HINTS
    ]

    if not filtered:
        return "Employer" if is_income else "Unknown"

    source = " ".join(w.capitalize() for w in filtered[:_MAX_SOURCE_TOKENS])
    return source
