import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PredictionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction;

  if (!prediction) return null;

  // -----------------------------
  // Clinical Risk Theme (Soft)
  // -----------------------------
  let theme = {
    accent: 'text-slate-900',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    header: 'bg-emerald-100',
    bar: 'bg-emerald-300',
    label: 'LOW CLINICAL RISK',
  };

  if (prediction.alert_level === 'critical') {
    theme = {
      accent: 'text-slate-900',
      bg: 'bg-red-50',
      border: 'border-red-200',
      header: 'bg-red-100',
      bar: 'bg-red-300',
      label: 'HIGH CLINICAL RISK',
    };
  } else if (prediction.alert_level === 'uncertain') {
    theme = {
      accent: 'text-slate-900',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      header: 'bg-amber-100',
      bar: 'bg-amber-300',
      label: 'INCONCLUSIVE ASSESSMENT',
    };
  }

  const confidencePercent = (prediction.confidence * 100).toFixed(1);

  return (
    <div className="h-screen bg-slate-50 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-4">

        {/* ===== Diagnostic Summary ===== */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className={`${theme.header} px-5 py-3`}>
            <h2 className="text-sm font-semibold text-slate-700 tracking-wide">
              Diagnostic Assessment Report
            </h2>
          </div>

          <div className="p-5 text-center">
            <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">
              Predicted Condition
            </p>

            <h1 className={`text-3xl font-semibold ${theme.accent}`}>
              {prediction.diagnosis}
            </h1>

            <p className="mt-1 text-xs font-medium text-slate-600">
              {theme.label}
            </p>

            {/* Confidence */}
            <div className="mt-3 max-w-xs mx-auto">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${theme.bar}`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Model confidence: {confidencePercent}%
              </p>
            </div>
          </div>
        </div>

        {/* ===== Clinical Recommendations ===== */}
        <div className={`${theme.bg} ${theme.border} border rounded-xl px-4 py-3`}>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Clinical Recommendations
          </h3>

          <ul className="space-y-2">
            {prediction.treatments.slice(0, 2).map((item, index) => (
              <li
                key={index}
                className="flex gap-3 bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800"
              >
                <span className="font-medium">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Disclaimer ===== */}
        <div className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded-md px-4 py-2">
          <strong>Clinical Disclaimer:</strong> AI-assisted decision support only.
          Not a substitute for professional medical evaluation.
        </div>

        {/* ===== CTA ===== */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          Start New Assessment
        </button>

        {/* ================= FOOTER ================= */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-2 text-xs text-gray-500 text-center">
          © 2025 AI Diagnostic Assistant — Clinical decision support prototype
        </div>
      </footer>

      </div>
    </div>
  );
}

export default PredictionDetails;
