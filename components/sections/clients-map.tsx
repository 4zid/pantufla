"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { clients } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { ease, gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Mapa de puntos.
 *
 * Los continentes se aproximan con elipses en coordenadas geográficas: un
 * punto se dibuja si cae dentro de alguna. Es una silueta estilizada, no un
 * mapa exacto, y por eso no hace falta cargar ningún dataset ni imagen.
 */
const LAND: [number, number, number, number][] = [
  // Norteamérica
  [-100, 50, 30, 15], [-95, 63, 28, 9], [-118, 44, 11, 13],
  [-150, 63, 12, 6], [-88, 38, 18, 12], [-103, 24, 11, 8],
  [-85, 14, 9, 4], [-78, 20, 6, 4],
  // Groenlandia
  [-42, 72, 15, 9],
  // Sudamérica
  [-60, -3, 20, 13], [-58, -18, 17, 14], [-63, -32, 12, 14], [-69, -46, 6, 8],
  // Europa
  [14, 52, 22, 11], [18, 63, 12, 8], [-4, 40, 8, 5], [30, 47, 14, 9],
  // África
  [12, 20, 22, 14], [20, 5, 18, 12], [24, -12, 14, 14],
  [26, -28, 9, 8], [45, 8, 9, 6],
  // Asia
  [92, 60, 56, 14], [80, 45, 34, 14], [108, 34, 22, 12],
  [78, 22, 12, 12], [47, 27, 14, 10], [102, 14, 10, 8],
  [115, 0, 15, 6], [140, 38, 5, 8],
  // Oceanía
  [134, -25, 18, 11],
];

const COLS = 88;
const ROWS = 44;
const LON0 = -170;
const LON1 = 180;
const LAT0 = 80;
const LAT1 = -58;

const toX = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * 100;
const toY = (lat: number) => ((lat - LAT0) / (LAT1 - LAT0)) * 100;

function isLand(lon: number, lat: number) {
  return LAND.some(
    ([cx, cy, rx, ry]) =>
      ((lon - cx) / rx) ** 2 + ((lat - cy) / ry) ** 2 <= 1,
  );
}

const dots: { x: number; y: number }[] = [];
for (let r = 0; r < ROWS; r++) {
  const lat = LAT0 + ((LAT1 - LAT0) * r) / (ROWS - 1);
  for (let c = 0; c < COLS; c++) {
    const lon = LON0 + ((LON1 - LON0) * c) / (COLS - 1);
    if (isLand(lon, lat)) dots.push({ x: (c / (COLS - 1)) * 100, y: (r / (ROWS - 1)) * 100 });
  }
}

const countries = [...new Set(clients.map((c) => c.country))];

export function ClientsMap() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(gsap.utils.toArray("[data-pin]", root), {
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: START, once: true },
        });
        gsap.from(gsap.utils.toArray("[data-dot]", root), {
          opacity: 0,
          duration: 0.9,
          ease,
          stagger: { amount: 0.7, from: "start" },
          scrollTrigger: { trigger: root, start: START, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Section id="clientes" tone="alt">
      <SectionHead
        accent="miel"
        eyebrow="Dónde trabajamos"
        title="Trabajamos desde Buenos Aires para donde haga falta."
        lead={`Todo el proceso pasa por escrito y por video. Hasta hoy publicamos sitios para clientes en ${countries.length} países.`}
      />

      <Reveal>
        <div ref={scope} className="relative mt-14">
          <div className="relative mx-auto aspect-[2/1] w-full max-w-5xl">
            {/* Silueta de puntos */}
            {dots.map((dot, i) => (
              <span
                key={i}
                data-dot
                aria-hidden
                className="absolute h-[3px] w-[3px] rounded-full bg-ink-faint/60"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Ciudades */}
            {clients.map((client, i) => (
              <button
                key={client.city}
                type="button"
                data-pin
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="absolute flex h-6 w-6 items-center justify-center rounded-full"
                style={{
                  left: `${toX(client.lon)}%`,
                  top: `${toY(client.lat)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="sr-only">
                  {client.city}, {client.country}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute h-6 w-6 rounded-full bg-miel transition-opacity duration-300",
                    active === i ? "opacity-45" : "opacity-20",
                  )}
                />
                <span
                  aria-hidden
                  className="relative h-2 w-2 rounded-full bg-miel-deep"
                />

                {active === i ? (
                  <span className="absolute bottom-full mb-2 whitespace-nowrap rounded-full border border-line bg-card px-2.5 py-1 text-[0.75rem] font-medium shadow-sm">
                    {client.city}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.88rem] text-ink-soft">
            {countries.map((country) => (
              <li key={country}>{country}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
