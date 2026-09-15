"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { gsap, registerGsap } from "@/lib/motion";
import { toneTextDeep, type Tone } from "@/lib/tones";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";
import { cn } from "@/lib/cn";

/**
 * Proyectos de a uno, en fichas grandes que se apilan con el scroll.
 *
 * Cada ficha es sticky con un tope un poco mayor que la anterior, así la que
 * llega se monta sobre la que se va y queda asomando el borde de arriba. La
 * que queda atrás se achica y se apaga apenas, que es lo que le da la
 * profundidad del acordeón.
 *
 * Abajo de lg no hay apilado: en un teléfono es más incómodo que vistoso.
 */

const tones: Tone[] = ["aqua", "rosa", "verde", "miel"];

const placeholders = [
  "linear-gradient(150deg, #ddf2f0 0%, #6fcfca 100%)",
  "linear-gradient(150deg, #fce0e6 0%, #f2a5b6 100%)",
  "linear-gradient(150deg, #e3f1dc 0%, #a6cf95 100%)",
  "linear-gradient(150deg, #fdedd2 0%, #f4c87d 100%)",
];

/**
 * Los datos del proyecto van como pares de clave y valor, no como etiquetas
 * en pastilla: dicen qué es cada dato en vez de dejarlo suelto, y es el mismo
 * recurso que usa el proceso.
 */
function Meta({ project }: { project: SanityProject }) {
  const pairs = [
    project.sector && { k: "Rubro", v: project.sector },
    project.plan && { k: "Plan", v: project.plan },
    project.deliveredIn && { k: "Entrega", v: project.deliveredIn },
    project.year && { k: "Año", v: project.year },
  ].filter(Boolean) as { k: string; v: string }[];

  if (!pairs.length) return null;

  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4">
      {pairs.map((pair) => (
        <div key={pair.k}>
          <dt className="text-[0.8rem] text-ink-faint">{pair.k}</dt>
          <dd className="mt-1 text-[0.92rem] font-medium">{pair.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectStack({ projects }: { projects: SanityProject[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", root);

          slots.forEach((slot, i) => {
            const next = slots[i + 1];
            if (!next) return;

            const trigger = {
              trigger: next,
              start: "top bottom",
              end: "top center",
              scrub: 0.5,
            } as const;

            // La ficha que se va se achica, pero NO se transparenta: si bajara
            // la opacidad de todo el elemento, su texto se leería a través de
            // la que llega. El apagado lo hace un velo dentro de la ficha.
            gsap.to(slot.querySelector("[data-project-card]"), {
              scale: 0.93,
              ease: "none",
              scrollTrigger: trigger,
            });

            gsap.to(slot.querySelector("[data-scrim]"), {
              opacity: 0.72,
              ease: "none",
              scrollTrigger: trigger,
            });
          });
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {projects.map((project, i) => {
        const image = urlForImage(project.cover)?.width(1200).height(900).url();
        const tone = tones[i % tones.length];

        return (
          <div
            key={project._id}
            data-slot
            className="mb-6 lg:sticky lg:mb-0 lg:pb-8"
            style={{ top: `calc(6rem + ${i * 1.75}rem)` }}
          >
            <article
              data-project-card
              className="relative overflow-hidden rounded-panel border border-line bg-card shadow-[0_30px_70px_-50px_rgba(35,28,18,0.4)]"
            >
              <div
                data-scrim
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 bg-paper-alt opacity-0"
              />
              <div className="grid lg:h-[30rem] lg:grid-cols-[1.05fr_1fr]">
                {/* Imagen */}
                <div className="relative aspect-[4/3] overflow-hidden bg-paper-alt lg:aspect-auto lg:h-full">
                  {image ? (
                    <Image
                      src={image}
                      alt={project.cover?.alt || project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ background: placeholders[i % placeholders.length] }}
                    />
                  )}
                </div>

                {/* Contenido */}
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <span
                    className={cn(
                      "text-[0.85rem] font-semibold tabular-nums",
                      toneTextDeep[tone],
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-4 text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.3rem]">
                    {project.title}
                  </h3>

                  {project.tagline ? (
                    <p className="mt-4 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
                      {project.tagline}
                    </p>
                  ) : null}

                  {project.results?.length ? (
                    <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                      {project.results.slice(0, 2).map((result) => (
                        <div key={result.label}>
                          <p className="text-[1.5rem] font-semibold leading-none tracking-[-0.03em]">
                            {result.value}
                          </p>
                          <p className="mt-1.5 text-[0.85rem] text-ink-soft">
                            {result.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <Meta project={project} />

                  <Link
                    href={`/proyectos/${project.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 self-start text-[0.95rem] font-medium"
                  >
                    Ver el proyecto
                    <ArrowUpRightIcon className="h-4 w-4 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
