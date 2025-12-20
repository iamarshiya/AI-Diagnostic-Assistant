import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

/* =======================
   DEFAULT SYMPTOMS
======================= */
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
  { value: 'dizziness', label: 'Dizziness' },
];

/* =======================
   MAIN COMPONENT
======================= */
function SymptomForm() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setSymptomOptions(DEFAULT_SYMPTOMS);
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://symptomate-ai-diagnostic-assistant.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms.map(s => s.value),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/prediction-details', { state: { prediction: data } });
      } else {
        setError(data.detail || 'Prediction failed');
      }
    } catch {
      setError('Unable to reach diagnostic service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-cyan-100 via-white to-cyan-100">

  {/* ================= HEADER ================= */}
<header className="sticky top-0 z-40 bg-gradient-to-r from-cyan-50 to-emerald-50 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
  <div className="mx-auto max-w-6xl px-6 py-5 text-center">

    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex justify-center items-center gap-2">
      
      Symptomate
    </h1>

    <p className="mt-1 text-sm text-slate-600 max-w-3xl mx-auto">
      AI Diagnostic Assistant — Clinical decision support prototype
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Informational output only. Not a medical diagnosis.
    </p>

  </div>
</header>


      {/* ================= MAIN ================= */}
      <main className="flex-1 flex items-center px-6">
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT CONTENT */}
          <div className="space-y-4" >
            
            <h2 className="text-3xl font-semibold text-slate-900">
              Symptom Assessment
            </h2>

            <p className="text-slate-600 max-w-md">
              Select all symptoms currently experienced. The system evaluates
              symptom combinations using a trained clinical prediction model.
            </p>

            <div className="border-l-2 border-slate-300 pl-4 text-sm text-slate-600">
              Results are presented as clinical decision-support insights.
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white border border-white/40 rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] p-8 relative z-10">
            <h3 className="text-lg font-semibold text-slate-900">
              Symptom Selection
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Search and select all applicable symptoms
            </p>

            <div className="mt-4">
              <Select
                isMulti
                value={selectedSymptoms}
                onChange={setSelectedSymptoms}
                options={symptomOptions}
                placeholder="Type to search symptoms"
                classNamePrefix="react-select"
                styles={{
                  control: base => ({
                    ...base,
                    borderRadius: '0.75rem',
                    borderColor: '#CBD5E1',
                    boxShadow: 'none',
                    minHeight: '44px',
                  }),
                }}
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={loading || selectedSymptoms.length === 0}
              className={`mt-5 w-full py-2.5 rounded-lg font-medium transition
                ${
                  loading || selectedSymptoms.length === 0
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }
              `}
            >
              {loading ? 'Analyzing…' : 'Generate Assessment'}
            </button>

            {error && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <p className="mt-3 text-base font-medium text-red-600">
  ⚠️ This system does not replace professional medical evaluation.
</p>


          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
<footer className="bg-gradient-to-r from-cyan-50 to-emerald-50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
  <div className="mx-auto max-w-6xl px-6 py-3 text-xs text-slate-500 text-center">
    © 2025 <span className="font-medium text-slate-600">Symptomate</span> — Clinical decision support prototype
  </div>
</footer>



    </div>
  );
}

export default SymptomForm;
