import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SymptomForm from './components/SymptomForm';
import PredictionDetails from './components/PredictionDetails';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SymptomForm />} />
            <Route path="/prediction-details" element={<PredictionDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
