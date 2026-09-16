"use client";

import { useGSAP } from "@gsap/react";
import { useId, useRef, useState } from "react";

import { faq } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Section } from "@/components/ui/section";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Preguntas frecuentes, en dos columnas de tarjetas.
 *
 * Las columnas son dos listas independientes y no una grilla: cuando una
 * tarjeta se abre, empuja solo a las de su columna. En una grilla de dos
 * columnas, abrir una estira toda la fila y la tarjeta de al lado crece con
 * ella sin tener nada adentro.
 *
 * El reparto es por índice par e impar, no por mitades: así las dos columnas
 * quedan parejas sin depender de cuántas preguntas haya.
 */

/** El signo se arma con dos barras: la vertical se encoge y queda el menos. */
function Signo({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:scale-105"
    >
      <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
      <span
        className={cn(
          "absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
          open ? "scale-y-0" : "scale-y-100",
        )}
      />
    </span>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  const uid = useId();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      registerGsap();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      root.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        const abierto = panel.dataset.open === "true";
        const inner = panel.firstElementChild;

        gsap.to(panel, {
          height: abierto ? "auto" : 0,
          duration: reduced ? 0 : 0.5,
          ease: "power3.inOut",
        });

        if (inner) {
          gsap.to(inner, {
            opacity: abierto ? 1 : 0,
            y: abierto ? 0 : -6,
            duration: reduced ? 0 : 0.4,
            delay: reduced || !abierto ? 0 : 0.12,
            ease: "power2.out",
          });
        }
      });
    },
    { dependencies: [open], scope },
  );

  const columnas = [
    faq.items.filter((_, i) => i % 2 === 0),
    faq.items.filter((_, i) => i % 2 === 1),
  ];

  return (
    <Section id="faq" tone="alt">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-[0.85rem] text-ink-faint">({faq.eyebrow})</p>
        </Reveal>
        <SplitHeading text={faq.title} className="mt-4 text-h2" />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-lg text-lead text-ink-soft">
            {faq.lead}
          </p>
        </Reveal>
      </div>

      <div ref={scope} className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-5">
        {columnas.map((columna, c) => (
          <div key={c} className="flex flex-col gap-4 lg:gap-5">
            {columna.map((item) => {
              const i = faq.items.indexOf(item);
              const abierto = open === i;

              return (
                <div
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-[20px] border bg-card transition-colors duration-300",
                    abierto ? "border-line-strong" : "border-line",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(abierto ? null : i)}
                      aria-expanded={abierto}
                      aria-controls={`${uid}-${i}`}
                      className="group flex w-full items-center justify-between gap-6 p-6 text-left"
                    >
                      <span className="text-[1.02rem] font-medium leading-snug tracking-[-0.015em]">
                        {item.q}
                      </span>
                      <Signo open={abierto} />
                    </button>
                  </h3>

                  <div
                    id={`${uid}-${i}`}
                    data-panel
                    data-open={abierto}
                    aria-hidden={!abierto}
                    className="overflow-hidden"
                    style={abierto ? undefined : { height: 0 }}
                  >
                    <p
                      className="px-6 pb-6 text-[0.95rem] leading-relaxed text-ink-soft"
                      style={abierto ? undefined : { opacity: 0 }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Section>
  );
}
