"use client";

import { useId, useState, type FormEvent } from "react";
import { grob, grobModalities, toConfirm } from "@/content/grob/facts";
import type { ContactReason } from "./contact-bus";
import { Listbox } from "./Listbox";

const reasons: { id: ContactReason; label: string }[] = [
  { id: "inscricao", label: "Inscrição" },
  { id: "socio", label: "Ser sócio" },
  { id: "aluguer", label: "Aluguer da sede" },
  { id: "outro", label: "Outro assunto" },
];

type Tone = "light" | "dark";

/** Claro no fim da página; verde-escuro na gaveta (dono, 2026-11-02). Contraste AA nos dois. */
const styles: Record<Tone, { root: string; field: string; label: string; hint: string; pill: string; pillOn: string; note: string; submit: string; info: string }> = {
  light: {
    root: "text-tinta",
    field:
      "mt-1 block h-[2.875rem] w-full rounded-xl border-0 bg-white px-3.5 text-[0.98rem] text-tinta ring-1 ring-tinta/15 outline-none transition-[box-shadow,background-color] duration-[var(--gb-dur)] placeholder:text-cinza/70 focus:shadow-[0_0_0_4px_rgb(16_162_75/0.15)] focus:ring-2 focus:ring-relva",
    label: "text-[0.7rem] font-semibold tracking-[0.05em] text-tinta/80 uppercase transition-colors group-focus-within:text-relva-escuro",
    hint: "text-cinza",
    pill: "bg-white text-tinta ring-tinta/15 hover:ring-relva",
    pillOn: "bg-pavilhao text-giz ring-pavilhao",
    note: "text-cinza",
    submit: "bg-pavilhao text-giz hover:bg-relva-escuro",
    info: "bg-relva/10 text-tinta/85",
  },
  dark: {
    root: "text-giz",
    field:
      "mt-1 block h-[2.875rem] w-full rounded-xl border-0 bg-[#164a2b] px-3.5 text-[0.98rem] text-giz ring-1 ring-giz/15 outline-none transition-[box-shadow,background-color] duration-[var(--gb-dur)] placeholder:text-giz/50 focus:bg-[#1a5432] focus:shadow-[0_0_0_4px_rgb(100_186_76/0.18)] focus:ring-2 focus:ring-relva-claro [color-scheme:dark]",
    label: "text-[0.7rem] font-semibold tracking-[0.05em] text-giz/80 uppercase transition-colors group-focus-within:text-relva-claro",
    hint: "text-giz/65",
    pill: "bg-[#164a2b] text-giz ring-giz/15 hover:ring-relva-claro",
    pillOn: "bg-relva-claro text-pavilhao ring-relva-claro",
    note: "text-giz/70",
    submit: "bg-relva-claro text-pavilhao hover:bg-amarelo",
    info: "bg-[#164a2b] text-giz/90",
  },
};

/** Para onde vai cada mensagem (emails da página Contactos do clube). */
function recipient(reason: ContactReason, modality: string) {
  if (reason === "inscricao") return grobModalities.find((m) => m.id === modality)?.email ?? grob.emailGeneral;
  if (reason === "aluguer") return grob.emailEvents;
  return grob.emailGeneral;
}

// O formulário único do site: inscrição numa modalidade, ser sócio, aluguer da sede ou outro assunto. Os campos
// da inscrição são os do formulário do site atual (sem o n.º do cartão de cidadão, que não deve seguir por email).
// Sem servidor nesta demo: ao enviar, abre o email do visitante com a mensagem já escrita para o endereço certo.
// Vive no fim da página e na gaveta lateral (ContactDrawer), com o motivo e a modalidade já escolhidos.
export function ContactForm({
  initialReason = "inscricao",
  initialModality = "",
  tone = "light",
}: {
  initialReason?: ContactReason;
  initialModality?: string;
  tone?: Tone;
}) {
  const id = useId();
  const s = styles[tone];
  const field = s.field;
  const labelText = s.label;
  const [reason, setReason] = useState<ContactReason>(initialReason);
  const [modality, setModality] = useState(initialModality);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const chosen = grobModalities.find((m) => m.id === modality);
    const name = `${get("nome")} ${get("apelido")}`.trim();
    const label = reasons.find((r) => r.id === reason)?.label ?? "Contacto";
    const subject = reason === "inscricao" ? `Inscrição — ${chosen?.name ?? "Modalidade"} — ${name}` : `${label} — ${name}`;
    const lines =
      reason === "inscricao"
        ? [
            `Olá, gostaria de fazer a inscrição no ${grob.short}.`,
            "",
            `Atleta: ${name}`,
            `Data de nascimento: ${get("nascimento")}`,
            `Modalidade: ${chosen?.name ?? ""}`,
            `Concelho de residência: ${get("concelho")}`,
          ]
        : [reason === "socio" ? `Olá, gostaria de ser sócio do ${grob.short}.` : `Olá, escrevo ao ${grob.short}.`, "", `Nome: ${name}`];
    const body = [
      ...lines,
      `Email: ${get("email")}`,
      `Telefone: ${get("telefone")}`,
      ...(reason === "aluguer" ? [`Data pretendida: ${get("data")}`] : []),
      ...(get("mensagem") ? ["", get("mensagem")] : []),
      "",
      "Obrigado.",
    ].join("\n");
    window.location.href = `mailto:${recipient(reason, modality)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const athlete = reason === "inscricao";

  return (
    <form onSubmit={onSubmit} className={s.root}>
      <fieldset>
        <legend className={labelText}>Motivo</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {reasons.map((r) => (
            <label
              key={r.id}
              className={`flex h-11 cursor-pointer items-center justify-center rounded-full px-2 text-center text-[0.78rem] leading-tight font-semibold ring-1 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amarelo ${
                reason === r.id ? s.pillOn : s.pill
              }`}
            >
              <input type="radio" name="motivo" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="sr-only" />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      {reason === "socio" ? (
        <p className={`mt-3 rounded-xl p-3 text-[0.85rem] leading-relaxed ${s.info}`}>
          A quota é de <strong>{grob.memberFee} por mês</strong>. Pode deixar aqui os seus dados ou preencher já o{" "}
          <a href={grob.memberForm} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
            formulário de sócio do clube
            <span className="sr-only"> (abre noutro separador)</span>
          </a>
          .
        </p>
      ) : null}

      <div className="mt-4 grid gap-x-3 gap-y-2.5 sm:grid-cols-2">
        <label className="group block">
          <span className={labelText}>{athlete ? "Nome do atleta" : "Nome"}</span>
          <input name="nome" required autoComplete="given-name" className={field} />
        </label>
        <label className="group block">
          <span className={labelText}>Apelido</span>
          <input name="apelido" required autoComplete="family-name" className={field} />
        </label>
        {athlete ? (
          <>
            <label className="group block">
              <span className={labelText}>Data de nascimento</span>
              <span className="relative block">
                <input name="nascimento" type="date" required className={`gb-date ${field} pr-11`} />
                <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-3.5 mt-0.5 h-[18px] w-[18px] -translate-y-1/2 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <rect x="3.5" y="5" width="17" height="15" rx="3" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" />
                </svg>
              </span>
            </label>
            <div className="group block">
              <span id={`${id}-mod`} className={labelText}>
                Modalidade
              </span>
              <Listbox
                name="modalidade"
                value={modality}
                onChange={setModality}
                options={grobModalities.map((m) => ({ value: m.id, label: m.name }))}
                placeholder="Escolha…"
                required
                tone={tone}
                labelId={`${id}-mod`}
              />
            </div>
            <label className="group block sm:col-span-2">
              <span className={labelText}>Concelho de residência</span>
              <input name="concelho" autoComplete="address-level2" className={field} />
            </label>
          </>
        ) : null}
        <label className="group block">
          <span className={labelText}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="group block">
          <span className={labelText}>Telefone</span>
          <input name="telefone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
        </label>
        {athlete ? <p className={`-mt-1 text-[0.72rem] sm:col-span-2 ${s.hint}`}>Email e telefone do encarregado de educação ou do atleta.</p> : null}
        {reason === "aluguer" ? (
          <label className="group block sm:col-span-2">
            <span className={labelText}>Data pretendida</span>
            <input name="data" type="date" className={field} />
          </label>
        ) : null}
        {!athlete ? (
          <label className="group block sm:col-span-2" htmlFor={`${id}-msg`}>
            <span className={labelText}>Mensagem</span>
            <textarea id={`${id}-msg`} name="mensagem" rows={3} className={`${field} h-auto py-3`} />
          </label>
        ) : null}
      </div>

      <button
        type="submit"
        className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[0.9rem] font-bold transition-colors ${s.submit}`}
      >
        Enviar
        <span aria-hidden="true">→</span>
      </button>
      <p className={`mt-2.5 text-[0.78rem] leading-relaxed ${s.note}`} aria-live="polite">
        {sent ? "O seu email abriu com a mensagem escrita: só falta enviar. O clube responde brevemente." : "Ao enviar, abre o seu email com a mensagem já escrita para o clube."}
      </p>
      {athlete ? <p className={`gb-confirm mt-1 ${s.note}`}>Escalões, horários e quotas das modalidades: {toConfirm}</p> : null}
    </form>
  );
}
