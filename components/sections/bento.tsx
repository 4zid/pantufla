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
 * Las cuatro capacidades, en tablero.
 *
 * Cuatro tarjetas iguales en fila se leen como una lista y se saltean como una
 * lista. Con tamaños distintos el ojo entra por la más grande y recorre el
 * resto, y de paso cada forma puede llevar algo que en las otras no entraría:
 * la vertical es forma de pila de pantallas y la ancha es la única donde entra
 * una secuencia de izquierda a derecha.
 *
 * Y cada tarjeta lleva su propio dibujo, no una variante del mismo. La primera
 * versión tenía cuatro esqueletos de barras grises con distinto color de
 * fondo: por más que el layout fuera de bento, las cuatro figuras decían lo
 * mismo —«acá va algo»— y la sección se leía como una plantilla. Un dibujo
 * tiene que decir lo que dice su tarjeta y no poder estar en ninguna de las
 * otras tres.
 *
 * Por eso llevan texto de verdad adentro, y no renglones grises. Es lo que
 * separa una figura que se lee como una pantalla de una que se lee como
 * relleno. Es poco texto y sale del copy, así que se traduce con el resto.
 */

/** El tono de cada tarjeta, en clases, porque Tailwind no arma nombres al vuelo. */
const tonos = {
  aqua: {
    texto: "text-aqua-deep",
    fondo: "bg-aqua-soft",
    trazo: "stroke-aqua-deep",
    relleno: "fill-aqua",
    solido: "bg-aqua",
    profundo: "bg-aqua-deep",
  },
  rosa: {
    texto: "text-rosa-deep",
    fondo: "bg-rosa-soft",
    trazo: "stroke-rosa-deep",
    relleno: "fill-rosa",
    solido: "bg-rosa",
    profundo: "bg-rosa-deep",
  },
  verde: {
    texto: "text-verde-deep",
    fondo: "bg-verde-soft",
    trazo: "stroke-verde-deep",
    relleno: "fill-verde",
    solido: "bg-verde",
    profundo: "bg-verde-deep",
  },
  miel: {
    texto: "text-miel-deep",
    fondo: "bg-miel-soft",
    trazo: "stroke-miel-deep",
    relleno: "fill-miel",
    solido: "bg-miel",
    profundo: "bg-miel-deep",
  },
} as const;

type Tono = keyof typeof tonos;

/**
 * La tinta de los dibujos no es la del tema, y es a propósito.
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
const PAPEL = "#ffffff";

/** La sombra de las piezas que flotan arriba del pastel. */
const FLOTA = `0 1px 2px ${tinta(6)}, 0 14px 30px -18px ${tinta(45)}`;

type ArteProps = {
  tono: Tono;
  figuras: {
    speedOurs: string;
    speedTheirs: string;
    seoQuestion: string;
    seoAnswer: string;
    formButton: string;
  };
};

/* ------------------------------------------------------------------ */
/* 1. Velocidad — el cronómetro                                        */
/* ------------------------------------------------------------------ */

/**
 * Un arco que se llena y el número adentro, grande.
 *
 * El número es el dibujo: en un sitio donde la tipografía ya funciona como
 * imagen, «0,9 s» puesto en cuerpo grande dice más rápido lo que la tarjeta
 * cuenta en cuatro renglones que cualquier ícono de velocímetro. El arco está
 * para darle escala —hasta dónde llegaría— y la marca del fondo, para decir
 * contra qué se compara.
 *
 * El arco va de 180° a 0°, o sea media vuelta, y el largo se calcula: radio 46
 * por pi. Ese número entra en el dasharray para que el relleno sea el 30% del
 * arco y no un valor a ojo que habría que retocar cada vez que cambie el radio.
 */
const ARCO = Math.PI * 46;

function Cronometro({ tono, figuras }: ArteProps) {
  const t = tonos[tono];
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const raiz = scope.current;
      if (!raiz) return;
      const relleno = raiz.querySelector("[data-relleno]");
      if (!relleno) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(relleno, { strokeDashoffset: ARCO * 0.7 });
        return;
      }

      gsap.fromTo(
        relleno,
        { strokeDashoffset: ARCO },
        {
          strokeDashoffset: ARCO * 0.7,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: raiz, start: START, once: true },
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex h-full items-center justify-center px-6 py-6">
      <div className="relative w-[13rem] max-w-full">
        <svg viewBox="0 0 120 64" className="w-full" aria-hidden>
          {/* El riel: hasta acá llegaría la barra de alguien que tarda tres
              segundos. Es la referencia, así que va apagado. */}
          <path
            d="M14 58 A 46 46 0 0 1 106 58"
            fill="none"
            stroke={tinta(10)}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            data-relleno
            d="M14 58 A 46 46 0 0 1 106 58"
            fill="none"
            className={t.trazo}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={ARCO}
            strokeDashoffset={ARCO}
          />
        </svg>

        {/* El número va encima del arco y no adentro del SVG: así hereda la
            tipografía del sitio en vez de quedar atado a una fuente que el
            SVG tendría que resolver por su cuenta. */}
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p
            className={cn(
              "text-[2.6rem] font-semibold leading-none tracking-[-0.045em] tabular-nums",
              t.texto,
            )}
          >
            {figuras.speedOurs}
          </p>
        </div>

        {/* La marca del otro extremo, al pie del riel, chiquita. */}
        <span
          className="absolute bottom-0 right-0 text-[0.72rem] font-medium tabular-nums"
          style={{ color: tinta(38) }}
        >
          {figuras.speedTheirs}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. SEO — la respuesta                                               */
/* ------------------------------------------------------------------ */

/**
 * Una pregunta escrita y la respuesta que la contesta.
 *
 * La tarjeta habla de que te encuentren, y no solo en Google: lo que hay que
 * dibujar entonces no es un resultado de búsqueda sino una respuesta, que es
 * la forma que tiene hoy. Va inclinada apenas y cortada por el borde de abajo,
 * como si siguiera fuera de la tarjeta; una pieza centrada y entera se ve
 * pegada, una que se sale del cuadro se ve como un pedazo de algo más grande.
 *
 * Los tres puntitos de arriba son las fuentes. Sin logos: poner marcas ajenas
 * en un dibujo decorativo es prestarle autoridad al sitio que no es suya.
 */
function Respuesta({ tono, figuras }: ArteProps) {
  const t = tonos[tono];
  return (
    <div className="flex h-full items-end justify-center overflow-hidden px-5 pt-7">
      <div className="w-full max-w-[19rem] -rotate-[1.4deg]">
        {/* La pregunta, como la escribiría alguien: en minúscula y sin punto. */}
        <p
          className="mb-2.5 pl-1 text-[0.8rem] italic"
          style={{ color: tinta(45) }}
        >
          {figuras.seoQuestion}
        </p>

        <div
          className="rounded-t-2xl px-4 pb-6 pt-3.5"
          style={{ background: PAPEL, boxShadow: FLOTA }}
        >
          <div className="mb-3 flex items-center gap-1.5">
            {[t.solido, t.profundo, ""].map((clase, i) => (
              <span
                key={i}
                className={cn("block h-1.5 w-1.5 rounded-full", clase)}
                style={clase ? undefined : { background: tinta(18) }}
              />
            ))}
            <span
              className="ml-1 text-[0.62rem] font-medium uppercase tracking-[0.14em]"
              style={{ color: tinta(35) }}
            >
              3
            </span>
          </div>

          <p className="text-[0.86rem] leading-[1.5]" style={{ color: tinta(82) }}>
            {figuras.seoAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pantallas — las tres pantallas                                   */
/* ------------------------------------------------------------------ */

/**
 * Los bloques de adentro de cada marco, que es lo que se rearma.
 *
 * La fila de abajo cambia de cantidad —tres, dos, una— y eso es todo el punto
 * de la figura: el mismo contenido repartido distinto según el ancho. Los
 * altos también cambian, porque en una columna sola el bloque puede ser más
 * alto sin apretar nada, que es exactamente lo que pasa de verdad.
 */
function Bloques({
  columnas,
  alto,
  tono,
}: {
  columnas: number;
  alto: string;
  tono: Tono;
}) {
  const t = tonos[tono];
  return (
    <div className="space-y-2">
      <span className={cn("block h-2 w-[45%] rounded-full", t.solido)} />
      <span className="block h-1.5 w-full rounded-full" style={{ background: tinta(13) }} />
      <div className="flex gap-2 pt-1">
        {Array.from({ length: columnas }).map((_, i) => (
          <span
            key={i}
            className={cn("block flex-1 rounded-md", alto)}
            style={{ background: tinta(11) }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * La misma página en tres anchos, una arriba de la otra.
 *
 * Un teléfono solo no dice nada: un teléfono se ve prolijo o no se ve, pero no
 * cuenta que la sección se rearmó. Tres marcos con la misma página en tres
 * columnas, dos y una sí lo cuentan, y de paso usan el alto de la tarjeta
 * vertical, que es lo que esa forma pide.
 *
 * Los tres arrancan pegados al borde izquierdo y terminan cada vez más adentro:
 * el de escritorio se sale por la derecha, el de tablet queda corto y el
 * teléfono más corto todavía. Esa escalera es la que se lee como «el mismo
 * contenido, tres anchos». Centrados y enteros serían tres piezas simétricas
 * apiladas, que es un diagrama y no una composición.
 */
function Pantallas({ tono }: { tono: Tono }) {
  const marco = { background: PAPEL, boxShadow: FLOTA } as const;

  return (
    <div className="flex h-full flex-col justify-center gap-6 overflow-hidden py-8 pl-7">
      {/* Escritorio: barra de ventana y tres columnas. */}
      <div className="-mr-12 rounded-l-2xl rounded-r-md p-3" style={marco}>
        <div className="mb-2.5 flex gap-1.5 pl-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: tinta(15) }}
            />
          ))}
        </div>
        <Bloques columnas={3} alto="h-8" tono={tono} />
      </div>

      {/* Tablet: dos columnas y un poco más de aire. */}
      <div className="mr-12 rounded-xl p-3" style={marco}>
        <Bloques columnas={2} alto="h-10" tono={tono} />
      </div>

      {/* Teléfono: una sola, más alta, con la muesca para que se lea qué es. */}
      <div className="mr-24 rounded-2xl p-3 pt-3.5" style={marco}>
        <span
          className="mx-auto mb-2.5 block h-1 w-6 rounded-full"
          style={{ background: tinta(16) }}
        />
        <Bloques columnas={1} alto="h-12" tono={tono} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Resultados — del formulario a la curva                           */
/* ------------------------------------------------------------------ */

/**
 * Un formulario, una flecha y la curva que sube.
 *
 * Es la única tarjeta ancha, así que es la única donde entra una secuencia
 * leída de izquierda a derecha: esto lleva a esto. Y es lo que dice el texto
 * —que cada decisión del formulario sale de la misma pregunta— contado en una
 * figura en vez de en un gráfico suelto que podría estar en cualquier tarjeta.
 *
 * La curva se descubre con un rect que crece y no con strokeDasharray. El dash
 * se mide en unidades del viewBox: en cuanto el SVG se escala —y acá se escala
 * distinto en cada ancho— el patrón se estira con él y la línea aparece
 * cortada por la mitad.
 */
const CURVA = "M0 176 C 56 170, 98 156, 140 132 S 236 78, 290 52 S 360 18, 400 8";
const AREA = `${CURVA} L400 200 L0 200 Z`;

function Formulario({ tono, figuras }: ArteProps) {
  const t = tonos[tono];
  const scope = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  useGSAP(
    () => {
      registerGsap();
      const raiz = scope.current;
      if (!raiz) return;
      const barrido = raiz.querySelector("[data-barrido]");
      if (!barrido) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(barrido, { attr: { width: 420 } });
        return;
      }

      gsap.to(barrido, {
        attr: { width: 420 },
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: raiz, start: START, once: true },
      });
    },
    { scope },
  );

  return (
    <div className="relative min-h-[18rem] overflow-hidden" ref={scope}>
      {/*
        La curva es el fondo del panel, no una pieza al costado.

        Con preserveAspectRatio en none el dibujo se estira para ocupar todo,
        que es lo que hace falta: la proporción del panel cambia con el ancho
        de la pantalla y una curva que mantiene la suya deja una franja de
        color vacía arriba. Estirar el trazo no se nota —es una curva suave,
        no una figura reconocible— y el ancho de la línea queda igual gracias
        a non-scaling-stroke.

        Los puntos sobre la curva se fueron por esto mismo: un círculo bajo un
        estirado no uniforme se convierte en un óvalo. No hacían falta.
      */}
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <clipPath id={`barrido-${id}`}>
            <rect data-barrido x="-10" y="-10" width="0" height="240" />
          </clipPath>
        </defs>

        {[50, 100, 150].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke={tinta(6)}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <g clipPath={`url(#barrido-${id})`}>
          <path d={AREA} className={t.relleno} fillOpacity="0.3" />
          <path
            d={CURVA}
            fill="none"
            className={t.trazo}
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/*
        Y el formulario encima, parado sobre su propia curva.

        Antes iban uno al lado del otro con una flecha en el medio y la tarjeta
        quedaba en tres tiras finitas: formulario chico, flecha chica, gráfico
        chico. Superpuestos dicen mejor lo que hay que decir, que no es «esto y
        aquello» sino «esto produce aquello». La flecha sobraba: con las dos
        cosas encimadas, el sentido ya está.

        Va arriba a la izquierda porque es donde la curva está baja. Abajo la
        taparía justo donde arranca.
      */}
      <div
        className="absolute left-6 top-6 w-[10.5rem] rounded-xl p-3 sm:left-8 sm:top-8 sm:w-[11.5rem]"
        style={{ background: PAPEL, boxShadow: FLOTA }}
      >
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-4 w-full rounded"
              style={{ background: tinta(7) }}
            />
          ))}
        </div>
        {/* El botón va en tinta y no en el tono de la tarjeta: es el botón
            primario del sitio, y dibujarlo de otro color sería dibujar un
            formulario que no es el nuestro. */}
        <span
          className="mt-2.5 block rounded py-1.5 text-center text-[0.7rem] font-semibold"
          style={{ background: TINTA, color: PAPEL }}
        >
          {figuras.formButton}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const lienzos = {
  cronometro: Cronometro,
  respuesta: Respuesta,
  pantallas: Pantallas,
  formulario: Formulario,
};

/**
 * Cuánto mide el lienzo de cada tarjeta.
 *
 * Las dos chicas de arriba lo llevan fijo, y eso es lo que hace que las dos
 * franjas de color empiecen a la misma altura. Con flex-1 no empezaban: las
 * tarjetas de una fila miden todas lo mismo, así que la que tiene el texto más
 * corto le regalaba los píxeles sobrantes a su lienzo y el escalón se veía.
 * Ahora el sobrante queda arriba, en el bloque de texto, donde son veinte
 * píxeles de aire que nadie mira.
 *
 * La vertical sí crece: tiene setecientos píxeles que llenar con las tres
 * pantallas. La ancha no está acá porque no apila: su dibujo va al lado del
 * texto y ocupa media tarjeta de alto completo.
 */
const ALTO: Record<string, string> = {
  cronometro: "h-[11rem] shrink-0",
  respuesta: "h-[11rem] shrink-0",
  pantallas: "min-h-[20rem] flex-1",
};

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
        Un tablero y no cuatro tarjetas sueltas.

        Las cuatro viven adentro de un mismo contenedor, separadas por una
        junta de diez píxeles. Esa junta es todo el dibujo: donde se cruzan
        dos juntas, las cuatro esquinas redondeadas que se encuentran dejan
        una muesca en forma de estrella, y donde una junta muere contra el
        borde de la tarjeta vertical queda una te. No hay que dibujar nada de
        eso, sale solo de redondear las tarjetas y dejarlas respirar.

        El relleno del tablero es el color de la página y no un gris propio.
        Se probó con papel apagado, que es el gris de más abajo del blanco, y
        la junta no se veía: cuatro por ciento de diferencia contra el blanco
        de la tarjeta es menos de lo que separa a dos blancos, y las muescas
        —que son el motivo de armar el tablero— no aparecían. Con el color de
        la página la junta se lee como un hueco por donde se ve el fondo, que
        es exactamente lo que es.

        Tres columnas y dos filas en md: las dos chicas arriba a la izquierda,
        la vertical ocupando la columna de la derecha entera y la ancha abajo
        cruzando las dos primeras. Abajo de md se cae sola a una columna, que
        es lo único que entra en un teléfono.
      */}
      <div className="mt-14 rounded-[var(--radius-tablero)] border border-line bg-mist p-2.5 shadow-[0_24px_60px_-40px_rgba(35,28,18,0.35)]">
        <Reveal stagger className="grid gap-2.5 md:grid-cols-3">
          {bento.cards.map((card) => {
            const diseño = bentoDesign[card.id] ?? {
              tone: "aqua" as const,
              area: "",
              art: "cronometro",
              composicion: "apilada" as const,
            };
            const t = tonos[diseño.tone];
            const Lienzo = lienzos[diseño.art as keyof typeof lienzos] ?? Cronometro;
            const alLado = diseño.composicion === "lado";

            const texto = (
              <div className={cn("p-6 md:p-7", alLado && "md:flex md:flex-col md:justify-center")}>
                <span
                  aria-hidden
                  className={cn("block h-2 w-2 rounded-full", t.solido)}
                />
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.3rem]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-ink-soft">
                  {card.body}
                </p>
              </div>
            );

            const dibujo = (
              <div
                data-lienzo
                className={cn(
                  t.fondo,
                  alLado
                    ? ""
                    : cn("mt-auto", ALTO[diseño.art] ?? ALTO.cronometro),
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
                  /* Al lado: dos columnas de alto completo, el texto a la
                     izquierda y el dibujo a la derecha. Es lo que rompe la
                     repetición; con las cuatro apiladas, por más distinto que
                     fuera cada dibujo, se leían como la misma tarjeta cuatro
                     veces. En teléfono vuelve a apilarse, que es lo único que
                     entra. */
                  alLado
                    ? "grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] md:items-stretch"
                    : "flex flex-col",
                  diseño.area,
                )}
              >
                {texto}
                {dibujo}
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
