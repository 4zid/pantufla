"use client";

import { Reveal } from "@/components/motion/reveal";
import { socialProof } from "@/content/site";
import { useCopy } from "@/components/copy-provider";

/**
 * Tira de prueba social, justo debajo del hero.
 *
 * Va angosta y con una regla arriba y abajo: es un apoyo, no una sección. Si
 * respira como las demás compite con el titular, que es lo último que
 * conviene a dos centímetros del hero.
 *
 * A la izquierda va quién hace el trabajo y a la derecha para quién se hizo.
 * La frase no cuenta clientes: ver por qué en content/site.ts.
 *
 * Las marcas son de relleno y están dibujadas en código; misma nota.
 */

/** Marcas inventadas: formas simples, todas del mismo peso óptico. */
const marks: Record<string, React.ReactNode> = {
  Aureo: (
    <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="30 11" />
  ),
  Nimbo: (
    <g fill="currentColor">
      <rect x="2" y="4" width="14" height="3" rx="1.5" />
      <rect x="4.5" y="9" width="11.5" height="3" rx="1.5" />
      <rect x="7" y="14" width="9" height="3" rx="1.5" />
    </g>
  ),
  Cardinal: (
    <path
      d="M9 1c.6 4.2 3.2 6.8 7.4 7.4-4.2.6-6.8 3.2-7.4 7.4-.6-4.2-3.2-6.8-7.4-7.4C5.8 7.8 8.4 5.2 9 1Z"
      fill="currentColor"
    />
  ),
  Vela: (
    <g fill="currentColor">
      <path d="M9 1.5 16 15H9V1.5Z" />
      <path d="M7 6.5V15H1.5L7 6.5Z" opacity="0.45" />
    </g>
  ),
  Tallo: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M9 17V5" />
      <path d="M9 9C9 6 11.5 3.5 15 3.5 15 7 12.5 9 9 9Z" fill="currentColor" stroke="none" />
    </g>
  ),
};

export function SocialProof() {
  const copy = useCopy();
  return (
    <section
      aria-label="Clientes"
      className="border-y border-line bg-paper-alt/60"
    >
      <Reveal className="shell flex flex-col items-center gap-8 py-8 lg:flex-row lg:gap-12 lg:py-7">
        <div className="flex shrink-0 items-center gap-4">
          <ul className="flex" aria-hidden>
            {socialProof.faces.map((face, i) => (
              <li
                key={face.initials}
                className="grid h-11 w-11 place-items-center rounded-full text-[0.72rem] font-semibold text-white ring-[3px] ring-paper"
                style={{
                  background: `linear-gradient(140deg, ${face.from}, ${face.to})`,
                  // Corto: acá hay iniciales, no fotos, y con más solapado el
                  // borde de la de al lado les come la última letra.
                  marginLeft: i === 0 ? 0 : "-0.375rem",
                }}
              >
                {face.initials}
              </li>
            ))}
          </ul>
          <p className="max-w-[15rem] text-[0.92rem] leading-snug text-ink-soft">
            {copy.socialProof.claim}
          </p>
        </div>

        <span aria-hidden className="hidden h-12 w-px bg-line lg:block" />

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-9 gap-y-5 lg:justify-between">
          {socialProof.brands.map((brand) => (
            <li
              key={brand}
              className="flex items-center gap-2 text-ink-soft transition-colors duration-200 hover:text-ink"
            >
              <svg viewBox="0 0 18 18" aria-hidden className="h-[18px] w-[18px]">
                {marks[brand]}
              </svg>
              <span className="text-[1.05rem] font-semibold tracking-[-0.03em]">
                {brand}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
