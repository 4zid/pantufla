/**
 * Los cuatro paneles del hero.
 *
 * Los cuatro miden lo mismo que el cliente mide: visitas, ventas, de dónde
 * viene la gente y en qué puesto aparece en Google. Ninguno habla de cómo
 * trabajamos —links de prueba, aprobaciones, el sitio por dentro—: eso le
 * importa a quien hace el sitio, no a quien lo paga.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del dashboard— sin duplicar el marcado.
 *
 * Los números son de muestra: son la forma del resultado, no una promesa.
 */

function Head({
  label,
  badge,
  tone,
}: {
  label: string;
  badge?: string;
  tone: "aqua" | "rosa" | "verde" | "miel";
}) {
  const pill = {
    aqua: "bg-aqua-soft text-aqua-deep",
    rosa: "bg-rosa-soft text-rosa-deep",
    verde: "bg-verde-soft text-verde-deep",
    miel: "bg-miel-soft text-miel-deep",
  }[tone];

  return (
    <div className="flex items-baseline justify-between gap-2">
      <p className="text-[0.72rem] font-medium text-ink-faint">{label}</p>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[0.66rem] font-semibold ${pill}`}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function Big({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[1.55rem] font-semibold leading-none tracking-[-0.035em] tabular-nums">
      {children}
    </p>
  );
}

/** Visitas al sitio, con la serie de los últimos meses. */
export function PanelVisitas() {
  const bars = [28, 34, 30, 44, 40, 56, 52, 68, 74, 88, 96, 100];

  return (
    <div className="flex h-full flex-col p-4">
      <Head label="Visitas al sitio · 30 días" badge="+214%" tone="aqua" />
      <Big>3.482</Big>
      <div className="mt-auto flex h-10 items-end gap-[3px] pt-2">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-[2px] bg-aqua"
            style={{ height: `${h}%`, opacity: 0.35 + (i / bars.length) * 0.65 }}
          />
        ))}
      </div>
    </div>
  );
}

/** Ventas cerradas y lo que entró por el sitio. */
export function PanelVentas() {
  const meses = [42, 58, 51, 70, 84, 100];

  return (
    <div className="flex h-full flex-col p-4">
      <Head label="Ventas del mes" badge="+9 vs. mayo" tone="verde" />
      <Big>24</Big>
      <p className="mt-1 text-[0.72rem] text-ink-faint">$ 1.152.000 facturados</p>
      <div className="mt-auto flex h-10 items-end gap-1.5 pt-2">
        {meses.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-[3px] bg-verde"
            style={{ height: `${h}%`, opacity: 0.4 + (i / meses.length) * 0.6 }}
          />
        ))}
      </div>
    </div>
  );
}

/** De dónde viene la gente que entra. */
export function PanelTrafico() {
  const canales = [
    { name: "Búsqueda en Google", pct: 58 },
    { name: "Directo", pct: 27 },
    { name: "Instagram", pct: 15 },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <Head label="De dónde llegan" tone="rosa" />
      <div className="mt-3 flex flex-col gap-2.5">
        {canales.map((c) => (
          <div key={c.name}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[0.72rem] text-ink-soft">{c.name}</span>
              <span className="text-[0.72rem] font-semibold tabular-nums">
                {c.pct}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-alt">
              <span
                className="block h-full rounded-full bg-rosa"
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
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
    <div className="flex h-full flex-col p-4">
      <Head label="Posición en Google" badge="3 en el top 5" tone="miel" />
      <ul className="mt-3 flex flex-col gap-2">
        {claves.map((k) => (
          <li key={k.q} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-miel-soft text-[0.66rem] font-semibold tabular-nums text-miel-deep">
              {k.pos}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.72rem] text-ink-soft">
              {k.q}
            </span>
            <span className="shrink-0 text-[0.68rem] font-medium tabular-nums text-verde-deep">
              ↑{k.sube}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
