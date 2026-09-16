"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import {
  PanelSeo,
  PanelTrafico,
  PanelVentas,
  PanelVisitas,
} from "@/components/sections/hero-panels";
import { Draggable, ease, gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Escena del hero.
 *
 * Arriba de lg los cuatro paneles arrancan dispersos alrededor del título y,
 * al bajar, vuelan hasta sus lugares dentro del dashboard.
 *
 * La caja de maquetado de cada panel mide exactamente lo mismo que su hueco:
 * el panel se ve más grande por una escala, no por un tamaño distinto. Así el
 * vuelo sigue siendo la diferencia entre dos rectángulos iguales más la vuelta
 * de la escala a 1, y nada se deforma al aterrizar. Como los dos elementos
 * viven en el mismo contenedor, esa diferencia tampoco depende del scroll.
 *
 * Abajo de lg no hay vuelo: el dashboard se muestra ya armado.
 */

/**
 * Los cuatro miden lo mismo y van en una sola fila.
 *
 * Antes eran de tres tamaños distintos y había que colocarlos a mano, celda
 * por celda; alrededor del título quedaban desparejos y se leían como cuatro
 * cosas sueltas. Iguales y simétricos se leen como un tablero.
 */
const PANEL_W = 280;
const PANEL_H = 190;

const panels = [
  { id: "visitas", node: <PanelVisitas />, rotate: -3.5 },
  { id: "trafico", node: <PanelTrafico />, rotate: 3 },
  { id: "seo", node: <PanelSeo />, rotate: -3 },
  { id: "ventas", node: <PanelVentas />, rotate: 3.5 },
] as const;

/**
 * Cuánto más grandes se ven los paneles antes de converger.
 *
 * Es una escala y no un tamaño distinto a propósito: la caja de maquetado
 * sigue midiendo lo mismo que su hueco, así que el aterrizaje se sigue
 * calculando como una traslación pura entre dos rectángulos del mismo tamaño.
 * La escala vuelve a 1 durante el vuelo y el panel cae justo.
 */
const SCATTER_SCALE = 1.7;

/**
 * Dónde arranca cada panel antes de converger.
 *
 * Las cajas se plantan pasadas del borde para que la escala las saque de
 * pantalla: se ven grandes y cortadas por los costados, que es lo que hace que
 * el hero se sienta ocupado en vez de decorado.
 *
 * Los valores son relativos a la escena, que es el espacio que queda debajo
 * del texto, y no al hero entero. Así el margen contra el titular no depende
 * de cuántas líneas ocupe: si el título crece, la escena empieza más abajo y
 * los paneles bajan con ella. Medirlo desde arriba obligaba a recalcular el
 * número cada vez que cambiaba una palabra del encabezado.
 *
 * El primer par arranca en 75px porque la escala los agranda desde el centro:
 * un panel puesto en 0 asomaría unos 66px por encima del borde de la escena,
 * o sea, encima del texto.
 *
 * Aparecen recién a partir de 1440px: abajo de ese ancho no hay costado libre.
 */
const scattered: Record<string, string> = {
  // Una sola fila abanicada, en el mismo orden que el tablero: es el tablero
  // desarmado. Repartidos de a dos por los costados quedaba un hueco en el
  // medio y se leían como cuatro sobras apoyadas contra los bordes; en fila
  // se leen como una cosa sola que después se acomoda.
  //
  // El paso entre uno y otro es menor que el ancho escalado, así que se
  // enciman unos 70px y el abanico queda armado. El primero sangra por la
  // izquierda; el último llega casi al borde derecho.
  visitas: "left-[-4%] top-[80px]",
  trafico: "left-[21%] top-[120px]",
  seo: "left-[46%] top-[120px]",
  ventas: "left-[71%] top-[80px]",
};

export function HeroScene() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 1440px) and (prefers-reduced-motion: no-preference)",
          simple: "(max-width: 1439px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
          const frame = root.querySelector<HTMLElement>("[data-dashboard]");

          if (!desktop) return;

          gsap.set(cards, {
            rotate: (i) => panels[i].rotate,
            scale: SCATTER_SCALE,
          });

          // Se pueden agarrar y mover. El arrastre vive en el hijo, así que no
          // compite con el transform que usa el vuelo.
          const draggables = cards.map((card) =>
            Draggable.create(card.querySelector("[data-drag]"), {
              type: "x,y",
              inertia: false,
              cursor: "grab",
              activeCursor: "grabbing",
            }),
          );
          gsap.from(cards, {
            opacity: 0,
            y: 34,
            duration: 1,
            ease,
            stagger: 0.09,
            delay: 0.5,
          });

          /** Cuánto tiene que viajar una tarjeta hasta su hueco. */
          const flight = (card: HTMLElement) => {
            const slot = root.querySelector<HTMLElement>(
              `[data-slot="${card.dataset.card}"]`,
            );
            if (!slot) return { x: 0, y: 0 };

            const saved = {
              x: gsap.getProperty(card, "x") as number,
              y: gsap.getProperty(card, "y") as number,
              rotate: gsap.getProperty(card, "rotation") as number,
              scale: gsap.getProperty(card, "scaleX") as number,
            };
            gsap.set(card, { x: 0, y: 0, rotate: 0, scale: 1 });
            const c = card.getBoundingClientRect();
            const s = slot.getBoundingClientRect();
            gsap.set(card, saved);

            return { x: s.left - c.left, y: s.top - c.top };
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.closest("section"),
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          if (frame) {
            // Solo opacidad: el marco no se desplaza.
            //
            // Antes entraba desde y:70 y los huecos se movían con él. Cada
            // panel mide su hueco cuando arranca su propio vuelo —GSAP resuelve
            // los valores por función una sola vez, ahí— así que apuntaban a
            // una posición que el marco todavía estaba dejando atrás y
            // aterrizaban 70px más abajo, con el hueco vacío asomando arriba.
            // Con el marco quieto, lo que se mide es lo que hay.
            tl.fromTo(
              frame,
              { opacity: 0 },
              { opacity: 1, ease: "power2.out", duration: 0.3 },
              0.05,
            );
          }

          cards.forEach((card, i) => {
            const at = 0.18 + i * 0.05;

            // Lo que el visitante haya movido a mano vuelve a cero antes de
            // volar: si no, el panel aterriza corrido respecto del hueco.
            tl.to(
              card.querySelector("[data-drag]"),
              { x: 0, y: 0, ease: "power2.inOut", duration: 0.3 },
              at,
            );

            tl.to(
              card,
              {
                x: () => flight(card).x,
                y: () => flight(card).y,
                rotate: 0,
                scale: 1,
                ease: "power2.inOut",
                duration: 0.55,
              },
              at,
            );
          });

          return () => {
            draggables.flat().forEach((d) => d.kill());
            gsap.set(cards, { clearProps: "all" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  const frameClasses =
    "overflow-hidden rounded-card border border-line bg-card shadow-[0_28px_60px_-32px_rgba(35,28,18,0.3)]";

  return (
    <div
      ref={scope}
      className="pointer-events-none min-[1440px]:relative min-[1440px]:flex min-[1440px]:min-h-0 min-[1440px]:flex-1 min-[1440px]:flex-col"
    >
      {/* Paneles sueltos: solo en desktop, donde hay lugar para dispersarlos.
          Van encima del dashboard para que se vean al aterrizar. */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 hidden min-[1440px]:block"
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            data-card={panel.id}
            style={{ width: PANEL_W, height: PANEL_H }}
            className={cn("absolute", scattered[panel.id])}
          >
            <div
              data-drag
              className={cn("pointer-events-auto h-full w-full", frameClasses)}
            >
              {panel.node}
            </div>
          </div>
        ))}
      </div>

      {/*
        Dashboard. En desktop los huecos quedan vacíos hasta que llegan los
        paneles; en mobile ya vienen adentro.

        Va en el flujo con mt-auto y no anclado al pie del contenedor. Anclado
        abajo, su borde superior dependía del alto del viewport y en pantallas
        de menos de 1000px de alto subía hasta taparle la línea de prueba al
        titular: en un portátil de 850px se comía los tres datos enteros. Con
        mt-auto el orden lo garantiza el flujo —nunca puede quedar por encima
        del texto— y si falta lugar se recorta contra el borde de abajo, que es
        justo el gesto que el marco ya usa al no llevar borde inferior.
      */}
      <div className="mt-12 min-[1440px]:z-10 min-[1440px]:mt-auto min-[1440px]:pt-10">
        <div className="shell">
          <div
            data-dashboard
            className="mx-auto w-full overflow-hidden rounded-t-panel border border-line-strong border-b-0 bg-card shadow-[0_-1px_0_rgba(255,255,255,0.8)_inset,0_40px_80px_-40px_rgba(35,28,18,0.28)] min-[1440px]:w-fit"
          >
            <div className="flex items-center gap-3 border-b border-line bg-paper-alt/70 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              </div>
              <div className="mx-auto rounded-full border border-line bg-card px-3 py-1 text-[0.7rem] text-ink-faint">
                Tu sitio, un mes después
              </div>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-1 gap-[18px] p-[18px] min-[1440px]:grid-cols-[repeat(4,280px)] min-[1440px]:grid-rows-[190px]">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  data-slot={panel.id}
                  style={{ height: PANEL_H }}
                  className="overflow-hidden rounded-card border border-line bg-paper-alt/40 min-[1440px]:h-auto"
                >
                  {/* En desktop el hueco queda vacío: lo llena la tarjeta. */}
                  <div className="h-full min-[1440px]:hidden">{panel.node}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
