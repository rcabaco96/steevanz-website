// The wave that rides on top of every rising panel: two periods of a soft swell, painted in currentColor and
// rolling sideways (the strip is twice as wide and slides by half: a seamless loop). Static with reduced motion.
export function WaveEdge({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div aria-hidden="true" className={`w-full overflow-hidden ${flip ? "rotate-180" : ""} ${className}`}>
      <svg className="lm-wave lm-roll w-[200%]" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0 40c120-32 240-32 360 0s240 32 360 0 240-32 360 0 240 32 360 0V80H0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
