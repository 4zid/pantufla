import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/ui/project-card";
import { demoProjects } from "@/content/demo-content";
import { sanityFetch } from "@/sanity/client";
import { allProjectsQuery } from "@/sanity/queries";
import type { SanityProject } from "@/sanity/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Sitios y landings que diseñamos y desarrollamos: rubro, alcance y tiempo real de entrega de cada uno.",
  alternates: { canonical: "/proyectos" },
};

export default async function ProjectsPage() {
  const cms = await sanityFetch<SanityProject[]>(
    allProjectsQuery,
    {},
    [],
    ["project"],
  );
  const projects = cms.length ? cms : demoProjects;

  return (
    <>
      <PageHeader
        eyebrow="Proyectos"
        title="Sitios que salieron de acá."
        lead="Cada ficha muestra el rubro, el plan con el que se hizo y en cuánto tiempo se entregó."
      />

      <div className="shell py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>

      <FinalCta />
    </>
  );
}
