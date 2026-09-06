import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, hasSanity, projectId } from "./env";

const builder = hasSanity
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: Image | undefined | null) {
  if (!builder || !source?.asset?._ref) return null;
  return builder.image(source).auto("format").fit("max");
}
