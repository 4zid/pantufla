import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Nota",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
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
      name: "excerpt",
      title: "Resumen",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Tema",
      type: "string",
    }),
    defineField({
      name: "cover",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Texto alternativo" }],
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "blockContent",
    }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "topic", media: "cover" },
  },
});
