"use client";

import Image from "next/image";

import { useCopy, useLocale } from "@/components/copy-provider";
import type { OrigenPase } from "@/lib/pase";
import { cn } from "@/lib/cn";

/**
 * Cuánto se inclina el pase cuando está apoyado, en grados de CSS (positivo
 * es a favor de las agujas del reloj). Lo usan la imagen de respaldo y el
 * pase 3D, que tiene que caer exactamente encima.
 *
 * En el banner va acostado: un cuarto de vuelta en contra de las agujas, así
 * la cabecera del pase queda a la izquierda y el talón con el código de
 * barras a la derecha, como se lee un boleto apaisado.
 */
export const GIROS: Record<OrigenPase, number> = { hero: -3, banner: -90 };

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
 *
 * Acostado, el lugar es apaisado (1000 × 640) y el pase 3D lo reconoce por
 * eso: se apoya girado y con el ancho del pase igual al alto del lugar. La
 * imagen hace lo mismo: una caja vertical del tamaño del pase, centrada y
 * girada.
 */
export function PaseLugar({
  origen,
  entra,
  acostado = false,
  sizes = "(min-width: 1280px) 280px, 256px",
  className,
}: {
  origen: OrigenPase;
  /** Si entra con la animación de CSS del hero, y con qué demora. */
  entra?: number;
  acostado?: boolean;
  sizes?: string;
  className?: string;
}) {
  const { pase } = useCopy();
  const locale = useLocale();

  return (
    <div
      data-pase-lugar={origen}
      className={cn(
        "relative touch-pan-y",
        acostado ? "aspect-[1000/640]" : "aspect-[640/1000]",
        className,
      )}
    >
      <div
        data-entra={entra === undefined ? undefined : ""}
        style={
          entra === undefined
            ? undefined
            : ({ "--entra": `${entra}s` } as React.CSSProperties)
        }
        className={
          acostado
            ? "absolute left-1/2 top-1/2 h-[156.25%] w-[64%] -translate-x-1/2 -translate-y-1/2"
            : "absolute inset-0"
        }
      >
        <Image
          data-pase-respaldo
          src={`/pase/cara-${locale}.webp`}
          alt={pase.alt}
          fill
          sizes={sizes}
          className="object-contain drop-shadow-[0_22px_30px_rgba(17,24,60,0.22)] transition-opacity duration-300"
          style={{ transform: `rotate(${GIROS[origen]}deg)` }}
        />
      </div>
    </div>
  );
}
