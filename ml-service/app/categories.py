"""
Fixed category taxonomy for FinSight.

The classifier is ALWAYS trained on exactly these labels, so scikit-learn's
LogisticRegression can never predict a category outside this list — its
`classes_` attribute is derived directly from the training labels.
"""

CATEGORIES = [
    "Transport",
    "Food",
    "Entertainment",
    "Housing",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Education",
    "Insurance",
    "Personal Care",
    "Gifts & Donations",
    "Travel",
    "Groceries",
    "Restaurants",
    "Coffee Shops",
    "Gas & Fuel",
    "Rent",
    "Electricity",
    "Water",
    "Internet",
    "Phone",
    "Streaming Services",
    "Gym Membership",
    "Clothing",
    "Books",
    "Tuition",
    "Health Insurance",
    "Car Insurance",
    "Home Insurance",
    "Savings",
    "Investments",
    "Taxes",
]

# Used only as a fallback when the model's confidence is below
# CONFIDENCE_THRESHOLD (see model.py). Keep these lists short and
# high-precision — they are a safety net, not a substitute for training data.
KEYWORD_RULES = {
    "Groceries": ["CARREFOUR", "MONOPRIX", "GEANT", "AZIZA", "MG", "MAGASIN GENERAL", "SUPERMARCHE"],
    "Restaurants": ["RESTAURANT", "MCDONALD", "KFC", "PIZZA", "TACOS", "BURGER"],
    "Coffee Shops": ["CAFE", "COFFEE", "STARBUCKS", "GOURMET", "PATISSERIE"],
    "Gas & Fuel": ["STATION", "SHELL", "TOTAL", "OIL LIBYA", "AGIL", "STAR ", "CARBURANT"],
    "Transport": ["SNCF", "TAXI", "BOLT", "UBER", "METRO", "BUS", "TRANSTU", "SOTREGAMES"],
    "Rent": ["LOYER", "RENT"],
    "Electricity": ["STEG", "ELECTRICITE", "EDF"],
    "Water": ["SONEDE", "EAU"],
    "Internet": ["TOPNET", "OOREDOO INTERNET", "ADSL", "FIBRE", "ORANGE INTERNET"],
    "Phone": ["OOREDOO", "ORANGE TN", "TUNISIE TELECOM", "TELECOM", "RECHARGE"],
    "Streaming Services": ["NETFLIX", "SPOTIFY", "DISNEY", "YOUTUBE PREMIUM", "OSN"],
    "Gym Membership": ["GYM", "FITNESS", "MUSCULATION", "SALLE DE SPORT"],
    "Clothing": ["ZARA", "H&M", "MANGO", "LC WAIKIKI", "VETEMENT"],
    "Books": ["LIBRAIRIE", "BOOK", "AMAZON BOOKS"],
    "Tuition": ["SCOLARITE", "UNIVERSITE", "ECOLE", "TUITION", "INSAT"],
    "Health Insurance": ["ASSURANCE SANTE", "CNAM", "HEALTH INSURANCE"],
    "Car Insurance": ["ASSURANCE AUTO", "CAR INSURANCE", "STAR ASSURANCE"],
    "Home Insurance": ["ASSURANCE HABITATION", "HOME INSURANCE"],
    "Healthcare": ["PHARMACIE", "CLINIQUE", "DOCTEUR", "HOPITAL", "MEDECIN", "LABORATOIRE"],
    "Taxes": ["IMPOT", "TAXE", "TVA", "DGI"],
    "Savings": ["EPARGNE", "SAVINGS", "LIVRET"],
    "Investments": ["BOURSE", "INVESTMENT", "PORTEFEUILLE", "TRADING", "ACTIONS"],
    "Travel": ["HOTEL", "BOOKING.COM", "AIRBNB", "TUNISAIR", "AEROPORT", "FLIGHT"],
    "Personal Care": ["COIFFEUR", "SALON", "SPA", "ESTHETIQUE"],
    "Gifts & Donations": ["DON", "DONATION", "CADEAU", "CHARITY", "ASSOCIATION"],
}
