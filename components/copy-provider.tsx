"use client";

import { createContext, useContext } from "react";

import type { ResolvedCopy } from "@/content/resolve";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";

/**
 * Reparte el texto y el idioma al árbol de componentes.
 *
 * El copy se busca una sola vez, arriba, en el servidor, y baja por contexto.
 * La alternativa era pasarlo como prop de sección en sección: funciona, pero
 * cada componente nuevo obliga a tocar todos los de arriba, y los de en medio
 * terminan reenviando datos que no usan.
 *
 * Va acá y no en un estado global porque el idioma no cambia durante la
 * navegación: cambia la URL, y con ella todo el árbol.
 */

type Valor = { copy: ResolvedCopy; locale: Locale };

const Contexto = createContext<Valor | null>(null);

export function CopyProvider({
  copy,
  locale,
  children,
}: Valor & { children: React.ReactNode }) {
  return (
    <Contexto.Provider value={{ copy, locale }}>{children}</Contexto.Provider>
  );
}

export function useCopy(): ResolvedCopy {
  const valor = useContext(Contexto);
  if (!valor) {
    throw new Error("useCopy() necesita estar adentro de <CopyProvider>.");
  }
  return valor.copy;
}

export function useLocale(): Locale {
  const valor = useContext(Contexto);
  if (!valor) {
    throw new Error("useLocale() necesita estar adentro de <CopyProvider>.");
  }
  return valor.locale;
}

/**
 * Para los enlaces que no salen del copy: los slugs de proyectos y notas, el
 * logo, el pie. Los del copy ya vienen con el prefijo puesto.
 */
export function useHref() {
  const locale = useLocale();
  return (path: string) => localeHref(path, locale);
}
