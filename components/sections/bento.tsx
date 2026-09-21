"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import { Section, SectionHead } from "@/components/ui/section";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Sphere } from "@/components/ui/sphere";
import { gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro capacidades, en tablero.
 *
 * Cuatro tarjetas iguales en fila se leen como una lista y se saltean como una
 * lista. Con tamaños distintos el ojo entra por la más grande y recorre el
 * resto.
 *
 * Los dibujos son abstractos a propósito. La versión anterior tenía cuatro
 * maquetas de interfaz —un formulario, tres pantallas, una respuesta— y se
 * leían como capturas de otro sitio: literales, y todas con el mismo peso.
 * Ahora cada tarjeta tiene una atmósfera y un solo gesto encima: un color
 * difuso detrás, vidrio esmerilado delante, y una cosa que se mueve. La
 * velocidad es un número que sube. Que te encuentren es una pregunta que se
 * escribe sola y una respuesta que llega. Las pantallas son celdas que se
 * llenan en ola, con una esfera parada encima. Los resultados son una
 * pastilla que recorre su riel.
 *
 * Y cada una tiene el dibujo en un lugar distinto: arriba, abajo, de fondo,
 * al lado. Cuatro tarjetas con el texto arriba y una banda abajo se leen como
 * la misma tarjeta repetida, por más distinto que sea el dibujo.
 */

/** Las clases de cada tono, escritas enteras porque Tailwind no arma nombres al vuelo. */
const tonos = {
  aqua: { texto: "text-aqua-deep", suave: "bg-aqua-soft", solido: "bg-aqua", profundo: "bg-aqua-deep" },
  rosa: { texto: "text-rosa-deep", suave: "bg-rosa-soft", solido: "bg-rosa", profundo: "bg-rosa-deep" },
  verde: { texto: "text-verde-deep", suave: "bg-verde-soft", solido: "bg-verde", profundo: "bg-verde-deep" },
  miel: { texto: "text-miel-deep", suave: "bg-miel-soft", solido: "bg-miel", profundo: "bg-miel-deep" },
} as const;

type Tono = keyof typeof tonos;

/**
 * La tinta de lo que va sobre vidrio o sobre color no es la del tema, y es a
 * propósito. Los pastel de la paleta y el vidrio blanco son fijos —no se dan
 * vuelta con el modo oscuro— así que la tinta de encima tampoco puede darse
 * vuelta: en oscuro pasaría a casi blanca sobre un vidrio casi blanco y el
 * texto desaparecería.
 */
const TINTA = "#121212";
const tinta = (alfa: number) => `color-mix(in srgb, ${TINTA} ${alfa}%, transparent)`;

/**
 * Vidrio esmerilado. Blanco a medias con desenfoque de lo que hay detrás:
 * es lo que hace que los blobs de color se vean A TRAVÉS de la pieza, y no
 * que la pieza esté pegada encima.
 */
const VIDRIO =
  "border border-white/70 bg-white/55 shadow-[0_12px_32px_-18px_rgba(18,18,18,0.45)] backdrop-blur-md";

type Figuras = {
  speedOurs: string;
  speedTheirs: string;
  seoQuestion: string;
  seoAnswer: string;
  formButton: string;
};

/* ------------------------------------------------------------------ */
/* Piezas comunes                                                      */
/* ------------------------------------------------------------------ */

/**
 * Un blob de color difuso.
 *
 * Es un radial con el borde en rampa más un desenfoque encima. El radial ya
 * es blando; el filter es lo que le da el aspecto de mancha de luz que tiene
 * la inspiración, en vez de círculo degradado. Son pocos —dos por tarjeta— y
 * no se animan por scroll, así que el costo del filter no se nota.
 *
 * Se apaga del todo al 72% de su radio, a propósito. Los blobs sangran por
 * los bordes de la tarjeta, y la tarjeta los recorta con overflow-hidden; el
 * desenfoque no puede suavizar un corte, porque el corte pasa después. Con el
 * cuarto exterior ya transparente, el recorte cae donde no hay nada que
 * cortar. Antes el blob aqua terminaba en un rectángulo teal en la esquina.
 */
function Blob({
  tono,
  className,
  intensidad = 100,
}: {
  tono: Tono;
  className?: string;
  intensidad?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        background: `radial-gradient(closest-side, color-mix(in srgb, var(--color-${tono}) ${intensidad}%, transparent) 0%, color-mix(in srgb, var(--color-${tono}) ${intensidad * 0.5}%, transparent) 38%, transparent 72%)`,
        filter: "blur(18px)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 1. Velocidad — la cifra                                             */
/* ------------------------------------------------------------------ */

/**
 * El número, grande, sobre vidrio, sobre un blob que sangra por el borde.
 *
 * El número es el dibujo: sube de cero al valor cuando la tarjeta entra, y
 * debajo un riel se llena hasta donde el número marca contra la referencia.
 * No hay velocímetro ni reloj: en un sitio donde la tipografía ya es imagen,
 * «0,9 s» en cuerpo grande dice más que cualquier ícono.
 */
function Cifra({ tono, figuras }: { tono: Tono; figuras: Figuras }) {
  const t = tonos[tono];
  return (
    <div className="relative h-full overflow-hidden">
      <Blob tono={tono} className="-right-20 -top-28 h-96 w-96" intensidad={80} />
      <Blob tono="miel" className="-left-14 top-6 h-56 w-56" intensidad={55} />

      <div
        data-cifra-chip
        className={cn("absolute bottom-5 left-5 rounded-2xl px-5 py-4", VIDRIO)}
      >
        <div className="flex items-baseline gap-3">
          <p
            data-cifra
            className={cn(
              "text-[2.7rem] font-semibold leading-none tracking-[-0.045em] tabular-nums",
              t.texto,
            )}
          >
            {figuras.speedOurs}
          </p>
          <p className="text-[0.78rem] font-medium tabular-nums" style={{ color: tinta(42) }}>
            {figuras.speedTheirs}
          </p>
        </div>
        <div className="mt-3 h-1 w-40 overflow-hidden rounded-full" style={{ background: tinta(9) }}>
          <span
            data-cifra-barra
            className={cn("block h-full w-full origin-left rounded-full", t.profundo)}
            style={{ transform: "scaleX(0.3)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. SEO — la consulta                                                */
/* ------------------------------------------------------------------ */

/**
 * Una barra de vidrio donde la pregunta se escribe sola, y la respuesta que
 * aparece debajo cuando termina.
 *
 * La tarjeta habla de que te encuentren y no solo en Google: lo que hay que
 * mostrar no es un resultado de búsqueda sino una pregunta escrita como se
 * escribe hoy —a un modelo, en minúscula, sin punto— y lo que contesta. La
 * pregunta se tipea porque una pregunta es algo que alguien escribe; una ya
 * escrita es un cartel.
 */
function Consulta({ tono, figuras }: { tono: Tono; figuras: Figuras }) {
  return (
    <div className="relative h-full overflow-hidden">
      <Blob tono={tono} className="-bottom-28 -left-24 h-96 w-96" intensidad={85} />
      <Blob tono="miel" className="-right-16 -bottom-8 h-64 w-64" intensidad={60} />

      {/* La barra. El punto de la izquierda es el orbe de la inspiración:
          una esferita de dos tonos, que acá es la paleta entera en miniatura. */}
      <div
        className={cn(
          "absolute inset-x-5 top-5 flex h-11 items-center gap-3 rounded-full pl-2.5 pr-4",
          VIDRIO,
        )}
      >
        <span
          aria-hidden
          className="h-6 w-6 shrink-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.15)]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #ffffff 0%, var(--color-rosa) 30%, var(--color-aqua) 75%, var(--color-verde) 100%)",
          }}
        />
        <p className="truncate text-[0.88rem]" style={{ color: tinta(78) }}>
          <span data-tipeo />
          <span
            data-caret
            aria-hidden
            className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-[parpadeo_1s_steps(2)_infinite]"
            style={{ background: tinta(70) }}
          />
        </p>
      </div>

      {/* La respuesta, que llega después y se sale por abajo: es un pedazo de
          algo más largo, no una tarjeta entera. */}
      <div
        data-respuesta
        className={cn("absolute inset-x-5 top-[5.1rem] rounded-2xl px-4 pb-6 pt-3.5", VIDRIO)}
        style={{ opacity: 0 }}
      >
        <p className="text-[0.86rem] leading-[1.5]" style={{ color: tinta(84) }}>
          {figuras.seoAnswer}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pantallas — las celdas                                           */
/* ------------------------------------------------------------------ */

/**
 * Una grilla de celdas redondeadas que se llena en ola, y una esfera parada
 * encima.
 *
 * Es lo más abstracto de las cuatro: no hay pantalla ni teléfono. Las celdas
 * son el layout —lo que se rearma— y los tres estados, lleno, a medias y
 * vacío, son cómo cada bloque cae en cada ancho. La ola de entrada, de arriba
 * a la izquierda hacia abajo a la derecha, es lo que hace que se lea como
 * algo que se acomoda y no como un patrón impreso.
 *
 * La esfera es la misma de los proyectos, chica. Es lo que ata este tablero
 * al resto del sitio.
 */
const ESTADOS = [
  2, 1, 0, 2,
  1, 2, 2, 0,
  0, 2, 1, 2,
  2, 0, 2, 1,
  1, 2, 0, 2,
  2, 2, 1, 0,
  0, 1, 2, 2,
];

function Celdas({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  return (
    <div className="relative h-full overflow-hidden">
      <Blob tono={tono} className="-bottom-32 -right-28 h-[26rem] w-[26rem]" intensidad={70} />

      <div
        data-celdas
        className="absolute inset-x-5 bottom-6 top-4 grid grid-cols-4 grid-rows-7 gap-2"
      >
        {ESTADOS.map((estado, i) => (
          <span
            key={i}
            data-celda
            className={cn(
              "rounded-[0.9rem]",
              estado === 2 && cn(t.suave, "border border-transparent"),
              estado === 1 && "border border-dashed",
            )}
            style={{
              borderColor: estado === 1 ? `color-mix(in srgb, var(--color-${tono}-deep) 45%, transparent)` : undefined,
              background: estado === 0 ? tinta(5) : undefined,
            }}
          />
        ))}
      </div>

      <div data-esfera-chica className="absolute bottom-5 right-5 w-24">
        <Sphere tone={tono} className="w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Resultados — el deslizador                                       */
/* ------------------------------------------------------------------ */

/**
 * Un riel y una pastilla que lo recorre.
 *
 * Es el gesto de la inspiración —la lectura de pulso con la pastilla
 * brillante— vuelto sobre lo que dice la tarjeta: un sitio hecho para que te
 * escriban es un sitio donde la aguja va para el lado correcto. La pastilla
 * arranca del principio y llega casi al final cuando la tarjeta entra, y el
 * riel se va llenando detrás.
 *
 * Sin números en las puntas. La inspiración los tiene y quedan bien, pero
 * acá serían inventados, y un número inventado en una tarjeta que habla de
 * resultados es exactamente lo que no.
 */
function Deslizador({ tono }: { tono: Tono }) {
  const t = tonos[tono];
  return (
    <div className="relative h-full min-h-[17rem] overflow-hidden">
      <Blob tono={tono} className="-right-28 -top-28 h-[26rem] w-[26rem]" intensidad={85} />
      <Blob tono="rosa" className="-bottom-32 left-4 h-72 w-72" intensidad={45} />

      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 sm:inset-x-10">
        {/* El riel. */}
        <div className="relative h-1.5 rounded-full" style={{ background: tinta(10) }}>
          <span
            data-lleno
            className={cn("absolute inset-y-0 left-0 w-full origin-left rounded-full", t.solido)}
            style={{ transform: "scaleX(0.14)" }}
          />
          {/* Las puntas. */}
          <span className={cn("absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full", t.solido)} />
          <span
            className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
            style={{ background: tinta(14) }}
          />

          {/* La pastilla. */}
          <span
            data-pastilla
            className={cn(
              "absolute top-1/2 flex h-11 min-w-[4.4rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 rounded-full px-4",
              t.solido,
            )}
            style={{
              left: "14%",
              color: TINTA,
              boxShadow: `0 0 0 6px color-mix(in srgb, var(--color-${tono}) 28%, transparent), 0 10px 26px -8px color-mix(in srgb, var(--color-${tono}-deep) 70%, transparent)`,
            }}
          >
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const lienzos = { cifra: Cifra, consulta: Consulta, celdas: Celdas, deslizador: Deslizador };

export function Bento() {
  const { bento } = useCopy();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduced } = context.conditions as { reduced: boolean };

          /* ---- 1. La cifra: sube de cero, y el riel se llena. ---- */
          const cifra = q("[data-cifra]")[0];
          if (cifra) {
            const texto = cifra.textContent ?? "";
            /*
               «0,9 s» o «0.9s»: el separador y el sufijo salen del copy, que
               cambia con el idioma. Se anima el número y se vuelve a armar
               con lo que había alrededor, así el resultado es exactamente el
               texto original y no una versión con el punto de otro idioma.
            */
            const m = texto.match(/^(\D*)(\d+)([.,])(\d+)(.*)$/);
            if (m && !reduced) {
              const [, antes, entero, sep, dec, despues] = m;
              const valor = Number(`${entero}.${dec}`);
              const proxy = { n: 0 };
              gsap.to(proxy, {
                n: valor,
                duration: 1.3,
                ease: "power3.out",
                scrollTrigger: { trigger: cifra, start: START, once: true },
                onUpdate: () => {
                  cifra.textContent = `${antes}${proxy.n.toFixed(dec.length).replace(".", sep)}${despues}`;
                },
              });
            }
            gsap.fromTo(
              q("[data-cifra-chip]"),
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: reduced ? 0 : 0.7, ease: "power3.out",
                scrollTrigger: { trigger: cifra, start: START, once: true } },
            );
            gsap.fromTo(
              q("[data-cifra-barra]"),
              { scaleX: 0 },
              { scaleX: 0.3, duration: reduced ? 0 : 1.3, ease: "power3.out", delay: 0.2,
                scrollTrigger: { trigger: cifra, start: START, once: true } },
            );
          }

          /* ---- 2. La consulta: se tipea, y después llega la respuesta. ---- */
          const tipeo = q("[data-tipeo]")[0];
          const respuesta = q("[data-respuesta]")[0];
          if (tipeo && respuesta) {
            const pregunta = bento.figures.seoQuestion;
            if (reduced) {
              tipeo.textContent = pregunta;
              gsap.set(respuesta, { opacity: 1 });
            } else {
              const proxy = { n: 0 };
              const tl = gsap.timeline({
                scrollTrigger: { trigger: tipeo, start: START, once: true },
              });
              tl.to(proxy, {
                n: pregunta.length,
                duration: Math.min(2.2, 0.05 * pregunta.length + 0.4),
                ease: "none",
                snap: "n",
                onUpdate: () => {
                  tipeo.textContent = pregunta.slice(0, proxy.n);
                },
              })
                .to(q("[data-caret]"), { opacity: 0, duration: 0.2 }, "+=0.35")
                .fromTo(
                  respuesta,
                  { opacity: 0, y: 10 },
                  { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                  "<",
                );
            }
          }

          /* ---- 3. Las celdas: ola de entrada, y la esfera cae encima. ---- */
          const celdas = q("[data-celda]");
          if (celdas.length) {
            if (reduced) {
              gsap.set(celdas, { opacity: 1, scale: 1 });
              gsap.set(q("[data-esfera-chica]"), { opacity: 1, scale: 1 });
            } else {
              const tl = gsap.timeline({
                scrollTrigger: { trigger: q("[data-celdas]")[0], start: START, once: true },
              });
              tl.fromTo(
                celdas,
                { opacity: 0, scale: 0.55 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.55,
                  ease: "back.out(1.6)",
                  stagger: { grid: [7, 4], from: "start", amount: 0.9 },
                },
              ).fromTo(
                q("[data-esfera-chica]"),
                { opacity: 0, scale: 0.5, y: 24 },
                { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.8)" },
                "-=0.35",
              );
            }
          }

          /* ---- 4. El deslizador: la pastilla recorre el riel. ---- */
          const pastilla = q("[data-pastilla]")[0];
          if (pastilla) {
            if (reduced) {
              gsap.set(pastilla, { left: "82%" });
              gsap.set(q("[data-lleno]"), { scaleX: 0.82 });
            } else {
              const tl = gsap.timeline({
                scrollTrigger: { trigger: pastilla, start: START, once: true },
              });
              tl.to(pastilla, { left: "82%", duration: 1.5, ease: "power3.inOut", delay: 0.15 }).to(
                q("[data-lleno]"),
                { scaleX: 0.82, duration: 1.5, ease: "power3.inOut" },
                "<",
              );
            }
          }
        },
      );
    },
    { scope, dependencies: [bento.figures.seoQuestion] },
  );

  return (
    <Section id="capacidades">
      <SectionHead
        icon="cubo"
        eyebrow={bento.eyebrow}
        title={bento.title}
        lead={bento.lead}
      />

      {/*
        Un tablero y no cuatro tarjetas sueltas.

        Las cuatro viven adentro de un mismo contenedor, separadas por una
        junta de diez píxeles del color de la página. Donde se cruzan dos
        juntas, las cuatro esquinas redondeadas que se encuentran dejan una
        muesca en forma de estrella; donde una junta muere contra el borde de
        la tarjeta vertical queda una te. No hay que dibujar nada de eso: sale
        de redondear las tarjetas y dejarlas respirar. Los radios de celda y
        tablero se llevan exactamente el padding, o las curvas no son
        paralelas.

        Tres columnas y dos filas en md: las dos chicas arriba a la izquierda,
        la vertical ocupando la columna de la derecha entera y la ancha abajo
        cruzando las dos primeras. Abajo de md se cae sola a una columna.
      */}
      <div
        ref={scope}
        className="mt-14 rounded-[var(--radius-tablero)] border border-line bg-mist p-2.5 shadow-[0_24px_60px_-40px_rgba(35,28,18,0.35)]"
      >
        <Reveal stagger className="grid gap-2.5 md:grid-cols-3">
          {bento.cards.map((card) => {
            const diseño = bentoDesign[card.id] ?? {
              tone: "aqua" as const,
              area: "",
              art: "cifra",
              layout: "arriba" as const,
            };
            const t = tonos[diseño.tone];
            const Lienzo = lienzos[diseño.art as keyof typeof lienzos] ?? Cifra;

            const texto = (
              <div className={cn("relative z-10 p-6 md:p-7", diseño.layout === "lado" && "md:flex md:flex-col md:justify-center")}>
                <span aria-hidden className={cn("block h-2 w-2 rounded-full", t.solido)} />
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.3rem]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-ink-soft">{card.body}</p>
              </div>
            );

            const dibujo = (
              <div
                data-lienzo
                className={cn(
                  diseño.layout === "arriba" && "h-[11.5rem] shrink-0",
                  diseño.layout === "abajo" && "mt-auto h-[11.5rem] shrink-0",
                  diseño.layout === "fondo" && "min-h-[22rem] flex-1",
                  diseño.layout === "lado" && "min-h-[17rem]",
                )}
              >
                <Lienzo tono={diseño.tone} figuras={bento.figures} />
              </div>
            );

            return (
              <article
                key={card.id}
                className={cn(
                  "overflow-hidden rounded-[var(--radius-celda)] bg-card",
                  diseño.layout === "lado"
                    ? "grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:items-stretch"
                    : "flex flex-col",
                  diseño.area,
                )}
              >
                {diseño.layout === "arriba" ? (
                  <>
                    {dibujo}
                    {texto}
                  </>
                ) : (
                  <>
                    {texto}
                    {dibujo}
                  </>
                )}
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
