/**
 * Composición del hero: una ventana de navegador con una vista previa
 * abstracta del sitio, y encima la tarjeta de presupuesto que resume la
 * promesa comercial (alcance, plazo y precio cerrados).
 * Todo es HTML y CSS: no hay imágenes que cargar.
 */
export function HeroVisual() {
  return (
    <div className="relative mt-16 md:mt-20">
      <div className="shell">
        <div className="relative mx-auto max-w-5xl">
          {/* Ventana */}
          <div className="overflow-hidden rounded-t-panel border border-line-strong border-b-0 bg-card shadow-[0_-1px_0_rgba(255,255,255,0.8)_inset,0_40px_80px_-40px_rgba(35,28,18,0.28)]">
            {/* Chrome */}
            <div className="flex items-center gap-3 border-b border-line bg-paper-alt/70 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[0.7rem] text-ink-faint">
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                  <path
                    d="M3.4 5.2V3.9a2.6 2.6 0 1 1 5.2 0v1.3M2.9 5.2h6.2v4.2H2.9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
                estudiomartel.com
              </div>
              <div className="w-12" />
            </div>

            {/* Vista previa del sitio */}
            <div className="relative h-[300px] px-6 pt-7 sm:h-[380px] sm:px-10 md:h-[440px] md:px-14">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-[5px] bg-ink" />
                  <div className="h-2 w-14 rounded-full bg-ink/85" />
                </div>
                <div className="hidden gap-5 sm:flex">
                  <div className="h-1.5 w-9 rounded-full bg-line-strong" />
                  <div className="h-1.5 w-12 rounded-full bg-line-strong" />
                  <div className="h-1.5 w-8 rounded-full bg-line-strong" />
                </div>
                <div className="h-6 w-20 rounded-full bg-ink" />
              </div>

              <div className="mt-12 grid gap-8 sm:mt-16 md:grid-cols-[1.15fr_1fr] md:items-center">
                <div>
                  <div className="h-1.5 w-24 rounded-full bg-clay/45" />
                  <p className="mt-4 text-[1.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.1rem] md:text-[2.5rem]">
                    Arquitectura
                    <br />
                    que se habita.
                  </p>
                  <div className="mt-5 space-y-2">
                    <div className="h-1.5 w-full max-w-[280px] rounded-full bg-line-strong" />
                    <div className="h-1.5 w-full max-w-[230px] rounded-full bg-line-strong" />
                  </div>
                  <div className="mt-6 flex gap-2.5">
                    <div className="h-8 w-28 rounded-full bg-ink" />
                    <div className="h-8 w-24 rounded-full border border-line-strong" />
                  </div>
                </div>

                <div className="hidden gap-3 md:grid md:grid-cols-2">
                  <div
                    className="h-40 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(155deg, #e8ddd0 0%, #cdbca8 100%)",
                    }}
                  />
                  <div className="grid gap-3">
                    <div
                      className="h-[74px] rounded-xl"
                      style={{
                        background:
                          "linear-gradient(155deg, #e6cfc3 0%, #c98d70 100%)",
                      }}
                    />
                    <div className="h-[74px] rounded-xl border border-line bg-paper-alt" />
                  </div>
                </div>
              </div>

              {/* Desvanecido inferior para que la ventana se funda con la página */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>

          {/* Tarjeta de presupuesto */}
          <div className="absolute -bottom-6 left-2 w-[260px] rotate-[-2.5deg] rounded-card border border-line-strong bg-card p-4 shadow-[0_24px_50px_-24px_rgba(35,28,18,0.35)] sm:-bottom-8 sm:left-6 sm:w-[290px] md:-bottom-10 md:left-0">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Propuesta
              </p>
              <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[0.68rem] font-semibold text-clay">
                Enviada en 21 h
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-[0.82rem]">
              <div className="flex justify-between">
                <dt className="text-ink-faint">Plan</dt>
                <dd className="font-medium">Sitio</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-faint">Alcance</dt>
                <dd className="font-medium">5 páginas + CMS</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-faint">Entrega</dt>
                <dd className="font-medium">18 de octubre</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-[0.82rem] text-ink-faint">Precio cerrado</span>
              <span className="text-[1.15rem] font-semibold tracking-[-0.02em]">
                USD 2.200
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
