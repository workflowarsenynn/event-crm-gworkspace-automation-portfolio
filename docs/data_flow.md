# Data Flow: Lead → Quotation → Contract → Invoice → Calendar → Archive

1) **Lead/Project intake (Sheets)**
   - Add client row to `Clients`.
   - Add project row to `Projects` (client link, date/time, venue, status=Draft).
   - Add quotation line items to `Quotations` (ProjectId + items/prices).

2) **Quotation (Docs)**
   - Run `generateQuotationDoc(projectId)`.
   - Reads client/project/lines, copies Docs quotation template, fills placeholders and a table of items.
   - Saves quotation URL back to `Projects.QuotationUrl`.
   - Optionally switch status to `Sent`.

3) **Contract (Docs)**
   - Run `generateContractDoc(projectId)` after acceptance.
   - Fills contract template with client/company data, project details, total, link to quotation.
   - Saves contract URL to `Projects.ContractUrl`.

4) **Invoice (Docs/Sheets + optional PDF)**
   - Run `generateInvoice(projectId, { exportPdf: true/false })`.
   - Uses quotation lines and totals; fills invoice template (Doc or Sheet).
   - Saves invoice URL to `Projects.InvoiceUrl`; optional PDF export via Drive.

5) **Calendar**
   - Run `upsertProjectEvent(projectId)`.
   - Creates/updates an event in the demo calendar with title/date/venue and links to quotation/contract/invoice.
   - Stores `CalendarEventId` in `Projects`.

6) **Archive**
   - When status becomes `Archived`, copy/move related documents to the demo archive folder (`CONFIG.sheets.archiveFolderId`) or tag the row in an archive sheet.

All steps use demo IDs/templates/config set in `CONFIG` and never reference production resources.***
