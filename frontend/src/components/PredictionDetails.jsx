// frontend/src/components/PredictionDetails.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PredictionDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;

  if (!prediction) {
    return (
      <div className="p-6 text-center text-red-600">
        No prediction data found. Please predict a disease first.
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Symptom Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Prediction Details</h2>
        
        <p className="text-lg"><strong>Disease:</strong> {prediction.predicted_disease}</p>
        <p className="text-lg"><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
        
        {prediction.dataset_references?.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold text-gray-700">Dataset References:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {prediction.dataset_references.map((ref, i) => (
                <li key={i}>
                  {ref.source}: {ref.count} cases
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default PredictionDetails;
