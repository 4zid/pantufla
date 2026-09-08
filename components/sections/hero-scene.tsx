"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import {
  PanelAnalytics,
  PanelChat,
  PanelSitio,
  PanelVentas,
} from "@/components/sections/hero-panels";
import { ease, gsap, registerGsap } from "@/lib/motion";
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
  { id: "sitio", node: <PanelSitio />, w: 400, h: 294, rotate: 3 },
  { id: "analytics", node: <PanelAnalytics />, w: 250, h: 140, rotate: -4 },
  { id: "ventas", node: <PanelVentas />, w: 250, h: 140, rotate: 2.5 },
  { id: "chat", node: <PanelChat />, w: 290, h: 294, rotate: -2 },
] as const;

/** Dónde arranca cada panel antes de converger. */
const scattered: Record<string, string> = {
  sitio: "right-[-7rem] top-[8%] xl:right-[-3rem] 2xl:right-6",
  analytics: "left-[-3rem] top-[15%] xl:left-4 2xl:left-16",
  ventas: "left-[2%] bottom-[20%] xl:left-[6%]",
  chat: "right-[1%] bottom-[12%] xl:right-[5%]",
};

/**
 * Dónde cae cada panel dentro de la grilla. Va explícito: con colocación
 * automática los paneles que ocupan dos filas empujan a los demás de celda.
 */
const placed: Record<string, string> = {
  sitio: "lg:col-start-1 lg:row-start-1 lg:row-span-2",
  analytics: "lg:col-start-2 lg:row-start-1",
  ventas: "lg:col-start-2 lg:row-start-2",
  chat: "lg:col-start-3 lg:row-start-1 lg:row-span-2",
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
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          simple: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
          const frame = root.querySelector<HTMLElement>("[data-dashboard]");

          if (!desktop) return;

          gsap.set(cards, { rotate: (i) => panels[i].rotate });
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
            tl.to(
              card,
              {
                x: () => flight(card).x,
                y: () => flight(card).y,
                rotate: 0,
                ease: "power2.inOut",
                duration: 0.55,
              },
              0.18 + i * 0.05,
            );
          });

          return () => {
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
      <div aria-hidden className="absolute inset-0 z-20 hidden lg:block">
        {panels.map((panel) => (
          <div
            key={panel.id}
            data-card={panel.id}
            style={{ width: panel.w, height: panel.h }}
            className={cn("absolute", frameClasses, scattered[panel.id])}
          >
            {panel.node}
          </div>
        ))}
      </div>

      {/* Dashboard. En desktop los huecos quedan vacíos hasta que llegan los
          paneles; en mobile ya vienen adentro. */}
      <div className="mt-12 lg:absolute lg:inset-x-0 lg:-bottom-8 lg:z-10 lg:mt-0">
        <div className="shell">
          <div
            data-dashboard
            className="mx-auto w-full overflow-hidden rounded-t-panel border border-line-strong border-b-0 bg-card shadow-[0_-1px_0_rgba(255,255,255,0.8)_inset,0_40px_80px_-40px_rgba(35,28,18,0.28)] lg:w-fit"
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

            <div className="grid grid-cols-1 gap-3.5 p-3.5 lg:grid-cols-[400px_250px_290px] lg:grid-rows-[140px_140px]">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  data-slot={panel.id}
                  style={{ height: panel.h }}
                  className={cn(
                    "overflow-hidden rounded-card border border-line bg-paper-alt/30 lg:h-auto",
                    placed[panel.id],
                  )}
                >
                  {/* En desktop el hueco queda vacío: lo llena la tarjeta. */}
                  <div className="h-full lg:hidden">{panel.node}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
