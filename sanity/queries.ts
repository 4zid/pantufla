import { groq } from "next-sanity";

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
  *[_type == "project" && featured == true] | order(order asc)[0...3] { ${projectFields} }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc) { ${projectFields} }
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
  *[_type == "post"] | order(publishedAt desc) { ${postFields} }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] { ${postFields}, body }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc)[0...6] {
    _id, quote, name, role, rating, avatar
  }
`;
