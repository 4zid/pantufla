"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ElementType } from "react";

import { ease, gsap, registerGsap, START } from "@/lib/motion";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Dispara apenas monta en vez de esperar el scroll (para el hero). */
  immediate?: boolean;
};

/**
 * Titular que se revela palabra por palabra, cada una subiendo desde detrás de
 * una máscara. El texto queda en el DOM completo, así que se lee y se indexa
 * igual; solo se envuelve cada palabra en un par de spans.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
}: Props) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const words = root.querySelectorAll("[data-word]");
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          if (reduced) {
            gsap.set(words, { yPercent: 0, opacity: 1 });
            return;
          }

          gsap.fromTo(
            words,
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease,
              delay,
              stagger: 0.055,
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
    { scope, dependencies: [text, delay, immediate] },
  );

  return (
    <Tag ref={scope} className={className} data-split>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span data-word className="inline-block">
            {word}
          </span>
          {i < text.split(" ").length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
