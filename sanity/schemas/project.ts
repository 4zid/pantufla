import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Cliente o proyecto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Bajada",
      type: "string",
      description: "Una línea sobre qué se resolvió. Máximo 120 caracteres.",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "sector",
      title: "Rubro",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "string",
    }),
    defineField({
      name: "plan",
      title: "Plan",
      type: "string",
      options: {
        list: [
          { title: "Landing", value: "Landing" },
          { title: "Sitio", value: "Sitio" },
          { title: "A medida", value: "A medida" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "deliveredIn",
      title: "Tiempo de entrega",
      type: "string",
      description: 'Por ejemplo: "9 días".',
    }),
    defineField({
      name: "cover",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Texto alternativo" }],
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Texto alternativo" }],
        },
      ],
    }),
    defineField({
      name: "services",
      title: "Qué hicimos",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "results",
      title: "Resultados",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Dato" },
            { name: "label", type: "string", title: "Qué mide" },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "url",
      title: "Sitio publicado",
      type: "url",
    }),
    defineField({
      name: "body",
      title: "Caso completo",
      type: "blockContent",
    }),
    defineField({
      name: "featured",
      title: "Destacado en la home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Orden manual",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "cover" },
  },
});
