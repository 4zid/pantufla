"use client";

import Link from "next/link";

import { useCopy, useHref } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { GrillaProyectos } from "@/components/ui/proyecto-tarjeta";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import type { SanityProject } from "@/sanity/types";

/**
 * Los proyectos de la home: los cuatro destacados, en una grilla de dos por
 * dos con un mockup cada uno, y un enlace a /proyectos con todos.
 *
 * Fue una columna de esferas con el título quieto a media altura, y antes un
 * paso a paso clavado a la rueda. Con cuatro proyectos y capturas de verdad
 * alcanza con mostrarlos: la grilla se baja como cualquier otra sección y no
 * retiene nada.
 *
 * Cuáles son los cuatro lo decide el Studio («Destacado en la home»); la
 * página los recibe ya elegidos (ver page.tsx). El enlace a todos aparece
 * solo si hay más de los que se ven.
 *
 * Oscura por defecto: las capturas son claras y sobre la página apagada se
 * leen como pantallas encendidas.
 */
export function Work({
  projects,
  total,
  surface = "deep",
}: {
  projects: SanityProject[];
  /** Cuántos proyectos hay en total, para saber si hace falta «ver todos». */
  total: number;
  surface?: Surface;
}) {
  const { work } = useCopy();
  const href = useHref();

  if (!projects.length) return null;

  return (
    <Section id="proyectos" surface={surface}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHead
          icon="grilla"
          eyebrow={work.eyebrow}
          title={work.title}
          lead={work.lead}
        />
        {total > projects.length ? (
          <Reveal delay={0.2} className="shrink-0">
            <Link
              href={href("/proyectos")}
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink"
            >
              {work.all}
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        ) : null}
      </div>

      <GrillaProyectos proyectos={projects} className="mt-14 md:mt-20" />
    </Section>
  );
}
