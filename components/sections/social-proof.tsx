"use client";

import type { Surface } from "@/components/ui/section";

import { Reveal } from "@/components/motion/reveal";
import { socialProof } from "@/content/site";
import { useCopy } from "@/components/copy-provider";

/**
 * Tira de prueba social, justo debajo del hero.
 *
 * Va angosta y sin reglas: es un apoyo, no una sección. Si respira como las
 * demás compite con el titular, que es lo último que conviene a dos
 * centímetros del hero.
 *
 * Comparte el color del hero a propósito. Con un fondo propio quedaba una
 * banda distinta justo debajo del tablero y se leía como que el hero terminaba
 * de golpe; con el mismo, el tablero se hunde en la tira y lo que separa las
 * dos cosas es el aire, no una línea de color. Las reglas sobraban por lo
 * mismo.
 *
 * A la izquierda va quién hace el trabajo y a la derecha para quién se hizo.
 * La frase no cuenta clientes: ver por qué en content/site.ts.
 *
 * Los nombres corren en un riel y no quietos en fila. Son cinco: quietos
 * ocupaban media tira y dejaban un hueco al final que pedía un sexto cliente
 * que no existe. Moviéndose, la tira no tiene largo fijo —siempre está llena—
 * y además se lee como una lista que sigue, que es exactamente lo que se
 * quiere decir. La mecánica del empalme está explicada en globals.css.
 */

/**
 * Cuántas veces se repite la lista en cada mitad de la pista.
 *
 * Cinco nombres miden unos 700px. Con una sola pasada por mitad, a mitad de la
 * animación el final de la pista entra en pantalla y queda un hueco. Tres
 * pasadas dan 2100px por mitad, que tapa el hueco hasta en pantallas de 2560.
 */
const REPES = 3;

export function SocialProof({ surface = "mist" }: { surface?: Surface }) {
  const copy = useCopy();
  const marcas = socialProof.brands;

  return (
    <section
      aria-label={copy.socialProof.label}
      data-surface={surface}
      className="relative"
    >
      <Reveal className="relative z-10 shell flex flex-col items-center gap-6 py-8 lg:flex-row lg:gap-10 lg:py-7">
        <div className="flex shrink-0 items-center gap-4">
          <ul className="flex" aria-hidden>
            {socialProof.faces.map((face, i) => (
              <li
                key={face.initials}
                className="grid h-11 w-11 place-items-center rounded-full text-[0.72rem] font-semibold text-white ring-[3px] ring-mist"
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

        {/*
          El riel. La lista real la anuncia el lector de pantalla una sola vez;
          las copias de más existen para que el empalme no se vea y van
          escondidas.
        */}
        <div
          className="ticker w-full min-w-0 flex-1 overflow-hidden"
          style={{ "--ticker-fade": "3rem" } as React.CSSProperties}
        >
          <ul
            className="ticker-track"
            style={{ "--ticker-duration": "34s" } as React.CSSProperties}
          >
            {Array.from({ length: REPES * 2 }).map((_, copia) =>
              marcas.map((marca) => (
                <li
                  key={`${copia}-${marca}`}
                  aria-hidden={copia > 0 || undefined}
                  className="whitespace-nowrap pr-10 text-[1.05rem] font-semibold tracking-[-0.03em] text-ink-soft"
                >
                  {marca}
                </li>
              )),
            )}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
