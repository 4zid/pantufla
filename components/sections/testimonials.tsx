"use client";

import { useState, type ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { StarIcon } from "@/components/ui/icons";
import { Section, type Surface } from "@/components/ui/section";
import type { SanityTestimonial } from "@/sanity/types";
import { cn } from "@/lib/cn";

/**
 * Testimonios: cuatro celdas en una fila, una cita por celda.
 *
 * Con el globo prendido van en la misma sección, abajo del planeta: primero
 * desde dónde, después lo que dicen. Sin títulos a la vista en ninguna de las
 * dos partes —el globo con su palabra gigante ya es el encabezado—, pero el
 * documento sí los tiene, callados, para el índice y para quien navega con
 * lector.
 *
 * Es una tira de celdas cuadradas y pegadas, sin borde alrededor ni esquinas
 * redondeadas, separadas por una línea fina, sobre el gris de las tarjetas: arriba a la izquierda el número en una pastilla, arriba a
 * la derecha la empresa en versalitas, y abajo la cita grande con el nombre y
 * el cargo. Una celda va en la tinta, como la oscura de la referencia: arranca
 * en la primera y sigue al mouse, así la cita que se está leyendo es la que
 * resalta. Su número se da vuelta con ella: el papel sobre la tinta. Es
 * decorado y no estado: la cita está entera en todas las celdas,
 * así que en un teléfono, sin mouse, no se pierde nada.
 *
 * Fue una sola cita grande con las caras arriba, rotando sola cada seis
 * segundos. Las cuatro a la vista se leen de un vistazo y no hay nada que se
 * mueva solo.
 *
 * En la pantalla grande son cuatro columnas; en tablet, dos por dos; en el
 * teléfono, una debajo de la otra.
 */

/** Cuántas citas entran en la fila. */
const CELDAS = 4;

/** El número de la pastilla: «01.», como en la referencia. */
const numero = (i: number) => `${String(i + 1).padStart(2, "0")}.`;

function Estrellas({ value = 5, label }: { value?: number; label: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={label}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-3 w-3",
            i < value ? "text-current" : "text-current opacity-25",
          )}
        />
      ))}
    </span>
  );
}

export function Testimonials({
  items,
  surface,
  children,
}: {
  items: SanityTestimonial[];
  surface?: Surface;
  /** Lo que va arriba de las citas en la misma sección: el globo. */
  children?: ReactNode;
}) {
  const { testimonials } = useCopy();
  const lista = items.slice(0, CELDAS);
  const [activo, setActivo] = useState(0);

  if (!lista.length) return <>{children}</>;

  return (
    <Section id="testimonios" surface={surface}>
      <h2 className="sr-only">{testimonials.title}</h2>

      {children}

      <Reveal
        as="ul"
        stagger
        className={cn(
          "grid bg-line md:grid-cols-2 lg:grid-cols-4",
          /* Las líneas entre celdas son el fondo de la lista que asoma por
             un pixel de separación: una línea pareja sin sumar bordes que se
             dupliquen donde dos celdas se tocan. */
          "gap-px",
          children ? "mt-16 md:mt-24" : undefined,
        )}
      >
        {lista.map((item, i) => {
          const prendida = i === activo;
          const valor = item.rating ?? 5;
          return (
            <li
              key={item._id}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActivo(i);
              }}
              className={cn(
                /* w-full: en una grilla, una celda con aspect-ratio no se
                   estira sola y saca el ancho de su alto; si la cita es más
                   alta que ancha la celda, se ensanchaba y pisaba a la de al
                   lado. Con el ancho fijo crece para abajo, no al costado. */
                "flex w-full min-w-0 flex-col p-6 transition-colors duration-300 md:min-h-[20rem] md:p-7 lg:aspect-square lg:min-h-0 lg:p-6",
                prendida ? "bg-ink text-on-ink" : "bg-paper-alt text-ink",
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-[0.7rem] text-[0.78rem] font-semibold tabular-nums transition-colors duration-300",
                    prendida ? "bg-on-ink text-ink" : "bg-card text-ink",
                  )}
                >
                  {numero(i)}
                </span>
                {item.company ? (
                  <span
                    translate="no"
                    className="truncate text-[0.7rem] font-semibold uppercase tracking-[0.08em]"
                  >
                    {item.company}
                  </span>
                ) : null}
              </div>

              {/* El nombre y la empresa no se traducen: el traductor del
                    navegador convierte «Lupa Studio» en una lupa. El cargo
                    sí. */}
              {/* Las citas arrancan todas a la misma altura, como los
                  titulares de la referencia, y no pegadas al pie: con largos
                  distintos, alineadas abajo empezaban cada una en otro
                  renglón. */}
              {/* En la fila de cuatro la cita baja un punto y sube más cerca
                  del número: es lo que la deja entrar en una celda cuadrada
                  a 1440. Más angosta, la celda crece para abajo. */}
              <figure className="mt-10 md:mt-16 lg:mt-8">
                <blockquote className="text-balance text-[1.12rem] font-semibold leading-snug tracking-[-0.025em] md:text-[1.2rem] lg:text-[1.05rem]">
                  <span aria-hidden>&ldquo;</span>
                  {item.quote}
                  <span aria-hidden>&rdquo;</span>
                </blockquote>
                <figcaption
                  className={cn(
                    "mt-5 text-[0.88rem] leading-relaxed transition-colors duration-300",
                    prendida ? "text-on-ink/65" : "text-ink-soft",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span translate="no" className="font-medium">
                      {item.name}
                    </span>
                    <Estrellas
                      value={valor}
                      label={fill(testimonials.rating, { value: valor })}
                    />
                  </span>
                  {item.role ? (
                    <span className="block">{item.role}</span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </Reveal>
    </Section>
  );
}
