"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import { scrollSuave } from "@/components/smooth-scroll";
import type { SanityProject } from "@/sanity/types";
import type { Tone } from "@/lib/tones";
import { useCopy, useHref } from "@/components/copy-provider";

/**
 * Los proyectos, de a uno.
 *
 * En escritorio la sección se clava en la pantalla mientras se recorren los
 * proyectos: el título queda a la izquierda, a media altura, y a la derecha
 * la columna de esferas se desliza para que el proyecto que toca quede a esa
 * misma altura, resaltado. Cada gesto de la rueda mueve un proyecto, ni más
 * ni menos: mientras la sección está clavada la rueda no scrollea la página,
 * pide el siguiente (o el anterior) y la página va sola hasta ahí. Los que ya
 * pasaron quedan arriba, apagados pero a la vista; los que vienen, abajo.
 * Después del último la rueda vuelve a ser rueda y la sección se va entera,
 * con el título y el último proyecto todavía a la par. Al volver desde abajo
 * pasa lo mismo al revés.
 *
 * Lo que no llega por la rueda —la barra, el teclado, un dedo en una tablet
 * ancha— mueve la página a mano, y al frenar la sección se acomoda sola en
 * el proyecto más cercano. Tabular hasta la esfera de un proyecto también lo
 * trae al medio.
 *
 * ¿Cómo se clava? La sección mide un alto de pantalla más medio alto de
 * recorrido por cada proyecto después del primero (ver globals.css, «Los
 * proyectos se clavan»); adentro, un panel sticky de un alto de pantalla.
 * Qué tan adentro del recorrido está la página es el progreso, y el progreso
 * es cuántos proyectos subió la columna.
 *
 * En teléfono es una lista que hace scroll normal y se prende la fila que
 * pasa por el medio de la pantalla.
 *
 * El nombre y la descripción van a la derecha de la esfera, afuera. Adentro
 * solo aparece «ver sitio» con la flecha, al pasar el mouse: la esfera es el
 * enlace, y eso es lo que lo dice.
 */

/** El tono de cada esfera, por posición: dos vecinas nunca del mismo color. */
const tonos: Tone[] = ["aqua", "rosa", "verde", "miel"];

/** Cuánto dura el viaje de un proyecto al siguiente, en segundos. */
const DURACION = 0.85;
/** Reposo después de un viaje antes de aceptar otro gesto, en ms. */
const REPOSO = 300;
/** Sin scroll durante este tiempo, la página frenó (ms). */
const QUIETO = 150;
/** A menos de esta fracción de paso, se está «en» el proyecto. */
const HOLGURA = 0.05;
/** Zona alrededor de la sección, en altos de pantalla, donde ya agarra. */
const ZONA = 0.4;

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
    const seccion = ul.closest<HTMLElement>("[data-clavada]");
    const panel = ul.closest<HTMLElement>("[data-panel]");
    const filas = Array.from(ul.querySelectorAll<HTMLElement>("[data-fila]"));
    const n = filas.length;
    if (!n) return;
    const escritorio = window.matchMedia("(min-width: 64rem)");

    /* Medidas, en px. Se toman cada vez porque son baratas y así nunca
       quedan viejas: ni por un resize ni por una fuente que llegó tarde. */
    let arriba = 0;
    let paso = 0;
    let salto = 0;
    function medir() {
      if (!seccion || !panel || n < 2 || !escritorio.matches) {
        paso = 0;
        return;
      }
      arriba = Math.round(seccion.getBoundingClientRect().top + window.scrollY);
      paso = (seccion.offsetHeight - panel.offsetHeight) / (n - 1);
      salto = filas[1].offsetTop - filas[0].offsetTop;
    }
    /** Cuántos proyectos avanzó la página. Puede ser < 0 o > n-1. */
    function progreso() {
      medir();
      return paso ? (window.scrollY - arriba) / paso : 0;
    }
    function zona() {
      return (ZONA * window.innerHeight) / paso;
    }

    let marcada = -1;
    function marcar(i: number) {
      if (i === marcada) return;
      marcada = i;
      filas.forEach((el, j) => {
        el.dataset.estado = j === i ? "activa" : "apagada";
      });
    }

    /* El viaje a un proyecto. Lo lleva Lenis, con la misma curva que el
       resto del sitio; sin Lenis, el navegador. Mientras dura, y un ratito
       después, la rueda no cuenta: así un solo gesto es un solo proyecto. */
    let animando = false;
    function irA(i: number) {
      animando = true;
      const destino = arriba + i * paso;
      let hecho = false;
      const listo = () => {
        if (hecho) return;
        hecho = true;
        window.setTimeout(() => {
          animando = false;
        }, REPOSO);
      };
      // Por si el viaje se corta antes de terminar: nunca queda trabado.
      window.setTimeout(listo, DURACION * 1000 + 300);
      const lenis = scrollSuave.actual;
      if (lenis) {
        lenis.scrollTo(destino, { duration: DURACION, onComplete: listo });
      } else {
        window.scrollTo({ top: destino, behavior: "smooth" });
      }
    }

    /* Un cuadro: la columna se corre según el progreso y se marca la que
       quedó en el medio. Y si la página venía con inercia desde afuera y
       acaba de entrar a la zona, la sección la agarra y la lleva al primer
       proyecto (o al último, si venía desde abajo). */
    let cuadro = 0;
    let enZona = false;
    function pintar() {
      cuadro = 0;
      if (!escritorio.matches) {
        ul!.style.transform = "";
        const medio = window.innerHeight / 2;
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
        marcar(activa);
        return;
      }
      const p = progreso();
      if (!paso) {
        ul!.style.transform = "";
        marcar(0);
        return;
      }
      const dentro = p >= -zona() && p <= n - 1 + zona();
      if (dentro && !enZona && !animando && !scrollSuave.llevando) {
        const lenis = scrollSuave.actual;
        if (lenis?.isScrolling === "smooth") {
          if (p < 0 && lenis.direction > 0) irA(0);
          else if (p > n - 1 && lenis.direction < 0) irA(n - 1);
        }
      }
      enZona = dentro;
      const q = Math.min(Math.max(p, 0), n - 1);
      ul!.style.transform = `translate3d(0, ${(-q * salto).toFixed(2)}px, 0)`;
      marcar(Math.round(q));
    }
    function pedir() {
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    }

    /* Al frenar en mitad de camino (barra, teclado, dedo), acomodarse. */
    let quieto = 0;
    function acomodar() {
      if (!escritorio.matches || animando) return;
      const p = progreso();
      if (!paso || p <= 0 || p >= n - 1) return;
      const i = Math.round(p);
      if (Math.abs(p - i) > 0.01) irA(i);
    }
    function alScroll() {
      pedir();
      window.clearTimeout(quieto);
      quieto = window.setTimeout(acomodar, QUIETO);
    }

    /* La rueda. Cada gesto, un proyecto.

       Un gesto de trackpad son muchos eventos: primero crecen, después se
       apagan solos durante un rato largo, más largo que el viaje. Se agrupan
       en gestos: empieza uno nuevo con una pausa, con un salto grande (una
       muesca de mouse siempre es un gesto) o cuando la magnitud vuelve a
       crecer, que una cola que se apaga nunca hace. Un gesto que ya pidió
       un viaje, o que llegó mientras había uno en marcha, está gastado:
       el resto de sus eventos no cuenta, ni siquiera para salir. Para salir
       de la sección hace falta un gesto nuevo en el primer o el último
       proyecto; ese sí vuelve a mover la página. */
    let ultimoT = 0;
    let ultimaMag = 0;
    let gastado = false;
    function alRueda(e: WheelEvent) {
      if (!escritorio.matches || e.ctrlKey || e.defaultPrevented) return;
      const delta =
        e.deltaY *
        (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (delta === 0 || Math.abs(delta) < Math.abs(e.deltaX)) return;
      const ahora = performance.now();
      const mag = Math.abs(delta);
      const nuevo =
        ahora - ultimoT >= 200 || mag >= 60 || mag > ultimaMag * 1.5 + 2;
      if (nuevo) gastado = false;
      ultimoT = ahora;
      ultimaMag = mag;

      const p = progreso();
      if (!paso || p < -zona() || p > n - 1 + zona()) return;
      const dir = Math.sign(delta);
      const saliendo =
        (dir < 0 && p <= HOLGURA) || (dir > 0 && p >= n - 1 - HOLGURA);
      if (saliendo && !animando && !gastado) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (animando || gastado) {
        gastado = true;
        return;
      }
      gastado = true;
      const destino =
        dir > 0 ? Math.floor(p + HOLGURA) + 1 : Math.ceil(p - HOLGURA) - 1;
      irA(Math.min(Math.max(destino, 0), n - 1));
    }

    /* Tabular hasta un proyecto lo trae al medio; si no, queda recortado. */
    function alFoco(e: FocusEvent) {
      if (!escritorio.matches) return;
      const fila = (e.target as Element | null)?.closest("[data-fila]");
      const i = filas.indexOf(fila as HTMLElement);
      if (i < 0) return;
      const p = progreso();
      if (paso && Math.abs(p - i) > HOLGURA) irA(i);
    }

    pintar();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", pedir);
    window.addEventListener("load", pedir);
    window.addEventListener("wheel", alRueda, {
      capture: true,
      passive: false,
    });
    ul.addEventListener("focusin", alFoco);
    escritorio.addEventListener("change", pedir);
    return () => {
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", pedir);
      window.removeEventListener("load", pedir);
      window.removeEventListener("wheel", alRueda, { capture: true });
      ul.removeEventListener("focusin", alFoco);
      escritorio.removeEventListener("change", pedir);
      if (cuadro) cancelAnimationFrame(cuadro);
      window.clearTimeout(quieto);
      ul.style.transform = "";
    };
  }, [projects.length]);

  return (
    /*
      En escritorio la columna flota en el panel clavado: arranca con la
      primera fila en el medio (50% menos media fila) y de ahí se corre hacia
      arriba de a una fila por proyecto. Cada fila mide lo mismo que la
      esfera, para que el corrimiento sea parejo.
    */
    <ul
      ref={lista}
      className="flex flex-col gap-14 lg:absolute lg:inset-x-0 lg:top-[calc(50%-6rem)] lg:gap-20 lg:will-change-transform"
    >
      {projects.map((project, i) => {
        // Sin URL cargada, la esfera lleva a la ficha interna en vez de
        // quedar muerta. Es el único caso en que el enlace no sale del sitio.
        const externo = Boolean(project.url);
        const destino = project.url ?? href(`/proyectos/${project.slug}`);

        return (
          <li key={project._id} data-fila className="group/fila lg:h-[12rem]">
            <article className="flex items-center gap-6 transition-opacity duration-500 ease-out group-data-[estado=apagada]/fila:opacity-35 lg:h-full lg:gap-8">
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
