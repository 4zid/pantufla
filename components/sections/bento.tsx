"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactElement } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import type { SiteCopy } from "@/content/copy";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import { gsap, registerGsap, ScrollTrigger, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro cosas que se lleva todo sitio, en un tablero.
 *
 * Cuatro celdas en damero: tres columnas y dos filas desde lg, con la chica
 * del chat arriba a la izquierda y la ancha de velocidad a la derecha; abajo
 * la ancha del formulario a la izquierda y la chica de las pantallas a la
 * derecha. Las dos anchas nunca quedan una sobre otra. En tablet son dos
 * columnas parejas —a tres, cada celda quedaba de 220 y el chat se partía en
 * palabras sueltas— y en teléfono, una sola.
 *
 * Sobrio, como el hero y el pase. Eran cuatro láminas de color —aqua, rosa,
 * miel y verde, con degradés y grano de foto— y al lado del hero blanco, del
 * pase marfil y de los mockups grises quedaban de otra página. Ahora cada
 * celda es el mismo plano gris con borde fino de las tarjetas de proyectos,
 * la tinta es la del tema y hay un solo color: el champagne del foil del
 * pase, en el punto de la regla, en el aviso de la consulta nueva y en los
 * bloques de las pantallas. La tipografía hace lo que hacía el color: la
 * cifra de velocidad y la respuesta del chat van en la itálica de Newsreader,
 * la del titular del hero, contra la Schibsted del resto.
 *
 * Al ser tokens y no colores fijos, el tablero sigue al tema: con la sección
 * en oscuro desde el panel, las celdas y las viñetas se dan vuelta solas.
 *
 * Las cuatro viñetas son cuatro cosas distintas, y solo una va en un marco.
 * Velocidad: el texto arriba y, en el pie de la celda, una regla de segundos
 * que la cruza entera y se va de cuadro por los dos lados, con la cifra
 * grande arriba a la derecha. SEO: un chat suelto, la pregunta a la derecha y
 * la respuesta a la izquierda, con el «escribiendo» en el medio. Pantallas:
 * una ventana y un teléfono cortados por el borde de la celda. Resultados:
 * una tarjeta con las consultas en barras, y el aviso de la nueva pisando su
 * esquina.
 *
 * Se mueven dos veces y nada más. Al entrar en pantalla, cada viñeta tiene su
 * propia coreografía (ver `entrada` en cada una): la regla se traza; la
 * pregunta llega, la IA escribe un rato y contesta; la ventana entra de
 * costado y el teléfono sube; la tarjeta se asienta, las barras crecen y el
 * aviso salta. Todo por opacidad y transformación, con cada pieza ya
 * ocupando su lugar desde el primer pintado: nada cambia de alto, ni
 * siquiera cuando el «escribiendo» se vuelve respuesta, porque la respuesta
 * ya está ahí, invisible, y el «escribiendo» va encima. El estado inicial de
 * cada pieza (invisible, encogida) es del CSS y no lo escribe GSAP al
 * crearse: ver la nota «Movimiento» en globals.css. Y al pasar el mouse una
 * pieza de cada viñeta se mueve un poco. El hover es CSS puro y va en un
 * envoltorio aparte del elemento que anima GSAP: los dos escriben transform,
 * y en el mismo elemento se pisan.
 */

/**
 * El único color del tablero: el champagne del foil del pase, el mismo de la
 * línea de corte del banner. Es fijo y no un token porque se lee igual sobre
 * el gris claro y sobre el oscuro.
 */
const CHAMPAGNE = "#c8ae84";

/** La itálica del hero, para las cifras y la respuesta del chat. */
const SERIF = "font-serif font-normal italic";

type Figuras = SiteCopy["bento"]["figures"];
type Vineta = { f: Figuras };

/* ------------------------------------------------------------------ */
/* Las viñetas                                                         */
/* ------------------------------------------------------------------ */

/** «0,9 s» o «0.9s»: el número que hay adentro, en cualquiera de los dos idiomas. */
function numero(texto: string) {
  const m = texto.replace(",", ".").match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

/** La tinta del tema a una opacidad: sigue al tema como el resto. */
const tinta = (pct: number) =>
  `color-mix(in srgb, var(--color-ink) ${pct}%, transparent)`;

/** La entrada de una viñeta: lo que cada una hace con su línea de tiempo. */
type Entrada = (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void;

/**
 * Velocidad: la regla de segundos. Cruza la celda entera por el pie y se va
 * de cuadro por los dos lados; un trazo de tinta llega hasta nuestro tiempo
 * y termina en el punto champagne, y de ahí sigue punteado y apagado hasta
 * el promedio. La cifra va arriba a la derecha en escritorio, frente al
 * título, y arriba de la regla cuando la celda es angosta, grande y en la
 * itálica del hero. La regla llega hasta el segundo entero que sigue al
 * número más alto, así sirve para cualquier par de valores.
 *
 * Es HTML con posiciones en porcentaje y no un SVG: un SVG escalado al ancho
 * de la celda agranda también los textos y los grosores, y acá el ancho va
 * de 300 a 700 píxeles.
 */
function Velocidad({ f }: Vineta) {
  const nuestro = numero(f.speedOurs);
  const suyo = numero(f.speedTheirs);
  const tope = Math.max(1, Math.ceil(Math.max(nuestro, suyo)));
  const x = (seg: number) => 6 + (seg / tope) * 82;
  const marcas = Array.from({ length: tope + 1 }, (_, i) => i);
  const etiqueta = "absolute -translate-x-1/2 whitespace-nowrap text-[0.68rem]";
  return (
    <div className="w-full">
      <div className="lg:absolute lg:right-7 lg:top-7 lg:text-right">
        <p data-pieza className="text-[0.7rem] font-medium text-ink-faint">
          {f.speedCaption}
        </p>
        <p
          data-pieza
          data-cifra
          className={cn(
            SERIF,
            "mt-2 text-[3.5rem] leading-[0.9] tracking-[-0.03em] text-ink md:text-[4rem]",
          )}
        >
          {f.speedOurs}
        </p>
      </div>

      <div className="relative mt-7 h-[5.75rem] w-full lg:mt-0">
        {/* La línea de base, de borde a borde, apareciendo desde la izquierda. */}
        <span
          className="absolute -left-12 -right-12 top-1/2 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${tinta(22)} 10%, ${tinta(22)})`,
          }}
        />
        {marcas.map((seg) => (
          <span
            key={seg}
            className="absolute bottom-1/2 top-1 border-l border-dashed"
            style={{ left: `${x(seg)}%`, borderColor: tinta(22) }}
          >
            <span
              className={cn(
                etiqueta,
                "left-0 top-[calc(100%+0.55rem)] text-ink-faint",
              )}
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
            borderColor: tinta(35),
          }}
        />
        <span
          data-pieza
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]"
          style={{ left: `${x(suyo)}%`, borderColor: tinta(55) }}
        />
        <span
          data-pieza
          className={cn(etiqueta, "bottom-[calc(50%+0.8rem)] text-ink-faint")}
          style={{ left: `${x(suyo)}%` }}
        >
          {f.speedLabelTheirs} · {f.speedTheirs}
        </span>
        {/* El nuestro: un trazo de tinta desde fuera de cuadro hasta el punto. */}
        <span
          data-lleno
          className="absolute -left-12 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
          style={{
            width: `calc(${x(nuestro)}% + 3rem)`,
            background:
              "linear-gradient(90deg, transparent, var(--color-ink) 22%, var(--color-ink))",
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
                background: `radial-gradient(circle, ${CHAMPAGNE}66, transparent 70%)`,
              }}
            />
            {/* El aro es del color de la celda: el punto parece calado. */}
            <span
              className="absolute inset-0 rounded-full border-[2.5px] border-paper-alt"
              style={{ background: CHAMPAGNE }}
            />
          </span>
        </span>
        <span
          data-pieza
          className={cn(
            etiqueta,
            "bottom-[calc(50%+0.8rem)] font-semibold text-ink",
          )}
          style={{ left: `${x(nuestro)}%` }}
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
 * SEO: un chat suelto. La pregunta a la derecha y la respuesta a la
 * izquierda, las dos en globos del color de las tarjetas con borde fino, y
 * la respuesta en la itálica del hero: es lo que la IA dice de vos, y se lee
 * como una cita. Entre una y otra, la IA escribe: tres puntos que laten
 * sobre el mismo lugar donde después aparece la respuesta, que ya está ahí
 * ocupando su alto. Al pasar el mouse los dos globos se levantan apenas.
 */
function Seo({ f }: Vineta) {
  const globo =
    "rounded-[16px] border border-line bg-card px-3.5 py-2.5 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.35)]";
  return (
    <div className="w-full max-w-[340px] text-[0.76rem] leading-snug">
      <div className="flex justify-end pl-8">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <p
            data-pregunta
            className={cn(globo, "rounded-br-[5px] font-medium text-ink")}
          >
            {f.seoQuestion}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-end gap-2 pr-6">
        <span
          data-avatar
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink"
        >
          <Chispa className="h-3 w-3" />
        </span>
        <div className="relative min-w-0 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <div data-respuesta className={cn(globo, "rounded-bl-[5px]")}>
            <p className="text-[0.62rem] font-medium text-ink-faint">
              {f.seoCaption}
            </p>
            <p
              className={cn(SERIF, "mt-1 text-[1rem] leading-[1.25] text-ink")}
            >
              {f.seoAnswer}
            </p>
          </div>
          <div
            data-escribiendo
            className={cn(
              globo,
              "escribiendo absolute bottom-0 left-0 flex h-9 items-center gap-1 rounded-bl-[5px]",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
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
 * Pantallas: la misma página en una ventana y en un teléfono, dibujados en
 * gris con el bloque principal en champagne. La ventana se va por el borde
 * derecho de la celda y el teléfono, adelante e inclinado, por el de abajo:
 * la celda los corta, y eso es lo que los hace parecer más grandes que el
 * cuadro. Al pasar el mouse el teléfono se levanta y se endereza un poco.
 */
function Pantallas() {
  const bloque = "rounded-[5px] bg-line";
  const principal = { background: `${CHAMPAGNE}59` };
  return (
    <div className="relative h-[12rem] w-full">
      <div className="absolute left-0 top-0 w-[124%] transition-transform duration-500 ease-out group-hover:-translate-x-1">
        <div
          data-ventana
          className="rounded-[12px] border border-line bg-card p-3 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.4)]"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-line-strong"
              />
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-[1.4fr_1fr_1fr] gap-1.5">
            <div
              className="row-span-2 h-[4.5rem] rounded-[5px]"
              style={principal}
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
          className="rounded-[18px] border-[3px] border-ink bg-card p-1.5 shadow-[0_22px_44px_-24px_rgba(0,0,0,0.45)]"
        >
          <div className="mx-auto mt-0.5 h-1 w-5 rounded-full bg-ink" />
          <div className="mt-2 space-y-1.5">
            <div className="h-12 rounded-[6px]" style={principal} />
            <div className="h-2 rounded-[4px] bg-line" />
            <div className="h-2 rounded-[4px] bg-line" />
            <div className="h-2 w-2/3 rounded-[4px] bg-line" />
            <div className="h-9 rounded-[6px] bg-line" />
            <div className="h-2 rounded-[4px] bg-line" />
            <div className="h-2 w-4/5 rounded-[4px] bg-line" />
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
 * Una tarjeta con las consultas que fueron llegando desde que el sitio se
 * publicó, en barras de tinta que van ganando fuerza: las de atrás casi
 * transparentes, la de hoy entera. Sobre la esquina de la tarjeta, el aviso
 * de que acaba de llegar otra, con el punto champagne. Al pasar el mouse la
 * tarjeta se levanta y el aviso se ladea.
 */
const ALTURAS = [16, 24, 20, 32, 38, 34, 50, 58, 66, 88];

function Resultados({ f }: Vineta) {
  const ultima = ALTURAS.length - 1;
  return (
    <div className="relative w-full max-w-[320px] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <div
        data-tarjeta
        className="rounded-[18px] border border-line bg-card p-4 shadow-[0_26px_50px_-30px_rgba(0,0,0,0.4)]"
      >
        <p className="text-[0.74rem] font-medium text-ink">{f.leadsCaption}</p>
        <div className="mt-4 flex h-[5.5rem] items-end gap-[7px]">
          {ALTURAS.map((alto, i) => (
            <span
              key={i}
              data-barra
              className="block flex-1 rounded-full"
              style={{
                height: `${alto}%`,
                /* La fuerza va en el color y no en la opacidad: con menos
                   movimiento pedido el CSS les fuerza opacity: 1 a las
                   piezas, y quedaban todas negras. */
                background: tinta(i === ultima ? 100 : 12 + (i / ultima) * 30),
              }}
            />
          ))}
        </div>
        <div className="mt-2.5 flex justify-between border-t border-line pt-2 text-[0.64rem] text-ink-faint">
          <span>{f.leadsStart}</span>
          <span>{f.leadsEnd}</span>
        </div>
      </div>
      <div className="absolute -right-3 -top-3 transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-105">
        <div
          data-pop
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-card px-2.5 py-1.5 text-[0.66rem] font-medium text-ink shadow-[0_12px_28px_-14px_rgba(0,0,0,0.35)]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: CHAMPAGNE }}
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
              // immediateRender: false en la línea de tiempo y en cada tween:
              // al crearse no escriben nada, solo miden; el estado inicial de
              // cada pieza está en CSS (ver «Movimiento» en globals.css).
              const tl = gsap.timeline({
                immediateRender: false,
                scrollTrigger: { trigger: celda, start: START, once: true },
                defaults: { ease: "power3.out", immediateRender: false },
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

      <div ref={scope} className="mt-14 md:mt-20">
        <Reveal stagger className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {bento.cards.map((card) => {
            const diseño = bentoDesign[card.id] ?? {
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
                  "group relative overflow-hidden rounded-[1.25rem] border border-line bg-paper-alt md:rounded-[1.5rem]",
                  "md:min-h-[23rem]",
                  diseño.area,
                )}
              >
                <div
                  className={cn(
                    "relative flex h-full flex-col p-6 md:p-7",
                    fila && "lg:flex-row lg:items-center lg:gap-6",
                  )}
                >
                  <div className={cn(fila && "lg:w-[46%] lg:shrink-0")}>
                    <h3 className="text-[1.08rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                      {card.title}
                    </h3>
                    <p className="mt-2 max-w-[34ch] text-[0.92rem] leading-relaxed text-ink-soft">
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
                    <Dibujo f={bento.figures} />
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
