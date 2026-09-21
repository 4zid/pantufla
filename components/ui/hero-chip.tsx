import { toneBg, type Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Un beneficio del hero, en pastilla de vidrio.
 *
 * Eran tres frases en un renglón gris con barras entre medio, debajo del
 * botón. Un renglón así se lee como letra chica; tres pastillas sueltas
 * entre las tarjetas se leen como tres cosas que el sitio afirma. Cada una
 * lleva un punto de la paleta, y nada más: sin icono, porque el icono los
 * volvería «features» de plantilla.
 *
 * El vidrio es fijo —blanco a medias con desenfoque— y la tinta también:
 * el hero es siempre claro, así que acá no hay tema que dar vuelta.
 */
export function HeroChip({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/75 bg-white/70 px-4 py-2 text-[0.86rem] font-medium text-[#121212] shadow-[0_1px_2px_rgba(17,24,60,0.06),0_14px_30px_-16px_rgba(17,24,60,0.35)] backdrop-blur-md",
        className,
      )}
    >
      <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", toneBg[tone])} />
      {children}
    </span>
  );
}
