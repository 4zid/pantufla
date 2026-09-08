"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { hero } from "@/content/site";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
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

          gsap.from(q("[data-badge]"), {
            opacity: 0,
            y: 12,
            duration: 0.7,
            ease,
          });

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
    <div ref={scope} className="shell relative">
      <div className="mx-auto max-w-5xl text-center">
        <p
          data-badge
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-line-strong bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-ink-soft"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
          <span className="whitespace-nowrap">{hero.badge}</span>
          <span
            aria-hidden
            className="hidden h-3 w-px bg-line-strong sm:block"
          />
          <span className="hidden whitespace-nowrap text-ink-faint sm:inline">
            {hero.badgeNote}
          </span>
        </p>

        <SplitHeading
          as="h1"
          text={hero.title}
          delay={0.18}
          immediate
          className="mt-7 text-display"
        />

        <p data-reveal className="mx-auto mt-7 max-w-xl text-lead text-ink-soft">
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
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {hero.secondary.label}
          </ButtonLink>
        </div>

        <ul
          data-reveal
          className="mx-auto mt-9 flex max-w-3xl flex-col items-center justify-center gap-x-7 gap-y-2.5 sm:flex-row sm:flex-wrap"
        >
          {hero.proof.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[0.88rem] text-ink-soft"
            >
              <CheckIcon className="h-3.5 w-3.5 shrink-0 text-clay" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
