import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectStack } from "@/components/ui/project-stack";
import { fallbackProjects } from "@/content/fallback-content";
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
  const projects = cms.length ? cms : fallbackProjects;

  return (
    <>
      <PageHeader
        icon="grilla"
        eyebrow="Proyectos"
        title="Sitios que salieron de acá."
        lead="Entre landings de una sola página y sitios completos con panel de carga."
      />

      <div className="shell py-16 md:py-20">
        <ProjectStack projects={projects} />
      </div>

      <FinalCta />
    </>
  );
}
