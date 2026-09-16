"use client";

import { useGSAP } from "@gsap/react";
import { useId, useRef, useState } from "react";

import { faq, socialProof } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Preguntas frecuentes.
 *
 * Una sola columna dentro de una bandeja gris, con cada pregunta en una
 * tarjeta blanca numerada. La bandeja es la que hace el trabajo: agrupa las
 * ocho tarjetas en un solo bloque, así el acordeón se lee como una pieza y no
 * como ocho cajas sueltas flotando sobre el fondo.
 *
 * Antes eran dos columnas. Con una sola, abrir una pregunta empuja a las de
 * abajo y nada más —en dos columnas había que armarlas como dos listas
 * independientes para que la de al lado no creciera vacía— y además la
 * pregunta y su respuesta quedan en la misma línea de lectura, que es lo que
 * uno busca cuando entra acá.
 *
 * Abajo, el cierre para el que no encontró lo que buscaba: no tiene sentido
 * que la única salida de esta sección sea seguir bajando.
 */

/** El signo se arma con dos barras: la vertical se encoge y queda el menos. */
function Signo({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:scale-110"
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

        // Abrir va más lento que cerrar. Una apertura pausada se lee como que
        // el contenido llega; un cierre pausado se lee como que el botón no
        // respondió. La salida de expo frena casi al final, que es lo que le
        // saca el golpe seco al momento en que la altura queda fija.
        gsap.to(panel, {
          height: abierto ? "auto" : 0,
          duration: reduced ? 0 : abierto ? 0.62 : 0.38,
          ease: abierto ? "expo.out" : "power2.inOut",
        });

        if (inner) {
          gsap.to(inner, {
            opacity: abierto ? 1 : 0,
            y: abierto ? 0 : 14,
            // Al abrir, el texto entra cuando la altura ya se está frenando,
            // no desde el arranque: si sube junto con el panel, se lee dos
            // veces el mismo movimiento.
            duration: reduced ? 0 : abierto ? 0.5 : 0.22,
            delay: reduced || !abierto ? 0 : 0.16,
            ease: abierto ? "power3.out" : "power1.in",
          });
        }
      });
    },
    { dependencies: [open], scope },
  );

  return (
    <Section id="faq" tone="alt">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <Tag icon="ayuda">{faq.eyebrow}</Tag>
          </div>
        </Reveal>
        <SplitHeading text={faq.title} className="mt-4 text-h2" />
      </div>

      {/* La bandeja. El aire de adentro es más chico que el de afuera para que
          se lea como un contenedor y no como otra tarjeta más. */}
      <Reveal delay={0.1}>
        <div
          ref={scope}
          className="mx-auto mt-12 max-w-3xl rounded-[28px] bg-line p-3 md:p-4"
        >
          <div className="flex flex-col gap-2.5 md:gap-3">
            {faq.items.map((item, i) => {
              const abierto = open === i;

              return (
                <div
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-[18px] bg-card transition-shadow duration-500",
                    abierto
                      ? "shadow-[0_14px_34px_-24px_rgba(0,0,0,0.45)]"
                      : "shadow-none",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(abierto ? null : i)}
                      aria-expanded={abierto}
                      aria-controls={`${uid}-${i}`}
                      className="group flex w-full items-center justify-between gap-5 px-5 py-5 text-left md:px-7 md:py-6"
                    >
                      <span className="flex min-w-0 items-baseline gap-2 text-[1.02rem] font-medium leading-snug tracking-[-0.015em] md:text-[1.08rem]">
                        {/* El número va en tinta apagada: ordena la lista sin
                            competir con la pregunta, que es lo que se lee. */}
                        <span className="shrink-0 text-ink-faint">
                          {i + 1}.
                        </span>
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
                      className="px-5 pb-6 pl-[2.4rem] text-[0.95rem] leading-relaxed text-ink-soft md:px-7 md:pb-7 md:pl-[3.1rem]"
                      style={
                        abierto
                          ? undefined
                          : { opacity: 0, transform: "translateY(14px)" }
                      }
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Cierre: las caras primero, que es lo que hace que el «hablemos» sea
          con alguien y no con un formulario. */}
      <Reveal delay={0.15}>
        <div className="mt-12 flex flex-col items-center text-center">
          {/* El solapado es corto a propósito: con fotos podría ser el doble,
              pero acá hay iniciales y el borde de la de al lado les come la
              última letra. */}
          <div className="flex -space-x-1.5">
            {socialProof.faces.map((face) => (
              <span
                key={face.initials}
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-full text-[0.7rem] font-semibold text-white ring-[3px] ring-paper-alt"
                style={{
                  background: `linear-gradient(140deg, ${face.from}, ${face.to})`,
                }}
              >
                {face.initials}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[1.15rem] font-medium tracking-[-0.02em]">
            {faq.cta.claim}
          </p>
          <ButtonLink href={faq.cta.href} className="mt-4">
            {faq.cta.label}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
