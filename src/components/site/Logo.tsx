import Link from "next/link";

export function Logo({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} aria-label={label} className={`group inline-flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="9" fill="var(--accent)" />
        <path
          d="M10.5 12.5a5.5 5.5 0 0 1 0 7M14.5 10a9 9 0 0 1 0 12M18.5 7.5a12.5 12.5 0 0 1 0 17"
          fill="none"
          stroke="var(--accent-contrast)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="10" r="2.2" fill="var(--gold)" />
      </svg>
      <span className="display text-[1.35rem] leading-none tracking-tight text-text">
        Steevanz<span className="text-gold">.</span>
      </span>
    </Link>
  );
}
