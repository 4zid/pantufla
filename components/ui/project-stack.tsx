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

/**
 * Los proyectos, de a cuatro por fila.
 *
 * Cada uno es una esfera y debajo el nombre del cliente. Nada más: la bajada,
 * el rubro, el plan y la lista de servicios estuvieron y se fueron, porque en
 * un portfolio lo que convence no es leer que un sitio es «limpio y actual»,
 * es abrirlo. Todo eso competía con el nombre y empujaba el enlace hacia
 * abajo.
 *
 * Dos por fila y nada más: ni título al lado ni botón. El nombre va adentro
 * de la esfera, en la mitad oscura, y al pasar el mouse se cambia por «ver
 * sitio» con la flecha. Cuatro esferas solas se leen como cuatro objetos;
 * con un epígrafe cada una se leían como cuatro fichas.
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
        className="grid grid-cols-2 gap-x-5 gap-y-6 lg:gap-x-8 lg:gap-y-8"
      >
        {projects.map((project, i) => {
          // Sin URL cargada, la tarjeta cae en la ficha interna en vez de
          // quedar muerta. Es el único caso en que el enlace no sale del sitio.
          const externo = Boolean(project.url);
          const destino = project.url ?? href(`/proyectos/${project.slug}`);

          return (
            <article key={project._id} className="group/card relative mx-auto w-full max-w-[17rem]">
              {/*
                La esfera suelta y sola: sin tarjeta, sin epígrafe al lado.

                El nombre va ADENTRO, en la mitad oscura, donde el blanco se
                lee sin esfuerzo. Al pasar el mouse —o al llegar con el
                teclado— el nombre se retira y en su lugar aparece «ver sitio»
                con la flecha: es lo que dice que la esfera se puede tocar, sin
                un botón al costado estorbando.

                El giro va en el envoltorio de la esfera y el nombre en una
                capa aparte, así el nombre se queda derecho mientras la
                esfera se inclina con el scroll. Y el zoom del hover va en la
                esfera: GSAP escribe el transform en línea, y en el mismo
                elemento que el giro pisaría la clase.
              */}
              <div data-esfera className="will-change-transform">
                <Sphere
                  tone={tonos[i % tonos.length]}
                  className="w-full transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
                />
              </div>

              {/*
                El enlace ES el círculo: una capa absoluta redonda sobre la
                esfera, con el nombre adentro. Así el área clicable es
                exactamente la esfera —ni una esquina más— y no hay nada que
                se salga de la pantalla en teléfono. La primera versión
                estiraba un pseudo-elemento con inset negativo y desbordaba
                96 píxeles por la derecha a 390.
              */}
              <Titulo className="absolute inset-0 text-[1.15rem] font-semibold leading-tight tracking-[-0.025em] text-white md:text-[1.3rem]">
                <Link
                  href={destino}
                  target={externo ? "_blank" : undefined}
                  rel={externo ? "noreferrer" : undefined}
                  className="relative flex h-full w-full items-center justify-center rounded-full px-8 pt-[32%] text-center outline-none"
                >
                  <span
                    data-nombre
                    className="block transition-all duration-300 ease-out group-hover/card:-translate-y-1 group-hover/card:opacity-0 group-focus-within/card:-translate-y-1 group-focus-within/card:opacity-0"
                  >
                    {project.title}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 flex translate-y-1 items-center justify-center gap-1.5 pt-[32%] opacity-0 transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100"
                  >
                    {work.view}
                    <ArrowUpRightIcon className="h-[0.9em] w-[0.9em]" />
                  </span>
                </Link>
              </Titulo>
            </article>
          );
        })}
      </Reveal>
    </div>
  );
}
