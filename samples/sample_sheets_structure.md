# Demo Google Sheets structure (portfolio)

Use one demo spreadsheet with the tabs below. All values are fictional.

## Clients
| Col | Name      | Example               |
| --- | --------- | --------------------- |
| A   | ClientId  | C-001                 |
| B   | Name      | Client A              |
| C   | Company   | Company A             |
| D   | Email     | client.a@example.com  |
| E   | Phone     | +1000000001           |
| F   | Contact   | Event manager         |

## Projects
| Col | Name             | Example                |
| --- | ---------------- | ---------------------- |
| A   | ProjectId        | P-001                  |
| B   | ClientId         | C-001                  |
| C   | Name             | Project Sunrise        |
| D   | EventDate        | 15.07.2025 18:00       |
| E   | EventEnd         | 15.07.2025 22:00       |
| F   | Venue            | Demo Venue             |
| G   | Status           | Draft / Sent / ...     |
| H   | QuotationUrl     | https://docs.google... |
| I   | ContractUrl      | https://docs.google... |
| J   | InvoiceUrl       | https://docs.google... |
| K   | CalendarEventId  | <event id>             |

## Equipment (reference pricing)
| Col | Name     | Example         |
| --- | -------- | --------------- |
| A   | ItemId   | E-001           |
| B   | Name     | Sound System    |
| C   | Unit     | pcs             |
| D   | Price    | 5000            |

## Quotations (line items)
| Col | Name       | Example        |
| --- | ---------- | -------------- |
| A   | ProjectId  | P-001          |
| B   | Item       | Sound System   |
| C   | Quantity   | 2              |
| D   | Unit       | pcs            |
| E   | Price      | 5000           |
| F   | Description| Main PA        |

## Optional: Archive
- Separate sheet or a Drive folder referenced by `CONFIG.sheets.archiveFolderId`.
- When status becomes `Archived`, copy/move quotation docs there.***
