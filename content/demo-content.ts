/**
 * ⚠️ CONTENIDO DE MUESTRA — REEMPLAZAR ANTES DE PUBLICAR
 *
 * Estos proyectos y testimonios son de relleno. Existen para que el sitio se
 * vea completo mientras el CMS está vacío. En cuanto cargues el primer
 * proyecto o testimonio real en /studio, Sanity gana y esto deja de mostrarse.
 *
 * No publiques el sitio con estos datos: son ejemplos, no clientes reales.
 */

import type { SanityProject, SanityTestimonial } from "@/sanity/types";

export const demoProjects: SanityProject[] = [
  {
    _id: "demo-1",
    title: "Estudio Martel",
    slug: "estudio-martel",
    tagline: "Portfolio de arquitectura con obras cargadas desde el panel.",
    sector: "Arquitectura",
    year: "2026",
    plan: "Sitio",
    deliveredIn: "13 días",
    services: ["Estructura", "Diseño", "Desarrollo", "CMS"],
    results: [
      { value: "13 días", label: "de brief a publicación" },
      { value: "+3×", label: "consultas por el formulario" },
    ],
  },
  {
    _id: "demo-2",
    title: "Ruta Norte",
    slug: "ruta-norte",
    tagline: "Landing de campaña para una agencia de viajes de montaña.",
    sector: "Turismo",
    year: "2026",
    plan: "Landing",
    deliveredIn: "6 días",
    services: ["Copy", "Diseño", "Desarrollo"],
    results: [
      { value: "6 días", label: "de brief a publicación" },
      { value: "4,1%", label: "de conversión a consulta" },
    ],
  },
  {
    _id: "demo-3",
    title: "Casa Duna",
    slug: "casa-duna",
    tagline: "Tienda de deco con catálogo, pagos y retiro por sucursal.",
    sector: "E-commerce",
    year: "2025",
    plan: "A medida",
    deliveredIn: "5 semanas",
    services: ["Diseño", "Desarrollo", "Integraciones"],
    results: [
      { value: "5 semanas", label: "de brief a publicación" },
      { value: "−40%", label: "de abandono en el checkout" },
    ],
  },
];

export const demoTestimonials: SanityTestimonial[] = [
  {
    _id: "demo-t1",
    quote:
      "Lo que más valoro es que la fecha que me dieron el primer día fue la fecha real. Nunca me había pasado con un proveedor web.",
    name: "Paula Martel",
    role: "Socia, Estudio Martel",
  },
  {
    _id: "demo-t2",
    quote:
      "Cargo las salidas nuevas yo misma en cinco minutos. Antes le escribía a alguien y esperaba una semana.",
    name: "Damián Ferreyra",
    role: "Fundador, Ruta Norte",
  },
  {
    _id: "demo-t3",
    quote:
      "Presupuesto cerrado, sin extras al final. Salió exactamente lo que decía la propuesta.",
    name: "Inés Cabral",
    role: "Directora, Casa Duna",
  },
];
