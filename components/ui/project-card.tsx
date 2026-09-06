import Image from "next/image";
import Link from "next/link";

import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/** Fondos de reserva para proyectos que todavía no tienen portada cargada. */
const placeholders = [
  "linear-gradient(150deg, #e9dfd2 0%, #c9b8a3 100%)",
  "linear-gradient(150deg, #e7d0c4 0%, #c68a6d 100%)",
  "linear-gradient(150deg, #dfe0d8 0%, #a9ab9d 100%)",
];

export function ProjectCard({
  project,
  index = 0,
}: {
  project: SanityProject;
  index?: number;
}) {
  const image = urlForImage(project.cover)?.width(900).height(640).url();

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-panel border border-line bg-card transition-colors duration-300 hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-alt">
        {image ? (
          <Image
            src={image}
            alt={project.cover?.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ background: placeholders[index % placeholders.length] }}
          />
        )}
        {project.plan ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[0.72rem] font-semibold text-ink backdrop-blur-sm">
            {project.plan}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[1.15rem] font-semibold tracking-[-0.02em]">
            {project.title}
          </h3>
          <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-clay" />
        </div>

        {project.tagline ? (
          <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
            {project.tagline}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-4 text-[0.8rem] text-ink-faint">
          {project.sector ? <span>{project.sector}</span> : null}
          {project.deliveredIn ? (
            <>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>Entregado en {project.deliveredIn}</span>
            </>
          ) : null}
          {project.year ? (
            <>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>{project.year}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
