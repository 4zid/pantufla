import { sanityFetch } from "@/sanity/client";
import { siteCopyQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/i18n";

import type { SiteCopy } from "./copy";
import { es } from "./copy.es";
import { en } from "./copy.en";
import { resolveCopy, type ResolvedCopy } from "./resolve";

/**
 * De dónde sale el texto del sitio.
 *
 * Primero Sanity, que es donde se edita. Si no contesta —o si todavía está
 * vacío— entran los archivos locales, que tienen exactamente la misma forma.
 * No es un modo degradado: es el mismo sitio con el texto de ayer, y es lo que
 * hace que un CMS caído no sea una página en blanco.
 *
 * El merge es por sección y no campo por campo. Una sección cargada en Sanity
 * reemplaza entera a la local; una que todavía no se cargó usa la local. Así
 * se puede ir pasando el contenido de a poco sin quedar a mitad de camino con
 * media sección en cada idioma.
 */

const respaldo: Record<Locale, SiteCopy> = { es, en };

export async function getCopy(locale: Locale): Promise<ResolvedCopy> {
  const local = respaldo[locale];

  const remoto = await sanityFetch<Partial<SiteCopy> | null>(
    siteCopyQuery,
    { language: locale },
    null,
    ["siteCopy"],
  );

  const copy: SiteCopy = remoto
    ? ({ ...local, ...limpiar(remoto) } as SiteCopy)
    : local;

  return resolveCopy(copy, locale);
}

/**
 * Saca las secciones que Sanity devuelve vacías.
 *
 * GROQ trae la clave con null cuando el campo no está cargado, y un null pisa
 * al respaldo y deja la sección sin texto. Filtrarlas es la diferencia entre
 * "todavía no lo cargué" y "lo borré".
 */
function limpiar(remoto: Partial<SiteCopy>): Partial<SiteCopy> {
  const salida: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(remoto)) {
    if (valor === null || valor === undefined) continue;
    if (Array.isArray(valor) && valor.length === 0) continue;
    if (clave.startsWith("_")) continue;
    salida[clave] = valor;
  }
  return salida as Partial<SiteCopy>;
}
