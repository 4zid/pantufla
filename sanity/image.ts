import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, hasSanity, projectId } from "./env";

const builder = hasSanity
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: Image | undefined | null) {
  if (!builder || !source?.asset?._ref) return null;
  return builder.image(source).auto("format").fit("max");
}

/**
 * La imagen de una ficha para cuando se comparte el link: 1200×630 recortada
 * y en JPG. No pasa por urlForImage porque ahí el formato es automático, y
 * quien la pide es el generador de la imagen social, no un navegador: con
 * formato automático Sanity puede contestar AVIF o WebP, que el generador no
 * sabe leer.
 */
export function urlParaRedes(source: Image | undefined | null) {
  if (!builder || !source?.asset?._ref) return null;
  return builder
    .image(source)
    .width(1200)
    .height(630)
    .fit("crop")
    .format("jpg")
    .quality(85)
    .url();
}
