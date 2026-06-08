import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import type { ReactNode } from "react";

/**
 * Scrub-tied clip-path/scale reveal: content unmasks from an inset frame as it
 * settles into the viewport — pairs with PageShell's section-snap so the cut
 * resolves right as the section comes to rest.
 */
export function ScrollReveal({
  children,
  className = "",
  from = 22,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          clipPath: `inset(${from}% round ${from * 0.9}px)`,
          scale: 0.96,
          opacity: 0.25,
        },
        {
          clipPath: "inset(0% round 0px)",
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 48%",
            scrub: 0.5,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
