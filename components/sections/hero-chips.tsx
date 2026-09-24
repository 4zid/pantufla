"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { useCopy } from "@/components/copy-provider";
import { HeroChip } from "@/components/ui/hero-chip";
import { gsap, registerGsap } from "@/lib/motion";
import type { Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Las tres pastillas flotando entre los paneles del hero, solo en escritorio.
 *
 * Van en los huecos que dejan los cuatro paneles dispersos: una arriba a la
 * izquierda, al costado del panel de conversión; una a media altura a la
 * izquierda, en el hueco entre conversión y velocidad; y una a la derecha, en
 * el hueco entre visitas y tráfico. Nunca cruzan el tercio central, así que
 * no compiten con el titular ni con los botones.
 *
 * Las dos de los huecos no van a un porcentaje fijo de la pantalla sino al
 * centro del hueco, y el hueco se mueve con el alto de la pantalla: los
 * paneles se ubican en porcentaje pero miden píxeles, así que a 800 de alto
 * el hueco es una franja y a 1080 es medio panel. La cuenta es la mitad de
 * la suma de «pie del panel de arriba» y «techo del panel de abajo», con la
 * escala 1,18 de la dispersión ya incluida, menos media pastilla.
 *
 * Flotan de verdad: cada una sube y baja unos píxeles a su propio ritmo, en
 * bucle, con curva senoidal. Es lo que las hace leerse como objetos que están
 * ahí y no como texto pegado en el fondo. Con prefers-reduced-motion quedan
 * quietas.
 *
 * Van aria-hidden porque el texto ya está en el intro, donde en escritorio
 * queda solo para lectores de pantalla. Repetirlo sería leerlo dos veces.
 */
const puestos: { tone: Tone; className: string }[] = [
  { tone: "aqua", className: "left-[19%] top-[15%]" },
  { tone: "rosa", className: "left-[7%] top-[calc(40%+68px)]" },
  /*
     La de la derecha se esconde en pantallas de menos de 860 de alto. Ahí el
     hueco entre visitas y tráfico mide cincuenta píxeles y la pastilla
     treinta y nueve: entra, pero al flotar roza los dos paneles. Mejor dos
     pastillas bien puestas que tres con una rozando.
  */
  {
    tone: "verde",
    className:
      "right-[7%] top-[calc(46.25%+187px)] [@media(max-height:859px)]:hidden",
  },
];

export function HeroChips() {
  const { hero } = useCopy();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Los chips existen solo desde 1440 (abajo van display: none). Sin esto,
      // tres tweens infinitos le pedían un cuadro por segundo al teléfono
      // para mover algo que no se ve.
      if (!window.matchMedia("(min-width: 1440px)").matches) return;

      gsap.utils
        .selector(root)("[data-chip]")
        .forEach((chip, i) => {
          gsap.to(chip, {
            y: i % 2 === 0 ? 6 : -6,
            duration: 2.8 + i * 0.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className="absolute inset-0 z-30 hidden min-[1440px]:block"
    >
      {hero.proof.slice(0, puestos.length).map((texto, i) => (
        <div
          key={texto}
          data-chip
          className={cn("absolute will-change-transform", puestos[i].className)}
        >
          <HeroChip tone={puestos[i].tone}>{texto}</HeroChip>
        </div>
      ))}
    </div>
  );
}
