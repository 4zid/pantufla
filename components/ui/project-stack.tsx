"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Los proyectos: una fila de esferas que se desliza.
 *
 * Entran cuatro en escritorio y dos en teléfono; el resto queda fuera de la
 * pantalla, a un arrastre de distancia. Es scroll nativo con snap, no un
 * carrusel armado a mano: anda con el dedo, con el trackpad, con la rueda
 * inclinada y con el teclado —tabular hasta una esfera escondida la trae a la
 * vista sola—, y no hay ningún estado que se pueda desincronizar. Las dos
 * flechas de arriba existen para quien usa mouse y no descubre que la fila se
 * corre: hacen un scrollBy y nada más.
 *
 * Cada esfera es una sola pieza: sin tarjeta, sin epígrafe al lado. El nombre
 * va adentro, en la mitad oscura, y al pasar el mouse se cambia por «ver
 * sitio» con la flecha. Cuatro esferas solas se leen como cuatro objetos; con
 * un epígrafe cada una se leían como cuatro fichas.
 *
 * Las capturas de los sitios ya no están acá. Un portfolio de capturas es un
 * portfolio de rectángulos con texto chiquito adentro: no se lee ninguno,
 * todos se parecen y el que peor está arrastra a los demás. La esfera no
 * intenta mostrar el trabajo, lo señala, y el trabajo está a un clic. La
 * imagen de cada proyecto sigue cargada y sigue saliendo en su ficha.
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

/** El hueco entre esferas en escritorio, en píxeles: tiene que coincidir con el gap de abajo. */
const PASO_GAP = 24;

/** A partir de cuántas aparecen las flechas: las que no entran en escritorio. */
const ENTRAN = 4;

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
  const fila = useRef<HTMLDivElement>(null);

  /** Corre la fila una esfera, para el lado que se pida. */
  const correr = (sentido: 1 | -1) => {
    const el = fila.current;
    if (!el) return;
    const primera = el.querySelector<HTMLElement>("[data-item]");
    const paso = primera
      ? primera.getBoundingClientRect().width + PASO_GAP
      : el.clientWidth / 4;
    el.scrollBy({ left: sentido * paso, behavior: "smooth" });
  };

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
          gsap.utils
            .selector(root)("[data-esfera]")
            .forEach((el, i) => {
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
      {projects.length > ENTRAN ? (
        <div className="mb-5 hidden justify-end gap-2 lg:flex">
          {([-1, 1] as const).map((sentido) => (
            <button
              key={sentido}
              type="button"
              onClick={() => correr(sentido)}
              aria-label={sentido < 0 ? work.prev : work.next}
              className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <ArrowIcon
                className={cn("h-4 w-4", sentido < 0 && "rotate-180")}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/*
        La fila. Scroll horizontal con snap y sin barra a la vista. El padding
        con margen negativo, en los cuatro lados, es para el zoom del hover:
        overflow-x auto recorta en los dos ejes, y sin ese aire la esfera
        agrandada se cortaba arriba y abajo, y la primera también por la
        izquierda. El scroll-padding hace que el snap alinee contra el borde
        de adentro del padding y no contra el de afuera.
      */}
      <div
        ref={fila}
        className="-mx-4 -my-4 snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-4 py-4 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Reveal stagger className="flex min-w-full gap-5 lg:gap-6">
          {projects.map((project, i) => {
            // Sin URL cargada, la tarjeta cae en la ficha interna en vez de
            // quedar muerta. Es el único caso en que el enlace no sale del sitio.
            const externo = Boolean(project.url);
            const destino = project.url ?? href(`/proyectos/${project.slug}`);

            return (
              <article
                key={project._id}
                data-item
                className="group/card relative w-[calc((100%-1.25rem)/2)] shrink-0 snap-start lg:w-[calc((100%-4.5rem)/4)]"
              >
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
    </div>
  );
}
