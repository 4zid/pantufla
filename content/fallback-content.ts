/**
 * Contenido que se muestra cuando el CMS todavía no tiene nada cargado.
 *
 * En cuanto exista el primer proyecto o testimonio en /studio, Sanity gana y
 * esto deja de verse. Sirve para que el sitio nunca se muestre vacío: recién
 * clonado, en un deploy de preview o si Sanity no responde.
 *
 * PROYECTOS: son reales, salen del portfolio de Lautaro
 * (lacazestudio.framer.website). No llevan métricas ni fecha de entrega porque
 * no las tengo; poner números inventados sobre clientes reales sería mentir en
 * la home. Las fichas resuelven solo lo que falta: sin imagen muestran un
 * degradé de la paleta y sin resultados no dibujan el bloque.
 *
 * TESTIMONIOS: ⚠️ SIGUEN SIENDO DE RELLENO. Las personas que firman esas citas
 * no existen. Hay que reemplazarlos por citas reales o borrarlos —la sección
 * se oculta sola si la lista queda vacía— antes de seguir promocionando el
 * sitio.
 */

import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const fallbackProjects: SanityProject[] = [
  {
    _id: "work-ripio",
    title: "Ripio BTC",
    slug: "ripio-btc",
    tagline:
      "UI limpia y un CMS ordenado para que el contenido escale dentro del ecosistema de Ripio.",
    sector: "Fintech",
    plan: "Sitio",
    services: ["Diseño UI", "Desarrollo", "CMS"],
  },
  {
    _id: "work-lupa",
    title: "Lupa Studio",
    slug: "lupa-studio",
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
    tagline:
      "Landing para una startup de contratación: mensaje directo y una sola línea de lectura.",
    sector: "Recursos humanos",
    plan: "Landing",
    services: ["Copy", "Diseño", "Desarrollo"],
  },
  {
    _id: "work-rostar",
    title: "Rostar",
    slug: "rostar",
    tagline:
      "Diseño de interfaz y desarrollo para una plataforma que centraliza rosters de youtubers de Estados Unidos.",
    sector: "Plataforma",
    plan: "Sitio",
    services: ["Diseño UI", "Desarrollo"],
  },
  {
    _id: "work-lz",
    title: "LZ",
    slug: "lz",
    tagline:
      "Sitio mínimo para mostrar obras de construcción sin ruido alrededor.",
    sector: "Construcción",
    plan: "Sitio",
    services: ["Diseño", "Desarrollo"],
  },
  {
    _id: "work-acacia",
    title: "Acacia",
    slug: "acacia",
    tagline:
      "Sitio para un salón de belleza, con una estética suave y sin adornos de más.",
    sector: "Belleza",
    plan: "Sitio",
    services: ["Diseño", "Desarrollo"],
  },
];

/** ⚠️ Inventados. Ver la nota de arriba. */
/**
 * Nueve citas, tres por fila en la grilla de caras.
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
      "Lo que más valoro es que la fecha que me dieron el primer día fue la fecha real. Nunca me había pasado con un proveedor web.",
    name: "Paula Martel",
    role: "Socia",
    company: "Estudio Martel",
  },
  {
    _id: "demo-t2",
    quote:
      "Cargo las salidas nuevas yo misma en cinco minutos. Antes le escribía a alguien y esperaba una semana.",
    name: "Damián Ferreyra",
    role: "Fundador",
    company: "Ruta Norte",
  },
  {
    _id: "demo-t3",
    quote:
      "Presupuesto cerrado, sin extras al final. Salió exactamente lo que decía la propuesta.",
    name: "Inés Cabral",
    role: "Directora",
    company: "Casa Duna",
  },
  {
    _id: "demo-t4",
    quote:
      "Entendieron en la primera reunión algo que yo venía explicando mal hace dos años. El sitio quedó diciendo eso.",
    name: "Tomás Ojeda",
    role: "Director",
    company: "Ojeda Arquitectura",
  },
  {
    _id: "demo-t5",
    quote:
      "Pasamos de recibir dos consultas por mes a recibir dos por semana, y llegan sabiendo lo que cobramos.",
    name: "Carolina Vidal",
    role: "Socia fundadora",
    company: "Clínica Vidal",
  },
  {
    _id: "demo-t6",
    quote:
      "Me mostraron el diseño completo antes de escribir una línea de código. No hubo sorpresas en ningún momento.",
    name: "Sebastián Rey",
    role: "Gerente comercial",
    company: "Agro Rey",
  },
  {
    _id: "demo-t7",
    quote:
      "Tenía un sitio en Webflow hecho a medias. Lo agarraron, lo ordenaron y ahora lo puedo tocar sin miedo.",
    name: "Lucía Brandt",
    role: "Fundadora",
    company: "Brandt Objetos",
  },
  {
    _id: "demo-t8",
    quote:
      "Quince días hábiles, como dijeron. Yo esperaba que se estirara y no se estiró.",
    name: "Martín Quiroga",
    role: "Socio",
    company: "Quiroga & Asociados",
  },
  {
    _id: "demo-t9",
    quote:
      "El video de cinco minutos que grabaron al entregar vale más que cualquier manual. Nunca tuve que volver a preguntar.",
    name: "Valeria Soto",
    role: "Marketing",
    company: "Nodo Salud",
  },
];

const testimoniosEn: SanityTestimonial[] = [
  {
    _id: "demo-t1",
    quote:
      "What I value most is that the date they gave me on day one was the real date. That had never happened to me with a web provider.",
    name: "Paula Martel",
    role: "Partner",
    company: "Estudio Martel",
  },
  {
    _id: "demo-t2",
    quote:
      "I load the new drops myself in five minutes. Before, I would email someone and wait a week.",
    name: "Damián Ferreyra",
    role: "Founder",
    company: "Ruta Norte",
  },
  {
    _id: "demo-t3",
    quote:
      "Fixed budget, no extras at the end. What shipped was exactly what the proposal said.",
    name: "Inés Cabral",
    role: "Director",
    company: "Casa Duna",
  },
  {
    _id: "demo-t4",
    quote:
      "In the first meeting they understood something I had been explaining badly for two years. The site ended up saying it.",
    name: "Tomás Ojeda",
    role: "Director",
    company: "Ojeda Arquitectura",
  },
  {
    _id: "demo-t5",
    quote:
      "We went from two enquiries a month to two a week, and they arrive already knowing what we charge.",
    name: "Carolina Vidal",
    role: "Founding partner",
    company: "Clínica Vidal",
  },
  {
    _id: "demo-t6",
    quote:
      "They showed me the whole design before writing a single line of code. There were no surprises at any point.",
    name: "Sebastián Rey",
    role: "Commercial manager",
    company: "Agro Rey",
  },
  {
    _id: "demo-t7",
    quote:
      "I had a half-finished Webflow site. They picked it up, tidied it and now I can touch it without being afraid.",
    name: "Lucía Brandt",
    role: "Founder",
    company: "Brandt Objetos",
  },
  {
    _id: "demo-t8",
    quote:
      "Fifteen working days, just like they said. I expected it to stretch and it did not.",
    name: "Martín Quiroga",
    role: "Partner",
    company: "Quiroga & Asociados",
  },
  {
    _id: "demo-t9",
    quote:
      "The five-minute video they recorded at handover is worth more than any manual. I never had to ask again.",
    name: "Valeria Soto",
    role: "Marketing",
    company: "Nodo Salud",
  },
];

export const fallbackTestimonials: Record<string, SanityTestimonial[]> = {
  es: testimoniosEs,
  en: testimoniosEn,
};
