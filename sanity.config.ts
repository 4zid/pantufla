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
      /*
         La lista a mano y no la automática.

         Con la automática, los documentos únicos —el texto del sitio, los
         interruptores— aparecen como una carpeta con un elemento adentro, y hay
         que entrar dos veces para editar algo que es uno solo. Con
         S.document().documentId() se abre el formulario directamente, que es lo
         que corresponde cuando no hay ninguna lista que recorrer.

         Y los ids son los mismos que usan las consultas del sitio: siteCopy.es,
         siteCopy.en, siteSections. Si acá se escribe otro, el Studio edita un
         documento que el sitio no lee nunca, y no hay ningún error que lo diga.
      */
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Secciones de la home")
              .id("siteSections")
              .child(
                S.document().schemaType("siteSections").documentId("siteSections"),
              ),
            S.listItem()
              .title("Textos del sitio (ES)")
              .id("siteCopyEs")
              .child(S.document().schemaType("siteCopy").documentId("siteCopy.es")),
            S.listItem()
              .title("Textos del sitio (EN)")
              .id("siteCopyEn")
              .child(S.document().schemaType("siteCopy").documentId("siteCopy.en")),
            S.divider(),
            S.documentTypeListItem("project").title("Proyectos"),
            S.documentTypeListItem("post").title("Notas"),
            S.documentTypeListItem("testimonial").title("Testimonios"),
            S.divider(),
            S.documentTypeListItem("brief").title("Briefs recibidos"),
            S.documentTypeListItem("meeting").title("Reuniones agendadas"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
