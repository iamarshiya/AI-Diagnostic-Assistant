"""
Medical AI Diagnostic System
----------------------------
Single-file clinical decision-support prototype.

Layers:
1. Configuration & Paths
2. Medical Knowledge (critical rules, treatments)
3. NLP Interpretation (symptom normalization)
4. ML Inference (prediction & confidence)
5. Safety & Alert Logic
6. API Layer (FastAPI)

DISCLAIMER:
This system is for decision support only and does NOT replace
professional medical diagnosis or treatment.
"""

# ===============================
# 1. IMPORTS & CONFIGURATION
# ===============================

import os
import joblib
import pandas as pd
import numpy as np
import uvicorn
import logging
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- AI Libraries ---
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MedicalAI")

# ===============================
# 2. PATHS & DATA SOURCES
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

MODEL_PATH = os.path.join(BASE_DIR, "diagnosis_model.pkl")
TRAINING_CSV = os.path.join(DATA_DIR, "Training.csv")
PRECAUTION_CSV = os.path.join(DATA_DIR, "symptom_precaution.csv")

# ===============================
# 3. MEDICAL KNOWLEDGE BASE
# ===============================

CRITICAL_CONDITIONS = [
    "Heart Attack", "Pneumonia", "Tuberculosis", "Typhoid",
    "Malaria", "Dengue", "Covid-19", "Hepatitis B",
    "Hepatitis C", "Hepatitis D", "Hepatitis E",
    "Alcoholic Hepatitis", "Paralysis (Brain Hemorrhage)",
    "Gastroenteritis", "Diabetes"
]

def load_treatment_database():
    treatments = {}
    if not os.path.exists(PRECAUTION_CSV):
        logger.warning("Precaution database not found.")
        return treatments

    df = pd.read_csv(PRECAUTION_CSV)
    for _, row in df.iterrows():
        disease = str(row["Disease"]).strip().title()
        precautions = [
            str(row[col]).strip().title()
            for col in ["Precaution_1", "Precaution_2", "Precaution_3", "Precaution_4"]
            if pd.notna(row[col])
        ]
        treatments[disease] = precautions

    logger.info(f"Loaded treatments for {len(treatments)} conditions.")
    return treatments

TREATMENT_DATABASE = load_treatment_database()

# ===============================
# 4. NLP SYMPTOM INTERPRETER
# ===============================

class MedicalLanguageEncoder:
    """
    Handles typo tolerance and fuzzy symptom matching.
    """

    def __init__(self, vocabulary: List[str]):
        self.vocabulary = vocabulary
        self.vectorizer = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
        self.vectorizer.fit(vocabulary)
        self.vocab_vectors = self.vectorizer.transform(vocabulary)

    def interpret(self, text: str, threshold: float = 0.35):
        vector = self.vectorizer.transform([text])
        similarities = cosine_similarity(vector, self.vocab_vectors)
        idx = similarities.argmax()
        confidence = similarities[0, idx]

        if confidence >= threshold:
            return self.vocabulary[idx], round(confidence, 2)
        return None, 0.0

# ===============================
# 5. MODEL LOADING / TRAINING
# ===============================

def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        logger.info("Loading trained model.")
        return joblib.load(MODEL_PATH)

    logger.info("Training new AI model.")

    if not os.path.exists(TRAINING_CSV):
        raise RuntimeError("Training dataset not found.")

    df = pd.read_csv(TRAINING_CSV)
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    symptom_names = list(X.columns)
    symptom_index = {
        name.lower().replace(" ", "_"): i
        for i, name in enumerate(symptom_names)
    }

    model = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        max_iter=500,
        random_state=42
    )
    model.fit(X, y)

    joblib.dump((model, symptom_index, symptom_names), MODEL_PATH)
    return model, symptom_index, symptom_names

model, symptom_to_index, symptom_names = load_or_train_model()
nlp_brain = MedicalLanguageEncoder(list(symptom_to_index.keys()))

# ===============================
# 6. SAFETY & CLINICAL LOGIC
# ===============================

def determine_alert_level(diagnosis: str, confidence: float) -> str:
    if diagnosis in CRITICAL_CONDITIONS:
        return "critical"
    if confidence < 0.45:
        return "uncertain"
    return "safe"

def get_treatment_plan(diagnosis: str, alert_level: str):
    if alert_level == "critical":
        return [
            "Immediate medical evaluation is required.",
            "Proceed to the nearest emergency medical facility.",
            "Avoid self-medication.",
            "Continuous monitoring of vital signs is advised."
        ]
    if alert_level == "uncertain":
        return [
            "Diagnosis confidence is low.",
            "Consult a licensed medical practitioner.",
            "Avoid medication without prescription.",
            "Observe and document symptom progression."
        ]
    return TREATMENT_DATABASE.get(
        diagnosis,
        ["Medical consultation is advised.", "Adequate rest and hydration recommended."]
    )

# ===============================
# 7. FASTAPI APPLICATION
# ===============================

app = FastAPI(title="Medical AI Diagnostic System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputPayload(BaseModel):
    symptoms: List[str]

@app.post("/predict")
def predict(payload: InputPayload):
    if not model:
        raise HTTPException(status_code=503, detail="AI system unavailable.")

    active_symptoms = []
    ai_corrections = []

    for symptom in payload.symptoms:
        clean = symptom.lower().replace(" ", "_")
        if clean in symptom_to_index:
            active_symptoms.append(clean)
        else:
            match, conf = nlp_brain.interpret(symptom)
            if match:
                active_symptoms.append(match)
                ai_corrections.append({
                    "original": symptom,
                    "interpreted": match,
                    "confidence": f"{int(conf * 100)}%"
                })

    active_symptoms = list(set(active_symptoms))

    if not active_symptoms:
        return {
            "diagnosis": "Unknown",
            "confidence": 0.0,
            "alert_level": "uncertain",
            "treatments": ["Insufficient symptom data provided."],
            "ai_corrections": [],
            "disclaimer": "This output is for decision support only."
        }

    vector = np.zeros(len(symptom_names))
    for s in active_symptoms:
        vector[symptom_to_index[s]] = 1

    prediction_raw = model.predict(vector.reshape(1, -1))[0]
    prediction = str(prediction_raw).title()

    probabilities = model.predict_proba(vector.reshape(1, -1))[0]
    confidence_score = round(float(probabilities.max()), 4)

    alert_level = determine_alert_level(prediction, confidence_score)
    treatments = get_treatment_plan(prediction, alert_level)

    logger.info(f"Diagnosis={prediction} Confidence={confidence_score} Alert={alert_level}")

    return {
        "diagnosis": prediction,
        "confidence": confidence_score,
        "alert_level": alert_level,
        "treatments": treatments,
        "ai_corrections": ai_corrections,
        "disclaimer": "This output is for decision support only and not a medical diagnosis."
    }

# ===============================
# 8. ENTRY POINT
# ===============================

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
