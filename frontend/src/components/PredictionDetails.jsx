import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PredictionDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction;

  // Fallback for development if no state is passed
  const safePrediction = prediction || {
    diagnosis: "Heart Attack",
    alert_level: "critical", // critical, uncertain, low
    confidence: 0.83,
    treatments: [
        "Immediate medical evaluation is required.", 
        "Proceed to the nearest emergency medical facility.",
        "Avoid self-medication.",
        "Continuous monitoring of vital signs is advised."
    ]
  };

  // -----------------------------
  // Theme Configuration
  // -----------------------------
  let theme = {
    // Default (Low Risk) - Emerald
    bg: 'bg-gradient-to-b from-emerald-100 via-emerald-50 to-white',
    lightBg: 'bg-white',
    text: 'text-emerald-900',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
    label: 'Low Clinical Risk',
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )
  };

  if (safePrediction.alert_level === 'critical') {
    theme = {
      // Updated to a gradient for more depth
      bg: 'bg-gradient-to-b from-red-100 via-red-50 to-white',
      lightBg: 'bg-white',
      text: 'text-rose-900',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-800',
      bar: 'bg-rose-500',
      label: 'High Clinical Risk',
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      )
    };
  } else if (safePrediction.alert_level === 'uncertain') {
    theme = {
      // Amber Theme
      bg: 'bg-gradient-to-b from-amber-100 via-amber-50 to-white',
      lightBg: 'bg-white',
      text: 'text-amber-900',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-800',
      bar: 'bg-amber-500',
      label: 'Inconclusive Assessment',
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      )
    };
  }

  const confidencePercent = (safePrediction.confidence * 100).toFixed(1);

  return (
    <div className={`min-h-screen w-full flex flex-col ${theme.bg} font-sans transition-colors duration-500`}>
      
      {/* 1. Header Bar */}
<header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="font-semibold text-slate-700">Symptomate</span>
    </div>
  </div>
</header>


      {/* 2. Main Content Area (Fills Screen) */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Diagnosis & Stats */}
          <div className="space-y-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 ${theme.badge}`}>
                {theme.icon}
                {theme.label}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                {safePrediction.diagnosis}
              </h1>
              <p className="text-slate-500 text-lg">Predicted Condition</p>
            </div>

            {/* Large Confidence Display */}
            <div className="bg-white/60 p-6 rounded-2xl border border-white/50 backdrop-blur-sm shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-m font-semibold text-black-500 uppercase tracking-wider">AI Model Confidence</span>
                 <span className={`text-3xl font-bold ${theme.text.replace('900', '600')}`}>{confidencePercent}%</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${theme.bar} transition-all duration-1000 ease-out`} 
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
               </div>
               <p className="text-s text-slate-400 mt-3">
                 Analysis based on clinical prediction models. Higher percentages indicate stronger pattern matching with known cases.
               </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Recommendations & Actions */}
          <div className={`bg-white rounded-3xl shadow-xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] border ${theme.border} p-8 md:p-10`}>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className={`w-2 h-8 rounded-full ${theme.bar}`}></span>
              Clinical Recommendations
            </h3>
            
            <ul className="space-y-4 mb-8">
              {safePrediction.treatments.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full ${theme.bg.replace('bg-gradient-to-b from-rose-100 via-rose-50 to-white', 'bg-rose-100')} flex items-center justify-center text-sm font-bold ${theme.text}`}>
                    {index + 1}
                  </span>
                  <span className="text-base text-slate-700 leading-relaxed pt-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

           <div className="space-y-4 pt-6 border-t border-slate-100">
  <div className="flex gap-3 items-start p-4 bg-slate-50 rounded-xl 
                  shadow-[0_8px_20px_rgba(239,68,68,0.18)]">
    <svg
      className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <p className="text-sm text-red-500 leading-normal">
      <strong>⚠️ Disclaimer:</strong> This result is generated by an AI model and serves as decision support only. It does not replace professional medical diagnosis.
    </p>
  </div>

               {/* UPDATED BUTTON HERE: Uses theme colors instead of black */}
               <button 
                 onClick={() => navigate('/')}
                 className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all active:scale-[0.99] hover:brightness-95 ${theme.badge}`}
               >
                 Start New Assessment
               </button>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Footer */}
<footer className="py-3 text-center border-t border-slate-200/50 bg-white/50 backdrop-blur-md shadow-[0_-2px_12px_rgba(0,0,0,0.25)]">
  <p className="text-[11px] text-slate-400 font-medium">
    © 2025 Symptomate — Clinical Decision Support Prototype
  </p>
</footer>


    </div>
  );
}

export default PredictionDetails;