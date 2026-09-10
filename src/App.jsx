import React, { useState } from 'react';
import HomePage from './components/HomePage';
import RegistrationForm from './components/RegistrationForm';
import LettersPage from './components/LettersPage';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'form' | 'letters'

  return (
    <div className="app-container">
      {/* Main View Area */}
      <main className="main-content-view" style={{ width: '100%' }}>
        {currentView === 'home' && (
          <HomePage 
            onNavigateToForm={() => setCurrentView('form')}
            onNavigateToLetters={() => setCurrentView('letters')}
          />
        )}

        {currentView === 'form' && (
          <RegistrationForm 
            onBackToHome={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'letters' && (
          <LettersPage 
            onBackToHome={() => setCurrentView('home')} 
            onNavigateToForm={() => setCurrentView('form')}
          />
        )}
      </main>

      {/* Footer Hashtag matching Poster */}
      <footer className="poster-footer">
        <p>#Event crew wasful haseen • SYS, SSF നോർത്ത് കൊഴക്കോട്ടൂർ യൂണിറ്റ്</p>
      </footer>
    </div>
  );
}
