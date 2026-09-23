import { sanityFetch } from "@/sanity/client";
import { siteSectionsQuery } from "@/sanity/queries";

import {
  FONDOS_POR_DEFECTO,
  SECCIONES,
  SECCIONES_POR_DEFECTO,
  type Fondos,
  type Secciones,
  type SeccionId,
} from "./sections";

/**
 * Qué secciones de la home están prendidas.
 *
 * Lo que no está cargado cuenta como prendido, y es a propósito. Una sección
 * nueva que todavía no tiene interruptor en el documento de Sanity —porque el
 * documento se creó antes de que la sección existiera— tiene que aparecer, no
 * esconderse sola. El apagado es siempre una decisión explícita: alguien tocó
 * el interruptor.
 *
 * Solo false apaga. Un null, un undefined o un campo que no está son «todavía
 * no dijeron nada», que no es lo mismo que «no».
 */
export async function getSections(): Promise<Secciones> {
  const remoto = await sanityFetch<Record<string, unknown> | null>(
    siteSectionsQuery,
    {},
    null,
    ["siteSections"],
  );

  if (!remoto) return { ...SECCIONES_POR_DEFECTO };

  const salida = { ...SECCIONES_POR_DEFECTO };
  for (const { id } of SECCIONES) {
    if (remoto[id] === false) salida[id as SeccionId] = false;
  }
  return salida;
}

/**
 * De qué color está la página en cada sección: claro u oscuro.
 *
 * Mismo documento que los interruptores y misma regla para lo que falta: un
 * campo sin cargar es «lo de fábrica», que está en content/sections.ts. Solo
 * un valor válido cambia algo; cualquier otra cosa se ignora.
 */
export async function getFondos(): Promise<Fondos> {
  const remoto = await sanityFetch<Record<string, unknown> | null>(
    siteSectionsQuery,
    {},
    null,
    ["siteSections"],
  );

  const salida = { ...FONDOS_POR_DEFECTO };
  if (!remoto) return salida;
  for (const { id } of SECCIONES) {
    const valor = remoto[`${id}Fondo`];
    if (valor === "claro" || valor === "oscuro")
      salida[id as SeccionId] = valor;
  }
  return salida;
}
