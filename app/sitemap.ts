import type { MetadataRoute } from "next";

import { demoProjects } from "@/content/demo-content";
import { sanityFetch } from "@/sanity/client";
import { postSlugsQuery, projectSlugsQuery } from "@/sanity/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    sanityFetch<string[]>(projectSlugsQuery, {}, []),
    sanityFetch<string[]>(postSlugsQuery, {}, []),
  ]);

  const projects = projectSlugs.length
    ? projectSlugs
    : demoProjects.map((p) => p.slug);

  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, priority: 1 },
    { url: `${siteUrl}/proyectos`, lastModified: now, priority: 0.8 },
    { url: `${siteUrl}/notas`, lastModified: now, priority: 0.6 },
    { url: `${siteUrl}/contacto`, lastModified: now, priority: 0.9 },
    ...projects.map((slug) => ({
      url: `${siteUrl}/proyectos/${slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    ...postSlugs.map((slug) => ({
      url: `${siteUrl}/notas/${slug}`,
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
