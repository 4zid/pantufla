"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { process } from "@/content/site";
import { DrawnLineArt } from "@/components/art/drawn-line-art";
import type { Tone } from "@/components/art/blob";
import type { LineArtName } from "@/components/art/line-art";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { toneTextBase } from "@/lib/tones";
import { ease, gsap, registerGsap } from "@/lib/motion";

export function Process() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);

        // La línea se llena a medida que se recorren las etapas.
        gsap.fromTo(
          q("[data-progress]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          },
        );

        // Los números entran desde abajo, escalonados por etapa.
        q("[data-step]").forEach((step) => {
          gsap.from(step.querySelector("[data-numeral]"), {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease,
            scrollTrigger: { trigger: step, start: "top 82%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Section id="proceso" tone="deep">
      <SectionHead
        accent="miel"
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        onDark
      />

      <div ref={scope} className="relative mt-16">
        {/* Riel de progreso, solo en desktop. */}
        <div
          aria-hidden
          className="absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block"
        >
          <div data-progress className="h-full w-full bg-aqua" />
        </div>

        <ol className="border-t border-white/10 lg:pl-14">
          {process.steps.map((step) => (
            <li
              key={step.number}
              data-step
              className="grid gap-5 border-b border-white/10 py-10 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10 md:py-14"
            >
              <div className="flex items-center gap-5 md:w-28 md:flex-col md:items-start md:gap-3">
                <span
                  data-numeral
                  className="text-numeral block tabular-nums text-white/15"
                >
                  {step.number}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.72rem] font-medium text-white/70">
                  {step.when}
                </span>
              </div>

              <Reveal className="max-w-2xl">
                <div>
                  <div className="flex items-center gap-4">
                    <DrawnLineArt
                      name={step.art as LineArtName}
                      className={cn(
                        "h-9 w-9 shrink-0",
                        toneTextBase[step.tone as Tone],
                      )}
                    />
                    <h3 className="text-h3 text-paper">{step.name}</h3>
                  </div>
                  <p className="mt-4 text-[0.98rem] leading-relaxed text-white/60">
                    {step.body}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="grid gap-4 text-[0.85rem] sm:grid-cols-2 md:w-56 md:grid-cols-1 md:gap-3.5">
                  <div>
                    <dt className="text-white/35">Te entregamos</dt>
                    <dd className="mt-1 font-medium text-paper">
                      {step.deliverable}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/35">Ponés vos</dt>
                    <dd className="mt-1 font-medium text-paper">{step.yours}</dd>
                  </div>
                </dl>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <Reveal>
        <p className="mt-8 max-w-xl text-[0.92rem] leading-relaxed text-white/45">
          {process.payment}
        </p>
      </Reveal>
    </Section>
  );
}
