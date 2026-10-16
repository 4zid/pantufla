import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Proyecto",
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
      description:
        "Se muestran enteras, a todo el ancho y en este orden, abajo del caso. Pensadas en 16:10, como los mockups.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Texto alternativo" }],
        },
      ],
    }),
    /*
       Las pantallas que este proyecto pone en la galería que corre abajo del
       hero. La galería no tiene lista propia: se arma sola con las pantallas
       de todos los proyectos, en el orden de los proyectos y, dentro de cada
       uno, en el orden de acá. Un proyecto sin pantallas no aparece en ella.
    */
    defineField({
      name: "pantallas",
      title: "Pantallas para la portada",
      description:
        "Capturas sueltas, sin marco: el navegador y el teléfono los dibuja la galería. El orden arma las columnas: dos de escritorio seguidas van una arriba de la otra, y una de escritorio sola antes de una de teléfono va grande. Conviene alternar.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          name: "pantalla",
          fields: [
            defineField({
              name: "formato",
              title: "Formato",
              type: "string",
              initialValue: "desktop",
              options: {
                list: [
                  { title: "Escritorio", value: "desktop" },
                  { title: "Teléfono", value: "mobile" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (regla) => regla.required(),
            }),
            defineField({
              name: "alt",
              title: "Qué se ve",
              type: "string",
              description:
                "Para quien no ve la imagen. Por ejemplo: «La portada de 2MG en el teléfono».",
              validation: (regla) =>
                regla.required().warning("Falta describir la pantalla."),
            }),
          ],
          preview: {
            select: { title: "alt", formato: "formato", media: "asset" },
            prepare: ({ title, formato, media }) => ({
              title: title || "Pantalla sin descripción",
              subtitle: formato === "mobile" ? "Teléfono" : "Escritorio",
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Imagen para redes",
      description:
        "La que aparece al compartir el link de la ficha (WhatsApp, LinkedIn, X). Se recorta a 1200×630 desde el centro. Si queda vacía, se usa la portada.",
      type: "image",
      options: { hotspot: true },
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
