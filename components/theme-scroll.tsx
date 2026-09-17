"use client";

import { useEffect } from "react";

import {
  claro,
  css,
  mezclar,
  oscuro,
  superficies,
  type NombreSuperficie,
} from "@/lib/theme";

/**
 * El fondo de la página, movido por el scroll.
 *
 * El sitio tiene un solo fondo, no uno por sección. Cada sección dice de qué
 * color quiere que esté la página mientras se la mira —data-surface— y este
 * motor mira qué hay en pantalla en cada cuadro y mezcla.
 *
 * La diferencia con pintarle un fondo a cada sección es lo que se ve al bajar.
 * Con fondos propios el cambio es una línea recta que cruza la pantalla, y con
 * una sección negra eso se lee como un corte. Acá no hay línea: la pantalla
 * entera cambia de color mientras uno scrollea, y el visitante ve cómo pasa.
 *
 * Cuando lo que entra es una sección oscura no cambia solo el fondo: cambian
 * todos los tokens. La tinta, las líneas, las tarjetas. El sitio se vuelve
 * oscuro y vuelve, y ningún componente se entera: Tailwind resuelve cada
 * utilidad contra la variable, así que mover la variable repinta todo.
 *
 * Y eso es lo que hace que la transición sea legible. La cola de la sección
 * anterior sigue en pantalla mientras el fondo se oscurece, y su texto se
 * aclara con él: no hay ningún momento en que haya tinta negra sobre un fondo
 * a medio camino.
 */

/**
 * Entre qué dos coberturas de pantalla pasa el cambio de tema.
 *
 * La ventana es corta a propósito, y es el único punto donde hubo que ceder.
 * Un fondo es uno solo para toda la pantalla, así que mientras cambia hay un
 * momento en que la cola de la sección clara se ve sobre un fondo a medio
 * camino: gris sobre gris, con poco contraste. Eso no se puede esquivar
 * —cualquier cruce continuo entre tinta oscura sobre claro y tinta clara sobre
 * oscuro pasa por ahí—, así que lo que se puede hacer es cruzarlo rápido. Del
 * 36% al 50% de pantalla tapada son unos 126px de scroll, y la parte fea son
 * unos cincuenta: un parpadeo.
 *
 * Y la curva es una ese, que va más rápido justo en el medio, que es la parte
 * fea.
 */
const DESDE = 0.36;
const HASTA = 0.5;

/** Una ese: lenta en las puntas, rápida en el medio. */
const suavizar = (t: number) => t * t * (3 - 2 * t);

const TOKENS = Object.keys(claro);

export function ThemeScroll() {
  useEffect(() => {
    const raiz = document.documentElement;

    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pedido = 0;
    let anterior = "";

    function pintar() {
      pedido = 0;

      const alto = window.innerHeight;
      const secciones =
        document.querySelectorAll<HTMLElement>("[data-surface]");

      let oscuridadCruda = 0;
      let pesoClaro = 0;
      let claroAcumulado: [number, number, number] = [0, 0, 0];

      for (const seccion of secciones) {
        const caja = seccion.getBoundingClientRect();
        // Qué parte de la pantalla ocupa esta sección, de 0 a 1.
        const visible =
          (Math.min(caja.bottom, alto) - Math.max(caja.top, 0)) / alto;
        if (visible <= 0) continue;

        const nombre = seccion.dataset.surface as NombreSuperficie;
        const color = superficies[nombre];
        if (!color) continue;

        if (nombre === "deep") {
          oscuridadCruda += visible;
        } else {
          pesoClaro += visible;
          claroAcumulado = [
            claroAcumulado[0] + color[0] * visible,
            claroAcumulado[1] + color[1] * visible,
            claroAcumulado[2] + color[2] * visible,
          ];
        }
      }

      const oscuridad = suavizar(
        Math.min(1, Math.max(0, (oscuridadCruda - DESDE) / (HASTA - DESDE))),
      );

      // El promedio de las secciones claras que hay a la vista. Si no hay
      // ninguna —la oscura tapa toda la pantalla— da igual: la mezcla de abajo
      // se queda con el oscuro entero.
      const fondoClaro: [number, number, number] =
        pesoClaro > 0
          ? [
              claroAcumulado[0] / pesoClaro,
              claroAcumulado[1] / pesoClaro,
              claroAcumulado[2] / pesoClaro,
            ]
          : superficies.mist;

      // Redondear antes de comparar: sin esto, un scroll de un pixel dispara
      // una repintada de toda la hoja de estilos por un cambio invisible.
      //
      // La firma lleva el color claro y no solo la oscuridad. Mirando solo la
      // oscuridad, pasar de una sección blanca a una con bruma no movía nada
      // —las dos tienen oscuridad cero— y el fondo se quedaba clavado en el
      // color de la primera que se hubiera visto.
      const paso = Math.round(oscuridad * 200) / 200;
      const firma = `${paso}|${Math.round(fondoClaro[0])},${Math.round(
        fondoClaro[1],
      )},${Math.round(fondoClaro[2])}`;
      if (firma === anterior) return;
      anterior = firma;

      raiz.style.setProperty(
        "--page-bg",
        css(mezclar(fondoClaro, superficies.deep, paso)),
      );

      for (const token of TOKENS) {
        raiz.style.setProperty(
          token,
          css(mezclar(claro[token], oscuro[token], paso)),
        );
      }
    }

    function alScrollear() {
      if (pedido) return;
      pedido = requestAnimationFrame(pintar);
    }

    pintar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);

    // Con menos movimiento el cambio igual tiene que pasar —si no, la sección
    // oscura queda con tinta clara sobre fondo claro— pero sin el suavizado de
    // la transición del body.
    if (reducido) raiz.style.setProperty("--page-bg-transition", "0ms");

    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
      raiz.style.removeProperty("--page-bg");
      for (const token of TOKENS) raiz.style.removeProperty(token);
    };
  }, []);

  return null;
}
