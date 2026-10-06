"use client";

import { useState, type ChangeEvent } from "react";
import { adminInputClasses, adminLabelClasses } from "@/components/backoffice/ui";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

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
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const controlled = isPassword ? { defaultValue } : { value, onChange: (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value) };
  const field = (
    <input
      name={name}
      type={isPassword && visible ? "text" : type}
      inputMode={type === "email" ? "email" : undefined}
      className={`${adminInputClasses} h-12 ${isPassword ? "w-full pr-12" : ""}`}
      {...input}
      {...controlled}
    />
  );
  return (
    <label className={adminLabelClasses}>
      {label}
      {isPassword ? (
        <span className="relative flex">
          {field}
          <button
            type="button"
            onClick={() => setVisible((shown) => !shown)}
            aria-label={visible ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
            aria-pressed={visible}
            style={{ right: 4, top: 4 }}
            className="absolute grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-text"
          >
            {visible ? <EyeOffIcon size={19} /> : <EyeIcon size={19} />}
          </button>
        </span>
      ) : (
        field
      )}
      {hint ? <span className="text-xs font-normal text-subtle">{hint}</span> : null}
    </label>
  );
}
