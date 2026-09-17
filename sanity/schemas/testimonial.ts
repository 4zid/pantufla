import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Idioma",
      type: "string",
      description:
        "En qué versión del sitio se muestra. Si lo dejás vacío aparece en las dos.",
      options: {
        list: [
          { title: "Español", value: "es" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "quote",
      title: "Testimonio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Cargo",
      type: "string",
      description: "Por ejemplo: Socia, Fundador, Directora de marketing.",
    }),
    defineField({
      name: "company",
      title: "Empresa",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "project",
      title: "Proyecto relacionado",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "rating",
      title: "Puntaje",
      type: "number",
      description: "De 1 a 5. Si se deja vacío se muestran 5.",
      validation: (rule) => rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "avatar" },
  },
});
