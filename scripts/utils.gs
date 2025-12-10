/**
 * Utilities and central configuration for the portfolio demo.
 * All IDs below must be demo/test values. Do NOT use production IDs or secrets.
 */

const CONFIG = {
  sheets: {
    main: "YOUR_DEMO_SHEET_ID",          // Spreadsheet with demo tabs (Clients, Projects, Equipment, Quotations)
    archiveFolderId: "YOUR_DEMO_DRIVE_FOLDER_ID" // Drive folder for archived quotations/docs
  },
  templates: {
    quotationDoc: "YOUR_QUOTATION_TEMPLATE_ID",
    contractDoc: "YOUR_CONTRACT_TEMPLATE_ID",
    invoiceDoc: "YOUR_INVOICE_TEMPLATE_ID",
    invoiceSheet: "YOUR_INVOICE_SHEET_TEMPLATE_ID" // optional alternative template
  },
  calendar: {
    calendarId: "YOUR_DEMO_CALENDAR_ID"
  },
  defaults: {
    currency: "RUB",
    locale: "ru-RU",
    timezone: "Europe/Moscow",
    archiveStatus: "Archived",
    sentStatus: "Sent"
  }
};

/**
 * Basic logger wrapper to keep log messages consistent.
 */
function logInfo(message, data) {
  if (data !== undefined) {
    Logger.log(`[INFO] ${message}: ${JSON.stringify(data)}`);
  } else {
    Logger.log(`[INFO] ${message}`);
  }
}

function logWarn(message, data) {
  if (data !== undefined) {
    Logger.log(`[WARN] ${message}: ${JSON.stringify(data)}`);
  } else {
    Logger.log(`[WARN] ${message}`);
  }
}

function logError(message, data) {
  if (data !== undefined) {
    Logger.log(`[ERROR] ${message}: ${JSON.stringify(data)}`);
  } else {
    Logger.log(`[ERROR] ${message}`);
  }
}

/**
 * Formatting helpers.
 */
function formatMoney(value, currency) {
  var amount = Number(value) || 0;
  return amount.toLocaleString(CONFIG.defaults.locale, {
    style: "currency",
    currency: currency || CONFIG.defaults.currency,
    minimumFractionDigits: 0
  });
}

function formatDateTime(dateObj) {
  if (!(dateObj instanceof Date)) return "";
  return Utilities.formatDate(
    dateObj,
    CONFIG.defaults.timezone,
    "dd.MM.yyyy HH:mm"
  );
}

/**
 * Replace placeholders in text using a map of values.
 * Placeholders look like {{KEY}}.
 */
function replacePlaceholders(text, values) {
  return text.replace(/{{\s*([\w_]+)\s*}}/g, function(match, key) {
    var replacement = values[key];
    return replacement !== undefined ? replacement : match;
  });
}

/**
 * Shallow copy of a Google Doc template.
 */
function copyDocTemplate(templateId, namePrefix) {
  var file = DriveApp.getFileById(templateId);
  var copy = file.makeCopy(namePrefix + " " + new Date().toISOString());
  return DocumentApp.openById(copy.getId());
}

/**
 * Copy a template Spreadsheet (for invoices if using Sheets template).
 */
function copySheetTemplate(templateId, namePrefix) {
  var file = DriveApp.getFileById(templateId);
  var copy = file.makeCopy(namePrefix + " " + new Date().toISOString());
  return SpreadsheetApp.openById(copy.getId());
}

/**
 * Write key/value pairs into a Document body by placeholder replacement.
 */
function fillDocumentPlaceholders(doc, values) {
  var body = doc.getBody();
  Object.keys(values || {}).forEach(function(key) {
    body.replaceText("{{" + key + "}}", values[key]);
  });
  doc.saveAndClose();
}

/**
 * Move a file to the archive folder (if configured).
 */
function moveToArchive(fileId) {
  try {
    if (!CONFIG.sheets.archiveFolderId || CONFIG.sheets.archiveFolderId === "YOUR_DEMO_DRIVE_FOLDER_ID") {
      logWarn("Archive folder ID is not configured; skipping move", { fileId: fileId });
      return;
    }
    var archiveFolder = DriveApp.getFolderById(CONFIG.sheets.archiveFolderId);
    var file = DriveApp.getFileById(fileId);
    archiveFolder.addFile(file);
  } catch (err) {
    logError("Failed to move file to archive", { fileId: fileId, error: err });
  }
}

/**
 * Simple health check placeholder.
 */
function initDemoConfig() {
  logInfo("Demo config loaded", CONFIG);
}
