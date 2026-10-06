const locale = "pt-PT";
const timeZone = "Europe/Lisbon";

const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const twoDecimals = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
const percentPrecise = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 });

export const weekdayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const weekdayLong = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

export function formatInt(value: number): string {
  return integer.format(value);
}

export function formatRating(value: number | null): string {
  return value === null ? "–" : oneDecimal.format(value);
}

export function formatDecimal(value: number | null): string {
  return value === null ? "–" : twoDecimals.format(value);
}

export function formatPercent(value: number | null, precise = false): string {
  if (value === null) return "–";
  return (precise ? percentPrecise : percent).format(value);
}

export function formatSignedPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${integer.format(value)}%`;
}

export function formatHours(hours: number | null): string {
  if (hours === null) return "–";
  if (hours < 1) return `${integer.format(Math.max(1, hours * 60))} min`;
  if (hours < 48) return `${integer.format(hours)} h`;
  return `${integer.format(hours / 24)} dias`;
}

const monthsShort = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const monthsLong = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const zoned = new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function parts(iso: string) {
  const values = Object.fromEntries(zoned.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return { year: values.year, month: Number(values.month) - 1, day: Number(values.day), time: `${values.hour}:${values.minute}` };
}

/** Bucket keys are `YYYY-MM-DD` (day/week) or `YYYY-MM` (month). */
export function formatBucket(key: string, long = false): string {
  const [year, month, day] = key.split("-");
  const monthIndex = Number(month) - 1;
  if (!day) return long ? `${monthsLong[monthIndex]} ${year}` : `${monthsShort[monthIndex]} ${year.slice(2)}`;
  return `${Number(day)} ${monthsShort[monthIndex]}`;
}

export function formatDate(iso: string): string {
  const { year, month, day } = parts(iso);
  return `${day} ${monthsShort[month]} ${year}`;
}

export function formatDateTime(iso: string): string {
  const { year, month, day, time } = parts(iso);
  const sameYear = year === parts(new Date().toISOString()).year;
  return `${day} ${monthsShort[month]}${sameYear ? "" : ` ${year}`}, ${time}`;
}
