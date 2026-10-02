"use client";

import { useCopy } from "@/components/copy-provider";
import { HeroChip } from "@/components/ui/hero-chip";
import type { Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Las tres pastillas del hero, solo en escritorio.
 *
 * Arrancan flotando en los huecos que dejan los cuatro paneles dispersos: una
 * arriba a la izquierda, al costado del panel de conversión; una a media
 * altura a la izquierda, en el hueco entre conversión y velocidad; y una a la
 * derecha, en el hueco entre visitas y tráfico. Nunca cruzan el tercio
 * central, así que no compiten con el titular ni con los botones.
 *
 * Al bajar hacen lo mismo que las tarjetas: vuelan y se acomodan en el
 * tablero, en fila en la cabecera, entre «Tu sitio, un mes después» y el
 * rango de fechas. El vuelo y el vaivén los mueve hero-scene, que es donde
 * vive la línea de tiempo de las tarjetas: acá solo está el marcado.
 *
 * Cada pastilla son dos cajas. La de afuera es la que vuela; la de adentro
 * (data-flota) es la que sube y baja mientras están sueltas. Separadas, el
 * vaivén y el vuelo no se pelean por el mismo transform.
 *
 * Las dos de los huecos no van a un porcentaje fijo de la pantalla sino al
 * centro del hueco, y el hueco se mueve con el alto de la pantalla: los
 * paneles se ubican en porcentaje pero miden píxeles, así que a 800 de alto
 * el hueco es una franja y a 1080 es medio panel. La cuenta es la mitad de
 * la suma de «pie del panel de arriba» y «techo del panel de abajo», con la
 * escala 1,18 de la dispersión ya incluida, menos media pastilla.
 *
 * Van aria-hidden porque el texto ya está en el intro, donde en escritorio
 * queda solo para lectores de pantalla. Repetirlo sería leerlo dos veces.
 */
const puestos: { tone: Tone; className: string }[] = [
  { tone: "aqua", className: "left-[19%] top-[15%]" },
  { tone: "rosa", className: "left-[7%] top-[calc(40%+68px)]" },
  /*
     La de la derecha arranca invisible en pantallas de menos de 860 de alto.
     Ahí el hueco entre visitas y tráfico mide cincuenta píxeles y la pastilla
     treinta y nueve: entra, pero al flotar roza los dos paneles. Va con
     opacidad y no oculta del todo porque igual tiene que llegar al tablero:
     aparece en pleno vuelo, cuando ya dejó el hueco.
  */
  {
    tone: "verde",
    className:
      "right-[7%] top-[calc(46.25%+187px)] [@media(max-height:859px)]:opacity-0",
  },
];

export function HeroChips() {
  const { hero } = useCopy();

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-30 hidden min-[1440px]:block"
    >
      {hero.proof.slice(0, puestos.length).map((texto, i) => (
        <div
          key={texto}
          data-chip
          className={cn("absolute will-change-transform", puestos[i].className)}
        >
          <div data-flota>
            <HeroChip tone={puestos[i].tone}>{texto}</HeroChip>
          </div>
        </div>
      ))}
    </div>
  );
}
