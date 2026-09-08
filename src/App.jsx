import React, { useState } from 'react';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'form'

  return (
    <div className="app-container">
      {/* Main View Area */}
      <main className="main-content-view">
        {currentView === 'home' ? (
          <HomePage onNavigateToForm={() => setCurrentView('form')} />
        ) : (
          <RegistrationForm onBackToHome={() => setCurrentView('home')} />
        )}
      </main>

      {/* Footer Hashtag matching Poster */}
      <footer className="poster-footer">
        <p>#Event crew wasful haseen</p>
      </footer>
    </div>
  );
}
