import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Las pantallas que corren abajo del hero.
 *
 * Un documento único y sin idioma, como los interruptores de la home: una
 * captura de un sitio es la misma en español que en inglés. Se lee por id
 * (heroGaleria), así que el Studio lo abre directo desde el menú.
 *
 * Mientras no tenga ninguna pantalla, el sitio muestra las de relleno de
 * content/hero-galeria.ts. Apenas tiene una, se usan solo las de acá.
 */
export const heroGaleria = defineType({
  name: "heroGaleria",
  title: "Pantallas del hero",
  type: "document",
  fields: [
    defineField({
      name: "pantallas",
      title: "Pantallas",
      description:
        "Capturas sueltas de sitios. El orden arma las columnas: dos de escritorio seguidas van una arriba de la otra, y una de escritorio sola antes de una de teléfono va grande. Conviene alternar.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pantalla",
          fields: [
            defineField({
              name: "imagen",
              title: "Captura",
              type: "image",
              description:
                "De escritorio, una captura de 1440 × 900 o parecida. De teléfono, de 390 × 844 o parecida. Se muestra entera, sin recortar.",
              validation: (regla) => regla.required(),
            }),
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
                "Para quien no ve la imagen. Por ejemplo: «Home de 2MG en el teléfono».",
            }),
            defineField({
              name: "proyecto",
              title: "Proyecto",
              type: "reference",
              to: [{ type: "project" }],
              description:
                "Opcional. Si el proyecto tiene caso escrito, la pantalla lleva a él.",
            }),
          ],
          preview: {
            select: { title: "alt", subtitle: "formato", media: "imagen" },
            prepare: ({ title, subtitle, media }) => ({
              title: title || "Pantalla sin descripción",
              subtitle: subtitle === "mobile" ? "Teléfono" : "Escritorio",
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Pantallas del hero" }) },
});
