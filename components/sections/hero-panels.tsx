/**
 * Los cuatro paneles del hero.
 *
 * Miden lo que mide el cliente: visitas, de dónde llega la gente, en qué
 * puesto de Google aparece y cuánto vendió. Ninguno habla de cómo trabajamos
 * —links de prueba, aprobaciones, el sitio por dentro—: eso le importa a quien
 * hace el sitio, no a quien lo paga.
 *
 * Dos registros a propósito. Los dos primeros son tarjetas de dato limpias:
 * fondo claro, etiqueta chica, número grande y liviano, y el gráfico en una
 * sola familia de color. Los dos últimos van sobre un degradé de malla con un
 * vidrio encima. Alternarlos es lo que le saca al hero el aire de plantilla de
 * dashboard, donde las cuatro tarjetas son la misma tarjeta cuatro veces.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del dashboard— sin duplicar el marcado.
 *
 * Los números son de muestra: son la forma del resultado, no una promesa.
 */

const TONES = {
  aqua: { fill: "bg-aqua", pill: "bg-aqua-soft text-aqua-deep" },
  rosa: { fill: "bg-rosa", pill: "bg-rosa-soft text-rosa-deep" },
  verde: { fill: "bg-verde", pill: "bg-verde-soft text-verde-deep" },
  miel: { fill: "bg-miel", pill: "bg-miel-soft text-miel-deep" },
} as const;

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] text-ink-faint">{children}</p>;
}

/** El número grande, con su unidad al lado en gris y sin peso. */
function Figure({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="mt-1 flex items-baseline gap-1.5">
      <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
        {value}
      </span>
      {unit ? (
        <span className="text-[0.78rem] text-ink-faint">{unit}</span>
      ) : null}
    </p>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${TONES[tone].pill}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Dos de dato limpio                                               */
/* ---------------------------------------------------------------- */

/** Visitas, con la serie del mes como mapa de calor. */
export function PanelVisitas() {
  // Tres semanas de siete días. El valor es la intensidad del color.
  const semanas = [
    [0.25, 0.3, 0.22, 0.4, 0.35, 0.18, 0.2],
    [0.4, 0.55, 0.45, 0.62, 0.5, 0.3, 0.35],
    [0.7, 0.85, 0.75, 1, 0.9, 0.55, 0.6],
  ];

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Label>Visitas al sitio</Label>
        <Pill tone="verde">↑ 214%</Pill>
      </div>
      <Figure value="3.482" unit="últimos 30 días" />

      <div className="mt-auto flex flex-col gap-1">
        {semanas.map((semana, i) => (
          <div key={i} className="flex gap-1">
            {semana.map((v, j) => (
              <span
                key={j}
                className="h-[13px] flex-1 rounded-[3px] bg-aqua"
                style={{ opacity: 0.16 + v * 0.84 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** De dónde llega la gente, con el reparto en una sola barra. */
export function PanelTrafico() {
  const canales = [
    { name: "Google", pct: 58, tone: "rosa" as const },
    { name: "Directo", pct: 27, tone: "aqua" as const },
    { name: "Redes", pct: 15, tone: "miel" as const },
  ];

  return (
    <div className="flex h-full flex-col p-5">
      <Label>De dónde llegan</Label>
      <Figure value="58%" unit="desde Google" />

      {/* Una sola barra partida en tres: el reparto se lee de un vistazo,
          cosa que tres barras sueltas no dan. */}
      <div className="mt-4 flex h-2 gap-1 overflow-hidden rounded-full">
        {canales.map((c) => (
          <span
            key={c.name}
            className={`h-full rounded-full ${TONES[c.tone].fill}`}
            style={{ width: `${c.pct}%` }}
          />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 divide-x divide-line border-t border-line pt-3">
        {canales.map((c) => (
          <div key={c.name} className="px-2 first:pl-0 last:pr-0">
            <p className="text-[0.66rem] text-ink-faint">{c.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.85rem] font-semibold tabular-nums">
              <span
                className={`h-1.5 w-1.5 rounded-full ${TONES[c.tone].fill}`}
              />
              {c.pct}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Dos de vidrio sobre degradé                                      */
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
      {/* El vidrio: desenfoca el degradé de atrás y lo aclara lo justo para
          que el texto encima pase contraste sin tapar el color. */}
      <div className="relative flex h-full flex-col p-5">
        <div className="absolute inset-[14px] rounded-[14px] border border-white/60 bg-white/40 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur-2xl" />
        <div className="relative flex h-full flex-col px-2 py-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

/** En qué puesto de Google aparece, por búsqueda. */
export function PanelSeo() {
  const claves = [
    { q: "estudio de arquitectura", pos: 2, sube: 6 },
    { q: "obra nueva córdoba", pos: 1, sube: 3 },
    { q: "remodelación de casas", pos: 4, sube: 9 },
  ];

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
      <ul className="mt-auto flex flex-col gap-1.5">
        {claves.map((k) => (
          <li key={k.q} className="flex items-center gap-2">
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-ink text-[0.6rem] font-semibold tabular-nums text-paper">
              {k.pos}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.7rem] text-ink-soft">
              {k.q}
            </span>
            <span className="shrink-0 text-[0.66rem] font-semibold tabular-nums text-verde-deep">
              ↑{k.sube}
            </span>
          </li>
        ))}
      </ul>
    </Mesh>
  );
}

/** Ventas cerradas y lo que entró por el sitio. */
export function PanelVentas() {
  const meses = [42, 58, 51, 70, 84, 100];

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
        <Label>Ventas del mes</Label>
        <Pill tone="verde">↑ 9</Pill>
      </div>
      <Figure value="24" unit="$ 1.152.000" />

      <div className="mt-auto flex h-9 items-end gap-1.5">
        {meses.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-[4px] bg-ink"
            style={{ height: `${h}%`, opacity: 0.18 + (i / meses.length) * 0.62 }}
          />
        ))}
      </div>
    </Mesh>
  );
}
