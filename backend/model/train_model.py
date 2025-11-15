import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# === Step 1: Load Training & Testing Data ===
train_df = pd.read_csv('../../data/Training.csv')
test_df = pd.read_csv('../../data/Testing.csv')

print(f"Training data shape: {train_df.shape}")
print(f"Testing data shape: {test_df.shape}")

train_df = train_df.loc[:, ~train_df.columns.str.contains('^Unnamed')]
test_df = test_df.loc[:, ~test_df.columns.str.contains('^Unnamed')]

X_train = train_df.drop(columns=['prognosis'])
y_train = train_df['prognosis']

X_test = test_df.drop(columns=['prognosis'])
y_test = test_df['prognosis']

print(f"Features: {X_train.shape[1]} symptoms")
print(f"Diseases in training: {y_train.nunique()}")

# === Step 2: Train Model ===
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# === Step 3: Evaluate Model ===
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# === Step 4: Save Model ===
symptom_names = X_train.columns.tolist()
symptom_to_index = {symptom: idx for idx, symptom in enumerate(symptom_names)}

os.makedirs("../model", exist_ok=True)
joblib.dump((model, symptom_to_index, symptom_names), "../model/diagnosis_model.pkl")

print("Model and symptom mapping saved successfully ✅")

# Optional Debug:
print("\nExample Predictions:")
for i in range(min(5, len(y_test))):
    print(f"Actual: {y_test.iloc[i]} | Predicted: {y_pred[i]}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))
