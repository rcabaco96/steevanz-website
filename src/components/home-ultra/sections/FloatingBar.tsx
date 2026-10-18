"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { contact } from "@/content/home-ultra/shared";
import { whatsappUrl } from "@/lib/site";
import f from "./FloatingBar.module.css";

// The page's own floating actions, replacing the site WhatsApp bubble (chrome.css hides .whatsapp-fab).
// Below 1024px: a cream pill at the bottom with «Agendar demonstração» and a round WhatsApp button.
// From 1024px: only the round WhatsApp button, bottom right.
//
// It never covers a page call to action: one IntersectionObserver watches every
// `[data-home-ultra] [data-cta]` (hero CTAs included), the site <footer> and any
// `[data-hu-bar-avoid]` element, and the bar shows only when the page has scrolled past 200px AND none
// of them is on screen. Islands mount later, so a debounced MutationObserver re-queries the CTAs.
// The bar's own links carry no data-cta on purpose: data-cta marks what the bar must avoid.
//
// Motion: show = translateY(24px)→0 + fade, 500ms; hide = the reverse, 300ms. Reduced motion: fade only.
// Owned by the FloatingBar builder: this file and ./FloatingBar.module.css.

const SCROLL_MIN = 200;
const AVOID_SELECTOR = "[data-home-ultra] [data-cta], [data-home-ultra] [data-hu-bar-avoid]";

export function FloatingBar() {
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const bar = barRef.current;
    const onScreen = new Set<Element>();
    const watched = new Set<Element>();
    let scrolled = window.scrollY > SCROLL_MIN;
    let visible = false;

    const update = () => {
      const next = scrolled && onScreen.size === 0;
      if (next !== visible) {
        visible = next;
        setShow(next);
      }
    };

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      update();
    });

    const scan = () => {
      // Forget elements React has unmounted (e.g. a CTA inside a switched tab).
      for (const el of watched) {
        if (!el.isConnected) {
          io.unobserve(el);
          watched.delete(el);
          onScreen.delete(el);
        }
      }
      const targets: Element[] = Array.from(document.querySelectorAll(AVOID_SELECTOR));
      const footer = document.querySelector("body > footer, footer");
      if (footer) targets.push(footer);
      for (const el of targets) {
        if (watched.has(el) || bar?.contains(el)) continue;
        watched.add(el);
        io.observe(el);
      }
      update();
    };
    scan();

    // Re-query when islands mount or swap content: childList only, at most once every 250ms.
    let scanTimer: ReturnType<typeof setTimeout> | undefined;
    const root = document.querySelector("[data-home-ultra]") ?? document.body;
    const mo = new MutationObserver(() => {
      if (scanTimer !== undefined) return;
      scanTimer = setTimeout(() => {
        scanTimer = undefined;
        scan();
      }, 250);
    });
    mo.observe(root, { childList: true, subtree: true });
    // A safety rescan once the page has settled (late islands, the site footer outside the root).
    const lateScan = setTimeout(scan, 1000);

    // scrollY is read in a passive, rAF-throttled listener.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > SCROLL_MIN;
        if (next !== scrolled) {
          scrolled = next;
          update();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (scanTimer !== undefined) clearTimeout(scanTimer);
      clearTimeout(lateScan);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={f.bar}
      data-show={show ? "" : undefined}
      aria-hidden={show ? undefined : true}
      inert={!show}
    >
      <Link href={contact.demoHref} className={f.demo}>
        <span>Agendar demonstração</span>
        <ArrowRight size={18} className={f.arrow} />
      </Link>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={f.whatsapp}
        aria-label="Falar no WhatsApp"
      >
        <WhatsAppIcon size={24} />
      </a>
    </div>
  );
}
