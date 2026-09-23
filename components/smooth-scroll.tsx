"use client";

import Lenis from "lenis";
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
 * Dos cosas se cablean acá porque dependen de Lenis:
 *
 * 1. ScrollTrigger se actualiza en cada scroll de Lenis y Lenis corre en el
 *    ticker de GSAP, así los dos miran el mismo reloj.
 * 2. Los enlaces a un ancla de la misma página los lleva Lenis, con el mismo
 *    margen de la barra que tenía el scroll-padding. Sin esto, con el
 *    scroll-behavior de CSS apagado (ver globals.css), saltaban de golpe.
 *
 * Y la instancia queda a mano en scrollSuave para quien necesite pedirle un
 * viaje con la misma curva: hoy, los proyectos (components/ui/project-stack).
 */

/** Lo que tapa la barra: el mismo 6rem del scroll-padding-top. */
const MARGEN_BARRA = 96;

/**
 * El Lenis vivo, si lo hay, y si en este momento está llevando la página a
 * un ancla: mientras lleva, las secciones que agarran la inercia (los
 * proyectos) lo dejan pasar.
 */
export const scrollSuave: { actual: Lenis | null; llevando: boolean } = {
  actual: null,
  llevando: false,
};

export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    const lenis = new Lenis({ lerp: 0.1 });
    scrollSuave.actual = lenis;

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
      // Una sección clavada (los proyectos) va justo al borde de arriba: su
      // contenido está centrado y el panel tiene que quedar en su lugar. Las
      // demás dejan el margen de la barra. El destino se calcula acá, en
      // número, para que Lenis no le sume además el scroll-padding.
      const margen = seccion.hasAttribute("data-clavada") ? 0 : MARGEN_BARRA;
      const y = seccion.getBoundingClientRect().top + window.scrollY - margen;
      scrollSuave.llevando = true;
      const soltar = () => {
        scrollSuave.llevando = false;
      };
      lenis.scrollTo(y, { onComplete: soltar });
      window.setTimeout(soltar, 2500);
    }
    // En captura, para llegar antes que el Link de Next: si ve el clic
    // prevenido no navega él, y el ancla queda para Lenis. Si no, el salto
    // es de Next, instantáneo, y el scroll suave se pierde justo ahí.
    document.addEventListener("click", alClic, true);

    return () => {
      document.removeEventListener("click", alClic, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      scrollSuave.actual = null;
      scrollSuave.llevando = false;
    };
  }, []);

  return null;
}
