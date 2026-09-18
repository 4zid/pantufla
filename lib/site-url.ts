/**
 * La dirección pública del sitio, en un solo lugar.
 *
 * Estaba escrita cuatro veces —layout, robots, sitemap y el grafo de datos
 * estructurados— y las cuatro con el mismo respaldo. No es un problema de
 * repetición sino de a dónde apunta: de acá salen los canonical, los hreflang,
 * las URL del sitemap y todos los @id del grafo. Si el respaldo señala un
 * host equivocado, el sitio le está diciendo al buscador «la versión buena de
 * esta página está en otro lado» y ese otro lado no contesta.
 *
 * El respaldo es el www y no el apex. En Vercel el dominio principal es
 * www.pantufla.design: el apex está cargado como redirección 308 hacia él. O
 * sea que el apex, cuando funcione, va a terminar en el www igual, y declarar
 * como canónica una URL que redirige es pedirle al buscador que haga un salto
 * de más en cada página.
 *
 * Si algún día el principal pasa a ser el apex, se cambia en Vercel y se
 * pone NEXT_PUBLIC_SITE_URL acá: la variable manda sobre el respaldo.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pantufla.design";
