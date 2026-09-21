import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/tones";

/**
 * Una esfera iluminada desde arriba.
 *
 * Son formas blandas apiladas, no un degradé. Salió de medir la referencia en
 * grilla —once columnas por veinte filas— y de ponerla al lado, porque por la
 * columna del medio parece un degradé vertical y se puede imitar con uno; en
 * cuanto se mira una fila, o se la pone al lado, se ve que no.
 *
 * Lo que hay, de abajo hacia arriba:
 *
 * 0. El borde: un degradé vertical con lo que la esfera tiene en el contorno
 *    a cada altura. Azul frío arriba, gris azulado, gris cálido, y del
 *    ecuador para abajo el rojo, bajando por los flancos hasta casi el pie.
 *    Solo asoma en el filo, donde la máscara ya fundió todo lo demás.
 *
 * Y adentro de una máscara radial —opaca hasta 0,89 del radio, nada a 0,995—
 * que es lo que hace que todo lo de abajo se funda hacia el contorno:
 *
 * 1. Lo de arriba: el azul del polo, la rampa de grises, la banda. Es un
 *    degradé vertical que se vuelve transparente debajo de la banda, porque
 *    de ahí para abajo mandan las elipses.
 *
 * 2. El resplandor: una elipse grande y difusa del color de la banda,
 *    centrada abajo del ecuador y más ancha que la esfera. Está DEBAJO del
 *    negro: lo que se ve de ella es lo que sobra alrededor de la sombra, y
 *    eso es el rojo envolviendo la cabeza del negro por los hombros.
 *
 * 3. La sombra, en dos elipses. Una chata y muy ancha, azul marino, hace la
 *    cabeza —un domo bajo, alto en el medio y cayendo en las puntas— y una
 *    más chica, negra, encima, hace el cuerpo. Lo que asoma de la cabeza
 *    alrededor del cuerpo es el filo azul que tiene la referencia: #1b1f2e
 *    arriba del negro, #1b1b24 en los flancos. Con una sola elipse la cabeza
 *    sale puntiaguda y el negro llega al filo. Medido: la cabeza está a 55%
 *    del diámetro en el centro y a 63% a 0,85 del radio.
 *
 * 4. El casquete: una elipse clara arriba, con el centro más blanco y el
 *    borde muy difuso. El interior arriba es gris, no blanco; el blanco lo
 *    pone esta elipse, y como la máscara la apaga antes del filo, a su
 *    altura el borde de la esfera se lee azul-gris. Medido: a la altura del
 *    casquete el centro es #d8d7d4 y el costado #a4b9bf.
 *
 * 5. El aro, encima de todo, con su propio degradé vertical: frío y
 *    brillante arriba, rosado en el ecuador, rojo en los flancos, casi nada
 *    en el pie.
 *
 * Los grises son neutros a propósito. Entre el casquete y la banda hay una
 * rampa —#c2c1be, #989999, #868483— sin nada de color: es la sombra propia de
 * la esfera. Tiñéndolos también, la esfera se ve como una mancha de un solo
 * color aclarada arriba, que es justo lo que no es.
 *
 * Todo con radial-gradient y no con filter: blur. Un radial con el borde en
 * rampa ES un blur, sin el costo de rasterizar una capa por esfera, y se mide
 * en porcentaje de la caja, así que la esfera se ve igual a 350 que a 800.
 */

/** El casquete: blanco cálido. No blanco. */
const CASQUETE = "#dcddd9";

type Props = {
  tone: Tone;
  className?: string;
};

export function Sphere({ tone, className }: Props) {
  /*
     Los colores que cambian salen de los tokens de la paleta. La banda es el
     tono profundo —que tiene el peso justo, ni pastel ni neón—; el resplandor
     es la banda apenas avivada, y el aro es el tono claro con blanco. La
     sombra lleva apenas un 5% del tono sobre un azul marino: en la referencia
     es #1b1f2e en el filo del negro, más azul que el rojo, y eso es lo que
     hace que ese borde se lea como un corte de luz y no como el mismo color
     oscurecido.

     Los grises cálidos de arriba de la banda también salen del tono, mezclado
     poco en un gris neutro. Estuvieron escritos con los valores de la
     referencia, que es roja, y en las esferas verde, aqua y miel aparecía una
     franja rosada justo arriba del color: el rojo de otra esfera.
  */
  const banda = `var(--color-${tone}-deep)`;
  const viva = `color-mix(in srgb, ${banda} 78%, var(--color-${tone}))`;
  const sombra = `color-mix(in srgb, ${banda} 5%, #1e2032)`;
  const aroLado = `color-mix(in srgb, var(--color-${tone}) 58%, #ffffff)`;
  const humo = (pct: number) => `color-mix(in srgb, ${banda} ${pct}%, transparent)`;

  /*
     Con tamaño explícito y no el circle a secas: sin tamaño, un radial-gradient
     mide sus porcentajes contra la esquina más lejana de la caja, que en un
     cuadrado queda a 1,41 radios, y «opaco hasta 89%» sería opaco siempre.

     Y es una elipse más alta que ancha, centrada abajo del medio, a propósito:
     así el interior se funde antes en los hombros de arriba —donde la
     referencia muestra el limbo azul-gris a 0,9 del radio— y aguanta más
     abajo, donde el negro llega casi hasta el filo y el rojo es una lonja de
     apenas cinco centésimas.
  */
  const mascara =
    "radial-gradient(ellipse 50% 62% at 50% 60%, #000 89%, transparent 99.5%)";

  return (
    <div
      className={cn("relative aspect-square overflow-hidden rounded-full", className)}
      style={{
        /* 0. El borde. */
        background: [
          `linear-gradient(to bottom,`,
          `#b4cbd5 0%,`,
          `#a3c2cb 8%,`,
          `#a3b8c1 22%,`,
          `#939aa3 32%,`,
          `color-mix(in srgb, ${banda} 18%, #8a8d8f) 42%,`,
          `color-mix(in srgb, ${banda} 38%, #8f8d8d) 47%,`,
          `${banda} 52%,`,
          `${banda} 60%,`,
          `color-mix(in srgb, ${banda} 72%, #1a0a0a) 74%,`,
          `color-mix(in srgb, ${banda} 34%, #150809) 90%,`,
          `#150809 100%)`,
        ].join(" "),
      }}
    >
      {/* 1 a 4, adentro de la máscara. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: [
            /* 4. El casquete. */
            `radial-gradient(ellipse 58% 28% at 50% 22%, #e0e1dd 0%, ${CASQUETE} 45%, transparent 100%),`,
            /* 3. La sombra: el cuerpo negro va ENCIMA de la cabeza. La cabeza
                  es azul marino y más ancha; lo que asoma de ella alrededor
                  del cuerpo es el filo azul de la referencia —#1b1f2e arriba,
                  #1b1b24 en los flancos—. Al revés, la cabeza tapaba el negro
                  y la esfera quedaba azul marino hasta el pie. */
            `radial-gradient(ellipse 46% 20% at 50% 80%, #000000 0%, #000000 78%, transparent 100%),`,
            `radial-gradient(ellipse 62% 22% at 50% 74%, #12131d 0%, #12131d 70%, ${sombra} 86%, color-mix(in srgb, ${sombra} 45%, transparent) 95%, transparent 100%),`,
            /* 2. El resplandor, debajo del negro. */
            `radial-gradient(ellipse 62% 18% at 50% 64%, ${viva} 0%, ${viva} 40%, ${banda} 58%, ${humo(70)} 78%, ${humo(24)} 92%, transparent 100%),`,
            /* 1. Lo de arriba. */
            `linear-gradient(to bottom,`,
            `#b4cbd5 0%,`,
            `#8f9dae 22%,`,
            `#9a9c9e 32%,`,
            `#b0b2b1 37.5%,`,
            `#8e9292 42.5%,`,
            `color-mix(in srgb, ${banda} 22%, #8f9192) 47%,`,
            `color-mix(in srgb, ${banda} 52%, #8f9192) 49%,`,
            `color-mix(in srgb, ${banda} 84%, #8f9192) 51%,`,
            `${banda} 52.5%,`,
            `${banda} 54.5%,`,
            `${humo(60)} 58%,`,
            `transparent 64%)`,
          ].join(" "),
          WebkitMaskImage: mascara,
          maskImage: mascara,
        }}
      />

      {/*
        5. El aro. Un píxel y medio, pintado con el truco de las dos máscaras:
        se rellena la caja entera con el degradé y después se recorta todo
        menos el borde, restando el área de contenido. Un border con degradé
        no existe.

        Medido en el contorno de la referencia: arriba es blanco azulado y muy
        brillante —#e8ebf2 a 330°—, en el ecuador es rosado —#e4b8b9 a 180°—,
        en los flancos bajos es rojo y en el pie queda gris apagado.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full p-[1.5px]"
        style={{
          background: `linear-gradient(to bottom, #f1f5f8 0%, #dfe7ed 20%, color-mix(in srgb, ${aroLado} 70%, #cfd6dd) 36%, ${aroLado} 50%, color-mix(in srgb, ${banda} 70%, ${aroLado}) 64%, color-mix(in srgb, ${banda} 60%, transparent) 82%, color-mix(in srgb, #8c8786 40%, transparent) 100%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
