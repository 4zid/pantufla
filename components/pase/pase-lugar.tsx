"use client";

import Image from "next/image";

import { useCopy, useLocale } from "@/components/copy-provider";
import type { OrigenPase } from "@/lib/pase";
import { cn } from "@/lib/cn";

/**
 * Cuánto se inclina el pase cuando está apoyado, en grados. Lo usan la
 * imagen de respaldo y el pase 3D, que tiene que caer exactamente encima.
 */
export const GIROS: Record<OrigenPase, number> = { hero: -3, cierre: 3 };

/**
 * El lugar del pase en la página: el rectángulo donde se apoya.
 *
 * Adentro va la imagen del pase, que es lo que se ve sin JavaScript, sin
 * WebGL, en una placa de video por software o con menos movimiento pedido.
 * Cuando el pase 3D arranca, la imagen se apaga (ver [data-pase-3d] en
 * globals.css) y el pase de verdad se dibuja encima, en un canvas fijo que
 * cubre la ventana. La imagen sigue en la página para el lector de pantalla:
 * el canvas no dice nada.
 *
 * El lugar no se inclina ni se anima; la inclinación la tienen la imagen y
 * el pase 3D, y la entrada (`entra`) la tiene una capa de adentro. Así el
 * rectángulo que mide el pase para apoyarse es el derecho y está quieto
 * desde el primer cuadro, aunque la imagen todavía esté subiendo.
 */
export function PaseLugar({
  origen,
  entra,
  className,
}: {
  origen: OrigenPase;
  /** Si entra con la animación de CSS del hero, y con qué demora. */
  entra?: number;
  className?: string;
}) {
  const { pase } = useCopy();
  const locale = useLocale();

  return (
    <div
      data-pase-lugar={origen}
      className={cn("relative aspect-[640/1000] touch-pan-y", className)}
    >
      <div
        data-entra={entra === undefined ? undefined : ""}
        style={
          entra === undefined
            ? undefined
            : ({ "--entra": `${entra}s` } as React.CSSProperties)
        }
        className="absolute inset-0"
      >
        <Image
          data-pase-respaldo
          src={`/pase/cara-${locale}.webp`}
          alt={pase.alt}
          fill
          sizes="(min-width: 1280px) 280px, 256px"
          className="object-contain drop-shadow-[0_22px_30px_rgba(17,24,60,0.22)] transition-opacity duration-300"
          style={{ transform: `rotate(${GIROS[origen]}deg)` }}
        />
      </div>
    </div>
  );
}
