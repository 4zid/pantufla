"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { useCopy } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { Tag } from "@/components/ui/tag";
import { StarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { urlForImage } from "@/sanity/image";
import type { SanityTestimonial } from "@/sanity/types";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Testimonios: las caras arriba y una sola cita grande abajo, todo centrado.
 *
 * Antes eran tres tarjetas iguales en fila. El problema de esa forma es que
 * pone tres citas a competir entre sí: el ojo saltea, lee media frase de cada
 * una y no se queda con ninguna. Acá hay una sola cita por vez, en cuerpo
 * grande, y las demás esperan su turno como caras apagadas. Se lee una, y es
 * la que se quiere que se lea.
 *
 * Las caras van en una fila de cuatro y no en una grilla al costado. Con la
 * grilla de nueve, el bloque tenía dos ejes —las caras a la izquierda, el
 * texto a la derecha— y ninguno de los dos coincidía con el centro de la
 * página, así que la sección se leía descolgada de todo lo demás. En un solo
 * eje, la fila de caras es el índice y la cita es el contenido: se lee de
 * arriba abajo sin saltar de lado. Cuatro porque es lo que entra en una fila
 * en un teléfono sin achicar el cuadrado.
 *
 * Va sobre el papel gris del sitio y no sobre negro. La referencia era oscura,
 * pero acá el negro ya tiene dueño —la línea de tiempo del proceso— y un
 * segundo bloque oscuro en la misma página deja de ser un acento y pasa a ser
 * una franja. El silencio que esta sección necesita lo da el aire, no el
 * color: una sola cita, grande, sin nada al lado.
 *
 * Las caras rotan solas cada seis segundos hasta que el visitante toca una.
 * Ahí se corta para siempre: si alguien eligió a quién quiere leer, moverle el
 * texto abajo del ojo es de las peores cosas que puede hacer una interfaz.
 */

const tintes = [
  { from: "#6fcfca", to: "#166b67" },
  { from: "#f2a5b6", to: "#a3405a" },
  { from: "#f4c87d", to: "#8a5a12" },
  { from: "#a6cf95", to: "#456f35" },
];

/** Cuántas caras entran en la fila. */
const CARAS = 4;

const ROTACION = 6000;

function Estrellas({ value = 5, label }: { value?: number; label: string }) {
  return (
    <div className="flex justify-center gap-1" role="img" aria-label={label}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-[18px] w-[18px]",
            i < value ? "text-star" : "text-line-strong",
          )}
        />
      ))}
    </div>
  );
}

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  const { testimonials } = useCopy();
  const lista = items.slice(0, CARAS);
  const [activo, setActivo] = useState(0);
  const [manual, setManual] = useState(false);
  const cita = useRef<HTMLDivElement>(null);

  // La rotación se arma con un intervalo y no con un tween encadenado: así
  // cortarla es dejar de agendar el próximo, y no perseguir una animación.
  useEffect(() => {
    if (manual || lista.length < 2) return;
    const id = window.setInterval(
      () => setActivo((i) => (i + 1) % lista.length),
      ROTACION,
    );
    return () => window.clearInterval(id);
  }, [manual, lista.length]);

  // El cambio de cita entra desde abajo y con opacidad. Es corto a propósito:
  // el visitante ya eligió, lo que quiere es leer, no ver una transición.
  useGSAP(
    () => {
      const nodo = cita.current;
      if (!nodo) return;
      registerGsap();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        nodo.querySelectorAll("[data-fade]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 },
      );
    },
    { dependencies: [activo], scope: cita },
  );

  if (!lista.length) return null;

  const actual = lista[activo];

  return (
    <Section id="testimonios" surface="mist">
      {/* Sin título a la vista: la sección entera es una cita, y un titular
          arriba le estaría diciendo al visitante qué pensar antes de leerla.
          El documento sí lo necesita —es la única manera de que la sección
          tenga nombre en el índice y para quien navega con lector—, así que
          queda, callado. */}
      <h2 className="sr-only">{testimonials.title}</h2>

      <div className="flex flex-col items-center text-center">
        <Reveal>
          <Tag icon="cita">{testimonials.eyebrow}</Tag>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-8 flex justify-center gap-3 md:gap-4">
            {lista.map((item, i) => {
              const foto = urlForImage(item.avatar)
                ?.width(180)
                .height(180)
                .url();
              const tinte = tintes[i % tintes.length];
              const puesto = i === activo;

              return (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setManual(true);
                      setActivo(i);
                    }}
                    aria-pressed={puesto}
                    aria-label={item.name}
                    className={cn(
                      "relative block h-[68px] w-[68px] overflow-hidden rounded-[18px] transition-all duration-500 ease-out md:h-[82px] md:w-[82px]",
                      puesto
                        ? "scale-105 opacity-100 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.35)] ring-2 ring-ink/15"
                        : "opacity-45 grayscale hover:opacity-80 hover:grayscale-0",
                    )}
                    style={
                      foto
                        ? undefined
                        : {
                            background: `linear-gradient(145deg, ${tinte.from}, ${tinte.to})`,
                          }
                    }
                  >
                    {foto ? (
                      <Image
                        src={foto}
                        alt=""
                        aria-hidden
                        width={82}
                        height={82}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="grid h-full w-full place-items-center text-[0.9rem] font-semibold text-white"
                      >
                        {iniciales(item.name)}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* La cita. El ancho está atado al renglón y no al contenedor: una
            cita de treinta palabras a 1200px de ancho es una sola línea que
            hay que recorrer con la cabeza. */}
        <div
          ref={cita}
          aria-live="polite"
          className="mt-10 flex w-full max-w-3xl flex-col items-center"
        >
          <div data-fade>
            <Estrellas
              value={actual.rating ?? 5}
              label={fill(testimonials.rating, { value: actual.rating ?? 5 })}
            />
          </div>

          <figure className="w-full">
            {/*
              Las comillas van como parte del párrafo y no como un adorno
              pegado arriba: así abren y cierran de verdad, siguen a la última
              línea cuando el texto cambia de largo, y el lector de pantalla
              lee la cita sin tropezarse con ellas.
            */}
            <blockquote
              data-fade
              className="mt-6 text-balance text-[1.5rem] font-medium leading-[1.35] tracking-[-0.025em] text-ink md:text-[1.9rem] lg:text-[2.15rem]"
            >
              <span
                aria-hidden
                className="mr-1 align-[-0.32em] text-[2.2em] leading-[0] text-ink/15"
              >
                &ldquo;
              </span>
              {actual.quote}
              <span
                aria-hidden
                className="ml-0.5 align-[-0.32em] text-[2.2em] leading-[0] text-ink/15"
              >
                &rdquo;
              </span>
            </blockquote>

            <figcaption data-fade className="mt-7">
              <span className="block text-[1.02rem] font-medium text-ink">
                {actual.name}
              </span>
              <span className="mt-1 block text-[0.92rem] text-ink-faint">
                {[actual.role, actual.company].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  );
}
