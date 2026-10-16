import type { Image } from "sanity";

import { pantallasDeRelleno, type Pantalla } from "@/content/hero-galeria";
import { localeHref, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { heroGaleriaQuery } from "@/sanity/queries";

type PantallaCms = {
  _key: string;
  formato?: "desktop" | "mobile";
  alt?: string;
  imagen?: Image;
  dimensiones?: { width: number; height: number } | null;
  proyecto?: { slug?: string; conCaso?: boolean } | null;
};

/**
 * Las pantallas de la galería del hero: las del Studio si hay, y si no las
 * de relleno.
 *
 * Es todo o nada a propósito. Mezclar tres capturas reales con ocho
 * inventadas mostraría trabajos que no son del estudio al lado de los que sí,
 * que es justo lo que no puede pasar en un portfolio.
 *
 * El ancho pedido a Sanity alcanza para la columna más ancha de la galería
 * (la de escritorio grande, ~700px) en pantallas de doble densidad.
 */
export async function getHeroGaleria(locale: Locale): Promise<Pantalla[]> {
  const cms = await sanityFetch<PantallaCms[] | null>(
    heroGaleriaQuery,
    {},
    null,
    ["heroGaleria"],
  );

  const reales = (cms ?? []).flatMap((p): Pantalla[] => {
    const formato = p.formato === "mobile" ? "mobile" : "desktop";
    const src = urlForImage(p.imagen)
      ?.width(formato === "mobile" ? 520 : 1400)
      .url();
    const medidas = p.dimensiones;
    if (!src || !medidas?.width || !medidas.height) return [];
    return [
      {
        id: p._key,
        src,
        ancho: medidas.width,
        alto: medidas.height,
        formato,
        alt: p.alt ?? "",
        href:
          p.proyecto?.slug && p.proyecto.conCaso
            ? localeHref(`/proyectos/${p.proyecto.slug}`, locale)
            : undefined,
      },
    ];
  });

  return reales.length ? reales : pantallasDeRelleno;
}
