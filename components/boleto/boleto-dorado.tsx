"use client";

import { useId, useRef, useState, type CSSProperties } from "react";

import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { site } from "@/content/site";
import {
  reservarLugar,
  soltarBoleto,
  useBoleto,
  type OrigenBoleto,
} from "@/lib/boleto";
import { cn } from "@/lib/cn";

/**
 * El boleto dorado: un pase para reservar el lugar en la agenda.
 *
 * Hay tres en la home y son el mismo. El de la portada y el de la última
 * sección son formularios de verdad; el tercero es la copia que vuela entre
 * los dos con el scroll (boleto-vuelo.tsx), que es solo dibujo: `decorativo`
 * pinta lo mismo sin un solo campo, porque un formulario que se mueve solo
 * por la pantalla no es algo que nadie pueda completar. Los tres leen el
 * mismo estado (lib/boleto.ts), así que si se reserva arriba, el que vuela y
 * el que aterriza ya llegan reservados.
 *
 * Con el mouse encima se inclina y el brillo sigue al puntero: es lo que le
 * da el reflejo holográfico. Con el dedo no, porque el toque es para escribir;
 * y con menos movimiento pedido, tampoco.
 */
export function BoletoDorado({
  origen,
  decorativo = false,
  className,
  style,
}: {
  origen: OrigenBoleto;
  decorativo?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { boleto } = useCopy();
  const locale = useLocale();
  const estado = useBoleto();
  const raiz = useRef<HTMLDivElement>(null);
  const campo = useId();
  const [email, setEmail] = useState("");
  const [trampa, setTrampa] = useState("");

  const reservado = estado.fase === "reservado";
  const enviando = estado.fase === "enviando";

  /* La inclinación escribe variables en el elemento y no pasa por el estado
     de React: son decenas de movimientos por segundo y no hay nada que
     volver a dibujar más que esas cuatro variables. */
  const inclinar = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = raiz.current;
    if (!el || decorativo || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.dataset.inclinando = "";
    el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--hx", `${(15 + x * 70).toFixed(1)}%`);
  };

  const soltar = () => {
    const el = raiz.current;
    if (!el) return;
    delete el.dataset.inclinando;
    for (const v of ["--rx", "--ry", "--mx", "--my", "--hx"]) {
      el.style.removeProperty(v);
    }
  };

  const mensaje =
    estado.fase === "error"
      ? estado.motivo === "invalido"
        ? boleto.invalid
        : fill(boleto.error, { email: site.email })
      : "";

  return (
    <div
      ref={raiz}
      data-boleto={decorativo ? undefined : origen}
      onPointerMove={inclinar}
      onPointerLeave={soltar}
      className={cn("boleto w-full max-w-[29rem]", className)}
      style={style}
    >
      <div className="boleto-papel">
        <div className="relative z-[1] min-w-0 flex-1 p-5 sm:p-6">
          <div className="boleto-relieve flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
            <span>{boleto.kicker}</span>
            <span className="tabular-nums opacity-70">{boleto.serial}</span>
          </div>

          <p className="boleto-relieve mt-3 text-[2rem] font-semibold leading-none tracking-[-0.035em] sm:text-[2.35rem]">
            {boleto.title}{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em]">
              {boleto.titleAccent}
            </span>
          </p>

          {reservado ? (
            <div className="mt-3">
              <p className="text-[0.95rem] font-semibold">
                ✓ {boleto.success.title}
              </p>
              <p className="mt-1 text-[0.88rem] leading-snug opacity-80">
                {fill(boleto.success.body, { email: estado.email })}
              </p>
              {decorativo ? null : (
                <button
                  type="button"
                  onClick={soltarBoleto}
                  className="mt-3 text-[0.82rem] font-medium underline decoration-[rgba(58,40,4,0.4)] underline-offset-4 hover:decoration-[var(--tinta)]"
                >
                  {boleto.success.reset}
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mt-2 max-w-[22rem] text-[0.9rem] leading-snug opacity-80">
                {boleto.body}
              </p>

              {decorativo ? (
                /* El mismo dibujo que el formulario, sin serlo. */
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <div className="flex h-11 items-center rounded-full border sm:flex-1 border-[rgba(58,40,4,0.22)] bg-[rgba(255,255,255,0.55)] px-4 text-[0.92rem] text-[rgba(42,28,2,0.5)]">
                    {boleto.placeholder}
                  </div>
                  <div className="flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#2a1c02] px-5 text-[0.88rem] font-semibold text-[#ffe7a0]">
                    {boleto.submit}
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!enviando) {
                      void reservarLugar(email, origen, locale, trampa);
                    }
                  }}
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                >
                  <label htmlFor={campo} className="sr-only">
                    {boleto.label}
                  </label>
                  <input
                    id={campo}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={boleto.placeholder}
                    aria-invalid={estado.fase === "error" || undefined}
                    aria-describedby={`${campo}-estado`}
                    className="h-11 w-full min-w-0 rounded-full border sm:w-auto sm:flex-1 border-[rgba(58,40,4,0.22)] bg-[rgba(255,255,255,0.55)] px-4 text-[0.92rem] text-[#2a1c02] placeholder:text-[rgba(42,28,2,0.5)] focus:outline-none focus-visible:border-[rgba(58,40,4,0.6)] focus-visible:ring-2 focus-visible:ring-[rgba(58,40,4,0.35)]"
                  />
                  {/* La trampa para bots, como en el brief: no se ve ni se
                      llega con el teclado. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={trampa}
                    onChange={(e) => setTrampa(e.target.value)}
                    className="hidden"
                  />
                  <button
                    type="submit"
                    disabled={enviando}
                    className="h-11 whitespace-nowrap rounded-full bg-[#2a1c02] px-5 text-[0.88rem] font-semibold text-[#ffe7a0] transition-opacity hover:opacity-90 disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2a1c02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f1cd5e]"
                  >
                    {enviando ? boleto.sending : boleto.submit}
                  </button>
                </form>
              )}

              <p
                id={decorativo ? undefined : `${campo}-estado`}
                aria-live={decorativo ? undefined : "polite"}
                className={cn(
                  "mt-2 min-h-[1.1rem] text-[0.75rem]",
                  mensaje ? "font-medium text-[#7a1d0c]" : "opacity-65",
                )}
              >
                {mensaje || boleto.fine}
              </p>
            </>
          )}
        </div>

        <div
          aria-hidden
          className="boleto-talon relative z-[1] flex shrink-0 flex-col items-center justify-between py-5"
        >
          <span className="boleto-relieve rotate-180 text-[0.66rem] font-semibold uppercase tracking-[0.22em] [writing-mode:vertical-rl]">
            {boleto.stub}
          </span>
          <span className="boleto-codigo h-14 w-7 rounded-[2px] sm:h-16 sm:w-8" />
        </div>

        {reservado ? (
          /* El sello: le cambia la cara al boleto para que se vea de lejos
             que ya está usado, también en el que vuela. */
          <span
            aria-hidden
            className="pointer-events-none absolute right-[calc(var(--talon)+0.9rem)] top-4 z-[2] rotate-[-11deg] rounded-md border-2 border-[rgba(122,29,12,0.7)] px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[rgba(122,29,12,0.75)]"
          >
            OK
          </span>
        ) : null}
      </div>
    </div>
  );
}
