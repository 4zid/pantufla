"use client";

import { useCopy } from "@/components/copy-provider";
import { ProjectStack } from "@/components/ui/project-stack";
import { SectionHead, type Surface } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos, en la home y sin página aparte.
 *
 * En escritorio el título queda quieto a media altura mientras la columna de
 * esferas pasa con el scroll normal de la página; el proyecto que cruza esa
 * misma altura se prende (ver project-stack). Nada retiene la rueda: la
 * sección mide lo que mide su contenido y se baja como cualquier otra.
 *
 * El aire de arriba y de abajo de la columna es media pantalla menos media
 * fila. Con eso el primer proyecto llega al medio justo cuando el título se
 * queda quieto, y el último cuando el título se suelta: los dos siempre a la
 * par.
 *
 * En teléfono es una columna: el título y después la lista.
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
    */
    <section
      id="proyectos"
      data-surface={surface}
      className="relative py-20 md:py-28 lg:py-0"
    >
      <div className="shell grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <SectionHead
            icon="grilla"
            eyebrow={work.eyebrow}
            title={work.title}
            lead={work.lead}
          />
        </div>
        {/* 6rem es media fila: la esfera mide 12rem en escritorio. */}
        <div className="lg:py-[calc(50vh-6rem)]">
          <ProjectStack projects={projects} />
        </div>
      </div>
    </section>
  );
}
