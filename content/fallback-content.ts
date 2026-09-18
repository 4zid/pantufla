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
 * home. Las fichas de /proyectos resuelven solo lo que falta: sin imagen
 * muestran un degradé de la paleta y sin resultados no dibujan el bloque.
 *
 * TESTIMONIOS: los nombres, los cargos y las empresas son de clientes reales;
 * la redacción de cada cita es un borrador escrito acá, no algo que esa
 * persona haya dicho con esas palabras. Antes de publicar conviene pasárselas
 * y que las aprueben o las corrijan. Son cuatro porque la sección muestra
 * cuatro caras en una fila; si se agrega una quinta hay que mirar cómo queda
 * esa fila. Si la lista queda vacía, la sección se oculta sola.
 */

import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const fallbackProjects: SanityProject[] = [
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
    // Sin bajada ni rubro: no los tengo. La tarjeta no los usa y la ficha
    // resuelve sola lo que falta, así que antes que inventarle una
    // descripción a un cliente real, va el nombre y el enlace.
    _id: "work-2mg",
    title: "2MG",
    slug: "2mg",
    art: "/proyectos/2mg.jpg",
    url: "https://2-mg.vercel.app/",
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
