"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * El proceso, como línea de tiempo centrada.
 *
 * El riel corre por el medio y se va llenando con el scroll. Antes iba pegado
 * a la izquierda con las etapas en filas anchas: se leía como una tabla, y una
 * tabla no transmite que una cosa pasa después de la otra.
 *
 * El riel no es una línea entera detrás del contenido sino un tramo por cada
 * par de etapas. Entera había que taparla con bloques opacos para que no
 * cruzara el texto —el centro es justo donde vive el texto— y esos bloques se
 * recortaban como rectángulos oscuros sobre el resplandor del fondo.
 */

/**
 * Un paso de color por etapa. Cada tramo del riel va del color de la etapa que
 * deja al de la que viene, así el degradé recorre la sección entera aunque
 * esté partido en pedazos sueltos.
 */
const STOPS = ["#166b67", "#2f9d97", "#6fcfca", "#a8e3df"] as const;

export function Process() {
  const { process } = useCopy();
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
          const pasos = q("[data-step]");

          if (reduced) {
            gsap.set(q("[data-progress]"), { scaleY: 1 });
            gsap.set(q("[data-dot]"), { opacity: 1, scale: 1 });
            gsap.set(q("[data-body]"), { opacity: 1, y: 0 });
            return;
          }

          // Cada tramo se llena solo, atado a la etapa que lo sigue: empieza
          // cuando esa etapa asoma y termina cuando llega a su lugar de
          // lectura. Un único scrub para toda la sección desincronizaba el
          // relleno del texto en pantallas de distinto alto.
          pasos.forEach((paso) => {
            const tramo = paso.querySelector("[data-progress]");
            if (!tramo) return;

            gsap.fromTo(
              tramo,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                transformOrigin: "top",
                scrollTrigger: {
                  trigger: paso,
                  start: "top 92%",
                  end: "top 58%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          pasos.forEach((paso) => {
            const dot = paso.querySelector("[data-dot]");
            const body = paso.querySelector("[data-body]");

            gsap.fromTo(
              dot,
              { scale: 0.4, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.55,
                ease: "back.out(2)",
                scrollTrigger: { trigger: paso, start: "top 62%", once: true },
              },
            );

            gsap.fromTo(
              body,
              { opacity: 0, y: 22 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: paso, start: "top 62%", once: true },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Section
      id="proceso"
      tone="deep"
      className="overflow-hidden"
      overlay={
        /* El resplandor sube desde el borde de abajo y se apaga antes de la
           mitad. Centrado quedaría como una mancha; naciendo del piso se lee
           como si la línea de tiempo fuera lo que lo enciende. */
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 118%, #6fcfca 0%, rgba(111,207,202,0.42) 26%, rgba(47,157,151,0.16) 48%, transparent 72%)",
          }}
        />
      }
    >
      <SectionHead
        icon="capas"
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        align="center"
        onDark
      />

      <div ref={scope} className="relative mx-auto mt-20 max-w-xl md:mt-24">
        <ol className="relative flex flex-col">
          {process.steps.map((step, i) => (
            <li
              key={step.number}
              data-step
              className={cn(
                "relative flex flex-col items-center text-center",
                i > 0 && "pt-20 md:pt-24",
              )}
            >
              {/* El riel va por tramos, uno entre cada par de etapas, en vez de
                  una línea única detrás de todo. Con una línea entera había que
                  taparla con bloques opacos para que no cruzara el texto, y
                  esos bloques se recortaban como rectángulos oscuros sobre el
                  resplandor del fondo. Partido en tramos no hay nada que tapar. */}
              {i > 0 ? (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-0 h-20 w-[2px] -translate-x-1/2 overflow-hidden rounded-full bg-white/10 md:h-24"
                >
                  <span
                    data-progress
                    className="block h-full w-full origin-top"
                    style={{
                      background: `linear-gradient(to bottom, ${STOPS[i - 1]}, ${STOPS[i]})`,
                    }}
                  />
                </span>
              ) : null}
              {/* El marcador tapa el riel con su propio fondo: por eso el
                  círculo lleva el color de la sección y no es translúcido. */}
              <span
                data-dot
                className="relative grid h-14 w-14 place-items-center rounded-full bg-deep"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full p-[1.5px]"
                  style={{
                    background: `linear-gradient(140deg, ${STOPS[Math.max(0, i - 1)]}, ${STOPS[i]})`,
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-[5px] rounded-full opacity-25 blur-[6px]"
                  style={{ background: STOPS[i] }}
                />
                <span className="relative text-[0.95rem] font-semibold tabular-nums text-paper">
                  {step.number}
                </span>
              </span>

              <div data-body className="mt-6">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.72rem] font-medium text-white/70">
                  {step.when}
                </span>

                <h3 className="mt-4 text-h3 text-paper">{step.name}</h3>

                <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-white/60">
                  {step.body}
                </p>

                <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-left text-[0.85rem]">
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
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Reveal>
        <p className="mx-auto mt-16 max-w-xl text-center text-[0.92rem] leading-relaxed text-white/45">
          {process.payment}
        </p>
      </Reveal>
    </Section>
  );
}
