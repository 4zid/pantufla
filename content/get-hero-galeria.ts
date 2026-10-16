import type { Image } from "sanity";

import { fallbackProjects } from "@/content/fallback-content";
import { pantallasDeRespaldo, type Pantalla } from "@/content/hero-galeria";
import { localeHref, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { pantallasHeroQuery } from "@/sanity/queries";

type PantallaCms = Image & {
  _key: string;
  formato?: "desktop" | "mobile";
  alt?: string;
  dimensiones?: { width: number; height: number } | null;
};

type ProyectoCms = {
  title?: string;
  slug?: string;
  conCaso?: boolean;
  pantallas?: PantallaCms[];
};

/**
 * Las pantallas de la galería del hero, armada sola con las de los
 * proyectos: primero todas las del primer proyecto, después las del segundo,
 * y así, en el orden que tienen los proyectos en el Studio. Cargar las
 * pantallas de un proyecto nuevo alcanza para que entre en la galería; no
 * hay otra lista que mantener.
 *
 * Una pantalla lleva al caso de su proyecto solo si el caso está escrito, que
 * es lo que hace que la ficha exista para el público. Sin descripción, el
 * texto alternativo es el nombre del proyecto.
 *
 * Mientras ningún proyecto tenga pantallas, o si Sanity no contesta, salen
 * las de respaldo (content/hero-galeria.ts), que son las mismas capturas.
 * Es todo o nada, como antes: mezclar las dos listas repetiría pantallas.
 *
 * El ancho pedido a Sanity alcanza para la columna más ancha de la galería
 * (la de escritorio grande, ~700px) en pantallas de doble densidad.
 */
export async function getHeroGaleria(locale: Locale): Promise<Pantalla[]> {
  const cms = await sanityFetch<ProyectoCms[] | null>(
    pantallasHeroQuery,
    { language: locale },
    null,
    ["project"],
  );

  const reales = (cms ?? []).flatMap((proyecto): Pantalla[] => {
    const slug = proyecto.slug;
    if (!slug) return [];
    const href = proyecto.conCaso
      ? localeHref(`/proyectos/${slug}`, locale)
      : undefined;
    return (proyecto.pantallas ?? []).flatMap((p): Pantalla[] => {
      const formato = p.formato === "mobile" ? "mobile" : "desktop";
      const src = urlForImage(p)
        ?.width(formato === "mobile" ? 520 : 1400)
        .url();
      const medidas = p.dimensiones;
      if (!src || !medidas?.width || !medidas.height) return [];
      return [
        {
          id: `${slug}-${p._key}`,
          src,
          ancho: medidas.width,
          alto: medidas.height,
          formato,
          alt: p.alt || proyecto.title || "",
          proyecto: slug,
          href,
        },
      ];
    });
  });

  if (reales.length) return reales;

  const conCaso = new Set(
    fallbackProjects.filter((p) => p.conCaso).map((p) => p.slug),
  );
  return pantallasDeRespaldo.map((p) =>
    conCaso.has(p.proyecto)
      ? { ...p, href: localeHref(`/proyectos/${p.proyecto}`, locale) }
      : p,
  );
}
