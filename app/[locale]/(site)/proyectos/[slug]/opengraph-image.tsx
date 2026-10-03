import { ImageResponse } from "next/og";

import ImagenDelSitio from "@/app/[locale]/opengraph-image";
import { getProject } from "@/content/get-project";
import { site } from "@/content/site";
import { urlParaRedes } from "@/sanity/image";

/**
 * La imagen que se ve al compartir el link de una ficha.
 *
 * Sin esto la ficha heredaba la del sitio: el mismo cartel con el nombre del
 * estudio para todos los proyectos, así que un caso pasado por WhatsApp no
 * mostraba nada del caso. Ahora usa la «Imagen para redes» del proyecto en el
 * Studio, o su portada si no tiene una, recortada a 1200×630. Un proyecto sin
 * ninguna de las dos sigue con la del sitio.
 *
 * La foto se baja acá antes de armar la imagen y entra como data URI. Pasarle
 * la URL al generador dejaría la descarga para el momento de dibujar, y si
 * ahí falla el pedido termina en un error en vez de en la imagen del sitio.
 */

export const alt = `Un proyecto de ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 60;

async function bajar(url: string) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const bytes = Buffer.from(await respuesta.arrayBuffer());
    return `data:image/jpeg;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const proyecto = await getProject(slug);
  const url = urlParaRedes(proyecto?.social ?? proyecto?.cover);
  const foto = url ? await bajar(url) : null;

  if (!foto) return ImagenDelSitio({ params: Promise.resolve({ locale }) });

  return new ImageResponse(
    <img
      src={foto}
      alt=""
      width={size.width}
      height={size.height}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
    size,
  );
}
