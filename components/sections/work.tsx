import Link from "next/link";

import type { SanityProject } from "@/sanity/types";
import { ArrowIcon } from "@/components/ui/icons";
import { ProjectCard } from "@/components/ui/project-card";
import { Section, SectionHead } from "@/components/ui/section";

export function Work({ projects }: { projects: SanityProject[] }) {
  if (!projects.length) return null;

  return (
    <Section id="proyectos" tone="alt">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          eyebrow="Proyectos"
          title="Algunos sitios que salieron de acá."
          lead="Distintos rubros, distintos tamaños, el mismo método."
        />
        <Link
          href="/proyectos"
          className="group inline-flex shrink-0 items-center gap-2 text-[0.95rem] font-medium"
        >
          Ver todos los proyectos
          <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project._id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
