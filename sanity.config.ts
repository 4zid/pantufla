"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  basePath: "/studio",
  title: "Pantufla",
  // El guard de app/studio evita montar el Studio sin projectId real.
  projectId: projectId || "pendiente",
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.documentTypeListItem("project").title("Proyectos"),
            S.documentTypeListItem("post").title("Notas"),
            S.documentTypeListItem("testimonial").title("Testimonios"),
            S.divider(),
            S.documentTypeListItem("brief").title("Briefs recibidos"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
