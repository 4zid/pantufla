"use client";

import type { CSSProperties } from "react";

import { useCopy } from "@/components/copy-provider";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";

/**
 * Cuándo entra cada cosa, en segundos desde el primer pintado.
 *
 * La entrada es de CSS y no de GSAP: arriba del pliegue nada puede esperar
 * al JavaScript para aparecer (ver la entrada del hero en globals.css). La
 * bajada va temprano a propósito: en móvil es de lo más grande de la
 * pantalla, y el LCP se mide cuando se pinta.
 */
export const entra = (s: number) => ({ "--entra": `${s}s` }) as CSSProperties;

/**
 * El texto del hero, todo centrado: el titular, la bajada y los dos botones
 * en fila. Fue una columna alineada a la izquierda con el pase a la derecha;
 * sin el pase, el centro es el único eje que queda. Arriba del titular había
 * una pastilla de «Disponibles para nuevos proyectos»; se sacó a pedido, y
 * con ella el campo del copy y del Studio.
 *
 * El titular tiene un tope en em y no en píxeles para que corte siempre en
 * el mismo lugar con el tamaño que sea: con 11em, «Sitios que convierten»
 * (9,2em) entra en una línea y «visitantes en clientes.» en la otra, a
 * cualquier tamaño. Sube a 72px a 1440, que centrado y solo ya no se ve
 * grande como cuando compartía la fila con el pase. Con balance, en el
 * teléfono reparte las líneas parejas en vez de dejar una palabra sola abajo.
 */
export function HeroTexto() {
  const { hero } = useCopy();

  return (
    <div className="mx-auto flex min-w-0 max-w-[52rem] flex-col items-center text-center">
      <SplitHeading
        as="h1"
        segments={hero.headline}
        delay={0.1}
        immediate
        className="max-w-[12.8em] text-[clamp(2.5rem,1.55rem+3.3vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] [text-wrap:balance]"
      />

      <p
        data-entra
        style={entra(0.3)}
        className="mt-6 max-w-[32rem] text-lead text-ink-soft md:mt-7"
      >
        {hero.lead}
      </p>

      <div
        data-entra
        style={entra(0.45)}
        className="mt-8 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-3"
      >
        <Magnetic className="w-full sm:w-auto">
          <ButtonLink href={hero.primary.href} className="w-full sm:w-auto">
            {hero.primary.label}
          </ButtonLink>
        </Magnetic>
        <ButtonLink
          href={hero.secondary.href}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          {hero.secondary.label}
        </ButtonLink>
      </div>
    </div>
  );
}
