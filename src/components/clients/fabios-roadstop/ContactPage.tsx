import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { MailIcon } from "./icons";
import { PageHero } from "./PageHero";
import { Social } from "./Social";
import { Visit } from "./Visit";

export function ContactPage({ copy }: { copy: FabiosCopy }) {
  const { contact } = copy;
  return (
    <>
      <PageHero
        eyebrow={contact.eyebrow}
        title={contact.title}
        titleScript={contact.titleScript}
        intro={contact.intro}
        image={fabios.media.lemonades}
        width={fabiosImageSize.lemonades.width}
        height={fabiosImageSize.lemonades.height}
      />

      <section aria-labelledby="fr-topics-title" className="bg-paper py-14 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <h2 id="fr-topics-title" className="font-display text-3xl uppercase sm:text-4xl">
            {contact.topicsTitle}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {contact.topics.map((topic) => (
              <li key={topic.label}>
                <a
                  href={`mailto:${fabios.email}?subject=${encodeURIComponent(topic.subject)}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-cream px-5 font-bold text-ink shadow-[0_6px_16px_-10px_rgb(28_21_18/0.5)] ring-1 ring-ink/10 transition-colors hover:bg-cherry hover:text-cream"
                >
                  <MailIcon width={18} height={18} />
                  {topic.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Visit copy={copy} />
      <Social copy={copy} />
    </>
  );
}
