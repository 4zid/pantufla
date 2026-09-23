"use client";

import type { CSSProperties } from "react";

import { useCopy } from "@/components/copy-provider";
import { ProjectStack } from "@/components/ui/project-stack";
import { SectionHead, type Surface } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos, en la home y sin página aparte.
 *
 * En escritorio la sección se clava en la pantalla y se recorre de a un
 * proyecto por gesto: a la izquierda el título, a media altura; a la derecha
 * la columna de esferas, que se corre para poner a esa misma altura el
 * proyecto que toca (ver project-stack, que es quien la mueve). No usa
 * <Section> porque necesita un alto propio —un alto de pantalla más el
 * recorrido— y un panel sticky adentro; el fondo lo declara igual, con
 * data-surface, y el motor del tema hace lo suyo.
 *
 * En teléfono es una columna: el título y después la lista, con scroll
 * normal.
 *
 * Las fichas de cada proyecto siguen existiendo: lo que se fue es el índice,
 * no el detalle.
 */
export function Work({
  projects,
  surface = "deep",
}: {
  projects: SanityProject[];
  surface?: Surface;
}) {
  const { work } = useCopy();

  if (!projects.length) return null;

  return (
    /*
       Oscura, por las esferas.

       El degradé de la esfera está calculado para que el casquete se lea como
       luz, y eso sobre una página clara no pasa: medido, el casquete da 1,17
       contra el fondo. Sobre oscuro la misma esfera se lee entera sin
       agregarle nada encima: el fondo es la página, que ya sabe apagarse sola
       cuando esta sección entra en pantalla.

       --pasos son los proyectos después del primero: cada uno agrega medio
       alto de pantalla de recorrido (globals.css, «Los proyectos se clavan»).
       data-clavada también le dice al scroll suave que esta sección se ancla
       al borde de arriba, sin el margen de la barra.
    */
    <section
      id="proyectos"
      data-surface={surface}
      data-clavada
      className="proyectos relative py-20 md:py-28 lg:py-0"
      style={{ "--pasos": projects.length - 1 } as CSSProperties}
    >
      <div
        data-panel
        className="lg:sticky lg:top-0 lg:h-screen lg:overflow-clip"
      >
        <div className="shell grid gap-14 lg:h-full lg:grid-cols-2 lg:gap-16">
          {/* A media altura, que es la línea donde se resalta cada proyecto. */}
          <div className="lg:flex lg:items-center">
            <SectionHead
              icon="grilla"
              eyebrow={work.eyebrow}
              title={work.title}
              lead={work.lead}
            />
          </div>
          <div className="relative lg:h-full">
            <ProjectStack projects={projects} />
          </div>
        </div>
      </div>
    </section>
  );
}
