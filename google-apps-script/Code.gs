/**
 * Google Apps Script Web App API Backend
 * -------------------------------------------------------------
 * Target Google Sheet Structure:
 * | Timestamp | Name | Relation Type | Related Person Name | Description |
 * -------------------------------------------------------------
 */

// OPTIONAL: Set your specific Google Sheet ID here if the script is NOT container-bound to the sheet.
// Leave as empty string "" if the script is directly attached to the Google Sheet (Container-bound script).
var SPREADSHEET_ID = "";

/**
 * Handle HTTP GET Requests (Useful for health checks in browser)
 */
function doGet(e) {
  return respondJSON({
    status: "success",
    message: "Google Apps Script Web App API is online and operational.",
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle HTTP POST Requests from React Frontend
 */
function doPost(e) {
  // Use ScriptLock to prevent race conditions during concurrent submissions
  var lock = LockService.getScriptLock();
  var hasLock = false;
  
  try {
    // Acquire lock for up to 10 seconds (returns boolean true/false)
    hasLock = lock.tryLock(10000);
    if (!hasLock) {
      return respondJSON({
        status: "error",
        message: "Server is busy. Please try submitting again."
      });
    }

    // 1. Parse incoming JSON payload
    if (!e || !e.postData || !e.postData.contents) {
      return respondJSON({
        status: "error",
        message: "Invalid request. Request body is empty."
      });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return respondJSON({
        status: "error",
        message: "Malformed JSON payload in request body."
      });
    }

    // 2. Extract and sanitize fields
    var name = payload.name ? String(payload.name).trim() : "Anonymous";
    var relationType = payload.relationType ? String(payload.relationType).trim() : "N/A";
    var relatedPersonName = payload.relatedPersonName ? String(payload.relatedPersonName).trim() : "N/A";
    var description = payload.description ? String(payload.description).trim() : "";

    // 3. Server-side Validation
    var validationErrors = [];

    if (!description) {
      validationErrors.push("അഭിപ്രായം രേഖപ്പെടുത്തുക / Feedback is required.");
    }

    if (validationErrors.length > 0) {
      return respondJSON({
        status: "error",
        message: "Validation failed: " + validationErrors.join(" ")
      });
    }

    // 4. Access Google Spreadsheet
    var ss = null;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      try {
        ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
      } catch (err) {
        Logger.log("Failed to open spreadsheet by ID: " + err.toString());
      }
    }
    
    if (!ss) {
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
      } catch (err) {
        Logger.log("Failed to get active spreadsheet: " + err.toString());
      }
    }

    if (!ss) {
      return respondJSON({
        status: "error",
        message: "Spreadsheet not found. Ensure SPREADSHEET_ID is set in Code.gs or script is bound to a Sheet."
      });
    }

    // Target active sheet or named sheet "Submissions"
    var sheet = ss.getSheetByName("Submissions") || ss.getSheets()[0];

    // Ensure Headers exist if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Relation Type", "Related Person Name", "Description"]);
      
      // Style Header Row (Bold + Background Color)
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
    }

    // 5. Generate formatted Timestamp & Append Row
    var timestamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone() || "GMT", "yyyy-MM-dd HH:mm:ss");
    
    var newRow = [
      timestamp,
      name,
      relationType,
      relatedPersonName,
      description
    ];

    sheet.appendRow(newRow);

    // 6. Return Success Response
    return respondJSON({
      status: "success",
      message: "Data submitted successfully!",
      timestamp: timestamp,
      insertedRow: sheet.getLastRow()
    });

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return respondJSON({
      status: "error",
      message: "Internal server error: " + error.toString()
    });
  } finally {
    // Release the thread lock if acquired
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/**
 * Helper to build JSON response output
 */
function respondJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
