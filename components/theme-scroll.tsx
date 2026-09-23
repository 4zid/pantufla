"use client";

import { useEffect } from "react";

/**
 * Qué sección manda sobre el color de la página.
 *
 * El sitio tiene un solo fondo y dos estados, claro y oscuro. Este componente
 * no pinta nada: mira qué hay en pantalla y pone un atributo en <html>. El
 * color y el tiempo los pone el CSS —ver la nota larga en globals.css—, que es
 * donde tienen que estar.
 *
 * Antes acá adentro había un motor que interpolaba los diez tokens del tema en
 * cada cuadro contra cuánto ocupaba la sección oscura en pantalla. El problema
 * de atar el color al scroll es que el visitante puede frenar donde quiera, y
 * frenar a mitad de camino entre blanco y negro deja el sitio gris, indefinido,
 * hasta que decida seguir. Con un atributo y una transición de CSS el cambio
 * dura lo que dura la transición y siempre termina de un lado o del otro.
 *
 * La cuenta de cobertura queda igual porque sirve para lo mismo: decidir cuál
 * de las secciones a la vista tiene el mando. Lo que cambió es qué se hace con
 * el resultado —un sí o un no en vez de un valor continuo— y cuánto cuesta:
 * ahora casi todos los cuadros terminan sin tocar el DOM.
 *
 * Hubo un segundo atributo, para elegir entre dos fondos claros. Se fue con
 * ellos: ahora lo claro es uno solo, así que lo único que hay que preguntarse
 * en cada cuadro es si lo oscuro tapa la pantalla.
 */

/**
 * Manda lo que está en el medio de la pantalla.
 *
 * Antes mandaba la cobertura: lo oscuro tomaba el fondo cuando tapaba más de
 * la mitad de la pantalla. Tenía dos problemas. El cambio caía en un punto
 * que no se correspondía con nada que el visitante estuviera mirando —a
 * veces con la sección anterior todavía ocupando media pantalla— y una
 * sección corta en una pantalla alta no llegaba nunca a la mitad, así que
 * marcarla oscura no hacía nada.
 *
 * Ahora se mira una banda angosta alrededor del medio de la pantalla, que es
 * donde está lo que se lee. Lo oscuro toma el fondo cuando una sección
 * oscura cubre la banda entera, y lo suelta cuando ya no toca la banda. Entre
 * una cosa y la otra —tocándola a medias— el fondo se queda como estaba: es
 * lo que evita que titile si el visitante frena justo ahí. Alcanza con que
 * la sección mida un décimo de la pantalla.
 */
const BANDA_ARRIBA = 0.45;
const BANDA_ABAJO = 0.55;

export function ThemeScroll() {
  useEffect(() => {
    const raiz = document.documentElement;

    let pedido = 0;
    let oscuro = false;

    function decidir() {
      pedido = 0;

      const alto = window.innerHeight;
      const arriba = alto * BANDA_ARRIBA;
      const abajo = alto * BANDA_ABAJO;
      const secciones = document.querySelectorAll<HTMLElement>(
        '[data-surface="deep"]',
      );

      let cubreEntera = false;
      let tocaAlgo = false;
      for (const seccion of secciones) {
        const caja = seccion.getBoundingClientRect();
        if (caja.top <= arriba && caja.bottom >= abajo) cubreEntera = true;
        if (caja.top < abajo && caja.bottom > arriba) tocaAlgo = true;
      }

      // Sube a oscuro al cubrir la banda entera y baja al soltarla del todo;
      // tocándola a medias se queda donde estaba.
      const quiereOscuro = oscuro ? tocaAlgo : cubreEntera;
      if (quiereOscuro === oscuro) return;

      oscuro = quiereOscuro;
      if (oscuro) raiz.setAttribute("data-tema", "oscuro");
      else raiz.removeAttribute("data-tema");
    }

    function alScrollear() {
      if (pedido) return;
      pedido = requestAnimationFrame(decidir);
    }

    decidir();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);

    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
      raiz.removeAttribute("data-tema");
    };
  }, []);

  return null;
}
