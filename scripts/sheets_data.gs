/**
 * Data access helpers for demo Sheets.
 * No business logic here — only reading/writing structured rows.
 */

function getMainSpreadsheet() {
  if (!CONFIG.sheets.main || CONFIG.sheets.main === "YOUR_DEMO_SHEET_ID") {
    throw new Error("CONFIG.sheets.main is not configured with a demo Sheet ID");
  }
  return SpreadsheetApp.openById(CONFIG.sheets.main);
}

function getSheetByName(name) {
  var ss = getMainSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error("Sheet not found: " + name);
  }
  return sheet;
}

function getClientsSheet() {
  return getSheetByName("Clients");
}

function getProjectsSheet() {
  return getSheetByName("Projects");
}

function getEquipmentSheet() {
  return getSheetByName("Equipment");
}

function getQuotationsSheet() {
  return getSheetByName("Quotations");
}

/**
 * Read the first matching row by projectId.
 */
function fetchProjectById(projectId) {
  var sheet = getProjectsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idx = headers.indexOf("ProjectId");
  var result = data.find(function(row) { return row[idx] === projectId; });
  if (!result) return null;
  var obj = {};
  headers.forEach(function(key, i) { obj[key] = result[i]; });
  return obj;
}

/**
 * Read the first matching client by clientId.
 */
function fetchClientById(clientId) {
  var sheet = getClientsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idx = headers.indexOf("ClientId");
  var result = data.find(function(row) { return row[idx] === clientId; });
  if (!result) return null;
  var obj = {};
  headers.forEach(function(key, i) { obj[key] = result[i]; });
  return obj;
}

/**
 * Fetch quotation lines for a project.
 */
function fetchQuotationLines(projectId) {
  var sheet = getQuotationsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idx = headers.indexOf("ProjectId");
  var lines = data.filter(function(row) { return row[idx] === projectId; });
  return lines.map(function(row) {
    var obj = {};
    headers.forEach(function(key, i) { obj[key] = row[i]; });
    return obj;
  });
}

/**
 * Update status for a project row.
 */
function updateProjectStatus(projectId, newStatus) {
  var sheet = getProjectsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idxId = headers.indexOf("ProjectId");
  var idxStatus = headers.indexOf("Status");
  data.forEach(function(row, i) {
    if (row[idxId] === projectId) {
      sheet.getRange(i + 2, idxStatus + 1).setValue(newStatus);
    }
  });
}

/**
 * Persist generated document links back into Sheets.
 */
function saveGeneratedLinks(projectId, links) {
  var sheet = getProjectsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idxId = headers.indexOf("ProjectId");
  var idxQuote = headers.indexOf("QuotationUrl");
  var idxContract = headers.indexOf("ContractUrl");
  var idxInvoice = headers.indexOf("InvoiceUrl");

  data.forEach(function(row, i) {
    if (row[idxId] === projectId) {
      if (links.quotation) sheet.getRange(i + 2, idxQuote + 1).setValue(links.quotation);
      if (links.contract) sheet.getRange(i + 2, idxContract + 1).setValue(links.contract);
      if (links.invoice) sheet.getRange(i + 2, idxInvoice + 1).setValue(links.invoice);
    }
  });
}
