import type Lenis from "lenis";

/**
 * Lo que la barra necesita pedirle al scroll: frenarlo.
 *
 * Lenis vive en components/smooth-scroll.tsx y la barra en site-header.tsx,
 * y se hablan por acá en vez de por eventos: son dos piezas del mismo marco,
 * siempre montadas juntas, y un módulo con dos funciones se lee mejor que un
 * CustomEvent con nombre inventado.
 *
 * Con el menú del teléfono abierto la página de atrás no se tiene que mover.
 * El overflow del body no alcanza: Lenis mueve la página con scrollTo, que el
 * overflow no frena, así que en una ventana angosta de escritorio la rueda
 * seguía bajando la página detrás del menú.
 *
 * También avisaba de los saltos del menú, para que la barra no se escondiera
 * en el viaje. La barra ya no se esconde, y el aviso se fue con eso.
 */

let instancia: Lenis | null = null;

export function registrarLenis(lenis: Lenis | null) {
  instancia = lenis;
}

export function frenarScroll(frenar: boolean) {
  if (!instancia) return;
  if (frenar) instancia.stop();
  else instancia.start();
}
