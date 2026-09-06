import { createClient } from "next-sanity";

import { apiVersion, dataset, hasSanity, projectId } from "./env";

export const client = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/** Cliente con token de escritura, solo para el route handler del brief. */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!hasSanity || !token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}

/**
 * Envoltorio seguro: si Sanity todavía no está conectado devuelve el fallback
 * en lugar de tirar el render.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  tags: string[] = [],
): Promise<T> {
  if (!client) return fallback;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags },
    });
  } catch (error) {
    console.error("[sanity] fetch falló:", error);
    return fallback;
  }
}
