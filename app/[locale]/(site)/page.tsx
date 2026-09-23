import { Fragment } from "react";

import { Approach } from "@/components/sections/approach";
import { Bento } from "@/components/sections/bento";
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
import { getFondos, getSections } from "@/content/get-sections";
import { SECCIONES, type Fondo, type SeccionId } from "@/content/sections";
import type { Surface } from "@/components/ui/section";
import { site } from "@/content/site";
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
  const [copy, secciones, fondos, cmsProjects, cmsTestimonials] =
    await Promise.all([
      getCopy(locale),
      getSections(),
      getFondos(),
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

  /*
     Qué pinta cada interruptor.

     El orden de la página lo marca SECCIONES, no este objeto: acá solo está
     cómo se construye cada una. Tenerlo separado es lo que hace que el orden
     de la home, la lista de interruptores del panel y la poda de enlaces sean
     todos la misma lista y no tres que hay que mantener iguales a mano.
  */
  const piezas: Record<SeccionId, (surface: Surface) => React.ReactNode> = {
    hero: (surface) => <Hero surface={surface} />,
    socialProof: (surface) => <SocialProof surface={surface} />,
    approach: (surface) => <Approach surface={surface} />,
    bento: (surface) => <Bento surface={surface} />,
    process: (surface) => <Process surface={surface} />,
    stackTicker: (surface) => <StackTicker surface={surface} />,
    pricing: (surface) => <Pricing surface={surface} />,
    work: (surface) => <Work projects={projects} surface={surface} />,
    testimonials: (surface) => (
      <Testimonials items={testimonials} surface={surface} />
    ),
    clientsMap: (surface) => <ClientsMap surface={surface} />,
    faq: (surface) => <Faq surface={surface} />,
    finalCta: (surface) => <FinalCta withForm surface={surface} />,
  };

  /* El panel habla de claro y oscuro; las secciones, de bruma y profundo. */
  const superficie = (fondo: Fondo): Surface =>
    fondo === "oscuro" ? "deep" : "mist";

  return (
    <>
      {SECCIONES.filter(({ id }) => secciones[id]).map(({ id }) => (
        <Fragment key={id}>{piezas[id](superficie(fondos[id]))}</Fragment>
      ))}

      <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: "/",
            title: `${site.name} — ${copy.meta.tagline}`,
            description: copy.meta.description,
          }),
          /*
             Los datos estructurados siguen a lo que hay en la página, no a lo
             que hay en el CMS. Declarar un FAQPage en una home sin preguntas, o
             una lista de proyectos que no está, es decirle al buscador algo que
             no puede verificar: no suma nada y es de las cosas que hacen que
             deje de confiar en el resto del marcado.
          */
          ...(secciones.faq ? [nodoFaq(copy, locale)] : []),
          ...(secciones.work
            ? [nodoProyectos(projects, locale, copy.work.title)]
            : []),
        ]}
      />
    </>
  );
}
