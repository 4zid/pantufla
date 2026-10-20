import { Fragment } from "react";

import { PaseEscena } from "@/components/pase/pase-escena";

import { Approach } from "@/components/sections/approach";
import { Bento } from "@/components/sections/bento";
import { ClientsMap } from "@/components/sections/clients-map";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Lugar } from "@/components/sections/lugar";
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
import { getHeroGaleria } from "@/content/get-hero-galeria";
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
  const [copy, secciones, fondos, pantallas, cmsProjects, cmsTestimonials] =
    await Promise.all([
      getCopy(locale),
      getSections(),
      getFondos(),
      getHeroGaleria(locale),
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
     La home muestra los cuatro destacados en el Studio, en su orden; el
     resto está en /proyectos. Se traen todos igual: con el total la sección
     sabe si hace falta el enlace a ver todos, y si nadie marcó ninguno
     destacado entran los cuatro primeros en vez de una sección vacía. El
     respaldo tiene a los cuatro principales primero.
  */
  const projects = cmsProjects.length ? cmsProjects : fallbackProjects;
  const marcados = projects.filter((p) => p.featured).slice(0, 4);
  const destacados = marcados.length ? marcados : projects.slice(0, 4);
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
  /*
     Testimonios y globo van juntos cuando están los dos: el globo arriba y
     las cuatro citas abajo, en la misma sección y con el fondo de los
     testimonios. Cada uno sigue teniendo su interruptor; con uno solo
     prendido, ese sale solo.
  */
  const juntos =
    secciones.testimonials && secciones.clientsMap && testimonials.length > 0;

  const piezas: Record<SeccionId, (surface: Surface) => React.ReactNode> = {
    hero: (surface) => (
      <Hero
        surface={surface}
        pantallas={pantallas}
        galeria={copy.hero.gallery}
        conBanner={secciones.lugar}
      />
    ),
    socialProof: (surface) => <SocialProof surface={surface} />,
    approach: (surface) => <Approach surface={surface} />,
    bento: (surface) => <Bento surface={surface} />,
    process: (surface) => <Process surface={surface} />,
    stackTicker: (surface) => <StackTicker surface={surface} />,
    pricing: (surface) => <Pricing surface={surface} />,
    work: (surface) => (
      <Work projects={destacados} total={projects.length} surface={surface} />
    ),
    testimonials: (surface) => (
      <Testimonials items={testimonials} surface={surface}>
        {juntos ? <ClientsMap embedded /> : null}
      </Testimonials>
    ),
    clientsMap: (surface) => (juntos ? null : <ClientsMap surface={surface} />),
    faq: (surface) => <Faq surface={surface} />,
    finalCta: (surface) => <FinalCta withForm surface={surface} />,
    lugar: (surface) => <Lugar surface={surface} />,
  };

  /* El panel habla de claro y oscuro; las secciones, de bruma y profundo. */
  const superficie = (fondo: Fondo): Surface =>
    fondo === "oscuro" ? "deep" : "mist";

  return (
    <>
      {SECCIONES.filter(({ id }) => secciones[id]).map(({ id }) => (
        <Fragment key={id}>{piezas[id](superficie(fondos[id]))}</Fragment>
      ))}

      {/* El pase 3D. Vuela de la portada al banner si están los dos lugares;
          con uno solo se queda quieto en ese. */}
      {secciones.hero || secciones.lugar ? (
        <PaseEscena volar={secciones.hero && secciones.lugar} />
      ) : null}

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
            ? [nodoProyectos(destacados, locale, copy.work.title)]
            : []),
        ]}
      />
    </>
  );
}
