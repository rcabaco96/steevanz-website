// Billing details the client fills in to accept a proposal, checked on the server. Pure and runnable by
// `node --test` (tests/proposals.test.mjs).

export const acceptanceFields = ["company", "nif", "address", "postalCode", "city", "contact", "email", "phone", "notes"] as const;
export type AcceptanceField = (typeof acceptanceFields)[number];

/** The checkbox «Li e aceito a proposta e as condições». */
export const acceptField = "accept";

export type AcceptanceValues = Record<AcceptanceField, string>;
export type AcceptanceErrors = Partial<Record<AcceptanceField | typeof acceptField, string>>;

export interface BillingDetails {
  company: string;
  /** Normalised: 9 digits for a Portuguese NIF, «ES B12345678»-style for a foreign VAT number. */
  nif: string;
  nifIsPortuguese: boolean;
  address: string;
  postalCode: string;
  city: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
}

export type AcceptanceResult = { ok: true; data: BillingDetails } | { ok: false; errors: AcceptanceErrors; values: AcceptanceValues };

const maxLength: Record<AcceptanceField, number> = {
  company: 160,
  nif: 20,
  address: 200,
  postalCode: 12,
  city: 80,
  contact: 120,
  email: 254,
  phone: 30,
  notes: 2000,
};

const requiredMessage: Record<Exclude<AcceptanceField, "notes">, string> = {
  company: "Indique o nome da empresa ou a razão social.",
  nif: "Indique o NIF da empresa.",
  address: "Indique a morada de faturação.",
  postalCode: "Indique o código postal.",
  city: "Indique a localidade.",
  contact: "Indique o nome da pessoa de contacto.",
  email: "Indique o email para onde enviamos as faturas.",
  phone: "Indique um telefone de contacto.",
};

/** Portuguese NIF: 9 digits, a known first digit (or 45/7x for the special ranges) and the mod-11 check digit. */
export function isValidPortugueseNif(value: string): boolean {
  if (!/^\d{9}$/.test(value)) return false;
  const first = value[0];
  if (first === "0" || (first === "4" && !value.startsWith("45"))) return false;
  let sum = 0;
  for (let index = 0; index < 8; index += 1) sum += Number(value[index]) * (9 - index);
  const remainder = sum % 11;
  const check = remainder < 2 ? 0 : 11 - remainder;
  return check === Number(value[8]);
}

export type NifCheck = { ok: true; value: string; portuguese: boolean } | { ok: false; message: string };

/**
 * A Portuguese NIF (with or without the «PT» prefix) or a foreign VAT number with its two-letter
 * country prefix («ES B12345678», «FR 12345678901»).
 */
export function checkNif(raw: string): NifCheck {
  const compact = raw.toUpperCase().replace(/[\s.\-/]/g, "");
  if (!compact) return { ok: false, message: requiredMessage.nif };
  const portuguese = compact.startsWith("PT") ? compact.slice(2) : compact;
  if (/^\d+$/.test(portuguese)) {
    if (portuguese.length !== 9) return { ok: false, message: "O NIF português tem 9 dígitos. Confirme o número." };
    if (!isValidPortugueseNif(portuguese)) return { ok: false, message: "Este NIF não é válido. Confirme os 9 dígitos." };
    return { ok: true, value: portuguese, portuguese: true };
  }
  const foreign = /^([A-Z]{2})([A-Z0-9]{2,14})$/.exec(compact);
  if (foreign && foreign[1] !== "PT" && /\d/.test(foreign[2])) return { ok: true, value: `${foreign[1]} ${foreign[2]}`, portuguese: false };
  return { ok: false, message: "Indique um NIF português (9 dígitos) ou um número de IVA estrangeiro com o código do país (ex.: ES B12345678)." };
}

/** «1200-195»; «1200195» and «1200 195» are accepted and written with the hyphen. */
export function normalizePostalCode(raw: string): string | null {
  const match = /^(\d{4})[\s-]?(\d{3})$/.exec(raw.trim());
  return match ? `${match[1]}-${match[2]}` : null;
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(value);
}

function clean(value: FormDataEntryValue | null | undefined, field: AcceptanceField): string {
  if (typeof value !== "string") return "";
  const text = field === "notes" ? value.replace(/\r\n/g, "\n").trim() : value.replace(/\s+/g, " ").trim();
  return text.slice(0, maxLength[field]);
}

export function readAcceptanceValues(source: FormData): AcceptanceValues {
  return Object.fromEntries(acceptanceFields.map((field) => [field, clean(source.get(field), field)])) as AcceptanceValues;
}

export function validateAcceptance(source: FormData): AcceptanceResult {
  const values = readAcceptanceValues(source);
  const errors: AcceptanceErrors = {};

  for (const field of Object.keys(requiredMessage) as (keyof typeof requiredMessage)[]) {
    if (!values[field]) errors[field] = requiredMessage[field];
  }

  let nif: NifCheck | null = null;
  if (values.nif) {
    nif = checkNif(values.nif);
    if (!nif.ok) errors.nif = nif.message;
  }

  // A foreign client has a foreign postal code: only the Portuguese format is enforced for a Portuguese NIF.
  let postalCode = values.postalCode;
  if (values.postalCode && !(nif?.ok && !nif.portuguese)) {
    const normalized = normalizePostalCode(values.postalCode);
    if (normalized) postalCode = normalized;
    else errors.postalCode = "Escreva o código postal no formato 0000-000.";
  }

  const email = values.email.toLowerCase();
  if (values.email && !isValidEmail(email)) errors.email = "Este email não parece válido. Confirme, por exemplo: nome@empresa.pt.";

  if (values.phone && values.phone.replace(/\D/g, "").length < 9) errors.phone = "Indique um telefone com pelo menos 9 dígitos.";

  if (source.get(acceptField) !== "on") errors.accept = "Para adjudicar, confirme que leu e aceita a proposta e as condições.";

  if (Object.keys(errors).length || !nif?.ok) return { ok: false, errors, values };

  return {
    ok: true,
    data: { ...values, nif: nif.value, nifIsPortuguese: nif.portuguese, postalCode, email },
  };
}
