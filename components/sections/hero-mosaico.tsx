import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { CAJA_ISO_PESADO, ISO_PESADO } from "@/components/ui/brand";
import { pantallasDeRespaldo, type Pantalla } from "@/content/hero-galeria";

/**
 * El visual del hero: una grilla de mosaicos oscuros, quieta.
 *
 * Reemplaza a la galería que corría como un riel, que resultaba muy grande
 * y lenta. La referencia que se eligió es una grilla de portfolio de
 * producto: mosaicos casi negros con piezas sueltas adentro —un teléfono
 * con la app, la fila de íconos, un componente arrancado de la pantalla—.
 * Esto es esa idea con el material de Pantufla:
 *
 * - Los íconos de Pantufla, la chinela en tinta sobre los cuatro colores de
 *   la marca. La marca solo admite tinta (o aqua sobre oscuro): los colores
 *   van en la placa, nunca en el iso.
 * - Teléfonos con pantallas reales de Kine, 2MG y Tierras Argentinas,
 *   derechos, cortados por el borde del mosaico.
 * - El dock: los íconos de los proyectos en una repisa. Es el único detalle
 *   que responde: el del medio está agrandado con su nombre arriba, y al
 *   pasar el mouse el agrandado pasa a ser el que está debajo. Con CSS, sin
 *   JavaScript.
 * - Un componente de Daily, la semana del registro, rehecho en HTML sobre un
 *   plano verde: una pieza de interfaz sacada de la página, como el gráfico
 *   sobre pasto de la referencia.
 *
 * Nada se mueve solo (por eso no hay botón de pausa: no hay qué pausar) y
 * nada está inclinado ni flota: un primer intento de miniaturas con piezas
 * giradas y tarjetas sueltas se descartó por eso, por leerse como «AI slop».
 *
 * Los mosaicos son negros en los dos temas, y sus colores van fijos y no en
 * tokens: son un objeto, como una foto, y el hero siempre está en claro.
 * Todo se dimensiona en unidades del contenedor (cqw), así cada pieza
 * guarda su proporción con el mosaico en cualquier ancho.
 *
 * Las pantallas salen de las que cada proyecto carga en el Studio
 * («Pantallas para la portada»), las de teléfono, en orden; si un proyecto
 * no tiene, van las de respaldo de content/hero-galeria.ts. Son decorado
 * (alt vacío): la grilla entera tiene un nombre para el lector de pantalla.
 */

/** Qué pantalla de teléfono de cada proyecto va en cada mosaico (0 = la primera). */
const TELEFONOS = {
  kine: { proyecto: "kine", n: 1, barra: "#eeeef3" },
  "2mg": { proyecto: "2mg", n: 0, barra: null },
  tierras: { proyecto: "tierras-argentinas", n: 1, barra: null },
} as const;

/**
 * La pantalla de teléfono número `n` de un proyecto: la del Studio, o la de
 * respaldo si el proyecto no cargó ninguna.
 */
function movil(
  pantallas: Pantalla[],
  proyecto: string,
  n: number,
): Pantalla | undefined {
  const de = (lista: Pantalla[]) =>
    lista.filter((p) => p.proyecto === proyecto && p.formato === "mobile");
  const propias = de(pantallas);
  const lista = propias.length ? propias : de(pantallasDeRespaldo);
  return lista[n] ?? lista[0];
}

/* ------------------------------------------------------------------ */
/* Piezas                                                              */
/* ------------------------------------------------------------------ */

/** El mosaico: la placa negra con el radio grande. */
function Mosaico({
  area,
  className = "",
  children,
}: {
  area: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ gridArea: area }}
      className={`group/mosaico relative overflow-hidden rounded-[20px] bg-[#141415] [container-type:inline-size] md:rounded-[24px] ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * El teléfono: marco negro con un filo claro (sobre el mosaico negro, sin
 * filo el marco desaparece), la isla y la pantalla. `barra` dibuja la
 * hora y la batería arriba, del color del fondo de la app, para las
 * capturas que no la traen; las de Tierras Argentinas y 2MG ya la tienen.
 *
 * Se dimensiona con --w (un ancho en cqw): el radio, el marco y la barra
 * salen de ahí.
 */
function Telefono({
  pantalla,
  barra,
  sizes,
}: {
  pantalla?: Pantalla;
  barra: string | null;
  sizes: string;
}) {
  return (
    <div className="w-(--w) rounded-[calc(var(--w)*0.165)] bg-[#0a0a0b] p-[calc(var(--w)*0.028)] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_30px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="relative overflow-hidden rounded-[calc(var(--w)*0.14)] bg-[#f4f4f6]">
        {barra ? (
          <div
            aria-hidden
            style={{ backgroundColor: barra }}
            className="flex h-[calc(var(--w)*0.11)] items-center justify-between px-[calc(var(--w)*0.08)] pt-[calc(var(--w)*0.02)] text-[calc(var(--w)*0.042)] font-semibold text-[#111]"
          >
            <span>9:41</span>
            <span className="h-[calc(var(--w)*0.035)] w-[calc(var(--w)*0.07)] rounded-[2px] border border-[#111] p-px">
              <span className="block h-full w-[80%] rounded-[1px] bg-[#111]" />
            </span>
          </div>
        ) : null}
        {pantalla ? (
          <Image
            src={pantalla.src}
            alt=""
            width={pantalla.ancho}
            height={pantalla.alto}
            sizes={sizes}
            className="block h-auto w-full"
          />
        ) : (
          <div className="aspect-[9/19.5]" />
        )}
        <span
          aria-hidden
          className="absolute left-1/2 top-[calc(var(--w)*0.03)] h-[calc(var(--w)*0.085)] w-[calc(var(--w)*0.3)] -translate-x-1/2 rounded-full bg-[#0a0a0b]"
        />
      </div>
    </div>
  );
}

/**
 * Un teléfono parado en el mosaico: arriba con aire, abajo cortado por el
 * borde. Al pasar el mouse sube un poco.
 */
function TelefonoEnMosaico({
  pantalla,
  barra,
  ancho,
  arriba,
  sizes,
}: {
  pantalla?: Pantalla;
  barra: string | null;
  /** El ancho del teléfono en cqw del mosaico. */
  ancho: number;
  /** Cuánto aire arriba, en cqw. */
  arriba: number;
  sizes: string;
}) {
  return (
    <div
      style={
        { "--w": `${ancho}cqw`, paddingTop: `${arriba}cqw` } as CSSProperties
      }
      className="flex justify-center transition-transform duration-500 ease-out group-hover/mosaico:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover/mosaico:translate-y-0"
    >
      <Telefono pantalla={pantalla} barra={barra} sizes={sizes} />
    </div>
  );
}

/** La chinela de Pantufla, en tinta. */
function Chinela({ className }: { className?: string }) {
  return (
    <svg viewBox={CAJA_ISO_PESADO} className={className} aria-hidden>
      <path d={ISO_PESADO} fill="currentColor" />
    </svg>
  );
}

/** Los cuatro colores de la marca, en su tono base (ver globals.css). */
const COLORES_MARCA = ["#6fcfca", "#f2a5b6", "#a6cf95", "#f4c87d"];

/** Los íconos de Pantufla: la misma chinela sobre los cuatro colores. */
function IconosPantufla() {
  return (
    <div className="absolute inset-[3.5cqw] flex items-center justify-center gap-[3.2cqw] rounded-[14px] bg-[#1c1c1e] md:rounded-[18px]">
      {COLORES_MARCA.map((color) => (
        <span
          key={color}
          style={{ backgroundColor: color }}
          className="flex aspect-square w-[17cqw] items-center justify-center rounded-[4.2cqw] text-[#0e0e0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_24px_-10px_rgba(0,0,0,0.7)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Chinela className="w-[64%]" />
        </span>
      ))}
    </div>
  );
}

/* Los íconos de app de los proyectos, dibujados a partir de sus marcas:
   el iso de cada sitio sobre su color. Son aproximaciones a mano, a la
   escala de un ícono; el detalle de cada logo no sobrevive a 60px. */

function IconoKine() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-[#1d5c3e]">
      <svg viewBox="0 0 24 24" className="w-[62%]" fill="#fff" aria-hidden>
        <rect x="8" y="5.5" width="8" height="3.4" rx="1.7" />
        <rect x="5.5" y="10.3" width="13" height="3.4" rx="1.7" />
        <rect x="8" y="15.1" width="8" height="3.4" rx="1.7" />
      </svg>
    </span>
  );
}

function IconoDaily() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-[#dfeee5]">
      <svg viewBox="0 0 24 24" className="w-[58%]" aria-hidden>
        <circle cx="12" cy="12" r="11" fill="#2b6a4e" />
        <path d="M6.5 15.5a5.5 5.5 0 0 1 11 0Z" fill="#fff" />
        <rect x="5.5" y="15.5" width="13" height="1.6" rx=".8" fill="#fff" />
      </svg>
    </span>
  );
}

function IconoTierras() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-white">
      <svg viewBox="0 0 24 24" className="w-[52%]" aria-hidden>
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          fill="none"
          stroke="#111"
          strokeWidth="1.8"
        />
        <rect x="5.5" y="12.5" width="6" height="6" fill="#1f6fd6" />
      </svg>
    </span>
  );
}

function Icono2mg() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-[#ef7d2d]">
      <span
        aria-hidden
        className="logo-cliente aspect-[178/181] w-[54%] text-[#111]"
        style={{ "--logo": "url(/logos/clientes/2mg.png)" } as CSSProperties}
      />
    </span>
  );
}

function IconoPantufla() {
  return (
    <span className="flex h-full w-full items-center justify-center bg-[#0e0e0e] text-[#6fcfca]">
      <Chinela className="w-[64%]" />
    </span>
  );
}

const DOCK = [
  { id: "pantufla", nombre: "Pantufla", Icono: IconoPantufla },
  { id: "kine", nombre: "Kine", Icono: IconoKine },
  { id: "tierras", nombre: "Tierras Argentinas", Icono: IconoTierras },
  { id: "daily", nombre: "Daily", Icono: IconoDaily },
  { id: "2mg", nombre: "2MG", Icono: Icono2mg },
];

/** El del medio arranca agrandado y con el nombre. */
const DEL_MEDIO = "tierras";

/**
 * El dock: una repisa a lo ancho del mosaico con los íconos de los
 * proyectos; los de las puntas quedan cortados por el borde, como en una
 * captura. El agrandado es el del medio; con el mouse encima de la repisa
 * se achica y se agranda el que está debajo del puntero. Es CSS puro
 * (group-hover), así que en un teléfono, sin hover, queda el del medio.
 */
function Dock() {
  return (
    <div className="group/dock absolute inset-x-0 top-[36%] flex h-[42%] items-center justify-center gap-[5cqw] border-y border-white/[0.06] bg-[#1d1d1f]">
      {DOCK.map(({ id, nombre, Icono }) => {
        const medio = id === DEL_MEDIO;
        return (
          <span
            key={id}
            className={`group/icono relative shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              medio
                ? "scale-[1.22] group-hover/dock:scale-100 hover:scale-[1.22]!"
                : "hover:scale-[1.22]"
            }`}
          >
            <span className="block aspect-square w-[21cqw] overflow-hidden rounded-[5cqw] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_12px_26px_-12px_rgba(0,0,0,0.8)]">
              <Icono />
            </span>
            <span
              className={`pointer-events-none absolute bottom-[calc(100%+2.2cqw)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3a3a3d] px-[2.6cqw] py-[0.9cqw] text-[2.9cqw] font-medium leading-none text-white/90 transition-opacity duration-200 motion-reduce:transition-none ${
                medio
                  ? "opacity-100 group-hover/dock:opacity-0 group-hover/icono:opacity-100!"
                  : "opacity-0 group-hover/icono:opacity-100"
              }`}
            >
              {nombre}
            </span>
            <span
              className={`absolute left-1/2 top-[calc(100%+2.4cqw)] h-[1.3cqw] w-[1.3cqw] -translate-x-1/2 rounded-full bg-white/50 transition-opacity duration-200 motion-reduce:transition-none ${
                medio
                  ? "opacity-100 group-hover/dock:opacity-0 group-hover/icono:opacity-100!"
                  : "opacity-0 group-hover/icono:opacity-100"
              }`}
            />
          </span>
        );
      })}
    </div>
  );
}

/** Los días de la semana de Daily, con cuántas actividades tiene cada uno. */
const SEMANA = [
  { dia: "Lun", n: 12, cuenta: 8 },
  { dia: "Mar", n: 13, cuenta: 7 },
  { dia: "Mié", n: 14, cuenta: 0 },
  { dia: "Jue", n: 15, cuenta: 9 },
  { dia: "Vie", n: 16, cuenta: 5, hoy: true },
  { dia: "Sáb", n: 17, cuenta: 0 },
  { dia: "Dom", n: 18, cuenta: 0 },
];

/**
 * La semana del registro de Daily, rehecha en HTML: el saludo, el rango,
 * el botón del informe y los siete días con el de hoy en negro. Va sobre un
 * plano verde, apoyada abajo y cortada por el borde.
 */
function SemanaDaily() {
  return (
    <div className="absolute inset-[3.5cqw] overflow-hidden rounded-[14px] bg-[#c9d8c5] md:rounded-[18px]">
      <div className="absolute inset-x-[7cqw] top-[20%] rounded-[4cqw] bg-white p-[5cqw] text-[#16181d] shadow-[0_24px_50px_-20px_rgba(20,40,25,0.55)] transition-transform duration-500 ease-out group-hover/mosaico:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover/mosaico:translate-y-0">
        <div className="flex items-start justify-between gap-[3cqw]">
          <div>
            <p className="text-[3.1cqw] leading-tight text-[#6b6f78]">
              Hola, Martina · Semana 42
            </p>
            <p className="mt-[1.4cqw] text-[7.2cqw] font-semibold leading-none tracking-[-0.03em]">
              12 – 18 oct
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[#16181d] px-[3cqw] py-[1.6cqw] text-[3cqw] font-medium leading-none text-white">
            Ver informe
          </span>
        </div>
        <div className="mt-[5cqw] grid grid-cols-7 gap-[1.6cqw]">
          {SEMANA.map(({ dia, n, cuenta, hoy }) => (
            <span
              key={dia}
              className={`flex flex-col items-center gap-[1cqw] rounded-[2.6cqw] py-[2cqw] ${
                hoy ? "bg-[#16181d] text-white" : "bg-[#f1f2f5] text-[#16181d]"
              }`}
            >
              <span
                className={`text-[2.5cqw] leading-none ${hoy ? "text-white/70" : "text-[#7a7e87]"}`}
              >
                {dia}
              </span>
              <span className="text-[4.4cqw] font-semibold leading-none">
                {n}
              </span>
              <span
                className={`text-[2.3cqw] leading-none ${hoy ? "text-white/70" : "text-[#9a9ea6]"}`}
              >
                {cuenta ? cuenta : "·"}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-[5cqw] flex items-center gap-[3cqw] border-t border-[#eceef1] pt-[4cqw]">
          <span className="flex h-[8cqw] w-[8cqw] items-center justify-center rounded-full bg-[#fdecec] text-[#d4553d]">
            <svg
              viewBox="0 0 16 16"
              className="w-[52%]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M3 6h8v3.5A3.5 3.5 0 0 1 7.5 13h-1A3.5 3.5 0 0 1 3 9.5Z" />
              <path d="M11 7h1a1.5 1.5 0 0 1 0 3h-1M6 2.5v1.5M8.5 2.5v1.5" />
            </svg>
          </span>
          <span>
            <span className="block text-[3.6cqw] font-medium leading-tight">
              Desayuno con mate
            </span>
            <span className="block text-[2.9cqw] leading-tight text-[#7a7e87]">
              07:30 – 08:00 · Comidas
            </span>
          </span>
        </div>
        <div className="mt-[3.5cqw] flex items-center gap-[3cqw] border-t border-[#eceef1] pt-[3.5cqw]">
          <span className="flex h-[8cqw] w-[8cqw] items-center justify-center rounded-full bg-[#e8f0fd] text-[#3768c8]">
            <svg
              viewBox="0 0 16 16"
              className="w-[52%]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 7.5 8 3.5l5 4V13H3Z" />
              <path d="M6.5 13v-3h3v3" />
            </svg>
          </span>
          <span>
            <span className="block text-[3.6cqw] font-medium leading-tight">
              Viaje al trabajo
            </span>
            <span className="block text-[2.9cqw] leading-tight text-[#7a7e87]">
              08:15 – 09:00 · Tareas
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* La grilla                                                           */
/* ------------------------------------------------------------------ */

/*
   Las áreas por ancho. En el teléfono, dos columnas: el teléfono de Kine
   alto a la izquierda, los íconos y el de 2MG a la derecha. En tablet,
   tres: entra el dock y la semana de Daily. Desde lg, las cuatro de la
   referencia, con Tierras Argentinas alto a la derecha. Un mosaico que no
   está en las áreas de un ancho se esconde (hidden + su display en el ancho
   donde aparece).
*/
const GRILLA =
  "grid h-[340px] grid-cols-2 grid-rows-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-2.5 [grid-template-areas:'c_a'_'c_e'] md:h-[460px] md:grid-cols-3 md:gap-3 md:[grid-template-areas:'a_c_d'_'b_c_e'] lg:grid-cols-[1.08fr_1fr_1fr_1.08fr] lg:[grid-template-areas:'a_c_d_f'_'b_c_e_f'] xl:h-[540px]";

export function HeroMosaico({
  pantallas,
  label,
}: {
  pantallas: Pantalla[];
  /** El nombre de la grilla para el lector de pantalla. */
  label: string;
}) {
  const kine = movil(pantallas, TELEFONOS.kine.proyecto, TELEFONOS.kine.n);
  const dosmg = movil(pantallas, TELEFONOS["2mg"].proyecto, TELEFONOS["2mg"].n);
  const tierras = movil(
    pantallas,
    TELEFONOS.tierras.proyecto,
    TELEFONOS.tierras.n,
  );

  return (
    <div
      data-entra
      role="img"
      aria-label={label}
      style={{ "--entra": "0.45s" } as CSSProperties}
      className="mx-auto mt-12 w-full max-w-[90rem] px-3 md:mt-16 md:px-5"
    >
      <div className={GRILLA}>
        <Mosaico area="a">
          <IconosPantufla />
        </Mosaico>

        <Mosaico area="b" className="hidden md:block">
          <SemanaDaily />
        </Mosaico>

        <Mosaico area="c">
          <TelefonoEnMosaico
            pantalla={kine}
            barra={TELEFONOS.kine.barra}
            ancho={72}
            arriba={13}
            sizes="(min-width: 1024px) 230px, (min-width: 768px) 200px, 36vw"
          />
        </Mosaico>

        <Mosaico area="d" className="hidden md:block">
          <Dock />
        </Mosaico>

        <Mosaico area="e">
          <TelefonoEnMosaico
            pantalla={dosmg}
            barra={TELEFONOS["2mg"].barra}
            ancho={58}
            arriba={14}
            sizes="(min-width: 1024px) 190px, (min-width: 768px) 160px, 28vw"
          />
        </Mosaico>

        <Mosaico area="f" className="hidden lg:block">
          <TelefonoEnMosaico
            pantalla={tierras}
            barra={TELEFONOS.tierras.barra}
            ancho={72}
            arriba={13}
            sizes="(min-width: 1024px) 240px, 0px"
          />
        </Mosaico>
      </div>
    </div>
  );
}
