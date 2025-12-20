
# Symptomate — AI Diagnostic Assistant

![React](https://img.shields.io/badge/Frontend-React_18-blue?logo=react)
![Python](https://img.shields.io/badge/Backend-FastAPI_%26_Scikit--Learn-green?logo=python)
![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?logo=tailwind-css)

**Symptomate** is a clinical decision-support prototype designed to analyze patient symptoms using machine learning. It features an NLP-based symptom interpreter, a Neural Network (MLP) classification model, and a rule-based safety layer to identify critical medical conditions.

> **⚠️ Disclaimer:** This system is for educational and decision-support purposes only. It is **not** a replacement for professional medical diagnosis.

---

## ✨ Key Features

* **🧠 Neural Network Inference**: Uses a Multi-Layer Perceptron (MLP) classifier trained on clinical symptom datasets.
* **🗣️ NLP Symptom Interpreter**: Includes a custom TF-IDF vectorizer to handle typos and interpret non-standard symptom descriptions.
* **🛡️ Clinical Safety Logic**:
    * **Critical Alerts**: Automatically flags high-risk conditions (e.g., Heart Attack, Pneumonia).
    * **Confidence Gating**: Flags low-confidence predictions (<45%) as "Uncertain/Inconclusive".
* **⚡ High Performance**: Lightweight, single-file backend with no external API dependencies.

---

## 🛠️ Tech Stack

### **Backend**
* **FastAPI**: High-performance API layer.
* **Scikit-learn**: MLPClassifier for disease prediction.
* **Pandas/NumPy**: Data manipulation and vectorization.

### **Frontend**
* **React.js**: Component-based UI.
* **Tailwind CSS**: Modern styling with custom gradients and shadow effects.
* **React Select**: Searchable dropdowns for symptom input.

---

## 📂 Project Structure

```text
AI-Diagnostic-Assistant/
├── README.md
├── backend/
│   ├── requirements.txt            Python dependencies
│   └── model/
│       ├── main.py                 Main application (API + Logic)
│       ├── train_model.py         Script to retrain model manually
│       ├── diagnosis_model.pkl    Serialized trained model
│       ├── Training.csv           Training dataset
│       └── Testing.csv            Testing dataset
└── frontend/
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── index.css 
        ├── index.js
        └── components/
            ├── SymptomForm.jsx    
            Main symptom input card
            └── PredictionDetails.jsx 
         Diagnosis result display

```

---

## 🚀 Installation & Setup

### 1. Backend Setup (Python)

The backend code and data live in the `backend/model` directory.

```bash
# Navigate to backend
cd backend

# Create virtual environment (Optional but recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Navigate to the model directory to run the app
cd model

# Run the server
# The app will look for Training.csv in the current directory
python main.py

```

*Server will start at `http://localhost:3000` (or the port defined in `main.py`).*

### 2. Frontend Setup (React)

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

```

*Client will run at `http://localhost:3000` (If port 3000 is taken by Python, React will usually ask to run on 3001).*

---

## 🔌 API Endpoints

### `POST /predict`

Accepts a list of symptoms and returns a diagnosis with confidence scores and safety alerts.

**Request:**

```json
{
  "symptoms": ["chest pain", "vomiting", "sweating"]
}

```

**Response:**

```json
{
  "diagnosis": "Heart Attack",
  "confidence": 0.92,
  "alert_level": "critical",
  "treatments": [
    "Immediate medical evaluation is required.",
    "Proceed to the nearest emergency medical facility."
  ],
  "ai_corrections": [],
  "disclaimer": "This output is for decision support only..."
}

```

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewAlgorithm`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
