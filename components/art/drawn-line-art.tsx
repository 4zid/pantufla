"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap, registerGsap, START } from "@/lib/motion";
import { LineArt, type LineArtName } from "./line-art";

/**
 * El dibujo se traza solo al entrar en pantalla, trazo por trazo. El largo de
 * cada path se mide con getTotalLength(), así no hace falta ningún plugin.
 */
export function DrawnLineArt({
  name,
  className,
  strokeWidth,
}: {
  name: LineArtName;
  className?: string;
  strokeWidth?: number;
}) {
  const scope = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const strokes = Array.from(
        root.querySelectorAll<SVGPathElement>("[data-stroke]"),
      );
      if (!strokes.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          if (reduced) return;

          strokes.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          });

          gsap.to(strokes, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: "power2.inOut",
            stagger: 0.12,
            scrollTrigger: { trigger: root, start: START, once: true },
          });
        },
      );

      return () => mm.revert();
    },
    { scope, dependencies: [name] },
  );

  return (
    <span ref={scope} className="contents">
      <LineArt name={name} className={className} strokeWidth={strokeWidth} />
    </span>
  );
}
