import type Lenis from "lenis";

/**
 * Lo que la barra necesita saber del scroll, y lo que necesita pedirle.
 *
 * Lenis vive en components/smooth-scroll.tsx y la barra en site-header.tsx,
 * y se hablan por acá en vez de por eventos: son dos piezas del mismo marco,
 * siempre montadas juntas, y un módulo con tres funciones se lee mejor que un
 * CustomEvent con nombre inventado.
 *
 * Dos cosas:
 *
 * 1. Frenar. Con el menú del teléfono abierto la página de atrás no se tiene
 *    que mover. El overflow del body no alcanza: Lenis mueve la página con
 *    scrollTo, que el overflow no frena, así que en una ventana angosta de
 *    escritorio la rueda seguía bajando la página detrás del menú.
 *
 * 2. Avisar de un salto. Cuando la página baja porque alguien tocó «Planes» en
 *    el menú, no está leyendo: está yendo a un lugar. La barra no se tiene que
 *    esconder en ese viaje. Si lo hace, el título de la sección queda con 96px
 *    de aire arriba reservados para una barra que ya no está, y el menú —lo
 *    que se acaba de usar, y lo que probablemente se use de nuevo— desaparece.
 */

let instancia: Lenis | null = null;
let saltoHasta = 0;

/**
 * Cuánto puede durar un salto como mucho. Lenis avisa al terminar, pero si el
 * visitante lo interrumpe con la rueda puede no avisar nunca; esto es el
 * techo para que la barra no quede trabada a la vista.
 */
const SALTO_MAXIMO = 2500;

export function registrarLenis(lenis: Lenis | null) {
  instancia = lenis;
}

export function frenarScroll(frenar: boolean) {
  if (!instancia) return;
  if (frenar) instancia.stop();
  else instancia.start();
}

export function empezarSalto() {
  saltoHasta = performance.now() + SALTO_MAXIMO;
}

export function terminarSalto() {
  saltoHasta = 0;
}

export function saltando() {
  return performance.now() < saltoHasta;
}
