"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";
import { useCopy, useHref } from "@/components/copy-provider";

/**
 * Los proyectos, de a dos por fila.
 *
 * Antes se apilaban con el scroll, cada uno montándose sobre el anterior. Se
 * fue: para comparar dos trabajos hay que poder verlos juntos, y el apilado
 * obligaba a recorrerlos de a uno y en el orden que imponía la página.
 *
 * El encabezado va afuera de la imagen —título y etiquetas a la izquierda, el
 * enlace a la derecha— y no encima. Sobre la imagen hay que velar el fondo
 * para que el texto se lea, y ese velo termina ensuciando justo lo que el
 * proyecto quiere mostrar.
 */

const placeholders = [
  "linear-gradient(150deg, #ddf2f0 0%, #6fcfca 100%)",
  "linear-gradient(150deg, #fbe4e9 0%, #f2a5b6 100%)",
  "linear-gradient(150deg, #e6f2df 0%, #a6cf95 100%)",
  "linear-gradient(150deg, #fdeed4 0%, #f4c87d 100%)",
];

export function ProjectStack({ projects }: { projects: SanityProject[] }) {
  const { work } = useCopy();
  const href = useHref();
  return (
    <Reveal stagger className="grid gap-x-8 gap-y-14 lg:grid-cols-2">
      {projects.map((project, i) => {
        const image = urlForImage(project.cover)?.width(1200).height(900).url();
        const href = `/proyectos/${project.slug}`;
        const tags = project.services?.length
          ? project.services
          : [project.sector, project.plan].filter(Boolean);

        return (
          <article key={project._id} className="group/card">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h3 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em]">
                  <Link href={href} className="hover:underline underline-offset-4">
                    {project.title}
                  </Link>
                </h3>
                {tags.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-card px-3 py-1.5 text-[0.8rem] text-ink-soft"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <Link
                href={href}
                aria-label={`${work.view} ${project.title}`}
                className="group/link flex shrink-0 items-center gap-3 pt-1 text-[0.95rem] font-medium"
              >
                Ver
                <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-colors duration-200 group-hover/link:border-ink group-hover/link:bg-ink group-hover/link:text-paper">
                  <ArrowUpRightIcon className="h-4 w-4" />
                </span>
              </Link>
            </div>

            <Link
              href={href}
              tabIndex={-1}
              aria-hidden
              className="mt-6 block overflow-hidden rounded-panel border border-line bg-card p-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                {image ? (
                  <Image
                    src={image}
                    alt={project.cover?.alt || project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: placeholders[i % placeholders.length] }}
                  />
                )}
              </div>
            </Link>

            {project.tagline ? (
              <p className="mt-5 max-w-md text-[0.96rem] leading-relaxed text-ink-soft">
                {project.tagline}
              </p>
            ) : null}
          </article>
        );
      })}
    </Reveal>
  );
}
