import { defineField, defineType } from "sanity";

/**
 * Alguien que dejó el mail en el pase para reservar su lugar en la agenda.
 *
 * Lo escribe /api/lugar y nadie más, así que es de solo lectura, como los
 * briefs y las reuniones. Es una lista de espera: quien está acá pidió que le
 * escriban primero cuando se abra el próximo cupo, no compró nada ni tiene
 * una fecha.
 *
 * El id sale del mail, así que dejarlo dos veces no crea dos filas: queda la
 * primera, que es la que dice desde cuándo espera.
 */
export const lugar = defineType({
  name: "lugar",
  title: "Lugar reservado",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "origen",
      title: "Dónde lo dejó",
      type: "string",
      options: {
        list: [
          { title: "En el pase de la portada", value: "hero" },
          { title: "En el pase del cierre", value: "cierre" },
        ],
      },
    }),
    defineField({ name: "idioma", title: "Idioma", type: "string" }),
    defineField({ name: "receivedAt", title: "Recibido", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Más recientes primero",
      name: "recientes",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "email", fecha: "receivedAt", origen: "origen" },
    prepare: ({ title, fecha, origen }) => ({
      title,
      subtitle: [
        fecha ? new Date(fecha).toLocaleDateString("es-AR") : null,
        origen === "cierre" ? "cierre" : origen === "hero" ? "portada" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
