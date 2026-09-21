"use client";

import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";
import { cn } from "@/lib/cn";

/**
 * Los proyectos, de a dos por fila.
 *
 * Cada uno es una esfera, grande, y debajo el nombre del cliente. Nada más: la
 * bajada, el rubro, el plan y la lista de servicios estuvieron y se fueron,
 * porque en un portfolio lo que convence no es leer que un sitio es «limpio y
 * actual», es abrirlo. Todo eso competía con el nombre y empujaba el enlace
 * hacia abajo.
 *
 * La pieza va primero y el nombre después, como el epígrafe de una foto. Con el
 * nombre arriba, lo primero que aparecía al scrollear era una palabra suelta y
 * recién después el trabajo; ahora entra la pieza y el nombre llega cuando ya
 * se está mirando, que es cuando importa saber de quién es.
 *
 * Las capturas de los sitios ya no están acá. Un portfolio de capturas es un
 * portfolio de rectángulos con texto chiquito adentro: no se lee ninguno, todos
 * se parecen y el que menos calidad tiene arrastra a los demás. La esfera no
 * intenta mostrar el trabajo, lo señala, y el trabajo está a un clic. La imagen
 * de cada proyecto sigue cargada y sigue saliendo en su ficha, que es donde hay
 * espacio para verla en serio.
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

/**
 * El tono de cada esfera, por posición en la grilla.
 *
 * Por posición y no por proyecto: lo que tiene que pasar es que dos esferas
 * vecinas nunca sean del mismo color, y eso lo decide el lugar en la fila, no
 * qué proyecto le tocó. Atado al slug, el día que se reordenan los proyectos en
 * el panel pueden quedar dos verdes juntas sin que nadie haya tocado nada.
 */
const tonos: Tone[] = ["aqua", "rosa", "verde", "miel"];

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
        return (
          <article key={project._id} className="group/card relative">
            {/*
              La esfera suelta: sin tarjeta, sin plato, sin borde.

              No hay nada que la contenga a propósito. Una esfera adentro de un
              rectángulo con borde es una ilustración pegada en una ficha; sola
              sobre la página es un objeto, y la página se vuelve el aire que la
              rodea. Es también lo que hace que las cuatro se lean como una
              familia y no como cuatro tarjetas que casualmente traen un dibujo.

              Y no hay captura del sitio. Un portfolio de capturas es un
              portfolio de rectángulos con texto chiquito adentro: no se lee
              ninguno, todos se parecen y el que peor está arrastra a los demás.
              La esfera no intenta mostrar el trabajo, lo señala, y el trabajo
              está a un clic.
            */}
            <Sphere
              tone={tonos[i % tonos.length]}
              className="w-full max-w-[34rem] transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
            />

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
