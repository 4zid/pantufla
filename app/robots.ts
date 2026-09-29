import type { MetadataRoute } from "next";

import { esProduccion } from "@/lib/entorno";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Staging y las demás vistas previas se cierran enteras a los buscadores.
  if (!esProduccion) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
