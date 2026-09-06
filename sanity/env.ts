export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/**
 * El sitio tiene que poder buildear antes de que exista el proyecto de Sanity.
 * Cuando no hay projectId configurado, las queries devuelven vacío en vez de
 * romper el build.
 */
export const hasSanity = Boolean(projectId);
