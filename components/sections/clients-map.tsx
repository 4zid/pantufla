"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { clients } from "@/content/site";
import { useCopy } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { nombrePais } from "@/content/countries";
import { useLocale } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { ease, gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Mapa de puntos.
 *
 * La silueta va escrita a mano, fila por fila: cada renglón es un paralelo y
 * cada par son las columnas de tierra en ese paralelo. Antes los continentes se
 * aproximaban con elipses y el resultado era una nube de puntos en la que no se
 * reconocía ningún lugar.
 *
 * 72 columnas cubren de -180° a 180° y 34 filas de 82°N a -52°S.
 */
const LAND: [number, number][][] = [
  [[26, 31]],
  [[25, 32], [50, 62]],
  [[25, 32], [48, 66]],
  [[4, 8], [10, 24], [26, 32], [36, 40], [42, 68]],
  [[3, 8], [9, 24], [27, 31], [35, 40], [41, 69]],
  [[4, 8], [9, 24], [28, 30], [35, 40], [41, 70]],
  [[10, 24], [34, 34], [36, 40], [41, 70]],
  [[11, 24], [33, 34], [36, 44], [45, 70]],
  [[11, 23], [33, 33], [35, 45], [46, 70]],
  [[11, 22], [34, 45], [46, 68]],
  [[11, 22], [34, 35], [38, 38], [40, 45], [46, 66]],
  [[11, 22], [34, 35], [37, 44], [45, 64]],
  [[12, 21], [33, 46], [47, 63]],
  [[13, 18], [33, 47], [48, 62]],
  [[14, 19], [20, 21], [33, 48], [49, 62]],
  [[15, 19], [33, 49], [50, 53], [55, 60]],
  [[17, 20], [33, 50], [50, 53], [55, 60]],
  [[18, 20], [33, 51], [56, 61]],
  [[21, 23], [34, 51], [57, 62]],
  [[21, 26], [35, 50], [57, 63]],
  [[21, 28], [36, 49], [57, 64]],
  [[21, 29], [37, 48], [58, 64]],
  [[21, 29], [37, 47], [58, 64]],
  [[22, 29], [37, 47], [59, 63]],
  [[22, 29], [38, 46], [59, 66]],
  [[22, 29], [38, 46], [58, 66]],
  [[23, 28], [39, 45], [58, 66]],
  [[23, 27], [40, 44], [59, 66]],
  [[23, 27], [41, 43], [60, 65]],
  [[23, 26], [42, 42], [61, 64]],
  [[23, 25], [68, 69]],
  [[23, 25], [68, 69]],
  [[24, 25]],
  [[24, 24]],
];

const COLS = 72;
const ROWS = LAND.length;
const LAT_TOP = 82;
const LAT_BOTTOM = -52;

const toX = (lon: number) => ((lon + 180) / 360) * 100;
const toY = (lat: number) => ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * 100;

const dots: { x: number; y: number }[] = [];
LAND.forEach((spans, r) => {
  spans.forEach(([from, to]) => {
    for (let c = from; c <= to; c++) {
      dots.push({ x: (c / (COLS - 1)) * 100, y: (r / (ROWS - 1)) * 100 });
    }
  });
});

const countries = [...new Set(clients.map((c) => c.country))];

export function ClientsMap() {
  const { clientsMap } = useCopy();
  const locale = useLocale();
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(gsap.utils.toArray("[data-dot]", root), {
          opacity: 0,
          duration: 0.8,
          ease,
          stagger: { amount: 0.6, from: "start" },
          scrollTrigger: { trigger: root, start: START, once: true },
        });
        gsap.from(gsap.utils.toArray("[data-pin]", root), {
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.06,
          delay: 0.35,
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
        icon="globo"
        eyebrow={clientsMap.eyebrow}
        title={clientsMap.title}
        lead={fill(clientsMap.note, { count: countries.length })}
      />

      <Reveal>
        <div ref={scope} className="mt-14">
          <div
            className="relative mx-auto w-full max-w-4xl"
            style={{ aspectRatio: `${COLS} / ${ROWS}` }}
          >
            {dots.map((dot, i) => (
              <span
                key={i}
                data-dot
                aria-hidden
                className="absolute rounded-full bg-ink-faint/50"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: `${100 / COLS / 1.9}%`,
                  aspectRatio: "1",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {clients.map((client, i) => (
              <button
                key={client.city}
                type="button"
                data-pin
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="absolute flex h-7 w-7 items-center justify-center rounded-full"
                style={{
                  left: `${toX(client.lon)}%`,
                  top: `${toY(client.lat)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="sr-only">
                  {client.city}, {nombrePais(client.country, locale)}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute h-7 w-7 rounded-full bg-miel transition-opacity duration-300",
                    active === i ? "opacity-55" : "opacity-25",
                  )}
                />
                <span
                  aria-hidden
                  className="relative h-2.5 w-2.5 rounded-full bg-miel-deep ring-2 ring-paper-alt"
                />

                {active === i ? (
                  <span className="absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-full border border-line bg-card px-2.5 py-1 text-[0.75rem] font-medium shadow-sm">
                    {client.city}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
