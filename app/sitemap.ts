import type { MetadataRoute } from "next";

import { fallbackProjects } from "@/content/fallback-content";
import { localeHref, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/sanity/client";
import { postSlugsQuery, projectSlugsQuery } from "@/sanity/queries";

/**
 * Cada página aparece una vez por idioma, y cada entrada declara a su par.
 *
 * Las alternates no son un adorno: sin ellas Google ve dos páginas parecidas,
 * decide que una es copia de la otra y se queda con una sola. Con ellas
 * entiende que son la misma página en dos lenguas y le muestra a cada uno la
 * que le toca.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    sanityFetch<string[]>(projectSlugsQuery, {}, []),
    sanityFetch<string[]>(postSlugsQuery, {}, []),
  ]);

  const projects = projectSlugs.length
    ? projectSlugs
    : fallbackProjects.map((p) => p.slug);

  const now = new Date();

  const rutas: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/contacto", priority: 0.9 },
    { path: "/proyectos", priority: 0.8 },
    { path: "/notas", priority: 0.6 },
    ...projects.map((slug) => ({ path: `/proyectos/${slug}`, priority: 0.7 })),
    ...postSlugs.map((slug) => ({ path: `/notas/${slug}`, priority: 0.5 })),
  ];

  const absoluta = (path: string) =>
    `${siteUrl}${path === "/" ? "" : path}` || siteUrl;

  return rutas.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: absoluta(localeHref(path, locale)),
      lastModified: now,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((otro) => [otro, absoluta(localeHref(path, otro))]),
        ),
      },
    })),
  );
}
