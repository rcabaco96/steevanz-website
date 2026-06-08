import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Link } from "react-router-dom";

export function MagneticButton({
  to,
  href,
  children,
  variant = "solid",
  className = "",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 16, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.45);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.2em] transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-(--color-bone) text-(--color-void) hover:bg-(--color-violet-200)"
      : "border border-(--color-violet-400)/40 text-(--color-violet-200) hover:border-(--color-violet-400) hover:text-(--color-bone)";

  const Inner = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles} ${className}`}
    >
      <span>{children}</span>
      <motion.span
        className="grid h-7 w-7 place-items-center rounded-full bg-current/10"
        whileHover={{ rotate: 45 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
    </motion.div>
  );

  if (to) return <Link to={to}>{Inner}</Link>;
  if (href) return <a href={href}>{Inner}</a>;
  return Inner;
}
