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
import { faq, pricing, site } from "@/content/site";
import { sanityFetch } from "@/sanity/client";
import { featuredProjectsQuery, testimonialsQuery } from "@/sanity/queries";
import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const revalidate = 60;

export default async function HomePage() {
  const [cmsProjects, cmsTestimonials] = await Promise.all([
    sanityFetch<SanityProject[]>(featuredProjectsQuery, {}, [], ["project"]),
    sanityFetch<SanityTestimonial[]>(
      testimonialsQuery,
      {},
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
      <StructuredData />
    </>
  );
}

function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.legalName,
      description: site.description,
      url: siteUrl,
      email: site.email,
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: site.location },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Planes de diseño y desarrollo web",
        itemListElement: pricing.plans.map((plan) => ({
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
      mainEntity: faq.items.map((item) => ({
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
