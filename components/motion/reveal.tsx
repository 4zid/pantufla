"use client";

import { useGSAP } from "@gsap/react";
import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

import { ease, gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** Escalona los hijos directos en vez de animar el bloque entero. */
  stagger?: boolean;
  /** Retraso en segundos. */
  delay?: number;
  /** Distancia de entrada en px. */
  y?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Revela contenido al entrar en pantalla.
 *
 * El contenido se marca con data-reveal y el CSS lo oculta SOLO cuando la clase
 * .motion-ready está en <html> (la pone un script inline antes del primer
 * pintado). Así no hay destello, y si el JS no corre nunca, todo queda visible.
 *
 * El estado inicial (opacidad cero, corrido hacia abajo) es del CSS, y el
 * tween es un `to` con immediateRender: false: al crearse no escribe nada,
 * solo mide dónde está el trigger. Ver la nota «Movimiento» en globals.css:
 * hay uno de estos por bloque y, si cada uno escribiera al crearse, la
 * hidratación sería una cadena de reflows forzados.
 */
export function Reveal({
  children,
  stagger = false,
  delay = 0,
  y = 24,
  as: Tag = "div",
  className,
}: Props) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const targets = stagger
        ? Array.from(root.children)
        : [root.querySelector("[data-reveal]") ?? root];

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          if (reduced) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
          }

          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease,
            delay,
            stagger: stagger ? 0.08 : 0,
            immediateRender: false,
            scrollTrigger: { trigger: root, start: START, once: true },
          });
        },
      );

      return () => mm.revert();
    },
    { scope, dependencies: [stagger, delay, y] },
  );

  return (
    <Tag
      ref={scope}
      className={className}
      data-reveal-group={stagger ? "" : undefined}
      data-reveal={stagger ? undefined : ""}
      // La distancia de entrada la lee el CSS; 24 es el valor de la hoja.
      style={
        y !== 24 ? ({ "--reveal-y": `${y}px` } as CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
