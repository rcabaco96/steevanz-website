import Link from "next/link";

export function Logo({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} aria-label={label} className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="display text-[1.35rem] leading-none tracking-tight text-text">
        Steevanz<span className="text-gold pl-1">.</span>
      </span>
    </Link>
  );
}
