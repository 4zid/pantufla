import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./blockContent";
import { brief } from "./brief";
import { post } from "./post";
import { project } from "./project";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  post,
  testimonial,
  brief,
  blockContent,
];
