"use client";

import { useEffect } from "react";

/**
 * Qué sección manda sobre el color de la página.
 *
 * El sitio tiene un solo fondo y dos estados, claro y oscuro. Este componente
 * no pinta nada: mira qué hay en pantalla y pone dos atributos en <html>. El
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
 */

/**
 * Cuánto tiene que tapar lo oscuro para tomar el mando, y cuánto tiene que
 * soltar para devolverlo.
 *
 * Son dos números y no uno para que el cambio no titile. Con un solo umbral,
 * quedarse parado justo encima —y basta el rebote de un trackpad— alcanza para
 * cruzarlo en los dos sentidos varias veces por segundo, y cada cruce dispara
 * una transición de 600ms. Con la ventana de por medio hay que moverse una
 * décima de pantalla para volver atrás, que ya es una decisión y no un temblor.
 */
const PRENDE = 0.55;
const APAGA = 0.45;

type Superficie = "paper" | "mist" | "deep";

export function ThemeScroll() {
  useEffect(() => {
    const raiz = document.documentElement;

    let pedido = 0;
    let oscuro = false;
    let fondo: Superficie | null = null;

    function decidir() {
      pedido = 0;

      const alto = window.innerHeight;
      const secciones =
        document.querySelectorAll<HTMLElement>("[data-surface]");

      let tapaOscuro = 0;
      const claros: Record<string, number> = { paper: 0, mist: 0 };

      for (const seccion of secciones) {
        const caja = seccion.getBoundingClientRect();
        // Qué parte de la pantalla ocupa esta sección, de 0 a 1.
        const visible =
          (Math.min(caja.bottom, alto) - Math.max(caja.top, 0)) / alto;
        if (visible <= 0) continue;

        const nombre = seccion.dataset.surface as Superficie;
        if (nombre === "deep") tapaOscuro += visible;
        else if (nombre in claros) claros[nombre] += visible;
      }

      // El estado se sostiene solo: sube a oscuro al pasar PRENDE y baja al
      // caer de APAGA; en el medio se queda donde estaba.
      const quiereOscuro = oscuro
        ? tapaOscuro > APAGA
        : tapaOscuro >= PRENDE;

      if (quiereOscuro !== oscuro) {
        oscuro = quiereOscuro;
        if (oscuro) raiz.setAttribute("data-tema", "oscuro");
        else raiz.removeAttribute("data-tema");
      }

      // Cuál de los dos claros gana. Solo importa mientras el tema es claro,
      // pero se sigue midiendo igual para que al volver de una sección oscura
      // el fondo ya esté en el que corresponde.
      const claro: Superficie = claros.paper > claros.mist ? "paper" : "mist";
      if (claro !== fondo) {
        fondo = claro;
        if (claro === "paper") raiz.setAttribute("data-fondo", "paper");
        else raiz.removeAttribute("data-fondo");
      }
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
      raiz.removeAttribute("data-fondo");
    };
  }, []);

  return null;
}
