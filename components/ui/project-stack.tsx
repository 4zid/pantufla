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
 * Cada uno es su imagen, grande, y debajo el nombre del cliente. Nada más: la
 * bajada, el rubro, el plan y la lista de servicios estuvieron y se fueron,
 * porque en un portfolio lo que convence no es leer que un sitio es «limpio y
 * actual», es abrirlo. Todo eso competía con el nombre y empujaba el enlace
 * hacia abajo.
 *
 * La imagen va primero y el nombre después, como el epígrafe de una foto. Con
 * el nombre arriba, lo primero que aparecía al scrollear era una palabra
 * suelta y recién después el trabajo; ahora entra el trabajo y el nombre llega
 * cuando ya se está mirando, que es cuando importa saber de quién es.
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

export function ProjectStack({
  projects,
  /*
     Qué nivel de titular le toca a cada proyecto. No es decorativo: en la home
     la sección trae su propio h2 y los proyectos cuelgan de ahí, pero en
     /proyectos lo único que hay arriba es el h1 de la página, así que un h3
     saltea un nivel y deja el índice del documento con un agujero.
  */
  heading: Titulo = "h3",
}: {
  projects: SanityProject[];
  heading?: "h2" | "h3";
}) {
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
            <div className="overflow-hidden rounded-panel border border-line bg-card p-2">
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

            <div className="mt-5 flex items-start justify-between gap-6">
              <Titulo className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] md:text-[1.6rem]">
                <Link
                  href={destino}
                  target={externo ? "_blank" : undefined}
                  rel={externo ? "noreferrer" : undefined}
                  /* Estirado sobre toda la tarjeta: se puede tocar en
                     cualquier parte —imagen incluida— y sigue habiendo un solo
                     enlace.

                     El z-10 queda aunque ahora el enlace esté después de la
                     imagen en el árbol y ya ganaría por orden. Es barato y es
                     lo único que sostiene el área clicable si alguien vuelve a
                     mover estos dos bloques de lugar. */
                  className="after:absolute after:inset-0 after:z-10 after:content-['']"
                >
                  {project.title}
                </Link>
              </Titulo>

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
          </article>
        );
      })}
    </Reveal>
  );
}
