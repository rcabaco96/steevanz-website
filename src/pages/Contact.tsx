import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageShell from "../components/PageShell";
import AccentScene from "../components/AccentScene";
import { Eyebrow } from "../components/ui/Eyebrow";
import { Reveal } from "../components/ui/Reveal";
import { useLanguage } from "../i18n/LanguageContext";

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-fog)"
    >
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--color-line) bg-(--color-surface)/60 px-4 py-3.5 text-(--color-bone) outline-none transition-colors duration-300 placeholder:text-(--color-fog)/50 focus:border-(--color-gold) focus:bg-(--color-surface-2)";

export default function Contact() {
  const { c } = useLanguage();
  const ct = c.contact;
  const [topic, setTopic] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setError(false);
    setStatus("loading");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          topic,
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(true);
    }
  };

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-44 pb-28">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 50% at 80% 0%, rgba(214,168,92,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-7xl gap-16 px-6 sm:px-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          {/* LEFT — copy + 3D accent */}
          <div>
            <Reveal>
              <Eyebrow>{ct.hero.eyebrow}</Eyebrow>
              <h1 className="mt-7 max-w-md font-display text-5xl leading-[1.04] tracking-tight text-(--color-bone) sm:text-6xl">
                {ct.hero.titlePre}{" "}
                <span className="italic text-(--color-gold)">
                  {ct.hero.titleEm}
                </span>{" "}
                {ct.hero.titlePost}
              </h1>
              <p className="mt-4 max-w-sm font-mono text-xs uppercase tracking-[0.18em] text-(--color-fog)">
                {ct.hero.quoteAttr}
              </p>
              <p className="mt-7 max-w-sm text-balance leading-relaxed text-(--color-fog)">
                {ct.hero.body}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="relative mt-10 hidden h-72 sm:block">
              <AccentScene
                variant="field"
                color="#cfa563"
                className="h-full [&_canvas]:!h-full"
              />
            </Reveal>

            <Reveal
              delay={0.15}
              className="mt-10 space-y-4 font-mono text-sm text-(--color-fog)"
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-(--color-gold)" />
                <a
                  href="mailto:rcabaco@steevanz.com"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  rcabaco@steevanz.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-(--color-gold)" />
                <a
                  href="tel:+351928069072"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  +351 928 069 072
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-(--color-gold)" />
                <span>{ct.info.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-(--color-gold)" />
                <a
                  href="https://www.instagram.com/steevanz_"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-(--color-bone)"
                >
                  @Steevanz_
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — form */}
          <Reveal delay={0.05}>
            <div className="relative overflow-hidden rounded-[2rem] border border-(--color-line) bg-(--color-surface)/50 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 16,
                        delay: 0.1,
                      }}
                      className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-(--color-gold) to-(--color-violet-500) text-2xl text-(--color-void)"
                    >
                      ✓
                    </motion.span>
                    <h3 className="mt-7 font-display text-3xl tracking-tight text-(--color-bone)">
                      {ct.form.sentTitle}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-(--color-fog)">
                      {ct.form.sentBody}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <FieldLabel htmlFor="name">
                          {ct.form.nameLabel}
                        </FieldLabel>
                        <input
                          id="name"
                          name="name"
                          required
                          placeholder={ct.form.namePlaceholder}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <FieldLabel htmlFor="email">
                          {ct.form.emailLabel}
                        </FieldLabel>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder={ct.form.emailPlaceholder}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor="company">
                        {ct.form.companyLabel}
                      </FieldLabel>
                      <input
                        id="company"
                        name="company"
                        placeholder={ct.form.companyPlaceholder}
                        className={inputClass}
                      />
                    </div>

                    <fieldset>
                      <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-fog)">
                        {ct.form.topicsLegend}
                      </legend>
                      <div className="flex flex-wrap gap-2.5">
                        {ct.form.topics.map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setTopic(t)}
                            className={`relative rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                              topic === t
                                ? "border-(--color-gold) text-(--color-bone)"
                                : "border-(--color-line) text-(--color-fog) hover:text-(--color-bone)"
                            }`}
                          >
                            {topic === t && (
                              <motion.span
                                layoutId="topic-pill"
                                className="absolute inset-0 -z-10 rounded-full bg-(--color-gold)/15"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 32,
                                }}
                              />
                            )}
                            {t}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <FieldLabel htmlFor="message">
                        {ct.form.messageLabel}
                      </FieldLabel>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        placeholder={ct.form.messagePlaceholder}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: status === "idle" ? 1.015 : 1 }}
                      whileTap={{ scale: status === "idle" ? 0.985 : 1 }}
                      className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-(--color-bone) px-6 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-(--color-void) transition-colors duration-300 hover:bg-(--color-gold-bright) disabled:cursor-wait"
                      disabled={status === "loading"}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {status === "loading" ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center gap-2.5"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="h-3.5 w-3.5 rounded-full border-2 border-(--color-void)/30 border-t-(--color-void)"
                            />
                            {ct.form.submitLoading}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                          >
                            {ct.form.submitIdle}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    <AnimatePresence mode="wait" initial={false}>
                      {error ? (
                        <motion.p
                          key="error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-(--color-ember)"
                        >
                          {ct.form.errorMessage}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="disclaimer"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-(--color-fog)/60"
                        >
                          {ct.form.disclaimer}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
