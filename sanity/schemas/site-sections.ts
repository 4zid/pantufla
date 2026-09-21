import { defineField, defineType } from "sanity";

import { SECCIONES } from "../../content/sections";

/**
 * Los interruptores de la home.
 *
 * Un documento único, sin idioma: qué secciones se ven es una decisión del
 * sitio y no del texto. Tenerlo por idioma dejaría la versión en inglés con
 * otras secciones que la española sin que nadie lo haya querido, y nadie se
 * daría cuenta hasta que un cliente de afuera lo cuente.
 *
 * Los campos se generan desde content/sections.ts, que es la lista de verdad.
 * Escribirlos a mano acá significaría que agregar una sección al sitio es
 * acordarse de dos archivos, y el día que uno se olvide la sección nueva no
 * tiene interruptor.
 *
 * Ojo con el valor por defecto: initialValue solo corre cuando se crea el
 * documento desde el Studio. Un campo agregado después llega undefined a un
 * documento que ya existe, así que el sitio trata «no está» como «prendida».
 * Es la única lectura segura: una sección nueva tiene que aparecer, no
 * esconderse sola.
 */
export const siteSections = defineType({
  name: "siteSections",
  title: "Secciones de la home",
  type: "document",
  fields: SECCIONES.map((seccion) =>
    defineField({
      name: seccion.id,
      title: seccion.titulo,
      type: "boolean",
      initialValue: true,
      description: seccion.nota,
      options: { layout: "switch" },
    }),
  ),
  preview: {
    prepare: () => ({ title: "Secciones de la home" }),
  },
});
