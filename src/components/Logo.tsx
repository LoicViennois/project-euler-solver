// Same mark as the favicon and PWA icons (scripts/generate-icons.mjs).
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={`size-8 shrink-0 ${className ?? ''}`}
    >
      <rect width="32" height="32" rx="7" fill="#152330" />
      <g fill="#d9995a">
        <rect x="9" y="7" width="4" height="18" rx="1" />
        <rect x="9" y="7" width="14" height="4" rx="1" />
        <rect x="9" y="14" width="10" height="4" rx="1" />
        <rect x="9" y="21" width="14" height="4" rx="1" />
      </g>
    </svg>
  );
}
