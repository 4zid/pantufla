import { site } from "@/content/site";
import type { ResolvedCopy } from "@/content/resolve";
import { localeHref, locales, type Locale } from "@/lib/i18n";

/**
 * Los datos estructurados del sitio, como un grafo y no como islas.
 *
 * Antes cada página tiraba su propio bloque de JSON-LD suelto y la home
 * describía el estudio entera de nuevo. Eso funciona para el buscador clásico
 * —lee la página, ve una ficha, la indexa— pero no para lo que consume esto
 * hoy: los motores de respuesta arman una entidad por sitio y le van colgando
 * lo que encuentran. Si cada página declara un estudio distinto sin decir que
 * es el mismo, terminan siendo tres estudios parecidos y ninguno con toda la
 * información.
 *
 * La diferencia la hace el @id. Cada cosa tiene una dirección estable
 * —#estudio, #sitio, la URL de cada página— y el resto la referencia en vez de
 * repetirla. Así el estudio se declara una sola vez, en el layout, y una nota
 * puede decir «esto lo publicó #estudio» sin volver a contar quién es.
 *
 * Todo sale del copy del idioma que se esté sirviendo: un grafo en español
 * colgado de una página en inglés es peor que no tener grafo.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

/** La URL absoluta de una ruta interna, en un idioma. */
export function absoluta(path: string, locale: Locale) {
  const ruta = localeHref(path, locale);
  return `${siteUrl}${ruta === "/" ? "" : ruta}`;
}

const ID_ESTUDIO = `${siteUrl}/#estudio`;
const ID_SITIO = `${siteUrl}/#sitio`;

/**
 * El estudio. Va una sola vez por página y todo lo demás lo referencia.
 *
 * El tipo es ProfessionalService y no Organization a secas porque hereda de
 * LocalBusiness: acepta dirección, zona de cobertura y catálogo de precios, que
 * es justamente lo que un motor de respuesta necesita para contestar «cuánto
 * sale» y «trabajan en mi país».
 */
export function nodoEstudio(copy: ResolvedCopy, locale: Locale) {
  return {
    "@type": "ProfessionalService",
    "@id": ID_ESTUDIO,
    name: site.name,
    legalName: site.legalName,
    description: copy.meta.description,
    slogan: copy.meta.tagline,
    url: siteUrl,
    email: site.email,
    logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    image: `${siteUrl}/opengraph-image`,
    // Las redes son cómo un motor confirma que este sitio y esa cuenta son la
    // misma entidad. Sin sameAs cada perfil es un desconocido más.
    sameAs: site.social.map((red) => red.href),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buenos Aires",
      addressCountry: "AR",
    },
    areaServed: { "@type": "Place", name: "Worldwide" },
    knowsLanguage: [...locales],
    inLanguage: locale,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: copy.pricing.offerCatalog,
      itemListElement: copy.pricing.plans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        description: plan.summary,
        priceCurrency: "USD",
        price: plan.price.once,
        availability: "https://schema.org/InStock",
      })),
    },
  };
}

/** El sitio como obra: quién lo publica y en qué idioma se está sirviendo. */
export function nodoSitio(copy: ResolvedCopy, locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": ID_SITIO,
    url: siteUrl,
    name: site.name,
    description: copy.meta.description,
    inLanguage: locale,
    publisher: { "@id": ID_ESTUDIO },
  };
}

/**
 * Una página. El tipo cambia según qué sea: la de contacto es ContactPage, una
 * nota es Article, y lo demás WebPage.
 */
export function nodoPagina({
  locale,
  path,
  title,
  description,
  tipo = "WebPage",
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  tipo?: string;
}) {
  const url = absoluta(path, locale);
  return {
    "@type": tipo,
    "@id": `${url}#pagina`,
    url,
    name: title,
    ...(description ? { description } : {}),
    inLanguage: locale,
    isPartOf: { "@id": ID_SITIO },
    about: { "@id": ID_ESTUDIO },
  };
}

/**
 * Las migas. No hay barra de migas a la vista y no hace falta que la haya:
 * esto es lo que le dice al buscador dónde cuelga cada página, y es de donde
 * salen los rastros que se ven debajo del título en los resultados.
 */
export function migas(locale: Locale, tramos: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: tramos.map((tramo, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tramo.name,
      item: absoluta(tramo.path, locale),
    })),
  };
}

/** Las preguntas frecuentes, que es lo que más se cita en una respuesta. */
export function nodoFaq(copy: ResolvedCopy, locale: Locale) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluta("/", locale)}#faq`,
    inLanguage: locale,
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Los proyectos como lista ordenada.
 *
 * Cada uno apunta al sitio publicado y no a la ficha interna: es la dirección
 * que de verdad identifica al trabajo, y permite que un motor entienda que
 * lupastudio.co lo hizo este estudio.
 */
export function nodoProyectos(
  proyectos: { title: string; slug: string; tagline?: string; url?: string }[],
  locale: Locale,
  nombre: string,
) {
  return {
    "@type": "ItemList",
    name: nombre,
    itemListElement: proyectos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebSite",
        ...(p.url ? { "@id": p.url, url: p.url } : {}),
        name: p.title,
        ...(p.tagline ? { description: p.tagline } : {}),
        creator: { "@id": ID_ESTUDIO },
        mainEntityOfPage: absoluta(`/proyectos/${p.slug}`, locale),
      },
    })),
  };
}

/** Envuelve los nodos en un grafo y lo deja listo para el script. */
export function grafo(nodos: unknown[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodos });
}

export { ID_ESTUDIO, ID_SITIO };
