# Architecture (portfolio demo)

## Goals
- Demonstrate a SMED-like flow on Google Workspace without real data.
- Show separation of concerns: Sheets (data), Docs (documents), Calendar (events), Utils (config/logging).
- Keep IDs/config centralized and fictional.

## Modules
- `scripts/utils.gs`
  - Central `CONFIG` with demo IDs (Sheets, Docs templates, Drive archive, Calendar).
  - Formatting (money, datetime), placeholder replacement, doc/sheet copy helpers, logging.
- `scripts/sheets_data.gs`
  - Data access layer. Opens the main demo spreadsheet, fetches clients/projects/quotation lines, updates statuses and generated links.
  - No business logic or formatting.
- `scripts/quotations.gs`
  - Builds commercial offers from a Docs template.
  - Reads project/client/lines from Sheets, computes simple totals, injects placeholders, builds a table, saves the URL back to Sheets.
- `scripts/contracts.gs`
  - Copies a contract template Doc, fills placeholders (client/company, project, sum, quotation link), saves URL back.
- `scripts/invoices.gs`
  - Generates invoices via Doc or Sheet template (configurable). Optional PDF export using Drive.
  - Uses quotation lines to populate items and totals, saves URL back.
- `scripts/calendar_integration.gs`
  - Creates/updates a Calendar event for a project (title, time, venue, description with links), stores the eventId in Sheets.

## Data flow (high level)
1) User fills demo Sheets: Clients, Projects (with status, dates), Equipment, Quotations (line items).
2) Quotation generation copies a Docs template, fills placeholders and a table, writes back the Doc URL.
3) Contract generation uses project/client data and quotation link to fill the contract template.
4) Invoice generation uses the same data/lines; optionally exports PDF.
5) Calendar integration creates/updates an event with links to the generated docs.
6) Status changes (e.g., Sent, Archived) trigger doc generation or archiving logic (demo-level).

## What’s simplified vs. production SMED
- Pricing/discounts: simple sums, no proprietary formulas.
- Security/ACL: demo-only; no production Drive/Calendar scopes beyond test.
- Integrations: no Telegram/Avito/LLM. Only Workspace primitives.
- Data: fictional placeholders; all IDs are configurable demo values.***
