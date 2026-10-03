"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";
import { empezarSalto, registrarLenis, terminarSalto } from "@/lib/scroll";

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
 *    Y los que van a la misma página sin ancla —la marca, estando en la
 *    home— suben con Lenis en vez de saltar arriba de un golpe.
 *
 * Los saltos se le avisan a la barra (lib/scroll.ts), para que no se esconda
 * mientras la página baja hacia donde el visitante pidió ir. Cualquier gesto
 * propio —rueda, dedo— corta el aviso: desde ahí vuelve a estar leyendo.
 */

/** Lo que tapa la barra: el mismo 6rem del scroll-padding-top. */
const MARGEN_BARRA = 96;

export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    const lenis = new Lenis({ lerp: 0.1 });
    registrarLenis(lenis);

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
      if (enlace.target && enlace.target !== "_self") return;
      const destino = new URL(enlace.href, location.href);
      if (
        destino.origin !== location.origin ||
        destino.pathname !== location.pathname
      ) {
        return;
      }

      // Con el menú del teléfono abierto Lenis está frenado (lib/scroll.ts) y
      // no se movería. El menú se cierra con este mismo clic; lo que falta es
      // que el salto no se pierda en el medio.
      if (lenis.isStopped) lenis.start();

      // La misma página sin ancla: la marca, estando en la home. Sube.
      if (!destino.hash) {
        if (destino.search !== location.search) return;
        e.preventDefault();
        empezarSalto();
        lenis.scrollTo(0, { onComplete: terminarSalto });
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
      // El destino se calcula acá, en número, con el margen de la barra,
      // para que Lenis no le sume además el scroll-padding.
      const y =
        seccion.getBoundingClientRect().top + window.scrollY - MARGEN_BARRA;
      empezarSalto();
      lenis.scrollTo(y, { onComplete: terminarSalto });
    }

    /* Un gesto propio en medio de un salto lo convierte en lectura. */
    window.addEventListener("wheel", terminarSalto, { passive: true });
    window.addEventListener("touchstart", terminarSalto, { passive: true });
    // En captura, para llegar antes que el Link de Next: si ve el clic
    // prevenido no navega él, y el ancla queda para Lenis. Si no, el salto
    // es de Next, instantáneo, y el scroll suave se pierde justo ahí.
    document.addEventListener("click", alClic, true);

    return () => {
      document.removeEventListener("click", alClic, true);
      window.removeEventListener("wheel", terminarSalto);
      window.removeEventListener("touchstart", terminarSalto);
      gsap.ticker.remove(tick);
      registrarLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
