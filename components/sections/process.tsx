"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { process } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { gsap, registerGsap } from "@/lib/motion";

/**
 * El proceso, como línea de tiempo centrada.
 *
 * El riel corre por el medio y se va llenando con el scroll. Antes iba pegado
 * a la izquierda con las etapas en filas anchas: se leía como una tabla, y una
 * tabla no transmite que una cosa pasa después de la otra.
 *
 * El texto de cada etapa lleva el fondo de la sección para tapar el riel. Sin
 * eso la línea cruza el título y el párrafo por el medio, que es lo que pasa
 * siempre que se centra una línea de tiempo y se olvida que el centro es
 * justo donde vive el texto.
 */

/** El degradé del relleno, de la aqua profunda a la clara. */
const FILL =
  "linear-gradient(to bottom, #166b67 0%, #2f9d97 32%, #6fcfca 68%, #a8e3df 100%)";

export function Process() {
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

          // El relleno arranca cuando el primer marcador llega a la mitad de
          // la pantalla y termina cuando llega el último: así el recorrido
          // corresponde con lo que el visitante está leyendo.
          gsap.fromTo(
            q("[data-progress]"),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: root,
                start: "top 55%",
                end: "bottom 65%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );

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
    <Section id="proceso" tone="deep">
      <SectionHead
        accent="miel"
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        align="center"
        onDark
      />

      <div ref={scope} className="relative mx-auto mt-20 max-w-xl md:mt-24">
        {/* Riel. El relleno va encima del carril apagado, con el mismo
            origen, así que no hace falta medir nada: basta con estirarlo. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
        >
          <div
            data-progress
            className="h-full w-full origin-top"
            style={{ background: FILL }}
          />
        </div>

        <ol className="relative flex flex-col gap-16 md:gap-20">
          {process.steps.map((step) => (
            <li
              key={step.number}
              data-step
              className="flex flex-col items-center text-center"
            >
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
                    background: FILL,
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-[5px] rounded-full opacity-25 blur-[6px]"
                  style={{ background: FILL }}
                />
                <span className="relative text-[0.95rem] font-semibold tabular-nums text-paper">
                  {step.number}
                </span>
              </span>

              {/* El bloque tapa el riel con el fondo de la sección: si no, la
                  línea le pasa por encima al título y al texto. Así la línea
                  solo se ve en el tramo entre una etapa y la siguiente, que es
                  donde tiene algo que decir. */}
              <div data-body className="relative z-10 mt-6 bg-deep px-4 py-2">
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
