import type { MetadataRoute } from "next";

import { fallbackProjects } from "@/content/fallback-content";
import { localeHref, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/sanity/client";
import { projectSlugsQuery } from "@/sanity/queries";

/**
 * Cada página aparece una vez por idioma, y cada entrada declara a su par.
 *
 * Las alternates no son un adorno: sin ellas Google ve dos páginas parecidas,
 * decide que una es copia de la otra y se queda con una sola. Con ellas
 * entiende que son la misma página en dos lenguas y le muestra a cada uno la
 * que le toca.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Con etiqueta, como el resto: publicar un proyecto en el Studio tiene que
  // meterlo en el sitemap en el momento. Sin etiqueta el webhook de
  // /api/revalidate no lo alcanza y la ficha nueva queda fuera hasta que venza
  // sola.
  const projectSlugs = await sanityFetch<string[]>(
    projectSlugsQuery,
    {},
    [],
    ["project"],
  );

  const projects = projectSlugs.length
    ? projectSlugs
    : fallbackProjects.map((p) => p.slug);

  const now = new Date();

  /*
     Tres cosas nada más, porque el sitio ya no es más que eso: la página, la
     reserva y una ficha por proyecto. Los anclas de la home —#proceso,
     #planes, #proyectos— no van: para un buscador son la misma URL, y
     repetirla con distinto fragmento no suma, confunde.
  */
  const rutas: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/reunion", priority: 0.9 },
    ...projects.map((slug) => ({ path: `/proyectos/${slug}`, priority: 0.7 })),
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
