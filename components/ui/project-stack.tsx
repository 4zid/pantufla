"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";

/**
 * Los proyectos: una columna de esferas que pasa por el medio de la pantalla.
 *
 * Es una lista que hace scroll normal, sin trucos: cada proyecto es una fila
 * con la esfera a la izquierda y el nombre y la descripción al lado. Lo que
 * cambia con el scroll es cuál está resaltada: la que está más cerca del
 * medio de la pantalla, que es donde está también el título de la sección,
 * pegado a esa altura. Las demás —las que ya pasaron, arriba, y las que
 * vienen, abajo— se ven apagadas pero se ven: nada desaparece ni cambia de
 * tamaño, solo se prende la que se está mirando.
 *
 * Nada rota ni se anima con GSAP. Quién está en el medio lo decide un
 * cálculo de una línea en cada cuadro de scroll.
 *
 * El nombre y la descripción van a la derecha de la esfera, afuera. Adentro
 * solo aparece «ver sitio» con la flecha, al pasar el mouse: la esfera es el
 * enlace, y eso es lo que lo dice.
 */

/** El tono de cada esfera, por posición: dos vecinas nunca del mismo color. */
const tonos: Tone[] = ["aqua", "rosa", "verde", "miel"];

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
    let pedido = 0;

    function decidir() {
      pedido = 0;
      const filas = root!.querySelectorAll<HTMLElement>("[data-fila]");
      const medio = window.innerHeight / 2;
      // La activa es la que tiene el centro más cerca del medio de la pantalla.
      let activa = 0;
      let mejor = Infinity;
      filas.forEach((el, i) => {
        const caja = el.getBoundingClientRect();
        const distancia = Math.abs((caja.top + caja.bottom) / 2 - medio);
        if (distancia < mejor) {
          mejor = distancia;
          activa = i;
        }
      });
      filas.forEach((el, i) => {
        el.dataset.estado = i === activa ? "activa" : "apagada";
      });
    }

    function pedir() {
      if (!pedido) pedido = requestAnimationFrame(decidir);
    }

    decidir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, [projects.length]);

  return (
    /*
      El aire de arriba y de abajo en escritorio es para que la primera y la
      última puedan llegar al medio de la pantalla, donde está el título.
    */
    <ul
      ref={lista}
      className="flex flex-col gap-14 lg:gap-20 lg:pb-[calc(50vh-12rem)] lg:pt-[calc(50vh-12rem)]"
    >
      {projects.map((project, i) => {
        // Sin URL cargada, la esfera lleva a la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);

        return (
          <li key={project._id} data-fila className="group/fila">
            <article className="flex items-center gap-6 transition-opacity duration-500 ease-out group-data-[estado=apagada]/fila:opacity-35 lg:gap-8">
              <Link
                href={destino}
                target={externo ? "_blank" : undefined}
                rel={externo ? "noreferrer" : undefined}
                className="group/esfera relative block w-[7.5rem] shrink-0 rounded-full outline-none sm:w-[10rem] lg:w-[12rem]"
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
                  className="absolute inset-0 flex translate-y-1 items-center justify-center gap-1 pt-[32%] text-[0.82rem] font-semibold tracking-[-0.02em] text-white opacity-0 transition-all duration-300 ease-out group-hover/esfera:translate-y-0 group-hover/esfera:opacity-100 group-focus-visible/esfera:translate-y-0 group-focus-visible/esfera:opacity-100 sm:text-[0.95rem]"
                >
                  {work.view}
                  <ArrowUpRightIcon className="h-[0.9em] w-[0.9em]" />
                </span>
              </Link>

              <div className="min-w-0 max-w-md">
                <Titulo className="text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.5rem]">
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
