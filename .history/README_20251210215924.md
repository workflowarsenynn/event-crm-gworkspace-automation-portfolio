# Event CRM & G Workspace Automation (Portfolio)

Portfolio-only demo of a SMED-like CRM built on Google Workspace. All code and data here are fictional and scoped for a safe public GitHub showcase. Nothing in this repo touches the real SMED system or production assets.

## What this demo shows
- Google Sheets as the system of record for Clients, Projects/Events, Equipment, Quotations.
- Generation of Google Docs from templates:
  - Quotations/Commercial offers (Doc template with placeholders).
  - Contracts (Doc template with placeholders).
  - Invoices (Doc or Sheet template; optional PDF export).
- Google Calendar integration: create/update an event for a project (title, datetime, venue, description, link to quotation).
- Simple status lifecycle: Draft → Sent → Approved → Paid → Archived (e.g., Sent creates quotation + calendar event; Archived marks/copies a quotation).
- Modular Apps Script layout: data layer, document generation, calendar integration, shared utils/config.

## Repository layout
```
scripts/                 Apps Script source (modular, no “god-file”)
  sheets_data.gs         Data access to demo Sheets (CRUD helpers, no biz logic)
  quotations.gs          Builds quotations from Sheets data + Docs template
  contracts.gs           Builds contracts from Sheets data + Docs template
  invoices.gs            Builds invoices (Docs/Sheets) + optional PDF export
  calendar_integration.gs Calendar event creation/update for projects
  utils.gs               Central config (demo IDs), formatting, logging helpers

samples/                 Demo data and sheet layouts (fictional)
  sample_sheets_structure.md  Columns and tabs for demo Sheets
  sample_data.json            Fake clients/projects/equipment/quotation lines

docs/
  architecture.md        How modules talk to Sheets/Docs/Calendar
  data_flow.md           Scenario: lead → quotation → contract → invoice → calendar → archive

appsscript.json          Minimal manifest (timezone, runtime); fill IDs yourself
```

## Safety and scoping
- **Do not** edit, rename, or remove any files of the real SMED project. This repo is isolated and uses only demo IDs.
- All IDs/tokens must be test/demo values or configurable placeholders (e.g., `DOC_TEMPLATE_ID`, `SHEET_ID`, `CALENDAR_ID`).
- No real client data, prices, discounts, or business formulas. Use fictional names (Company A, Client B, Project X) and simple sums.

## Quick start (demo)
1) Create demo resources in a personal Google account (not production): one Sheet with tabs from `samples/sample_sheets_structure.md`, Docs templates for quotation/contract/invoice, optional Sheet template for invoices, Drive folder for archive, and a demo Calendar.
2) Open `scripts/utils.gs` and fill the `CONFIG` object with the demo IDs (Sheet, templates, archive folder, calendar). Keep `defaults` as-is unless you need another locale/timezone.
3) Import the code into an Apps Script project (copy/paste files or use `clasp push` with your own `.clasp.json`). Keep the manifest settings from `appsscript.json` (V8, Europe/Moscow).
4) Run `initDemoConfig()` to verify the config loads and logs in the console.
5) Populate demo data in Sheets (use `samples/sample_data.json` as a reference). Key functions to run:
   - `generateQuotationDoc(projectId)` → creates a quotation Doc and stores the URL in Sheets.
   - `generateContractDoc(projectId)` → creates a contract Doc using the quotation link.
   - `generateInvoice(projectId, { exportPdf: true/false })` → creates an invoice Doc/Sheet and optional PDF.
   - `upsertProjectEvent(projectId)` → creates/updates a Calendar event with links to generated docs.
6) Switch project status to `Archived` (value from `CONFIG.defaults.archiveStatus`) when you want to move/copy docs to the archive folder.


## Demo data and docs
- `samples/sample_sheets_structure.md` — columns/tabs for the demo spreadsheet.
- `samples/sample_data.json` — fictional sample rows to copy into Sheets.
- `docs/architecture.md` — modules and responsibilities.
- `docs/data_flow.md` — step-by-step flow from lead to archive.
- `docs/portfolio_guide_ru.md` — Russian setup/publishing guide for this portfolio.

## Real-world SMED system (production)

This portfolio repo is based on a real SMED system used in an event production company.  
In production, SMED:

- Stores all projects, clients, equipment and financials in a central Google Sheets workbook.
- Generates commercial offers, contracts and invoices in Google Docs/Sheets from structured data.
- Syncs key project data into Google Calendar (events per project, with equipment summary and links back to Sheets).
- Tracks deal status and profitability (margin, costs, prepayments, remaining balance).
- Integrates with other tooling (CRM/telephony/messaging) on top of Google Workspace.

The code here is a sanitized architecture-only version: same ideas and workflows, but with demo IDs and anonymized data.

## Screenshots from the real SMED system

> These screenshots are taken from the production SMED environment (client and company details anonymized).  
> They illustrate what the full system looks like beyond this portfolio demo.

- Main project & quotation sheet:
  ![SMED quotation builder (header and lines)](docs/screenshots/smed_quotation_builder_1.png)

- Project totals, profit and client requisites:
  ![SMED totals and client requisites](docs/screenshots/smed_totals_and_client_requisites.png)

- Quotation lines block (items table):
  ![SMED quotation builder (items table)](docs/screenshots/smed_quotation_builder_2.png)

- Equipment catalog:
  ![SMED equipment list](docs/screenshots/smed_equipment_list.png)

- Contract template with placeholders:
  ![SMED contract template](docs/screenshots/smed_contract_template.png)

- Invoice template (Google Sheets):
  ![SMED invoice sheet](docs/screenshots/smed_invoice_sheet.png)

- Google Calendar event created from a project:
  ![SMED calendar event](docs/screenshots/smed_calendar_event.png)

- Apps Script module that generates quotations:
  ![SMED Apps Script exportQuotation](docs/screenshots/smed_apps_script_export_quotation.png)

## Publishing on GitHub
- This repository contains only demo code and placeholders; no secrets or production IDs. Verify `CONFIG` still has placeholders before committing.
- Add your own `.clasp.json` (if you use clasp) to `.gitignore` locally so tokens do not leak.
- Suggested push flow:
  1) `git init && git add . && git commit -m "Initial portfolio"`
  2) `git remote add origin https://github.com/workflowarsenynn/event-crm-gworkspace-automation-portfolio.git`
  3) `git push -u origin main`

## What is intentionally simplified
- Pricing/discount logic is trivial (sum + optional flat discount), no proprietary formulas.
- No integration with Telegram/Avito/LLMs in this portfolio.
- No production IDs or sensitive config; everything is fictional and configurable.

## Beyond the demo (real SMED scope, not included here)
- Advanced pricing rules, taxes, multi-currency, and custom discounts.
- Operational reporting, financial dashboards, integrations with external lead sources.
- Production calendars, Drive folder automation with ACLs, notification pipelines.

Use this repo as a reference architecture only. All improvements and experiments must stay inside the portfolio folder.***
