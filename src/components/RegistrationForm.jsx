import React, { useState } from 'react';
import { 
  User, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { submitToGoogleSheets } from '../services/googleSheets';

const INITIAL_FORM_STATE = {
  name: '',
  relationType: 'S/O',
  relatedPersonName: '',
  description: '',
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' });

  // Field validation logic
  const validate = (data = formData) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!data.relationType) {
      newErrors.relationType = 'Relation type is required';
    } else if (!['S/O', 'D/O', 'W/O'].includes(data.relationType)) {
      newErrors.relationType = 'Invalid relation type selected';
    }

    if (!data.relatedPersonName.trim()) {
      newErrors.relatedPersonName = 'Related person name is required';
    } else if (data.relatedPersonName.trim().length < 2) {
      newErrors.relatedPersonName = 'Name must be at least 2 characters';
    }

    return newErrors;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Validate field dynamically if already touched
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

    // Prevent double submission
    if (isSubmitting) return;

    // Mark all fields as touched
    const allTouched = {
      name: true,
      relationType: true,
      relatedPersonName: true,
      description: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitStatus({
        type: 'error',
        message: 'Please resolve the highlighted errors before submitting.',
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
          message: result.message || 'Data submitted successfully to Google Sheet!',
        });
        // Clear form after successful submission
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
    <div className="form-card">
      {/* Feedback Alerts */}
      {submitStatus.type === 'success' && (
        <div className="alert alert-success" role="alert">
          <CheckCircle2 className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">Success!</div>
            <div>{submitStatus.message}</div>
          </div>
        </div>
      )}

      {submitStatus.type === 'error' && (
        <div className="alert alert-error" role="alert">
          <AlertCircle className="alert-icon" size={20} />
          <div className="alert-content">
            <div className="alert-title">Submission Error</div>
            <div>{submitStatus.message}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form-grid">
        {/* Full Name Field */}
        <div className="form-group">
          <label htmlFor="name">
            Full Name <span className="required-star">*</span>
          </label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              id="name"
              name="name"
              type="text"
              className={`has-icon ${errors.name && touched.name ? 'input-error' : ''}`}
              placeholder="e.g. Muhammed Ali"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              required
              autoComplete="name"
            />
          </div>
          {errors.name && touched.name && (
            <span className="error-text" id="name-error">
              <AlertCircle size={14} /> {errors.name}
            </span>
          )}
        </div>

        {/* Relation Type & Related Person Row */}
        <div className="form-row">
          {/* Relation Type Dropdown */}
          <div className="form-group">
            <label htmlFor="relationType">
              Relation <span className="required-star">*</span>
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
                <option value="S/O">S/O (Son of)</option>
                <option value="D/O">D/O (Daughter of)</option>
                <option value="W/O">W/O (Wife of)</option>
              </select>
            </div>
            {errors.relationType && touched.relationType && (
              <span className="error-text" id="relationType-error">
                <AlertCircle size={14} /> {errors.relationType}
              </span>
            )}
          </div>

          {/* Related Person Name Field */}
          <div className="form-group">
            <label htmlFor="relatedPersonName">
              Related Person Name <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <Users className="input-icon" size={18} />
              <input
                id="relatedPersonName"
                name="relatedPersonName"
                type="text"
                className={`has-icon ${errors.relatedPersonName && touched.relatedPersonName ? 'input-error' : ''}`}
                placeholder="e.g. Ibrahim Ahmed"
                value={formData.relatedPersonName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.relatedPersonName && touched.relatedPersonName && (
              <span className="error-text" id="relatedPersonName-error">
                <AlertCircle size={14} /> {errors.relatedPersonName}
              </span>
            )}
          </div>
        </div>

        {/* Optional Description Field */}
        <div className="form-group">
          <label htmlFor="description">
            Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <div className="input-wrapper">
            <FileText className="input-icon" size={18} style={{ top: '16px' }} />
            <textarea
              id="description"
              name="description"
              className="has-icon"
              rows={4}
              placeholder="Add additional details, notes, or remarks..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting}
            title="Clear form inputs"
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
                <div className="spinner" /> Processing...
              </>
            ) : (
              <>
                <Send size={16} /> Submit Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
