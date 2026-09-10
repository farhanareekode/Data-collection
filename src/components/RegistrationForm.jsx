import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { submitToGoogleSheets } from '../services/googleSheets';

export default function RegistrationForm({ onBackToHome }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  // Field validation logic
  const validate = (text = description) => {
    if (!text.trim()) {
      return 'അഭിപ്രായം രേഖപ്പെടുത്തേണ്ടതുണ്ട് / Feedback is required';
    }
    return '';
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    if (touched) {
      setError(validate(value));
    }
  };

  // Handle Blur
  const handleBlur = () => {
    setTouched(true);
    setError(validate());
  };

  // Form Reset
  const handleReset = () => {
    setDescription('');
    setError('');
    setTouched(false);
    setSubmitStatus({ type: null, message: '' });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setTouched(true);
    const validationError = validate();
    setError(validationError);

    if (validationError) {
      setSubmitStatus({
        type: 'error',
        message: validationError,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        name: 'Anonymous',
        relationType: 'N/A',
        relatedPersonName: 'N/A',
        description: description.trim(), // Maps directly to Description column in Google Sheets
      };

      const result = await submitToGoogleSheets(payload);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'നിങ്ങളുടെ അഭിപ്രായം വിജയകരമായി രേഖപ്പെടുത്തി! / Feedback submitted successfully!',
        });
        setDescription('');
        setError('');
        setTouched(false);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Submission failed. Please try again.',
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="parchment-card">
      {/* Top Back Navigation Button */}
      {onBackToHome && (
        <button className="btn-back-nav" onClick={onBackToHome}>
          <ArrowLeft size={16} /> ഹോം പേജിലേക്ക് (Back to Home)
        </button>
      )}

      {/* Form Title Banner */}
      <div className="form-banner-centered">
        <h2>അഭിപ്രായം രേഖപ്പെടുത്താം</h2>
        <p>
          വസ്ഫുൽ ഹസീൻ പരിപാടിയെക്കുറിച്ചുള്ള നിങ്ങളുടെ അഭിപ്രായങ്ങളും ആശംസകളും ഫീഡ്‌ബാക്കും രേഖപ്പെടുത്തൂ...
        </p>
      </div>

      {/* Feedback Alerts */}
      {submitStatus.type === 'success' && (
        <div className="alert alert-success" role="alert">
          <CheckCircle2 className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">വിജയകരം! / Success!</div>
            <div>{submitStatus.message}</div>
          </div>
        </div>
      )}

      {submitStatus.type === 'error' && (
        <div className="alert alert-error" role="alert">
          <AlertCircle className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">ശ്രദ്ധിക്കുക / Notice</div>
            <div>{submitStatus.message}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form-grid">
        {/* Single Mandatory Feedback Field */}
        <div className="form-group">
          <label htmlFor="description">
            അഭിപ്രായം രേഖപ്പെടുത്താം / Feedback <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <MessageSquare className="input-icon" size={18} style={{ top: '16px' }} />
            <textarea
              id="description"
              name="description"
              className={`has-icon ${error && touched ? 'input-error' : ''}`}
              rows={6}
              placeholder="നിങ്ങളുടെ അഭിപ്രായങ്ങളും ആശംസകളും ഫീഡ്‌ബാക്കും ഇവിടെ കുറിക്കാം..."
              value={description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              required
            />
          </div>
          {error && touched && (
            <span className="error-text">
              <AlertCircle size={14} /> {error}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
            title="ക്ലിയർ ചെയ്യുക / Reset"
          >
            <RotateCcw size={16} /> Reset
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" /> അയക്കുന്നു...
              </>
            ) : (
              <>
                <Send size={16} /> സമർപ്പിക്കുക / Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
