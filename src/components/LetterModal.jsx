import React, { useState } from 'react';
import { X, Heart, Copy, Check, BookOpen } from 'lucide-react';

export default function LetterModal({ letter, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!letter) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(letter.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="letter-modal-overlay" onClick={onClose}>
      <div 
        className="letter-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="modal-header">
          <div className="modal-badge">
            <BookOpen size={16} />
            <span>കത്ത് #{letter.id}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <h2 className="modal-title">{letter.title}</h2>
          
          <div className="modal-sender">
            <Heart size={14} color="#194d21" fill="#194d21" />
            <span>{letter.sender}</span>
          </div>

          <hr className="modal-divider" />

          <div className="modal-text-content">
            {letter.fullText}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button className="btn-copy" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'കോപ്പി ചെയ്തു!' : 'കത്ത് കോപ്പി ചെയ്യുക'}</span>
          </button>
          
          <button className="btn-modal-close" onClick={onClose}>
            അടയ്ക്കുക (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
