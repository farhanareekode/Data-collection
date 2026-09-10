import React from 'react';
import { MessageSquarePlus, BookOpen, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { lettersData } from '../data/letters';

export default function HomePage({ onNavigateToForm, onNavigateToLetters }) {
  // Show first 2 featured letters on Home Page for preview
  const featuredLetters = lettersData.slice(0, 2);

  return (
    <div className="home-page-wrapper">
      {/* Centered Header Section */}
      <header className="header-centered">
        <div className="top-pill-tag">
          <Sparkles size={14} />
          <span>MOBILE MAWLID CELEBRATION</span>
        </div>
        
        <h1 className="title-centered-white">വസ്ഫുൽ ഹസീൻ</h1>
      </header>

      {/* Main Parchment Hero Card */}
      <div className="parchment-hero-card" style={{ marginTop: '24px' }}>
        {/* Calligraphy Title */}
        <div className="calligraphy-banner">
          <h2>ഹബീബിനൊരു കത്ത്</h2>
        </div>

        {/* Malayalam Narrative Subtitle */}
        <div className="narrative-container">
          <p className="narrative-subtitle">മുത്ത് റസൂലിലേക്ക് ഒരക്ഷരത്താൽ...</p>
        </div>

        {/* TWO Primary Action Buttons */}
        <div className="home-action-grid">
          {/* Button 1: Feedback Form */}
          <button 
            className="btn-action-primary btn-write-action" 
            onClick={onNavigateToForm}
          >
            <MessageSquarePlus size={22} />
            <div className="btn-text-content">
              <span className="btn-main-label">അഭിപ്രായം രേഖപ്പെടുത്താം</span>
              <span className="btn-sub-label">Share your Feedback</span>
            </div>
            <ArrowRight size={18} className="cta-arrow" />
          </button>

          {/* Button 2: Read Letters Gallery */}
          <button 
            className="btn-action-primary btn-read-action" 
            onClick={onNavigateToLetters}
          >
            <BookOpen size={22} />
            <div className="btn-text-content">
              <span className="btn-main-label">കത്തുകൾ വായിക്കാം</span>
              <span className="btn-sub-label">View ({lettersData.length}) Letters</span>
            </div>
            <ArrowRight size={18} className="cta-arrow" />
          </button>
        </div>

        {/* Featured Letters Preview Section */}
        <div className="featured-letters-preview">
          <div className="preview-header">
            <h3><Heart size={16} color="#194d21" fill="#194d21" /> ജനപ്രിയ കത്തുകൾ (Featured Letters)</h3>
            <button className="link-view-all" onClick={onNavigateToLetters}>
              എല്ലാ കത്തുകളും കാണുക ({lettersData.length}) →
            </button>
          </div>

          <div className="preview-cards-row">
            {featuredLetters.map((letter) => (
              <div 
                key={letter.id} 
                className="preview-mini-card"
                onClick={onNavigateToLetters}
              >
                <div className="mini-card-badge">കത്ത് #{letter.id}</div>
                <h4 className="mini-card-title">{letter.title}</h4>
                <p className="mini-card-sender">{letter.sender}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
