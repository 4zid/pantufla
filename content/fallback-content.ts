/**
 * Contenido que se muestra cuando el CMS todavía no tiene nada cargado.
 *
 * En cuanto exista el primer proyecto o testimonio en /studio, Sanity gana y
 * esto deja de verse. Sirve para que el sitio nunca se muestre vacío: recién
 * clonado, en un deploy de preview o si Sanity no responde.
 *
 * PROYECTOS: son reales y cada uno lleva la URL del sitio publicado, que es a
 * donde va la tarjeta, y el fondo de esa tarjeta.
 *
 * ⚠️ Los cinco fondos de /public/proyectos son de relleno: manchas difusas
 * generadas en código para que la tarjeta tenga su forma definitiva. Para
 * poner los de verdad alcanza con pisar el archivo con el mismo nombre; no hay
 * que tocar código. Desde Sanity el fondo entra por cover y le gana a este. No llevan métricas ni fecha de entrega porque no las
 * tengo; poner números inventados sobre clientes reales sería mentir en la
 * home. Las fichas de /proyectos resuelven solo lo que falta: sin portada,
 * sin resultados o sin caso, ese bloque no se dibuja. Los casos que ya están
 * escritos vienen de content/casos.ts.
 *
 * TESTIMONIOS: los nombres, los cargos y las empresas son de clientes reales;
 * la redacción de cada cita es un borrador escrito acá, no algo que esa
 * persona haya dicho con esas palabras. Antes de publicar conviene pasárselas
 * y que las aprueben o las corrijan. Son cuatro porque la sección muestra
 * cuatro caras en una fila; si se agrega una quinta hay que mirar cómo queda
 * esa fila. Si la lista queda vacía, la sección se oculta sola.
 */

import type { SanityProject, SanityTestimonial } from "@/sanity/types";

import { casos } from "./casos";

/**
 * Una imagen que ya está subida a Sanity, para el respaldo.
 *
 * El CDN de imágenes de Sanity es aparte de la API: si la consulta falla, la
 * imagen igual se sirve. Así la ficha de un caso no pierde su portada ni su
 * galería cuando el CMS no contesta. Los originales de estos archivos están
 * en assets/proyectos.
 */
function enSanity(ref: string, alt?: string) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    ...(alt ? { alt } : {}),
  };
}

export const fallbackProjects: SanityProject[] = [
  {
    // El más nuevo va primero, igual que en Sanity (order 0). Todavía no
    // tiene fondo propio en /public/proyectos: la tarjeta no lo usa y la
    // ficha cae al degradé de la paleta.
    _id: "work-tierras-argentinas",
    title: "Tierras Argentinas",
    slug: "tierras-argentinas",
    url: "https://www.tierrasargentinas.org/",
    tagline:
      "Atlas interactivo de la tierra argentina en manos extranjeras: mapa por provincia y casos con fuentes públicas.",
    sector: "Datos abiertos",
    services: ["Diseño", "Desarrollo"],
    cover: enSanity(
      "image-59a9137d6a6bea3685c10049e2ce1e6eeeab45c5-2560x1600-jpg",
      "El sitio de Tierras Argentinas en escritorio: el titular «¿De quién es la tierra argentina?» con la grilla que muestra la proporción en manos extranjeras, y abajo el mapa provincia por provincia.",
    ),
    gallery: [
      enSanity(
        "image-24a65cdfe06e5e77191f3713c92da40af462f41c-2560x1600-jpg",
        "La sección «Caso por caso»: el caso más grande del registro destacado en negro, con sus 900.000 hectáreas, y abajo las fichas de cada compra con su país, su superficie y su estado.",
      ),
      enSanity(
        "image-70a2cf5d788b1bcce290601959cb9e281d4976a7-2560x1600-jpg",
        "«El Senado, banca por banca»: el proyecto de ley en tratamiento y el hemiciclo con cada banca coloreada según su bloque.",
      ),
      enSanity(
        "image-d099e02cf3560a09f2a7b837bba5227d46c99b26-2560x1600-jpg",
        "Tres pantallas del sitio en el teléfono: la portada con la grilla, el caso por caso y el Senado.",
      ),
    ],
    social: enSanity(
      "image-020f7821626d6d368139e78138c1b2323a52332f-2560x1600-jpg",
    ),
    body: casos["tierras-argentinas"],
    conCaso: true,
  },
  {
    _id: "work-lupa",
    title: "Lupa Studio",
    slug: "lupa-studio",
    art: "/proyectos/lupa-studio.jpg",
    url: "https://www.lupastudio.co/",
    tagline:
      "Sitio de portfolio para una agencia de soluciones creativas, con una estética limpia y actual.",
    sector: "Agencia creativa",
    plan: "Sitio",
    services: ["Diseño", "Desarrollo"],
  },
  {
    _id: "work-remmy",
    title: "Remmy",
    slug: "remmy",
    art: "/proyectos/remmy.jpg",
    url: "https://remmy.la",
    tagline:
      "Landing para una startup de contratación: mensaje directo y una sola línea de lectura.",
    sector: "Recursos humanos",
    plan: "Landing",
    services: ["Copy", "Diseño", "Desarrollo"],
  },
  {
    _id: "work-acacia",
    title: "Acacia",
    slug: "acacia",
    art: "/proyectos/acacia.jpg",
    url: "https://acaciaestetica.com/",
    tagline:
      "Sitio para un salón de belleza, con una estética suave y sin adornos de más.",
    sector: "Belleza",
    plan: "Sitio",
    services: ["Diseño", "Desarrollo"],
  },
  {
    _id: "work-rostar",
    title: "Rostar",
    slug: "rostar",
    art: "/proyectos/rostar.jpg",
    url: "https://rostaremix.framer.website/",
    tagline:
      "Diseño de interfaz y desarrollo para una plataforma que centraliza rosters de youtubers de Estados Unidos.",
    sector: "Plataforma",
    plan: "Sitio",
    services: ["Diseño UI", "Desarrollo"],
  },
  {
    _id: "work-2mg",
    title: "2MG",
    slug: "2mg",
    art: "/proyectos/2mg.jpg",
    url: "https://2-mg.vercel.app/",
    tagline:
      "Sitio para una productora técnica de eventos corporativos: pantallas LED, mapping, audio y streaming en tres países.",
    sector: "Eventos corporativos",
    plan: "Sitio",
    services: ["Diseño", "Desarrollo"],
    body: casos["2mg"],
    conCaso: true,
  },
];

/**
 * Qué imagen le toca a cada slug, para los proyectos que vengan del CMS.
 *
 * Un proyecto cargado en Sanity no tiene el campo art —eso es del respaldo—,
 * así que sin esta tabla los cinco que ya existen perderían la imagen apenas
 * se carguen en el CMS. Va por slug y no por posición, y un proyecto nuevo que
 * no esté acá simplemente no tiene imagen local: la suya la sube por Sanity.
 */
export const arteDeProyecto: Record<string, string | undefined> =
  Object.fromEntries(fallbackProjects.map((p) => [p.slug, p.art]));

/** ⚠️ Inventados. Ver la nota de arriba. */
/**
 * Cuatro citas, una por cara de la fila.
 *
 * Van por idioma y no traducidas al vuelo: una cita es algo que alguien dijo,
 * y en el idioma del visitante tiene que sonar a que lo dijo así. Cuando
 * lleguen las reales, las que estén en un solo idioma se cargan en Sanity con
 * su campo de idioma y listo.
 */
const testimoniosEs: SanityTestimonial[] = [
  {
    _id: "demo-t1",
    quote:
      "Cargo contenido todas las semanas y nunca se me rompió nada. Dejó el sitio armado para que lo use alguien que no es diseñador.",
    name: "Flor",
    role: "Content Manager",
    company: "2MG",
  },
  {
    _id: "demo-t2",
    quote:
      "Soy diseñador y aun así encargué mi propio sitio acá. Es todo lo que puedo decir sobre el criterio.",
    name: "Damián",
    role: "CEO",
    company: "Lupa Studio",
  },
  {
    _id: "demo-t3",
    quote:
      "Le llevé una idea que venía dando vueltas hacía meses y me la devolvió en una pantalla que se entiende en diez segundos.",
    name: "Nico",
    role: "CEO",
    company: "Simplify",
  },
  {
    _id: "demo-t4",
    quote:
      "Dos rondas y estaba. No tuve que explicar lo mismo tres veces ni discutir un tamaño de letra.",
    name: "Vicky",
    role: "CEO",
    company: "HOLD",
  },
];

const testimoniosEn: SanityTestimonial[] = [
  {
    _id: "demo-t1",
    quote:
      "I load content every week and nothing has ever broken. The site was built so that someone who is not a designer can run it.",
    name: "Flor",
    role: "Content Manager",
    company: "2MG",
  },
  {
    _id: "demo-t2",
    quote:
      "I am a designer myself and I still had my own site made here. That is everything I can say about the eye behind it.",
    name: "Damián",
    role: "CEO",
    company: "Lupa Studio",
  },
  {
    _id: "demo-t3",
    quote:
      "I brought in an idea I had been circling for months and got it back as a screen you understand in ten seconds.",
    name: "Nico",
    role: "CEO",
    company: "Simplify",
  },
  {
    _id: "demo-t4",
    quote:
      "Two rounds and it was done. I never had to explain the same thing three times or argue about a font size.",
    name: "Vicky",
    role: "CEO",
    company: "HOLD",
  },
];

export const fallbackTestimonials: Record<string, SanityTestimonial[]> = {
  es: testimoniosEs,
  en: testimoniosEn,
};
