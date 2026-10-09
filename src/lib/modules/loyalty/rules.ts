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

/**
 * The reward inside a sentence ("ganhe …", "faltam 3 carimbos para …"). Written with an article or a
 * number («Uma sobremesa oferecida», «2 cafés») it reads on: "ganhe uma sobremesa oferecida". Without
 * one («Sobremesa caseira») it would not ("ganhe sobremesa caseira"), so it goes in quotes as written.
 */
export function rewardInSentence(reward: string): string {
  if (/^(\d|(um|uma|uns|umas|o|a|os|as|dois|duas|três)(\s|$))/i.test(reward.trim())) return reward.charAt(0).toLowerCase() + reward.slice(1);
  return `«${reward.trim()}»`;
}

/** A reward along the way: after `at` stamps (fewer than the full card). */
export interface Milestone {
  at: number;
  reward: string;
}

export const maxMilestones = 3;

interface ProgramRewards {
  stamps_required: number;
  reward: string;
  milestones: Milestone[];
}

/** Every reward of the card in order: the milestones that fit, then the full card. */
export function cardRewards(program: ProgramRewards): Milestone[] {
  const along = program.milestones
    .filter((item) => Number.isInteger(item.at) && item.at >= 2 && item.at < program.stamps_required && item.reward.trim())
    .sort((a, b) => a.at - b.at)
    .filter((item, index, list) => index === 0 || list[index - 1].at !== item.at);
  return [...along, { at: program.stamps_required, reward: program.reward }];
}

/** The next reward from where the card is now, and how many stamps are missing for it. */
export function nextReward(stamps: number, program: ProgramRewards): Milestone & { left: number } {
  const next = cardRewards(program).find((item) => item.at > stamps) ?? cardRewards(program).at(-1)!;
  return { ...next, left: next.at - stamps };
}

/** The rewards reached by adding `amount` stamps to a card with `before` (the card starts again when full). */
export function rewardsCrossed(before: number, amount: number, program: ProgramRewards): Milestone[] {
  const rewards = cardRewards(program);
  const reached: Milestone[] = [];
  for (let k = 1; k <= amount; k++) {
    const position = ((before + k - 1) % program.stamps_required) + 1;
    const found = rewards.find((item) => item.at === position);
    if (found) reached.push(found);
  }
  return reached;
}

/** "Falta 1 carimbo para um café" / "Faltam 4 carimbos para uma sobremesa". */
export function missingText(stamps: number, program: ProgramRewards): string {
  const next = nextReward(stamps, program);
  return `${next.left === 1 ? "Falta 1 carimbo" : `Faltam ${next.left} carimbos`} para ${rewardInSentence(next.reward)}.`;
}

/** 500 → "5 €", 750 → "7,50 €". */
export function eurosText(cents: number): string {
  return `${new Intl.NumberFormat("pt-PT", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(cents / 100)} €`;
}

/** "1 carimbo por visita, a partir de 10 € de consumo" (or per visit, with no minimum). */
export function stampRuleText(minSpendCents: number | null): string {
  return minSpendCents ? `1 carimbo por visita, a partir de ${eurosText(minSpendCents)} de consumo` : "1 carimbo por visita";
}

/** "5", "7,50", "7.5" → cents; empty → null; anything else → undefined (invalid). */
export function parseEuros(text: string): number | null | undefined {
  const clean = text.trim().replace(/\s|€/g, "").replace(",", ".");
  if (!clean) return null;
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(clean)) return undefined;
  const cents = Math.round(Number(clean) * 100);
  return cents >= 1 ? cents : null;
}

/** "Junte 10 carimbos e ganhe um corte oferecido." / "Ganhe um café oferecido ao 3.º carimbo e um prato do dia ao 10.º." */
export function rewardsSentence(program: ProgramRewards): string {
  const rewards = cardRewards(program);
  if (rewards.length === 1) return `Junte ${program.stamps_required} carimbos e ganhe ${rewardInSentence(program.reward)}.`;
  const parts = rewards.map((item, index) => `${rewardInSentence(item.reward)} ao ${item.at}.º${index === 0 ? " carimbo" : ""}`);
  return `Ganhe ${parts.slice(0, -1).join(", ")} e ${parts.at(-1)}.`;
}
