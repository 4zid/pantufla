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
import { allProjectsQuery, testimonialsQuery } from "@/sanity/queries";
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
      allProjectsQuery,
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

  /*
     Todos y no los cuatro destacados: el corte lo hace la sección, que muestra
     cuatro y suma de a dos cuando se lo piden. Traer solo cuatro dejaría el
     botón sin nada que cargar.

     Ya no hay un /proyectos donde ver el resto, así que esta es la única
     puerta al catálogo entero.
  */
  const projects = cmsProjects.length ? cmsProjects : fallbackProjects;
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
