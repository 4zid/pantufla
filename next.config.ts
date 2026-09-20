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
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  typedRoutes: false,
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
