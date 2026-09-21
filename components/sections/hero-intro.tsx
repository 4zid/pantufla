"use client";

import { HeroChip } from "@/components/ui/hero-chip";
import type { Tone } from "@/lib/tones";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useCopy } from "@/components/copy-provider";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { ease, gsap, registerGsap } from "@/lib/motion";

/** Los mismos tres tonos que llevan las pastillas flotantes del escenario. */
const CHIP_TONOS: Tone[] = ["aqua", "rosa", "verde"];

export function HeroIntro() {
  const { hero } = useCopy();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          const q = gsap.utils.selector(root);
          const targets = q("[data-reveal]");

          if (reduced) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            targets,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease,
              stagger: 0.09,
              delay: 0.55,
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="shell relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <SplitHeading
          as="h1"
          segments={hero.titleSegments}
          delay={0.1}
          immediate
          className="text-display"
        />

        <p data-reveal className="mx-auto mt-5 max-w-xl text-lead text-ink-soft">
          {hero.lead}
        </p>

        <div
          data-reveal
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
          data-reveal
          className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2.5 min-[1440px]:sr-only"
        >
          {hero.proof.map((item, i) => (
            <li key={item}>
              <HeroChip tone={CHIP_TONOS[i % CHIP_TONOS.length]}>{item}</HeroChip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
