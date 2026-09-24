"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
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

export function Process({ surface = "deep" }: { surface?: Surface }) {
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

          // Sin movimiento el CSS ya muestra todo (ver «Movimiento» en
          // globals.css, donde también está el estado inicial de cada pieza).
          if (reduced) return;

          // Cada tramo se llena solo, atado a la etapa que lo sigue: empieza
          // cuando esa etapa asoma y termina cuando llega a su lugar de
          // lectura. Un único scrub para toda la sección desincronizaba el
          // relleno del texto en pantallas de distinto alto.
          pasos.forEach((paso) => {
            const tramo = paso.querySelector("[data-progress]");
            if (!tramo) return;

            gsap.to(tramo, {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              immediateRender: false,
              scrollTrigger: {
                trigger: paso,
                start: "top 92%",
                end: "top 58%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
          });

          pasos.forEach((paso) => {
            const dot = paso.querySelector("[data-dot]");
            const body = paso.querySelector("[data-body]");

            gsap.to(dot, {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              ease: "back.out(2)",
              immediateRender: false,
              scrollTrigger: { trigger: paso, start: "top 62%", once: true },
            });

            gsap.to(body, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.12,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: { trigger: paso, start: "top 62%", once: true },
            });
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
      surface={surface}
      className="md:py-40"
      overlay={
        /* El resplandor sube desde el piso y se apaga antes de la mitad.
           Centrado quedaría como una mancha; naciendo del piso se lee como si
           la línea de tiempo fuera lo que lo enciende.

           Ya no hace falta que se salga de la sección: el fondo entero cambia
           de color, así que no hay borde contra el que cortar. */
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
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
                  className="absolute left-1/2 top-0 h-20 w-[2px] -translate-x-1/2 overflow-hidden rounded-full bg-line md:h-24"
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
                className="relative grid h-14 w-14 place-items-center rounded-full bg-card"
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
                <span className="relative text-[0.95rem] font-semibold tabular-nums text-ink">
                  {step.number}
                </span>
              </span>

              <div data-body className="mt-6">
                <span className="rounded-full bg-paper-alt px-2.5 py-1 text-[0.72rem] font-medium text-ink-soft">
                  {step.when}
                </span>

                <h3 className="mt-4 text-h3">{step.name}</h3>

                <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>

                <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-x-6 gap-y-2 border-t border-line pt-5 text-left text-[0.85rem]">
                  <div>
                    <dt className="text-ink-faint">
                      {process.labels.deliverable}
                    </dt>
                    <dd className="mt-1 font-medium text-ink">
                      {step.deliverable}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-faint">{process.labels.yours}</dt>
                    <dd className="mt-1 font-medium text-ink">{step.yours}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/*
        El cierre, con el mismo formato que el titular de la portada: tramos
        que suben uno detrás de otro y el descuento en pastilla. Era un párrafo
        chico en tinta apagada y ahí el 15% no se veía —era una frase más
        adentro de otra—, justo en el punto de la página donde alguien terminó
        de leer cómo se trabaja y está decidiendo.

        En tinta plena y no apagada: esta zona cae encima del resplandor
        celeste del pie de la sección, que aclara el fondo bastante más que el
        negro de arriba. La tinta apagada alcanza sobre el negro, pero sobre el
        resplandor se despinta.

        La pastilla es aqua y no blanca como en la portada. Acá el fondo es
        oscuro: la blanca funciona igual, pero el celeste es el color con el
        que la sección ya viene hablando —el riel, los números, el resplandor—
        y sobre negro levanta más que el blanco, que compite con la tinta.
      */}
      <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
        <SplitHeading
          as="p"
          segments={process.payment.segments}
          className="text-[1.45rem] font-semibold leading-[1.35] tracking-[-0.025em] text-ink md:text-[1.8rem]"
        />

        {/* Sin label no se dibuja. Pasa con la nota de pago vieja que todavía
            puede venir de Sanity: ahí no hay botón que poner, y uno vacío es
            peor que ninguno. */}
        {process.payment.cta.label ? (
          <Reveal delay={0.3}>
            <ButtonLink
              href={process.payment.cta.href}
              size="lg"
              className="mt-9"
            >
              {process.payment.cta.label}
            </ButtonLink>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
