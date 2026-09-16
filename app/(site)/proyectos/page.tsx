import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectStack } from "@/components/ui/project-stack";
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
        <ProjectStack projects={projects} />
      </div>

      <FinalCta />
    </>
  );
}
