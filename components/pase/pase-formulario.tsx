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
 * El formulario del pase: los datos para reservar un lugar en la agenda.
 *
 * Va debajo del pase y no adentro: el pase es un objeto 3D que se dobla, se
 * da vuelta y vuela, y un campo de texto tiene que quedarse quieto y derecho
 * para que alguien escriba. A cambio, el pase se entera: cuando la reserva
 * sale, imprime el nombre y el mail en su cara (ver pase-3d.ts).
 *
 * Hay dos y comparten el estado (lib/pase.ts): reservar en uno deja
 * reservado al otro.
 *
 * - El de la portada es corto: el mail solo, en una línea, sobre la página.
 * - El del banner (`conNombre`) pide nombre y mail, y va sobre la tinta del
 *   banner (`sobreTinta`). Desde sm es una sola barra blanca con los dos
 *   campos y el botón adentro: una cosa para completar y no tres piezas
 *   sueltas. Tenía las etiquetas arriba de cada campo, que repetían lo mismo
 *   que el ejemplo de adentro; ahora el ejemplo dice qué va («Tu nombre»,
 *   «vos@mail.com») y la etiqueta queda para el lector de pantalla. En el
 *   teléfono los campos se apilan y el botón, sobre la tinta, es del color
 *   del papel.
 */
export function PaseFormulario({
  origen,
  conNombre = false,
  sobreTinta = false,
  className,
}: {
  origen: OrigenPase;
  conNombre?: boolean;
  sobreTinta?: boolean;
  className?: string;
}) {
  const { pase } = useCopy();
  const locale = useLocale();
  const estado = usePase();
  const campo = useId();
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [trampa, setTrampa] = useState("");

  const enviando = estado.fase === "enviando";
  const mensaje =
    estado.fase === "error"
      ? estado.motivo === "invalido"
        ? pase.invalid
        : estado.motivo === "nombre"
          ? pase.nombre.missing
          : fill(pase.error, { email: site.email })
      : "";

  const tinta = sobreTinta ? "text-on-ink" : "text-ink";
  const suave = sobreTinta ? "text-on-ink/70" : "text-ink-soft";

  if (estado.fase === "reservado") {
    return (
      <div
        className={cn("text-[0.95rem]", conNombre && "text-center", className)}
        aria-live="polite"
      >
        <p className={cn("font-semibold", tinta)}>✓ {pase.success.title}</p>
        <p className={cn("mt-1", suave)}>
          {fill(pase.success.body, { email: estado.email })}
        </p>
        <button
          type="button"
          onClick={soltarPase}
          className={cn(
            "mt-2 text-[0.85rem] font-medium underline underline-offset-4 transition-colors",
            sobreTinta
              ? "text-on-ink/70 decoration-on-ink/30 hover:text-on-ink"
              : "text-ink-soft decoration-line-strong hover:text-ink",
          )}
        >
          {pase.success.reset}
        </button>
      </div>
    );
  }

  /* El campo es el mismo en los dos: blanco sobre la página clara y sobre
     la tinta oscura, oscuro cuando el tema se da vuelta. Adentro de la barra
     del banner pierde el borde y el fondo, que pone la barra, y se marca con
     un gris al enfocarlo. */
  const entrada = cn(
    "h-12 w-full min-w-0 rounded-full border border-line-strong bg-card px-5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none",
    conNombre
      ? "sm:h-11 sm:border-0 sm:bg-transparent sm:focus:bg-paper-alt"
      : /* En la portada, del alto de los botones del hero que tiene al lado. */
        "sm:h-10 sm:px-4 sm:text-[0.9rem]",
  );

  return (
    <div className={className}>
      {conNombre ? null : (
        <p className="text-[0.9rem] font-medium text-ink">{pase.body}</p>
      )}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!enviando) {
            void reservarLugar(
              { email, nombre: conNombre ? nombre : undefined },
              origen,
              locale,
              trampa,
              conNombre,
            );
          }
        }}
        className={cn(
          "flex flex-col gap-2",
          conNombre
            ? "sm:flex-row sm:items-center sm:gap-1 sm:rounded-full sm:border sm:border-line-strong sm:bg-card sm:p-1.5"
            : "mt-3 sm:flex-row",
        )}
      >
        {conNombre ? (
          <>
            <label htmlFor={`${campo}-nombre`} className="sr-only">
              {pase.nombre.label}
            </label>
            <input
              id={`${campo}-nombre`}
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={80}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={pase.nombre.placeholder}
              aria-invalid={
                (estado.fase === "error" && estado.motivo === "nombre") ||
                undefined
              }
              aria-describedby={`${campo}-estado`}
              className={cn(entrada, "sm:flex-[0.8]")}
            />
            <span
              aria-hidden
              className="hidden h-6 w-px shrink-0 bg-line-strong sm:block"
            />
          </>
        ) : null}
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
          aria-invalid={
            (estado.fase === "error" && estado.motivo !== "nombre") || undefined
          }
          aria-describedby={`${campo}-estado`}
          className={cn(entrada, "sm:w-auto sm:flex-1")}
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
          className={cn(
            "h-12 whitespace-nowrap rounded-full px-6 text-[0.95rem] font-medium transition-[opacity,transform] disabled:opacity-70",
            !conNombre && "sm:h-10 sm:px-5 sm:text-[0.9rem]",
            sobreTinta
              ? /* Sobre la tinta, el botón es el papel: blanco sobre la
                   tarjeta oscura, y oscuro cuando el tema la da vuelta.
                   Adentro de la barra blanca vuelve a ser la tinta. */
                "bg-on-ink text-ink hover:opacity-90 sm:h-11 sm:bg-ink sm:text-on-ink"
              : "bg-ink text-on-ink hover:opacity-90",
          )}
        >
          {enviando ? pase.sending : pase.submit}
        </button>
      </form>
      <p
        id={`${campo}-estado`}
        aria-live="polite"
        className={cn(
          "mt-2 min-h-[1.25rem] text-[0.8rem]",
          conNombre && "mt-3 text-center",
          mensaje
            ? sobreTinta
              ? "font-medium text-on-ink"
              : "font-medium text-rosa-deep"
            : sobreTinta
              ? "text-on-ink/60"
              : "text-ink-faint",
        )}
      >
        {mensaje ? (
          <>
            {sobreTinta ? (
              <span
                aria-hidden
                className="mr-1.5 inline-block h-2 w-2 rounded-full bg-rosa align-middle"
              />
            ) : null}
            {mensaje}
          </>
        ) : (
          pase.fine
        )}
      </p>
    </div>
  );
}
