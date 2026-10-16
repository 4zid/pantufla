"use client";

import { useId, useState } from "react";

import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import {
  reservarLugar,
  soltarPase,
  usePase,
  type OrigenPase,
} from "@/lib/pase";

/**
 * El formulario del pase: el mail para reservar un lugar en la agenda.
 *
 * Va debajo del pase y no adentro: el pase es un objeto 3D que se dobla, se
 * da vuelta y vuela, y un campo de texto tiene que quedarse quieto y derecho
 * para que alguien escriba. A cambio, el pase se entera: cuando la reserva
 * sale, imprime el mail en su cara (ver pase-3d.ts).
 *
 * Hay uno en la portada y otro en el cierre, y comparten el estado
 * (lib/pase.ts): reservar en uno deja reservado al otro.
 */
export function PaseFormulario({
  origen,
  className,
}: {
  origen: OrigenPase;
  className?: string;
}) {
  const { pase } = useCopy();
  const locale = useLocale();
  const estado = usePase();
  const campo = useId();
  const [email, setEmail] = useState("");
  const [trampa, setTrampa] = useState("");

  const enviando = estado.fase === "enviando";
  const mensaje =
    estado.fase === "error"
      ? estado.motivo === "invalido"
        ? pase.invalid
        : fill(pase.error, { email: site.email })
      : "";

  if (estado.fase === "reservado") {
    return (
      <div className={cn("text-[0.95rem]", className)} aria-live="polite">
        <p className="font-semibold text-ink">✓ {pase.success.title}</p>
        <p className="mt-1 text-ink-soft">
          {fill(pase.success.body, { email: estado.email })}
        </p>
        <button
          type="button"
          onClick={soltarPase}
          className="mt-2 text-[0.85rem] font-medium text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
        >
          {pase.success.reset}
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-[0.95rem] font-medium text-ink">{pase.body}</p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!enviando) void reservarLugar(email, origen, locale, trampa);
        }}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor={campo} className="sr-only">
          {pase.label}
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
          placeholder={pase.placeholder}
          aria-invalid={estado.fase === "error" || undefined}
          aria-describedby={`${campo}-estado`}
          className="h-12 w-full min-w-0 rounded-full border border-line-strong bg-card px-5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none sm:w-auto sm:flex-1"
        />
        {/* La trampa para bots, como en el brief: no se ve ni se llega con
            el teclado. */}
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
          className="h-12 whitespace-nowrap rounded-full bg-ink px-6 text-[0.95rem] font-medium text-on-ink transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {enviando ? pase.sending : pase.submit}
        </button>
      </form>
      <p
        id={`${campo}-estado`}
        aria-live="polite"
        className={cn(
          "mt-2 min-h-[1.25rem] text-[0.8rem]",
          mensaje ? "font-medium text-rosa-deep" : "text-ink-faint",
        )}
      >
        {mensaje || pase.fine}
      </p>
    </div>
  );
}
