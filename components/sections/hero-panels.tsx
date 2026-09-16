/**
 * Los cuatro paneles del hero.
 *
 * Todos comparten el mismo armado: marco blanco, adentro un campo de color muy
 * desenfocado, encima una pieza de interfaz nítida y abajo el rótulo. El
 * contraste entre el fondo fuera de foco y la pieza en foco es lo que hace que
 * la vista caiga sola en el dato.
 *
 * Lo que cambia de uno a otro es la pieza, y cambia de forma y no solo de
 * número: una ficha con una curva, una con un reparto, un aviso que entra y un
 * resultado de búsqueda. Cuatro tarjetas con el mismo esqueleto se leen como
 * una sola repetida cuatro veces, por más que los números cambien.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del dashboard— sin duplicar el marcado.
 *
 * Los números son de muestra: son la forma del resultado, no una promesa.
 */

/**
 * El marco.
 *
 * El campo de color se dibuja en un contenedor más grande que la tarjeta y
 * recién ahí se desenfoca: desenfocar algo del tamaño exacto deja los bordes
 * lavados, porque el filtro mezcla con lo que hay afuera, que es nada.
 *
 * El velo de abajo va suave a propósito. La tinta sobre cualquiera de los
 * cuatro colores ya pasa contraste AA, así que aclarar la franja entera para
 * "asegurar" el texto era regalar el color sin ganar nada; alcanza con quitarle
 * fuerza a la mancha justo donde apoya el rótulo.
 */
function Card({
  stops,
  caption,
  children,
}: {
  stops: string[];
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full p-2.5">
      <div className="relative h-full overflow-hidden rounded-[14px]">
        <div
          aria-hidden
          className="absolute -inset-[30%]"
          style={{ background: stops.join(", "), filter: "blur(34px) saturate(1.15)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/50 via-white/15 to-transparent"
        />
        <div className="relative flex h-full flex-col p-3.5">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {children}
          </div>
          <p className="mt-2 text-[0.76rem] font-medium leading-none text-ink">
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/** La pieza nítida que flota sobre el campo. */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[92%] rounded-[10px] border border-white/80 bg-card px-3 py-2.5 shadow-[0_10px_26px_-10px_rgba(0,0,0,0.3)]">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */

/** Visitas: una ficha con la curva del mes. */
export function PanelVisitas() {
  const serie = [18, 24, 21, 30, 27, 38, 34, 46, 52, 61, 74, 88, 96];
  const w = 200;
  const h = 34;
  const puntos = serie
    .map((v, i) => {
      const x = (i / (serie.length - 1)) * w;
      return `${x.toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`;
    })
    .join(" ");

  return (
    <Card
      caption="Visitas al sitio"
      stops={[
        "radial-gradient(62% 72% at 18% 22%, #2f9d97 0%, transparent 66%)",
        "radial-gradient(58% 66% at 82% 12%, #8fd9d4 0%, transparent 62%)",
        "radial-gradient(70% 78% at 72% 88%, #166b67 0%, transparent 62%)",
        "linear-gradient(140deg, #6fcfca, #ddf2f0)",
      ]}
    >
      <Chip>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[1.15rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
            3.482
          </p>
          <span className="rounded-full bg-verde-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-verde-deep">
            ↑ 214%
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
          aria-hidden
          className="mt-2 h-[34px] w-full"
        >
          <defs>
            <linearGradient id="visitasArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6fcfca" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6fcfca" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${h} ${puntos} ${w},${h}`} fill="url(#visitasArea)" />
          <polyline
            points={puntos}
            fill="none"
            stroke="#2f9d97"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Chip>
    </Card>
  );
}

/** Tráfico: una ficha con el reparto en una sola barra. */
export function PanelTrafico() {
  const canales = [
    { name: "Google", pct: 58, fill: "bg-rosa" },
    { name: "Directo", pct: 27, fill: "bg-aqua" },
    { name: "Redes", pct: 15, fill: "bg-miel" },
  ];

  return (
    <Card
      caption="De dónde llegan"
      stops={[
        "radial-gradient(62% 72% at 22% 18%, #e0567a 0%, transparent 66%)",
        "radial-gradient(58% 66% at 88% 22%, #f2b64c 0%, transparent 62%)",
        "radial-gradient(70% 78% at 58% 92%, #ef85a0 0%, transparent 62%)",
        "linear-gradient(140deg, #f2a5b6, #fdeed4)",
      ]}
    >
      <Chip>
        <p className="text-[1.15rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
          58%{" "}
          <span className="text-[0.7rem] font-normal text-ink-faint">
            desde Google
          </span>
        </p>
        <div className="mt-2.5 flex h-1.5 gap-[3px]">
          {canales.map((c) => (
            <span
              key={c.name}
              className={`h-full rounded-full ${c.fill}`}
              style={{ width: `${c.pct}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[0.6rem] text-ink-soft">
          {canales.map((c) => (
            <span key={c.name} className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${c.fill}`} />
              {c.name}
            </span>
          ))}
        </div>
      </Chip>
    </Card>
  );
}

/** Consultas: el aviso que entra, como lo ve el cliente. */
export function PanelConsultas() {
  return (
    <Card
      caption="Consultas que entran"
      stops={[
        "radial-gradient(62% 72% at 18% 18%, #5fa348 0%, transparent 66%)",
        "radial-gradient(58% 66% at 88% 18%, #4fc4be 0%, transparent 62%)",
        "radial-gradient(70% 78% at 62% 92%, #8cc476 0%, transparent 62%)",
        "linear-gradient(140deg, #a6cf95, #e6f2df)",
      ]}
    >
      <Chip>
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-verde-deep" />
          </span>
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[0.76rem] font-semibold leading-tight">
              Consulta nueva
            </p>
            <p className="mt-0.5 truncate text-[0.66rem] text-ink-soft">
              Obra nueva · hace 4 min
            </p>
          </div>
        </div>
      </Chip>
    </Card>
  );
}

/** Google: el resultado de búsqueda, con el puesto adelante. */
export function PanelGoogle() {
  return (
    <Card
      caption="Posición en Google"
      stops={[
        "radial-gradient(62% 72% at 18% 18%, #e09a20 0%, transparent 66%)",
        "radial-gradient(58% 66% at 88% 20%, #ef85a0 0%, transparent 62%)",
        "radial-gradient(70% 78% at 58% 92%, #f2b64c 0%, transparent 62%)",
        "linear-gradient(140deg, #f4c87d, #fdeed4)",
      ]}
    >
      <Chip>
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.66rem] font-semibold tabular-nums text-paper">
            2
          </span>
          <div className="min-w-0 flex-1">
            <p className="whitespace-nowrap text-[0.72rem] font-medium leading-tight">
              estudio de arquitectura
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.62rem] text-ink-faint">
              estudiomartel.com
              <span className="font-semibold tabular-nums text-verde-deep">
                ↑ 6
              </span>
            </p>
          </div>
        </div>
      </Chip>
    </Card>
  );
}
