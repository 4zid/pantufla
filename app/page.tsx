import { Approach } from "@/components/sections/approach";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Problem } from "@/components/sections/problem";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { demoProjects, demoTestimonials } from "@/content/demo-content";
import { faq, pricing, site } from "@/content/site";
import { sanityFetch } from "@/sanity/client";
import { featuredProjectsQuery, testimonialsQuery } from "@/sanity/queries";
import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const revalidate = 60;

export default async function HomePage() {
  const [cmsProjects, cmsTestimonials] = await Promise.all([
    sanityFetch<SanityProject[]>(featuredProjectsQuery, {}, [], ["project"]),
    sanityFetch<SanityTestimonial[]>(testimonialsQuery, {}, [], ["testimonial"]),
  ]);

  // Mientras el CMS esté vacío se muestra el contenido de muestra.
  const projects = cmsProjects.length ? cmsProjects : demoProjects;
  const testimonials = cmsTestimonials.length ? cmsTestimonials : demoTestimonials;

  return (
    <>
      <Hero />
      <Problem />
      <Approach />
      <Process />
      <Pricing />
      <Work projects={projects} />
      <Testimonials items={testimonials} />
      <Faq />
      <FinalCta />
      <StructuredData />
    </>
  );
}

function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.studio";

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
          price: "once" in plan.price ? plan.price.once : plan.price.from,
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
