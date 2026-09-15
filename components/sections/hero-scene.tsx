"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import {
  PanelAnalytics,
  PanelChat,
  PanelSitio,
  PanelVentas,
} from "@/components/sections/hero-panels";
import { Draggable, ease, gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Escena del hero.
 *
 * Arriba de lg los cuatro paneles arrancan dispersos alrededor del título y,
 * al bajar, vuelan hasta sus lugares dentro del dashboard.
 *
 * El hueco de cada panel mide exactamente lo mismo que el panel, así que el
 * vuelo es una traslación pura: no hay que escalar nada y nada se deforma.
 * Como los dos elementos viven en el mismo contenedor, la diferencia entre sus
 * rectángulos tampoco depende del scroll.
 *
 * Abajo de lg no hay vuelo: el dashboard se muestra ya armado.
 */

const panels = [
  { id: "sitio", node: <PanelSitio />, w: 420, h: 292, rotate: 3 },
  { id: "analytics", node: <PanelAnalytics />, w: 262, h: 137, rotate: -4 },
  { id: "ventas", node: <PanelVentas />, w: 262, h: 137, rotate: 2.5 },
  { id: "chat", node: <PanelChat />, w: 305, h: 292, rotate: -2 },
] as const;

/**
 * Dónde arranca cada panel antes de converger.
 *
 * Los cuatro viven en la mitad de abajo, que es la zona libre: arriba manda el
 * título y ahí no entra nada. Antes se cruzaban con el titular por los costados
 * y además sobresalían del borde, así que el texto quedaba cortado.
 *
 * Por eso también aparecen recién a partir de 1440px: abajo de ese ancho no hay
 * lugar para ponerlos sin pisar algo.
 */
const scattered: Record<string, string> = {
  analytics: "left-[3%] top-[44%]",
  ventas: "right-[3%] top-[45%]",
  chat: "left-[5%] top-[66%]",
  sitio: "right-[5%] top-[64%]",
};

/**
 * Dónde cae cada panel dentro de la grilla. Va explícito: con colocación
 * automática los paneles que ocupan dos filas empujan a los demás de celda.
 */
const placed: Record<string, string> = {
  sitio: "min-[1440px]:col-start-1 min-[1440px]:row-start-1 min-[1440px]:row-span-2",
  analytics: "min-[1440px]:col-start-2 min-[1440px]:row-start-1",
  ventas: "min-[1440px]:col-start-2 min-[1440px]:row-start-2",
  chat: "min-[1440px]:col-start-3 min-[1440px]:row-start-1 min-[1440px]:row-span-2",
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

          gsap.set(cards, { rotate: (i) => panels[i].rotate });

          // Se pueden agarrar y mover. El arrastre vive en el hijo, así que no
          // compite con el transform que usa el vuelo.
          const draggables = cards.map((card) =>
            Draggable.create(card.querySelector("[data-drag]"), {
              type: "x,y",
              bounds: root.parentElement ?? undefined,
              inertia: false,
              cursor: "grab",
              activeCursor: "grabbing",
            }),
          );
          gsap.from(cards, {
            opacity: 0,
            y: 34,
            scale: 0.94,
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
            };
            gsap.set(card, { x: 0, y: 0, rotate: 0 });
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
            tl.fromTo(
              frame,
              { opacity: 0, y: 70 },
              { opacity: 1, y: 0, ease: "power2.out", duration: 0.3 },
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
    <div ref={scope} className="pointer-events-none">
      {/* Paneles sueltos: solo en desktop, donde hay lugar para dispersarlos.
          Van encima del dashboard para que se vean al aterrizar. */}
      <div aria-hidden className="absolute inset-0 z-20 hidden min-[1440px]:block">
        {panels.map((panel) => (
          <div
            key={panel.id}
            data-card={panel.id}
            style={{ width: panel.w, height: panel.h }}
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

      {/* Dashboard. En desktop los huecos quedan vacíos hasta que llegan los
          paneles; en mobile ya vienen adentro. */}
      <div className="mt-12 min-[1440px]:absolute min-[1440px]:inset-x-0 min-[1440px]:bottom-0 min-[1440px]:z-10 min-[1440px]:mt-0">
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

            <div className="grid grid-cols-1 gap-[18px] p-[18px] min-[1440px]:grid-cols-[420px_262px_305px] min-[1440px]:grid-rows-[137px_137px]">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  data-slot={panel.id}
                  style={{ height: panel.h }}
                  className={cn(
                    "overflow-hidden rounded-card border border-line bg-paper-alt/30 min-[1440px]:h-auto",
                    placed[panel.id],
                  )}
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
