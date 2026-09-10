import React, { useState } from 'react';
import { lettersData } from '../data/letters';
import LetterModal from './LetterModal';
import { ArrowLeft, BookOpen, Search, Heart, MessageSquarePlus } from 'lucide-react';

export default function LettersPage({ onBackToHome, onNavigateToForm }) {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLetters = lettersData.filter((letter) => {
    const query = searchQuery.toLowerCase();
    return (
      letter.title.toLowerCase().includes(query) ||
      letter.sender.toLowerCase().includes(query) ||
      letter.fullText.toLowerCase().includes(query)
    );
  });

  return (
    <div className="letters-page-wrapper">
      {/* Top Header Controls */}
      <div className="page-top-actions">
        <button className="btn-back-nav" onClick={onBackToHome}>
          <ArrowLeft size={16} /> ഹോം പേജിലേക്ക് (Back to Home)
        </button>

        <button className="btn-write-nav" onClick={onNavigateToForm}>
          <MessageSquarePlus size={16} /> അഭിപ്രായം രേഖപ്പെടുത്താം
        </button>
      </div>

      {/* Page Title Banner */}
      <div className="letters-banner">
        <div className="letters-badge">
          <BookOpen size={16} />
          <span>തിരഞ്ഞെടുത്ത കത്തുകൾ ({lettersData.length})</span>
        </div>
        <h1>ഹബീബിനൊരു കത്ത് • വായനമുറി</h1>
        <p>മുത്ത് റസൂലിലേക്ക് സ്നേഹാനുരാഗത്തോടെ ആശിഖീങ്ങൾ സമർപ്പിച്ച വികാരനിർഭരമായ കത്തുകൾ...</p>
      </div>

      {/* Search Input Bar */}
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="കത്തുകളിലും ആളുകളിലും തിരയുക (Search letters)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Letters Grid Gallery */}
      <div className="letters-grid">
        {filteredLetters.length > 0 ? (
          filteredLetters.map((letter) => (
            <div key={letter.id} className="letter-card">
              <div className="card-top-bar">
                <span className="card-letter-id">കത്ത് #{letter.id}</span>
                <span className="card-heart">
                  <Heart size={14} fill="#194d21" color="#194d21" />
                </span>
              </div>

              <h3 className="card-title">{letter.title}</h3>
              
              <div className="card-sender">
                — {letter.sender}
              </div>

              <p className="card-preview">
                {letter.preview}
              </p>

              <button 
                className="btn-read-more"
                onClick={() => setSelectedLetter(letter)}
              >
                <BookOpen size={16} />
                <span>കൂടുതൽ വായിക്കാം (Read More)</span>
              </button>
            </div>
          ))
        ) : (
          <div className="no-letters-found">
            <p>നിങ്ങൾ തിരഞ്ഞ വാക്കുകൾക്ക് അനുയോജ്യമായ കത്തുകൾ കണ്ടെത്താനായില്ല.</p>
          </div>
        )}
      </div>

      {/* Full Letter Modal */}
      {selectedLetter && (
        <LetterModal 
          letter={selectedLetter} 
          onClose={() => setSelectedLetter(null)} 
        />
      )}
    </div>
  );
}
