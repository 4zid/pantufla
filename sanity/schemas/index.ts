import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { brief } from "./brief";
import { heroGaleria } from "./hero-galeria";
import { lugar } from "./lugar";
import { meeting } from "./meeting";
import { project } from "./project";
import { siteCopy } from "./site-copy";
import { siteSections } from "./site-sections";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteCopy,
  siteSections,
  heroGaleria,
  project,
  testimonial,
  brief,
  meeting,
  lugar,
  blockContent,
];
