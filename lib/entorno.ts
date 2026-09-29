/**
 * Si este despliegue es el sitio de verdad.
 *
 * Vercel publica producción desde una rama y todo lo demás —staging y
 * cualquier rama de prueba— como despliegues de vista previa, con
 * VERCEL_ENV=preview. Esos no tienen que aparecer en un buscador: serían una
 * copia del sitio compitiendo con el original, y con diseños a medio probar.
 *
 * Fuera de Vercel (en local, en la build de prueba) la variable no existe y
 * se toma como producción, así lo que se ve localmente es lo mismo que sale.
 */
export const esProduccion =
  !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
