"use client";

import { useState } from "react";

import { useCopy } from "@/components/copy-provider";
import { cn } from "@/lib/cn";

/**
 * Lo que hace que un riel que se mueve solo se pueda frenar.
 *
 * Los rieles (herramientas y clientes) corren sin fin, y algo que se mueve
 * más de cinco segundos al lado de texto que se está leyendo tiene que poder
 * pararse. Con el mouse ya se frenaban al pasar por encima; esto suma las dos
 * maneras que faltaban:
 *
 * - En el teléfono, un toque sobre el riel lo frena y otro lo suelta. Arrastrar
 *   para scrollear no cuenta: el navegador cancela el puntero cuando el dedo
 *   se mueve, así que solo un toque quieto llega como pointerup.
 * - Con el teclado, un botón que no se ve hasta que le llega el foco. Mientras
 *   tiene el foco el riel ya está quieto (ver [data-riel] en globals.css);
 *   apretarlo lo deja quieto también después.
 *
 * Envuelve uno o varios rieles: las dos filas del stack se frenan juntas, que
 * es como se leen.
 */
export function RielPausable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { header } = useCopy();
  const [pausado, setPausado] = useState(false);

  return (
    <div
      data-riel
      data-pausado={pausado ? "" : undefined}
      className={cn("relative", className)}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") setPausado((v) => !v);
      }}
    >
      {children}
      <button
        type="button"
        onClick={() => setPausado((v) => !v)}
        className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ink px-4 py-2 text-[0.85rem] font-medium text-paper opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100"
      >
        {pausado ? header.resumeMotion : header.pauseMotion}
      </button>
    </div>
  );
}
