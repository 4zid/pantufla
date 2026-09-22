import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registra los plugins una sola vez, solo en el navegador. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Draggable);
  /*
     En el teléfono la barra del navegador se esconde y aparece al hacer
     scroll, y eso cambia el alto de la ventana: sin esto ScrollTrigger lo
     toma como un resize y recalcula las posiciones de todos los triggers
     cada vez, que es leer el layout entero en medio del scroll.
  */
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** Curva propia: sale rápido y frena largo. Le da el peso del ref sin rebote. */
export const ease = "power3.out";

/** Punto de disparo estándar: el elemento entra 85% abajo de la ventana. */
export const START = "top 85%";

export { Draggable, gsap, ScrollTrigger };
