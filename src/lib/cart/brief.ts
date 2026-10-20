// Relative imports with extensions keep this module runnable by `node --test` (tests/web-brief.test.mjs).
import { isWebProduct } from "../../content/products.ts";
import { localize } from "../i18n.ts";
import {
  briefContentStatuses,
  briefDomainStatuses,
  briefFields,
  briefGoals,
  briefMaxLength,
  webBriefCopy,
  type BriefContentStatus,
  type BriefDomainStatus,
  type BriefField,
  type BriefGoal,
} from "../../content/web-brief.ts";
import type { Locale } from "../i18n.ts";

export interface WebBrief {
  business: string;
  goal: BriefGoal;
  pages: string | null;
  site: string | null;
  domain: BriefDomainStatus | null;
  content: BriefContentStatus | null;
  deadline: string | null;
  references: string | null;
}

export type BriefResult = { ok: true; brief: WebBrief } | { ok: false; fields: BriefField[] };

/** The checkout asks for the brief when the cart has a landing page, website or online shop. */
export function cartNeedsBrief(lines: { productId: string }[]): boolean {
  return lines.some((line) => isWebProduct(line.productId));
}

function text(raw: Record<string, unknown>, field: BriefField): string | null {
  const value = raw[field];
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\r\n/g, "\n").slice(0, briefMaxLength[field]);
  return trimmed.length ? trimmed : null;
}

function choice<T extends string>(raw: Record<string, unknown>, field: BriefField, values: readonly T[]): T | null {
  const value = raw[field];
  return typeof value === "string" && (values as readonly string[]).includes(value) ? (value as T) : null;
}

/** Light validation: only what the business does and the main goal are required. */
export function parseBrief(raw: Record<string, unknown>): BriefResult {
  const business = text(raw, "webBusiness");
  const goal = choice(raw, "webGoal", briefGoals);
  const fields: BriefField[] = [];
  if (!business || business.length < 3) fields.push("webBusiness");
  if (!goal) fields.push("webGoal");
  if (fields.length || !business || !goal) return { ok: false, fields };
  return {
    ok: true,
    brief: {
      business,
      goal,
      pages: text(raw, "webPages"),
      site: text(raw, "webSite"),
      domain: choice(raw, "webDomain", briefDomainStatuses),
      content: choice(raw, "webContent", briefContentStatuses),
      deadline: text(raw, "webDeadline"),
      references: text(raw, "webReferences"),
    },
  };
}

/** The brief as label/value rows, in form order, skipping unanswered questions. */
export function briefRows(brief: WebBrief, locale: Locale): { label: string; value: string }[] {
  const copy = localize(webBriefCopy, locale);
  const values: Record<BriefField, string | null> = {
    webBusiness: brief.business,
    webGoal: copy.goals[brief.goal],
    webPages: brief.pages,
    webSite: brief.site,
    webDomain: brief.domain ? copy.domain[brief.domain] : null,
    webContent: brief.content ? copy.content[brief.content] : null,
    webDeadline: brief.deadline,
    webReferences: brief.references,
  };
  return briefFields.flatMap((field) => {
    const value = values[field];
    return value ? [{ label: copy.emailLabels[field], value }] : [];
  });
}

/** One line per answer, for the stored order (shown in the admin order page). */
export function briefDetails(brief: WebBrief, locale: Locale = "pt"): string[] {
  return [`${localize(webBriefCopy, locale).emailTitle}:`, ...briefRows(brief, locale).map((row) => `${row.label}: ${row.value}`)];
}
