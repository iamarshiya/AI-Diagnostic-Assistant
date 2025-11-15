import React from 'react';

function Header() {
  return (
    <header className="py-12 text-center">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          AI Diagnostic Assistant
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          AI-powered symptom analysis and disease prediction.
        </p>
        <p className="text-sm text-red-600 font-semibold">
          ⚠️ Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </header>
  );
}

export default Header;
