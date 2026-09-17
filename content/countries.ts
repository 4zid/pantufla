import type { Locale } from "@/lib/i18n";

/**
 * Cómo se escribe cada país en cada idioma.
 *
 * No va en Sanity y no va en el copy: es una tabla de equivalencias cerrada,
 * no texto que alguien quiera editar. Poner esto en el CMS solo agregaría una
 * forma de romper el mapa escribiendo mal una clave.
 *
 * La clave es el nombre en español, que es como están cargados los clientes en
 * site.ts. Si falta una traducción se muestra la clave: un país sin traducir se
 * lee raro, un país vacío se lee como un error.
 */
const paises: Record<Locale, Record<string, string>> = {
  es: {
    Argentina: "Argentina",
    Uruguay: "Uruguay",
    Chile: "Chile",
    México: "México",
    "Estados Unidos": "Estados Unidos",
    España: "España",
    Alemania: "Alemania",
  },
  en: {
    Argentina: "Argentina",
    Uruguay: "Uruguay",
    Chile: "Chile",
    México: "Mexico",
    "Estados Unidos": "United States",
    España: "Spain",
    Alemania: "Germany",
  },
};

export function nombrePais(pais: string, locale: Locale) {
  return paises[locale][pais] ?? pais;
}
