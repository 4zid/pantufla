"use client";

import { useId } from "react";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * El nombre, en peluche.
 *
 * Es texto de verdad —la tipografía del sitio, en negrita, minúscula— pasado
 * por un filtro SVG que le pone pelo. No es una imagen: se da vuelta con el
 * tema porque pinta con currentColor, escala sin perder nada porque es
 * vectorial, y si mañana cambia la fuente del sitio cambia también acá.
 *
 * El pelo son tres capas:
 *
 * - Dos pelusas: copias de las letras, engordadas, desplazadas por un ruido
 *   anisotrópico —fino en x, alto en y— que las deshilacha en hebras
 *   verticales, y después difuminadas y bajadas de opacidad. Una larga y muy
 *   tenue, el halo que tiene un peluche a contraluz; una corta y más
 *   presente, el pelo pegado al cuerpo. Con una sola capa el borde se leía
 *   como pixelado, no como peludo: hace falta la profundidad.
 *
 * - El cuerpo: las letras mismas, redondeadas con un cierre morfológico
 *   —dilatar y erosionar lo mismo rellena las esquinas cóncavas— y apenas
 *   erizadas. Sin esto la pelusa queda alrededor de una letra lisa y parece
 *   un texto con sombra borrosa, no una letra peluda.
 *
 * El ruido es determinista —seed fijo— para que el logo sea el mismo en cada
 * carga y en cada máquina. Un logo que cambia cada vez que se recarga no es
 * un logo.
 *
 * textLength fuerza el ancho: la fuente es la del sistema y cambia de ancho
 * de un sistema a otro; sin esto, en Windows la última letra se salía del
 * viewBox. Con lengthAdjust en spacing se ajusta el aire entre letras y no
 * la forma de las letras.
 */
export function Wordmark({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filtro = `peluche-${id}`;

  return (
    <svg
      viewBox="0 0 330 92"
      className={cn("block w-auto overflow-visible", className)}
      role="img"
      aria-label={site.name}
    >
      <defs>
        <filter
          id={filtro}
          x="-12%"
          y="-45%"
          width="124%"
          height="190%"
          colorInterpolationFilters="sRGB"
        >
          {/* El ruido de las fibras: fino en x, alto en y, así desplaza en
              hebras verticales cortas y no en manchas. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.55"
            numOctaves="3"
            seed="11"
            result="pelo"
          />

          {/* La pelusa larga, muy tenue: el halo exterior. */}
          <feMorphology in="SourceGraphic" operator="dilate" radius="5" result="gordo2" />
          <feDisplacementMap
            in="gordo2"
            in2="pelo"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
            result="pelusa2"
          />
          <feGaussianBlur in="pelusa2" stdDeviation="2.2" result="pelusa2Suave" />
          <feComponentTransfer in="pelusa2Suave" result="pelusa2Tenue">
            <feFuncA type="linear" slope="0.26" />
          </feComponentTransfer>

          {/* La pelusa corta, un poco más presente. */}
          <feMorphology in="SourceGraphic" operator="dilate" radius="2.6" result="gordo1" />
          <feDisplacementMap
            in="gordo1"
            in2="pelo"
            scale="13"
            xChannelSelector="R"
            yChannelSelector="G"
            result="pelusa1"
          />
          <feGaussianBlur in="pelusa1" stdDeviation="0.55" result="pelusa1Suave" />
          <feComponentTransfer in="pelusa1Suave" result="pelusa1Tenue">
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>

          {/* El cuerpo: las letras redondeadas —un cierre morfológico, que
              rellena las esquinas cóncavas— y apenas erizadas. */}
          <feMorphology in="SourceGraphic" operator="dilate" radius="2" result="cerrado1" />
          <feMorphology in="cerrado1" operator="erode" radius="2" result="redondo" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.55"
            numOctaves="2"
            seed="4"
            result="grano"
          />
          <feDisplacementMap
            in="redondo"
            in2="grano"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
            result="cuerpoErizado"
          />
          <feGaussianBlur in="cuerpoErizado" stdDeviation="0.45" result="cuerpo" />

          <feMerge>
            <feMergeNode in="pelusa2Tenue" />
            <feMergeNode in="pelusa1Tenue" />
            <feMergeNode in="cuerpo" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="4"
        y="70"
        fontSize="76"
        fontWeight={700}
        letterSpacing="-0.035em"
        textLength="318"
        lengthAdjust="spacing"
        fill="currentColor"
        filter={`url(#${filtro})`}
      >
        {site.name.toLowerCase()}
      </text>
    </svg>
  );
}
