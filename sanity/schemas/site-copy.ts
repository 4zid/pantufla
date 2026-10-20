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
        defineField({
          name: "ctaHref",
          title: "Destino del botón",
          type: "string",
        }),
        defineField({ name: "openMenu", title: "Abrir menú", type: "string" }),
        defineField({
          name: "skip",
          title: "Saltar al contenido",
          type: "string",
        }),
        defineField({
          name: "closeMenu",
          title: "Cerrar menú",
          type: "string",
        }),
        defineField({ name: "language", title: "Idioma", type: "string" }),
        defineField({
          name: "pauseMotion",
          title: "Pausar los rieles",
          type: "string",
          description:
            "Botón que aparece al llegar con el teclado a los rieles que se mueven solos.",
        }),
        defineField({
          name: "resumeMotion",
          title: "Reanudar los rieles",
          type: "string",
        }),
      ],
    }),

    /* --- Hero --- */
    defineField({
      name: "hero",
      title: "Portada",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        texto("eyebrow", "Pastilla de arriba"),
        defineField({
          name: "headline",
          title: "Titular por tramos",
          description:
            "Cada tramo es una parte del titular. Los que van en itálica salen en la letra de acento.",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "text", title: "Texto", type: "string" },
                {
                  name: "mark",
                  title: "Estilo",
                  type: "string",
                  options: {
                    list: [
                      { title: "Normal", value: "" },
                      { title: "Itálica", value: "serif" },
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
          name: "gallery",
          title: "Nombre de la galería de pantallas",
          type: "string",
          description:
            "Solo para el lector de pantalla. Las pantallas se cargan en cada proyecto, en «Pantallas para la portada».",
        }),
      ],
    }),

    /* --- Pase --- */
    defineField({
      name: "pase",
      title: "Pase",
      description:
        "El pase de la portada, el que vuela con el scroll y el que se acuesta en el banner son el mismo. El dibujo es una imagen; acá van los textos del formulario del banner y lo que el pase imprime al reservar.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "alt",
          title: "Qué muestra el pase",
          type: "string",
          description: "Para quien no ve la imagen.",
        }),
        defineField({
          name: "body",
          title: "Qué hace el pase de la portada",
          type: "string",
          description:
            "El pase de la portada es un enlace que baja al banner. Esto es lo que dice el lector de pantalla al llegar a él.",
        }),
        defineField({
          name: "label",
          title: "Etiqueta del campo",
          type: "string",
        }),
        defineField({
          name: "placeholder",
          title: "Ejemplo del campo",
          type: "string",
        }),
        defineField({ name: "submit", title: "Botón", type: "string" }),
        defineField({
          name: "sending",
          title: "Botón mientras envía",
          type: "string",
        }),
        defineField({ name: "fine", title: "Letra chica", type: "string" }),
        defineField({
          name: "invalid",
          title: "Mail inválido",
          type: "string",
        }),
        defineField({
          name: "error",
          title: "Si no se pudo reservar",
          type: "string",
          description: "Usá {email} donde va la dirección del estudio.",
        }),
        defineField({
          name: "success",
          title: "Reservado",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({
              name: "body",
              title: "Texto",
              type: "string",
              description: "Usá {email} donde va el mail que dejó la persona.",
            }),
            defineField({
              name: "reset",
              title: "Usar otro mail",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "titular",
          title: "Etiqueta del panel",
          type: "string",
          description:
            "Lo que el pase imprime arriba del mail cuando se reserva.",
        }),
        defineField({
          name: "reservado",
          title: "Estado al reservar",
          type: "string",
          description: "La etiqueta que el pase imprime al lado del mail.",
        }),
        defineField({
          name: "nombre",
          title: "Campo del nombre",
          description: "Solo lo pide el formulario del banner.",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Etiqueta", type: "string" }),
            defineField({
              name: "placeholder",
              title: "Ejemplo del campo",
              type: "string",
            }),
            defineField({
              name: "missing",
              title: "Si queda vacío",
              type: "string",
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
                  description:
                    "alcance, ritmo o entrega. Define el color y el dibujo.",
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
              name: "speedCaption",
              title: "Rótulo de la regla de tiempo",
              type: "string",
            },
            {
              name: "speedOurs",
              title: "Cuánto tarda un sitio nuestro",
              type: "string",
              description: "Va grande. Por ejemplo: «0,9 s».",
            },
            {
              name: "speedTheirs",
              title: "El número contra el que se compara",
              type: "string",
            },
            {
              name: "speedLabelOurs",
              title: "Etiqueta de la marca nuestra",
              type: "string",
            },
            {
              name: "speedLabelTheirs",
              title: "Etiqueta de la marca de comparación",
              type: "string",
            },
            {
              name: "seoCaption",
              title: "Volanta de la respuesta",
              type: "string",
              description:
                "Arriba de la respuesta. Por ejemplo: «Lo que contesta ChatGPT».",
            },
            {
              name: "seoQuestion",
              title: "La pregunta",
              type: "string",
              description:
                "Como la escribiría alguien: en minúscula y sin punto.",
            },
            { name: "seoAnswer", title: "La respuesta", type: "text", rows: 2 },
            {
              name: "leadsCaption",
              title: "Rótulo de las barras de consultas",
              type: "string",
            },
            {
              name: "leadsStart",
              title: "Extremo izquierdo del eje",
              type: "string",
              description: "Por ejemplo: «Lanzamiento».",
            },
            {
              name: "leadsEnd",
              title: "Extremo derecho del eje",
              type: "string",
              description: "Por ejemplo: «Hoy».",
            },
            {
              name: "formNotice",
              title: "Aviso sobre las barras",
              type: "string",
              description: "Por ejemplo: «Nueva consulta».",
            },
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
                {
                  name: "yours",
                  title: "Lo que pone el cliente",
                  type: "string",
                },
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
                          { title: "Pastilla blanca", value: "paper" },
                          { title: "Pastilla celeste", value: "aqua" },
                          { title: "Pastilla rosa", value: "rosa" },
                          { title: "Pastilla verde", value: "verde" },
                          { title: "Pastilla miel", value: "miel" },
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
        defineField({
          name: "groupLabel",
          title: "Rótulo del selector",
          type: "string",
        }),
        defineField({
          name: "totalLabel",
          title: "Palabra «total»",
          type: "string",
        }),
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
                  description:
                    "landing o sitio. Define el color y cuál va destacado.",
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
                    {
                      name: "split",
                      title: "Cada cuota (USD)",
                      type: "number",
                    },
                    {
                      name: "splitCount",
                      title: "Cantidad de cuotas",
                      type: "number",
                    },
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
                      description:
                        "webflow o framer. Define qué logo se muestra.",
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
        defineField({
          name: "readCase",
          title: "Enlace al caso escrito",
          type: "string",
        }),
        defineField({
          name: "all",
          title: "Enlace a todos los proyectos",
          type: "string",
        }),
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
        defineField({
          name: "backdrop",
          title: "Palabra de atrás del globo",
          type: "string",
          description:
            "Va gigante y en mayúsculas detrás del globo. Corta: una palabra.",
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
        defineField({
          name: "metaTitle",
          title: "Título de la pestaña",
          type: "string",
        }),
        texto("metaDescription", "Descripción para buscadores", 2),
        defineField({ name: "eyebrow", title: "Volanta", type: "string" }),
        defineField({ name: "title", title: "Titular", type: "string" }),
        texto("lead", "Bajada"),
        defineField({
          name: "expectTitle",
          title: "Título de los pasos",
          type: "string",
        }),
        defineField({
          name: "expect",
          title: "Qué pasa en la llamada",
          description:
            "Van arriba del calendario: nadie reserva sin saber qué va a pasar.",
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
        texto("fallback", "Si no hay calendario conectado", 2),
        defineField({
          name: "preferWrite",
          title: "Salida hacia el brief",
          type: "string",
        }),
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

    /* --- El banner del pase: donde aterriza --- */
    defineField({
      name: "lugar",
      title: "Banner del pase",
      description:
        "La sección de la mitad de la home donde el pase aterriza acostado, en el hueco que le falta al banner.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        texto("lead", "Bajada"),
        defineField({
          name: "hueco",
          title: "Texto del hueco",
          type: "string",
          description:
            "Lo que se lee en el hueco mientras el pase todavía no aterrizó.",
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
        defineField({
          name: "honeypot",
          title: "Trampa para bots",
          type: "string",
        }),
        defineField({ name: "submit", title: "Botón", type: "string" }),
        defineField({ name: "sending", title: "Enviando", type: "string" }),
        texto("privacy", "Nota de privacidad", 2),
        defineField({
          name: "genericError",
          title: "Error genérico",
          type: "string",
        }),
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
            {
              name: "metaDescription",
              title: "Descripción",
              type: "text",
              rows: 2,
            },
            { name: "eyebrow", title: "Etiqueta", type: "string" },
            { name: "title", title: "Título", type: "string" },
            { name: "lead", title: "Bajada", type: "text", rows: 2 },
          ],
        }),
        defineField({
          name: "proyecto",
          title: "Ficha de cada proyecto",
          type: "object",
          fields: [
            { name: "viewSite", title: "Enlace al sitio", type: "string" },
            { name: "sector", title: "Rótulo «Rubro»", type: "string" },
            { name: "plan", title: "Rótulo «Plan»", type: "string" },
            { name: "delivery", title: "Rótulo «Entrega»", type: "string" },
            { name: "year", title: "Rótulo «Año»", type: "string" },
            { name: "services", title: "Rótulo «Qué hicimos»", type: "string" },
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
        defineField({
          name: "navTitle",
          title: "Título de navegación",
          type: "string",
        }),
        defineField({
          name: "contactTitle",
          title: "Título de contacto",
          type: "string",
        }),
        link("contactLink", "Enlace a contacto"),
        defineField({ name: "signature", title: "Firma", type: "string" }),
      ],
    }),
  ],

  preview: {
    select: { language: "language", tagline: "meta.tagline" },
    prepare: ({ language, tagline }) => ({
      title:
        language === "en"
          ? "Texto del sitio — English"
          : "Texto del sitio — Español",
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
