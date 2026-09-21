"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Los proyectos, de a cuatro por fila.
 *
 * Cada uno es una esfera y debajo el nombre del cliente. Nada más: la bajada,
 * el rubro, el plan y la lista de servicios estuvieron y se fueron, porque en
 * un portfolio lo que convence no es leer que un sitio es «limpio y actual»,
 * es abrirlo. Todo eso competía con el nombre y empujaba el enlace hacia
 * abajo.
 *
 * Dos por fila, y en escritorio la esfera a la izquierda con el nombre al
 * lado, no debajo: así cada fila mide lo que mide la esfera y las dos filas
 * entran en una pantalla. Con el nombre debajo, las dos filas sumaban los
 * epígrafes y la sección se pasaba de largo.
 *
 * Las capturas de los sitios ya no están acá. Un portfolio de capturas es un
 * portfolio de rectángulos con texto chiquito adentro: no se lee ninguno,
 * todos se parecen y el que peor está arrastra a los demás. La esfera no
 * intenta mostrar el trabajo, lo señala, y el trabajo está a un clic. La
 * imagen de cada proyecto sigue cargada y sigue saliendo en su ficha, que es
 * donde hay espacio para verla en serio.
 *
 * Toda la tarjeta lleva al sitio publicado —no a una ficha interna que cuenta
 * el sitio en vez de mostrarlo— y el área clicable la da el enlace del título
 * estirado sobre la tarjeta entera. Es un solo enlace: con uno en el título,
 * otro en la esfera y otro en el botón, el foco pasaba tres veces por el
 * mismo destino antes de llegar al proyecto siguiente.
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

/**
 * Cuánto gira cada esfera de punta a punta del recorrido, en grados.
 *
 * Poco. La luz viene de arriba, y girar la esfera es girar la luz: con
 * cuarenta grados se lee como una pelota rodando y el casquete termina de
 * costado. Con dieciséis se lee como que respira. Y alternan el sentido —una
 * para un lado, la de al lado para el otro— porque cuatro esferas girando
 * igual se ven como una sola animación copiada cuatro veces.
 */
const GIRO = 16;

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
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          if (reduced) return;

          /*
             Atada al scroll y no al tiempo: la esfera gira mientras cruza la
             pantalla y se queda quieta cuando el visitante se queda quieto.
             Una rotación continua es un GIF; una que responde a la mano es un
             objeto. El scrub con inercia es lo que hace que no se sienta
             pegada al dedo.
          */
          gsap.utils.selector(root)("[data-esfera]").forEach((el, i) => {
            const sentido = i % 2 === 0 ? 1 : -1;
            gsap.fromTo(
              el,
              { rotate: -GIRO * sentido },
              {
                rotate: GIRO * sentido,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <Reveal
        stagger
        className="grid grid-cols-2 gap-x-5 gap-y-8 lg:gap-x-10 lg:gap-y-10"
      >
        {projects.map((project, i) => {
          // Sin URL cargada, la tarjeta cae en la ficha interna en vez de
          // quedar muerta. Es el único caso en que el enlace no sale del sitio.
          const externo = Boolean(project.url);
          const destino = project.url ?? href(`/proyectos/${project.slug}`);

          return (
            <article
              key={project._id}
              className="group/card relative lg:flex lg:items-center lg:gap-7"
            >
              {/*
                La esfera suelta: sin tarjeta, sin plato, sin borde.

                No hay nada que la contenga a propósito. Una esfera adentro de
                un rectángulo con borde es una ilustración pegada en una ficha;
                sola sobre la página es un objeto, y la página se vuelve el
                aire que la rodea.

                El giro va en el envoltorio y el zoom del hover en la esfera:
                GSAP escribe el transform en línea, y si estuvieran en el
                mismo elemento pisaría la clase del hover y el zoom dejaría
                de andar.
              */}
              <div data-esfera className="will-change-transform lg:w-[46%] lg:shrink-0">
                <Sphere
                  tone={tonos[i % tonos.length]}
                  className="w-full transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                />
              </div>

              {/* El epígrafe: debajo en teléfono, al lado en escritorio. */}
              <div className="mt-4 lg:mt-0">
                <Titulo className="text-[1.05rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.35rem]">
                  <Link
                    href={destino}
                    target={externo ? "_blank" : undefined}
                    rel={externo ? "noreferrer" : undefined}
                    /* Estirado sobre toda la tarjeta: se puede tocar en
                       cualquier parte —esfera incluida— y sigue habiendo un
                       solo enlace. */
                    className="after:absolute after:inset-0 after:z-10 after:content-['']"
                  >
                    {project.title}
                  </Link>
                </Titulo>

                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 inline-flex items-center gap-1.5 text-[0.85rem] text-ink-soft",
                    "transition-colors duration-200 group-hover/card:text-ink",
                  )}
                >
                  {work.view}
                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
                </span>
              </div>
            </article>
          );
        })}
      </Reveal>
    </div>
  );
}
