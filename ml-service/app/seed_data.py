"""
Seed training set for cold start.

Real FinSight users won't have any corrected transactions on day one, so the
model ships pre-trained on this hand-written set of realistic French/
Tunisian + English bank labels. It's deliberately broad rather than deep —
a handful of examples per category so TF-IDF has vocabulary to work with.

Replace / extend this with real corrected transactions over time (see the
/train endpoint) — seed data is a starting point, not a permanent dataset.
Each tuple is (raw_description, category). Category values MUST come from
app.categories.CATEGORIES.
"""

SEED_DATA = [
    # Transport
    ("SNCF VOYAGES REF88231", "Transport"),
    ("BOLT TRIP TUNIS 14/03", "Transport"),
    ("UBER TRIP PARIS", "Transport"),
    ("TRANSTU METRO LEGER", "Transport"),
    ("SOTREGAMES BUS ABONNEMENT", "Transport"),
    ("TAXI COURSE CENTRE VILLE", "Transport"),
    ("RATP NAVIGO RECHARGE", "Transport"),

    # Food (generic / unspecified food, not clearly groceries or restaurant)
    ("PAIEMENT CB SNACK LE DELICE", "Food"),
    ("ACHAT ALIMENTATION GENERALE", "Food"),
    ("CB FOOD TRUCK TUNIS", "Food"),
    ("PATISSERIE GOURMANDISE", "Food"),
    ("BOULANGERIE DU COIN", "Food"),

    # Entertainment
    ("CINEMA PATHE GAUMONT", "Entertainment"),
    ("BILLETTERIE CONCERT", "Entertainment"),
    ("STEAM GAMES PURCHASE", "Entertainment"),
    ("PLAYSTATION STORE", "Entertainment"),
    ("PARC ATTRACTIONS CARTHAGELAND", "Entertainment"),
    ("BOWLING TUNIS CITY", "Entertainment"),

    # Housing (general, not rent/utilities specifically)
    ("SYNDIC COPROPRIETE CHARGES", "Housing"),
    ("MOBILIER MAISON IKEA", "Housing"),
    ("QUINCAILLERIE BRICOLAGE", "Housing"),
    ("REPARATION PLOMBERIE", "Housing"),
    ("TRAVAUX RENOVATION APPARTEMENT", "Housing"),

    # Utilities (general, when not clearly electricity/water/internet/phone)
    ("FACTURE SERVICES PUBLICS", "Utilities"),
    ("ABONNEMENT GAZ NATUREL", "Utilities"),
    ("REDEVANCE ORDURES MENAGERES", "Utilities"),

    # Healthcare
    ("PHARMACIE CENTRALE TUNIS", "Healthcare"),
    ("CLINIQUE HANNIBAL CONSULTATION", "Healthcare"),
    ("DOCTEUR BEN SALEM CABINET", "Healthcare"),
    ("LABORATOIRE ANALYSES MEDICALES", "Healthcare"),
    ("HOPITAL CHARLES NICOLLE", "Healthcare"),
    ("DENTISTE CONSULTATION", "Healthcare"),

    # Shopping (general retail, not clothing/books specifically)
    ("AMAZON.FR ACHAT DIVERS", "Shopping"),
    ("CB FNAC ELECTRONIQUE", "Shopping"),
    ("CARTE JUMBO ELECTROMENAGER", "Shopping"),
    ("ACHAT EN LIGNE ALIEXPRESS", "Shopping"),
    ("MAGASIN DECATHLON SPORT", "Shopping"),
    ("CB DARTY HIGH TECH", "Shopping"),

    # Education (general, not tuition specifically)
    ("FORMATION EN LIGNE UDEMY", "Education"),
    ("COURS PARTICULIER MATHS", "Education"),
    ("CERTIFICATION COURSERA", "Education"),
    ("FOURNITURES SCOLAIRES PAPETERIE", "Education"),

    # Insurance (general, not health/car/home specifically)
    ("PRIME ASSURANCE VIE", "Insurance"),
    ("COTISATION ASSURANCE GROUPE", "Insurance"),
    ("ASSURANCE VOYAGE ANNUELLE", "Insurance"),

    # Personal Care
    ("COIFFEUR SALON BEAUTE", "Personal Care"),
    ("INSTITUT SPA MASSAGE", "Personal Care"),
    ("PHARMACIE COSMETIQUE SOINS", "Personal Care"),
    ("ESTHETICIENNE MANUCURE", "Personal Care"),
    ("PARFUMERIE SEPHORA", "Personal Care"),

    # Gifts & Donations
    ("DON ASSOCIATION CARITATIVE", "Gifts & Donations"),
    ("CADEAU ANNIVERSAIRE MARIAGE", "Gifts & Donations"),
    ("DONATION CROISSANT ROUGE", "Gifts & Donations"),
    ("VIR CADEAU NAISSANCE", "Gifts & Donations"),

    # Travel
    ("TUNISAIR BILLET AVION", "Travel"),
    ("BOOKING.COM RESERVATION HOTEL", "Travel"),
    ("AIRBNB SEJOUR LOCATION", "Travel"),
    ("AEROPORT TAXES VOYAGE", "Travel"),
    ("AGENCE VOYAGE PACKAGE TOUT INCLUS", "Travel"),
    ("LOCATION VOITURE SIXT", "Travel"),

    # Groceries
    ("CARREFOUR MARKET MONTPELLIER", "Groceries"),
    ("MONOPRIX LAFAYETTE TUNIS", "Groceries"),
    ("GEANT SUPERMARCHE ARIANA", "Groceries"),
    ("AZIZA HYPERMARCHE", "Groceries"),
    ("MAGASIN GENERAL MG COURSES", "Groceries"),
    ("MARCHE FRUITS LEGUMES", "Groceries"),
    ("CB SUPERETTE DU QUARTIER", "Groceries"),

    # Restaurants
    ("RESTAURANT LE BATEAU SOUS LE VENT", "Restaurants"),
    ("MCDONALD'S TUNIS MARINE", "Restaurants"),
    ("KFC LAC 2", "Restaurants"),
    ("PIZZA HUT LIVRAISON", "Restaurants"),
    ("RESTAURANT ITALIEN CENTRE VILLE", "Restaurants"),
    ("TACOS AVENUE COMMANDE", "Restaurants"),
    ("GLOVO LIVRAISON REPAS", "Restaurants"),

    # Coffee Shops
    ("STARBUCKS TUNIS CITY", "Coffee Shops"),
    ("CAFE DE PARIS TERRASSE", "Coffee Shops"),
    ("GOURMET COFFEE SHOP", "Coffee Shops"),
    ("PAUL CAFE PATISSERIE", "Coffee Shops"),
    ("CB CAFE COSTA COFFEE", "Coffee Shops"),

    # Gas & Fuel
    ("STATION TOTAL CARBURANT", "Gas & Fuel"),
    ("SHELL STATION SERVICE", "Gas & Fuel"),
    ("OIL LIBYA CARBURANT PLEIN", "Gas & Fuel"),
    ("AGIL STATION ESSENCE", "Gas & Fuel"),
    ("STAR OIL CARBURANT", "Gas & Fuel"),

    # Rent
    ("LOYER APPARTEMENT MENSUEL", "Rent"),
    ("VIR LOYER PROPRIETAIRE", "Rent"),
    ("RENT PAYMENT MONTHLY", "Rent"),
    ("LOYER STUDIO CENTRE VILLE", "Rent"),

    # Electricity
    ("STEG FACTURE ELECTRICITE", "Electricity"),
    ("PRLV STEG ELECTRICITE", "Electricity"),
    ("EDF FACTURE ENERGIE", "Electricity"),

    # Water
    ("SONEDE FACTURE EAU", "Water"),
    ("PRLV SONEDE CONSOMMATION EAU", "Water"),

    # Internet
    ("TOPNET ABONNEMENT INTERNET", "Internet"),
    ("OOREDOO INTERNET FIBRE", "Internet"),
    ("ORANGE INTERNET ADSL", "Internet"),
    ("PRLV TOPNET FIBRE OPTIQUE", "Internet"),

    # Phone
    ("OOREDOO RECHARGE MOBILE", "Phone"),
    ("ORANGE TN FACTURE TELEPHONE", "Phone"),
    ("TUNISIE TELECOM ABONNEMENT", "Phone"),
    ("RECHARGE CREDIT TELEPHONIQUE", "Phone"),

    # Streaming Services
    ("NETFLIX.COM ABONNEMENT MENSUEL", "Streaming Services"),
    ("SPOTIFY PREMIUM ABONNEMENT", "Streaming Services"),
    ("DISNEY PLUS SUBSCRIPTION", "Streaming Services"),
    ("YOUTUBE PREMIUM MONTHLY", "Streaming Services"),
    ("OSN STREAMING ABONNEMENT", "Streaming Services"),

    # Gym Membership
    ("SALLE DE SPORT FITNESS PARK", "Gym Membership"),
    ("ABONNEMENT GYM MUSCULATION", "Gym Membership"),
    ("BASIC FIT MONTHLY MEMBERSHIP", "Gym Membership"),
    ("CLUB SPORTIF COTISATION", "Gym Membership"),

    # Clothing
    ("ZARA ACHAT VETEMENTS", "Clothing"),
    ("H&M CB PAIEMENT", "Clothing"),
    ("MANGO BOUTIQUE VETEMENTS", "Clothing"),
    ("LC WAIKIKI ACHAT", "Clothing"),
    ("NIKE STORE CHAUSSURES", "Clothing"),

    # Books
    ("LIBRAIRIE AL KITAB", "Books"),
    ("AMAZON BOOKS KINDLE", "Books"),
    ("LIBRAIRIE CLAIREFONTAINE", "Books"),
    ("FNAC LIVRES ACHAT", "Books"),

    # Tuition
    ("SCOLARITE UNIVERSITE PRIVEE", "Tuition"),
    ("FRAIS INSCRIPTION INSAT", "Tuition"),
    ("TUITION FEE SEMESTER", "Tuition"),
    ("ECOLE PRIVEE FRAIS SCOLAIRES", "Tuition"),

    # Health Insurance
    ("CNAM COTISATION SANTE", "Health Insurance"),
    ("ASSURANCE SANTE COMPLEMENTAIRE", "Health Insurance"),
    ("STAR ASSURANCE MALADIE", "Health Insurance"),
    ("MUTUELLE SANTE COTISATION", "Health Insurance"),

    # Car Insurance
    ("ASSURANCE AUTO STAR", "Car Insurance"),
    ("GAT ASSURANCES VEHICULE", "Car Insurance"),
    ("PRIME ASSURANCE AUTOMOBILE", "Car Insurance"),
    ("CAR INSURANCE ANNUAL PREMIUM", "Car Insurance"),

    # Home Insurance
    ("ASSURANCE HABITATION APPARTEMENT", "Home Insurance"),
    ("HOME INSURANCE PREMIUM", "Home Insurance"),
    ("MULTIRISQUE HABITATION COTISATION", "Home Insurance"),

    # Savings
    ("VIR EPARGNE LIVRET A", "Savings"),
    ("TRANSFER TO SAVINGS ACCOUNT", "Savings"),
    ("EPARGNE PROGRAMMEE MENSUELLE", "Savings"),
    ("VIR COMPTE EPARGNE", "Savings"),

    # Investments
    ("ACHAT ACTIONS BOURSE TUNIS", "Investments"),
    ("VIR PORTEFEUILLE INVESTISSEMENT", "Investments"),
    ("TRADING PLATFORM DEPOSIT", "Investments"),
    ("SICAV SOUSCRIPTION", "Investments"),
    ("BVMT ORDRE ACHAT", "Investments"),

    # Taxes
    ("PAIEMENT IMPOT REVENU", "Taxes"),
    ("DGI TAXE FONCIERE", "Taxes"),
    ("TVA DECLARATION PAIEMENT", "Taxes"),
    ("TAX PAYMENT ANNUAL", "Taxes"),

    # Income-style examples so the source extractor's income heuristic has
    # matching category context (closest fit among the 32 given categories).
    ("VIR SALAIRE TEAMWILL GROUPE", "Savings"),
    ("VIREMENT SALAIRE EMPLOYEUR SOCIETE XYZ", "Savings"),
    ("PAYROLL DEPOSIT ACME CORP", "Savings"),
]
