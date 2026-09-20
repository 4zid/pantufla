"use client";

import { useGSAP } from "@gsap/react";
import { useId, useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import { Section, SectionHead } from "@/components/ui/section";
import { gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro capacidades, en grilla bento.
 *
 * Cuatro tarjetas iguales en fila se leen como una lista y se saltean como una
 * lista. Con tamaños distintos el ojo entra por la más grande y recorre el
 * resto, y de paso cada forma puede llevar algo que en las otras no entraría:
 * la vertical es forma de teléfono y la ancha es la única donde un gráfico se
 * lee.
 *
 * Cada tarjeta reserva su lienzo desde ahora, con algo dibujado y no un hueco.
 * Un espacio vacío esperando una animación se ve como un error hasta el día
 * que llega la animación; uno con una figura simple de la paleta se ve
 * terminado, y cuando la animación llegue reemplaza a la figura sin mover
 * nada de lo que tiene alrededor.
 *
 * La de resultados ya lleva la suya: un gráfico que se dibuja al entrar.
 */

/** El tono de cada tarjeta, en clases, porque Tailwind no arma nombres al vuelo. */
const tonos = {
  aqua: { texto: "text-aqua-deep", fondo: "bg-aqua-soft", trazo: "stroke-aqua-deep", relleno: "fill-aqua" },
  rosa: { texto: "text-rosa-deep", fondo: "bg-rosa-soft", trazo: "stroke-rosa-deep", relleno: "fill-rosa" },
  verde: { texto: "text-verde-deep", fondo: "bg-verde-soft", trazo: "stroke-verde-deep", relleno: "fill-verde" },
  miel: { texto: "text-miel-deep", fondo: "bg-miel-soft", trazo: "stroke-miel-deep", relleno: "fill-miel" },
} as const;

type Tono = keyof typeof tonos;

/* ------------------------------------------------------------------ */
/* Los lienzos                                                         */
/* ------------------------------------------------------------------ */

/**
 * La tinta de los lienzos no es la del tema, y es a propósito.
 *
 * Los cuatro fondos —aqua-soft, rosa-soft, verde-soft, miel-soft— son los
 * únicos colores del sistema que NO se dan vuelta con el modo oscuro: son
 * pastel en los dos. Si lo que se dibuja encima usa --color-ink, en oscuro esa
 * tinta pasa a ser casi blanca y las figuras se borran sobre el pastel. Pasó:
 * en oscuro las tarjetas de velocidad y de SEO se veían como dos planchas de
 * color vacías.
 *
 * Así que acá la tinta va fija, del valor claro. El fondo no cambia, la tinta
 * tampoco, y el contraste es el mismo de noche que de día.
 */
const TINTA = "#121212";
const tinta = (alfa: number) => `color-mix(in srgb, ${TINTA} ${alfa}%, transparent)`;

/**
 * Velocidad: tres tiempos de carga, y el nuestro es el más corto.
 *
 * Van sobre riel y no sueltas. Tres barras flotando de distinto largo son tres
 * barras; metidas en un riel que va de punta a punta se leen como lo que son,
 * tres mediciones de la misma cosa, y la corta se lee como poco y no como
 * chica. Y el orden importa: las dos largas primero y la de marca al final.
 * Al revés la barra de color era la más larga de las tres y la tarjeta decía
 * justo lo contrario de lo que dice el texto, que habla de tardar menos.
 */
function Medidor({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  const color = t.relleno.replace("fill-", "bg-");
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-6 py-6">
      {[100, 64, 26].map((ancho, i) => (
        <span
          key={ancho}
          className="block h-2.5 w-full overflow-hidden rounded-full"
          style={{ background: tinta(6) }}
        >
          <span
            className={cn("block h-full rounded-full", i === 2 ? color : "")}
            style={{ width: `${ancho}%`, ...(i === 2 ? {} : { background: tinta(13) }) }}
          />
        </span>
      ))}
    </div>
  );
}

/** SEO: el esqueleto de un resultado de búsqueda. */
function Resultado({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  return (
    <div className="flex h-full flex-col justify-center px-6 py-6">
      <div
        className="rounded-xl p-4"
        style={{ background: tinta(4), boxShadow: `inset 0 0 0 1px ${tinta(7)}` }}
      >
        <span
          className={cn("block h-2 w-2/5 rounded-full", t.relleno.replace("fill-", "bg-"))}
        />
        <span className="mt-3 block h-1.5 w-full rounded-full" style={{ background: tinta(10) }} />
        <span className="mt-2 block h-1.5 w-5/6 rounded-full" style={{ background: tinta(10) }} />
      </div>
    </div>
  );
}

/**
 * Pantallas: la silueta de un teléfono, entrando por abajo.
 *
 * Crece con el lienzo en vez de quedarse en un ancho fijo. En la tarjeta
 * vertical el lienzo mide setecientos píxeles: un teléfono de ciento cincuenta
 * ahí adentro era una figurita al pie de una plancha verde. Con el alto
 * mandando y la proporción atada —1 a 2, que es la de un teléfono— la figura
 * ocupa lo que tiene que ocupar en cada tamaño sin deformarse nunca.
 *
 * Y la pantalla va llena de arriba abajo, con los bloques repartidos por
 * flex. Con el contenido amontonado arriba y dos tercios de gris abajo, el
 * teléfono se leía como una plantilla a medio cargar; repartido se lee como
 * una página.
 */
function Telefono({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  const color = t.relleno.replace("fill-", "bg-");
  return (
    <div className="flex h-full items-end justify-center px-5 pt-8">
      <div
        className="flex aspect-[1/2] h-full max-h-[34rem] w-auto max-w-full flex-col rounded-t-[1.6rem] p-2.5 pb-0"
        style={{
          background: "#ffffff",
          boxShadow: `inset 0 0 0 1px ${tinta(12)}, 0 -12px 34px -20px rgba(0,0,0,0.4)`,
        }}
      >
        <span
          className="mx-auto mb-3 block h-1 w-8 shrink-0 rounded-full"
          style={{ background: tinta(15) }}
        />
        <div
          className="flex flex-1 flex-col gap-2 rounded-t-[0.8rem] p-3"
          style={{ background: tinta(4) }}
        >
          <span className={cn("block h-2 w-2/3 shrink-0 rounded-full", color)} />
          <span className="block h-1.5 w-full shrink-0 rounded-full" style={{ background: tinta(10) }} />
          <span className="block h-1.5 w-5/6 shrink-0 rounded-full" style={{ background: tinta(10) }} />

          {/* El bloque grande: en una página de verdad es la imagen. */}
          <span className="mt-1 block flex-[1.4] rounded-lg" style={{ background: tinta(8) }} />

          <span className="block h-1.5 w-3/4 shrink-0 rounded-full" style={{ background: tinta(10) }} />
          <span className="block h-1.5 w-full shrink-0 rounded-full" style={{ background: tinta(10) }} />

          <div className="flex flex-1 gap-2">
            <span className="block flex-1 rounded-lg" style={{ background: tinta(8) }} />
            <span className="block flex-1 rounded-lg" style={{ background: tinta(8) }} />
          </div>

          {/* El botón, que es adonde va todo lo de arriba. */}
          <span className={cn("mt-1 block h-6 shrink-0 rounded-md", color)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Resultados: la curva que sube, dibujándose.
 *
 * El trazo se anima con el largo real del path —getTotalLength— y no con un
 * dash inventado: son curvas, y con un número fijo la línea termina antes o
 * después de donde debería. El área entra después, para que primero se lea la
 * forma y recién ahí el volumen.
 */
const CURVA = "M0 96 C 40 92, 66 84, 96 72 S 154 56, 192 40 S 254 20, 300 8";
const AREA = `${CURVA} L300 112 L0 112 Z`;

function Grafico({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  const scope = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useGSAP(
    () => {
      registerGsap();
      const raiz = scope.current;
      if (!raiz) return;
      const barrido = raiz.querySelector("[data-barrido]");
      const puntos = raiz.querySelectorAll("[data-punto]");
      if (!barrido) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(barrido, { attr: { width: 320 } });
        gsap.set(puntos, { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: raiz, start: START, once: true },
      });
      tl.to(barrido, { attr: { width: 320 }, duration: 1.3, ease: "power2.inOut" }).to(
        puntos,
        { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)", stagger: 0.09 },
        "-=0.7",
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="h-full px-6 py-6">
      <svg viewBox="0 0 300 112" className="h-full w-full" aria-hidden>
        <defs>
          {/* Un barrido de izquierda a derecha y no un strokeDasharray.
              El dash se mide en unidades del viewBox, así que en cuanto el SVG
              se escala —y acá se escala distinto en cada ancho— el patrón se
              estira con él y la línea aparece cortada por la mitad. Un rect que
              crece no depende de la escala: descubre el trazo y el área juntos,
              que además es como se dibuja un gráfico de verdad. */}
          <clipPath id={`barrido-${id}`}>
            <rect data-barrido x="-10" y="-10" width="0" height="140" />
          </clipPath>
        </defs>

        {/* Las guías, para que la curva tenga contra qué leerse. */}
        {[28, 56, 84].map((y) => (
          <line key={y} x1="0" y1={y} x2="300" y2={y} stroke={tinta(7)} strokeWidth="1" />
        ))}

        <g clipPath={`url(#barrido-${id})`}>
          <path d={AREA} className={t.relleno} fillOpacity="0.22" />
          <path
            d={CURVA}
            fill="none"
            className={t.trazo}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {[
          [96, 72],
          [192, 40],
          [300, 8],
        ].map(([x, y]) => (
          <circle
            key={x}
            data-punto
            cx={x}
            cy={y}
            r="3.5"
            className={cn(t.relleno, "opacity-0 [transform-box:fill-box] [transform-origin:center]")}
            style={{ transform: "scale(0.3)" }}
          />
        ))}
      </svg>
    </div>
  );
}

const lienzos = { medidor: Medidor, resultado: Resultado, telefono: Telefono, grafico: Grafico };

/**
 * Cuánto mide el lienzo de cada tarjeta.
 *
 * Las dos chicas de arriba lo llevan fijo, y eso es lo que hace que las dos
 * franjas de color empiecen a la misma altura. Con flex-1 no empezaban: las
 * tarjetas de una fila miden todas lo mismo, así que la que tiene el texto más
 * corto le regalaba los veintipico de píxeles sobrantes a su lienzo y el
 * escalón se veía. Ahora el sobrante queda arriba, en el bloque de texto,
 * donde son veinte píxeles de aire que nadie mira.
 *
 * Las dos grandes sí crecen: la vertical tiene setecientos píxeles que llenar
 * y la ancha marca su propia fila, así que no hay con qué desalinearse.
 */
const ALTO: Record<string, string> = {
  medidor: "h-[11rem] shrink-0",
  resultado: "h-[11rem] shrink-0",
  telefono: "min-h-[20rem] flex-1",
  grafico: "min-h-[12rem] flex-1",
};

/* ------------------------------------------------------------------ */

export function Bento() {
  const { bento } = useCopy();

  return (
    <Section id="capacidades">
      <SectionHead
        icon="cubo"
        eyebrow={bento.eyebrow}
        title={bento.title}
        lead={bento.lead}
      />

      {/*
        Tres columnas y dos filas en md: las dos chicas arriba a la izquierda,
        la vertical ocupando la columna de la derecha entera y la ancha abajo
        cruzando las dos primeras. Abajo de md se cae sola a una columna, que
        es lo único que entra en un teléfono.

        Las filas miden lo que mide su contenido. Con auto-rows-fr quedaban las
        dos iguales, y como la fila de abajo la marca la tarjeta ancha, las dos
        de arriba se estiraban a medio millar de píxeles para textos de cinco
        renglones: el lienzo crecía con ellas y quedaban dos planchas de color
        con un dibujito al pie. Las tarjetas de una misma fila igual se
        emparejan entre sí, que es lo único que hacía falta.
      */}
      <Reveal stagger className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
        {bento.cards.map((card) => {
          const diseño = bentoDesign[card.id] ?? {
            tone: "aqua" as const,
            area: "",
            art: "medidor",
          };
          const t = tonos[diseño.tone];
          const Lienzo = lienzos[diseño.art as keyof typeof lienzos] ?? Medidor;

          return (
            <article
              key={card.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-panel border border-line bg-card",
                diseño.area,
              )}
            >
              <div className="p-6 md:p-7">
                <span
                  aria-hidden
                  className={cn("block h-2 w-2 rounded-full", t.relleno.replace("fill-", "bg-"))}
                />
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.3rem]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-ink-soft">
                  {card.body}
                </p>
              </div>

              <div
                data-lienzo
                className={cn("mt-auto border-t border-line", t.fondo, ALTO[diseño.art] ?? ALTO.medidor)}
              >
                <Lienzo tono={diseño.tone} />
              </div>
            </article>
          );
        })}
      </Reveal>
    </Section>
  );
}
