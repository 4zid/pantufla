import type { NextConfig } from "next";

/**
 * Las páginas que se fueron siguen contestando.
 *
 * /contacto, /notas y el listado /proyectos existieron, están en el sitemap
 * que ya se envió y pueden estar enlazadas desde afuera. Borrarlas sin más
 * las convierte en 404: se pierde el enlace y, si alguna estaba indexada, se
 * pierde lo que traía. Con un 308 el buscador mueve la autoridad al destino
 * nuevo y quien tenía el link llega igual.
 *
 * El ancla del destino la agrega el navegador —el # nunca viaja al servidor—
 * así que /contacto termina en la home, en el formulario.
 *
 * Las fichas de proyecto no entran acá: /proyectos/[slug] sigue existiendo, y
 * source "/proyectos" coincide exacto, no con lo que cuelga debajo.
 */
const nextConfig: NextConfig = {
  /*
     El CSS va adentro del HTML y no como archivo aparte. Un archivo de CSS
     bloquea el primer pintado hasta que llega: con Tailwind son trece
     kilobytes que en 4G cuestan un viaje de ida y vuelta —Lighthouse lo
     medía en 300 ms—. En línea llegan con la página. El costo es que quien
     vuelve no lo tiene en caché; para un sitio de una página que se visita
     una vez, la primera visita importa más.
  */
  experimental: { inlineCss: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  typedRoutes: false,
  /*
     Las fuentes van con la versión en el nombre (public/fonts/…-v1.woff2),
     así que pueden quedarse en caché para siempre: si cambian, cambia el
     nombre. Sin esto, public/ se sirve con revalidación en cada visita.
  */
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    const pares: [string, string][] = [
      ["/contacto", "/#brief"],
      ["/proyectos", "/#proyectos"],
      ["/notas", "/"],
      ["/notas/:slug", "/"],
    ];
    // El inglés lleva prefijo y el español no: es la misma regla de rutas que
    // usa el resto del sitio, acá aplicada a mano porque los redirects no
    // pasan por el middleware.
    return pares.flatMap(([desde, hacia]) => [
      { source: desde, destination: hacia, permanent: true },
      {
        source: `/en${desde}`,
        destination: hacia === "/" ? "/en" : `/en${hacia.slice(1)}`,
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
