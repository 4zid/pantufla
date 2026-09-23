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
  /*
     Un grupo por sección, con dos cosas adentro: si se muestra y de qué
     color está la página mientras se la mira. El fondo es del sitio entero
     —una sola superficie que cambia con el scroll— así que elegir «oscuro»
     en una sección es decir que la página se oscurece al llegar a ella y se
     aclara al salir, no que la sección se pinte a sí misma.
  */
  fieldsets: SECCIONES.map((seccion) => ({
    name: seccion.id,
    title: seccion.titulo,
    options: { collapsible: true, collapsed: false, columns: 2 },
  })),
  fields: SECCIONES.flatMap((seccion) => [
    defineField({
      name: seccion.id,
      title: "Se muestra",
      type: "boolean",
      initialValue: true,
      description: seccion.nota,
      options: { layout: "switch" },
      fieldset: seccion.id,
    }),
    defineField({
      name: `${seccion.id}Fondo`,
      title: "Fondo",
      type: "string",
      initialValue: seccion.fondo,
      description:
        seccion.fondo === "oscuro"
          ? "De fábrica: oscuro."
          : "De fábrica: claro.",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Claro", value: "claro" },
          { title: "Oscuro", value: "oscuro" },
        ],
      },
      fieldset: seccion.id,
    }),
  ]),
  preview: {
    prepare: () => ({ title: "Secciones de la home" }),
  },
});
