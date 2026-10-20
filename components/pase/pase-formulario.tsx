"use client";

import { useId, useState } from "react";

import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { reservarLugar, soltarPase, usePase } from "@/lib/pase";

/**
 * El formulario del pase: nombre y mail para reservar un lugar en la agenda.
 * Vive en el banner (components/sections/lugar.tsx), sobre su tinta.
 *
 * Va debajo del pase y no adentro: el pase es un objeto 3D que se dobla, se
 * da vuelta y vuela, y un campo de texto tiene que quedarse quieto y derecho
 * para que alguien escriba. A cambio, el pase se entera: cuando la reserva
 * sale, imprime el nombre en su cara (ver pase-3d.ts).
 *
 * Desde sm es una sola barra blanca con los dos campos y el botón adentro:
 * una cosa para completar y no tres piezas sueltas. El ejemplo de adentro
 * dice qué va («Tu nombre», «vos@mail.com») y la etiqueta queda para el
 * lector de pantalla. En el teléfono los campos se apilan y el botón, sobre
 * la tinta, es del color del papel.
 *
 * Hubo otro en la portada, con el mail solo, debajo del pase. Se fue: ahí el
 * pase es un enlace que baja hasta acá (ver hero.tsx), y dos formularios para
 * lo mismo en una página era uno de más.
 */
export function PaseFormulario({ className }: { className?: string }) {
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

  if (estado.fase === "reservado") {
    return (
      <div
        className={cn("text-center text-[0.95rem]", className)}
        aria-live="polite"
      >
        <p className="font-semibold text-on-ink">✓ {pase.success.title}</p>
        <p className="mt-1 text-on-ink/70">
          {fill(pase.success.body, { email: estado.email })}
        </p>
        <button
          type="button"
          onClick={soltarPase}
          className="mt-2 text-[0.85rem] font-medium text-on-ink/70 underline decoration-on-ink/30 underline-offset-4 transition-colors hover:text-on-ink"
        >
          {pase.success.reset}
        </button>
      </div>
    );
  }

  /* Blanco sobre la tinta oscura, oscuro cuando el tema se da vuelta.
     Adentro de la barra pierde el borde y el fondo, que pone la barra, y se
     marca con un gris al enfocarlo. */
  const entrada =
    "h-12 w-full min-w-0 rounded-full border border-line-strong bg-card px-5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none sm:h-11 sm:border-0 sm:bg-transparent sm:focus:bg-paper-alt";

  return (
    <div className={className}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!enviando) {
            void reservarLugar(
              { email, nombre },
              "banner",
              locale,
              trampa,
              true,
            );
          }
        }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1 sm:rounded-full sm:border sm:border-line-strong sm:bg-card sm:p-1.5"
      >
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
            (estado.fase === "error" && estado.motivo === "nombre") || undefined
          }
          aria-describedby={`${campo}-estado`}
          className={cn(entrada, "sm:flex-[0.8]")}
        />
        <span
          aria-hidden
          className="hidden h-6 w-px shrink-0 bg-line-strong sm:block"
        />
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
        {/* Sobre la tinta, el botón es el papel: blanco sobre la tarjeta
            oscura, y oscuro cuando el tema la da vuelta. Adentro de la barra
            blanca vuelve a ser la tinta. */}
        <button
          type="submit"
          disabled={enviando}
          className="h-12 whitespace-nowrap rounded-full bg-on-ink px-6 text-[0.95rem] font-medium text-ink transition-[opacity,transform] hover:opacity-90 disabled:opacity-70 sm:h-11 sm:bg-ink sm:text-on-ink"
        >
          {enviando ? pase.sending : pase.submit}
        </button>
      </form>
      <p
        id={`${campo}-estado`}
        aria-live="polite"
        className={cn(
          "mt-3 min-h-[1.25rem] text-center text-[0.8rem]",
          mensaje ? "font-medium text-on-ink" : "text-on-ink/60",
        )}
      >
        {mensaje ? (
          <>
            <span
              aria-hidden
              className="mr-1.5 inline-block h-2 w-2 rounded-full bg-rosa align-middle"
            />
            {mensaje}
          </>
        ) : (
          pase.fine
        )}
      </p>
    </div>
  );
}
