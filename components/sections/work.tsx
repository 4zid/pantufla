"use client";

import { useCopy } from "@/components/copy-provider";
import { ProjectStack } from "@/components/ui/project-stack";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos, en la home y sin página aparte.
 *
 * Dos columnas en escritorio. A la izquierda el título y la bajada, pegados
 * mientras dura la sección; a la derecha los proyectos, uno debajo de otro,
 * que suben y se van reemplazando en el puesto de arriba (ver project-stack).
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
    <Section id="proyectos" surface={surface}>
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            icon="grilla"
            eyebrow={work.eyebrow}
            title={work.title}
            lead={work.lead}
          />
        </div>
        <ProjectStack projects={projects} />
      </div>
    </Section>
  );
}
