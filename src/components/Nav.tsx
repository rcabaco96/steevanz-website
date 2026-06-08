import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSwitch } from "./ui/LanguageSwitch";

export default function Nav() {
  const { pathname } = useLocation();
  const { c } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const PRIMARY = [
    { to: "/", label: c.nav.links.home, num: "01" },
    { to: "/silky-software", label: c.nav.links.silkySoftware, num: "02" },
    { to: "/neighbourhood", label: c.nav.links.neighbourhood, num: "03" },
    { to: "/networking", label: c.nav.links.networking, num: "04" },
  ];

  const ALL_LINKS = [...PRIMARY, { to: "/reach-out", label: c.nav.links.reachOut, num: "05" }];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-500 sm:px-8 ${
            scrolled
              ? "mx-4 border border-(--color-line)/70 bg-(--color-ink)/70 py-2 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(155,95,214,0.35)] sm:mx-auto"
              : "border border-transparent py-2"
          }`}
        >
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-(--color-violet-900) shadow-[0_0_24px_-4px_rgba(214,168,92,0.55)] transition-transform duration-500 group-hover:rotate-[18deg]">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(214,168,92,0.55),transparent_65%)]" />
              <span className="relative font-display text-lg font-semibold text-(--color-cream)">S</span>
            </span>
            <span className="font-display text-xl tracking-tight text-(--color-bone)">
              Steevanz<span className="text-(--color-gold)">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {PRIMARY.map((link) => (
              <NavLink key={link.to} link={link} active={pathname === link.to} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitch />
            <Link
              to="/reach-out"
              className="rounded-full border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-gold-bright) transition-all duration-300 hover:border-(--color-gold) hover:bg-(--color-gold)/20 hover:text-(--color-bone)"
            >
              {c.nav.talk}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitch compact />
            <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-(--color-line) lg:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="h-px w-4 bg-(--color-bone)"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="h-px w-4 bg-(--color-bone)"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="h-px w-4 bg-(--color-bone)"
            />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-(--color-void)/95 backdrop-blur-2xl lg:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
              className="flex h-full flex-col items-start justify-center gap-1.5 overflow-y-auto px-10 py-28"
            >
              {ALL_LINKS.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <Link
                    to={link.to}
                    className="flex items-baseline gap-4 py-1.5 font-display text-3xl tracking-tight text-(--color-bone) transition-colors hover:text-(--color-gold) sm:text-4xl"
                  >
                    <span className="font-mono text-xs text-(--color-gold)">{link.num}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ link, active }: { link: { to: string; label: string; num: string }; active: boolean }) {
  return (
    <Link
      to={link.to}
      className="group relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-fog) transition-colors duration-300 hover:text-(--color-bone)"
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full bg-(--color-surface-2)"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative flex items-center gap-1.5">
        <span className={active ? "text-(--color-gold)" : "text-(--color-line) group-hover:text-(--color-gold)"}>
          {link.num}
        </span>
        {link.label}
      </span>
    </Link>
  );
}
