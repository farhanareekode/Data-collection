import React from 'react';
import { Mail, ArrowRight, Sparkles, Calendar, Clock, MapPin } from 'lucide-react';

export default function HomePage({ onNavigateToForm }) {
  return (
    <div className="home-page-wrapper">
      {/* Centered Header Section */}
      <header className="header-centered">
        <div className="top-pill-tag">
          <Sparkles size={14} />
          <span>MOBILE MAWLID CELEBRATION</span>
        </div>
        
        <h1 className="title-centered-white">വസ്ഫുൽ ഹസീൻ</h1>
        
        <div className="event-details-card-centered">
          <span className="event-date-highlight">10 SEPTEMBER 2026</span>
          <span className="dot-separator">•</span>
          <span>THURSDAY 7:30 PM</span>
          <span className="dot-separator">•</span>
          <span>NORTH KOZHAKKOTTUR</span>
        </div>
      </header>

      {/* Main Parchment Hero Card */}
      <div className="parchment-hero-card" style={{ marginTop: '24px' }}>
        {/* Calligraphy Title */}
        <div className="calligraphy-banner">
          <h2>ഹബീബിനൊരു കത്ത്</h2>
        </div>

        {/* Malayalam Narrative Prose */}
        <div className="narrative-container">
          <p className="narrative-subtitle">മുത്ത് റസൂലിലേക്ക് ഒരക്ഷരത്താൽ...</p>
          <p>
            തീരാത്ത അനുരാഗവും പ്രണയവും ഹൃദയത്തിൽ തൊട്ട് അക്ഷരങ്ങളിലാക്കാൻ അവസരം. 
            പുണ്യ റസൂലിലേക്ക് നിങ്ങളുടെ മനസ്സിലുള്ള അനുരാഗത്തിന്റെ വരികൾ എഴുതി അയക്കൂ...
          </p>
          <div className="prize-badge-banner">
            🏆 തെരഞ്ഞെടുക്കപ്പെടുന്ന മികച്ച രചനകൾക്ക് ആകർഷകമായ സമ്മാനങ്ങൾ!
          </div>
        </div>

        {/* Primary CTA Button */}
        <button 
          className="btn-cta-emerald" 
          onClick={onNavigateToForm}
        >
          <Mail size={22} />
          <span>തിരുനബിക്കൊരു കത്തെഴുതാം</span>
          <ArrowRight size={20} className="cta-arrow" />
        </button>
      </div>
    </div>
  );
}
