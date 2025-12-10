/**
 * Invoice generation (portfolio demo).
 * Can use a Docs template or a Sheet template. Also supports optional PDF export.
 */

function generateInvoice(projectId, options) {
  options = options || {};
  var project = fetchProjectById(projectId);
  if (!project) throw new Error("Project not found: " + projectId);

  var client = fetchClientById(project.ClientId);
  if (!client) throw new Error("Client not found: " + project.ClientId);

  var lines = fetchQuotationLines(projectId);
  var totals = computeTotals(lines);
  var link;

  if (CONFIG.templates.invoiceDoc && CONFIG.templates.invoiceDoc !== "YOUR_INVOICE_TEMPLATE_ID") {
    link = generateInvoiceDoc(project, client, lines, totals);
  } else if (CONFIG.templates.invoiceSheet && CONFIG.templates.invoiceSheet !== "YOUR_INVOICE_SHEET_TEMPLATE_ID") {
    link = generateInvoiceSheet(project, client, lines, totals);
  } else {
    throw new Error("No invoice template configured (Doc or Sheet)");
  }

  saveGeneratedLinks(projectId, { invoice: link });

  if (options.exportPdf === true) {
    link = exportFileAsPdf(link);
  }

  logInfo("Invoice generated", { projectId: projectId, url: link });
  return link;
}

function generateInvoiceDoc(project, client, lines, totals) {
  var doc = copyDocTemplate(CONFIG.templates.invoiceDoc, "Invoice");
  var values = {
    CLIENT_NAME: client.Name || "Client",
    CLIENT_COMPANY: client.Company || "",
    CLIENT_EMAIL: client.Email || "",
    CLIENT_PHONE: client.Phone || "",
    PROJECT_NAME: project.Name || "Project",
    PROJECT_DATE: formatDateTime(project.EventDate || new Date()),
    INVOICE_TOTAL: formatMoney(totals.totalWithTax),
    QUOTATION_LINK: project.QuotationUrl || ""
  };
  fillDocumentPlaceholders(doc, values);
  insertInvoiceTable(doc, lines, totals);
  doc.saveAndClose();
  return doc.getUrl();
}

function insertInvoiceTable(doc, lines, totals) {
  var body = doc.getBody();
  body.appendParagraph("Invoice items").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  var table = [["#", "Description", "Qty", "Unit", "Price", "Amount"]];
  lines.forEach(function(line, idx) {
    var qty = Number(line.Quantity) || 0;
    var price = Number(line.Price) || 0;
    var amount = qty * price;
    table.push([
      idx + 1,
      line.Item || "",
      qty,
      line.Unit || "pcs",
      formatMoney(price),
      formatMoney(amount)
    ]);
  });
  table.push(["", "", "", "", "Total", formatMoney(totals.totalWithTax)]);
  body.appendTable(table);
}

function generateInvoiceSheet(project, client, lines, totals) {
  var ss = copySheetTemplate(CONFIG.templates.invoiceSheet, "Invoice");
  var sheet = ss.getSheets()[0];
  sheet.getRange("B2").setValue(client.Name || "Client");
  sheet.getRange("B3").setValue(client.Company || "");
  sheet.getRange("B4").setValue(client.Email || "");
  sheet.getRange("B5").setValue(client.Phone || "");
  sheet.getRange("B7").setValue(project.Name || "Project");
  sheet.getRange("B8").setValue(project.Venue || "");
  sheet.getRange("B9").setValue(project.EventDate || "");

  var startRow = 12;
  lines.forEach(function(line, idx) {
    var row = startRow + idx;
    sheet.getRange(row, 1, 1, 6).setValues([[
      idx + 1,
      line.Item || "",
      line.Description || "",
      Number(line.Quantity) || 0,
      formatMoney(Number(line.Price) || 0),
      formatMoney((Number(line.Quantity) || 0) * (Number(line.Price) || 0))
    ]]);
  });
  sheet.getRange(startRow + lines.length + 1, 6).setValue(formatMoney(totals.totalWithTax));
  ss.toast("Invoice filled");
  return ss.getUrl();
}

function exportFileAsPdf(fileUrl) {
  try {
    var fileId = DriveApp.getFileById(fileUrl.split("/d/")[1].split("/")[0]).getId();
    var file = DriveApp.getFileById(fileId);
    var blob = file.getAs("application/pdf");
    var pdf = DriveApp.createFile(blob);
    logInfo("PDF exported", { pdfUrl: pdf.getUrl() });
    return pdf.getUrl();
  } catch (err) {
    logError("Failed to export PDF", { fileUrl: fileUrl, error: err });
    return fileUrl;
  }
}
