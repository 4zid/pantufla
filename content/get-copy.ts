import { sanityFetch } from "@/sanity/client";
import { siteCopyQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/i18n";

import type { SiteCopy } from "./copy";
import { pruneHrefs } from "./copy";
import { getSections } from "./get-sections";
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
 */

const respaldo: Record<Locale, SiteCopy> = { es, en };

export async function getCopy(locale: Locale): Promise<ResolvedCopy> {
  const local = respaldo[locale];

  /*
     Las dos consultas en paralelo. Los interruptores hacen falta acá y no solo
     en la home porque de ellos depende adónde apuntan los botones, y los
     botones están en el encabezado y en el pie, que viven en el layout.
  */
  const [remoto, secciones] = await Promise.all([
    sanityFetch<Partial<SiteCopy> | null>(
      siteCopyQuery,
      { language: locale },
      null,
      ["siteCopy"],
    ),
    getSections(),
  ]);

  const copy = (remoto ? fundir(local, remoto) : local) as SiteCopy;

  // La poda va antes del prefijo de idioma, que corre dentro de resolveCopy:
  // los href todavía están en su forma corta —/#planes— y el ancla se lee
  // igual de un lado que del otro, pero mezclarlos sería pedir que un día
  // alguien escriba /en/#planes a mano y deje de coincidir.
  return resolveCopy(pruneHrefs(copy, secciones), locale);
}

/**
 * Mezcla el texto remoto sobre el local, entrando en los objetos.
 *
 * El merge era por sección: una sección cargada en Sanity reemplazaba entera a
 * la local. Suena prolijo y tiene una trampa que nos mordió cuatro veces. El
 * documento de Sanity es una foto de la forma que tenía el copy el día que se
 * cargó; cuando después se le agrega un campo nuevo al código, la sección
 * remota —que no lo tiene— igual gana, y el campo nuevo llega undefined.
 * Mientras el campo era un título suelto el resultado era un texto que faltaba
 * y nadie notaba. Con un objeto adentro, el componente que lo lee revienta y
 * se cae la página entera. Y el sandbox no lo muestra porque acá Sanity está
 * bloqueado y siempre contesta el respaldo: se rompe recién en producción.
 *
 * Entrando en los objetos, el campo nuevo cae al respaldo y lo cargado en
 * Sanity sigue ganando en todo lo demás. Se puede agregar un campo al código y
 * publicar sin tener que cargarlo primero en el CMS.
 *
 * Los arreglos no se funden: se reemplazan enteros. Es lo que hay que hacer.
 * Fundirlos por posición significaría que borrar el cuarto plan en Sanity lo
 * devuelve del respaldo, y que reordenarlos mezcla el texto de uno con el de
 * otro. Un arreglo cargado es la lista completa, con el largo que tenga.
 */
function fundir<T>(local: T, remoto: unknown): T {
  if (!esObjeto(remoto)) return local;

  const salida: Record<string, unknown> = { ...(local as Record<string, unknown>) };

  for (const [clave, valor] of Object.entries(remoto)) {
    // Los internos de Sanity —_id, _type, _rev, _key— no son contenido.
    if (clave.startsWith("_")) continue;

    /*
       GROQ trae la clave con null cuando el campo no está cargado, y un null
       pisa al respaldo y deja la sección sin texto. Saltearlos es la
       diferencia entre «todavía no lo cargué» y «lo borré». Un arreglo vacío
       cuenta como lo mismo: nadie carga una lista para dejarla en cero.
    */
    if (valor === null || valor === undefined) continue;
    if (Array.isArray(valor) && valor.length === 0) continue;

    const base = (local as Record<string, unknown> | undefined)?.[clave];
    salida[clave] =
      esObjeto(valor) && esObjeto(base) ? fundir(base, valor) : valor;
  }

  return salida as T;
}

/** Objeto plano: ni null, ni arreglo, ni fecha. */
function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
