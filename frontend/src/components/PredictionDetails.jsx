import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PredictionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction;

  if (!prediction) return null;

  // --- DYNAMIC THEME LOGIC ---
  let theme = {
    color: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    headerColor: 'bg-green-600',
    barColor: 'bg-green-500',
    icon: '🌿',
    title: 'HEALTH ANALYSIS',
    treatmentTitle: 'RECOMMENDED CARE'
  };

  if (prediction.alert_level === 'critical') {
    theme = {
      color: 'text-red-800',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      headerColor: 'bg-red-600',
      barColor: 'bg-red-500',
      icon: '🚨',
      title: 'CRITICAL ALERT',
      treatmentTitle: 'EMERGENCY PROTOCOL'
    };
  } else if (prediction.alert_level === 'uncertain') {
    theme = {
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      headerColor: 'bg-yellow-500',
      barColor: 'bg-yellow-500',
      icon: '⚠️',
      title: 'UNCERTAIN DIAGNOSIS',
      treatmentTitle: 'MEDICAL CONSULTATION ADVISED'
    };
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* DIAGNOSIS CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`${theme.headerColor} px-6 py-4`}>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              {theme.icon} {theme.title}
            </h2>
          </div>

          <div className="p-8 text-center">
            <p className="text-gray-500 uppercase text-xs font-bold mb-2">Predicted Condition</p>
            <h1 className={`text-4xl font-extrabold mb-4 ${theme.color}`}>
              {prediction.diagnosis}
            </h1>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 max-w-xs mx-auto">
              <div 
                className={`h-2.5 rounded-full ${theme.barColor}`} 
                style={{ width: `${prediction.confidence * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{(prediction.confidence * 100).toFixed(1)}% Confidence</p>
          </div>
        </div>

        {/* TREATMENT CARD */}
        <div className={`rounded-xl shadow-md border overflow-hidden ${theme.bgColor} ${theme.borderColor}`}>
          <div className="p-6">
            <h3 className={`font-bold text-lg mb-4 flex items-center ${theme.color}`}>
              {theme.treatmentTitle}
            </h3>
            <ul className="space-y-3">
              {prediction.treatments.map((step, idx) => (
                <li key={idx} className="flex items-start bg-white bg-opacity-60 p-3 rounded-lg shadow-sm">
                  <span className={`mr-3 font-bold ${theme.color}`}>{idx + 1}.</span>
                  <span className="text-gray-800 font-medium">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition"
        >
          Analyze New Symptoms
        </button>

      </div>
    </div>
  );
}

export default PredictionDetails;