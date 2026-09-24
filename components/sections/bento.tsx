"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactElement } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import type { SiteCopy } from "@/content/copy";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import { tonePill, toneSoftBg, toneTextDeep, type Tone } from "@/lib/tones";
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
 * Las cuatro viñetas son cuatro cosas distintas, y solo una va en un marco.
 * Velocidad: el texto arriba y, en el pie de la celda, una regla de segundos
 * que la cruza entera y se va de cuadro por los dos lados, con el número
 * grande arriba a la derecha. SEO: un chat suelto sobre la lámina, la
 * pregunta a la derecha y la respuesta a la izquierda, con el «escribiendo»
 * en el medio. Pantallas: una ventana y un teléfono cortados por el borde de
 * la celda. Resultados: una tarjeta blanca con las consultas en barras, y el
 * aviso de la nueva pisando su esquina. Cuatro tarjetas iguales con una
 * interfaz adentro eran cuatro veces la misma idea; esto son cuatro ideas, y
 * la tarjeta, que es una sola, vuelve a ser una tarjeta.
 *
 * Se mueven dos veces y nada más. Al entrar en pantalla, cada viñeta tiene su
 * propia coreografía (ver `entrada` en cada una): la regla se traza y el
 * número cuenta; la pregunta llega, ChatGPT escribe un rato y contesta; la
 * ventana entra de costado y el teléfono sube; la tarjeta se asienta, las
 * barras crecen y el aviso salta. Todo por opacidad y transformación, con
 * cada pieza ya ocupando su lugar desde el primer pintado: nada cambia de
 * alto, ni siquiera cuando el «escribiendo» se vuelve respuesta, porque la
 * respuesta ya está ahí, invisible, y el «escribiendo» va encima. Y al pasar
 * el mouse, la lámina hace un zoom lento y una pieza de cada viñeta se mueve
 * un poco. El hover es CSS puro y va en un envoltorio aparte del elemento
 * que anima GSAP: los dos escriben transform, y en el mismo elemento se
 * pisan.
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

/** Tinta a una opacidad. */
const tinta = (alfa: number) => `rgba(18, 18, 18, ${alfa})`;

/** La entrada de una viñeta: lo que cada una hace con su línea de tiempo. */
type Entrada = (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void;

/**
 * Velocidad: la regla de segundos. Cruza la celda entera por el pie y se va
 * de cuadro por los dos lados; un trazo grueso llega hasta nuestro tiempo y
 * termina en un punto encendido, y de ahí sigue punteado y apagado hasta el
 * promedio. El número grande va arriba a la derecha en escritorio, frente al
 * título, y arriba de la regla cuando la celda es angosta. La regla llega
 * hasta el segundo entero que sigue al número más alto, así sirve para
 * cualquier par de valores.
 *
 * Es HTML con posiciones en porcentaje y no un SVG: un SVG escalado al ancho
 * de la celda agranda también los textos y los grosores, y acá el ancho va
 * de 300 a 700 píxeles.
 */
function Velocidad({ tone, f }: Vineta) {
  const nuestro = numero(f.speedOurs);
  const suyo = numero(f.speedTheirs);
  const tope = Math.max(1, Math.ceil(Math.max(nuestro, suyo)));
  const x = (seg: number) => 6 + (seg / tope) * 82;
  const marcas = Array.from({ length: tope + 1 }, (_, i) => i);
  const etiqueta = "absolute -translate-x-1/2 whitespace-nowrap text-[0.68rem]";
  return (
    <div className="w-full">
      <div className="lg:absolute lg:right-7 lg:top-7 lg:text-right">
        <p
          data-pieza
          className="text-[0.7rem] font-medium"
          style={{ color: TINTA_SUAVE }}
        >
          {f.speedCaption}
        </p>
        <p
          data-pieza
          data-cifra
          className="mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.04em] tabular-nums"
          style={{ color: TINTA }}
        >
          {f.speedOurs}
        </p>
      </div>

      <div className="relative mt-7 h-[5.75rem] w-full lg:mt-0">
        {/* La línea de base, de borde a borde, apareciendo desde la izquierda. */}
        <span
          className="absolute -left-12 -right-12 top-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${tinta(0.28)} 10%, ${tinta(0.28)})`,
          }}
        />
        {marcas.map((seg) => (
          <span
            key={seg}
            className="absolute bottom-1/2 top-1 border-l border-dashed"
            style={{ left: `${x(seg)}%`, borderColor: tinta(0.28) }}
          >
            <span
              className={cn(etiqueta, "left-0 top-[calc(100%+0.55rem)]")}
              style={{ color: tinta(0.7) }}
            >
              {seg} s
            </span>
          </span>
        ))}
        {/* El promedio: punteado y apagado, del punto nuestro hasta el suyo. */}
        <span
          data-pieza
          className="absolute top-1/2 border-t-2 border-dotted"
          style={{
            left: `${x(nuestro)}%`,
            width: `${x(suyo) - x(nuestro)}%`,
            borderColor: tinta(0.45),
          }}
        />
        <span
          data-pieza
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]"
          style={{ left: `${x(suyo)}%`, borderColor: tinta(0.7) }}
        />
        <span
          data-pieza
          className={cn(etiqueta, "bottom-[calc(50%+0.8rem)]")}
          style={{ left: `${x(suyo)}%`, color: tinta(0.75) }}
        >
          {f.speedLabelTheirs} · {f.speedTheirs}
        </span>
        {/* El nuestro: un trazo grueso desde fuera de cuadro hasta el punto. */}
        <span
          data-lleno
          className="absolute -left-12 top-1/2 h-[5px] -translate-y-1/2 rounded-full"
          style={{
            width: `calc(${x(nuestro)}% + 3rem)`,
            background: `linear-gradient(90deg, transparent, ${TINTA} 22%, ${TINTA})`,
          }}
        />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out group-hover:scale-125"
          style={{ left: `${x(nuestro)}%` }}
        >
          <span data-punto className="relative block h-4 w-4">
            <span
              className="absolute -inset-4 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0.25) 55%, transparent 72%)",
              }}
            />
            <span
              className="absolute inset-0 rounded-full border-[2.5px] border-white"
              style={{ background: profundo(tone) }}
            />
          </span>
        </span>
        <span
          data-pieza
          className={cn(etiqueta, "bottom-[calc(50%+0.8rem)] font-semibold")}
          style={{ left: `${x(nuestro)}%`, color: TINTA }}
        >
          {f.speedLabelOurs}
        </span>
      </div>
    </div>
  );
}

const entradaVelocidad: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-pieza]"),
    { y: 8, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.15 },
  );
  tl.fromTo(
    q("[data-lleno]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 0.9 },
    "<0.1",
  );
  tl.fromTo(
    q("[data-punto]"),
    { scale: 0 },
    { scale: 1, duration: 0.5, ease: "back.out(2.2)" },
    "-=0.25",
  );
  /*
     El número cuenta hasta su valor. «0,9 s» o «0.9s»: separador y sufijo
     salen del copy y se vuelven a armar, así el resultado es el texto
     original de cada idioma. Con cifras tabulares el ancho no cambia
     mientras cuenta.
  */
  const cifra = q("[data-cifra]")[0];
  const m = cifra?.textContent?.match(/^(\D*)(\d+)([.,])(\d+)(.*)$/);
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
};

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
 * SEO: un chat suelto sobre la lámina. La pregunta a la derecha, en el tono
 * de la celda; la respuesta a la izquierda, blanca, con el avatar de ChatGPT
 * al lado. Entre una y otra, ChatGPT escribe: tres puntos que laten sobre el
 * mismo lugar donde después aparece la respuesta, que ya está ahí ocupando
 * su alto. Al pasar el mouse los dos globos se levantan apenas.
 */
function Seo({ tone, f }: Vineta) {
  const globo =
    "rounded-[16px] px-3.5 py-2.5 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.4)]";
  return (
    <div className="w-full max-w-[340px] text-[0.76rem] leading-snug">
      <div className="flex justify-end pl-8">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <p
            data-pregunta
            className={cn(
              globo,
              "rounded-br-[5px] font-medium",
              tonePill[tone],
            )}
          >
            {f.seoQuestion}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-end gap-2 pr-6">
        <span
          data-avatar
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: TINTA }}
        >
          <Chispa className="h-3 w-3" />
        </span>
        <div className="relative min-w-0 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <div
            data-respuesta
            className={cn(globo, "rounded-bl-[5px] bg-white")}
          >
            <p className={cn("text-[0.62rem] font-medium", toneTextDeep[tone])}>
              {f.seoCaption}
            </p>
            <p className="mt-1 font-medium" style={{ color: TINTA }}>
              {f.seoAnswer}
            </p>
          </div>
          <div
            data-escribiendo
            className={cn(
              globo,
              "escribiendo absolute bottom-0 left-0 flex h-9 items-center gap-1 rounded-bl-[5px] bg-white",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#9b9b97]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#9b9b97]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#9b9b97]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const entradaSeo: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-pregunta]"),
    { y: 10, scale: 0.9, opacity: 0, transformOrigin: "100% 100%" },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      delay: 0.2,
    },
  );
  tl.fromTo(
    q("[data-avatar]"),
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
    "-=0.1",
  );
  tl.fromTo(
    q("[data-escribiendo]"),
    { y: 6, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.3 },
    "-=0.15",
  );
  tl.to(q("[data-escribiendo]"), { opacity: 0, duration: 0.2 }, "+=1.2");
  tl.fromTo(
    q("[data-respuesta]"),
    { y: 10, scale: 0.92, opacity: 0, transformOrigin: "0% 100%" },
    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    "<",
  );
};

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

const entradaPantallas: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-ventana]"),
    { x: 28, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.7, delay: 0.2 },
  );
  tl.fromTo(
    q("[data-telefono]"),
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7 },
    "-=0.45",
  );
};

/**
 * Resultados: la única viñeta con marco, porque es la que dibuja un panel.
 * Una tarjeta blanca con las consultas que fueron llegando desde que el
 * sitio se publicó, en barras del tono de la celda: las de atrás más
 * claras, la de hoy en el tono profundo. Sobre la esquina de la tarjeta, el
 * aviso de que acaba de llegar otra. Al pasar el mouse la tarjeta se levanta
 * y el aviso se ladea.
 */
const ALTURAS = [16, 24, 20, 32, 38, 34, 50, 58, 66, 88];

function Resultados({ tone, f }: Vineta) {
  const ultima = ALTURAS.length - 1;
  return (
    <div className="relative w-full max-w-[320px] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <div
        data-tarjeta
        className="rounded-[18px] bg-white p-4 shadow-[0_26px_50px_-24px_rgba(0,0,0,0.45)]"
      >
        <p className="text-[0.74rem] font-medium" style={{ color: TINTA }}>
          {f.leadsCaption}
        </p>
        <div className="mt-4 flex h-[5.5rem] items-end gap-[7px]">
          {ALTURAS.map((alto, i) => (
            <span
              key={i}
              data-barra
              className="block flex-1 rounded-full"
              style={{
                height: `${alto}%`,
                background:
                  i === ultima ? profundo(tone) : `var(--color-${tone})`,
                opacity: i === ultima ? 1 : 0.4 + (i / ultima) * 0.6,
              }}
            />
          ))}
        </div>
        <div
          className="mt-2.5 flex justify-between border-t pt-2 text-[0.64rem]"
          style={{ borderColor: "#ececea", color: "#8a8a86" }}
        >
          <span>{f.leadsStart}</span>
          <span>{f.leadsEnd}</span>
        </div>
      </div>
      <div className="absolute -right-3 -top-3 transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105">
        <div
          data-pop
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/70 bg-white px-2.5 py-1.5 text-[0.66rem] font-medium shadow-[0_12px_28px_-12px_rgba(0,0,0,0.4)]"
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

const entradaResultados: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-tarjeta]"),
    { y: 24, scale: 0.96, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.8, delay: 0.2 },
  );
  tl.fromTo(
    q("[data-barra]"),
    { scaleY: 0, transformOrigin: "50% 100%" },
    { scaleY: 1, duration: 0.7, stagger: 0.06 },
    "-=0.4",
  );
  tl.fromTo(
    q("[data-pop]"),
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.2)" },
    "-=0.2",
  );
};

/**
 * Qué dibuja cada celda, cómo entra, y cómo se reparte la celda ancha:
 * en fila (texto a la izquierda, viñeta a la derecha) o en columna (texto
 * arriba, viñeta abajo a todo el ancho). `abajo` pega la viñeta al pie.
 */
const vinetas: Record<
  string,
  {
    Dibujo: (p: Vineta) => ReactElement;
    entrada: Entrada;
    abajo?: boolean;
    columna?: boolean;
  }
> = {
  velocidad: {
    Dibujo: Velocidad,
    entrada: entradaVelocidad,
    abajo: true,
    columna: true,
  },
  seo: { Dibujo: Seo, entrada: entradaSeo },
  pantallas: { Dibujo: Pantallas, entrada: entradaPantallas, abajo: true },
  resultados: { Dibujo: Resultados, entrada: entradaResultados },
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
              const id = (celda as HTMLElement).dataset.celda ?? "";
              const entrada = (vinetas[id] ?? vinetas.velocidad).entrada;
              const tl = gsap.timeline({
                scrollTrigger: { trigger: celda, start: START, once: true },
                defaults: { ease: "power3.out" },
              });
              entrada(tl, gsap.utils.selector(celda));
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
            const { Dibujo, abajo, columna } =
              vinetas[card.id] ?? vinetas.velocidad;
            // En fila solo la ancha que no pidió columna.
            const fila = diseño.shape === "ancha" && !columna;
            return (
              <article
                key={card.id}
                data-celda={card.id}
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
                    fila && "lg:flex-row lg:items-center lg:gap-6",
                  )}
                >
                  <div className={cn(fila && "lg:w-[46%] lg:shrink-0")}>
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
                      fila && "lg:pt-0",
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
