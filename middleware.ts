import { NextResponse, type NextRequest } from "next/server";

import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  defaultLocale,
  detectLocale,
  isLocale,
  locales,
} from "@/lib/i18n";

/**
 * Reparte el tráfico entre los dos idiomas.
 *
 * El español vive en la raíz y el inglés abajo de /en, pero adentro las dos
 * ramas son el mismo árbol de rutas: app/[locale]. Para que eso cierre sin
 * duplicar archivos, lo que llega sin prefijo se REESCRIBE a /es —el visitante
 * sigue viendo /contacto, Next resuelve /es/contacto— y lo que llega con /en
 * pasa derecho.
 *
 * Reescribir y no redirigir es la diferencia entre tener las URLs limpias y
 * tenerlas con un /es que nadie pidió. Y como /es también existe puertas
 * adentro, se lo redirige a la raíz: dos URLs para la misma página es lo que
 * hace que Google elija una y sea la que no querés.
 *
 * La detección por país solo actúa cuando no hay nada elegido. Apenas alguien
 * toca el selector queda la cookie, y de ahí en más manda ella: nada peor que
 * un sitio que te devuelve al idioma que acabás de descartar.
 */

/**
 * Rutas que no tienen nada que ver con el idioma.
 *
 * El Studio no está en la lista aunque sea de una sola lengua: vive adentro
 * del árbol de [locale] como todo lo demás, así que /studio tiene que
 * reescribirse igual que el resto o devuelve 404. Lo que lo deja sin barra ni
 * pie no es el idioma, es estar fuera del grupo (site).
 */
const ajenas = ["/api", "/_next", "/favicon", "/logos", "/og"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (ajenas.some((p) => pathname.startsWith(p))) return NextResponse.next();
  // Archivos sueltos de /public: robots.txt, sitemap.xml, imágenes.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const segmento = pathname.split("/")[1];

  // Inglés: la URL ya dice a dónde va.
  if (segmento === "en") return seguir(request, "en");

  // /es/... es la ruta interna, no una URL pública. Se canoniza a la raíz.
  if (segmento === defaultLocale) {
    const limpia = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(new URL(`${limpia}${search}`, request.url));
  }

  const elegido = request.cookies.get(LOCALE_COOKIE)?.value;
  const idioma = isLocale(elegido)
    ? elegido
    : detectLocale({
        country:
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry"),
        acceptLanguage: request.headers.get("accept-language"),
      });

  if (idioma === "en") {
    return NextResponse.redirect(
      new URL(`/en${pathname === "/" ? "" : pathname}${search}`, request.url),
    );
  }

  return NextResponse.rewrite(
    new URL(
      `/${defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    ),
    { request: { headers: conIdioma(request, defaultLocale) } },
  );
}

/**
 * El idioma viaja en un header del pedido.
 *
 * Lo necesita la pantalla de 404: cuando una ruta no existe, Next se saltea el
 * layout raíz —que es justo el que sabe el idioma y arma el documento— así que
 * el 404 tiene que resolverlo por su cuenta. La URL no alcanza, porque una
 * dirección inventada puede no tener prefijo y aun así corresponder a alguien
 * que estaba leyendo en inglés.
 */
function conIdioma(request: NextRequest, idioma: string) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, idioma);
  return headers;
}

function seguir(request: NextRequest, idioma: string) {
  return NextResponse.next({ request: { headers: conIdioma(request, idioma) } });
}

export const config = {
  matcher: [
    /*
     * Todo menos los archivos internos de Next y los estáticos. El filtro fino
     * está arriba; esto solo evita despertar el middleware por cada chunk.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export { locales };
