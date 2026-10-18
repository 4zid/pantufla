import { defineField, defineType } from "sanity";

/**
 * Alguien que dejó sus datos en el pase para reservar su lugar en la agenda:
 * desde la portada, el mail; desde el banner de la mitad de la home, nombre
 * y mail.
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
    defineField({ name: "nombre", title: "Nombre", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "origen",
      title: "Dónde lo dejó",
      type: "string",
      options: {
        list: [
          { title: "En el pase de la portada", value: "hero" },
          { title: "En el banner de la mitad", value: "banner" },
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
    select: {
      email: "email",
      nombre: "nombre",
      fecha: "receivedAt",
      origen: "origen",
    },
    prepare: ({ email, nombre, fecha, origen }) => ({
      title: nombre || email,
      subtitle: [
        nombre ? email : null,
        fecha ? new Date(fecha).toLocaleDateString("es-AR") : null,
        origen === "banner" ? "banner" : origen === "hero" ? "portada" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
