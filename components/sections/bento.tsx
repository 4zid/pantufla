"use client";

import { useGSAP } from "@gsap/react";
import { useId, useRef, type ReactElement, type ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import type { SiteCopy } from "@/content/copy";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import { toneSoftBg, toneTextDeep, type Tone } from "@/lib/tones";
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
 * viñeta en el resto. El texto va directo sobre la lámina, sin panel: la
 * celda es una sola pieza. Y cada lámina se ilumina arriba a la izquierda,
 * justo donde está el texto, y se apaga lejos de él.
 *
 * Las láminas son degradés puros, sin filtros. Cada tono tiene su propia
 * composición —de dónde entra la luz, dónde se apaga— para que las cuatro no
 * sean la misma foto en cuatro colores. Encima va un grano fino, mezclado en
 * overlay, que es lo que las hace parecer una fotografía desenfocada y no un
 * relleno de CSS. Es una textura de 160 píxeles repetida, no un blur.
 *
 * Las viñetas no van encerradas en un marco: cada una es una cosa distinta
 * dibujada suelta sobre la lámina, y las cuatro son distintas entre sí. Una
 * regla de tiempo que entra y sale del cuadro, con el número grande arriba.
 * Una pila de tarjetas colapsadas, de la que solo se lee la de adelante. Una
 * ventana y un teléfono cortados por el borde de la celda. Y unas barras
 * paradas sobre una línea que también se va de cuadro, con un aviso flotando
 * sobre la última. Cuatro tarjetas iguales con una interfaz adentro eran
 * cuatro veces la misma idea; esto son cuatro ideas.
 *
 * Se mueven dos veces y nada más. Al entrar en pantalla, cada viñeta llega
 * de a piezas: la regla se traza, la pila cae de atrás para adelante, la
 * ventana entra de costado y el teléfono sube, las barras crecen y el aviso
 * salta. Todo por opacidad y transformación, con cada pieza ya ocupando su
 * lugar desde el primer pintado: nada cambia de alto. Y al pasar el mouse,
 * la lámina hace un zoom lento y una pieza de cada viñeta se mueve un poco.
 * El hover es CSS puro y va en un envoltorio aparte del elemento que anima
 * GSAP: los dos escriben transform, y en el mismo elemento se pisan.
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
 * derecho, detrás de la viñeta. En las dos anchas la viñeta va a la derecha,
 * sobre la zona apagada, y el texto a la izquierda, sobre la luz. Las sombras
 * de la aqua y la miel se quedan a mitad de camino del negro: encima va tinta
 * dibujada, y sobre un pozo negro la tinta desaparece.
 */
const laminas: Record<Tone, string> = {
  aqua: [
    "radial-gradient(70% 55% at 14% 10%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    `radial-gradient(52% 48% at 94% 96%, ${sombra("aqua", 88)} 0%, transparent 70%)`,
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
    `radial-gradient(36% 70% at 96% 42%, ${sombra("miel", 64)} 0%, ${sombra("miel", 64)} 15%, transparent 68%)`,
    "radial-gradient(60% 70% at 45% 70%, var(--color-miel) 0%, transparent 75%)",
    "linear-gradient(160deg, var(--color-miel) 0%, color-mix(in srgb, var(--color-miel) 55%, var(--color-miel-deep)) 100%)",
  ].join(", "),
};

/* ------------------------------------------------------------------ */
/* Las viñetas                                                         */
/* ------------------------------------------------------------------ */

/** «0,9 s» o «0.9s»: el número que hay adentro, en cualquiera de los dos idiomas. */
function numero(texto: string) {
  const m = texto.replace(",", ".").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

/** El tono profundo, como color CSS. */
const profundo = (tone: Tone) => `var(--color-${tone}-deep)`;

/**
 * Un halo blanco que se apaga —la luz alrededor de un punto— y un trazo de
 * tinta que aparece de a poco desde la izquierda, para las líneas que vienen
 * de fuera de cuadro: en las celdas anchas la viñeta arranca a mitad de la
 * celda y una línea que empezara ahí de golpe se vería cortada.
 */
function Degrades({ halo, entrada }: { halo: string; entrada: string }) {
  return (
    <defs>
      <radialGradient id={halo}>
        <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="55%" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient
        id={entrada}
        gradientUnits="userSpaceOnUse"
        x1="-120"
        x2="10"
        y1="0"
        y2="0"
      >
        <stop offset="0%" stopColor={TINTA} stopOpacity="0" />
        <stop offset="100%" stopColor={TINTA} stopOpacity="1" />
      </linearGradient>
    </defs>
  );
}

/** El rótulo chico de una viñeta, arriba a la izquierda. */
function Rotulo({ children }: { children: ReactNode }) {
  return (
    <p
      data-pieza
      className="text-[0.7rem] font-medium tracking-[-0.01em]"
      style={{ color: TINTA_SUAVE }}
    >
      {children}
    </p>
  );
}

/**
 * Velocidad: el tiempo grande y, debajo, una regla de segundos que entra por
 * la izquierda y sale por la derecha del cuadro. Un trazo grueso llega hasta
 * nuestro tiempo y termina en un punto encendido; de ahí sigue punteado,
 * apagado, hasta el promedio. La regla se dibuja hasta el segundo entero que
 * sigue al número más alto, así sirve para cualquier par de valores.
 */
function Velocidad({ tone, f }: Vineta) {
  const halo = useId();
  const entrada = useId();
  const nuestro = numero(f.speedOurs);
  const suyo = numero(f.speedTheirs);
  const tope = Math.max(1, Math.ceil(Math.max(nuestro, suyo)));
  const x = (seg: number) => 14 + (seg / tope) * 286;
  const marcas = Array.from({ length: tope + 1 }, (_, i) => i);
  const Y = 60;
  return (
    <div className="w-full max-w-[360px]">
      <Rotulo>{f.speedCaption}</Rotulo>
      <p
        data-pieza
        data-cifra
        className="mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.04em] tabular-nums"
        style={{ color: TINTA }}
      >
        {f.speedOurs}
      </p>
      <svg
        viewBox="0 0 320 92"
        className="mt-5 w-full overflow-visible"
        aria-hidden="true"
      >
        <Degrades halo={halo} entrada={entrada} />
        <line
          x1="-120"
          x2="440"
          y1={Y}
          y2={Y}
          stroke={`url(#${entrada})`}
          strokeOpacity="0.25"
        />
        {marcas.map((seg) => (
          <g key={seg}>
            <line
              x1={x(seg)}
              x2={x(seg)}
              y1="4"
              y2={Y}
              stroke={TINTA}
              strokeOpacity="0.22"
              strokeDasharray="2 4"
            />
            <text
              x={x(seg)}
              y={Y + 20}
              textAnchor="middle"
              fontSize="10"
              fill={TINTA}
              fillOpacity="0.7"
            >
              {seg} s
            </text>
          </g>
        ))}
        {/* El promedio: punteado y apagado, del punto nuestro hasta el suyo. */}
        <line
          data-pieza
          x1={x(nuestro)}
          x2={x(suyo)}
          y1={Y}
          y2={Y}
          stroke={TINTA}
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
        <circle
          data-pieza
          cx={x(suyo)}
          cy={Y}
          r="4"
          fill="none"
          stroke={TINTA}
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />
        <text
          data-pieza
          x={x(suyo)}
          y={Y - 16}
          textAnchor="middle"
          fontSize="10"
          fill={TINTA}
          fillOpacity="0.75"
        >
          {f.speedLabelTheirs} · {f.speedTheirs}
        </text>
        {/* El nuestro: un trazo grueso desde fuera de cuadro hasta el punto. */}
        <line
          data-lleno
          x1="-120"
          x2={x(nuestro)}
          y1={Y}
          y2={Y}
          stroke={`url(#${entrada})`}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <g
          className="origin-center transition-transform duration-500 ease-out group-hover:scale-125"
          style={{ transformBox: "fill-box" }}
        >
          <g data-punto>
            <circle cx={x(nuestro)} cy={Y} r="18" fill={`url(#${halo})`} />
            <circle
              cx={x(nuestro)}
              cy={Y}
              r="6.5"
              fill={profundo(tone)}
              stroke="#fff"
              strokeWidth="2.5"
            />
          </g>
        </g>
        <text
          data-pieza
          x={x(nuestro)}
          y={Y - 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill={TINTA}
        >
          {f.speedLabelOurs}
        </text>
      </svg>
    </div>
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

/**
 * SEO: una pila de respuestas. Se lee la de adelante —la pregunta y lo que
 * contesta ChatGPT— y de las de atrás asoma solo el borde, cada una un poco
 * más angosta y más apagada. Debajo, tres líneas punteadas: sigue habiendo
 * más. Al pasar el mouse la pila se abre un poco.
 */
function Seo({ tone, f }: Vineta) {
  const fondo = (
    <div className="flex items-center gap-1.5 px-3.5 pt-3">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: TINTA, opacity: 0.25 }}
      />
      <span
        className="h-1.5 w-1/3 rounded-full"
        style={{ background: TINTA, opacity: 0.12 }}
      />
    </div>
  );
  return (
    <div className="w-full max-w-[340px]">
      <div className="relative pt-6">
        <div className="absolute left-[12%] top-0 w-[76%] transition-transform duration-500 ease-out group-hover:-translate-y-2.5">
          <div data-carta className="h-11 rounded-[14px] bg-white/55">
            {fondo}
          </div>
        </div>
        <div className="absolute left-[6%] top-3 w-[88%] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div
            data-carta
            className="h-11 rounded-[14px] bg-white/80 shadow-[0_6px_16px_-12px_rgba(0,0,0,0.3)]"
          >
            {fondo}
          </div>
        </div>
        <div className="relative">
          <div
            data-carta
            className="rounded-[14px] bg-white p-3.5 shadow-[0_18px_36px_-20px_rgba(0,0,0,0.4)]"
          >
            <p
              className={cn(
                "flex items-center gap-1 text-[0.62rem] font-medium",
                toneTextDeep[tone],
              )}
            >
              <Chispa className="h-2.5 w-2.5" />
              {f.seoCaption}
            </p>
            <p className="mt-1.5 text-[0.68rem] leading-snug text-[#8a8a86]">
              {f.seoQuestion}
            </p>
            <p
              className="mt-1.5 text-[0.8rem] font-medium leading-snug"
              style={{ color: TINTA }}
            >
              {f.seoAnswer}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {["70%", "100%", "55%"].map((ancho) => (
          <span
            key={ancho}
            data-pieza
            className="block border-t border-dashed"
            style={{ width: ancho, borderColor: "rgba(18, 18, 18, 0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Pantallas: la misma página en una ventana y en un teléfono, sin marco
 * alrededor. La ventana se va por el borde derecho de la celda y el
 * teléfono, adelante e inclinado, por el de abajo: la celda los corta, y eso
 * es lo que los hace parecer más grandes que el cuadro. Al pasar el mouse el
 * teléfono se levanta y se endereza un poco.
 */
function Pantallas({ tone }: Vineta) {
  const bloque = "rounded-[5px] bg-[#e9e9e7]";
  return (
    <div className="relative h-[12rem] w-full">
      <div className="absolute left-0 top-0 w-[124%] transition-transform duration-500 ease-out group-hover:-translate-x-1">
        <div
          data-ventana
          className="rounded-[12px] bg-white p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d9d9d6]" />
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-[1.4fr_1fr_1fr] gap-1.5">
            <div
              className={cn(
                "row-span-2 h-[4.5rem] rounded-[5px]",
                toneSoftBg[tone],
              )}
            />
            <div className={cn("h-8", bloque)} />
            <div className={cn("h-8", bloque)} />
            <div className={cn("h-8", bloque)} />
            <div className={cn("h-8", bloque)} />
            <div className={cn("col-span-3 h-3", bloque)} />
            <div className={cn("col-span-2 h-3", bloque)} />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-20 left-[4%] w-[38%] -rotate-[6deg] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-[3deg]">
        <div
          data-telefono
          className="rounded-[18px] border-[3px] border-[#1c1c1c] bg-white p-1.5 shadow-[0_22px_44px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="mx-auto mt-0.5 h-1 w-5 rounded-full bg-[#1c1c1c]" />
          <div className="mt-2 space-y-1.5">
            <div className={cn("h-12 rounded-[6px]", toneSoftBg[tone])} />
            <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-2 w-2/3 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-9 rounded-[6px] bg-[#e9e9e7]" />
            <div className="h-2 rounded-[4px] bg-[#e9e9e7]" />
            <div className="h-2 w-4/5 rounded-[4px] bg-[#e9e9e7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Resultados: las consultas que fueron llegando desde que el sitio se
 * publicó, en barras paradas sobre una línea que se va de cuadro por los dos
 * lados. Las barras de atrás van apagadas y la última, la de hoy, en el tono
 * de la celda y encendida; sobre ella flota el aviso de que acaba de llegar
 * otra. Al pasar el mouse la última crece un poco y el aviso se levanta.
 */
const ALTURAS = [16, 24, 20, 32, 38, 34, 50, 58, 66, 88];

function Resultados({ tone, f }: Vineta) {
  const halo = useId();
  const entrada = useId();
  const ANCHO = 14;
  const PASO = 30;
  const X0 = 8;
  const BASE = 112;
  const ultima = ALTURAS.length - 1;
  const cx = (i: number) => X0 + i * PASO + ANCHO / 2;
  return (
    <div className="relative w-full max-w-[360px]">
      <Rotulo>{f.leadsCaption}</Rotulo>
      <svg
        viewBox="0 0 320 132"
        className="mt-3 w-full overflow-visible"
        aria-hidden="true"
      >
        <Degrades halo={halo} entrada={entrada} />
        <line
          x1="-120"
          x2="440"
          y1={BASE}
          y2={BASE}
          stroke={`url(#${entrada})`}
          strokeOpacity="0.25"
        />
        <circle
          data-pieza
          cx={cx(ultima)}
          cy={BASE - ALTURAS[ultima]}
          r="26"
          fill={`url(#${halo})`}
        />
        {ALTURAS.map((alto, i) =>
          i === ultima ? (
            <g
              key={i}
              className="origin-bottom transition-transform duration-500 ease-out group-hover:scale-y-110"
              style={{ transformBox: "fill-box" }}
            >
              <rect
                data-barra
                x={X0 + i * PASO}
                y={BASE - alto}
                width={ANCHO}
                height={alto}
                rx={ANCHO / 2}
                fill={profundo(tone)}
              />
            </g>
          ) : (
            <rect
              key={i}
              data-barra
              x={X0 + i * PASO}
              y={BASE - alto}
              width={ANCHO}
              height={alto}
              rx={ANCHO / 2}
              fill={TINTA}
              fillOpacity={0.18 + i * 0.04}
            />
          ),
        )}
        <text
          data-pieza
          x={X0}
          y={BASE + 18}
          fontSize="10"
          fill={TINTA}
          fillOpacity="0.7"
        >
          {f.leadsStart}
        </text>
        <text
          data-pieza
          x={X0 + ultima * PASO + ANCHO}
          y={BASE + 18}
          textAnchor="end"
          fontSize="10"
          fill={TINTA}
          fillOpacity="0.7"
        >
          {f.leadsEnd}
        </text>
      </svg>
      <div className="absolute right-[-4%] top-[22%] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-3 group-hover:scale-105">
        <div
          data-pop
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[0.66rem] font-medium shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)]"
          style={{ color: TINTA }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: profundo(tone) }}
          />
          {f.formNotice}
        </div>
      </div>
    </div>
  );
}

/** Qué dibuja cada celda y si la viñeta va pegada abajo (para que se corte). */
const vinetas: Record<
  string,
  { Dibujo: (p: Vineta) => ReactElement; abajo?: boolean }
> = {
  velocidad: { Dibujo: Velocidad },
  seo: { Dibujo: Seo },
  pantallas: { Dibujo: Pantallas, abajo: true },
  resultados: { Dibujo: Resultados },
};

/* ------------------------------------------------------------------ */
/* La sección                                                          */
/* ------------------------------------------------------------------ */

export function Bento({ surface }: { surface?: Surface }) {
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

              // Las piezas sueltas llegan una detrás de otra.
              tl.fromTo(
                q("[data-pieza]"),
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.15 },
              );
              // La pila cae de atrás para adelante.
              tl.fromTo(
                q("[data-carta]"),
                { y: -16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, stagger: 0.14 },
                "<0.1",
              );
              // La regla se traza desde fuera de cuadro.
              tl.fromTo(
                q("[data-lleno]"),
                { scaleX: 0, transformOrigin: "0% 50%" },
                { scaleX: 1, duration: 0.9 },
                "<0.1",
              );
              // Las barras crecen desde la línea.
              tl.fromTo(
                q("[data-barra]"),
                { scaleY: 0, transformOrigin: "50% 100%" },
                { scaleY: 1, duration: 0.7, stagger: 0.06 },
                "<",
              );
              // La ventana entra de costado y el teléfono sube desde abajo.
              tl.fromTo(
                q("[data-ventana]"),
                { x: 28, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.7 },
                "<",
              );
              tl.fromTo(
                q("[data-telefono]"),
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                "<0.15",
              );
              // El punto se enciende y el aviso salta.
              tl.fromTo(
                q("[data-punto]"),
                { scale: 0, transformOrigin: "50% 50%" },
                { scale: 1, duration: 0.5, ease: "back.out(2.2)" },
                "-=0.25",
              );
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
    <Section id="capacidades" surface={surface}>
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
            const { Dibujo, abajo } = vinetas[card.id] ?? vinetas.velocidad;
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
                      "flex flex-1 justify-center pt-8 md:pt-6",
                      abajo ? "items-end" : "items-center",
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
