import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { ReelFrame } from "@/components/marketing/ReelFrame";
import { Section, SectionHeader } from "@/components/ui/Section";
import { reelEmbedUrl, showcaseReels } from "@/content/showcase-reels";

// Hidden test page (owner, 2026-10-14): not in the menus, the sitemap or search engines.
export const metadata: Metadata = {
  title: "Reels",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/**
 * Only the video of Instagram's embed shows (owner: «o mínimo possível do layout do Instagram»). The
 * embed is a 54 px header, then the video in a 4:5 box (a 9:16 reel with black bars at the sides),
 * then Instagram's footer, measured on 2026-10-14. The iframe is made 16/9 ÷ 1.25 = 142.2% as wide
 * as the 9:16 card, so its 4:5 box is exactly as tall as the card, centred (the bars fall outside)
 * and lifted by the header's 54 px; the footer falls below. If Instagram changes the embed, these
 * numbers change with it.
 */
const igHeader = 54;
/**
 * The video is shown 4% larger than the card, centred: phones lay the embed out a few pixels
 * differently (an iPhone showed a line of Instagram's footer, 2026-10-14), and the margin hides them.
 */
const overscan = 1.04;
const widthRatio = (16 / 9 / 1.25) * overscan;

export default async function ReelsPage({ searchParams }: PageProps<"/raza17raza">) {
  // ?simples=1 (diagnosis, 2026-10-14): Instagram's embed as it comes, no crop, no nudge, to tell an
  // iPhone that can't play Instagram embeds at all from one our cropping gets in the way of.
  const plain = (await searchParams).simples === "1";
  // The embeds come from these hosts: the connections are open before the first card needs them.
  for (const host of ["https://www.instagram.com", "https://static.cdninstagram.com", "https://scontent.cdninstagram.com"]) preconnect(host);
  const reels = showcaseReels.flatMap((reel) => {
    const embed = reelEmbedUrl(reel.url);
    return embed ? [{ ...reel, embed }] : [];
  });
  return (
    <Section labelledBy="reels-title">
      <SectionHeader as="h1" id="reels-title" eyebrow="Reels" title="Os vídeos dos nossos clientes" lead="Os reels dos negócios que trabalham com a Steevanz." />
      {plain ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reels.slice(0, 3).map((reel) => (
            <li key={reel.embed} className="card overflow-hidden p-3">
              <iframe src={reel.embed} title={`Reel de ${reel.name}`} allow="encrypted-media; picture-in-picture; web-share" className="h-[640px] w-full border-0" />
            </li>
          ))}
        </ul>
      ) : reels.length ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reels.map((reel) => (
            <li key={reel.embed} className="card flex flex-col gap-3 p-3">
              {/*
                clip-path makes iPhones (WebKit) clip the playing video to the rounded corners too. Not a
                mask: with -webkit-mask-image the iPhone stopped passing taps to the video (2026-10-14).
              */}
              <div
                className="relative isolate aspect-[9/16] w-full overflow-hidden rounded-2xl bg-surface-inverse"
                style={{ clipPath: "inset(0 round 1rem)" }}
              >
                <ReelFrame
                  src={reel.embed}
                  title={`Reel de ${reel.name}`}
                  style={{
                    maxWidth: "none",
                    width: `${widthRatio * 100}%`,
                    left: `${((1 - widthRatio) / 2) * 100}%`,
                    top: `calc(${-((overscan - 1) / 2) * 100}% - ${igHeader}px)`,
                    height: `calc(${overscan * 100}% + ${igHeader + 4}px)`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-1 pb-1">
                <span className="min-w-0 truncate font-semibold text-text">{reel.name}</span>
                <a href={reel.url} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold text-accent-text hover:underline">
                  @{reel.account}
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted">Ainda não há reels para mostrar.</p>
      )}
    </Section>
  );
}
