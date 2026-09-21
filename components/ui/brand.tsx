/**
 * La marca.
 *
 * Una pantufla de perfil —una chinela, sin talón— dibujada con las dos formas
 * del sistema, la píldora y el arco, y «pantufla» dibujado a medida con la
 * misma línea. Los trazados son los del kit de marca (Claude Design → Pantufla
 * → Logos, geometria.json) y están copiados tal cual: la marca no se redibuja
 * acá, se pega. Cualquier cambio se hace en el kit y se vuelve a copiar.
 *
 * Todo hereda currentColor. Sobre claro va en ink; en tema oscuro ink es claro,
 * así que se da vuelta sola sin que nadie la toque. El único color de marca que
 * admite es aqua, solo en el iso y solo sobre deep: sobre papel o bruma da
 * menos de 2:1 y desaparece.
 *
 * Nunca lleva contorno, sombra ni degradé, no se estira, no se gira, y el
 * nombre no se escribe con una tipografía: el logotipo es un dibujo.
 */

/** El iso normal, en grilla de 32: caja 3,12 de 26 × 13. Para 24px de alto o más. */
const ISO =
  "M5.5 25a2.5 2.5 0 0 1 0-5H11C17 20 18.3 16.3 18.7 14.2A2.2 2.2 0 0 1 20.9 12H21a8 8 0 0 1 8 8v2.5a2.5 2.5 0 0 1-2.5 2.5Z";

/**
 * El iso pesado: la misma chinela un punto más gruesa, caja 3,11 de 26 × 14.
 * Para 24px de alto o menos, que es donde la suela normal se afina hasta
 * desaparecer. El favicon y el app icon lo usan siempre.
 */
const ISO_PESADO =
  "M5.5 25a3 3 0 0 1 0-6H11C17 19 18.3 15.3 18.7 13.2A2.2 2.2 0 0 1 20.9 11H21a8 8 0 0 1 8 8v3a3 3 0 0 1-3 3Z";

/**
 * «pantufla»: monolínea de trazo 6 con terminales redondos, altura de x 22,
 * caja -3,5 de 240.5 × 50. Guardado como trazo y no como contorno, igual que
 * en el kit.
 */
const LOGOTIPO =
  "M0 18V52M0 29a11 11 0 1 0 22 0a11 11 0 1 0 -22 0M32.5 29a11 11 0 1 0 22 0a11 11 0 1 0 -22 0M54.5 18V40M68 18V40M68 29a11 11 0 0 1 22 0V40M108.5 10V32a8 8 0 0 0 8 8h1M103.5 18h11M131 18V29a11 11 0 0 0 22 0V18M153 18V40M171.5 40V15a7 7 0 0 1 7-7M166.5 18h11M192 8V32a8 8 0 0 0 8 8h1M212.5 29a11 11 0 1 0 22 0a11 11 0 1 0 -22 0M234.5 18V40";

/**
 * Cómo se arma el isologotipo horizontal: el iso a la altura de x del
 * logotipo, apoyado en la misma línea de base, y 12 unidades de aire hasta la
 * p. A esa escala la suela pesa 1,4 veces el trazo de las letras. Las
 * proporciones son fijas: no se agranda el iso para que se vea ni se acerca el
 * logotipo para que entre.
 */
const ISO_EN_HORIZONTAL = "translate(-5.077 -2.308) scale(1.692)";
const LOGOTIPO_EN_HORIZONTAL = "translate(56 0)";
const CAJA_HORIZONTAL = "-3 5 296.5 50";

const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Props = { className?: string };

/**
 * El isotipo solo. Va donde el nombre ya está dicho: la barra compacta, el
 * favicon, un avatar. La caja es la del dibujo, sin aire, así que se
 * dimensiona por alto y el ancho sale solo (2:1 el normal, 26:14 el pesado).
 */
export function Iso({
  weight = "normal",
  className,
}: Props & { weight?: "normal" | "heavy" }) {
  const pesado = weight === "heavy";
  return (
    <svg
      viewBox={pesado ? "3 11 26 14" : "3 12 26 13"}
      className={className}
      aria-hidden="true"
    >
      <path d={pesado ? ISO_PESADO : ISO} fill="currentColor" />
    </svg>
  );
}

/** «pantufla» solo, para cuando el iso ya apareció en la misma vista. */
export function Wordmark({ className }: Props) {
  return (
    <svg viewBox="-3 5 240.5 50" className={className} aria-hidden="true">
      <path d={LOGOTIPO} {...trazo} />
    </svg>
  );
}

/**
 * El isologotipo horizontal: la versión principal. Header, pie, firma. Mínimo
 * 120px de ancho; por debajo, el iso solo.
 */
export function Isologo({ className }: Props) {
  return (
    <svg viewBox={CAJA_HORIZONTAL} className={className} aria-hidden="true">
      <path transform={ISO_EN_HORIZONTAL} d={ISO} fill="currentColor" />
      <path transform={LOGOTIPO_EN_HORIZONTAL} d={LOGOTIPO} {...trazo} />
    </svg>
  );
}

/**
 * El mismo isologotipo como SVG suelto, para donde no llega React: la imagen
 * de OG se rasteriza con Satori, que no entiende transform en un path pero sí
 * dibuja una <img> con un SVG entero.
 */
export function isologoSvg(color: string) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CAJA_HORIZONTAL}">` +
    `<path transform="${ISO_EN_HORIZONTAL}" d="${ISO}" fill="${color}"/>` +
    `<path transform="${LOGOTIPO_EN_HORIZONTAL}" d="${LOGOTIPO}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `</svg>`
  );
}
