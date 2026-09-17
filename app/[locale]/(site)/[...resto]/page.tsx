import { notFound } from "next/navigation";

/**
 * Comodín que atrapa cualquier ruta que no exista.
 *
 * Sin esto, una URL inventada se caía al 404 que trae Next: pantalla blanca,
 * en inglés, sin barra ni pie y sin el lang del documento. La razón es que el
 * not-found.tsx de un segmento solo se usa cuando alguien llama a notFound()
 * adentro de ese segmento, y una ruta que no existe nunca llega a entrar.
 *
 * Así que se entra a propósito: esta página matchea lo que sobró, llama a
 * notFound() y con eso el 404 se dibuja adentro de [locale], con el idioma que
 * corresponde y con el marco del sitio puesto.
 *
 * No le roba rutas a nadie: Next prefiere siempre el segmento más específico,
 * así que /contacto y /proyectos/algo siguen ganando.
 */
export default function RutaInexistente() {
  notFound();
}
