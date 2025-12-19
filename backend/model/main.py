import os
import joblib
import pandas as pd
import numpy as np
import uvicorn
import logging
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- AI Libraries ---
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --- Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MedicalAI")

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "..", "data")
MODEL_PATH = os.path.join(SCRIPT_DIR, "diagnosis_model.pkl")
TRAINING_CSV = os.path.join(DATA_DIR, "Training.csv")
PRECAUTION_CSV = os.path.join(DATA_DIR, "symptom_precaution.csv")

# --- 1. TREATMENT LOADER (Case-Insensitive) ---
def load_treatment_database():
    treatment_db = {}
    if not os.path.exists(PRECAUTION_CSV):
        logger.warning(f"⚠️ Precaution CSV not found at {PRECAUTION_CSV}")
        return treatment_db

    try:
        df = pd.read_csv(PRECAUTION_CSV)
        for _, row in df.iterrows():
            # Force Title Case to match model output (e.g. "heart attack" -> "Heart Attack")
            disease = str(row['Disease']).strip().title()
            precautions = [
                str(row[col]).strip().title() 
                for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4'] 
                if pd.notna(row[col])
            ]
            treatment_db[disease] = precautions
        logger.info(f"✅ Loaded treatments for {len(treatment_db)} diseases.")
    except Exception as e:
        logger.error(f"❌ Error loading CSV: {e}")
    
    return treatment_db

TREATMENT_DATABASE = load_treatment_database()

# --- 2. CRITICAL CONDITIONS LIST (Must Match Title Case) ---
CRITICAL_CONDITIONS = [
    "Heart Attack", "Pneumonia", "Tuberculosis", "Typhoid", 
    "Malaria", "Dengue", "Covid-19", "Hepatitis B", "Hepatitis C", 
    "Hepatitis D", "Hepatitis E", "Alcoholic Hepatitis", 
    "Paralysis (Brain Hemorrhage)", "Gastroenteritis", "Diabetes"
]

# --- 3. AI NLP BRAIN (Typo Fixer) ---
class MedicalLanguageEncoder:
    def __init__(self, vocabulary: List[str]):
        self.vocabulary = vocabulary
        if not vocabulary:
            self.vectorizer = None
            return
        # 'char_wb' helps with partial word matches (typos)
        self.vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4))
        self.vectorizer.fit(self.vocabulary)
        self.vocab_vectors = self.vectorizer.transform(self.vocabulary)

    def interpret(self, user_text: str, threshold=0.35):
        if not self.vectorizer: return None, 0.0
        user_vec = self.vectorizer.transform([user_text])
        similarities = cosine_similarity(user_vec, self.vocab_vectors)
        best_idx = similarities.argmax()
        confidence = similarities[0, best_idx]
        if confidence >= threshold:
            return self.vocabulary[best_idx], round(confidence, 2)
        return None, 0.0

# --- 4. MODEL LOADING/TRAINING ---
def load_or_train_model():
    # Try loading existing model
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except: pass
    
    # Train if missing
    print("🧠 Training AI Model...")
    try:
        if not os.path.exists(TRAINING_CSV):
            print(f"❌ Error: {TRAINING_CSV} not found!")
            return None, {}, []

        df = pd.read_csv(TRAINING_CSV)
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]
        
        symptom_names = list(X.columns)
        symptom_map = {name.lower().strip().replace(' ', '_'): i for i, name in enumerate(symptom_names)}

        # Neural Network
        model = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
        model.fit(X, y)
        
        joblib.dump((model, symptom_map, symptom_names), MODEL_PATH)
        return model, symptom_map, symptom_names
    except Exception as e:
        print(f"❌ Training failed: {e}")
        return None, {}, []

model, symptom_to_index, symptom_names = load_or_train_model()
nlp_brain = MedicalLanguageEncoder(list(symptom_to_index.keys())) if symptom_to_index else None

# --- API SETUP ---
app = FastAPI(title="Medical AI Diagnostic System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputPayload(BaseModel):
    symptoms: List[str]

@app.post("/predict")
def predict(payload: InputPayload):
    if not model: raise HTTPException(status_code=503, detail="AI Offline")

    # 1. NLP Interpretation (Clean Input)
    active_features = []
    ai_log = []
    
    for text in payload.symptoms:
        clean = text.lower().strip().replace(' ', '_')
        if clean in symptom_to_index:
            active_features.append(clean)
        else:
            match, conf = nlp_brain.interpret(text)
            if match:
                active_features.append(match)
                ai_log.append({"original": text, "interpreted": match, "confidence": f"{int(conf*100)}%"})

    active_features = list(set(active_features))

    # Handle empty valid input
    if not active_features:
        return {
            "diagnosis": "Unknown",
            "confidence": 0.0,
            "alert_level": "uncertain",
            "treatments": ["Please provide more specific symptoms."],
            "ai_corrections": []
        }

    # 2. Prediction Logic
    vector = [0] * len(symptom_names)
    for s in active_features:
        vector[symptom_to_index[s]] = 1
    
    raw_prediction = model.predict([vector])[0]
    # FORCE TITLE CASE (Fixes "heart attack" vs "Heart Attack" mismatch)
    prediction = str(raw_prediction).strip().title()
    
    probs = model.predict_proba([vector])[0]
    confidence_score = round(max(probs), 4)

    # 3. INTELLIGENT ALERT LOGIC (Traffic Light System)
    alert_level = "safe"  # Default to Green
    
    # Check 1: Is it a dangerous disease? (RED)
    if prediction in CRITICAL_CONDITIONS:
        alert_level = "critical"
    
    # Check 2: Is the AI confused/unsure? (YELLOW)
    # This prevents "Acne" (19%) from becoming a Critical Alert
    elif confidence_score < 0.45:
        alert_level = "uncertain"

    # 4. FETCH TREATMENTS BASED ON ALERT LEVEL
    if alert_level == "critical":
        treatments = [
            "⚠️ IMMEDIATE MEDICAL ATTENTION REQUIRED",
            "Visit the nearest hospital emergency room.",
            "Do not rely on home remedies.",
            "Monitor vital signs (Pulse, Breathing)."
        ]
    elif alert_level == "uncertain":
        treatments = [
            "⚠️ Diagnosis is unclear (Low Confidence).",
            "Please consult a General Physician for accurate diagnosis.",
            "Do not take medication without a prescription.",
            "Monitor symptoms closely."
        ]
    else:
        # Green / Safe Mode -> Fetch from CSV
        treatments = TREATMENT_DATABASE.get(prediction, ["Consult a doctor", "Rest and hydration"])

    # Debug Log
    print(f"🔍 DEBUG: {prediction} | Conf: {confidence_score} | Alert: {alert_level}")

    return {
        "diagnosis": prediction,
        "confidence": confidence_score,
        "alert_level": alert_level,  # 'safe', 'uncertain', or 'critical'
        "treatments": treatments,
        "ai_corrections": ai_log
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)