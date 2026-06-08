export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-(--color-line) bg-(--color-surface)/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-violet-300, var(--color-lilac)) ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-(--color-violet-400)" />
      {children}
    </span>
  );
}
