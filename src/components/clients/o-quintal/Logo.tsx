// O Quintal's wordmark, set in the site's type with a small leaf. The business's own logo (a PNG on its Jumpseller
// shop) could not be downloaded on 2026-10-25; swap this for the real logo once it is in public/media/clients/o-quintal.
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <path d="M27 5C15 5 6 11 6 21c0 2 .5 4 1.4 5.5C9 18 15 13 22 10c-6 4-10.5 9-12.6 16.8C11 27.6 13 28 15 28c9 0 13-9 12-23Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display leading-none ${className}`}>
      <Leaf className="h-[1.05em] w-[1.05em] text-folha" />
      <span>
        O <span className="text-tomate">Quintal</span>
      </span>
    </span>
  );
}
