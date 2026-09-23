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

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3.5 6 8 10.5 12.5 6" {...stroke} />
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

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M8 1.6l1.94 3.93 4.34.63-3.14 3.06.74 4.32L8 11.5l-3.88 2.04.74-4.32L1.72 6.16l4.34-.63L8 1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Marca: una pantufla reducida a dos trazos. */
/* ------------------------------------------------------------------ */
/* Iconos de las etiquetas de sección                                  */
/*                                                                     */
/* Trazo de 1.6 en una caja de 16, todos del mismo peso óptico: en una */
/* pastilla de 14px cualquier diferencia de grosor se nota más que el  */
/* dibujo en sí.                                                       */
/* ------------------------------------------------------------------ */

const tag = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CubeIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <path d="M8 1.8 14 5v6l-6 3.2L2 11V5l6-3.2Z" />
      <path d="M2 5l6 3.2L14 5M8 8.2v6" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <path d="M2.2 7.4V2.9c0-.4.3-.7.7-.7h4.5c.2 0 .4.1.5.2l6 6a.7.7 0 0 1 0 1l-4.5 4.5a.7.7 0 0 1-1 0l-6-6a.7.7 0 0 1-.2-.5Z" />
      <circle cx="5.4" cy="5.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <rect x="2.2" y="2.2" width="4.6" height="4.6" rx="1.2" />
      <rect x="9.2" y="2.2" width="4.6" height="4.6" rx="1.2" />
      <rect x="2.2" y="9.2" width="4.6" height="4.6" rx="1.2" />
      <rect x="9.2" y="9.2" width="4.6" height="4.6" rx="1.2" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <path d="M6.4 3.4C4.3 4.3 3 6 3 8.1v4.5h4.3V8.2H5.2c0-1.5.6-2.5 2-3.2l-.8-1.6ZM13.2 3.4C11.1 4.3 9.8 6 9.8 8.1v4.5H14V8.2h-2.1c0-1.5.6-2.5 2-3.2l-.7-1.6Z" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <circle cx="8" cy="8" r="6.1" />
      <path d="M6.3 6.2a1.8 1.8 0 0 1 3.4.7c0 1.2-1.7 1.4-1.7 2.6" />
      <circle cx="8" cy="11.6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <path d="M8 1.9 14.2 5 8 8.1 1.8 5 8 1.9Z" />
      <path d="M1.8 8.3 8 11.4l6.2-3.1M1.8 11.3 8 14.4l6.2-3.1" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <circle cx="8" cy="8" r="6.1" />
      <path d="M1.9 8h12.2M8 1.9c1.7 1.8 2.6 3.9 2.6 6.1S9.7 12.3 8 14.1C6.3 12.3 5.4 10.2 5.4 8s.9-4.3 2.6-6.1Z" />
    </svg>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg {...tag} className={className} aria-hidden>
      <circle cx="4" cy="3.8" r="1.9" />
      <circle cx="12" cy="12.2" r="1.9" />
      <path d="M5.9 3.8h3.4a2.5 2.5 0 0 1 0 5H6.7a2.5 2.5 0 0 0 0 5h3.4" />
    </svg>
  );
}
