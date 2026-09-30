"use client";

import Link from "next/link";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useState, useTransition, type FormEvent } from "react";
import { ArrowRight, Check, InfoIcon, SparkleIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import type { FormField, InfoRequestCopy } from "@/content/booking";
import { submitLead, type LeadActionState } from "@/lib/booking/actions";
import type { LeadKind } from "@/lib/booking/types";
import type { Locale } from "@/lib/i18n";
import {
  ConsentField,
  FormAlert,
  HiddenInputs,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
  type SelectOption,
} from "./fields";

interface InfoRequestFormProps {
  locale: Locale;
  copy: InfoRequestCopy;
  products: SelectOption[];
  sectors: SelectOption[];
  initialProductId: string;
  initialKind: LeadKind;
  tracking: Record<string, string>;
  links: { privacy: string; book: string; home: string };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function InfoRequestForm({
  locale,
  copy,
  products,
  sectors,
  initialProductId,
  initialKind,
  tracking,
  links,
}: InfoRequestFormProps) {
  const t = copy.form;
  const [kind, setKind] = useState<LeadKind>(initialKind);
  const [result, setResult] = useState<LeadActionState>({ status: "idle" });
  const [pending, startTransition] = useTransition();
  const errorFields: FormField[] = result.status === "error" ? result.fields : [];
  const fieldError = (field: FormField) => (errorFields.includes(field) ? t.fieldErrors[field] : undefined);
  const generalError =
    result.status === "error"
      ? result.code === "rate_limited"
        ? t.rateLimitedError
        : result.code === "unavailable"
          ? t.unavailableError
          : result.code === "validation"
            ? null
            : t.genericError
      : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("referrer", document.referrer.slice(0, 300));
    startTransition(async () => {
      const response = await submitLead({ status: "idle" }, formData);
      startTransition(() => setResult(response));
    });
  }

  const kindOptions: { value: LeadKind; icon: typeof InfoIcon }[] = [
    { value: "info_request", icon: InfoIcon },
    { value: "waitlist", icon: SparkleIcon },
  ];

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="card relative overflow-hidden">
          <div aria-hidden="true" className="glow-backdrop pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative px-5 py-6 sm:px-8 sm:py-8">
            <AnimatePresence mode="wait" initial={false}>
              {result.status === "success" ? (
                <m.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
                  className="flex flex-col items-center gap-6 py-6 text-center"
                  role="status"
                >
                  <m.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }}
                    className="grid h-18 w-18 place-items-center rounded-full bg-success-soft text-success"
                  >
                    <Check size={36} strokeWidth={2.2} />
                  </m.span>
                  <div className="flex max-w-lg flex-col gap-3">
                    <h2 className="display text-3xl sm:text-4xl">{copy.success.title}</h2>
                    <p className="text-muted">{copy.success.body}</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href={links.book} className={buttonClasses("primary", "md")}>
                      {copy.success.book}
                      <ArrowRight size={18} />
                    </Link>
                    <Link href={links.home} className={buttonClasses("secondary", "md")}>
                      {copy.success.home}
                    </Link>
                  </div>
                </m.div>
              ) : (
                <m.form
                  key="form"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease } }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-3 text-sm font-semibold text-text">{copy.kindLegend}</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {kindOptions.map(({ value, icon: Icon }) => {
                        const selected = kind === value;
                        return (
                          <label
                            key={value}
                            className={[
                              "relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] duration-200",
                              selected
                                ? "border-accent bg-accent-soft/60 shadow-[0_12px_28px_-20px_rgb(var(--glow)/0.9)]"
                                : "border-line bg-surface hover:border-line-strong",
                            ].join(" ")}
                          >
                            <input
                              type="radio"
                              name="kind"
                              value={value}
                              checked={selected}
                              onChange={() => setKind(value)}
                              className="peer sr-only"
                            />
                            <span
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${selected ? "bg-accent text-accent-contrast" : "bg-surface-2 text-accent-text"}`}
                            >
                              <Icon size={19} />
                            </span>
                            <span className="flex flex-col gap-0.5">
                              <span className="font-semibold text-text">{copy.kinds[value].title}</span>
                              <span className="text-sm text-muted">{copy.kinds[value].body}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring" />
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {generalError ? <FormAlert>{generalError}</FormAlert> : null}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField
                      name="productId"
                      label={t.labels.productId}
                      options={products}
                      placeholder={t.productUndecided}
                      defaultValue={initialProductId}
                      error={fieldError("productId")}
                      className="sm:col-span-2"
                    />
                    <TextField
                      name="name"
                      label={t.labels.name}
                      required
                      autoComplete="name"
                      placeholder={t.placeholders.name}
                      maxLength={120}
                      error={fieldError("name")}
                    />
                    <TextField
                      name="email"
                      type="email"
                      label={t.labels.email}
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder={t.placeholders.email}
                      error={fieldError("email")}
                    />
                    <TextField
                      name="phone"
                      type="tel"
                      label={t.labels.phone}
                      optionalLabel={t.optional}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={t.placeholders.phone}
                      maxLength={24}
                      error={fieldError("phone")}
                    />
                    <TextField
                      name="businessName"
                      label={t.labels.businessName}
                      optionalLabel={t.optional}
                      autoComplete="organization"
                      placeholder={t.placeholders.businessName}
                      maxLength={160}
                      error={fieldError("businessName")}
                    />
                    <SelectField
                      name="sector"
                      label={t.labels.sector}
                      optionalLabel={t.optional}
                      options={sectors}
                      placeholder={t.sectorPlaceholder}
                      defaultValue=""
                      error={fieldError("sector")}
                      className="sm:col-span-2"
                    />
                    <TextAreaField
                      name="message"
                      label={t.labels.message}
                      optionalLabel={t.optional}
                      placeholder={t.placeholders.message}
                      error={fieldError("message")}
                      className="sm:col-span-2"
                    />
                  </div>

                  <ConsentField copy={t} privacyHref={links.privacy} error={fieldError("consent")} />
                  <Honeypot label={t.honeypotLabel} />
                  <HiddenInputs values={{ ...tracking, locale }} />

                  <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted">
                      {copy.preferDemo}{" "}
                      <Link href={links.book} className="font-semibold text-accent-text underline underline-offset-3">
                        {copy.preferDemoCta}
                      </Link>
                    </p>
                    <button type="submit" disabled={pending} aria-busy={pending} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                      {pending ? (
                        <>
                          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                          {t.sending}
                        </>
                      ) : (
                        <>
                          {copy.submit}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
