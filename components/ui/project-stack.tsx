"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";

/**
 * Los proyectos: una columna de esferas que suben y se van reemplazando.
 *
 * En escritorio cada proyecto es un tramo de scroll. Su esfera, con el nombre
 * y la descripción abajo, queda pegada a la altura del título de la sección
 * —que a su vez está pegado a la izquierda— mientras su tramo pasa; cuando el
 * tramo termina, se va por arriba y la siguiente, que venía subiendo desde
 * abajo, ocupa el mismo lugar. Nada rota ni se anima con GSAP: el movimiento
 * es el scroll mismo, con position: sticky, y se frena donde el visitante
 * frena.
 *
 * La que está en el puesto es la resaltada. Las que esperan abajo se ven
 * apagadas y un poco más chicas, y la que ya pasó se apaga al irse: así se lee
 * cuál es la que se está mirando sin marcarla con nada. Quién está en el
 * puesto lo decide un cálculo de dos líneas en cada cuadro de scroll: la
 * última cuyo borde de arriba llegó al tope.
 *
 * En teléfono no hay tramos ni puestos: es una lista, una debajo de otra,
 * todas prendidas.
 *
 * El nombre y la descripción van abajo y afuera de la esfera. Adentro solo
 * aparece «ver sitio» con la flecha, al pasar el mouse: la esfera es el
 * enlace, y eso es lo que lo dice.
 */

/** El tono de cada esfera, por posición: dos vecinas nunca del mismo color. */
const tonos: Tone[] = ["aqua", "rosa", "verde", "miel"];

/**
 * A qué altura de la ventana se pega cada tarjeta, en píxeles. Es top-28, y
 * tiene que ser el mismo número que lleva la columna del título: las dos se
 * pegan a la misma línea.
 */
const TOPE = 112;

/** Desde qué ancho hay tramos y puestos; abajo es lista. */
const ESCRITORIO = "(min-width: 1024px)";

export function ProjectStack({
  projects,
  /*
     Qué nivel de titular le toca a cada proyecto. En la home la sección trae
     su propio h2 y los proyectos cuelgan de ahí.
  */
  heading: Titulo = "h3",
}: {
  projects: SanityProject[];
  heading?: "h2" | "h3";
}) {
  const { work } = useCopy();
  const href = useHref();
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = lista.current;
    if (!root) return;
    const escritorio = window.matchMedia(ESCRITORIO);
    let pedido = 0;

    function decidir() {
      pedido = 0;
      const tramos = root!.querySelectorAll<HTMLElement>("[data-tramo]");
      if (!escritorio.matches) {
        tramos.forEach((el) => (el.dataset.estado = "activa"));
        return;
      }
      // La activa es la última que llegó al tope. La que se está yendo por
      // arriba también pasó el tope, pero la siguiente llega justo cuando el
      // tramo de la anterior termina, así que la última siempre es la nueva.
      let activa = 0;
      tramos.forEach((el, i) => {
        const tarjeta = el.firstElementChild as HTMLElement;
        if (tarjeta.getBoundingClientRect().top <= TOPE + 1) activa = i;
      });
      tramos.forEach((el, i) => {
        el.dataset.estado =
          i === activa ? "activa" : i < activa ? "pasada" : "espera";
      });
    }

    function pedir() {
      if (!pedido) pedido = requestAnimationFrame(decidir);
    }

    decidir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    escritorio.addEventListener("change", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      escritorio.removeEventListener("change", pedir);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [projects.length]);

  return (
    <ul ref={lista} className="flex flex-col gap-14 lg:block">
      {projects.map((project, i) => {
        // Sin URL cargada, la esfera lleva a la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);

        return (
          /*
            El tramo: en escritorio mide 80% de la pantalla de alto, y la
            tarjeta se pega arriba mientras dura. El relleno de abajo es el
            aire entre la que se va y la que sube: sin él viajaban pegadas y
            el texto de una rozaba la esfera de la otra. El último no tiene
            tramo: llega a su puesto y se queda, porque después de él no
            viene nadie a reemplazarlo.
          */
          <li
            key={project._id}
            data-tramo
            className="group/tramo lg:h-[max(80vh,36rem)] lg:pb-20 lg:last:h-auto lg:last:pb-0"
          >
            <article className="flex flex-col items-start gap-6 transition-[opacity,transform] duration-500 ease-out lg:sticky lg:top-28 lg:origin-top-left group-data-[estado=espera]/tramo:lg:scale-[0.94] group-data-[estado=espera]/tramo:lg:opacity-35 group-data-[estado=pasada]/tramo:lg:opacity-0">
              <Link
                href={destino}
                target={externo ? "_blank" : undefined}
                rel={externo ? "noreferrer" : undefined}
                className="group/esfera relative block w-[min(100%,18rem)] rounded-full outline-none lg:w-[20rem]"
              >
                <span className="sr-only">
                  {work.view}: {project.title}
                </span>
                <Sphere
                  tone={tonos[i % tonos.length]}
                  className="w-full transition-transform duration-700 ease-out group-hover/esfera:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex translate-y-1 items-center justify-center gap-1.5 pt-[32%] text-[1.15rem] font-semibold tracking-[-0.025em] text-white opacity-0 transition-all duration-300 ease-out group-hover/esfera:translate-y-0 group-hover/esfera:opacity-100 group-focus-visible/esfera:translate-y-0 group-focus-visible/esfera:opacity-100"
                >
                  {work.view}
                  <ArrowUpRightIcon className="h-[0.9em] w-[0.9em]" />
                </span>
              </Link>

              <div className="max-w-md">
                <Titulo className="text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">
                  {project.title}
                </Titulo>
                {project.tagline ? (
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink-soft">
                    {project.tagline}
                  </p>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
