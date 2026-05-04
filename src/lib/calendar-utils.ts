/**
 * Calendar utilities — Google Calendar URL, ICS export, shareable links
 * No OAuth required for URL deep-link or ICS approaches.
 */

function pad(n: number) { return String(n).padStart(2, "0"); }

function toGCalDate(dateStr: string, timeStr?: string): string {
  // dateStr: "2026-05-10", timeStr: "10:30"
  const d = new Date(dateStr + (timeStr ? `T${timeStr}:00` : "T00:00:00"));
  if (isNaN(d.getTime())) return "";
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  if (!timeStr) return `${Y}${M}${D}`;
  const H = pad(d.getHours());
  const Mi = pad(d.getMinutes());
  return `${Y}${M}${D}T${H}${Mi}00`;
}

function toICSDate(dateStr: string, timeStr?: string): string {
  // Returns UTC format for ICS
  const d = new Date(dateStr + (timeStr ? `T${timeStr}:00` : "T00:00:00"));
  if (isNaN(d.getTime())) return "";
  if (!timeStr) {
    const Y = d.getFullYear();
    const M = pad(d.getMonth() + 1);
    const D = pad(d.getDate());
    return `${Y}${M}${D}`;
  }
  // Convert to UTC
  const utc = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return utc.toISOString().replace(/[-:]/g, "").replace(".000", "");
}

export interface CalendarEvent {
  title: string;
  date: string;         // YYYY-MM-DD
  startTime?: string;   // HH:MM (24h)
  endTime?: string;     // HH:MM (24h)
  description?: string;
  location?: string;
}

/** Opens Google Calendar with event pre-filled — no OAuth needed */
export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const start = toGCalDate(event.date, event.startTime);
  const end   = event.endTime
    ? toGCalDate(event.date, event.endTime)
    : toGCalDate(event.date, event.startTime ? addHour(event.startTime) : undefined);

  const dates = start && end ? `${start}/${end}` : start;

  const params = new URLSearchParams({
    action:  "TEMPLATE",
    text:    event.title,
    ...(dates       ? { dates }                          : {}),
    ...(event.description ? { details: event.description } : {}),
    ...(event.location    ? { location: event.location }   : {}),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Generates an ICS string for download — works with Google/Apple/Outlook */
export function buildICS(events: CalendarEvent[]): string {
  const uid = () => Math.random().toString(36).slice(2) + "@quantumkarma";
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quantum Karma//Vedic Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const ev of events) {
    const dtstart = ev.startTime
      ? `DTSTART:${toICSDate(ev.date, ev.startTime)}`
      : `DTSTART;VALUE=DATE:${toICSDate(ev.date)}`;
    const dtend   = ev.endTime
      ? `DTEND:${toICSDate(ev.date, ev.endTime)}`
      : ev.startTime
        ? `DTEND:${toICSDate(ev.date, addHour(ev.startTime))}`
        : `DTEND;VALUE=DATE:${toICSDate(ev.date)}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid()}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(".000", "")}`,
      dtstart, dtend,
      `SUMMARY:${ev.title}`,
      ...(ev.description ? [`DESCRIPTION:${ev.description.replace(/\n/g, "\\n")}`] : []),
      ...(ev.location    ? [`LOCATION:${ev.location}`] : []),
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** Download ICS file in browser */
export function downloadICS(events: CalendarEvent[], filename = "quantum-karma-events.ics") {
  const ics  = buildICS(events);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Builds a shareable Muhurat link with query params */
export function buildShareableLink(event: CalendarEvent & { choghadiya?: string; grade?: string }): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const p = new URLSearchParams({
    title:  event.title,
    date:   event.date,
    ...(event.startTime  ? { start: event.startTime }    : {}),
    ...(event.endTime    ? { end:   event.endTime }       : {}),
    ...(event.choghadiya ? { chog:  event.choghadiya }    : {}),
    ...(event.grade      ? { grade: event.grade }         : {}),
  });
  return `${base}/muhurat?${p.toString()}`;
}

function addHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return `${pad((h + 1) % 24)}:${pad(m)}`;
}
