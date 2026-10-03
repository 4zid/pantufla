import { fallbackProjects } from "@/content/fallback-content";
import { sanityFetch } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import type { SanityProject } from "@/sanity/types";

/**
 * Un proyecto por su slug, para la ficha y para su imagen social.
 *
 * Primero Sanity; si no contesta, el respaldo local (content/fallback-content),
 * que tiene los casos escritos y las imágenes ya subidas. Las dos piezas
 * usan la misma búsqueda para que la imagen que se comparte nunca muestre un
 * proyecto distinto del de la página.
 */
export async function getProject(slug: string) {
  const fromCms = await sanityFetch<SanityProject | null>(
    projectBySlugQuery,
    { slug },
    null,
    ["project"],
  );
  return fromCms ?? fallbackProjects.find((p) => p.slug === slug) ?? null;
}
