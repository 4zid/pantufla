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
  services,
  results,
  url
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && ${enIdioma}] | order(order asc)[0...4] { ${projectFields} }
`;

export const allProjectsQuery = groq`
  *[_type == "project" && ${enIdioma}] | order(order asc) { ${projectFields} }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    ${projectFields},
    gallery,
    body
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  topic,
  cover
`;

export const allPostsQuery = groq`
  *[_type == "post" && ${enIdioma}] | order(publishedAt desc) { ${postFields} }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] { ${postFields}, body }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
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

export const testimonialsQuery = groq`
  *[_type == "testimonial" && ${enIdioma}] | order(order asc)[0...6] {
    _id, quote, name, role, company, rating, avatar
  }
`;
