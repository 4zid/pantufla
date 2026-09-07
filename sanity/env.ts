/**
 * El projectId y el dataset son identificadores públicos: viajan en el bundle
 * del cliente igual. Van acá como valor por defecto para que el sitio funcione
 * recién clonado y en cualquier deploy sin configurar nada.
 *
 * Los secretos (token de escritura, clave de Resend) NO van acá: se cargan como
 * variables de entorno. Ver .env.example.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6zkp4mb1";

/**
 * Si algún día se vacía el projectId, las queries devuelven vacío y el Studio
 * muestra la pantalla de configuración en vez de tirar un 500.
 */
export const hasSanity = Boolean(projectId);
