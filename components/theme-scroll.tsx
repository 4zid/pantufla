"use client";

import { useEffect } from "react";

import {
  claro,
  css,
  esTinta,
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
 */

/**
 * Dos ventanas, no una: las superficies cruzan lento y la tinta cruza rápido.
 *
 * El problema es viejo y no tiene una salida limpia. El fondo es uno solo para
 * toda la pantalla, así que mientras va del claro al oscuro pasa por un gris
 * medio, y la cola de la sección clara que todavía se ve queda con su texto
 * encima de ese gris. Si la tinta cruza junto con el fondo, en el punto medio
 * hay gris sobre gris y no se lee nada.
 *
 * Antes eso se resolvía cruzando todo junto y muy rápido, en unos 130px de
 * scroll. Se leía, sí, pero la pantalla entera pasaba de casi blanco a negro
 * en cuatro cuadros y eso encandila: es un flash, no una transición.
 *
 * Así que van separados. El fondo —que es la superficie grande, la que se ve
 * y la que molesta si salta— cruza a lo largo de media pantalla de scroll:
 * medio segundo largo bajando normal, y el ojo lo acompaña. La tinta, que son
 * unas pocas palabras que además ya están saliendo por arriba, se invierte de
 * golpe en una ventana veinte veces más corta, parada justo en el punto del
 * recorrido donde da lo mismo tenerla oscura o clara. Ver la cuenta abajo.
 */
/** Ventana de las superficies: qué parte de la pantalla tapa lo oscuro. */
const FONDO_DESDE = 0.08;
const FONDO_HASTA = 0.66;

/**
 * Ventana de la tinta: cortísima, y clavada en un punto que sale de una cuenta.
 *
 * Hay un punto exacto en el recorrido del fondo donde da lo mismo tener la
 * tinta oscura o la clara: cuando el fondo llega a una luminancia de 0.18
 * —rgb(118) sobre blanco— las dos dan 4.08:1. Un pelo antes conviene la
 * oscura, un pelo después la clara. Ese es el lugar donde hay que cruzar, y
 * con la ventana del fondo de acá arriba cae cuando lo oscuro tapa un 39.5%
 * de la pantalla.
 *
 * Alrededor de ese punto la tinta sí pasa por un gris parecido al del fondo y
 * ahí no se lee: es inevitable, cualquier cruce continuo entre negro sobre
 * claro y blanco sobre oscuro pasa por ahí. Lo que se puede hacer es que dure
 * poco, y por eso la ventana es de 4 centésimas de pantalla: unos 38px de
 * scroll, de los cuales los malos son quince. El fondo, mientras tanto, se
 * toma 500px enteros, que es lo que se mira y lo que no puede saltar.
 */
const TINTA_DESDE = 0.375;
const TINTA_HASTA = 0.415;

/** Una ese: lenta en las puntas, rápida en el medio. */
const suavizar = (t: number) => t * t * (3 - 2 * t);

const rampa = (v: number, desde: number, hasta: number) =>
  suavizar(Math.min(1, Math.max(0, (v - desde) / (hasta - desde))));

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

      const fondo = rampa(oscuridadCruda, FONDO_DESDE, FONDO_HASTA);
      const tinta = rampa(oscuridadCruda, TINTA_DESDE, TINTA_HASTA);

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
      const pasoFondo = Math.round(fondo * 250) / 250;
      const pasoTinta = Math.round(tinta * 250) / 250;
      const firma = `${pasoFondo}|${pasoTinta}|${Math.round(
        fondoClaro[0],
      )},${Math.round(fondoClaro[1])},${Math.round(fondoClaro[2])}`;
      if (firma === anterior) return;
      anterior = firma;

      raiz.style.setProperty(
        "--page-bg",
        css(mezclar(fondoClaro, superficies.deep, pasoFondo)),
      );

      for (const token of TOKENS) {
        const paso = esTinta(token) ? pasoTinta : pasoFondo;
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
