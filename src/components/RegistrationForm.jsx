import React, { useState } from 'react';
import { 
  User, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { submitToGoogleSheets } from '../services/googleSheets';

const INITIAL_FORM_STATE = {
  name: '',
  relationType: 'S/O',
  relatedPersonName: '',
  description: '',
};

export default function RegistrationForm({ onBackToHome }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  // Field validation logic
  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'പേര് നൽകേണ്ടതുണ്ട് / Full name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ വേണം / Minimum 2 characters required';
    }

    if (!data.relationType) {
      newErrors.relationType = 'ബന്ധം തിരഞ്ഞെടുക്കുക / Relation type is required';
    } else if (!['S/O', 'D/O', 'W/O'].includes(data.relationType)) {
      newErrors.relationType = 'Invalid relation type selected';
    }

    if (!data.relatedPersonName.trim()) {
      newErrors.relatedPersonName = 'ബന്ധപ്പെട്ടയാളുടെ പേര് നൽകുക / Related person name is required';
    } else if (data.relatedPersonName.trim().length < 2) {
      newErrors.relatedPersonName = 'കുറഞ്ഞത് 2 അക്ഷരങ്ങൾ വേണം / Minimum 2 characters required';
    }

    if (!data.description.trim()) {
      newErrors.description = 'കത്ത് / വിവരണം നൽകേണ്ടതുണ്ട് / Letter & Description is required';
    }

    return newErrors;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      const validationErrors = validate(updatedForm);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    }
  };

  // Handle Blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validationErrors = validate();
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };

  // Form Reset
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setSubmitStatus({ type: null, message: '' });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const allTouched = {
      name: true,
      relationType: true,
      relatedPersonName: true,
      description: true,
    };
    setTouched(allTouched);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: 'ചുവടെ നൽകിയിട്ടുള്ള വിവരങ്ങൾ ശരിയായി നൽകുക / Please complete all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const payload = {
        name: formData.name.trim(),
        relationType: formData.relationType,
        relatedPersonName: formData.relatedPersonName.trim(),
        description: formData.description.trim(),
      };

      const result = await submitToGoogleSheets(payload);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'നിങ്ങളുടെ വിവരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു! / Registration submitted successfully!',
        });
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setTouched({});
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

      {/* Calligraphy Banner matching Poster */}
      <div className="form-banner-centered">
        <h2>ഹബീബിനൊരു കത്ത്</h2>
        <p>
          മുത്ത് റസൂലിലേക്ക് ഒരക്ഷരത്താൽ... നിങ്ങളുടെ മനസ്സിലുള്ള അനുരാഗ വരികളും സന്ദേശങ്ങളും സമർപ്പിക്കൂ...
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
        {/* Full Name Field */}
        <div className="form-group">
          <label htmlFor="name">
            പേര് / Full Name <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              id="name"
              name="name"
              type="text"
              className={`has-icon ${errors.name && touched.name ? 'input-error' : ''}`}
              placeholder="ഉദാ: മുഹമ്മദ് ഫർഹാൻ / e.g. Muhammed Farhan"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              required
              autoComplete="name"
            />
          </div>
          {errors.name && touched.name && (
            <span className="error-text">
              <AlertCircle size={14} /> {errors.name}
            </span>
          )}
        </div>

        {/* Relation Type & Related Person Row */}
        <div className="form-row">
          {/* Relation Type Dropdown */}
          <div className="form-group">
            <label htmlFor="relationType">
              ബന്ധം / Relation <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <select
                id="relationType"
                name="relationType"
                className={`${errors.relationType && touched.relationType ? 'input-error' : ''}`}
                value={formData.relationType}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              >
                <option value="S/O">S/O (മകൻ / Son of)</option>
                <option value="D/O">D/O (മകൾ / Daughter of)</option>
                <option value="W/O">W/O (ഭാര്യ / Wife of)</option>
              </select>
            </div>
            {errors.relationType && touched.relationType && (
              <span className="error-text">
                <AlertCircle size={14} /> {errors.relationType}
              </span>
            )}
          </div>

          {/* Related Person Name Field */}
          <div className="form-group">
            <label htmlFor="relatedPersonName">
              ബന്ധപ്പെട്ടയാളുടെ പേര് / Related Person <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Users className="input-icon" size={18} />
              <input
                id="relatedPersonName"
                name="relatedPersonName"
                type="text"
                className={`has-icon ${errors.relatedPersonName && touched.relatedPersonName ? 'input-error' : ''}`}
                placeholder="ഉദാ: ഇബ്രാഹിം അഹമ്മദ്"
                value={formData.relatedPersonName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.relatedPersonName && touched.relatedPersonName && (
              <span className="error-text">
                <AlertCircle size={14} /> {errors.relatedPersonName}
              </span>
            )}
          </div>
        </div>

        {/* Mandatory Letter & Description Field */}
        <div className="form-group">
          <label htmlFor="description">
            Letter & Description <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <FileText className="input-icon" size={18} style={{ top: '16px' }} />
            <textarea
              id="description"
              name="description"
              className={`has-icon ${errors.description && touched.description ? 'input-error' : ''}`}
              rows={5}
              placeholder="നിങ്ങളുടെ മനസ്സിൻ താളുകളിലുള്ള അനുരാഗ വരികളും സന്ദേശങ്ങളും ഇവിടെ കുറിക്കാം..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              required
            />
          </div>
          {errors.description && touched.description && (
            <span className="error-text">
              <AlertCircle size={14} /> {errors.description}
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
            title="ക്ലിയർ ചെയ്യുക / Reset form"
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
