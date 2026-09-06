import { defineField, defineType } from "sanity";

/** Lo que llega del formulario de contacto. Solo lectura desde el Studio. */
export const brief = defineType({
  name: "brief",
  title: "Brief recibido",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", title: "Nombre", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "company", title: "Empresa", type: "string" }),
    defineField({ name: "plan", title: "Plan", type: "string" }),
    defineField({ name: "budget", title: "Presupuesto", type: "string" }),
    defineField({ name: "timeline", title: "Plazo", type: "string" }),
    defineField({ name: "message", title: "Mensaje", type: "text", rows: 6 }),
    defineField({ name: "receivedAt", title: "Recibido", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "receivedDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "plan" },
  },
});
