// Phone numbers typed by customers. Pure module: also used by the tests.
//
// Portugal first: 9 digits starting with 2 (landline), 3 (other) or 9 (mobile), with or without
// +351 / 00351. Other countries: the dialling code chosen in the form (or typed with + / 00) and
// the number, 6 to 14 digits (at most 15 in all, as in the international standard). Stored as
// "+351 912 345 678" / "+44 7700900123", so the team can call it with one tap.

export interface PhoneCountry {
  code: string;
  name: string;
  dial: string;
}

/** The countries in the form, Portugal first; "Outro" means the number is typed with its code. */
export const phoneCountries: PhoneCountry[] = [
  { code: "PT", name: "Portugal", dial: "351" },
  { code: "ES", name: "Espanha", dial: "34" },
  { code: "FR", name: "França", dial: "33" },
  { code: "GB", name: "Reino Unido", dial: "44" },
  { code: "DE", name: "Alemanha", dial: "49" },
  { code: "IT", name: "Itália", dial: "39" },
  { code: "NL", name: "Países Baixos", dial: "31" },
  { code: "BE", name: "Bélgica", dial: "32" },
  { code: "CH", name: "Suíça", dial: "41" },
  { code: "LU", name: "Luxemburgo", dial: "352" },
  { code: "IE", name: "Irlanda", dial: "353" },
  { code: "US", name: "EUA / Canadá", dial: "1" },
  { code: "BR", name: "Brasil", dial: "55" },
  { code: "AO", name: "Angola", dial: "244" },
  { code: "MZ", name: "Moçambique", dial: "258" },
  { code: "CV", name: "Cabo Verde", dial: "238" },
];

export const portugueseNumber = /^[239]\d{8}$/;

/** "+351 912 345 678", "+44 7700900123", or null when it is not a valid number. */
export function normalizePhone(input: string, dial = "351"): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/[^\d\s()+.\-/]/.test(raw)) return null;
  let digits = raw.replace(/\D/g, "");
  const code = dial.replace(/\D/g, "");
  if (raw.startsWith("+") || raw.startsWith("00")) {
    digits = raw.startsWith("00") ? digits.slice(2) : digits;
    // Typed with its own code: Portugal is recognised, other codes are kept as typed.
    if (digits.startsWith("351")) return portugueseNumber.test(digits.slice(3)) ? formatPortuguese(digits.slice(3)) : null;
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
  }
  if (code === "351") {
    if (digits.startsWith("351") && digits.length === 12) digits = digits.slice(3);
    return portugueseNumber.test(digits) ? formatPortuguese(digits) : null;
  }
  if (!code) return null;
  // Abroad, a leading 0 is the national trunk prefix and is dropped after the country code.
  if (digits.startsWith(code) && digits.length - code.length >= 6) digits = digits.slice(code.length);
  digits = digits.replace(/^0+/, "");
  if (digits.length < 6 || digits.length > 14 || code.length + digits.length > 15) return null;
  return `+${code} ${digits}`;
}

function formatPortuguese(digits: string): string {
  return `+351 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/** Message for a number that does not pass. */
export function phoneError(dial: string): string {
  return dial === "351" ? "Um número português tem 9 algarismos e começa por 9, 2 ou 3." : dial ? "Verifique o número de telefone." : "Escreva o número com o indicativo do país, começando por +.";
}

/** "+351 912 345 678" → { dial: "351", number: "912 345 678" }, to fill the form again. */
export function splitPhone(stored: string | null | undefined): { dial: string; number: string } {
  const value = (stored ?? "").trim();
  if (!value.startsWith("+")) return { dial: "351", number: value };
  const digits = value.slice(1).replace(/\D/g, "");
  const country = [...phoneCountries].sort((a, b) => b.dial.length - a.dial.length).find((item) => digits.startsWith(item.dial));
  if (!country) return { dial: "", number: value };
  const rest = value.slice(1).replace(/^\s*/, "").slice(country.dial.length).trim();
  return { dial: country.dial, number: rest };
}
