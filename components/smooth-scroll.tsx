"use client";

import Lenis from "lenis";
import Snap from "lenis/snap";
import { useEffect } from "react";

import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";

/**
 * El scroll suave de todo el sitio.
 *
 * Lenis se pone entre la rueda y la página: la rueda pide una posición y la
 * página llega con inercia, en vez de saltar de a tramos. No pinta nada ni
 * reemplaza el scroll del navegador —la página sigue scrolleando de verdad,
 * con su barra, sus anclas y sus eventos—, solo suaviza el recorrido. Por
 * eso todo lo que escucha el scroll (la barra que se esconde, el fondo que
 * cambia, los proyectos que se prenden, ScrollTrigger) sigue funcionando
 * igual. En teléfono el dedo manda: el touch queda nativo.
 *
 * Con prefers-reduced-motion Lenis se apaga solo: el scroll sigue al
 * dispositivo 1:1 y los saltos a un ancla son instantáneos.
 *
 * Tres cosas se cablean acá porque dependen de Lenis:
 *
 * 1. ScrollTrigger se actualiza en cada scroll de Lenis y Lenis corre en el
 *    ticker de GSAP, así los dos miran el mismo reloj.
 * 2. Los enlaces a un ancla de la misma página los lleva Lenis, con el mismo
 *    margen de la barra que tenía el scroll-padding. Sin esto, con el
 *    scroll-behavior de CSS apagado (ver globals.css), saltaban de golpe.
 * 3. Los proyectos se anclan con el plugin de snap: el CSS scroll-snap no
 *    convive con un scroll manejado por JS.
 */

/** Lo que tapa la barra: el mismo 6rem del scroll-padding-top. */
const MARGEN_BARRA = 96;

export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    const lenis = new Lenis({ lerp: 0.1 });

    lenis.on("scroll", () => ScrollTrigger.update());
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* 2. Las anclas de la misma página. */
    function alClic(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) {
        return;
      }
      const enlace = (e.target as Element | null)?.closest("a[href]");
      if (!(enlace instanceof HTMLAnchorElement)) return;
      const destino = new URL(enlace.href, location.href);
      if (
        destino.origin !== location.origin ||
        destino.pathname !== location.pathname ||
        !destino.hash
      ) {
        return;
      }
      const seccion = document.getElementById(
        decodeURIComponent(destino.hash.slice(1)),
      );
      if (!seccion) return;
      e.preventDefault();
      // El pathname es el mismo; cambian, si acaso, la consulta y el ancla.
      // pushState y no router.push: Next sincroniza useSearchParams con el
      // historial, y así ?plan=sitio llega al formulario sin recargar nada.
      history.pushState(null, "", destino.search + destino.hash);
      lenis.scrollTo(seccion, { offset: -MARGEN_BARRA });
    }
    document.addEventListener("click", alClic);

    /* 3. El anclaje de los proyectos, solo en escritorio. */
    const escritorio = window.matchMedia("(min-width: 1024px)");
    let snap: Snap | null = null;
    function armarSnap() {
      snap?.destroy();
      snap = null;
      if (!escritorio.matches) return;
      const filas = Array.from(
        document.querySelectorAll<HTMLElement>("[data-fila]"),
      );
      if (!filas.length) return;
      snap = new Snap(lenis, { type: "proximity" });
      snap.addElements(filas, { align: "center" });
    }
    armarSnap();
    escritorio.addEventListener("change", armarSnap);

    return () => {
      escritorio.removeEventListener("change", armarSnap);
      snap?.destroy();
      document.removeEventListener("click", alClic);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
