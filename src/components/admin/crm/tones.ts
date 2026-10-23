import type { SiteStatus, Stage } from "@/lib/prospects/crm";

/** Colours of each stage: the chip and its dot, the dot in menus, and the pressed filter button. */
export const stageTone: Record<Stage, { chip: string; chipDot: string; dot: string; ring: string }> = {
  new: { chip: "bg-surface-2 text-muted", chipDot: "bg-subtle", dot: "bg-subtle", ring: "border-subtle text-muted" },
  contacted: { chip: "bg-accent-soft text-accent-text", chipDot: "bg-accent", dot: "bg-accent", ring: "border-accent text-accent-text" },
  interested: { chip: "bg-gold-soft text-gold-text", chipDot: "bg-gold", dot: "bg-gold", ring: "border-gold text-gold-text" },
  meeting: { chip: "bg-accent text-accent-contrast", chipDot: "bg-accent-contrast", dot: "bg-viz-1", ring: "border-viz-1 text-accent-text" },
  proposal: { chip: "bg-surface-inverse text-inverse", chipDot: "bg-inverse", dot: "bg-surface-inverse", ring: "border-text text-text" },
  customer: { chip: "bg-success-soft text-success", chipDot: "bg-success", dot: "bg-success", ring: "border-success text-success" },
  lost: { chip: "bg-danger-soft text-danger", chipDot: "bg-danger", dot: "bg-danger", ring: "border-danger text-danger" },
};

export const siteTone: Record<SiteStatus | "unchecked", string> = {
  none: "bg-accent-soft text-accent-text",
  down: "bg-danger-soft text-danger",
  ai: "bg-surface-inverse text-inverse",
  outdated: "bg-gold-soft text-gold-text",
  ok: "bg-success-soft text-success",
  unchecked: "bg-surface-2 text-subtle",
};

/** Small action buttons in a row («Ligar», «Copiar»…). */
export const actionClasses = {
  solid: "inline-flex h-10 cursor-pointer items-center rounded-lg bg-accent-soft px-2.5 text-xs font-semibold whitespace-nowrap text-accent-text transition-colors hover:brightness-95",
  whatsapp: "inline-flex h-10 cursor-pointer items-center gap-1 rounded-lg bg-whatsapp px-2.5 text-xs font-semibold whitespace-nowrap text-accent-contrast transition-colors hover:bg-accent-hover",
  ghost: "inline-flex h-10 cursor-pointer items-center rounded-lg border border-line px-2.5 text-xs font-semibold whitespace-nowrap text-muted transition-colors hover:border-muted hover:text-text",
  done: "inline-flex h-10 cursor-pointer items-center rounded-lg bg-success-soft px-2.5 text-xs font-semibold whitespace-nowrap text-success",
};
