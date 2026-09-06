import { defineArrayMember, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Contenido",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Párrafo", value: "normal" },
        { title: "Título", value: "h2" },
        { title: "Subtítulo", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Itálica", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Enlace",
            fields: [
              { name: "href", type: "url", title: "URL" },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Texto alternativo" },
        { name: "caption", type: "string", title: "Epígrafe" },
      ],
    }),
  ],
});
