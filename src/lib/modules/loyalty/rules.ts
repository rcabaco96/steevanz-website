// Loyalty card rules. Pure module: also used by the tests.

/** Card codes avoid characters that look alike (0/O, 1/I/L). */
export const codeAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** A 6-character card code from random bytes (one per character). */
export function cardCodeFrom(bytes: Uint8Array): string {
  return Array.from(bytes.slice(0, 6), (byte) => codeAlphabet[byte % codeAlphabet.length]).join("");
}

/** "K7P29Q" → "K7P 29Q" (easier to read out loud). */
export function formatCardCode(code: string): string {
  return `${code.slice(0, 3)} ${code.slice(3)}`;
}

/** What staff type in the panel search: spaces and lowercase are fine. */
export function normalizeCardCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export const staffCodeLength = 6;

export function isStaffCode(value: string): boolean {
  return new RegExp(`^\\d{${staffCodeLength}}$`).test(value);
}

/** Wrong staff codes on one card before it is locked for a while (stops guessing). */
export const maxCodeAttempts = 5;
export const codeLockMinutes = 15;

export function isLocked(lockedUntil: string | null, now: number): boolean {
  return Boolean(lockedUntil && Date.parse(lockedUntil) > now);
}

/** Stamp circles of the card: filled, then empty. */
export function stampSlots(stamps: number, required: number): boolean[] {
  return Array.from({ length: required }, (_, index) => index < stamps);
}

/** "Pode receber outro carimbo às 15:40". */
export function cooldownMessage(nextAllowedAt: string, timeZone: string): string {
  const time = new Intl.DateTimeFormat("pt-PT", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date(nextAllowedAt));
  const sameDay =
    new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date(nextAllowedAt)) === new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  return sameDay
    ? `Este cartão já recebeu um carimbo há pouco. O próximo pode ser dado a partir das ${time}.`
    : `Este cartão já recebeu um carimbo há pouco. O próximo pode ser dado a partir de ${new Intl.DateTimeFormat("pt-PT", {
        timeZone,
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(nextAllowedAt))}.`;
}
