"use client";

import { useState, type ChangeEvent } from "react";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";

interface AuthFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "tel";
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
}

export function AuthField({ label, name, type = "text", hint, defaultValue = "", ...input }: AuthFieldProps) {
  // React resets uncontrolled inputs after a form action runs. Keeping the value
  // in state means a failed attempt does not wipe what the person typed;
  // passwords stay uncontrolled so they are cleared on purpose.
  const [value, setValue] = useState(defaultValue);
  const controlled = type === "password" ? { defaultValue } : { value, onChange: (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value) };
  return (
    <label className={adminLabelClasses}>
      {label}
      <input name={name} type={type} inputMode={type === "email" ? "email" : undefined} className={`${adminInputClasses} h-12`} {...input} {...controlled} />
      {hint ? <span className="text-xs font-normal text-subtle">{hint}</span> : null}
    </label>
  );
}
