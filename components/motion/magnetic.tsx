"use client";

import { useRef, type ReactNode } from "react";

import { gsap } from "@/lib/motion";

/**
 * El hijo sigue apenas al cursor y vuelve a su lugar al salir. Solo en punteros
 * finos: en touch no aplica, y con reduced-motion tampoco.
 */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    const node = ref.current;
    if (!node || !enabled()) return;
    const box = node.getBoundingClientRect();
    gsap.to(node, {
      x: (event.clientX - (box.left + box.width / 2)) * strength,
      y: (event.clientY - (box.top + box.height / 2)) * strength,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  function handleLeave() {
    const node = ref.current;
    if (!node) return;
    gsap.to(node, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  );
}
