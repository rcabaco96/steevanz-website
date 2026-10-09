"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { isNegative } from "@/lib/reviews/analytics";
import { saveReplySettingsAction } from "@/lib/reviews/reply-actions";
import { addressOptions, autoLimitOptions, lengthOptions, maxTones, toneOptions, type ReplySettings } from "@/lib/reviews/replies";
import { formatDate } from "@/lib/reviews/format";
import { inferMinReplies, ownerReplyMinChars } from "@/lib/reviews/owner-replies";
import type { TrainingReview } from "@/lib/reviews/reply-store";
import { AutoReplyChoice } from "./AutoReplyChoice";
import { InfoTip } from "./InfoTip";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";


const steps = [
  { title: "O seu tom", lead: "Como fala com os seus clientes." },
  { title: "Responda como se fosse você", lead: "As respostas são montadas com as suas próprias frases. Quanto mais responder, mais soam a si." },
  { title: "Reviews só com estrelas", lead: "Muitas reviews não têm texto. Como gosta de lhes responder?" },
  { title: "Contacto e resposta automática", lead: "Para onde encaminhar quem ficou insatisfeito, e quanto o sistema pode aprovar sozinho." },
];

const fieldClasses =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-[0.95rem] text-text placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-ring";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-text">{label}</span>
      {hint ? <span className="-mt-1 text-xs text-subtle">{hint}</span> : null}
      {children}
    </label>
  );
}

function Choice({ selected, onClick, title, detail }: { selected: boolean; onClick: () => void; title: string; detail?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-12 flex-col items-start justify-center rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
        selected ? "border-accent bg-accent-soft text-text" : "border-line bg-surface text-muted hover:border-line-strong hover:text-text"
      }`}
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        {selected ? <Check size={15} className="text-accent-text" /> : null}
        {title}
      </span>
      {detail ? <span className="text-xs text-subtle">{detail}</span> : null}
    </button>
  );
}

/** What the first setup took from the owner's replies on Google (inferReplySettings). */
export interface ReplyPrefill {
  /** Form fields filled from the replies. */
  fields: string[];
  replies: number;
  portuguese: number;
  /** Replies whose sentences are learned when the form is saved. */
  learnable: number;
}

/** Form fields on each step that can come from the owner's replies. */
const prefillSteps: Record<number, string[]> = {
  0: ["addressForm", "length", "emojis", "signature"],
  2: ["emptyPositive", "emptyNegative"],
  3: ["negativeContact"],
};

/** «Preenchido a partir das suas respostas no Google», with how each answer was worked out (rule 7). */
function PrefillNote({ prefill }: { prefill: ReplyPrefill }) {
  return (
    <p className="flex items-start gap-1.5 rounded-xl bg-accent-soft p-3 text-sm text-text">
      <span>Preenchido a partir das suas respostas no Google — confirme ou mude.</span>
      <InfoTip label="Preenchido a partir das suas respostas no Google">
        Lemos as {prefill.replies} respostas que deu no Google ({prefill.portuguese} em português). Tratamento: «Tu» ou «Você» se uma forma aparece em pelo menos 2 respostas
        em português com 6 ou mais palavras e o dobro das vezes da outra; «Sem tratamento» se menos de 1 em 5 dessas respostas fala diretamente com a pessoa. Tamanho: «Média» se
        a resposta típica (a mediana) tem 4 ou mais frases. Emojis: se pelo menos 1 em 3 respostas a reviews positivas tem um. Assinatura: a última linha repetida em pelo menos
        3 respostas. Contacto: um email ou telefone dado em pelo menos 2 respostas a reviews negativas. Reviews só com estrelas: a resposta que mais repetiu, pelo menos 2 vezes.
        Com menos de {inferMinReplies} respostas, nada disto é adivinhado; o tom também não. Nada fica guardado até confirmar no fim.
      </InfoTip>
    </p>
  );
}

interface ReplyOnboardingProps {
  slug: string;
  initial: ReplySettings;
  /** First setup only: answers taken from the owner's replies on Google. */
  prefilled?: ReplyPrefill | null;
  candidates: TrainingReview[];
  editing: boolean;
}

export function ReplyOnboarding({ slug, initial, prefilled = null, candidates, editing }: ReplyOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      candidates.map((review) => [review.id, review.ownerReply ?? ""]),
    ),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const set = <K extends keyof ReplySettings>(key: K, value: ReplySettings[K]) => setSettings((current) => ({ ...current, [key]: value }));
  const last = step === steps.length - 1;
  const prefilledHere = Boolean(prefilled && (prefillSteps[step] ?? []).some((field) => prefilled.fields.includes(field)));

  function toggleTone(id: string) {
    const has = settings.tone.includes(id);
    if (has) set("tone", settings.tone.filter((tone) => tone !== id));
    else set("tone", [...settings.tone, id].slice(-maxTones));
  }

  function next() {
    setError(null);
    if (step === 0 && settings.tone.length === 0) {
      setError("Escolha pelo menos um tom.");
      return;
    }
    if (!last) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    startSaving(async () => {
      const result = await saveReplySettingsAction(slug, {
        signature: settings.signature,
        addressForm: settings.addressForm,
        tone: settings.tone,
        length: settings.length,
        emojis: settings.emojis,
        training: candidates.map((review) => ({ reviewId: review.id, answer: answers[review.id] ?? "" })),
        emptyPositive: settings.emptyPositive,
        emptyNegative: settings.emptyNegative,
        negativeContact: settings.negativeContact,
        autoMode: settings.autoMode,
        autoLimit: settings.autoLimit,
        autoNegative: settings.autoNegative,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push(`/painel/${slug}/respostas`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">{editing ? "Definições das respostas" : "Respostas automáticas · Configuração"}</p>
        <h1 className="display text-[2rem] leading-tight sm:text-4xl">{steps[step].title}</h1>
        <p className="text-muted">{steps[step].lead}</p>
      </div>

      <ol aria-label={`Passo ${step + 1} de ${steps.length}`} className="grid grid-cols-4 gap-1.5">
        {steps.map((item, index) => (
          <li key={item.title} className="flex flex-col gap-1.5">
            <span className={`h-1.5 rounded-full ${index <= step ? "bg-accent" : "bg-surface-2"}`} />
            <span className={`hidden text-xs sm:block ${index === step ? "font-semibold text-text" : "text-subtle"}`}>{item.title}</span>
          </li>
        ))}
      </ol>

      <div className="card flex flex-col gap-6 p-4 sm:p-6">
        {prefilled && prefilledHere ? <PrefillNote prefill={prefilled} /> : null}
        {step === 1 && prefilled?.learnable ? (
          <p className="rounded-xl bg-accent-soft p-3 text-sm text-text">
            Já tem {prefilled.learnable} {prefilled.learnable === 1 ? "resposta" : "respostas"} no Google em português com pelo menos {ownerReplyMinChars} caracteres: as frases
            delas entram nas suas frases quando guardar, por isso essas reviews não aparecem aqui.
          </p>
        ) : null}
        {step === 0 ? (
          <>
            <Field label="Tom" hint={`Escolha até ${maxTones}.`}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {toneOptions.map((tone) => (
                  <Choice key={tone.id} selected={settings.tone.includes(tone.id)} onClick={() => toggleTone(tone.id)} title={tone.label} detail={tone.hint} />
                ))}
              </div>
            </Field>
            <Field label="Como trata os clientes?">
              <div className="grid gap-2 sm:grid-cols-3">
                {addressOptions.map((option) => (
                  <Choice key={option.id} selected={settings.addressForm === option.id} onClick={() => set("addressForm", option.id)} title={option.label} detail={option.example} />
                ))}
              </div>
            </Field>
            <Field label="Tamanho das respostas">
              <div className="grid grid-cols-2 gap-2">
                {lengthOptions.map((option) => (
                  <Choice key={option.id} selected={settings.length === option.id} onClick={() => set("length", option.id)} title={option.label} detail={option.example} />
                ))}
              </div>
            </Field>
            <Field label="Emojis">
              <div className="grid grid-cols-2 gap-2">
                <Choice selected={!settings.emojis} onClick={() => set("emojis", false)} title="Nunca" />
                <Choice selected={settings.emojis} onClick={() => set("emojis", true)} title="Um, nas positivas" detail="Ex.: «Até breve! 😊»" />
              </div>
            </Field>
            <Field label="Assinatura (opcional)" hint="Aparece no fim de cada resposta. Ex.: «Rui, Café Central» ou «A equipa do Café Central».">
              <input className={fieldClasses} value={settings.signature} maxLength={80} onChange={(event) => set("signature", event.target.value)} />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          candidates.length ? (
            <>
              <p className="text-sm text-muted">
                Estas são reviews reais do seu negócio. Escreva a resposta que daria no Google. Cada frase sua é guardada e reutilizada em reviews parecidas (agradecimentos, temas como o atendimento ou a espera, despedidas).
              </p>
              {candidates.map((review) => (
                <div key={review.id} className="flex flex-col gap-3 rounded-2xl border border-line p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <Stars rating={review.rating} size={14} />
                      <span className="sr-only">{review.rating} estrelas</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isNegative(review.rating) ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>
                        {isNegative(review.rating) ? "Negativa" : "Positiva"}
                      </span>
                    </span>
                    <span className="text-xs text-subtle">{formatDate(review.publishedAt)}</span>
                  </div>
                  <ReviewText text={review.text} />
                  <Field label="A sua resposta" hint={review.ownerReply ? "Preenchida com a resposta que já deu no Google. Pode melhorá-la." : undefined}>
                    <textarea
                      className={`${fieldClasses} min-h-28`}
                      maxLength={1500}
                      value={answers[review.id] ?? ""}
                      onChange={(event) => setAnswers((current) => ({ ...current, [review.id]: event.target.value }))}
                    />
                  </Field>
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted">
              Ainda não há reviews com texto suficiente para treinar. Pode avançar: começamos com frases-base e aprendemos com as respostas que editar.
            </p>
          )
        ) : null}

        {step === 2 ? (
          <>
            <Field label="Reviews de 4 ou 5 estrelas sem texto" hint="Usamos esta resposta nas reviews de 4 ou 5 estrelas sem texto.">
              <textarea
                className={`${fieldClasses} min-h-24`}
                maxLength={400}
                placeholder="Ex.: Muito obrigado pelas 5 estrelas! Esperamos vê-lo em breve."
                value={settings.emptyPositive}
                onChange={(event) => set("emptyPositive", event.target.value)}
              />
            </Field>
            <Field label="Reviews de 1 a 3 estrelas sem texto" hint="Sem saber o motivo, o melhor é convidar a pessoa a contar o que correu mal.">
              <textarea
                className={`${fieldClasses} min-h-24`}
                maxLength={400}
                placeholder="Ex.: Lamentamos que a experiência não tenha sido a melhor. Gostávamos de saber o que aconteceu para melhorar."
                value={settings.emptyNegative}
                onChange={(event) => set("emptyNegative", event.target.value)}
              />
            </Field>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Field label="Contacto para reviews negativas" hint="Para onde convidamos quem ficou insatisfeito a falar consigo em privado.">
              <input
                className={fieldClasses}
                maxLength={200}
                placeholder="Ex.: geral@cafecentral.pt ou 912 345 678"
                value={settings.negativeContact}
                onChange={(event) => set("negativeContact", event.target.value)}
              />
            </Field>
            <AutoReplyChoice
              mode={settings.autoMode}
              limit={settings.autoLimit}
              negative={settings.autoNegative}
              limits={autoLimitOptions}
              onChange={(value) => setSettings((current) => ({ ...current, autoMode: value.mode, autoLimit: value.limit, autoNegative: value.negative }))}
            />
          </>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} disabled={saving} className={buttonClasses("ghost", "md")}>
            <ArrowLeft size={17} /> Voltar
          </button>
        ) : editing ? (
          <button type="button" onClick={() => router.push(`/painel/${slug}/respostas`)} className={buttonClasses("ghost", "md")}>
            Cancelar
          </button>
        ) : (
          <span />
        )}
        <button type="button" onClick={next} disabled={saving} aria-busy={saving} className={buttonClasses("primary", "md")}>
          {last ? (saving ? "A guardar…" : editing ? "Guardar" : "Guardar e começar") : "Continuar"}
          {last ? null : <ArrowRight size={17} />}
        </button>
      </div>
      {editing ? (
        <p className="text-center text-xs text-subtle">
          Mudar o tom, o tratamento, o tamanho, os emojis ou as respostas a reviews só com estrelas cria um tom novo (a assinatura e o contacto não). O que foi aprendido no tom atual fica guardado e volta se repuser as mesmas respostas.
        </p>
      ) : null}
      {!editing ? <p className="text-center text-xs text-subtle">Passo {step + 1} de {steps.length} · Pode mudar tudo depois em «Definições».</p> : null}
    </div>
  );
}
