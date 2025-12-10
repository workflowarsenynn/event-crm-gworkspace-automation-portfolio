/**
 * Google Calendar integration (portfolio demo).
 * Creates or updates an event for a project using demo Calendar ID.
 */

function upsertProjectEvent(projectId) {
  var project = fetchProjectById(projectId);
  if (!project) throw new Error("Project not found: " + projectId);

  if (!CONFIG.calendar.calendarId || CONFIG.calendar.calendarId === "YOUR_DEMO_CALENDAR_ID") {
    throw new Error("CONFIG.calendar.calendarId is not configured");
  }

  var calendar = CalendarApp.getCalendarById(CONFIG.calendar.calendarId);
  var title = (project.Name || "Project") + " — " + (project.ClientName || "");
  var start = project.EventDate instanceof Date ? project.EventDate : new Date();
  var end = project.EventEnd instanceof Date ? project.EventEnd : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  var description = buildEventDescription(project);

  var existingId = project.CalendarEventId || "";
  var event;
  if (existingId) {
    try {
      event = calendar.getEventById(existingId);
    } catch (err) {
      logWarn("Existing event not found, will create new", { projectId: projectId, error: err });
    }
  }

  if (event) {
    event.setTitle(title);
    event.setTime(start, end);
    event.setDescription(description);
    if (project.Venue) event.setLocation(project.Venue);
  } else {
    event = calendar.createEvent(title, start, end, {
      description: description,
      location: project.Venue || ""
    });
    updateCalendarEventId(projectId, event.getId());
  }

  logInfo("Calendar event upserted", { projectId: projectId, eventId: event.getId() });
  return event.getId();
}

function buildEventDescription(project) {
  var parts = [];
  parts.push("Project: " + (project.Name || ""));
  if (project.Venue) parts.push("Venue: " + project.Venue);
  if (project.QuotationUrl) parts.push("Quotation: " + project.QuotationUrl);
  if (project.ContractUrl) parts.push("Contract: " + project.ContractUrl);
  if (project.InvoiceUrl) parts.push("Invoice: " + project.InvoiceUrl);
  return parts.join("\n");
}

function updateCalendarEventId(projectId, eventId) {
  var sheet = getProjectsSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var idxId = headers.indexOf("ProjectId");
  var idxCal = headers.indexOf("CalendarEventId");
  data.forEach(function(row, i) {
    if (row[idxId] === projectId) {
      sheet.getRange(i + 2, idxCal + 1).setValue(eventId);
    }
  });
}
