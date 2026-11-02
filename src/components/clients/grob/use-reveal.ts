"use client";

import { useEffect, useState, type RefObject } from "react";

// Entra uma vez, quando o elemento chega ao ecrã (IntersectionObserver, sem scroll listeners nem GSAP). As
// transições são CSS, só em transform e opacidade; com movimento reduzido o CSS deixa tudo no lugar.
export function useReveal(ref: RefObject<HTMLElement | null>, margin = "0px 0px -12% 0px") {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return shown;
}
