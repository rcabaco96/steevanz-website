import type { FerragialCopy } from "@/content/ferragial/copy";
import { Reveal } from "./Reveal";

// The family behind the wines (fictional, and the page says so): no photographs of people — stock faces would
// pretend to be them — only their initials, pressed like the monogram on a cork, and what each one does.
export function Family({ copy }: { copy: FerragialCopy }) {
  const { family } = copy;
  return (
    <section aria-labelledby="fg-family-title" className="bg-cal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="fg-label mb-5 flex items-center gap-3 text-barro">
            <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
            {family.eyebrow}
          </p>
          <h2 id="fg-family-title" className="font-display text-[clamp(2.6rem,9vw,5.2rem)] leading-[0.95]">
            {family.title} <span className="text-tinto">{family.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[1.04rem] leading-[1.75] text-pedra">{family.text}</p>
          <p className="mt-3 text-sm text-pedra">{family.note}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3 lg:self-end">
          {family.people.map((person, i) => (
            <li key={person.name}>
              <Reveal delay={i * 120} className="flex h-full flex-col rounded-2xl bg-cal-2 p-6">
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d9b48a,#a8784c)] font-display text-2xl text-mosto shadow-[inset_0_0_0_3px_rgb(58_10_23/0.15)]"
                >
                  {person.initials}
                </span>
                <p className="mt-6 font-display text-[1.8rem] leading-none">{person.name}</p>
                <p className="fg-label mt-2 text-[0.62rem] text-barro">{person.role}</p>
                <p className="mt-3 leading-relaxed text-pedra">{person.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
