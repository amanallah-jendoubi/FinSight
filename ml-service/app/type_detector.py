"""
Income vs expense type detection — used only when Express doesn't already
know the type (type == "" in the request, e.g. for CSV formats without a
usable debit/credit signal).

Priority order:
1. Text heuristics — keyword lists for strong income/expense signals.
2. Default to "expense" when genuinely ambiguous: in personal finance data,
   the large majority of transactions are expenses, so this is the safer
   default than a coin flip.

This is heuristic, not ML — there's no labeled income/expense dataset yet.
If you start collecting real examples, revisit this as a small binary
TF-IDF classifier instead. If a future CSV format *does* give you a
reliable signed amount, that's a stronger signal than any of this — worth
wiring in as a priority-0 check ahead of the keyword heuristics below.
"""

from typing import Tuple

INCOME_KEYWORDS = {
    "SALAIRE", "SALARY", "PAIE", "PAYROLL", "HONORAIRES", "REMUNERATION",
    "REMBOURSEMENT", "REFUND", "DIVIDENDE", "DIVIDEND", "INTERET CREDITEUR",
    "PRIME", "BONUS", "VIR RECU", "VIREMENT RECU", "VIREMENT ENTRANT",
    "LOYER RECU", "ALLOCATION", "PENSION", "BOURSE ETUDE",
}

# Mechanics that almost always mean money is leaving the account.
EXPENSE_STRONG_KEYWORDS = {
    "CB", "ACHAT", "PAIEMENT", "PAYMENT", "PRLV", "PRELEVEMENT", "RETRAIT",
    "POS", "ATM", "DAB", "ABONNEMENT",
}

DEFAULT_CONFIDENCE_ON_GUESS = 0.5
KEYWORD_MATCH_CONFIDENCE = 0.85


def detect_type(description: str) -> Tuple[str, float]:
    """Returns (type, confidence) where type is 'income' or 'expense'."""
    upper = (description or "").upper()

    if any(kw in upper for kw in INCOME_KEYWORDS):
        return "income", KEYWORD_MATCH_CONFIDENCE

    if any(kw in upper for kw in EXPENSE_STRONG_KEYWORDS):
        return "expense", KEYWORD_MATCH_CONFIDENCE

    return "expense", DEFAULT_CONFIDENCE_ON_GUESS
