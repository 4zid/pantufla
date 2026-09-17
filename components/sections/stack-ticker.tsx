"use client";

import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Tag } from "@/components/ui/tag";
import { SplitHeading } from "@/components/motion/split-heading";
import { stackRows } from "@/content/site";
import { useCopy } from "@/components/copy-provider";
import { toneBg, type Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Riel del stack.
 *
 * Va a sangre, fuera del ancho de lectura: es lo que lo hace leer como un
 * riel y no como una grilla de logos más. El movimiento es CSS y no GSAP —no
 * depende de que hidrate nada, no se calcula en cada scroll y no parpadea en
 * el primer pintado—. La mecánica del empalme está explicada en globals.css.
 *
 * Los nombres van en tipografía, no en logos: ver la nota en content/site.ts.
 */
/**
 * Cuántas veces se repite la lista en cada mitad de la pista.
 *
 * Con una sola pasada por mitad, en el momento en que la animación está a
 * mitad de camino el final de la pista entra en pantalla y queda un hueco
 * blanco: una mitad mide ~900px y no llega a tapar un viewport de 1440. Tres
 * pasadas dan ~2700px por mitad, que cubre hasta pantallas de 2560. Son
 * pastillas de texto, repetirlas no cuesta nada.
 */
const REPEATS = 3;

function Row({
  items,
  reverse,
  duration,
}: {
  items: readonly {
    readonly name: string;
    readonly tone: string;
    readonly logo: string | null;
  }[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="ticker overflow-hidden py-1.5">
      <ul
        className="ticker-track"
        data-direction={reverse ? "reverse" : undefined}
        style={{ "--ticker-duration": duration } as React.CSSProperties}
      >
        {/*
          La lista repetida. Solo la primera pasada la anuncia el lector de
          pantalla; el resto existe para el empalme.
        */}
        {Array.from({ length: REPEATS * 2 }).map((_, copy) =>
          items.map((item) => (
            <li
              key={`${copy}-${item.name}`}
              aria-hidden={copy > 0 || undefined}
              className="pr-3 sm:pr-4"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-card py-2.5 pl-4 pr-5 text-[0.95rem] font-medium">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt=""
                    aria-hidden
                    width={18}
                    height={18}
                    unoptimized
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 object-contain",
                      // El PNG no se puede recolorear como el SVG: el filtro
                      // lo lleva a negro respetando el alpha, que es lo más
                      // cerca de la tinta sin tocar el recorte.
                      item.logo.endsWith(".png") && "brightness-0 opacity-90",
                    )}
                  />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      toneBg[item.tone as Tone],
                    )}
                  />
                )}
                {item.name}
              </span>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export function StackTicker() {
  const { stack } = useCopy();
  return (
    <section id="stack" className="relative overflow-hidden py-20 md:py-24">
      <div className="shell">
        <div className="max-w-2xl">
          <Reveal>
            <Tag icon="cubo">{stack.eyebrow}</Tag>
          </Reveal>
          <SplitHeading text={stack.title} className="mt-5 text-h2" />
          <Reveal delay={0.15}>
            <p className="mt-5 text-lead text-ink-soft">{stack.lead}</p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.2} className="mt-12 flex flex-col gap-3 md:mt-14">
        <Row items={stackRows[0]} duration="46s" />
        <Row items={stackRows[1]} duration="58s" reverse />
      </Reveal>
    </section>
  );
}
