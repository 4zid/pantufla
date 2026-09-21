import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { brief } from "./brief";
import { meeting } from "./meeting";
import { post } from "./post";
import { project } from "./project";
import { siteCopy } from "./site-copy";
import { siteSections } from "./site-sections";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteCopy,
  siteSections,
  project,
  post,
  testimonial,
  brief,
  meeting,
  blockContent,
];
