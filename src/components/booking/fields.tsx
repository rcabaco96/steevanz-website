import Link from "next/link";
import type { ReactNode } from "react";
import { AlertIcon } from "@/components/icons";
import type { FormCopy } from "@/content/booking";
import { honeypotField } from "@/lib/booking/types";

export const inputClasses =
  "block w-full rounded-2xl border border-line bg-surface px-4 text-base text-text shadow-[inset_0_1px_0_rgb(var(--shadow-color)/0.03)] placeholder:text-subtle transition-[border-color,box-shadow] duration-200 hover:border-line-strong focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 aria-invalid:border-danger aria-invalid:ring-danger/10";

interface FieldShellProps {
  id: string;
  label: string;
  optionalLabel?: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FieldShell({ id, label, optionalLabel, error, hint, className = "", children }: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-semibold text-text">
        <span>{label}</span>
        {optionalLabel ? <span className="text-xs font-normal text-subtle">{optionalLabel}</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-subtle">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-danger" role="alert">
          <AlertIcon size={15} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
  optionalLabel?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  maxLength?: number;
  defaultValue?: string;
  error?: string;
  className?: string;
}

export function TextField({
  name,
  label,
  type = "text",
  required = false,
  optionalLabel,
  placeholder,
  autoComplete,
  inputMode,
  maxLength = 200,
  defaultValue,
  error,
  className,
}: TextFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} optionalLabel={required ? undefined : optionalLabel} error={error} className={className}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClasses} h-12`}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  optionalLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  className?: string;
}

export function TextAreaField({ name, label, optionalLabel, placeholder, defaultValue, error, className }: TextAreaFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} optionalLabel={optionalLabel} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        rows={4}
        maxLength={2000}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClasses} min-h-28 resize-y py-3 leading-relaxed`}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  optionalLabel?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function SelectField({
  name,
  label,
  options,
  optionalLabel,
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  className,
}: SelectFieldProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} optionalLabel={optionalLabel} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputClasses} h-12 cursor-pointer appearance-none pr-11`}
        >
          {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-subtle"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </FieldShell>
  );
}

interface ConsentFieldProps {
  copy: FormCopy;
  privacyHref: string;
  error?: string;
  defaultChecked?: boolean;
}

export function ConsentField({ copy, privacyHref, error, defaultChecked }: ConsentFieldProps) {
  const id = "field-consent";
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm leading-relaxed text-muted transition-colors hover:border-line-strong has-[:checked]:border-accent/50 has-[:checked]:bg-accent-soft/50"
      >
        <input
          id={id}
          name="consent"
          type="checkbox"
          required
          defaultChecked={defaultChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md accent-accent"
        />
        <span>
          {copy.consentBefore}
          <Link href={privacyHref} target="_blank" className="font-semibold text-accent-text underline underline-offset-3">
            {copy.consentLink}
          </Link>
          {copy.consentAfter}
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-danger" role="alert">
          <AlertIcon size={15} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Honeypot({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={`field-${honeypotField}`}>{label}</label>
      <input id={`field-${honeypotField}`} name={honeypotField} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

export function HiddenInputs({ values }: { values: Record<string, string> }) {
  return (
    <>
      {Object.entries(values).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
    </>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <AlertIcon size={18} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
