/**
 * Los dos idiomas del sitio.
 *
 * El español vive en la raíz y el inglés abajo de /en. No es simetría por
 * pereza: el sitio ya está publicado con las URLs en español, y prefijar todo
 * con /es rompería cada link que ya anda a cambio de nada. El inglés, que
 * arranca de cero, sí puede pagar el prefijo.
 *
 * Los segmentos de ruta quedan en español en los dos idiomas (/en/contacto y
 * no /en/contact). Traducirlos posiciona un poco mejor afuera, pero duplica
 * los slugs de Sanity y el ruteo, y es la clase de cosa que se desincroniza
 * sola. Si algún día importa, el lugar para hacerlo es acá.
 */

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** El prefijo de URL de cada idioma. El de la raíz no lleva ninguno. */
export function localePrefix(locale: Locale) {
  return locale === defaultLocale ? "" : `/${locale}`;
}

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Arma un href para el idioma pedido.
 *
 * Las rutas se escriben una sola vez, en español y sin prefijo, y esta función
 * las traduce a la URL que corresponde. Los enlaces externos, los mailto y los
 * saltos a un ancla de la misma página pasan de largo.
 */
export function localeHref(path: string, locale: Locale) {
  if (!path.startsWith("/")) return path;
  const prefijo = localePrefix(locale);
  if (!prefijo) return path;
  return path === "/" ? prefijo : `${prefijo}${path}`;
}

/**
 * Países donde el español es la lengua oficial o mayoritaria.
 *
 * La lista está para decidir qué ve alguien que llega sin haber elegido nada.
 * Es una apuesta, no un dato: por eso la elección manual siempre le gana y se
 * guarda, y por eso no hay nada acá que dependa de acertar.
 */
const paisesEs = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "ES", "GQ", "GT",
  "HN", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "UY", "VE",
]);

/**
 * Qué idioma mostrarle a alguien que entra por primera vez.
 *
 * Primero el país, que es el dato más confiable de los dos: un argentino de
 * viaje con el teléfono en inglés sigue queriendo leer en español. Recién si
 * no hay país se mira el Accept-Language del navegador.
 */
export function detectLocale({
  country,
  acceptLanguage,
}: {
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (country) return paisesEs.has(country.toUpperCase()) ? "es" : "en";

  if (acceptLanguage) {
    // "es-AR,es;q=0.9,en;q=0.8" → la primera que reconocemos gana.
    const pedidos = acceptLanguage
      .split(",")
      .map((parte) => parte.split(";")[0].trim().slice(0, 2).toLowerCase());
    for (const pedido of pedidos) {
      if (pedido === "es") return "es";
      if (pedido === "en") return "en";
    }
  }

  return defaultLocale;
}

/**
 * Header con el que el middleware le pasa el idioma a la pantalla de 404.
 *
 * Es el único lugar del sitio que no puede deducirlo de la URL: Next renderiza
 * el 404 sin el layout raíz, que es el que conoce el segmento de idioma.
 */
export const LOCALE_HEADER = "x-pantufla-idioma";

/** Dónde se guarda la elección manual. Un año: es una preferencia, no una sesión. */
export const LOCALE_COOKIE = "pantufla-idioma";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
