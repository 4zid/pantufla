"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";
import { useCopy, useHref } from "@/components/copy-provider";
import { cn } from "@/lib/cn";

/**
 * Los proyectos: el nombre del cliente sobre el fondo del proyecto.
 *
 * Antes cada tarjeta traía captura, bajada, rubro, plan y una lista de
 * servicios. Eran seis datos por proyecto y ninguno era el que importa: en un
 * portfolio lo que convence no es leer que un sitio es «limpio y actual», es
 * abrirlo. Todo eso competía con el nombre y empujaba el enlace hacia abajo.
 *
 * Así que la tarjeta quedó en el nombre y el enlace lleva al sitio publicado,
 * no a una ficha interna que cuenta el sitio en vez de mostrarlo. Lo que pone
 * el fondo es una pieza abstracta por proyecto: le da identidad a cada tarjeta
 * sin prometer nada, que es lo que sí hace una captura —una captura promete
 * que el sitio se ve así hoy, y los sitios cambian—.
 *
 * El nombre va en blanco, y para que se lea sobre cualquier fondo hay dos
 * capas. Primero un desenfoque sobre la imagen: las manchas grandes siguen
 * leyéndose, pero desaparece el detalle fino, que es lo que le come el borde a
 * una letra. Encima, un velo de tinta parejo.
 *
 * El velo está en 58% por el peor caso y no por estas imágenes. Sobre las que
 * hay ahora, que son oscuras, el blanco no baja de 9.4:1 en ningún pixel; pero
 * el fondo lo pone quien sube el archivo, y sobre un blanco puro —el peor
 * fondo posible— ese mismo velo deja 4.75:1, que sigue pasando AA. Así el
 * contraste no depende de qué imagen entre. Al pasar el cursor el velo afloja
 * y el desenfoque cede: el fondo se despeja justo en la tarjeta que se mira,
 * y ahí el peor caso queda en 3.6:1, que es el mínimo para texto grande.
 *
 * Toda la tarjeta es el enlace y el «ver sitio» es un span con forma de botón:
 * un botón de verdad adentro de un ancla es HTML inválido, y dos áreas
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
        // Sanity primero: si el proyecto tiene imagen cargada, manda esa.
        const fondo =
          urlForImage(project.cover)?.width(900).height(760).url() ??
          project.art;

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
              "group/card relative isolate flex min-h-[240px] flex-col items-center justify-center gap-5 overflow-hidden rounded-panel px-5 py-12 text-center md:min-h-[280px]",
              // Sin fondo cargado la tarjeta vuelve a ser la de papel, para
              // que un proyecto sin imagen no quede como un agujero negro.
              fondo ? "text-white" : "border border-line bg-card",
            )}
          >
            {fondo ? (
              <>
                {/* El fondo, apenas más grande que la tarjeta: el desenfoque
                    aclara los bordes de la imagen y se vería el recorte. */}
                <Image
                  src={fondo}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="-z-10 scale-110 object-cover blur-[10px] transition-[filter,transform] duration-500 group-hover/card:scale-[1.16] group-hover/card:blur-[6px]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[#0e0e0e]/58 transition-colors duration-500 group-hover/card:bg-[#0e0e0e]/50"
                />
              </>
            ) : null}

            <h3 className="text-balance text-[1.4rem] font-semibold leading-tight tracking-[-0.035em] md:text-[1.6rem]">
              {project.title}
            </h3>

            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.88rem] font-medium transition-colors duration-300",
                fondo
                  ? "border-white/45 text-white group-hover/card:border-white group-hover/card:bg-white group-hover/card:text-[#0e0e0e]"
                  : "border-line-strong text-ink-soft group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-paper",
              )}
            >
              {work.view}
              <ArrowUpRightIcon className="h-[0.85rem] w-[0.85rem]" />
            </span>
          </Link>
        );
      })}
    </Reveal>
  );
}
