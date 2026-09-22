"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactElement, type ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import type { SiteCopy } from "@/content/copy";
import { Section, SectionHead } from "@/components/ui/section";
import {
  toneBg,
  tonePill,
  toneSoftBg,
  toneTextDeep,
  type Tone,
} from "@/lib/tones";
import { gsap, registerGsap, ScrollTrigger, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro cosas que se lleva todo sitio, en un tablero.
 *
 * Un tablero y no cuatro tarjetas sueltas: las cuatro viven adentro de un
 * mismo contenedor, separadas por una junta de diez píxeles del color de la
 * página, y donde se cruzan dos juntas las esquinas redondeadas dejan una
 * muesca en forma de estrella. Tres columnas y dos filas desde lg, en
 * damero: arriba la chica del chat a la izquierda y la ancha de velocidad a
 * la derecha; abajo la ancha del formulario a la izquierda y la chica de las
 * pantallas a la derecha. Las dos anchas nunca quedan una sobre otra. En tablet son
 * dos columnas parejas —a tres, cada celda quedaba de 220 y el chat se
 * partía en palabras sueltas— y en teléfono, una sola.
 *
 * Cada celda es una lámina de color con el texto arriba a la izquierda y una
 * viñeta de interfaz en el resto. El texto va directo sobre la lámina, sin
 * panel: la celda es una sola pieza. Y cada lámina se ilumina arriba a la
 * izquierda, justo donde está el texto, y se apaga lejos de él.
 *
 * Las láminas son degradés puros, sin filtros. Cada tono tiene su propia
 * composición —de dónde entra la luz, dónde se apaga— para que las cuatro no
 * sean la misma foto en cuatro colores. Encima va un grano fino, mezclado en
 * overlay, que es lo que las hace parecer una fotografía desenfocada y no un
 * relleno de CSS. Es una textura de 160 píxeles repetida, no un blur.
 *
 * Se mueven dos veces y nada más. Al entrar en pantalla, el vidrio se asienta
 * y sus piezas llegan una detrás de otra: las barras se llenan, el segundo
 * globo del chat aparece después del primero, el teléfono se asoma detrás de
 * la ventana, el aviso salta. Todo por opacidad y transformación, con cada
 * pieza ya ocupando su lugar desde el primer pintado: nada cambia de alto, que
 * es lo que pasaba antes cuando el segundo globo se sumaba a la tarjeta al
 * final de la animación. Y al pasar el mouse, la lámina hace un zoom lento,
 * el vidrio se levanta y una pieza de cada celda se mueve un poco. El hover es
 * CSS puro y va en un envoltorio aparte del elemento que anima GSAP: los dos
 * escriben transform, y en el mismo elemento se pisan.
 */

/** La tinta de las láminas es fija: son imágenes, no cambian con el tema. */
const TINTA = "#121212";
const TINTA_SUAVE = "rgba(18, 18, 18, 0.72)";

type Figuras = SiteCopy["bento"]["figures"];
type Vineta = { tone: Tone; f: Figuras };

/* ------------------------------------------------------------------ */
/* Las láminas                                                         */
/* ------------------------------------------------------------------ */

/**
 * El grano: un SVG de ruido fractal de 160 × 160, repetido y mezclado en
 * overlay a un cuarto de opacidad. Con menos no se nota; con más se ve sucio.
 */
const GRANO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E")`;

/** El tono profundo apagado hacia negro: la zona de sombra de cada lámina. */
const sombra = (tone: Tone, pct: number) =>
  `color-mix(in srgb, var(--color-${tone}-deep) ${pct}%, #0e0e0e)`;

/**
 * Una composición por tono, capa por capa, de arriba hacia abajo. Todas se
 * iluminan arriba a la izquierda, donde va el texto, y se apagan lejos: la
 * aqua abajo a la derecha, la rosa abajo a la izquierda, la verde en el pie
 * con una franja de luz cruzándola en diagonal, y la miel por el costado
 * derecho, casi a negro, detrás de la viñeta. En las dos anchas la viñeta va a
 * la derecha, sobre la zona apagada, y el texto a la izquierda, sobre la luz.
 */
const laminas: Record<Tone, string> = {
  aqua: [
    "radial-gradient(70% 55% at 14% 10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    `radial-gradient(60% 55% at 90% 92%, ${sombra("aqua", 80)} 0%, transparent 70%)`,
    "radial-gradient(75% 60% at 60% 55%, var(--color-aqua) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-aqua-soft) 0%, var(--color-aqua) 55%, var(--color-aqua-deep) 130%)",
  ].join(", "),
  rosa: [
    "radial-gradient(70% 50% at 16% 8%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    `radial-gradient(60% 55% at 8% 96%, ${sombra("rosa", 75)} 0%, transparent 70%)`,
    "radial-gradient(70% 60% at 55% 60%, var(--color-rosa) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-rosa-soft) 0%, var(--color-rosa) 55%, var(--color-rosa-deep) 130%)",
  ].join(", "),
  verde: [
    "linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.9) 49%, rgba(255,255,255,0) 64%)",
    `radial-gradient(90% 40% at 50% 108%, ${sombra("verde", 90)} 0%, transparent 70%)`,
    "radial-gradient(70% 40% at 12% 6%, var(--color-verde-soft) 0%, transparent 70%)",
    "linear-gradient(180deg, var(--color-verde) 0%, var(--color-verde) 60%, var(--color-verde-deep) 120%)",
  ].join(", "),
  miel: [
    "radial-gradient(45% 60% at 12% 14%, var(--color-miel-soft) 0%, transparent 70%)",
    `radial-gradient(40% 80% at 90% 50%, ${sombra("miel", 45)} 0%, ${sombra("miel", 45)} 20%, transparent 68%)`,
    "radial-gradient(60% 70% at 45% 70%, var(--color-miel) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-miel) 0%, color-mix(in srgb, var(--color-miel) 55%, var(--color-miel-deep)) 100%)",
  ].join(", "),
};

/**
 * El vidrio: el marco translúcido con un epígrafe arriba y, adentro, una
 * tarjeta blanca con la interfaz. El epígrafe va en el tono profundo y no en
 * blanco: sobre un vidrio pastel el blanco se lee a duras penas.
 *
 * Dos envoltorios: el de afuera lleva el hover (CSS) y el de adentro la
 * entrada (GSAP). Ver el comentario de arriba.
 */
function Vidrio({
  tone,
  caption,
  className,
  children,
}: {
  tone: Tone;
  caption: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-[86%] max-w-[300px] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]",
        className,
      )}
    >
      <div
        data-vidrio
        className="relative rounded-[20px] border border-white/60 bg-white/35 p-2 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md"
      >
        <p
          className={cn(
            "px-2 pb-2 pt-1 text-center text-[0.7rem] font-medium",
            toneTextDeep[tone],
          )}
        >
          {caption}
        </p>
        <div
          className="rounded-[13px] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          style={{ color: TINTA }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Las viñetas                                                         */
/* ------------------------------------------------------------------ */

/** «0,9 s» o «0.9s»: el número que hay adentro, en cualquiera de los dos idiomas. */
function numero(texto: string) {
  const m = texto.replace(",", ".").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function Barra({
  label,
  value,
  pct,
  className,
}: {
  label: string;
  value: string;
  pct: number;
  className: string;
}) {
  return (
    <div data-pieza>
      <div className="flex items-baseline justify-between text-[0.66rem]">
        <span className="font-medium">{label}</span>
        <span className="text-[#8a8a86]">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#ededeb]">
        <div
          data-lleno
          className={cn("h-full origin-left rounded-full", className)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Velocidad: el tiempo grande y, debajo, la comparación en dos barras. */
function Velocidad({ tone, f }: Vineta) {
  const nuestro = numero(f.speedOurs);
  const suyo = numero(f.speedTheirs);
  const pct =
    nuestro && suyo
      ? Math.max(8, Math.min(100, Math.round((nuestro / suyo) * 100)))
      : 30;
  return (
    <Vidrio tone={tone} caption={f.speedCaption}>
      <p
        data-pieza
        data-cifra
        className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em] tabular-nums"
      >
        {f.speedOurs}
      </p>
      <div className="mt-4 space-y-2.5">
        <Barra
          label={f.speedLabelOurs}
          value={f.speedOurs}
          pct={pct}
          className={toneBg[tone]}
        />
        <Barra
          label={f.speedLabelTheirs}
          value={f.speedTheirs}
          pct={100}
          className="bg-[#c9c9c6]"
        />
      </div>
    </Vidrio>
  );
}

function Chispa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M8 1c.6 3.6 3.4 6.4 7 7-3.6.6-6.4 3.4-7 7-.6-3.6-3.4-6.4-7-7 3.6-.6 6.4-3.4 7-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** SEO: la pregunta que alguien le hace a un modelo y lo que el modelo contesta. */
function Seo({ tone, f }: Vineta) {
  return (
    <Vidrio tone={tone} caption={f.seoCaption}>
      <div className="space-y-2 text-[0.72rem] leading-snug">
        <p
          data-pieza
          className={cn(
            "ml-7 rounded-[12px] rounded-br-[4px] px-3 py-2",
            tonePill[tone],
          )}
        >
          {f.seoQuestion}
        </p>
        <div
          data-pieza
          className="mr-5 rounded-[12px] rounded-bl-[4px] bg-[#f4f4f2] px-3 py-2 transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
        >
          <p className="flex items-center gap-1 text-[0.6rem] font-medium text-[#8a8a86]">
            <Chispa className="h-2.5 w-2.5" />
            ChatGPT
          </p>
          <p className="mt-1">{f.seoAnswer}</p>
        </div>
      </div>
    </Vidrio>
  );
}

/** Pantallas: la misma página en una ventana y en un teléfono, ya reacomodada. */
function Pantallas({ tone, f }: Vineta) {
  const bloque = "rounded-[5px] bg-[#e9e9e7]";
  return (
    <Vidrio tone={tone} caption={f.screensCaption}>
      <div className="relative pb-4 pr-6">
        <div
          data-pieza
          className="rounded-[10px] border border-[#e6e6e4] bg-[#fbfbfa] p-2"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d9d9d6]" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-[1.5fr_1fr] gap-1.5">
            <div className={cn("h-10 rounded-[5px]", toneSoftBg[tone])} />
            <div className={cn("h-10", bloque)} />
            <div className={cn("h-3", bloque)} />
            <div className={cn("h-3", bloque)} />
            <div className={cn("col-span-2 h-3", bloque)} />
          </div>
        </div>
        {/* El teléfono se asoma al pasar el mouse: se corre y se inclina apenas. */}
        <div className="absolute -bottom-1 right-0 w-[36%] transition-transform duration-500 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:-rotate-3">
          <div
            data-telefono
            className="rounded-[9px] border border-[#e6e6e4] bg-white p-1.5 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.35)]"
          >
            <div className="mx-auto h-1 w-4 rounded-full bg-[#e0e0de]" />
            <div className="mt-1.5 space-y-1">
              <div className={cn("h-6 rounded-[4px]", toneSoftBg[tone])} />
              <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
              <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
              <div className="h-2 w-2/3 rounded-[4px] bg-[#e9e9e7]" />
            </div>
          </div>
        </div>
      </div>
    </Vidrio>
  );
}

/**
 * Resultados: el formulario de contacto, con una consulta recién llegada. El
 * aviso flota sobre la esquina de abajo, al lado del botón, y al pasar el
 * mouse se levanta y se ladea, como una notificación que acaba de caer.
 */
function Resultados({ tone, f }: Vineta) {
  const campo = "rounded-[8px] border border-[#e6e6e4] bg-[#fbfbfa] px-2.5";
  return (
    <Vidrio tone={tone} caption={f.formCaption}>
      <div className="space-y-2">
        <div data-pieza className={cn("flex h-7 items-center", campo)}>
          <span className="h-1.5 w-1/3 rounded-full bg-[#dedcdb]" />
        </div>
        <div data-pieza className={cn("flex h-7 items-center", campo)}>
          <span className="h-1.5 w-1/2 rounded-full bg-[#dedcdb]" />
        </div>
        <div data-pieza className={cn("h-12 pt-2.5", campo)}>
          <span className="block h-1.5 w-2/3 rounded-full bg-[#dedcdb]" />
        </div>
        <div
          data-pieza
          className="flex h-8 items-center justify-center rounded-full bg-[#121212] text-[0.7rem] font-medium text-white"
        >
          {f.formButton}
        </div>
      </div>
      <div className="absolute -bottom-2.5 -right-3 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-3 group-hover:scale-105">
        <div
          data-pop
          className="flex items-center gap-1.5 rounded-full border border-white/70 bg-white px-2.5 py-1.5 text-[0.64rem] font-medium shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)]"
          style={{ color: TINTA }}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", toneBg[tone])} />
          {f.formNotice}
        </div>
      </div>
    </Vidrio>
  );
}

const vinetas: Record<string, (p: Vineta) => ReactElement> = {
  velocidad: Velocidad,
  seo: Seo,
  pantallas: Pantallas,
  resultados: Resultados,
};

/* ------------------------------------------------------------------ */
/* La sección                                                          */
/* ------------------------------------------------------------------ */

export function Bento() {
  const { bento } = useCopy();
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
          // Sin movimiento no hay nada que esconder: las piezas ya están en
          // su lugar desde el servidor.
          if (reduced) return;

          gsap.utils
            .selector(root)("[data-celda]")
            .forEach((celda) => {
              const q = gsap.utils.selector(celda);
              const tl = gsap.timeline({
                scrollTrigger: { trigger: celda, start: START, once: true },
                defaults: { ease: "power3.out" },
              });

              // El vidrio se asienta.
              tl.fromTo(
                q("[data-vidrio]"),
                { y: 24, scale: 0.96, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, duration: 0.8, delay: 0.2 },
              );
              // Las piezas llegan una detrás de otra.
              tl.fromTo(
                q("[data-pieza]"),
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.14 },
                "-=0.4",
              );
              // Las barras se llenan.
              tl.fromTo(
                q("[data-lleno]"),
                { scaleX: 0 },
                { scaleX: 1, duration: 0.9, stagger: 0.14 },
                "-=0.3",
              );
              // El teléfono se asoma desde atrás de la ventana.
              tl.fromTo(
                q("[data-telefono]"),
                { x: -18, y: 12, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.6 },
                "-=0.2",
              );
              // El aviso salta.
              tl.fromTo(
                q("[data-pop]"),
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.2)" },
                "-=0.1",
              );

              /*
               El número cuenta hasta su valor. «0,9 s» o «0.9s»: separador y
               sufijo salen del copy y se vuelven a armar, así el resultado es
               el texto original de cada idioma. Con cifras tabulares el ancho
               no cambia mientras cuenta.
            */
              const cifra = q("[data-cifra]")[0];
              const m = cifra?.textContent?.match(
                /^(\D*)(\d+)([.,])(\d+)(.*)$/,
              );
              if (cifra && m) {
                const [, antes, entero, sep, dec, despues] = m;
                const valor = Number(`${entero}.${dec}`);
                const proxy = { n: 0 };
                tl.to(
                  proxy,
                  {
                    n: valor,
                    duration: 1.1,
                    onUpdate: () => {
                      cifra.textContent = `${antes}${proxy.n.toFixed(dec.length).replace(".", sep)}${despues}`;
                    },
                  },
                  0.3,
                );
              }
            });
        },
      );
    },
    { scope, dependencies: [bento.figures.speedOurs] },
  );

  return (
    <Section id="capacidades">
      <SectionHead
        icon="cubo"
        eyebrow={bento.eyebrow}
        title={bento.title}
        lead={bento.lead}
      />

      <div
        ref={scope}
        className="mt-14 rounded-[var(--radius-tablero)] border border-line bg-mist p-2.5 shadow-[0_24px_60px_-40px_rgba(35,28,18,0.35)]"
      >
        <Reveal stagger className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {bento.cards.map((card) => {
            const diseño = bentoDesign[card.id] ?? {
              tone: "aqua" as const,
              area: "",
              shape: "chica" as const,
            };
            const Dibujo = vinetas[card.id] ?? Velocidad;
            const ancha = diseño.shape === "ancha";
            return (
              <article
                key={card.id}
                data-celda
                className={cn(
                  "group relative overflow-hidden rounded-[var(--radius-celda)]",
                  "md:min-h-[24rem]",
                  diseño.area,
                )}
              >
                {/* La lámina y el grano, debajo de todo. El zoom del hover va acá. */}
                <div
                  aria-hidden
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: laminas[diseño.tone] }}
                >
                  <span
                    className="absolute inset-0 opacity-25 mix-blend-overlay"
                    style={{
                      backgroundImage: GRANO,
                      backgroundSize: "160px 160px",
                    }}
                  />
                </div>

                <div
                  className={cn(
                    "relative flex h-full flex-col p-6 md:p-7",
                    ancha && "lg:flex-row lg:items-center lg:gap-6",
                  )}
                >
                  <div className={cn(ancha && "lg:w-[46%] lg:shrink-0")}>
                    <h3
                      className="text-[1.12rem] font-semibold leading-snug tracking-[-0.02em]"
                      style={{ color: TINTA }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed"
                      style={{ color: TINTA_SUAVE }}
                    >
                      {card.body}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex flex-1 items-center justify-center pt-8 md:pt-6",
                      ancha && "lg:pt-0",
                    )}
                  >
                    <Dibujo tone={diseño.tone} f={bento.figures} />
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
