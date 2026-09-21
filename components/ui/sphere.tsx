import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/tones";

/**
 * Una esfera iluminada desde arriba.
 *
 * El degradé no está puesto a ojo: salió de medir la referencia píxel por
 * píxel sobre la columna central, y de ahí salieron dos cosas que no se
 * adivinan mirando.
 *
 * La primera es que la banda de color es PLANA. Parece que siguiera la
 * curvatura de la esfera, pero está a la misma altura —51% del diámetro— en
 * todo el ancho: se corrió apenas un punto y medio a ochenta por ciento del
 * radio. O sea que es un degradé lineal vertical y no uno radial, que es lo que
 * uno haría por instinto y da una mancha centrada en vez de un horizonte.
 *
 * La segunda es que los grises del medio son neutros. Entre el casquete claro y
 * la banda hay una rampa —#c2c1be, #989999, #868483— sin nada de color: es la
 * sombra propia de la esfera, no una transición hacia el tono. Por eso acá van
 * escritos tal cual y solo la banda y lo que está abajo cambian con el color.
 * Tiñendo también los grises, la esfera se ve como una mancha de un solo color
 * aclarada arriba, que es justo lo que no es.
 *
 * El contorno es un anillo aparte, de un píxel, con su propio degradé vertical:
 * frío arriba, del tono en los costados, nada abajo. Medido en la referencia,
 * el borde de abajo es negro puro; la luz da desde arriba y ahí no llega.
 */

/** El casquete y la rampa de grises: la parte de la esfera que no lleva color. */
const CIMA = "#c9d4db";
const CASQUETE = "#dcddd9";

type Props = {
  tone: Tone;
  className?: string;
};

export function Sphere({ tone, className }: Props) {
  /*
     Los dos colores que cambian salen de los tokens de la paleta, no de
     hexadecimales sueltos: la banda es el tono profundo —que es el que tiene el
     peso justo, ni pastel ni neón— y la sombra es ese mismo tono apenas
     insinuado sobre un azul muy oscuro.

     Que la sombra sea fría y no una versión oscura del tono también salió de la
     medición: abajo de la banda roja la referencia va a #222131, que es más
     azul que el rojo de arriba. Es lo que hace que el borde entre la banda y la
     sombra se lea como un corte de luz y no como un degradé del mismo color.
  */
  const banda = `var(--color-${tone}-deep)`;
  const sombra = `color-mix(in srgb, ${banda} 5%, #1e2032)`;
  const aro = `color-mix(in srgb, var(--color-${tone}) 62%, #ffffff)`;

  return (
    <div
      /* Sin ancho propio: lo pone quien la usa. Tenía w-full y, como el cn()
         de este repo es un join y no un merge, el w-full ganaba contra el
         ancho que le pasaban y la esfera se salía de su caja. */
      className={cn("relative aspect-square rounded-full", className)}
      style={{
        background: [
          `linear-gradient(to bottom,`,
          `${CIMA} 0%,`,
          `${CASQUETE} 4%,`,
          `#d7d6d3 30%,`,
          `#cecdca 34%,`,
          `#c2c1be 38%,`,
          `#989999 42%,`,
          `#868483 44.5%,`,
          `color-mix(in srgb, ${banda} 45%, #868483) 46.5%,`,
          `color-mix(in srgb, ${banda} 80%, #868483) 48.5%,`,
          `${banda} 50.5%,`,
          `color-mix(in srgb, ${banda} 52%, ${sombra}) 52.5%,`,
          `${sombra} 54.5%,`,
          `color-mix(in srgb, ${sombra} 58%, #000000) 59%,`,
          `color-mix(in srgb, ${sombra} 26%, #000000) 64.5%,`,
          `#000000 73%,`,
          `#000000 100%)`,
        ].join(" "),
      }}
    >
      {/*
        El anillo. Un píxel, pintado con el truco de las dos máscaras: se
        rellena la caja entera con el degradé y después se recorta todo menos el
        borde, restando el área de contenido. Un border con degradé no existe, y
        un pseudo-elemento escalado deja el anillo más grueso arriba que abajo
        cuando la caja no es cuadrada perfecta.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full p-px"
        style={{
          background: `linear-gradient(to bottom, ${CIMA} 0%, color-mix(in srgb, ${aro} 70%, #b9cdd6) 26%, ${aro} 50%, color-mix(in srgb, ${aro} 45%, transparent) 62%, transparent 76%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />

      {/*
        El rebote de abajo: en la referencia, entre el 92 y el 96% del diámetro
        hay un calor apenas perceptible, #130c0b sobre negro. Es la luz que
        vuelve del piso. Se nota poco y es de las cosas que separan una esfera
        de un círculo con degradé.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(46% 11% at 50% 97%, color-mix(in srgb, ${banda} 15%, transparent) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
