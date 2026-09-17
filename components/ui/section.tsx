import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Tag, type TagIconName } from "@/components/ui/tag";
import { cn } from "@/lib/cn";

/**
 * Una sección del sitio, con su superficie.
 *
 * El fondo no es un background-color: es una capa que entra con un degradé en
 * los primeros píxeles de la sección y después sigue firme hasta 160px por
 * debajo del borde de abajo. Esa cola es la clave: la sección siguiente tiene
 * algo sólido sobre lo que aparecer, así que en el cruce lo que se ve es una
 * mezcla que va de un color al otro y no un color contra el papel de fondo.
 *
 * Se probó al revés —la capa saliéndose por arriba— y no sirve: la tira de
 * logos mide cien píxeles y la rampa de la sección siguiente se la comía
 * entera, dejándola lavada a medio camino entre los dos colores.
 *
 * La diferencia con un color plano es la que se siente al bajar. Con fondos
 * planos el cambio es una línea recta que cruza la pantalla —y con una sección
 * negra eso se lee directamente como un corte—; así, el color nuevo sube desde
 * el pie y va ganando la pantalla mientras uno scrollea.
 *
 * La rampa entra dentro del propio aire de arriba de la sección (112px, o 160
 * en las oscuras, que necesitan más recorrido porque el salto es mayor), así
 * que nunca cae sobre un texto. Y aunque cayera, el contenido va en z-10 y la
 * capa no: una palabra jamás queda tapada.
 */

/** Cuánto tarda cada superficie en aparecer del todo. */
const rampas = { paper: 100, mist: 100, deep: 150 } as const;

/** Cuánto sigue cada superficie por debajo de su sección, para que la que
    viene tenga sobre qué aparecer. Le sobra a propósito. */
const COLA = 160;

const superficies = {
  /** Blanco. La superficie de las secciones que muestran tarjetas. */
  paper: { fondo: "bg-paper", tinta: "" },
  /** La bruma del hero. */
  mist: { fondo: "bg-mist", tinta: "" },
  /** Negro, con la tinta clara que le corresponde. */
  deep: { fondo: "bg-deep", tinta: "text-paper" },
} as const;

export type Surface = keyof typeof superficies;

export function Section({
  id,
  children,
  className,
  surface = "paper",
  overlay,
  wide = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  surface?: Surface;
  /** Capa decorativa a sangre, detrás del contenido y fuera del ancho de
      lectura. Va acá y no dentro de los hijos porque el contenido vive en
      .shell, que tiene ancho máximo: un degradé ahí adentro se corta. */
  overlay?: ReactNode;
  /** Usa el contenedor ancho, para secciones que no son un renglón de lectura. */
  wide?: boolean;
}) {
  const { fondo, tinta } = superficies[surface];
  const rampa = `linear-gradient(to bottom, transparent 0, #000 ${rampas[surface]}px, #000 100%)`;

  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", tinta, className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          bottom: `-${COLA}px`,
          maskImage: rampa,
          WebkitMaskImage: rampa,
        }}
      >
        <div className={cn("absolute inset-0", fondo)} />
      </div>

      {overlay}

      <div className={cn("relative z-10", wide ? "shell-wide" : "shell")}>
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  icon,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
  icon?: TagIconName;
}) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow ? (
        <Reveal>
          <div className={cn(align === "center" && "flex justify-center")}>
            <Tag icon={icon} onDark={onDark}>
              {eyebrow}
            </Tag>
          </div>
        </Reveal>
      ) : null}

      <SplitHeading
        text={title}
        className={cn("mt-5 text-h2", onDark && "text-paper")}
      />

      {lead ? (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-5 text-lead",
              onDark ? "text-white/60" : "text-ink-soft",
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
