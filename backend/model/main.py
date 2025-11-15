import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import uvicorn

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "diagnosis_model.pkl")
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "..", "data")

TRAINING_PATH = os.path.join(DATA_DIR, "Training.csv")
TESTING_PATH = os.path.join(DATA_DIR, "Testing.csv")

try:
    model, symptom_to_index, symptom_names = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Error loading model: {e}")

try:
    training_data = pd.read_csv(TRAINING_PATH)
    testing_data = pd.read_csv(TESTING_PATH)
except:
    training_data = None
    testing_data = None

app = FastAPI(title="AI Diagnostic Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    symptoms: List[str]

@app.get("/")
def root():
    return {"status": "✅ API running", "endpoints": ["GET /symptoms", "POST /predict"]}

@app.get("/symptoms")
def get_symptoms():
    return {"symptoms": list(symptom_to_index.keys())}

@app.post("/predict")
def predict_disease(input_data: SymptomInput):
    try:
        input_symptoms = [s.lower().strip().replace(' ', '_') for s in input_data.symptoms]
        feature_vector = [0] * len(symptom_names)

        for symptom in input_symptoms:
            if symptom in symptom_to_index:
                feature_vector[symptom_to_index[symptom]] = 1

        prediction = model.predict([feature_vector])[0]
        confidence = round(max(model.predict_proba([feature_vector])[0]), 4)

        matched_symptoms = [s for s in input_symptoms if s in symptom_to_index]
        unmatched_symptoms = [s for s in input_symptoms if s not in symptom_to_index]

        references = []
        if training_data is not None:
            train_count = len(training_data[training_data['prognosis'] == prediction])
            if train_count:
                references.append({"source": "Training Dataset", "count": train_count})

        if testing_data is not None:
            test_count = len(testing_data[testing_data['prognosis'] == prediction])
            if test_count:
                references.append({"source": "Testing Dataset", "count": test_count})

        return {
            "predicted_disease": prediction,
            "confidence": confidence,
            "matched_symptoms": matched_symptoms,
            "unmatched_symptoms": unmatched_symptoms,
            "dataset_references": references
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
