import { Approach } from "@/components/sections/approach";
import { ClientsMap } from "@/components/sections/clients-map";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { SocialProof } from "@/components/sections/social-proof";
import { StackTicker } from "@/components/sections/stack-ticker";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import {
  fallbackProjects,
  fallbackTestimonials,
} from "@/content/fallback-content";
import { JsonLd } from "@/components/json-ld";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import type { ResolvedCopy } from "@/content/resolve";
import type { Locale } from "@/lib/i18n";
import { nodoFaq, nodoPagina, nodoProyectos } from "@/lib/schema";
import { sanityFetch } from "@/sanity/client";
import { featuredProjectsQuery, testimonialsQuery } from "@/sanity/queries";
import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [copy, cmsProjects, cmsTestimonials] = await Promise.all([
    getCopy(locale),
    sanityFetch<SanityProject[]>(
      featuredProjectsQuery,
      { language: locale },
      [],
      ["project"],
    ),
    sanityFetch<SanityTestimonial[]>(
      testimonialsQuery,
      { language: locale },
      [],
      ["testimonial"],
    ),
  ]);

  // Mientras el CMS esté vacío se muestra el contenido de respaldo. La home
  // corta en cuatro porque es lo que devuelve la query de destacados: así el
  // bloque mide igual con CMS o sin CMS, y cuatro es justo una fila entera de
  // tarjetas. Todos están en /proyectos.
  const projects = cmsProjects.length
    ? cmsProjects
    : fallbackProjects.slice(0, 4);
  const testimonials = cmsTestimonials.length
    ? cmsTestimonials
    : (fallbackTestimonials[locale] ?? fallbackTestimonials.es);

  return (
    <>
      <Hero />
      <SocialProof />
      <Approach />
      <Process />
      <StackTicker />
      <Pricing />
      <Work projects={projects} />
      <Testimonials items={testimonials} />
      <ClientsMap />
      <Faq />
      <FinalCta withForm />
      <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: "/",
            title: `${site.name} — ${copy.meta.tagline}`,
            description: copy.meta.description,
          }),
          nodoFaq(copy, locale),
          nodoProyectos(projects, locale, copy.work.title),
        ]}
      />
    </>
  );
}
