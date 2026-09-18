"use client";

import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { SanityProject } from "@/sanity/types";
import { useCopy, useHref } from "@/components/copy-provider";
import { cn } from "@/lib/cn";

/**
 * Los proyectos: el nombre del cliente y nada más.
 *
 * Antes cada tarjeta traía captura, bajada, rubro, plan y una lista de
 * servicios. Eran seis datos por proyecto y ninguno era el que importa: en un
 * portfolio lo que convence no es leer que un sitio es «limpio y actual», es
 * abrirlo. Todo eso competía con el nombre y empujaba el enlace hacia abajo.
 *
 * Así que la tarjeta quedó en el nombre, centrado, con aire alrededor, y el
 * enlace lleva al sitio publicado —no a una ficha interna que cuenta el sitio
 * en vez de mostrarlo—. El vacío es parte del asunto: una grilla de nombres
 * con espacio se lee como un índice de clientes, que es lo que es.
 *
 * Toda la tarjeta es el enlace y el «ver sitio» es un span con forma de
 * botón: un botón de verdad adentro de un ancla es HTML inválido, y dos áreas
 * clicables anidadas hacen que el foco pase dos veces por el mismo destino.
 *
 * Las fichas de /proyectos/[slug] siguen existiendo y siguen usando la bajada
 * y el resto de los campos. Lo que cambió es por dónde se entra.
 */

export function ProjectStack({ projects }: { projects: SanityProject[] }) {
  const { work } = useCopy();
  const href = useHref();

  return (
    <Reveal stagger className="flex flex-wrap justify-center gap-4">
      {projects.map((project) => {
        // Sin URL cargada, la tarjeta cae en la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);

        return (
          <Link
            key={project._id}
            href={destino}
            target={externo ? "_blank" : undefined}
            rel={externo ? "noreferrer" : undefined}
            className={cn(
              // Cuatro por fila, pero con flex y no con grid: en /proyectos
              // hay cinco y con grid la última fila queda pegada a la
              // izquierda con un hueco a la derecha que se lee como un error.
              // Así el sobrante se centra solo, y donde la fila está completa
              // —la home, que muestra cuatro— se comporta igual que una
              // grilla.
              "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]",
              "group/card flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-panel border border-line bg-card px-5 py-12 text-center transition-colors duration-300 hover:border-line-strong md:min-h-[260px]",
            )}
          >
            <h3 className="text-balance text-[1.4rem] font-semibold leading-tight tracking-[-0.035em] md:text-[1.6rem]">
              {project.title}
            </h3>

            <span className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.88rem] font-medium text-ink-soft transition-colors duration-300 group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-paper">
              {work.view}
              <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem]" />
            </span>
          </Link>
        );
      })}
    </Reveal>
  );
}
