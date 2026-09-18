"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { arteDeProyecto } from "@/content/fallback-content";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";
import { useCopy, useHref } from "@/components/copy-provider";
import { cn } from "@/lib/cn";

/**
 * Los proyectos, de a dos por fila.
 *
 * Cada uno es el nombre del cliente y su imagen, grande. Nada más: la bajada,
 * el rubro, el plan y la lista de servicios estuvieron y se fueron, porque en
 * un portfolio lo que convence no es leer que un sitio es «limpio y actual»,
 * es abrirlo. Todo eso competía con el nombre y empujaba el enlace hacia
 * abajo.
 *
 * La imagen va limpia, sin desenfoque ni velo encima. Tuvo los dos cuando el
 * nombre iba adentro de la tarjeta: ahí hacían falta para que el blanco se
 * leyera sobre cualquier fondo. Con el nombre afuera no hay nada que rescatar,
 * así que la imagen se ve como la hizo quien la hizo.
 *
 * Toda la tarjeta lleva al sitio publicado —no a una ficha interna que cuenta
 * el sitio en vez de mostrarlo— y el área clicable la da el enlace del título
 * estirado sobre la tarjeta entera. Es un solo enlace: con uno en el título,
 * otro en la imagen y otro en el botón, el foco pasaba tres veces por el mismo
 * destino antes de llegar al proyecto siguiente.
 *
 * Las fichas de /proyectos/[slug] siguen existiendo y siguen usando la bajada
 * y el resto de los campos. Lo que cambió es por dónde se entra.
 */

/** Para un proyecto sin imagen: un degradé de la paleta en vez de un hueco. */
const rellenos = [
  "linear-gradient(150deg, #ddf2f0 0%, #6fcfca 100%)",
  "linear-gradient(150deg, #fbe4e9 0%, #f2a5b6 100%)",
  "linear-gradient(150deg, #e6f2df 0%, #a6cf95 100%)",
  "linear-gradient(150deg, #fdeed4 0%, #f4c87d 100%)",
];

export function ProjectStack({ projects }: { projects: SanityProject[] }) {
  const { work } = useCopy();
  const href = useHref();

  return (
    <Reveal stagger className="grid gap-x-8 gap-y-12 lg:grid-cols-2">
      {projects.map((project, i) => {
        // Sin URL cargada, la tarjeta cae en la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);
        // Sanity primero: si el proyecto tiene imagen cargada, manda esa. Si
        // no, la que está en /public para ese slug.
        const imagen =
          urlForImage(project.cover)?.width(1200).height(900).url() ??
          project.art ??
          arteDeProyecto[project.slug];

        return (
          <article key={project._id} className="group/card relative">
            <div className="flex items-start justify-between gap-6">
              <h3 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] md:text-[1.6rem]">
                <Link
                  href={destino}
                  target={externo ? "_blank" : undefined}
                  rel={externo ? "noreferrer" : undefined}
                  /* Estirado sobre toda la tarjeta: se puede tocar en
                     cualquier parte y sigue habiendo un solo enlace.

                     Con z-10 y no a secas: la caja de la imagen lleva position
                     relative para recortar, y entre dos elementos posicionados
                     sin z-index gana el que está después en el árbol. O sea
                     que la imagen quedaba encima del área clicable y la
                     tarjeta solo respondía en el título. */
                  className="after:absolute after:inset-0 after:z-10 after:content-['']"
                >
                  {project.title}
                </Link>
              </h3>

              <span
                aria-hidden
                className="flex shrink-0 items-center gap-3 pt-1 text-[0.95rem] font-medium text-ink-soft transition-colors duration-200 group-hover/card:text-ink"
              >
                {work.view}
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-colors duration-200 group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-paper">
                  <ArrowUpRightIcon className="h-4 w-4" />
                </span>
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-panel border border-line bg-card p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                {imagen ? (
                  <Image
                    src={imagen}
                    alt={project.cover?.alt || project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: rellenos[i % rellenos.length] }}
                  />
                )}
              </div>
            </div>
          </article>
        );
      })}
    </Reveal>
  );
}
