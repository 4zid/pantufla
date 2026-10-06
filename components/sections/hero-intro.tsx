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
const entra = (s: number) => ({ "--entra": `${s}s` }) as CSSProperties;

/**
 * La parte de arriba: la pastilla de disponibilidad y el titular.
 *
 * El titular tiene un tope en em y no en píxeles para que corte siempre en
 * el mismo lugar: «Sitios que convierten / visitantes en clientes.» en
 * escritorio, con el tamaño que sea. Con balance, en el teléfono reparte las
 * cuatro líneas parejas en vez de dejar una palabra sola abajo.
 */
export function HeroTitular() {
  const { hero } = useCopy();

  return (
    <div>
      <p
        data-entra
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/75 bg-white/60 py-1.5 pl-2.5 pr-3 text-[0.8rem] font-medium tracking-[-0.01em] text-ink backdrop-blur-md md:text-[0.85rem]"
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
        className="mt-[18px] max-w-[10.2em] text-[clamp(3rem,1.42rem+6.48vw,7.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] [text-wrap:balance] md:mt-[22px] md:-ml-[0.035em]"
      />
    </div>
  );
}

/** La bajada y los dos botones, abajo a la izquierda en escritorio. */
export function HeroBajada() {
  const { hero } = useCopy();

  return (
    <div className="max-w-[460px]">
      <p data-entra style={entra(0.3)} className="text-lead text-ink-soft">
        {hero.lead}
      </p>

      <div
        data-entra
        style={entra(0.45)}
        className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:mt-7"
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
