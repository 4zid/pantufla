"use client";

import { useCopy } from "@/components/copy-provider";

/**
 * Los cuatro paneles del hero: un panel de administración del sitio.
 *
 * No son cuatro variantes del mismo cuadrito. Miden lo mismo que mide el
 * cliente y cada uno lo muestra distinto: una serie en el tiempo, dos
 * indicadores sueltos y un reparto. Además son de tres tamaños, que es lo que
 * hace que el tablero se lea como un tablero y no como una grilla de iguales.
 *
 * El registro es el de un producto real: blanco, esquinas amplias, sombra
 * apenas insinuada, la etiqueta en tinta y no en gris, y el número grande con
 * la unidad chica al lado. Nada de bordes marcados: lo que separa una tarjeta
 * de otra es el aire y la sombra, no una línea.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del tablero— sin duplicar el marcado.
 *
 * Los números son de muestra: son la forma del resultado, no una promesa.
 */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-[20px] bg-card p-5">
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.92rem] font-semibold tracking-[-0.01em]">{children}</p>
  );
}

function Badge({
  children,
  variant = "soft",
}: {
  children: React.ReactNode;
  variant?: "soft" | "solid";
}) {
  return (
    <span
      className={
        variant === "solid"
          ? "shrink-0 rounded-full bg-ink px-2.5 py-1 text-[0.66rem] font-semibold text-paper"
          : "shrink-0 rounded-full bg-verde-soft px-2.5 py-1 text-[0.66rem] font-semibold text-verde-deep"
      }
    >
      {children}
    </span>
  );
}

/** El triángulo de tendencia, como en el tablero de referencia. */
function Trend() {
  return (
    <svg viewBox="0 0 12 10" aria-hidden className="h-2.5 w-3 text-verde-deep">
      <path d="M6 0.6 11.4 9.4H0.6L6 0.6Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Grande · la serie del mes                                        */
/* ---------------------------------------------------------------- */

/**
 * Visitas, con el área rayada de la referencia.
 *
 * El relleno son barras verticales finas y no un degradé: da la textura de
 * dato medido —una lectura por día— en vez de una mancha decorativa.
 */
export function PanelVisitas() {
  const { visits, visitsStats, visitsAxis } = useCopy().hero.dashboard;
  const serie = [
    52, 55, 54, 53, 51, 47, 44, 42, 41, 41, 43, 46, 50, 55, 58, 60, 62, 68, 76,
    84, 90, 93, 95, 96, 96, 97, 97, 98,
  ];
  const w = 320;
  const h = 150;
  const x = (i: number) => (i / (serie.length - 1)) * w;
  const y = (v: number) => h - (v / 100) * (h - 8) - 4;

  // Curva suave: cada tramo usa dos manejadores a media distancia, que es lo
  // que evita los picos angulosos sin inventar valores intermedios.
  const curva = serie
    .map((v, i) => {
      if (i === 0) return `M ${x(0)} ${y(v)}`;
      const px = x(i - 1);
      const cx = (px + x(i)) / 2;
      return `C ${cx} ${y(serie[i - 1])} ${cx} ${y(v)} ${x(i)} ${y(v)}`;
    })
    .join(" ");

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <Title>{visits.title}</Title>
        <Badge variant="solid">{visits.badge}</Badge>
      </div>
      <p className="mt-1.5 text-[1.9rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
        {visits.value}
      </p>

      <div className="relative mt-4 flex-1 overflow-hidden rounded-[14px] bg-mist/70 p-3">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-hidden
          className="h-full w-full"
        >
          <defs>
            <clipPath id="visitasClip">
              <path d={`${curva} L ${w} ${h} L 0 ${h} Z`} />
            </clipPath>
          </defs>
          <g clipPath="url(#visitasClip)">
            {serie.map((_, i) => (
              <line
                key={i}
                x1={x(i)}
                x2={x(i)}
                y1="0"
                y2={h}
                stroke="#121212"
                strokeOpacity="0.28"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <path
            d={curva}
            fill="none"
            stroke="#121212"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-2.5 flex justify-between px-1 text-[0.62rem] text-ink-faint">
        {visitsAxis.map((fecha) => (
          <span key={fecha}>{fecha}</span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-3 divide-x divide-line border-t border-line pt-4">
        {visitsStats.map((s) => (
          <div key={s.key} className="px-3 first:pl-0 last:pr-0">
            <dt className="text-[0.68rem] text-ink-faint">{s.key}</dt>
            <dd className="mt-1 text-[0.95rem] font-semibold tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Chicos · dos indicadores                                         */
/* ---------------------------------------------------------------- */

/** Conversión: el número que importa, grande y solo. */
export function PanelConversion() {
  const { conversion } = useCopy().hero.dashboard;
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <Title>{conversion.title}</Title>
        <Badge>{conversion.badge}</Badge>
      </div>
      <p className="mt-1 text-[0.7rem] text-ink-faint">{conversion.note}</p>

      <div className="mt-auto flex items-end justify-between">
        <p className="text-[2rem] font-semibold leading-none tracking-[-0.045em] tabular-nums">
          4,8
          <span className="ml-0.5 text-[1.15rem] font-normal text-ink-faint">
            %
          </span>
        </p>
        <Trend />
      </div>
    </Card>
  );
}

/** Velocidad, con el selector de dispositivo de la referencia. */
export function PanelVelocidad() {
  const { speed } = useCopy().hero.dashboard;
  const donde = [
    { label: speed.mobile, activo: true },
    { label: speed.desktop, activo: false },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <Title>{speed.title}</Title>
        <Badge>{speed.badge}</Badge>
      </div>

      <div className="mt-2.5 flex gap-1.5">
        {donde.map((d) => (
          <span
            key={d.label}
            className={
              d.activo
                ? "rounded-lg bg-mist px-2 py-1 text-[0.62rem] font-medium"
                : "rounded-lg px-2 py-1 text-[0.62rem] text-ink-faint"
            }
          >
            {d.label}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between">
        <p className="text-[2rem] font-semibold leading-none tracking-[-0.045em] tabular-nums">
          96
          <span className="ml-0.5 text-[1.15rem] font-normal text-ink-faint">
            /100
          </span>
        </p>
        <Trend />
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Mediano · el reparto                                             */
/* ---------------------------------------------------------------- */

/** De dónde llega la gente: la barra partida y el detalle debajo. */
export function PanelTrafico() {
  const { traffic, visits } = useCopy().hero.dashboard;
  const canales = [
    { name: traffic.channels[0], pct: 48, n: "5.990", fill: "bg-aqua" },
    { name: traffic.channels[1], pct: 32, n: "3.990", fill: "bg-rosa" },
    { name: traffic.channels[2], pct: 12, n: "1.500", fill: "bg-verde" },
    { name: traffic.channels[3], pct: 8, n: "1.000", fill: "bg-miel" },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Title>{traffic.title}</Title>
          <p className="mt-0.5 text-[0.7rem] text-ink-faint">{traffic.note}</p>
        </div>
        <Badge variant="solid">{visits.value}</Badge>
      </div>

      <div className="mt-3 flex h-3 gap-1 rounded-full bg-mist p-[3px]">
        {canales.map((c) => (
          <span
            key={c.name}
            className={`h-full rounded-full ${c.fill}`}
            style={{ width: `${c.pct}%` }}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-1 flex-col justify-between">
        {canales.map((c) => (
          <li key={c.name} className="flex items-center gap-2 text-[0.72rem]">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.fill}`} />
            <span className="min-w-0 flex-1 truncate text-ink-soft">
              {c.name}
            </span>
            <span className="shrink-0 tabular-nums text-ink-faint">
              {c.pct}%
            </span>
            <span className="w-12 shrink-0 text-right font-semibold tabular-nums">
              {c.n}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
