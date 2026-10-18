import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Tag, type TagIconName } from "@/components/ui/tag";
import { cn } from "@/lib/cn";

/**
 * Una sección del sitio.
 *
 * No pinta ningún fondo: declara de qué color quiere que esté la página
 * mientras se la mira y el motor del tema (components/theme-scroll.tsx) se
 * ocupa. El fondo del sitio es uno solo y va cambiando con el scroll.
 *
 * Se probó al revés, con cada sección pintando lo suyo y una rampa de degradé
 * en el borde para que no cortara. No sirve: la rampa es una banda que cruza
 * la pantalla, y una banda es tan visible como el corte que venía a tapar.
 * Moviendo el fondo entero no hay borde en ninguna parte, y además el
 * visitante ve cómo cambia, que era lo que se buscaba.
 *
 * Las secciones oscuras tampoco llevan tinta clara propia: el tema entero se
 * da vuelta —tinta, líneas, tarjetas— así que alcanza con decir deep.
 *
 * Hay dos superficies y no tres. Antes las claras alternaban entre papel
 * blanco y bruma, y esa alternancia era un tercer cambio de fondo que no
 * significaba nada: el visitante veía la página pasar de lila a blanco y
 * buscaba el motivo, que no existía. El encendido y apagado tiene que ser la
 * única cosa que mueva el fondo, porque es la única que quiere decir algo.
 * Lo blanco sigue estando donde corresponde —las tarjetas, la píldora del
 * menú, los botones sobre oscuro—, que es justamente lo que se destaca ahora
 * que el fondo dejó de ser blanco también.
 */

export type Surface = "mist" | "deep";

/*
   El aire de arriba y de abajo de cada sección. Va acá y no en el className
   de cada una porque cn() es una unión plana: un py-16 que llegaba de afuera
   competía con el py-20 de acá y ganaba el que el CSS pusiera último, no el
   que se pasaba. Con un ritmo con nombre no hay dos valores peleando.

   Es mucho aire a propósito: el contenido se lee más chico y más cuidado
   cuando tiene espacio alrededor. Compacto es para las secciones que son una
   lista larga (planes, preguntas), donde tanto aire separaría las partes de
   una misma cosa; amplio, para el proceso, que es un recorrido.
*/
const RITMOS = {
  normal: "py-24 md:py-36 xl:py-44",
  compacto: "py-20 md:py-28 xl:py-32",
  amplio: "py-24 md:py-40 xl:py-48",
} as const;

export function Section({
  id,
  children,
  className,
  surface = "mist",
  ritmo = "normal",
  overlay,
  wide = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  surface?: Surface;
  ritmo?: keyof typeof RITMOS;
  /** Capa decorativa a sangre, detrás del contenido y fuera del ancho de
      lectura. Va acá y no dentro de los hijos porque el contenido vive en
      .shell, que tiene ancho máximo: un degradé ahí adentro se corta. */
  overlay?: ReactNode;
  /** Usa el contenedor ancho, para secciones que no son un renglón de lectura. */
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      data-surface={surface}
      className={cn("relative", RITMOS[ritmo], className)}
    >
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
  icon,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  icon?: TagIconName;
}) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow ? (
        <Reveal>
          <div className={cn(align === "center" && "flex justify-center")}>
            <Tag icon={icon}>{eyebrow}</Tag>
          </div>
        </Reveal>
      ) : null}

      <SplitHeading text={title} className="mt-5 text-h2" />

      {lead ? (
        <Reveal delay={0.15}>
          <p className="mt-5 text-lead text-ink-soft">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
