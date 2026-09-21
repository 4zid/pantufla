"use client";

import type { ReactElement, ReactNode } from "react";

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
import { cn } from "@/lib/cn";

/**
 * Las cuatro cosas que se lleva todo sitio, cada una en una lámina.
 *
 * Cuatro tarjetas iguales en una fila —dos y dos en tablet, una debajo de
 * otra en teléfono—, y cada tarjeta es una lámina de color con una viñeta de
 * interfaz en el medio y el texto debajo, afuera de la lámina. El texto
 * afuera es lo que hace que la lámina sea una imagen y no una tarjeta con
 * cosas escritas encima: se lee el título, se mira el dibujo, y nunca
 * compiten. La lámina mide siempre 4:5 del ancho, así que el alto de la fila
 * no depende de lo que haya adentro.
 *
 * Las láminas son degradés puros, sin filtros. Cada tono tiene su propia
 * composición —de dónde entra la luz, dónde se apaga— para que las cuatro no
 * sean la misma foto en cuatro colores. Encima va un grano fino, mezclado en
 * overlay, que es lo que las hace parecer una fotografía desenfocada y no un
 * relleno de CSS. Es una textura de 160 píxeles repetida, no un blur.
 *
 * Las viñetas son quietas. Antes tenían animaciones —un termómetro que
 * subía, un chat que se tipeaba, una ventana que se angostaba— y el chat, al
 * hacer aparecer el segundo globo, cambiaba el alto de la tarjeta y corría
 * todo lo de abajo. Una viñeta es una captura: se entiende en un vistazo y no
 * le pide al visitante que espere a que termine. Lo único que se mueve es la
 * entrada escalonada al hacer scroll, que es la del resto del sitio.
 */

/** La tinta de las viñetas es fija: son imágenes, no cambian con el tema. */
const TINTA = "#121212";

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
 * Una composición por tono, capa por capa, de arriba hacia abajo. Todas
 * tienen una luz, una zona de color pleno y una sombra, pero en lugares
 * distintos: la aqua se ilumina arriba a la izquierda y se apaga abajo a la
 * derecha; la rosa al revés; la verde tiene una franja de luz en diagonal y
 * se oscurece en el pie; la miel es la más cálida y se apaga por el costado
 * derecho, casi a negro.
 */
const laminas: Record<Tone, string> = {
  aqua: [
    "radial-gradient(70% 55% at 18% 12%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    `radial-gradient(60% 55% at 90% 88%, ${sombra("aqua", 80)} 0%, transparent 70%)`,
    "radial-gradient(75% 60% at 60% 50%, var(--color-aqua) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-aqua-soft) 0%, var(--color-aqua) 55%, var(--color-aqua-deep) 130%)",
  ].join(", "),
  rosa: [
    "radial-gradient(65% 50% at 85% 10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    `radial-gradient(60% 55% at 8% 92%, ${sombra("rosa", 75)} 0%, transparent 70%)`,
    "radial-gradient(70% 60% at 45% 55%, var(--color-rosa) 0%, transparent 75%)",
    "linear-gradient(200deg, var(--color-rosa-soft) 0%, var(--color-rosa) 55%, var(--color-rosa-deep) 130%)",
  ].join(", "),
  verde: [
    "linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.9) 47%, rgba(255,255,255,0) 64%)",
    `radial-gradient(90% 45% at 50% 108%, ${sombra("verde", 90)} 0%, transparent 70%)`,
    "radial-gradient(60% 45% at 12% 8%, var(--color-verde-soft) 0%, transparent 70%)",
    "linear-gradient(180deg, var(--color-verde) 0%, var(--color-verde) 60%, var(--color-verde-deep) 120%)",
  ].join(", "),
  miel: [
    "radial-gradient(50% 42% at 18% 16%, var(--color-miel-soft) 0%, transparent 70%)",
    `radial-gradient(55% 70% at 86% 45%, ${sombra("miel", 45)} 0%, ${sombra("miel", 45)} 20%, transparent 68%)`,
    "radial-gradient(70% 60% at 40% 70%, var(--color-miel) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-miel) 0%, color-mix(in srgb, var(--color-miel) 55%, var(--color-miel-deep)) 100%)",
  ].join(", "),
};

function Lamina({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-[28px]"
      style={{ background: laminas[tone] }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: GRANO, backgroundSize: "160px 160px" }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

/**
 * El vidrio: el marco translúcido con un epígrafe arriba y, adentro, una
 * tarjeta blanca con la interfaz. El epígrafe va en el tono profundo y no en
 * blanco: sobre un vidrio pastel el blanco se lee a duras penas.
 */
function Vidrio({
  tone,
  caption,
  children,
}: {
  tone: Tone;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-[82%] max-w-[300px] rounded-[20px] border border-white/60 bg-white/35 p-2 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md">
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
    <div>
      <div className="flex items-baseline justify-between text-[0.66rem]">
        <span className="font-medium">{label}</span>
        <span className="text-[#8a8a86]">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#ededeb]">
        <div
          className={cn("h-full rounded-full", className)}
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
      <p className="text-[1.9rem] font-semibold leading-none tracking-[-0.04em]">
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
          className={cn(
            "ml-7 rounded-[12px] rounded-br-[4px] px-3 py-2",
            tonePill[tone],
          )}
        >
          {f.seoQuestion}
        </p>
        <div className="mr-5 rounded-[12px] rounded-bl-[4px] bg-[#f4f4f2] px-3 py-2">
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
        <div className="rounded-[10px] border border-[#e6e6e4] bg-[#fbfbfa] p-2">
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
        <div className="absolute -bottom-1 right-0 w-[36%] rounded-[9px] border border-[#e6e6e4] bg-white p-1.5 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.35)]">
          <div className="mx-auto h-1 w-4 rounded-full bg-[#e0e0de]" />
          <div className="mt-1.5 space-y-1">
            <div className={cn("h-6 rounded-[4px]", toneSoftBg[tone])} />
            <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-2 w-2/3 rounded-[4px] bg-[#e9e9e7]" />
          </div>
        </div>
      </div>
    </Vidrio>
  );
}

/**
 * Resultados: el formulario de contacto, con una consulta recién llegada. El
 * aviso flota sobre la esquina de abajo, al lado del botón: arriba tapaba el
 * epígrafe.
 */
function Resultados({ tone, f }: Vineta) {
  const campo = "rounded-[8px] border border-[#e6e6e4] bg-[#fbfbfa] px-2.5";
  return (
    <Vidrio tone={tone} caption={f.formCaption}>
      <div className="space-y-2">
        <div className={cn("flex h-7 items-center", campo)}>
          <span className="h-1.5 w-1/3 rounded-full bg-[#dedcdb]" />
        </div>
        <div className={cn("flex h-7 items-center", campo)}>
          <span className="h-1.5 w-1/2 rounded-full bg-[#dedcdb]" />
        </div>
        <div className={cn("h-12 pt-2.5", campo)}>
          <span className="block h-1.5 w-2/3 rounded-full bg-[#dedcdb]" />
        </div>
        <div className="flex h-8 items-center justify-center rounded-full bg-[#121212] text-[0.7rem] font-medium text-white">
          {f.formButton}
        </div>
      </div>
      <div
        className="absolute -bottom-2.5 -right-3 flex items-center gap-1.5 rounded-full border border-white/70 bg-white px-2.5 py-1.5 text-[0.64rem] font-medium shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)]"
        style={{ color: TINTA }}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", toneBg[tone])} />
        {f.formNotice}
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

  return (
    <Section id="capacidades">
      <SectionHead
        icon="cubo"
        eyebrow={bento.eyebrow}
        title={bento.title}
        lead={bento.lead}
      />

      <Reveal
        stagger
        className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4"
      >
        {bento.cards.map((card) => {
          const tone = bentoDesign[card.id]?.tone ?? "aqua";
          const Dibujo = vinetas[card.id] ?? Velocidad;
          return (
            <article key={card.id}>
              <Lamina tone={tone}>
                <Dibujo tone={tone} f={bento.figures} />
              </Lamina>
              <h3 className="mt-5 text-[1.08rem] font-semibold leading-snug tracking-[-0.02em]">
                {card.title}
              </h3>
              <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-soft">
                {card.body}
              </p>
            </article>
          );
        })}
      </Reveal>
    </Section>
  );
}
