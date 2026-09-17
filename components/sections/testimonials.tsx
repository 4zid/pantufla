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
 * Testimonios: una sola cita grande y las caras al costado.
 *
 * Antes eran tres tarjetas iguales en fila. El problema de esa forma es que
 * pone tres citas a competir entre sí: el ojo saltea, lee media frase de cada
 * una y no se queda con ninguna. Acá hay una sola cita por vez, en cuerpo
 * grande, y las demás esperan su turno como caras apagadas. Se lee una, y es
 * la que se quiere que se lea.
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
  { from: "#8fbce6", to: "#1f4d78" },
  { from: "#d5b4ef", to: "#5b3b7a" },
];

const ROTACION = 6000;

function Estrellas({ value = 5, label }: { value?: number; label: string }) {
  return (
    <div className="flex gap-1" role="img" aria-label={label}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn("h-[18px] w-[18px]", i < value ? "text-star" : "text-line-strong")}
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
  const lista = items.slice(0, 9);
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
    <Section
      id="testimonios"
      surface="mist"
      wide
    >
      {/* Sin título a la vista: la sección entera es una cita, y un titular
          arriba le estaría diciendo al visitante qué pensar antes de leerla.
          El documento sí lo necesita —es la única manera de que la sección
          tenga nombre en el índice y para quien navega con lector—, así que
          queda, callado. */}
      <h2 className="sr-only">{testimonials.title}</h2>

      <div className="grid gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-24">
        {/* Columna de caras */}
        <div>
          <Reveal>
            <Tag icon="cita">{testimonials.eyebrow}</Tag>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-7 grid w-fit grid-cols-3 gap-3">
              {lista.map((item, i) => {
                const foto = urlForImage(item.avatar)
                  ?.width(160)
                  .height(160)
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
                        "relative block h-[72px] w-[72px] overflow-hidden rounded-[16px] transition-all duration-500 ease-out",
                        puesto
                          ? "scale-105 opacity-100 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] ring-2 ring-ink/15"
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
                          width={72}
                          height={72}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="grid h-full w-full place-items-center text-[0.86rem] font-semibold text-white"
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
        </div>

        {/* La cita */}
        <div ref={cita} aria-live="polite" className="lg:pt-1">
          <div data-fade>
            <Estrellas
              value={actual.rating ?? 5}
              label={fill(testimonials.rating, { value: actual.rating ?? 5 })}
            />
          </div>

          <figure>
            {/*
              Las comillas van como parte del párrafo y no como un adorno
              pegado arriba: así abren y cierran de verdad, siguen a la última
              línea cuando el texto cambia de largo, y el lector de pantalla
              lee la cita sin tropezarse con ellas.
            */}
            <blockquote
              data-fade
              className="mt-7 text-balance text-[1.55rem] font-medium leading-[1.4] tracking-[-0.025em] text-ink md:text-[1.95rem] lg:text-[2.3rem]"
            >
              <span aria-hidden className="mr-1 align-[-0.32em] text-[2.2em] leading-[0] text-ink/15">
                &ldquo;
              </span>
              {actual.quote}
              <span aria-hidden className="ml-0.5 align-[-0.32em] text-[2.2em] leading-[0] text-ink/15">
                &rdquo;
              </span>
            </blockquote>

            <figcaption data-fade className="mt-8">
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
