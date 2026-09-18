"use client";

import { useGSAP } from "@gsap/react";
import { Fragment, useMemo, useRef, type ElementType } from "react";

import { ease, gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Un tramo del titular. Sin `mark` es texto suelto; con `mark`, va resaltado. */
export type Segment = {
  text: string;
  mark?: "paper" | "ink" | "aqua" | "rosa";
};

type Props = {
  /** Titular plano. Mutuamente excluyente con `segments`. */
  text?: string;
  /** Titular con tramos resaltados. */
  segments?: readonly Segment[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Dispara apenas monta en vez de esperar el scroll (para el hero). */
  immediate?: boolean;
};

const marks: Record<NonNullable<Segment["mark"]>, string> = {
  paper: "bg-card text-ink shadow-[0_2px_10px_-4px_rgba(0,0,0,0.25)]",
  ink: "bg-ink text-paper",
  aqua: "bg-aqua-soft text-aqua-deep",
  rosa: "bg-rosa-soft text-rosa-deep",
};

/**
 * Titular que se revela por unidades, cada una subiendo desde abajo.
 *
 * Las palabras sueltas suben detrás de una máscara. Los tramos resaltados no:
 * la pastilla tiene relleno vertical propio y la máscara, que mide lo que mide
 * la línea, le cortaría el fondo arriba y abajo. Esos entran con opacidad y
 * desplazamiento, que a esta velocidad se lee igual.
 *
 * La máscara se levanta cuando la palabra llegó. Mide lo que mide la caja de
 * línea, que con interlineado apretado es más baja que la letra: mientras
 * recorta, se come la cola de la g, la j y la p. Recortar hace falta solo
 * mientras la palabra viene subiendo —después no hay nada que esconder—, así
 * que al terminar se suelta y las colas vuelven. Si el visitante pidió menos
 * movimiento no hay entrada, y entonces no se recorta nunca.
 *
 * Cada tramo resaltado es una sola unidad aunque tenga varias palabras: la
 * pastilla envuelve la frase entera, así que partirla por palabra daría una
 * pastilla por palabra.
 *
 * El texto queda completo en el DOM, así que se lee y se indexa igual.
 */
export function SplitHeading({
  text,
  segments,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
}: Props) {
  const scope = useRef<HTMLElement>(null);
  const partes: readonly Segment[] = useMemo(
    () => segments ?? [{ text: text ?? "" }],
    [segments, text],
  );

  /**
   * La firma del titular, para que useGSAP sepa cuándo hay algo nuevo.
   *
   * Antes la dependencia era el array de tramos, y sin segments ese array se
   * armaba nuevo en cada render. Para useGSAP eso es una dependencia que
   * cambió: revertía el contexto —o sea devolvía las palabras a opacidad cero
   * abajo de la máscara— y volvía a animar. El efecto era que cualquier cambio
   * de estado en la sección volvía a tirar la animación del titular: abrir una
   * pregunta, pasar por un país del mapa, cambiar de testimonio. El titular no
   * tenía nada que ver, pero vivía adentro del componente que se renderizaba.
   *
   * Con una cadena la comparación es por contenido y no por identidad, así que
   * solo se vuelve a animar si el titular de verdad cambió.
   */
  const firma = partes.map((p) => `${p.mark ?? ""}\u0000${p.text}`).join("\u0001");

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const unidades = root.querySelectorAll("[data-word]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          const mascaras = root.querySelectorAll<HTMLElement>("[data-mask]");
          const soltar = () => gsap.set(mascaras, { overflow: "visible" });

          if (reduced) {
            gsap.set(unidades, { yPercent: 0, y: 0, opacity: 1 });
            soltar();
            return;
          }

          gsap.fromTo(
            unidades,
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease,
              delay,
              stagger: 0.055,
              onComplete: soltar,
              ...(immediate
                ? {}
                : {
                    scrollTrigger: { trigger: root, start: START, once: true },
                  }),
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope, dependencies: [firma, delay, immediate] },
  );

  /**
   * El espacio entre unidades va como nodo de texto hermano y no adentro del
   * span: un espacio al final de un inline-block se descarta al armar la
   * línea, así que dos palabras seguidas terminaban pegadas.
   */
  const unidades: React.ReactNode[] = [];

  partes.forEach((parte, p) => {
    if (parte.mark) {
      unidades.push(
        <span
          key={`m-${p}`}
          data-word
          className={cn(
            "inline-block rounded-[0.26em] px-[0.2em] pb-[0.03em] align-bottom",
            marks[parte.mark],
          )}
        >
          {parte.text}
        </span>,
      );
      return;
    }

    parte.text
      .split(" ")
      .filter(Boolean)
      .forEach((palabra, i) => {
        unidades.push(
          <span
            key={`w-${p}-${i}`}
            data-mask
            className="inline-block overflow-hidden align-bottom"
          >
            <span data-word className="inline-block">
              {palabra}
            </span>
          </span>,
        );
      });
  });

  return (
    <Tag ref={scope} className={className} data-split>
      {unidades.map((unidad, i) => (
        <Fragment key={i}>
          {unidad}
          {i < unidades.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
