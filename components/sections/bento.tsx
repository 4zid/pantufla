"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { bentoDesign } from "@/content/site";
import { Section, SectionHead } from "@/components/ui/section";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Las cuatro capacidades, en tablero.
 *
 * Cada tarjeta es una sola pieza: el texto y el gesto conviven en el mismo
 * espacio, sin una banda de ilustración debajo de una línea. La versión
 * anterior tenía eso —texto arriba, borde, lienzo abajo— y por más distinto
 * que fuera cada dibujo, la estructura se leía cuadrada y repetida. Ahora el
 * termómetro está al lado del título, el chat es el cuerpo de la tarjeta, la
 * pantalla que se achica ocupa lo que el texto deja, y el color difuso está
 * detrás de todo, no detrás de una parte.
 *
 * Poco texto: dos o tres renglones por tarjeta. Lo que la tarjeta tiene que
 * decir lo dice el gesto; el texto le pone nombre.
 */

/** Las clases de cada tono, escritas enteras porque Tailwind no arma nombres al vuelo. */
const tonos = {
  aqua: { texto: "text-aqua-deep", solido: "bg-aqua", profundo: "bg-aqua-deep" },
  rosa: { texto: "text-rosa-deep", solido: "bg-rosa", profundo: "bg-rosa-deep" },
  verde: { texto: "text-verde-deep", solido: "bg-verde", profundo: "bg-verde-deep" },
  miel: { texto: "text-miel-deep", solido: "bg-miel", profundo: "bg-miel-deep" },
} as const;

type Tono = keyof typeof tonos;

/**
 * La tinta de lo que va sobre vidrio o sobre color no es la del tema, y es a
 * propósito. Los pastel de la paleta y el vidrio blanco son fijos —no se dan
 * vuelta con el modo oscuro— así que la tinta de encima tampoco puede darse
 * vuelta: en oscuro pasaría a casi blanca sobre un vidrio casi blanco.
 */
const TINTA = "#121212";
const tinta = (alfa: number) => `color-mix(in srgb, ${TINTA} ${alfa}%, transparent)`;

/** Vidrio esmerilado: blanco a medias con desenfoque de lo que hay detrás. */
const VIDRIO =
  "border border-white/70 bg-white/55 shadow-[0_12px_32px_-18px_rgba(18,18,18,0.45)] backdrop-blur-md";

type Card = { id: string; title: string; body: string };
type Figuras = {
  speedOurs: string;
  speedTheirs: string;
  seoQuestion: string;
  seoAnswer: string;
  formButton: string;
};
type Props = { card: Card; tono: Tono; figuras: Figuras };

/* ------------------------------------------------------------------ */
/* Piezas comunes                                                      */
/* ------------------------------------------------------------------ */

/**
 * Un blob de color difuso: un radial con el borde en rampa más un desenfoque.
 *
 * Se apaga del todo al 72% de su radio, a propósito. Los blobs sangran por
 * los bordes de la tarjeta y la tarjeta los recorta con overflow-hidden; el
 * desenfoque no suaviza un corte porque el corte pasa después. Con el cuarto
 * exterior ya transparente, el recorte cae donde no hay nada que cortar.
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

function Titulo({ children, className }: { children: string; className?: string }) {
  return (
    <h3
      className={cn(
        "text-[1.2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.3rem]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function Cuerpo({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("text-[0.94rem] leading-relaxed text-ink-soft", className)}>
      {children}
    </p>
  );
}

/** El orbe de la inspiración: una esferita de dos tonos, la paleta en miniatura. */
function Orbe({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block shrink-0 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.15)]",
        className,
      )}
      style={{
        background:
          "radial-gradient(circle at 35% 30%, #ffffff 0%, var(--color-rosa) 30%, var(--color-aqua) 75%, var(--color-verde) 100%)",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 1. Velocidad — el termómetro                                        */
/* ------------------------------------------------------------------ */

/**
 * El termómetro va al lado del título, no debajo de una línea.
 *
 * Un tubo vertical con el bulbo abajo, que se llena hasta donde el número
 * marca contra el máximo escrito en la boca. El número sube de cero cuando la
 * tarjeta entra, y el tubo se llena a la par. Es la única pieza vertical del
 * tablero, y va a la derecha del título para que el título y el gesto se
 * lean como una sola cosa.
 */
function Velocidad({ card, tono, figuras }: Props) {
  const t = tonos[tono];
  return (
    <div className="relative flex h-full min-h-[21rem] flex-col overflow-hidden p-6 md:p-7">
      <Blob tono={tono} className="-right-28 -top-32 h-[26rem] w-[26rem]" intensidad={72} />
      <Blob tono="miel" className="-bottom-24 -left-24 h-72 w-72" intensidad={40} />

      <div className="relative z-10 flex items-start justify-between gap-5">
        <Titulo className="max-w-[10rem] pt-1">{card.title}</Titulo>

        <div className="flex shrink-0 items-end gap-3">
          <p
            data-cifra
            className={cn(
              "pb-1 text-[1.85rem] font-semibold leading-none tracking-[-0.045em] tabular-nums",
              t.texto,
            )}
          >
            {figuras.speedOurs}
          </p>

          {/* El tubo. El máximo en la boca, el bulbo en el pie. */}
          <div className="relative mb-2.5 mt-5 h-[5.5rem] w-3">
            <span
              className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.62rem] font-medium tabular-nums"
              style={{ color: tinta(42) }}
            >
              {figuras.speedTheirs}
            </span>
            <span className="absolute inset-0 rounded-full" style={{ background: tinta(9) }} />
            <span
              data-termo
              className={cn("absolute inset-x-0 bottom-0 h-full origin-bottom rounded-full", t.profundo)}
              style={{ transform: "scaleY(0.3)" }}
            />
            <span
              className={cn(
                "absolute -bottom-2.5 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full",
                t.profundo,
              )}
              style={{ boxShadow: `0 0 0 5px color-mix(in srgb, var(--color-${tono}) 35%, transparent)` }}
            />
          </div>
        </div>
      </div>

      <Cuerpo className="relative z-10 mt-auto pt-8">{card.body}</Cuerpo>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. SEO — el chat                                                    */
/* ------------------------------------------------------------------ */

/**
 * Un chat con un modelo, que es la tarjeta entera y no una ilustración al
 * pie. La pregunta se escribe sola en la burbuja de la derecha; el modelo
 * contesta desde la izquierda, con los tres puntos de «está escribiendo»
 * antes del texto. Una pregunta es algo que alguien escribe; una ya escrita
 * es un cartel.
 */
function Seo({ card, tono, figuras }: Props) {
  return (
    <div className="relative flex h-full min-h-[21rem] flex-col overflow-hidden p-6 md:p-7">
      <Blob tono={tono} className="-bottom-32 -left-28 h-[26rem] w-[26rem]" intensidad={80} />
      <Blob tono="miel" className="-right-20 top-6 h-64 w-64" intensidad={45} />

      <div className="relative z-10">
        <Titulo>{card.title}</Titulo>
        <Cuerpo className="mt-3">{card.body}</Cuerpo>
      </div>

      <div className="relative z-10 mt-auto space-y-2.5 pt-7">
        {/* La pregunta, a la derecha, como en cualquier chat. */}
        <div className={cn("ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md px-4 py-2.5", VIDRIO)}>
          <p className="text-[0.86rem] leading-snug" style={{ color: tinta(80) }}>
            <span data-tipeo />
            <span
              data-caret
              aria-hidden
              className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-[parpadeo_1s_steps(2)_infinite]"
              style={{ background: tinta(70) }}
            />
          </p>
        </div>

        {/* La respuesta, a la izquierda, con el orbe. Primero los puntos,
            después el texto. */}
        <div data-respuesta className="flex max-w-[92%] items-end gap-2" style={{ opacity: 0 }}>
          <Orbe className="mb-1 h-5 w-5" />
          <div className={cn("rounded-2xl rounded-bl-md px-4 py-2.5", VIDRIO)}>
            <span data-puntos aria-hidden className="flex h-[1.3em] items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-1.5 w-1.5 rounded-full animate-[puntitos_1.1s_ease-in-out_infinite]"
                  style={{ background: tinta(45), animationDelay: `${i * 0.16}s` }}
                />
              ))}
            </span>
            <p
              data-texto-respuesta
              className="hidden text-[0.86rem] leading-snug"
              style={{ color: tinta(84) }}
            >
              {figuras.seoAnswer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pantallas — la ventana que se achica                             */
/* ------------------------------------------------------------------ */

/**
 * Una ventana de vidrio que se angosta hasta ser un teléfono y vuelve, y
 * adentro un layout que se reacomoda solo: tres columnas, dos, una.
 *
 * El reacomodo no está animado a mano: las columnas son un grid con
 * auto-fit, así que a medida que el ancho baja, el navegador las va
 * plegando, que es exactamente lo que pasa con un sitio de verdad. Lo único
 * que se anima es el ancho. Va y vuelve en bucle, con una pausa en cada
 * punta, porque es una demostración y no un adorno: hay que verlo achicarse
 * para entender qué muestra.
 */
function Pantallas({ card, tono }: Props) {
  const t = tonos[tono];
  return (
    <div className="relative flex h-full min-h-[30rem] flex-col overflow-hidden p-6 md:p-7">
      <Blob tono={tono} className="-bottom-36 -right-32 h-[28rem] w-[28rem]" intensidad={70} />
      <Blob tono="aqua" className="-left-28 top-1/3 h-72 w-72" intensidad={32} />

      <div className="relative z-10">
        <Titulo>{card.title}</Titulo>
        <Cuerpo className="mt-3">{card.body}</Cuerpo>
      </div>

      <div className="relative z-10 mt-8 flex flex-1 items-start justify-center">
        <div data-ventana className={cn("w-full overflow-hidden rounded-xl", VIDRIO)}>
          <div className="flex gap-1.5 px-3 py-2.5" style={{ borderBottom: `1px solid ${tinta(7)}` }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-1.5 w-1.5 rounded-full" style={{ background: tinta(16) }} />
            ))}
          </div>
          <div className="p-3">
            <span className={cn("mb-2 block h-2 w-1/2 rounded-full", t.solido)} />
            <span className="mb-3 block h-1.5 w-full rounded-full" style={{ background: tinta(11) }} />
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(5.2rem, 1fr))" }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-14 rounded-lg" style={{ background: tinta(9) }} />
              ))}
            </div>
            <span className={cn("mt-3 block h-6 w-full rounded-md", t.solido)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Resultados — el deslizador                                       */
/* ------------------------------------------------------------------ */

/**
 * Un riel y una pastilla que lo recorre, a la derecha del texto, sobre un
 * color que cruza la tarjeta entera. Sin números en las puntas: la
 * inspiración los tiene, pero acá serían inventados, y un número inventado
 * en una tarjeta que habla de resultados es exactamente lo que no.
 */
function Resultados({ card, tono }: Props) {
  const t = tonos[tono];
  return (
    <div className="relative grid min-h-[17rem] overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Blob tono={tono} className="-right-32 -top-36 h-[30rem] w-[30rem]" intensidad={85} />
      <Blob tono="rosa" className="-bottom-36 left-1/3 h-80 w-80" intensidad={40} />

      <div className="relative z-10 flex flex-col justify-center p-6 md:p-7">
        <Titulo>{card.title}</Titulo>
        <Cuerpo className="mt-3">{card.body}</Cuerpo>
      </div>

      <div className="relative z-10 min-h-[9rem] md:min-h-0">
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 sm:inset-x-12">
          <div className="relative h-1.5 rounded-full" style={{ background: tinta(10) }}>
            <span
              data-lleno
              className={cn("absolute inset-y-0 left-0 w-full origin-left rounded-full", t.solido)}
              style={{ transform: "scaleX(0.14)" }}
            />
            <span className={cn("absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full", t.solido)} />
            <span
              className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
              style={{ background: tinta(14) }}
            />
            <span
              data-pastilla
              className={cn(
                "absolute top-1/2 flex h-11 min-w-[4.4rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-4",
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
    </div>
  );
}

/* ------------------------------------------------------------------ */

const tarjetas = { velocidad: Velocidad, seo: Seo, pantallas: Pantallas, resultados: Resultados };

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

          /* ---- 1. El termómetro: el número sube, el tubo se llena. ---- */
          const cifra = q("[data-cifra]")[0];
          if (cifra) {
            const texto = cifra.textContent ?? "";
            // «0,9 s» o «0.9s»: separador y sufijo salen del copy y se vuelven
            // a armar, así el resultado es el texto original de cada idioma.
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
              q("[data-termo]"),
              { scaleY: 0 },
              {
                scaleY: 0.3,
                duration: reduced ? 0 : 1.3,
                ease: "power3.out",
                scrollTrigger: { trigger: cifra, start: START, once: true },
              },
            );
          }

          /* ---- 2. El chat: se tipea, llegan los puntos, llega el texto. ---- */
          const tipeo = q("[data-tipeo]")[0];
          const respuesta = q("[data-respuesta]")[0];
          if (tipeo && respuesta) {
            const pregunta = bento.figures.seoQuestion;
            const puntos = q("[data-puntos]");
            const textoRespuesta = q("[data-texto-respuesta]");
            if (reduced) {
              tipeo.textContent = pregunta;
              gsap.set(respuesta, { opacity: 1 });
              gsap.set(puntos, { display: "none" });
              gsap.set(textoRespuesta, { display: "block" });
            } else {
              const proxy = { n: 0 };
              gsap
                .timeline({ scrollTrigger: { trigger: tipeo, start: START, once: true } })
                .to(proxy, {
                  n: pregunta.length,
                  duration: Math.min(2.2, 0.05 * pregunta.length + 0.4),
                  ease: "none",
                  snap: "n",
                  onUpdate: () => {
                    tipeo.textContent = pregunta.slice(0, proxy.n);
                  },
                })
                .to(q("[data-caret]"), { opacity: 0, duration: 0.2 }, "+=0.3")
                .fromTo(respuesta, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "<")
                .set(puntos, { display: "none" }, "+=1.0")
                .set(textoRespuesta, { display: "block" })
                .fromTo(textoRespuesta, { opacity: 0 }, { opacity: 1, duration: 0.45 });
            }
          }

          /* ---- 3. La ventana: se angosta hasta teléfono y vuelve, en bucle. ---- */
          const ventana = q("[data-ventana]")[0];
          if (ventana && !reduced) {
            gsap.to(ventana, {
              width: "46%",
              duration: 2.4,
              ease: "power2.inOut",
              repeat: -1,
              yoyo: true,
              repeatDelay: 1.3,
              scrollTrigger: {
                trigger: ventana,
                start: START,
                // Se pausa fuera de pantalla: un bucle que corre donde nadie lo
                // ve es trabajo tirado.
                toggleActions: "play pause resume pause",
              },
            });
          }

          /* ---- 4. El deslizador: la pastilla recorre el riel. ---- */
          const pastilla = q("[data-pastilla]")[0];
          if (pastilla) {
            if (reduced) {
              gsap.set(pastilla, { left: "82%" });
              gsap.set(q("[data-lleno]"), { scaleX: 0.82 });
            } else {
              gsap
                .timeline({ scrollTrigger: { trigger: pastilla, start: START, once: true } })
                .to(pastilla, { left: "82%", duration: 1.5, ease: "power3.inOut", delay: 0.15 })
                .to(q("[data-lleno]"), { scaleX: 0.82, duration: 1.5, ease: "power3.inOut" }, "<");
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
        Un tablero y no cuatro tarjetas sueltas: las cuatro viven adentro de
        un mismo contenedor, separadas por una junta de diez píxeles del color
        de la página. Donde se cruzan dos juntas, las esquinas redondeadas
        dejan una muesca en forma de estrella. Los radios de celda y tablero se
        llevan exactamente el padding, o las curvas no son paralelas.

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
            const diseño = bentoDesign[card.id] ?? { tone: "aqua" as const, area: "", art: "velocidad" };
            const Tarjeta = tarjetas[diseño.art as keyof typeof tarjetas] ?? Velocidad;
            return (
              <article
                key={card.id}
                className={cn("overflow-hidden rounded-[var(--radius-celda)] bg-card", diseño.area)}
              >
                <Tarjeta card={card} tono={diseño.tone} figuras={bento.figures} />
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
