"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap, registerGsap } from "@/lib/motion";

const format = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/**
 * Número que rueda hasta su valor. Se usa en los precios: al cambiar el toggle
 * la cifra viaja en vez de saltar, que es lo que hace legible el descuento.
 */
export function Counter({
  value,
  prefix = "",
  className,
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const el = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;
      registerGsap();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        node.textContent = prefix + format.format(value);
        shown.current = value;
        return;
      }

      const state = { n: shown.current };
      const tween = gsap.to(state, {
        n: value,
        duration: 0.55,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = prefix + format.format(Math.round(state.n));
        },
        onComplete: () => {
          shown.current = value;
        },
      });

      return () => {
        tween.kill();
      };
    },
    { dependencies: [value, prefix] },
  );

  return (
    <span ref={el} className={className}>
      {prefix + format.format(value)}
    </span>
  );
}
