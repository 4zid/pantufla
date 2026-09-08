"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { hero } from "@/content/site";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { ease, gsap, registerGsap } from "@/lib/motion";

export function HeroIntro() {
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
          text={hero.title}
          delay={0.1}
          immediate
          className="text-display"
        />

        <p data-reveal className="mx-auto mt-6 max-w-xl text-lead text-ink-soft">
          {hero.lead}
        </p>

        <div
          data-reveal
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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

        <ul
          data-reveal
          className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-y-1.5 text-[0.85rem] text-ink-faint"
        >
          {hero.proof.map((item, i) => (
            <li key={item} className="flex items-center">
              {i > 0 ? (
                <span
                  aria-hidden
                  className="mx-3 h-3 w-px bg-line-strong sm:mx-4"
                />
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
