"""
Train (or retrain) the model from the command line and persist it to
data/model.joblib, without needing the API running.

Usage:
    python train.py
"""

from app.model import CategoryModel

if __name__ == "__main__":
    model = CategoryModel(auto_load=False)
    stats = model.train()
    print(f"Trained on {stats['trained_examples']} examples across {stats['categories']} categories.")
    print("Model saved to data/model.joblib")
