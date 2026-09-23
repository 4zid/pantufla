"use client";

import { useCopy } from "@/components/copy-provider";
import { ProjectStack } from "@/components/ui/project-stack";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos, en la home y sin página aparte.
 *
 * Todos en una fila que se desliza: entran cuatro, y los que siguen quedan
 * fuera de la pantalla, a un arrastre o un botón de distancia. Antes había un
 * botón de «cargar más» que sumaba de a dos filas; con las esferas en fila la
 * pregunta cambió: no es cuántas mostrar sino cuántas caben, y las que no
 * caben se corren, no se cargan.
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
      <SectionHead
        icon="grilla"
        eyebrow={work.eyebrow}
        title={work.title}
        lead={work.lead}
      />

      <div className="mt-12">
        <ProjectStack projects={projects} />
      </div>
    </Section>
  );
}
