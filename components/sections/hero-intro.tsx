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
 * La columna de texto del hero, toda alineada a la izquierda: la pastilla de
 * disponibilidad, el titular, la bajada y los dos botones, uno debajo del
 * otro.
 *
 * El titular tiene un tope en em y no en píxeles para que corte siempre en
 * el mismo lugar con el tamaño que sea. «Sitios que convierten» mide 9,2em:
 * con el tope de 84px entra en una línea al lado del boleto a 1440, y el
 * titular queda en dos («Sitios que convierten / visitantes en clientes.»),
 * que deja ver más de la galería sin scrollear. Más angosto pasa a tres.
 * Con balance, en el teléfono reparte las líneas parejas en vez de dejar una
 * palabra sola abajo.
 */
export function HeroTexto() {
  const { hero } = useCopy();

  return (
    <div className="min-w-0">
      <p
        data-entra
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-card/70 py-1.5 pl-2.5 pr-3 text-[0.8rem] font-medium tracking-[-0.01em] text-ink backdrop-blur-md md:text-[0.85rem]"
      >
        <span
          aria-hidden
          className="h-[7px] w-[7px] shrink-0 rounded-full bg-verde-deep shadow-[0_0_0_3px_var(--color-verde-soft)]"
        />
        {hero.eyebrow}
      </p>

      <SplitHeading
        as="h1"
        segments={hero.headline}
        delay={0.1}
        immediate
        className="mt-5 max-w-[9.4em] text-[clamp(2.9rem,1.35rem+4.9vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] [text-wrap:balance] md:mt-6 md:-ml-[0.035em]"
      />

      <p
        data-entra
        style={entra(0.3)}
        className="mt-6 max-w-[34rem] text-lead text-ink-soft md:mt-7"
      >
        {hero.lead}
      </p>

      <div
        data-entra
        style={entra(0.45)}
        className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:mt-8"
      >
        <Magnetic className="w-full sm:w-auto">
          <ButtonLink
            href={hero.primary.href}
            size="lg"
            className="w-full sm:w-auto"
          >
            {hero.primary.label}
          </ButtonLink>
        </Magnetic>
        <ButtonLink
          href={hero.secondary.href}
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {hero.secondary.label}
        </ButtonLink>
      </div>
    </div>
  );
}
