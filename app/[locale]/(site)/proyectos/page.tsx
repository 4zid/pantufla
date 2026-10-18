import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { GrillaProyectos } from "@/components/ui/proyecto-tarjeta";
import { PageHeader } from "@/components/ui/page-header";
import { JsonLd } from "@/components/json-ld";
import { fallbackProjects } from "@/content/fallback-content";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import { localeHref, locales, type Locale } from "@/lib/i18n";
import { migas, nodoPagina, nodoProyectos } from "@/lib/schema";
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
      languages: Object.fromEntries(
        locales.map((otro) => [otro, localeHref("/proyectos", otro)]),
      ),
    },
  };
}

/**
 * Todos los proyectos, con la misma tarjeta que la home.
 *
 * La home muestra los cuatro destacados y enlaza acá; acá están todos, en el
 * orden del Studio, destacados incluidos: quien llega a esta página quiere el
 * catálogo entero, y sacarle los cuatro que ya vio lo dejaría buscando los
 * mejores en otro lado.
 *
 * Las tarjetas de los proyectos sin caso llevan al sitio publicado, como en
 * la home: sus fichas siguen fuera del índice (ver la ficha).
 */
export default async function ProyectosPage({ params }: Props) {
  const { locale } = await params;
  const [{ pages }, cms] = await Promise.all([
    getCopy(locale),
    sanityFetch<SanityProject[]>(
      allProjectsQuery,
      { language: locale },
      [],
      ["project"],
    ),
  ]);
  const proyectos = cms.length ? cms : fallbackProjects;
  const textos = pages.proyectos;

  return (
    <>
      <PageHeader
        icon="grilla"
        eyebrow={textos.eyebrow}
        title={textos.title}
        lead={textos.lead}
      />

      <section data-surface="mist" className="py-16 md:py-24">
        <div className="shell">
          {/* Cada tarjeta cuelga del h1 de la página: van con h2. */}
          <GrillaProyectos proyectos={proyectos} heading="h2" />
        </div>
      </section>

      <FinalCta />

      <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: "/proyectos",
            title: textos.title,
            description: textos.metaDescription,
          }),
          nodoProyectos(proyectos, locale, textos.title),
          migas(locale, [
            { name: site.name, path: "/" },
            { name: textos.eyebrow, path: "/proyectos" },
          ]),
        ]}
      />
    </>
  );
}
