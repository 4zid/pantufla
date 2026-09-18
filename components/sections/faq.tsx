"use client";

import { useGSAP } from "@gsap/react";
import { useId, useRef, useState } from "react";

import { socialProof } from "@/content/site";
import { useCopy } from "@/components/copy-provider";
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
 * Una sola columna de tarjetas blancas numeradas, sobre el fondo de la página.
 *
 * Tuvieron una bandeja gris alrededor que las agrupaba en un solo bloque. La
 * idea era que el acordeón se leyera como una pieza y no como ocho cajas
 * sueltas, pero el gris no existe en ninguna otra parte del sitio: aparecía un
 * rectángulo de un color que no es de acá, justo en la sección más larga. Lo
 * que agrupa ahora es que las ocho tarjetas midan lo mismo, estén a la misma
 * distancia y compartan el ancho: alcanza, y no hace falta meter un color.
 *
 * Antes eran dos columnas. Con una sola, abrir una pregunta empuja a las de
 * abajo y nada más —en dos columnas había que armarlas como dos listas
 * independientes para que la de al lado no creciera vacía— y además la
 * pregunta y su respuesta quedan en la misma línea de lectura, que es lo que
 * uno busca cuando entra acá.
 *
 * Abajo, el cierre para el que no encontró lo que buscaba: no tiene sentido
 * que la única salida de esta sección sea seguir bajando.
 *
 * Las tarjetas van apretadas. Con el aire de antes —py-6, texto de 1.08rem,
 * 12px entre una y otra— las ocho más el titular y el cierre medían 1320px y
 * no entraban en la pantalla de una notebook de 16": había que scrollear para
 * ver de qué se puede preguntar. Un acordeón cerrado es un índice, y un índice
 * que no se ve entero no sirve de índice. Cerradas miden lo que mide su
 * renglón; el aire aparece cuando una se abre, que es cuando hace falta.
 *
 * El alto lo maneja GSAP y nadie más. Antes el estado cerrado venía en un
 * style de React —height 0 al cerrar, sin style al abrir—, así que al hacer
 * clic React sacaba el style y el panel saltaba a su alto natural en el mismo
 * cuadro; para cuando GSAP arrancaba, ya no quedaba nada que animar y el tween
 * iba de auto a auto. Eso era el golpe: no es que faltara la animación, es que
 * llegaba tarde. Ahora el cerrado es una clase —que además sirve como estado
 * inicial antes de que corra nada— y de ahí en adelante la altura vive en el
 * style inline, que le gana a la clase y es de GSAP.
 */

/** El signo se arma con dos barras: la vertical se encoge y queda el menos. */
function Signo({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:scale-110"
    >
      <span className="absolute h-[1.5px] w-2.5 rounded-full bg-current" />
      <span
        className={cn(
          "absolute h-2.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
          open ? "scale-y-0" : "scale-y-100",
        )}
      />
    </span>
  );
}

export function Faq() {
  const { faq } = useCopy();
  const [open, setOpen] = useState<number | null>(null);
  const scope = useRef<HTMLDivElement>(null);
  /** La pregunta que se acaba de tocar, para dejarla quieta mientras se abre. */
  const ancla = useRef<HTMLElement | null>(null);
  const uid = useId();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      registerGsap();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Abrir una pregunta cierra la anterior, y si esa estaba más arriba la
      // página se acorta justo encima de donde el visitante está mirando: la
      // pregunta que acaba de tocar se le escapa hacia arriba mientras la lee.
      // Mientras dura el movimiento se mide cuánto se corrió el encabezado que
      // tocó y se compensa con el scroll, así queda clavado en su lugar y lo
      // único que se mueve es lo que tiene que moverse: el panel abriéndose.
      const fijo = ancla.current;
      const antes = fijo?.getBoundingClientRect().top ?? null;

      root.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        const abierto = panel.dataset.open === "true";
        const inner = panel.firstElementChild;

        // Abrir va más lento que cerrar. Una apertura pausada se lee como que
        // el contenido llega; un cierre pausado se lee como que el botón no
        // respondió. La salida de expo frena casi al final, que es lo que le
        // saca el golpe seco al momento en que la altura queda fija.
        gsap.to(panel, {
          height: abierto ? "auto" : 0,
          // Un clic rápido sobre otra pregunta no espera a que termine la
          // anterior: el tween nuevo pisa al viejo en vez de sumarse.
          overwrite: true,
          duration: reduced ? 0 : abierto ? 0.62 : 0.38,
          ease: abierto ? "expo.out" : "power2.inOut",
        });

        if (inner) {
          gsap.to(inner, {
            opacity: abierto ? 1 : 0,
            y: abierto ? 0 : 14,
            overwrite: true,
            // Al abrir, el texto entra cuando la altura ya se está frenando,
            // no desde el arranque: si sube junto con el panel, se lee dos
            // veces el mismo movimiento.
            duration: reduced ? 0 : abierto ? 0.5 : 0.22,
            delay: reduced || !abierto ? 0 : 0.16,
            ease: abierto ? "power3.out" : "power1.in",
          });
        }
      });

      if (fijo && antes !== null) {
        // El sitio pide scroll suave para los enlaces internos, y eso también
        // se aplica a estas correcciones: cada cuadro pedía deslizarse unos
        // pocos píxeles, el navegador lo empezaba a animar y el cuadro
        // siguiente lo pisaba con otro pedido. Resultado: el ajuste nunca
        // llegaba y la pregunta se corría los 102px enteros igual. Acá el
        // salto tiene que ser seco, así que se apaga mientras dura.
        const raiz = document.documentElement;
        const suave = raiz.style.scrollBehavior;
        raiz.style.scrollBehavior = "auto";

        const compensar = () => {
          const corrimiento = fijo.getBoundingClientRect().top - antes;
          if (Math.abs(corrimiento) > 0.5) window.scrollBy(0, corrimiento);
        };
        gsap.ticker.add(compensar);
        gsap.delayedCall(reduced ? 0.05 : 0.7, () => {
          gsap.ticker.remove(compensar);
          raiz.style.scrollBehavior = suave;
        });
      }
    },
    { dependencies: [open], scope },
  );

  return (
    <Section id="faq" className="py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <Tag icon="ayuda">{faq.eyebrow}</Tag>
          </div>
        </Reveal>
        <SplitHeading text={faq.title} className="mt-4 text-h2" />
      </div>

      <Reveal delay={0.1}>
        <div ref={scope} className="mx-auto mt-9 max-w-3xl md:mt-10">
          <div className="flex flex-col gap-2.5">
            {faq.items.map((item, i) => {
              const abierto = open === i;

              return (
                <div
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-[16px] bg-card transition-shadow duration-500",
                    abierto
                      ? "shadow-[0_14px_34px_-24px_rgba(0,0,0,0.45)]"
                      : "shadow-none",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        ancla.current = e.currentTarget;
                        setOpen(abierto ? null : i);
                      }}
                      aria-expanded={abierto}
                      aria-controls={`${uid}-${i}`}
                      className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left md:px-6 md:py-4"
                    >
                      <span className="flex min-w-0 items-baseline gap-2 text-[0.95rem] font-medium leading-snug tracking-[-0.015em] md:text-[1rem]">
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
                    /* Mismo criterio que el panel de planes: inert y no
                       aria-hidden. Hoy adentro hay un párrafo y nada más, pero
                       basta que una respuesta lleve un enlace para que se
                       pueda tabular con la pregunta cerrada. */
                    inert={!abierto}
                    className="h-0 overflow-hidden"
                  >
                    <p className="translate-y-3.5 px-4 pb-4 pl-[2.1rem] text-[0.9rem] leading-relaxed text-ink-soft opacity-0 md:px-6 md:pb-5 md:pl-[2.75rem]">
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
        <div className="mt-10 flex flex-col items-center text-center">
          {/* El solapado es corto a propósito: con fotos podría ser el doble,
              pero acá hay iniciales y el borde de la de al lado les come la
              última letra. */}
          <div className="flex -space-x-1.5">
            {socialProof.faces.map((face) => (
              <span
                key={face.initials}
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-full text-[0.68rem] font-semibold text-white ring-[3px] ring-paper-alt"
                style={{
                  background: `linear-gradient(140deg, ${face.from}, ${face.to})`,
                }}
              >
                {face.initials}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[1.08rem] font-medium tracking-[-0.02em]">
            {faq.cta.claim}
          </p>
          <ButtonLink href={faq.cta.href} className="mt-3.5">
            {faq.cta.label}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
