import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SymptomForm from './components/SymptomForm';
import PredictionDetails from './components/PredictionDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SymptomForm />} />
            <Route path="/prediction-details" element={<PredictionDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
