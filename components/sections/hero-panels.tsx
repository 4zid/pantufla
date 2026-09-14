/**
 * Los cuatro paneles del hero. No hablan del sitio en sí sino de lo que el
 * cliente saca de él: el sitio publicado, las visitas subiendo, una venta
 * nueva y la conversación de aprobación.
 *
 * Cada uno es una función suelta para poder usarlo dos veces —flotando
 * alrededor del título y adentro del dashboard— sin duplicar el marcado.
 */

export function PanelSitio() {
  return (
    <div className="h-full overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-paper-alt/70 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
        <span className="ml-2 text-[0.62rem] text-ink-faint">
          estudiomartel.com
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-3 rounded-[4px] bg-ink" />
          <div className="flex gap-2">
            <div className="h-1 w-6 rounded-full bg-line-strong" />
            <div className="h-1 w-8 rounded-full bg-line-strong" />
          </div>
          <div className="h-4 w-12 rounded-full bg-ink" />
        </div>
        <p className="mt-4 text-[1.15rem] font-semibold leading-[1.05] tracking-[-0.03em]">
          Arquitectura
          <br />
          que se habita.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div
            className="h-14 rounded-md"
            style={{ background: "linear-gradient(150deg,#fce0e6,#f2a5b6)" }}
          />
          <div
            className="h-14 rounded-md"
            style={{ background: "linear-gradient(150deg,#e8ddd0,#cdbca8)" }}
          />
          <div className="h-14 rounded-md border border-line bg-paper-alt" />
        </div>

      </div>
    </div>
  );
}

export function PanelAnalytics() {
  const bars = [28, 34, 30, 44, 40, 56, 52, 68, 74, 88, 96, 100];

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-[0.72rem] font-medium text-ink-faint">
          Visitas · 30 días
        </p>
        <span className="rounded-full bg-aqua-soft px-2 py-0.5 text-[0.66rem] font-semibold text-aqua-deep">
          +214%
        </span>
      </div>
      <p className="mt-1.5 text-[1.4rem] font-semibold leading-none tracking-[-0.03em]">
        3.482
      </p>
      <div className="mt-auto flex h-8 items-end gap-[3px] pt-2">
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

export function PanelVentas() {
  return (
    <div className="flex h-full flex-col justify-center p-4">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-verde opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-verde-deep" />
        </span>
        <p className="text-[0.72rem] font-medium text-verde-deep">Nueva venta</p>
        <span className="ml-auto text-[0.66rem] text-ink-faint">hace 4 min</span>
      </div>
      <p className="mt-2 text-[1.4rem] font-semibold leading-none tracking-[-0.03em]">
        $ 48.000
      </p>
      <p className="mt-1.5 text-[0.72rem] text-ink-faint">
        Consulta de obra nueva · 7ª del mes
      </p>
    </div>
  );
}

export function PanelChat() {
  return (
    <div className="flex h-full flex-col gap-2 p-3.5">
      <p className="text-[0.7rem] font-medium text-ink-faint">
        Paula · Estudio Martel
      </p>
      <div className="flex flex-1 flex-col justify-center gap-2">
        <div className="flex justify-start">
          <p className="max-w-[88%] rounded-[12px] rounded-bl-[4px] bg-paper-alt px-3 py-2 text-[0.72rem] leading-snug">
            Te dejo el link de prueba:{" "}
            <span className="text-aqua-deep underline underline-offset-2">
              martel.pantufla.dev
            </span>
          </p>
        </div>
        <div className="flex justify-end">
          <p className="max-w-[88%] rounded-[12px] rounded-br-[4px] bg-aqua-soft px-3 py-2 text-[0.72rem] leading-snug text-aqua-deep">
            Quedó buenísimo. Lo aprobamos.
          </p>
        </div>
        <div className="flex justify-start">
          <p className="max-w-[88%] rounded-[12px] rounded-bl-[4px] bg-paper-alt px-3 py-2 text-[0.72rem] leading-snug">
            Lo publico hoy y te paso los accesos.
          </p>
        </div>
      </div>
    </div>
  );
}
