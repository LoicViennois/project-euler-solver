import { SPIRAL_PATH, SPIRAL_STROKE_WIDTH } from '../lib/logo-spiral';

// Same mark as the favicon and PWA icons (scripts/generate-icons.mjs).
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={`size-8 shrink-0 ${className ?? ''}`}
    >
      <rect width="32" height="32" rx="7" fill="#152330" />
      <path
        d={SPIRAL_PATH}
        fill="none"
        stroke="#d9995a"
        strokeWidth={SPIRAL_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
