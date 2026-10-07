// iCalendar feeds for bookings: one event (the customer's "add to calendar") or the owner's
// private subscription (Google Calendar, Outlook, Apple Calendar → "From URL"). Free, one-way.

export interface FeedEvent {
  uid: string;
  start: string;
  end: string;
  title: string;
  description: string;
  cancelled?: boolean;
}

function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Lines longer than 75 octets are folded, as the spec asks (some calendars reject them otherwise). */
function fold(line: string): string {
  if (line.length <= 73) return line;
  const parts: string[] = [];
  for (let index = 0; index < line.length; index += 73) parts.push((index ? " " : "") + line.slice(index, index + 73));
  return parts.join("\r\n");
}

export function buildCalendar(name: string, events: FeedEvent[]): string {
  const stamp = icsDate(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Steevanz//Reservas//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(name)}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT15M",
    "X-PUBLISHED-TTL:PT15M",
    ...events.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.uid}@steevanz.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(event.start)}`,
      `DTEND:${icsDate(event.end)}`,
      `SUMMARY:${escapeIcs(event.title)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
      `STATUS:${event.cancelled ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
    "",
  ];
  return lines.map(fold).join("\r\n");
}
