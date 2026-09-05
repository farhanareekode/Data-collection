/**
 * Service for communicating with Google Apps Script Web App API backend.
 */

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Submit form data to Google Apps Script Web App
 * @param {Object} payload - The form fields data
 * @param {string} payload.name - Name of the individual
 * @param {string} payload.relationType - S/O, D/O, or W/O
 * @param {string} payload.relatedPersonName - Related Person Name
 * @param {string} [payload.description] - Optional multiline description
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function submitToGoogleSheets(payload) {
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_APPS_SCRIPT_WEB_APP_ID')) {
    throw new Error(
      'Google Apps Script Web App URL is not configured. Please set VITE_APPS_SCRIPT_URL in your .env.local file.'
    );
  }

  try {
    // Send payload using text/plain to avoid CORS preflight OPTIONS check on script.google.com
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 'error') {
      return {
        success: false,
        message: result.message || 'Server encountered an error while processing submission.',
      };
    }

    return {
      success: true,
      message: result.message || 'Form submitted successfully!',
      data: result,
    };
  } catch (error) {
    console.error('Google Sheets submission error:', error);
    
    // Provide user-friendly messaging for network or setup failures
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error or CORS issue. Ensure your Google Apps Script Web App is deployed with access set to "Anyone".'
      );
    }
    
    throw error;
  }
}
