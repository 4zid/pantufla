"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";

/**
 * Los proyectos, en una columna que se recorre con el scroll de siempre.
 *
 * Fue un paso a paso clavado —cada gesto de la rueda movía un proyecto— y
 * se sacó: retener la rueda en una sección de la home se siente como que la
 * página se traba, y para mirar seis proyectos no hace falta. Ahora la página
 * baja libre y lo único que queda de aquello es el foco: se prende la fila
 * que pasa por el medio de la pantalla y las demás quedan apagadas pero a la
 * vista. En escritorio el título de la sección queda quieto a media altura
 * (ver work.tsx), que es la línea donde se prende cada proyecto.
 *
 * Apagada quiere decir la esfera, no el texto. La fila entera iba al 35% y
 * el nombre y la bajada quedaban en dos a uno de contraste: en el teléfono,
 * donde la fila del medio cambia a cada rato, la lista se leía como
 * deshabilitada. Ahora la esfera baja al 35% —es lo grande, y es la que
 * marca el foco— y el texto al 75%, que en el tema oscuro sigue pasando el
 * 4,5 a uno de AA con la bajada.
 *
 * El nombre y la descripción van a la derecha de la esfera, afuera. Adentro
 * solo aparece «ver sitio» con la flecha, al pasar el mouse: la esfera es el
 * enlace, y eso es lo que lo dice. En una pantalla táctil no hay mouse que
 * pase, así que ahí lo lleva siempre la fila prendida: sin eso, nada decía
 * que la esfera se podía tocar.
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
    const ul = lista.current;
    if (!ul) return;
    const filas = Array.from(ul.querySelectorAll<HTMLElement>("[data-fila]"));
    if (!filas.length) return;

    /* La fila más cerca del medio de la pantalla es la que se prende. Se
       mide en un cuadro de animación y solo cuando la página se movió: son
       seis cajas, y leerlas después del scroll no fuerza ningún reflow. */
    let marcada = -1;
    let cuadro = 0;
    function pintar() {
      cuadro = 0;
      const medio = window.innerHeight / 2;
      let activa = -1;
      let mejor = Infinity;
      filas.forEach((el, i) => {
        const caja = el.getBoundingClientRect();
        const distancia = Math.abs((caja.top + caja.bottom) / 2 - medio);
        if (distancia < mejor) {
          mejor = distancia;
          activa = i;
        }
      });
      /* Si ni la fila más cercana llega a la pantalla, la lista está lejos y
         no se apaga nada: el foco existe para cuando se la está mirando. Así
         la lista queda entera también para quien la lee de otra forma que
         bajando —un lector de pantalla, un buscador, una auditoría—. */
      if (mejor > medio) activa = -1;
      if (activa === marcada) return;
      marcada = activa;
      filas.forEach((el, j) => {
        if (activa < 0) delete el.dataset.estado;
        else el.dataset.estado = j === activa ? "activa" : "apagada";
      });
    }
    function pedir() {
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    }

    pintar();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [projects.length]);

  return (
    <ul ref={lista} className="flex flex-col gap-14 lg:gap-20">
      {projects.map((project, i) => {
        // Sin URL cargada, la esfera lleva a la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);

        return (
          <li key={project._id} data-fila className="group/fila">
            <article className="flex items-center gap-6 lg:gap-8">
              <Link
                href={destino}
                target={externo ? "_blank" : undefined}
                rel={externo ? "noreferrer" : undefined}
                className="group/esfera relative block w-[7.5rem] shrink-0 rounded-full transition-opacity duration-500 ease-out group-data-[estado=apagada]/fila:opacity-35 sm:w-[10rem] lg:w-[12rem]"
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
                  className="absolute inset-0 flex translate-y-1 items-center justify-center gap-1 pt-[32%] text-[0.82rem] font-semibold tracking-[-0.02em] text-white opacity-0 transition-[translate,opacity] duration-300 ease-out group-hover/esfera:translate-y-0 group-hover/esfera:opacity-100 group-focus-visible/esfera:translate-y-0 group-focus-visible/esfera:opacity-100 sm:text-[0.95rem] [@media(hover:none)]:group-data-[estado=activa]/fila:translate-y-0 [@media(hover:none)]:group-data-[estado=activa]/fila:opacity-100"
                >
                  {work.view}
                  <ArrowUpRightIcon className="h-[0.9em] w-[0.9em]" />
                </span>
              </Link>

              <div className="min-w-0 max-w-md transition-opacity duration-500 ease-out group-data-[estado=apagada]/fila:opacity-75">
                <Titulo
                  translate="no"
                  className="text-[1.35rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.5rem]"
                >
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
