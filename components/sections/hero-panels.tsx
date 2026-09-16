/**
 * Los cuatro paneles del hero.
 *
 * Cada uno representa una cosa distinta y, sobre todo, la representa con una
 * estructura distinta: una serie en el tiempo, un reparto, una lista de hechos
 * y una posición en una escala. Cuatro tarjetas con el mismo esqueleto
 * —etiqueta, número grande, porcentaje— se leen como una sola repetida cuatro
 * veces, por más que los números cambien.
 *
 * Dos registros visuales también: los dos primeros son tarjetas de dato
 * limpias sobre fondo claro; los dos últimos van sobre un degradé de malla con
 * un vidrio encima.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del dashboard— sin duplicar el marcado.
 *
 * Los números son de muestra: son la forma del resultado, no una promesa.
 */

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] text-ink-faint">{children}</p>;
}

function Pill({
  tone,
  children,
}: {
  tone: "aqua" | "rosa" | "verde" | "miel";
  children: React.ReactNode;
}) {
  const pill = {
    aqua: "bg-aqua-soft text-aqua-deep",
    rosa: "bg-rosa-soft text-rosa-deep",
    verde: "bg-verde-soft text-verde-deep",
    miel: "bg-miel-soft text-miel-deep",
  }[tone];

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${pill}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* 1 · Serie en el tiempo                                           */
/* ---------------------------------------------------------------- */

/**
 * Visitas: manda la curva, no el número.
 *
 * El área ocupa casi toda la tarjeta y el dato va chico arriba. Lo que tiene
 * que quedar de un vistazo es la forma de la subida; el valor exacto es
 * secundario y por eso no compite por el mismo tamaño.
 */
export function PanelVisitas() {
  const serie = [18, 24, 21, 30, 27, 38, 34, 46, 52, 61, 74, 88, 96];
  const w = 240;
  const h = 62;
  const puntos = serie.map((v, i) => {
    const x = (i / (serie.length - 1)) * w;
    const y = h - (v / 100) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Label>Visitas al sitio</Label>
        <Pill tone="verde">↑ 214%</Pill>
      </div>
      <p className="mt-1 text-[1.05rem] font-semibold tabular-nums">
        3.482{" "}
        <span className="font-normal text-ink-faint">en 30 días</span>
      </p>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden
        className="mt-auto h-[62px] w-full overflow-visible"
      >
        <defs>
          <linearGradient id="visitasArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6fcfca" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6fcfca" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${h} ${puntos.join(" ")} ${w},${h}`}
          fill="url(#visitasArea)"
        />
        <polyline
          points={puntos.join(" ")}
          fill="none"
          stroke="#2f9d97"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={w}
          cy={h - (serie[serie.length - 1] / 100) * h}
          r="3"
          fill="#2f9d97"
        />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 2 · Reparto                                                      */
/* ---------------------------------------------------------------- */

/** De dónde llega la gente: una sola barra partida, no tres sueltas. */
export function PanelTrafico() {
  const canales = [
    { name: "Google", pct: 58, fill: "bg-rosa", dot: "bg-rosa" },
    { name: "Directo", pct: 27, fill: "bg-aqua", dot: "bg-aqua" },
    { name: "Redes", pct: 15, fill: "bg-miel", dot: "bg-miel" },
  ];

  return (
    <div className="flex h-full flex-col p-5">
      <Label>De dónde llegan</Label>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
          58%
        </span>
        <span className="text-[0.78rem] text-ink-faint">desde Google</span>
      </p>

      <div className="mt-4 flex h-2 gap-1">
        {canales.map((c) => (
          <span
            key={c.name}
            className={`h-full rounded-full ${c.fill}`}
            style={{ width: `${c.pct}%` }}
          />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 divide-x divide-line border-t border-line pt-3">
        {canales.map((c) => (
          <div key={c.name} className="px-2 first:pl-0 last:pr-0">
            <p className="text-[0.66rem] text-ink-faint">{c.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.85rem] font-semibold tabular-nums">
              <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
              {c.pct}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Vidrio sobre degradé                                             */
/* ---------------------------------------------------------------- */

/**
 * Degradé de malla armado con manchas radiales superpuestas. Va en CSS y no
 * como imagen: pesa cero, no se pixela y sale de los mismos cuatro colores de
 * marca, así que el hero no estrena una paleta propia.
 */
function Mesh({
  stops,
  children,
}: {
  stops: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: stops.join(", ") }}
      />
      <div className="relative h-full p-5">
        {/* El vidrio va con margen adentro de la tarjeta: así el degradé lo
            enmarca en vez de quedar tapado. */}
        <div className="absolute inset-[14px] rounded-[14px] border border-white/60 bg-white/40 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur-2xl" />
        <div className="relative flex h-full flex-col px-2 py-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 3 · Lista de hechos                                              */
/* ---------------------------------------------------------------- */

/**
 * Consultas: qué entró y cuándo.
 *
 * Es una bitácora, no una métrica. Sin número grande a propósito: lo que
 * convence acá no es cuántas fueron sino que sean recientes y concretas.
 */
export function PanelConsultas() {
  const entradas = [
    { texto: "Obra nueva · Córdoba", meta: "hace 4 min", vivo: true },
    { texto: "Remodelación de local", meta: "hace 2 h" },
    { texto: "Presupuesto aceptado", meta: "$ 480.000" },
  ];

  return (
    <Mesh
      stops={[
        "radial-gradient(70% 80% at 10% 18%, #8cc476 0%, transparent 58%)",
        "radial-gradient(65% 75% at 90% 8%, #4fc4be 0%, transparent 60%)",
        "radial-gradient(80% 88% at 78% 98%, #ef85a0 0%, transparent 62%)",
        "radial-gradient(55% 65% at 35% 95%, #a6cf95 0%, transparent 58%)",
        "linear-gradient(140deg, #e6f2df, #ddf2f0)",
      ]}
    >
      <div className="flex items-start justify-between gap-2">
        <Label>Consultas que entraron</Label>
        <Pill tone="verde">6 esta semana</Pill>
      </div>

      <ul className="mt-auto flex flex-col gap-2.5">
        {entradas.map((e) => (
          <li key={e.texto} className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {e.vivo ? (
                <span className="absolute inline-flex h-full w-full rounded-full bg-verde-deep opacity-40" />
              ) : null}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-verde-deep" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.74rem] text-ink">
              {e.texto}
            </span>
            <span className="shrink-0 text-[0.66rem] tabular-nums text-ink-soft">
              {e.meta}
            </span>
          </li>
        ))}
      </ul>
    </Mesh>
  );
}

/* ---------------------------------------------------------------- */
/* 4 · Posición en una escala                                       */
/* ---------------------------------------------------------------- */

/**
 * Google: dónde cae en la escala de resultados.
 *
 * Una lista de puestos dice el número pero no dice si está bien. La escala sí:
 * el 1 a la izquierda y el 10 a la derecha, y las tres búsquedas marcadas
 * encima. Se ve de un saque que están todas del lado bueno.
 */
export function PanelGoogle() {
  const claves = [
    { q: "estudio de arquitectura", pos: 2 },
    { q: "obra nueva", pos: 1 },
    { q: "remodelación", pos: 4 },
  ];
  // El 1 va casi pegado al borde izquierdo y el 10 casi al derecho.
  const x = (pos: number) => 6 + ((pos - 1) / 9) * 88;

  return (
    <Mesh
      stops={[
        "radial-gradient(70% 80% at 8% 12%, #f2b64c 0%, transparent 58%)",
        "radial-gradient(65% 75% at 92% 18%, #ef85a0 0%, transparent 60%)",
        "radial-gradient(75% 85% at 68% 98%, #4fc4be 0%, transparent 62%)",
        "radial-gradient(60% 70% at 30% 90%, #f4c87d 0%, transparent 60%)",
        "linear-gradient(140deg, #fdeed4, #fbe4e9)",
      ]}
    >
      <div className="flex items-start justify-between gap-2">
        <Label>Posición en Google</Label>
        <Pill tone="miel">3 en el top 5</Pill>
      </div>

      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
          2.º
        </span>
        <span className="text-[0.74rem] text-ink-soft">promedio</span>
      </p>

      <div className="mt-auto">
        <div className="relative h-7">
          <div className="absolute inset-x-0 top-[18px] h-1 rounded-full bg-gradient-to-r from-ink/70 to-ink/10" />
          {claves.map((k) => (
            <span
              key={k.q}
              title={k.q}
              style={{ left: `${x(k.pos)}%` }}
              className="absolute top-0 flex h-[19px] w-[19px] -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-ink text-[0.6rem] font-semibold tabular-nums text-paper shadow-sm"
            >
              {k.pos}
            </span>
          ))}
        </div>
        <div className="mt-0.5 flex justify-between text-[0.62rem] text-ink-soft">
          <span>1.º</span>
          <span>10.º</span>
        </div>
      </div>
    </Mesh>
  );
}
