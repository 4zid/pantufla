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
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import type { ResolvedCopy } from "@/content/resolve";
import type { Locale } from "@/lib/i18n";
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
  // corta en tres porque es lo que devuelve la query de destacados: así el
  // bloque mide igual con CMS o sin CMS. Los seis están en /proyectos.
  const projects = cmsProjects.length
    ? cmsProjects
    : fallbackProjects.slice(0, 3);
  const testimonials = cmsTestimonials.length
    ? cmsTestimonials
    : fallbackTestimonials;

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
      <StructuredData copy={copy} />
    </>
  );
}

function StructuredData({ copy }: { copy: ResolvedCopy }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.legalName,
      description: copy.meta.description,
      url: siteUrl,
      email: site.email,
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: site.location },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: copy.pricing.offerCatalog,
        itemListElement: copy.pricing.plans.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          description: plan.summary,
          priceCurrency: "USD",
          price: plan.price.once,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
