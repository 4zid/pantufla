import { groq } from "next-sanity";

/**
 * Filtro de idioma para los documentos que se cargan a mano.
 *
 * Entra lo que está marcado en el idioma pedido y también lo que no está
 * marcado en ninguno. Esa segunda mitad es la que evita que la versión en
 * inglés arranque vacía: un proyecto cargado antes de que el sitio fuera
 * bilingüe se sigue viendo en los dos hasta que alguien decida en cuál va.
 *
 * Es un default que se puede revertir: apenas se le pone idioma a un
 * documento, desaparece del otro.
 */
const enIdioma = `(language == $language || !defined(language))`;

const projectFields = `
  _id,
  title,
  "slug": slug.current,
  tagline,
  sector,
  year,
  plan,
  deliveredIn,
  cover,
  social,
  services,
  results,
  url,
  "conCaso": count(body) > 0
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && ${enIdioma}] | order(order asc)[0...4] { ${projectFields} }
`;

export const allProjectsQuery = groq`
  *[_type == "project" && ${enIdioma}] | order(order asc) { ${projectFields} }
`;

/*
   La galería trae las medidas de cada imagen: se muestra entera, sin recorte,
   y sin el alto el navegador no le puede reservar el lugar antes de que
   llegue (la página saltaría al cargar).
*/
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectFields},
    gallery[]{ ..., "dimensiones": asset->metadata.dimensions{ width, height } },
    body
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

/**
 * Las fichas que van al sitemap: las que tienen el caso escrito.
 *
 * Sin caso, una ficha es el nombre, una bajada y dos datos, y la home ni la
 * enlaza (la esfera lleva al sitio publicado). Mandarla al buscador es pedirle
 * que indexe una página flaca. Siguen existiendo y se pueden abrir; van con
 * noindex y entran solas apenas se escribe el caso.
 */
export const projectCaseSlugsQuery = groq`
  *[_type == "project" && defined(slug.current) && count(body) > 0][].slug.current
`;

/**
 * El texto del sitio, un documento por idioma.
 *
 * Trae el documento entero menos los campos internos de Sanity. Las secciones
 * que todavía no se cargaron vuelven en null y las filtra getCopy(): así se
 * puede ir pasando el contenido de a poco sin que la página quede a medias.
 */
export const siteCopyQuery = groq`
  *[_type == "siteCopy" && language == $language][0]
`;

/**
 * Los interruptores de las secciones.
 *
 * Por id y no por tipo: es un documento único y buscarlo por _type devolvería
 * el primero que aparezca, que el día que alguien cree un segundo sin querer
 * puede no ser el que el Studio está editando.
 */
export const siteSectionsQuery = groq`
  *[_id == "siteSections"][0]
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial" && ${enIdioma}] | order(order asc)[0...6] {
    _id, quote, name, role, company, rating, avatar
  }
`;
