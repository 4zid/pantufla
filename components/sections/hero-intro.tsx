"use client";

import type { CSSProperties } from "react";

import { HeroChip } from "@/components/ui/hero-chip";
import type { Tone } from "@/lib/tones";

import { useCopy } from "@/components/copy-provider";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";

/** Los mismos tres tonos que llevan las pastillas flotantes del escenario. */
const CHIP_TONOS: Tone[] = ["aqua", "rosa", "verde"];

/**
 * Cuándo entra cada cosa, en segundos desde el primer pintado.
 *
 * La entrada es de CSS y no de GSAP: arriba del pliegue nada puede esperar
 * al JavaScript para aparecer (ver la entrada del hero en globals.css). La
 * bajada va temprano a propósito: en móvil es el elemento más grande de la
 * pantalla, y el LCP se mide cuando ella se pinta.
 */
const entra = (s: number) => ({ "--entra": `${s}s` }) as CSSProperties;

export function HeroIntro() {
  const { hero } = useCopy();

  return (
    <div className="shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <SplitHeading
          as="h1"
          segments={hero.titleSegments}
          delay={0.1}
          immediate
          className="text-display"
        />

        <p
          data-entra
          style={entra(0.3)}
          className="mx-auto mt-5 max-w-xl text-lead text-ink-soft"
        >
          {hero.lead}
        </p>

        <div
          data-entra
          style={entra(0.45)}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            {hero.secondary.label}
          </ButtonLink>
        </div>

        {/*
          En una sola fila con wrap, el separador viaja pegado al item que lo
          sigue: cuando el tercero no entra y baja, la barra baja con el y el
          renglon nuevo arranca con un palito colgado de la nada. En un telefono
          pasaba siempre.

          Abajo de sm van apilados y sin separadores —tres lineas cortas
          centradas no necesitan que nadie las separe— y de sm para arriba
          vuelve la fila con las barras, donde los tres entran de una.
        */}
        <ul
          data-entra
          style={entra(0.6)}
          className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5 min-[1440px]:sr-only"
        >
          {hero.proof.map((item, i) => (
            <li key={item}>
              <HeroChip tone={CHIP_TONOS[i % CHIP_TONOS.length]}>
                {item}
              </HeroChip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
