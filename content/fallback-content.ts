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
export const fallbackTestimonials: SanityTestimonial[] = [
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
];
