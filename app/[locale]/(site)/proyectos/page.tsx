import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectStack } from "@/components/ui/project-stack";
import { fallbackProjects } from "@/content/fallback-content";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/content/site";
import { getCopy } from "@/content/get-copy";
import { migas, nodoPagina } from "@/lib/schema";
import { localeHref, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/client";
import { allProjectsQuery } from "@/sanity/queries";
import type { SanityProject } from "@/sanity/types";

export const revalidate = 60;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getCopy(locale);
  return {
    title: pages.proyectos.metaTitle,
    description: pages.proyectos.metaDescription,
    alternates: {
      canonical: localeHref("/proyectos", locale),
      languages: { es: "/proyectos", en: "/en/proyectos" },
    },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const [{ pages }, cms] = await Promise.all([
    getCopy(locale),
    sanityFetch<SanityProject[]>(allProjectsQuery, { language: locale }, [], [
      "project",
    ]),
  ]);
  const projects = cms.length ? cms : fallbackProjects;

  return (
    <>
      <PageHeader
        icon="grilla"
        eyebrow={pages.proyectos.eyebrow}
        title={pages.proyectos.title}
        lead={pages.proyectos.lead}
      />

      <div className="shell py-16 md:py-20">
        <ProjectStack projects={projects} heading="h2" />
      </div>

      <FinalCta />
          <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: "/proyectos",
            title: pages.proyectos.title,
            description: pages.proyectos.lead,
            tipo: "CollectionPage",
          }),
          migas(locale, [
            { name: site.name, path: "/" },
            { name: pages.proyectos.eyebrow, path: "/proyectos" },
          ]),
        ]}
      />
</>
  );
}
