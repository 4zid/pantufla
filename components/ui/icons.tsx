type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3.2 8.4 6.4 11.6 12.8 4.8" {...stroke} />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M4 8h8" {...stroke} />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" {...stroke} />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M5 11 11 5M5.8 5H11v5.2" {...stroke} />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 3.5v9M3.5 8h9" {...stroke} />
    </svg>
  );
}

/** Marca: una pantufla reducida a dos trazos. */
export function Logo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M5.5 12.5c0-1.4 1.1-2.5 2.5-2.5h6.2c1 0 1.9.6 2.3 1.5l1.1 2.6c.3.7.9 1.2 1.6 1.4l3.4 1c1.9.6 3.1 2.3 3.1 4.2 0 1.6-1.3 2.8-2.8 2.8H9.3c-2.1 0-3.8-1.7-3.8-3.8v-7.2Z"
        fill="currentColor"
      />
      <path
        d="M9.4 10V7.6C9.4 6.2 10.5 5 12 5h1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
