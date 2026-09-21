/**
 * La marca.
 *
 * El iso es una pantufla de perfil —una chinela, sin talón— dibujada con las
 * dos formas del sistema, la píldora y el arco. Los trazados son los del kit
 * de marca (Claude Design → Pantufla → Logos, geometria.json) y están
 * copiados tal cual: la marca no se redibuja acá, se pega. Cualquier cambio se
 * hace en el kit y se vuelve a copiar.
 *
 * El nombre, al lado del iso, va en Schibsted Grotesk en mayúsculas, la misma
 * familia del resto del sitio. El kit trae también un logotipo dibujado a
 * mano; en el sitio no se usa, por decisión: el nombre se escribe.
 *
 * El iso hereda currentColor. Sobre claro va en ink; en tema oscuro ink es
 * claro, así que se da vuelta solo sin que nadie lo toque. El único color de
 * marca que admite es aqua, y solo sobre deep: sobre papel o bruma da menos de
 * 2:1 y desaparece. Nunca lleva contorno, sombra ni degradé, no se estira y no
 * se gira.
 */

/** El iso normal, en grilla de 32: caja 3,12 de 26 × 13. Para más de 24px de alto. */
export const ISO =
  "M5.5 25a2.5 2.5 0 0 1 0-5H11C17 20 18.3 16.3 18.7 14.2A2.2 2.2 0 0 1 20.9 12H21a8 8 0 0 1 8 8v2.5a2.5 2.5 0 0 1-2.5 2.5Z";

/**
 * El iso pesado: la misma chinela un punto más gruesa, caja 3,11 de 26 × 14.
 * Para 24px de alto o menos, que es donde la suela normal se afina hasta
 * desaparecer. El favicon y el app icon lo usan siempre.
 */
export const ISO_PESADO =
  "M5.5 25a3 3 0 0 1 0-6H11C17 19 18.3 15.3 18.7 13.2A2.2 2.2 0 0 1 20.9 11H21a8 8 0 0 1 8 8v3a3 3 0 0 1-3 3Z";

/** Las cajas ajustadas al dibujo, sin aire: se dimensiona por alto y el ancho sale solo. */
export const CAJA_ISO = "3 12 26 13";
export const CAJA_ISO_PESADO = "3 11 26 14";

type Props = { className?: string; weight?: "normal" | "heavy" };

/**
 * El isotipo. Solo, donde el nombre ya está dicho —la barra compacta, el
 * favicon, un avatar—, o al lado del nombre escrito.
 */
export function Iso({ weight = "normal", className }: Props) {
  const pesado = weight === "heavy";
  return (
    <svg
      viewBox={pesado ? CAJA_ISO_PESADO : CAJA_ISO}
      className={className}
      aria-hidden="true"
    >
      <path d={pesado ? ISO_PESADO : ISO} fill="currentColor" />
    </svg>
  );
}
