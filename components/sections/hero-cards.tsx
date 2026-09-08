"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";

import { ease, gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Tarjetas de producto flotando alrededor del titular, recortadas por los
 * bordes de la pantalla. Cada una muestra algo real del servicio —la propuesta,
 * el sitio, la entrega, la consulta— y lleva uno de los cuatro colores.
 *
 * Se ocultan abajo de lg: en mobile compiten con el titular.
 */

function Card({
  children,
  className,
  rotate = 0,
  depth = 1,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  depth?: number;
}) {
  return (
    <div
      data-card
      data-depth={depth}
      style={{ rotate: `${rotate}deg` }}
      className={cn(
        "absolute rounded-card border border-line bg-card/90 shadow-[0_28px_60px_-32px_rgba(35,28,18,0.3)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HeroCards() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);

          if (reduced) {
            gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
            return;
          }

          gsap.from(cards, {
            opacity: 0,
            y: 34,
            scale: 0.94,
            duration: 1,
            ease,
            stagger: 0.09,
            delay: 0.5,
          });

          // Las de mayor profundidad se mueven más: separa los planos.
          cards.forEach((card) => {
            const depth = Number(card.dataset.depth ?? 1);
            gsap.to(card, {
              y: -60 * depth,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
              },
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {/* Propuesta — arriba a la izquierda, cortada por el borde */}
      <Card
        rotate={-4}
        depth={1.3}
        className="-left-14 top-[9%] w-[300px] p-4 xl:-left-4 2xl:left-8"
      >
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            Propuesta
          </p>
          <span className="rounded-full bg-aqua-soft px-2 py-0.5 text-[0.66rem] font-semibold text-aqua-deep">
            Enviada en 21 h
          </span>
        </div>
        <dl className="mt-2.5 space-y-1.5 text-[0.78rem]">
          <div className="flex justify-between">
            <dt className="text-ink-faint">Plan</dt>
            <dd className="font-medium">Sitio</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Alcance</dt>
            <dd className="font-medium">5 páginas + CMS</dd>
          </div>
        </dl>
        <div className="mt-2.5 flex items-baseline justify-between border-t border-line pt-2.5">
          <span className="text-[0.78rem] text-ink-faint">Precio cerrado</span>
          <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">
            USD 2.200
          </span>
        </div>
      </Card>

      {/* Sitio publicado — a la derecha, cortada por el borde */}
      <Card
        rotate={3}
        depth={1.6}
        className="-right-28 top-[6%] w-[350px] overflow-hidden p-0 xl:-right-12 2xl:right-2"
      >
        <div className="flex items-center gap-2 border-b border-line bg-paper-alt/70 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
          <span className="ml-2 text-[0.62rem] text-ink-faint">
            estudiomartel.com
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-3 rounded-[4px] bg-ink" />
            <div className="flex gap-2">
              <div className="h-1 w-6 rounded-full bg-line-strong" />
              <div className="h-1 w-8 rounded-full bg-line-strong" />
            </div>
            <div className="h-4 w-12 rounded-full bg-ink" />
          </div>
          <p className="mt-4 text-[1.15rem] font-semibold leading-[1.05] tracking-[-0.03em]">
            Arquitectura
            <br />
            que se habita.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <div
              className="h-12 rounded-md"
              style={{ background: "linear-gradient(150deg,#fce0e6,#f2a5b6)" }}
            />
            <div
              className="h-12 rounded-md"
              style={{ background: "linear-gradient(150deg,#e8ddd0,#cdbca8)" }}
            />
            <div className="h-12 rounded-md border border-line bg-paper-alt" />
          </div>
        </div>
      </Card>

      {/* Entrega — abajo a la izquierda */}
      <Card
        rotate={2.5}
        depth={0.8}
        className="bottom-[8%] left-[2%] w-[240px] p-4 xl:left-[5%]"
      >
        <div className="flex items-center justify-between">
          <p className="text-[0.78rem] font-medium">Entrega</p>
          <span className="rounded-full bg-verde-soft px-2 py-0.5 text-[0.66rem] font-semibold text-verde-deep">
            Publicado
          </span>
        </div>
        <div className="mt-3 flex gap-1">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-6 flex-1 rounded-[2px]",
                i < 13 ? "bg-verde" : "bg-verde-soft",
              )}
            />
          ))}
        </div>
        <p className="mt-2.5 text-[0.72rem] text-ink-faint">
          Día 15 de 15 · sin atrasos
        </p>
      </Card>

      {/* Consulta nueva — abajo a la derecha */}
      <Card
        rotate={-2}
        depth={1.1}
        className="bottom-[9%] right-[2%] w-[280px] p-3.5 xl:right-[5%]"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-miel-soft text-[0.7rem] font-semibold text-miel-deep">
            PM
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.78rem] font-medium">
              Paula · Estudio Martel
            </p>
            <p className="truncate text-[0.7rem] text-ink-faint">
              Necesitamos mostrar las obras…
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-full bg-paper-alt px-3 py-1.5">
          <span className="text-[0.7rem] text-ink-faint">Brief nuevo</span>
          <span className="text-[0.7rem] font-semibold text-miel-deep">
            Hace 2 min
          </span>
        </div>
      </Card>
    </div>
  );
}
