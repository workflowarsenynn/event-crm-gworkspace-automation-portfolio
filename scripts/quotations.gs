/**
 * Quotation / commercial offer generation (portfolio demo).
 * Reads project + client + quotation lines from Sheets, fills a Docs template, and writes back URLs.
 */

function generateQuotationDoc(projectId) {
  var project = fetchProjectById(projectId);
  if (!project) throw new Error("Project not found: " + projectId);

  var client = fetchClientById(project.ClientId);
  if (!client) throw new Error("Client not found: " + project.ClientId);

  var lines = fetchQuotationLines(projectId);
  var totals = computeTotals(lines);

  var doc = copyDocTemplate(CONFIG.templates.quotationDoc, "Quotation");
  fillDocumentPlaceholders(doc, buildQuotationPlaceholders(project, client, totals));
  insertQuotationTable(doc, lines, totals);
  doc.saveAndClose();

  var url = doc.getUrl();
  saveGeneratedLinks(projectId, { quotation: url });
  logInfo("Quotation generated", { projectId: projectId, url: url });
  return url;
}

function buildQuotationPlaceholders(project, client, totals) {
  return {
    CLIENT_NAME: client.Name || "Client",
    CLIENT_CONTACT: client.Contact || "",
    PROJECT_NAME: project.Name || "Project",
    PROJECT_DATE: formatDateTime(project.EventDate || new Date()),
    PROJECT_VENUE: project.Venue || "",
    TOTAL_WITH_TAX: formatMoney(totals.totalWithTax),
    TOTAL_NET: formatMoney(totals.subtotal),
    DISCOUNT: formatMoney(totals.discount || 0)
  };
}

function computeTotals(lines) {
  var subtotal = 0;
  lines.forEach(function(line) {
    var qty = Number(line.Quantity) || 0;
    var price = Number(line.Price) || 0;
    subtotal += qty * price;
  });
  var discount = 0; // demo: no complex pricing
  var totalWithTax = subtotal - discount;
  return { subtotal: subtotal, discount: discount, totalWithTax: totalWithTax };
}

function insertQuotationTable(doc, lines, totals) {
  var body = doc.getBody();
  body.appendParagraph("Items").setHeading(DocumentApp.ParagraphHeading.HEADING2);

  var tableData = [];
  tableData.push(["#", "Item", "Qty", "Unit", "Price", "Total"]);
  lines.forEach(function(line, idx) {
    var qty = Number(line.Quantity) || 0;
    var price = Number(line.Price) || 0;
    var total = qty * price;
    tableData.push([
      idx + 1,
      line.Item || "",
      qty,
      line.Unit || "pcs",
      formatMoney(price),
      formatMoney(total)
    ]);
  });
  tableData.push(["", "", "", "", "Subtotal", formatMoney(totals.subtotal)]);
  if (totals.discount) {
    tableData.push(["", "", "", "", "Discount", formatMoney(totals.discount)]);
  }
  tableData.push(["", "", "", "", "Total", formatMoney(totals.totalWithTax)]);

  body.appendTable(tableData);
}
