import { defineField, defineType } from "sanity";

/**
 * El texto del sitio, un documento por idioma.
 *
 * Traducción a nivel documento y no a nivel campo: dos documentos enteros, uno
 * en español y uno en inglés, en vez de un solo documento con cada campo
 * duplicado. Con dos idiomas la diferencia es de trabajo diario —editar una
 * página en un idioma contra saltar entre dos cajas en cada uno de doscientos
 * campos— y además el texto se lee entero, que es como se escribe: nadie
 * corrige un titular sin ver el párrafo que sigue.
 *
 * Los ids no son decorativos. El color de cada plan, el número de cada etapa y
 * el logo de cada plataforma viven en el código y se cruzan por id con lo que
 * se carga acá. Cambiar un id acá deja el bloque sin su diseño.
 *
 * Nada de esto es obligatorio: lo que no se carga cae al texto que ya está en
 * el repositorio. Se puede ir pasando de a una sección.
 */

const link = (nombre: string, titulo: string) =>
  defineField({
    name: nombre,
    title: titulo,
    type: "object",
    fields: [
      defineField({ name: "label", title: "Texto", type: "string" }),
      defineField({
        name: "href",
        title: "Destino",
        type: "string",
        description:
          "Sin el idioma adelante: /contacto, /#planes. El prefijo lo pone el sitio.",
      }),
    ],
  });

const texto = (nombre: string, titulo: string, filas = 3) =>
  defineField({ name: nombre, title: titulo, type: "text", rows: filas });

export const siteCopy = defineType({
  name: "siteCopy",
  title: "Texto del sitio",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Idioma",
      type: "string",
      options: {
        list: [
          { title: "Español", value: "es" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    /* --- Identidad --- */
    defineField({
      name: "meta",
      title: "Identidad y buscadores",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "tagline", title: "Bajada", type: "string" }),
        texto("description", "Descripción para buscadores"),
        defineField({
          name: "keywords",
          title: "Palabras clave",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "ogLocale",
          title: "Locale de Open Graph",
          type: "string",
          description: "es_AR o en_US.",
        }),
      ],
    }),

    /* --- Navegación --- */
    defineField({
      name: "nav",
      title: "Navegación",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Texto", type: "string" },
            { name: "href", title: "Destino", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "header",
      title: "Barra superior",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "cta", title: "Botón", type: "string" }),
        defineField({ name: "ctaHref", title: "Destino del botón", type: "string" }),
        defineField({ name: "openMenu", title: "Abrir menú", type: "string" }),
        defineField({
          name: "skip",
          title: "Saltar al contenido",
          type: "string",
        }),
        defineField({ name: "closeMenu", title: "Cerrar menú", type: "string" }),
        defineField({ name: "language", title: "Idioma", type: "string" }),
      ],
    }),

    /* --- Hero --- */
    defineField({
      name: "hero",
      title: "Portada",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "titleSegments",
          title: "Titular por tramos",
          description:
            "Cada tramo es una parte del titular. Los que llevan resaltado salen en pastilla.",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "text", title: "Texto", type: "string" },
                {
                  name: "mark",
                  title: "Resaltado",
                  type: "string",
                  options: {
                    list: [
                      { title: "Sin resaltar", value: "" },
                      { title: "Pastilla blanca", value: "paper" },
                      { title: "Pastilla negra", value: "ink" },
                    ],
                  },
                },
              ],
              preview: { select: { title: "text", subtitle: "mark" } },
            },
          ],
        }),
        texto("lead", "Bajada"),
        link("primary", "Botón principal"),
        link("secondary", "Botón secundario"),
        defineField({
          name: "proof",
          title: "Línea de garantías",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "dashboard",
          title: "Tablero de la portada",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({ name: "status", title: "Estado", type: "string" }),
            defineField({ name: "range", title: "Período", type: "string" }),
            defineField({
              name: "visits",
              title: "Visitas",
              type: "object",
              fields: [
                { name: "title", title: "Título", type: "string" },
                { name: "badge", title: "Variación", type: "string" },
                { name: "value", title: "Número", type: "string" },
              ],
            }),
            defineField({
              name: "visitsStats",
              title: "Pie de visitas",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "key", title: "Etiqueta", type: "string" },
                    { name: "value", title: "Valor", type: "string" },
                  ],
                  preview: { select: { title: "key", subtitle: "value" } },
                },
              ],
            }),
            defineField({
              name: "visitsAxis",
              title: "Fechas del gráfico",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "conversion",
              title: "Conversión",
              type: "object",
              fields: [
                { name: "title", title: "Título", type: "string" },
                { name: "badge", title: "Variación", type: "string" },
                { name: "note", title: "Aclaración", type: "string" },
              ],
            }),
            defineField({
              name: "speed",
              title: "Velocidad",
              type: "object",
              fields: [
                { name: "title", title: "Título", type: "string" },
                { name: "badge", title: "Variación", type: "string" },
                { name: "mobile", title: "Móvil", type: "string" },
                { name: "desktop", title: "Escritorio", type: "string" },
              ],
            }),
            defineField({
              name: "traffic",
              title: "Tráfico",
              type: "object",
              fields: [
                { name: "title", title: "Título", type: "string" },
                { name: "note", title: "Período", type: "string" },
                {
                  name: "channels",
                  title: "Canales",
                  type: "array",
                  of: [{ type: "string" }],
                },
              ],
            }),
          ],
        }),
      ],
    }),

    /* --- Tira de prueba social --- */
    defineField({
      name: "socialProof",
      title: "Prueba social",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "label",
          title: "Nombre de la sección",
          type: "string",
          description: "Solo lo escucha quien navega con lector de pantalla.",
        }),
        texto("claim", "Frase"),
      ],
    }),

    /* --- Cómo trabajamos --- */
    defineField({
      name: "approach",
      title: "Cómo trabajamos",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        defineField({
          name: "pillars",
          title: "Pilares",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "id",
                  title: "Id",
                  type: "string",
                  description: "alcance, ritmo o entrega. Define el color y el dibujo.",
                },
                { name: "title", title: "Título", type: "string" },
                { name: "body", title: "Texto", type: "text", rows: 3 },
              ],
              preview: { select: { title: "title", subtitle: "id" } },
            },
          ],
        }),
      ],
    }),

    /* --- Capacidades (bento) --- */
    defineField({
      name: "bento",
      title: "Capacidades",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        defineField({
          name: "cards",
          title: "Tarjetas",
          type: "array",
          description:
            "Son cuatro y el orden manda: cada una entra en una celda distinta de la grilla.",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "id",
                  title: "Id",
                  type: "string",
                  description:
                    "velocidad, seo, pantallas o resultados. Define el color, la celda y el dibujo del lienzo.",
                },
                { name: "title", title: "Título", type: "string" },
                { name: "body", title: "Texto", type: "text", rows: 4 },
              ],
              preview: { select: { title: "title", subtitle: "id" } },
            },
          ],
        }),
        defineField({
          name: "figures",
          title: "Textos de los dibujos",
          type: "object",
          description:
            "Lo poco que se lee adentro de las ilustraciones. Cortos: un dibujo con un párrafo adentro deja de ser un dibujo.",
          options: { collapsible: true, collapsed: true },
          fields: [
            {
              name: "speedOurs",
              title: "Cuánto tarda un sitio nuestro",
              type: "string",
              description: "Va grande, adentro del arco. Por ejemplo: «0,9 s».",
            },
            {
              name: "speedTheirs",
              title: "El número contra el que se compara",
              type: "string",
            },
            {
              name: "seoQuestion",
              title: "La pregunta",
              type: "string",
              description: "Como la escribiría alguien: en minúscula y sin punto.",
            },
            { name: "seoAnswer", title: "La respuesta", type: "text", rows: 2 },
            { name: "formButton", title: "Botón del formulario dibujado", type: "string" },
          ],
        }),
      ],
    }),

    /* --- Proceso --- */
    defineField({
      name: "process",
      title: "Proceso",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        defineField({
          name: "labels",
          title: "Etiquetas de cada etapa",
          type: "object",
          fields: [
            { name: "deliverable", title: "Te entregamos", type: "string" },
            { name: "yours", title: "Ponés vos", type: "string" },
          ],
        }),
        defineField({
          name: "steps",
          title: "Etapas",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "id",
                  title: "Id",
                  type: "string",
                  description:
                    "brief, diseno, desarrollo o publicacion. Define el número y el color.",
                },
                { name: "name", title: "Nombre", type: "string" },
                { name: "when", title: "Cuándo", type: "string" },
                { name: "body", title: "Texto", type: "text", rows: 4 },
                { name: "deliverable", title: "Entregable", type: "string" },
                { name: "yours", title: "Lo que pone el cliente", type: "string" },
              ],
              preview: { select: { title: "name", subtitle: "when" } },
            },
          ],
        }),
        defineField({
          name: "payment",
          title: "Cierre de la sección",
          description:
            "La forma de pago, en tramos como el titular de la portada, y el botón de abajo.",
          type: "object",
          fields: [
            defineField({
              name: "segments",
              title: "Texto por tramos",
              description:
                "Los que llevan resaltado salen en pastilla. Sobre el fondo oscuro de esta sección, la celeste es la que más levanta.",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "text", title: "Texto", type: "string" },
                    {
                      name: "mark",
                      title: "Resaltado",
                      type: "string",
                      options: {
                        list: [
                          { title: "Sin resaltar", value: "" },
                          { title: "Pastilla celeste", value: "aqua" },
                          { title: "Pastilla blanca", value: "paper" },
                          { title: "Pastilla rosa", value: "rosa" },
                        ],
                      },
                    },
                  ],
                  preview: { select: { title: "text", subtitle: "mark" } },
                },
              ],
            }),
            link("cta", "Botón"),
          ],
        }),
      ],
    }),

    /* --- Herramientas --- */
    defineField({
      name: "stack",
      title: "Herramientas",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
      ],
    }),

    /* --- Planes --- */
    defineField({
      name: "pricing",
      title: "Planes",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        defineField({ name: "groupLabel", title: "Rótulo del selector", type: "string" }),
        defineField({ name: "totalLabel", title: "Palabra «total»", type: "string" }),
        defineField({
          name: "toggle",
          title: "Formas de pago",
          type: "object",
          fields: [
            {
              name: "once",
              title: "Pago único",
              type: "object",
              fields: [
                { name: "label", title: "Texto", type: "string" },
                { name: "note", title: "Nota corta", type: "string" },
                { name: "noteLong", title: "Nota larga", type: "string" },
              ],
            },
            {
              name: "split",
              title: "En cuotas",
              type: "object",
              fields: [
                { name: "label", title: "Texto", type: "string" },
                { name: "note", title: "Nota corta", type: "string" },
                { name: "noteLong", title: "Nota larga", type: "string" },
              ],
            },
          ],
        }),
        texto("guarantee", "Garantía"),
        defineField({
          name: "plans",
          title: "Planes",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "id",
                  title: "Id",
                  type: "string",
                  description: "landing o sitio. Define el color y cuál va destacado.",
                },
                { name: "name", title: "Nombre", type: "string" },
                { name: "summary", title: "Resumen", type: "string" },
                { name: "bestFor", title: "Para quién", type: "string" },
                {
                  name: "price",
                  title: "Precio",
                  type: "object",
                  fields: [
                    { name: "once", title: "Pago único (USD)", type: "number" },
                    { name: "split", title: "Cada cuota (USD)", type: "number" },
                    { name: "splitCount", title: "Cantidad de cuotas", type: "number" },
                  ],
                },
                { name: "delivery", title: "Plazo", type: "string" },
                { name: "badge", title: "Etiqueta destacada", type: "string" },
                {
                  name: "cta",
                  title: "Botón",
                  type: "object",
                  fields: [
                    { name: "label", title: "Texto", type: "string" },
                    { name: "href", title: "Destino", type: "string" },
                  ],
                },
                {
                  name: "features",
                  title: "Qué incluye",
                  type: "array",
                  of: [{ type: "string" }],
                },
              ],
              preview: { select: { title: "name", subtitle: "summary" } },
            },
          ],
        }),
        defineField({
          name: "contact",
          title: "Tarjeta «contactanos»",
          type: "object",
          fields: [
            { name: "name", title: "Nombre", type: "string" },
            { name: "summary", title: "Resumen", type: "string" },
            { name: "price", title: "Precio", type: "string" },
            {
              name: "features",
              title: "Qué incluye",
              type: "array",
              of: [{ type: "string" }],
            },
            {
              name: "cta",
              title: "Botón",
              type: "object",
              fields: [
                { name: "label", title: "Texto", type: "string" },
                { name: "href", title: "Destino", type: "string" },
              ],
            },
          ],
        }),
        defineField({
          name: "existing",
          title: "Ya tengo un sitio",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            { name: "title", title: "Título", type: "string" },
            { name: "summary", title: "Resumen", type: "text", rows: 2 },
            {
              name: "platforms",
              title: "Plataformas",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "id",
                      title: "Id",
                      type: "string",
                      description: "webflow o framer. Define qué logo se muestra.",
                    },
                    { name: "name", title: "Nombre", type: "string" },
                    { name: "detail", title: "Texto", type: "text", rows: 3 },
                  ],
                  preview: { select: { title: "name", subtitle: "id" } },
                },
              ],
            },
            {
              name: "services",
              title: "Servicios",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "title", title: "Título", type: "string" },
                    { name: "detail", title: "Texto", type: "text", rows: 3 },
                  ],
                  preview: { select: { title: "title", subtitle: "detail" } },
                },
              ],
            },
            { name: "note", title: "Nota", type: "text", rows: 2 },
            {
              name: "cta",
              title: "Botón",
              type: "object",
              fields: [
                { name: "label", title: "Texto", type: "string" },
                { name: "href", title: "Destino", type: "string" },
              ],
            },
          ],
        }),
        defineField({
          name: "alwaysIncluded",
          title: "Siempre incluido",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "offerCatalog",
          title: "Nombre del catálogo (datos estructurados)",
          type: "string",
        }),
      ],
    }),

    /* --- Proyectos, testimonios y mapa --- */
    defineField({
      name: "work",
      title: "Proyectos (home)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada", 2),
        defineField({ name: "view", title: "Palabra «ver»", type: "string" }),
        defineField({ name: "prev", title: "Botón «anteriores» (lectores de pantalla)", type: "string" }),
        defineField({ name: "next", title: "Botón «siguientes» (lectores de pantalla)", type: "string" }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonios",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({
          name: "rating",
          title: "Puntaje",
          type: "string",
          description: "Usá {value} donde va el número. Ej: «{value} de 5».",
        }),
      ],
    }),
    defineField({
      name: "clientsMap",
      title: "Mapa de clientes",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({
          name: "note",
          title: "Pie",
          type: "text",
          rows: 3,
          description: "Usá {count} donde va la cantidad de países.",
        }),
      ],
    }),

    /* --- Preguntas --- */
    defineField({
      name: "faq",
      title: "Preguntas frecuentes",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({
          name: "cta",
          title: "Cierre",
          type: "object",
          fields: [
            { name: "claim", title: "Frase", type: "string" },
            { name: "label", title: "Botón", type: "string" },
            { name: "href", title: "Destino", type: "string" },
          ],
        }),
        defineField({
          name: "items",
          title: "Preguntas",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "q", title: "Pregunta", type: "string" },
                { name: "a", title: "Respuesta", type: "text", rows: 5 },
              ],
              preview: { select: { title: "q" } },
            },
          ],
        }),
      ],
    }),

    /* --- Reserva de reunión --- */
    defineField({
      name: "meeting",
      title: "Reserva de reunión",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "metaTitle", title: "Título de la pestaña", type: "string" }),
        texto("metaDescription", "Descripción para buscadores", 2),
        defineField({ name: "eyebrow", title: "Volanta", type: "string" }),
        defineField({ name: "title", title: "Titular", type: "string" }),
        texto("lead", "Bajada"),
        defineField({ name: "expectTitle", title: "Título de los pasos", type: "string" }),
        defineField({
          name: "expect",
          title: "Qué pasa en la llamada",
          description: "Van arriba del calendario: nadie reserva sin saber qué va a pasar.",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", title: "Título", type: "string" },
                { name: "detail", title: "Detalle", type: "text", rows: 3 },
              ],
              preview: { select: { title: "title", subtitle: "detail" } },
            },
          ],
        }),
        defineField({
          name: "loading",
          title: "Mientras carga el calendario",
          type: "string",
        }),
        texto(
          "fallback",
          "Si no hay calendario conectado",
          2,
        ),
        defineField({ name: "preferWrite", title: "Salida hacia el brief", type: "string" }),
        link("write", "Botón hacia el brief"),
      ],
    }),

    /* --- Cierre --- */
    defineField({
      name: "finalCta",
      title: "Cierre de la home",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        link("primary", "Botón"),
        defineField({
          name: "expectationsTitle",
          title: "Título de «qué pasa después»",
          type: "string",
        }),
        defineField({
          name: "expectations",
          title: "Qué pasa después",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "secondaryLabel",
          title: "Enlace de mail",
          type: "string",
          description: "Usá {email} donde va la dirección.",
        }),
      ],
    }),

    /* --- Formulario --- */
    defineField({
      name: "form",
      title: "Formulario",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        campoDeFormulario("name", "Nombre"),
        campoDeFormulario("email", "Email"),
        defineField({
          name: "company",
          title: "Empresa",
          type: "object",
          fields: [
            { name: "label", title: "Etiqueta", type: "string" },
            { name: "optional", title: "Marca de opcional", type: "string" },
            { name: "placeholder", title: "Ejemplo", type: "string" },
          ],
        }),
        defineField({
          name: "plan",
          title: "Plan",
          type: "object",
          fields: [{ name: "label", title: "Etiqueta", type: "string" }],
        }),
        defineField({
          name: "budget",
          title: "Presupuesto",
          type: "object",
          fields: [
            { name: "label", title: "Etiqueta", type: "string" },
            { name: "currency", title: "Moneda", type: "string" },
          ],
        }),
        defineField({
          name: "timeline",
          title: "Plazo",
          type: "object",
          fields: [{ name: "label", title: "Etiqueta", type: "string" }],
        }),
        defineField({
          name: "message",
          title: "Mensaje",
          type: "object",
          fields: [
            { name: "label", title: "Etiqueta", type: "string" },
            { name: "hint", title: "Ayuda", type: "text", rows: 2 },
            { name: "placeholder", title: "Ejemplo", type: "text", rows: 3 },
          ],
        }),
        defineField({ name: "honeypot", title: "Trampa para bots", type: "string" }),
        defineField({ name: "submit", title: "Botón", type: "string" }),
        defineField({ name: "sending", title: "Enviando", type: "string" }),
        texto("privacy", "Nota de privacidad", 2),
        defineField({ name: "genericError", title: "Error genérico", type: "string" }),
        defineField({
          name: "extraPlans",
          title: "Opciones de plan que no son un plan",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "value", title: "Valor", type: "string" },
                { name: "label", title: "Texto", type: "string" },
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            },
          ],
        }),
        defineField({
          name: "budgetRanges",
          title: "Rangos de presupuesto",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "timelineOptions",
          title: "Opciones de plazo",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "success",
          title: "Después de enviar",
          type: "object",
          fields: [
            { name: "title", title: "Título", type: "string" },
            { name: "body", title: "Texto", type: "text", rows: 4 },
            { name: "urgent", title: "Línea de urgencia", type: "string" },
          ],
        }),
      ],
    }),

    /* --- Páginas internas --- */
    defineField({
      name: "pages",
      title: "Páginas internas",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "proyectos",
          title: "Proyectos",
          type: "object",
          fields: [
            { name: "metaTitle", title: "Título de pestaña", type: "string" },
            { name: "metaDescription", title: "Descripción", type: "text", rows: 2 },
            { name: "eyebrow", title: "Etiqueta", type: "string" },
            { name: "title", title: "Título", type: "string" },
            { name: "lead", title: "Bajada", type: "text", rows: 2 },
          ],
        }),
      ],
    }),

    /* --- 404 y pie --- */
    defineField({
      name: "notFound",
      title: "Página 404",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Etiqueta", type: "string" }),
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada", 2),
        link("home", "Botón al inicio"),
        link("work", "Botón a proyectos"),
      ],
    }),
    defineField({
      name: "footer",
      title: "Pie",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "blurb",
          title: "Párrafo",
          type: "text",
          rows: 3,
          description: "Usá {tagline} y {location} donde van esos datos.",
        }),
        defineField({ name: "navTitle", title: "Título de navegación", type: "string" }),
        defineField({ name: "contactTitle", title: "Título de contacto", type: "string" }),
        link("contactLink", "Enlace a contacto"),
        defineField({ name: "signature", title: "Firma", type: "string" }),
      ],
    }),
  ],

  preview: {
    select: { language: "language", tagline: "meta.tagline" },
    prepare: ({ language, tagline }) => ({
      title: language === "en" ? "Texto del sitio — English" : "Texto del sitio — Español",
      subtitle: tagline,
    }),
  },
});

function campoDeFormulario(nombre: string, titulo: string) {
  return defineField({
    name: nombre,
    title: titulo,
    type: "object",
    fields: [
      { name: "label", title: "Etiqueta", type: "string" },
      { name: "placeholder", title: "Ejemplo", type: "string" },
    ],
  });
}
