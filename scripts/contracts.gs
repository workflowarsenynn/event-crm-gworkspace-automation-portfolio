/**
 * Contract generation (portfolio demo).
 * Copies a Docs contract template and replaces placeholders with project/client data.
 */

function generateContractDoc(projectId) {
  var project = fetchProjectById(projectId);
  if (!project) throw new Error("Project not found: " + projectId);

  var client = fetchClientById(project.ClientId);
  if (!client) throw new Error("Client not found: " + project.ClientId);

  var doc = copyDocTemplate(CONFIG.templates.contractDoc, "Contract");
  var values = {
    CLIENT_NAME: client.Name || "Client",
    CLIENT_COMPANY: client.Company || "Company",
    CLIENT_EMAIL: client.Email || "",
    CLIENT_PHONE: client.Phone || "",
    PROJECT_NAME: project.Name || "Project",
    PROJECT_DATE: formatDateTime(project.EventDate || new Date()),
    PROJECT_VENUE: project.Venue || "",
    CONTRACT_SUM: formatMoney(project.Total || 0),
    QUOTATION_LINK: project.QuotationUrl || ""
  };
  fillDocumentPlaceholders(doc, values);
  var url = doc.getUrl();
  saveGeneratedLinks(projectId, { contract: url });
  logInfo("Contract generated", { projectId: projectId, url: url });
  return url;
}
