import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import { Database, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge">
          <span className="badge-dot"></span>
          <span>Google Apps Script Sync</span>
        </div>
        <h1>Data Registration Portal</h1>
        <p>Submit your details directly into our Google Sheets database.</p>
      </header>

      <main>
        <RegistrationForm />
      </main>

      <footer className="app-footer">
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10b981" /> 
          Encrypted directly to Google Sheets via serverless Apps Script.
        </p>
      </footer>
    </div>
  );
}
