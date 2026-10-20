"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactElement } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import type { SiteCopy } from "@/content/copy";
import { CheckIcon } from "@/components/ui/icons";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import { gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro cosas que se lleva todo sitio, en cuatro tarjetas.
 *
 * Sale de una referencia de producto: tarjetas grandes y suaves, cada una
 * con una viñeta de interfaz arriba —un chat, una lista, un documento, una
 * línea de tiempo— y abajo el titular grande y una bajada corta. Las piezas
 * de interfaz son blancas con un borde finito y una sombra apenas, sobre el
 * gris de la tarjeta, y nada más: sin láminas de color, sin grano, sin marco
 * alrededor. Es la misma familia que las tarjetas de proyectos.
 *
 * Dos por dos desde md y una columna en el teléfono. Antes fue un damero de
 * tres columnas con celdas de dos anchos, primero en cuatro colores y después
 * en gris con el texto arriba; a la usuaria le resultó feo las dos veces. Con
 * las cuatro iguales la sección se lee como una sola grilla.
 *
 * Sin colores: todo es la tinta del tema, también las tildes y la barra del
 * documento, así que con la sección en oscuro desde el panel se da vuelta
 * sola. Esas dos iban en el champagne del foil del pase, y a la usuaria le
 * pareció un color de plantilla, ajeno a la marca, que es blanco y negro.
 *
 * Se mueven al entrar y nada más: cada viñeta tiene su coreografía (ver
 * `entrada` en cada una). El estado inicial de cada pieza (invisible,
 * encogida) es del CSS y no lo escribe GSAP al crearse: ver la nota
 * «Movimiento» en globals.css. Nada cambia de alto: la respuesta del chat ya
 * está ahí, invisible, y el «escribiendo» va encima. Al pasar el mouse una
 * pieza de cada viñeta se mueve un poco; ese hover es CSS y va en un
 * envoltorio aparte del elemento que anima GSAP, porque los dos escriben
 * transform.
 */

/** La itálica del hero, para las cifras y la respuesta del chat. */
const SERIF = "font-serif font-normal italic";

/** Una pieza de interfaz: blanca, con borde finito y sombra apenas. */
const PIEZA =
  "rounded-[14px] border border-line bg-card shadow-[0_10px_30px_-22px_rgba(0,0,0,0.35)]";

type Figuras = SiteCopy["bento"]["figures"];
type Vineta = { f: Figuras };

/** La entrada de una viñeta: lo que cada una hace con su línea de tiempo. */
type Entrada = (tl: gsap.core.Timeline, q: gsap.utils.SelectorFunc) => void;

/* ------------------------------------------------------------------ */
/* Íconos chicos, dibujados a mano como los de components/ui/icons     */
/* ------------------------------------------------------------------ */

const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
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

function Enviar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" {...trazo} />
    </svg>
  );
}

function Microfono({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <rect x="6" y="2" width="4" height="8" rx="2" {...trazo} />
      <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2" {...trazo} />
    </svg>
  );
}

function Campana({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11ZM6.5 14a1.6 1.6 0 0 0 3 0"
        {...trazo}
      />
    </svg>
  );
}

function Hoja({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M4 2h5l3 3v9H4V2Z M9 2v3h3M6 8.5h4M6 11h4" {...trazo} />
    </svg>
  );
}

/** La tilde en un círculo de tinta: lo hecho. */
function Tilde({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-ink text-on-ink",
        className,
      )}
    >
      <CheckIcon className="h-[55%] w-[55%]" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Las viñetas                                                         */
/* ------------------------------------------------------------------ */

/**
 * SEO: un chat. Arriba a la derecha, la pregunta de alguien que busca; a la
 * izquierda, la IA que escribe y contesta con nosotros, en la itálica del
 * hero; abajo, el campo para escribir, con su botón. Al pasar el mouse la
 * pregunta y la respuesta se levantan apenas.
 */
function Seo({ f }: Vineta) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex justify-end pl-10">
        <div className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <p
            data-pregunta
            className={cn(
              PIEZA,
              "rounded-br-[5px] px-4 py-2.5 text-[0.82rem] font-medium text-ink",
            )}
          >
            {f.seoQuestion}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-3 pr-6">
        <span
          data-avatar
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-on-ink"
        >
          <Chispa className="h-3.5 w-3.5" />
        </span>
        <div className="relative min-w-0 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          <div
            data-respuesta
            className={cn(PIEZA, "rounded-bl-[5px] px-4 py-3")}
          >
            <p className="text-[0.66rem] font-medium text-ink-faint">
              {f.seoCaption}
            </p>
            <p
              className={cn(
                SERIF,
                "mt-1 text-[1.02rem] leading-[1.25] text-ink",
              )}
            >
              {f.seoAnswer}
            </p>
          </div>
          <div
            data-escribiendo
            className="escribiendo absolute bottom-1 left-0 flex h-9 items-center gap-1 px-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
          </div>
        </div>
      </div>

      {/* El campo, quieto: dice «esto es un chat» sin pedir nada. */}
      <div aria-hidden className="mt-5 flex items-center gap-3">
        <div className={cn(PIEZA, "flex h-12 flex-1 items-center pl-4 pr-1.5")}>
          <span className="h-5 w-px bg-ink" />
          <span className="ml-auto grid h-9 w-9 place-items-center rounded-[10px] bg-ink text-on-ink">
            <Enviar className="h-4 w-4" />
          </span>
        </div>
        <Microfono className="h-5 w-5 text-ink-faint" />
      </div>
    </div>
  );
}

const entradaSeo: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-pregunta]"),
    { y: 10, scale: 0.94, opacity: 0, transformOrigin: "100% 100%" },
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
    { y: 10, scale: 0.95, opacity: 0, transformOrigin: "0% 100%" },
    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    "<",
  );
};

/**
 * Velocidad: una lista, como la de una revisión antes de publicar. La fila
 * de nuestro tiempo va hecha, con la tilde y la cifra grande en la itálica;
 * abajo, la de «la mitad se va», sin hacer y con su segundo apagado. Arriba
 * y abajo asoman dos filas vacías que se pierden: la lista sigue. Al pasar el
 * mouse la fila hecha se adelanta un poco.
 */
function Velocidad({ f }: Vineta) {
  const vacia = cn(PIEZA, "flex h-12 items-center gap-3 px-4 opacity-40");
  return (
    <div
      className="flex h-full flex-col justify-center gap-2.5"
      style={{
        maskImage:
          "linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)",
      }}
    >
      <div aria-hidden className={vacia}>
        <span className="h-5 w-5 rounded-full border border-line-strong" />
        <span className="h-2 w-32 rounded-full bg-line" />
      </div>

      <div className="transition-transform duration-500 ease-out group-hover:-translate-x-1">
        <div
          data-pieza
          className={cn(PIEZA, "flex items-center gap-3 px-4 py-3.5")}
        >
          <span data-punto className="block">
            <Tilde className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.95rem] font-semibold text-ink">
              {f.speedLabelOurs}
            </p>
            <p className="text-[0.72rem] text-ink-faint">{f.speedCaption}</p>
          </div>
          <span
            className={cn(
              SERIF,
              "ml-auto text-[2.1rem] leading-none tracking-[-0.03em] text-ink",
            )}
          >
            {f.speedOurs}
          </span>
        </div>
      </div>

      <div
        data-pieza
        className={cn(PIEZA, "flex items-center gap-3 px-4 py-3")}
      >
        <span className="h-6 w-6 shrink-0 rounded-full border-[1.5px] border-line-strong" />
        <p className="text-[0.9rem] text-ink-soft">{f.speedLabelTheirs}</p>
        <span className="ml-auto rounded-full bg-paper-alt px-2.5 py-1 text-[0.72rem] font-medium tabular-nums text-ink-faint">
          {f.speedTheirs}
        </span>
      </div>

      <div aria-hidden className={vacia}>
        <span className="h-5 w-5 rounded-full border border-line-strong" />
        <span className="h-2 w-24 rounded-full bg-line" />
      </div>
    </div>
  );
}

const entradaVelocidad: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-pieza]"),
    { y: 12, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, delay: 0.15 },
  );
  tl.fromTo(
    q("[data-punto]"),
    { scale: 0 },
    { scale: 1, duration: 0.5, ease: "back.out(2.2)" },
    "-=0.35",
  );
};

/**
 * Pantallas: la misma página en una ventana y en un teléfono. La ventana es
 * un documento con su barra de carga en tinta arriba, a medio llenar;
 * el teléfono se apoya adelante, abajo a la derecha. Al pasar el mouse el
 * teléfono se levanta.
 */
function Pantallas() {
  const linea = "h-2.5 rounded-full bg-paper-alt";
  return (
    <div className="relative h-full">
      <div
        data-ventana
        className={cn(PIEZA, "absolute inset-y-0 left-0 right-[18%] p-5")}
      >
        <div className="h-1 overflow-hidden rounded-full bg-paper-alt">
          <div className="h-full w-[68%] bg-ink" />
        </div>
        <div className="mt-5 h-10 w-10 rounded-[10px] bg-paper-alt" />
        <div className="mt-5 space-y-2.5">
          <div className={cn(linea, "w-[55%]")} />
          <div className={cn(linea, "w-[42%]")} />
          <div className={cn(linea, "w-[48%]")} />
        </div>
        <div className="mt-6 space-y-2.5">
          <div className={cn(linea, "w-[88%]")} />
          <div className={cn(linea, "w-[80%]")} />
        </div>
      </div>
      <div className="absolute -bottom-6 right-0 w-[34%] transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <div
          data-telefono
          className="rounded-[20px] border-[3px] border-ink bg-card p-2 shadow-[0_22px_44px_-24px_rgba(0,0,0,0.45)]"
        >
          <div className="mx-auto h-1 w-6 rounded-full bg-ink" />
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-paper-alt">
            <div className="h-full w-[68%] bg-ink" />
          </div>
          <div className="mt-3 h-7 w-7 rounded-[8px] bg-paper-alt" />
          <div className="mt-3 space-y-1.5">
            <div className={cn(linea, "h-2 w-[80%]")} />
            <div className={cn(linea, "h-2 w-[60%]")} />
            <div className={cn(linea, "h-2 w-[70%]")} />
          </div>
          <div className="mt-3 h-10 rounded-[8px] bg-paper-alt" />
        </div>
      </div>
    </div>
  );
}

const entradaPantallas: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-ventana]"),
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, delay: 0.2 },
  );
  tl.fromTo(
    q("[data-telefono]"),
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7 },
    "-=0.45",
  );
};

/**
 * Resultados: una línea de tiempo. Arriba, lo de hoy: la consulta nueva, ya
 * hecha, con la campana; abajo, desde el lanzamiento, las consultas que
 * fueron llegando, en barras que van ganando fuerza. Detrás asoman dos hojas
 * más, como una pila de avisos. Al pasar el mouse la tarjeta se levanta.
 */
const ALTURAS = [20, 28, 24, 36, 42, 38, 54, 62, 72, 92];

function Resultados({ f }: Vineta) {
  const ultima = ALTURAS.length - 1;
  return (
    <div className="relative h-full pt-4">
      <div
        aria-hidden
        className={cn(PIEZA, "absolute inset-x-[12%] top-0 h-10 opacity-50")}
      />
      <div
        aria-hidden
        className={cn(PIEZA, "absolute inset-x-[6%] top-2 h-10 opacity-75")}
      />
      <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <div data-tarjeta className={cn(PIEZA, "relative px-5 py-5")}>
          {/* El hilo que une los dos momentos. */}
          <span
            aria-hidden
            className="absolute bottom-12 left-[2.15rem] top-12 w-px bg-line-strong"
          />

          <div data-pop className="relative flex items-start gap-3">
            <Tilde className="h-6 w-6" />
            <div className="min-w-0">
              <p className="text-[0.72rem] text-ink-faint">{f.leadsEnd}</p>
              <p className="mt-0.5 text-[0.95rem] font-semibold text-ink">
                {f.formNotice}
              </p>
            </div>
            <Campana className="ml-auto h-5 w-5 text-ink" />
          </div>

          <div className="relative mt-6 flex items-start gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-card text-ink-faint">
              <Hoja className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.72rem] text-ink-faint">{f.leadsStart}</p>
              <p className="mt-0.5 text-[0.95rem] font-medium text-ink">
                {f.leadsCaption}
              </p>
              <div className="mt-3 flex h-12 items-end justify-between">
                {ALTURAS.map((alto, i) => (
                  <span
                    key={i}
                    data-barra
                    /* Finas y separadas: anchas, las bajas quedaban como
                       pastillas acostadas. */
                    className="block w-1.5 rounded-full sm:w-2"
                    style={{
                      height: `${alto}%`,
                      /* La fuerza va en el color y no en la opacidad: con
                         menos movimiento pedido el CSS les fuerza
                         opacity: 1 a las piezas, y quedaban todas negras. */
                      background:
                        i === ultima
                          ? "var(--color-ink)"
                          : `color-mix(in srgb, var(--color-ink) ${12 + (i / ultima) * 30}%, transparent)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const entradaResultados: Entrada = (tl, q) => {
  tl.fromTo(
    q("[data-tarjeta]"),
    { y: 20, scale: 0.97, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 0.8, delay: 0.2 },
  );
  tl.fromTo(
    q("[data-pop]"),
    { y: 8, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 },
    "-=0.4",
  );
  tl.fromTo(
    q("[data-barra]"),
    { scaleY: 0, transformOrigin: "50% 100%" },
    { scaleY: 1, duration: 0.6, stagger: 0.05 },
    "-=0.2",
  );
};

/** Qué dibuja cada tarjeta y cómo entra. */
const vinetas: Record<
  string,
  { Dibujo: (p: Vineta) => ReactElement; entrada: Entrada }
> = {
  velocidad: { Dibujo: Velocidad, entrada: entradaVelocidad },
  seo: { Dibujo: Seo, entrada: entradaSeo },
  pantallas: { Dibujo: Pantallas, entrada: entradaPantallas },
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
        <Reveal stagger className="grid gap-4 md:grid-cols-2 md:gap-5">
          {bento.cards.map((card) => {
            const { Dibujo } = vinetas[card.id] ?? vinetas.velocidad;
            return (
              <article
                key={card.id}
                data-celda={card.id}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-paper-alt p-6 sm:p-8 md:p-9",
                  bentoDesign[card.id]?.area,
                )}
              >
                <div className="relative h-[15rem] md:h-[16.5rem]">
                  <Dibujo f={bento.figures} />
                </div>
                <div className="mt-8 md:mt-10">
                  <h3 className="max-w-[16ch] text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[1.7rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[0.98rem] leading-relaxed text-ink-soft">
                    {card.body}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
