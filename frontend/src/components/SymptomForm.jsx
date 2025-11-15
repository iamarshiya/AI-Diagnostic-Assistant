import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// Default symptom options
const DEFAULT_SYMPTOMS = [
  { value: 'itching', label: 'Itching' },
  { value: 'skin_rash', label: 'Skin Rash' },
  { value: 'nodal_skin_eruptions', label: 'Nodal Skin Eruptions' },
  { value: 'continuous_sneezing', label: 'Continuous Sneezing' },
  { value: 'shivering', label: 'Shivering' },
  { value: 'chills', label: 'Chills' },
  { value: 'joint_pain', label: 'Joint Pain' },
  { value: 'stomach_pain', label: 'Stomach Pain' },
  { value: 'acidity', label: 'Acidity' },
  { value: 'ulcers_on_tongue', label: 'Ulcers On Tongue' },
  { value: 'muscle_wasting', label: 'Muscle Wasting' },
  { value: 'vomiting', label: 'Vomiting' },
  { value: 'burning_micturition', label: 'Burning Micturition' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'cold_hands_and_feet', label: 'Cold Hands And Feet' },
  { value: 'mood_swings', label: 'Mood Swings' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'restlessness', label: 'Restlessness' },
  { value: 'lethargy', label: 'Lethargy' },
  { value: 'patches_in_throat', label: 'Patches In Throat' },
  { value: 'cough', label: 'Cough' },
  { value: 'high_fever', label: 'High Fever' },
  { value: 'breathlessness', label: 'Breathlessness' },
  { value: 'sweating', label: 'Sweating' },
  { value: 'headache', label: 'Headache' },
  { value: 'yellowish_skin', label: 'Yellowish Skin' },
  { value: 'dark_urine', label: 'Dark Urine' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'loss_of_appetite', label: 'Loss Of Appetite' },
  { value: 'back_pain', label: 'Back Pain' },
  { value: 'constipation', label: 'Constipation' },
  { value: 'abdominal_pain', label: 'Abdominal Pain' },
  { value: 'diarrhoea', label: 'Diarrhoea' },
  { value: 'mild_fever', label: 'Mild Fever' },
  { value: 'yellowing_of_eyes', label: 'Yellowing Of Eyes' },
  { value: 'swelled_lymph_nodes', label: 'Swelled Lymph Nodes' },
  { value: 'malaise', label: 'Malaise' },
  { value: 'blurred_and_distorted_vision', label: 'Blurred And Distorted Vision' },
  { value: 'phlegm', label: 'Phlegm' },
  { value: 'throat_irritation', label: 'Throat Irritation' },
  { value: 'redness_of_eyes', label: 'Redness Of Eyes' },
  { value: 'sinus_pressure', label: 'Sinus Pressure' },
  { value: 'runny_nose', label: 'Runny Nose' },
  { value: 'congestion', label: 'Congestion' },
  { value: 'chest_pain', label: 'Chest Pain' },
  { value: 'fast_heart_rate', label: 'Fast Heart Rate' },
  { value: 'dizziness', label: 'Dizziness' }
];

function SymptomForm() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  // Fetch symptoms from backend or use default
  useEffect(() => {
    setSymptomOptions(DEFAULT_SYMPTOMS);
    setLoadingSymptoms(false);

    const fetchSymptoms = async () => {
      try {
        const response = await fetch('/symptoms');
        if (response.ok) {
          const data = await response.json();
          if (data.symptoms?.length > 0) {
            const options = data.symptoms.map(symptom => ({
              value: symptom,
              label: symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            }));
            setSymptomOptions(options);
          }
        }
      } catch (err) {
        console.error('Error fetching symptoms:', err);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSymptomChange = (selectedOptions) => {
    setSelectedSymptoms(selectedOptions || []);
    setPrediction(null);
    setError(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    const symptoms = selectedSymptoms.map(s => s.value);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data);
      } else {
        setError(data.detail || 'Prediction failed');
      }
    } catch (err) {
      setError('Backend not reachable. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Symptom Analysis</h2>

      <div className="form-group">
        <label className="form-label">Select Your Symptoms:</label>
        {loadingSymptoms ? (
          <div>Loading symptoms...</div>
        ) : (
          <Select
            isMulti
            value={selectedSymptoms}
            onChange={handleSymptomChange}
            options={symptomOptions}
            placeholder="Type to search symptoms..."
            className="symptom-select"
            classNamePrefix="select"
          />
        )}
      </div>

      <div className="button-group">
        <button
          onClick={handlePredict}
          disabled={loading || selectedSymptoms.length === 0}
          className={loading || selectedSymptoms.length === 0 ? 'button-disabled' : 'button-primary'}
        >
          {loading ? 'Analyzing...' : 'Predict Disease'}
        </button>
      </div>

      {prediction && (
  <div className="prediction-result">
    <h3 className="result-title">Prediction Result:</h3>
    <p className="result-detail">
      <strong>Predicted Disease:</strong> {prediction.predicted_disease}
    </p>
    <p className="result-detail">
      <strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%
    </p>

    <button
      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      onClick={() =>
        window.location.href = "/prediction-details"
      }
    >
      See Details
    </button>
  </div>
)}


      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SymptomForm;
