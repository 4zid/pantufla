/**
 * Dibuja los contornos del globo de «Dónde trabajamos» y los escribe en
 * content/globo-datos.ts.
 *
 * Salen de Natural Earth (world-atlas, countries-110m). La tierra y los países
 * vienen de la misma topología, así que comparten las costas: el país marcado
 * calza justo encima de la tierra, sin un borde corrido. Se proyectan en
 * equirectangular sobre 2048 × 1024, que es la textura que el globo envuelve
 * en la esfera: la cuenta es una regla de tres y Three.js la mapea sola.
 *
 * Las librerías no son dependencias del sitio (se usan una vez, acá), así que
 * hay que traerlas antes, sin guardarlas:
 *
 *   npm i --no-save world-atlas@2 topojson-client@3 d3-geo@3
 *   node scripts/generar-globo.mjs
 *
 * Para marcar otro país: sumarlo a PAISES con su id de Natural Earth (el
 * código numérico ISO 3166) y su nombre en español, que es la clave que usan
 * content/site.ts y content/countries.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const mundo = JSON.parse(
  readFileSync(require.resolve("world-atlas/countries-110m.json"), "utf8"),
);

const ANCHO = 2048;
const ALTO = 1024;

const PAISES = {
  840: "Estados Unidos",
  170: "Colombia",
  "032": "Argentina",
  724: "España",
  208: "Dinamarca",
};

const proyeccion = geoEquirectangular()
  .scale(ANCHO / (2 * Math.PI))
  .translate([ANCHO / 2, ALTO / 2]);
// Enteros: en una textura de 2048 el redondeo es de medio pixel, un
// décimo de grado, y el archivo pesa un tercio menos.
const camino = geoPath(proyeccion).digits(0);

const tierra = camino(feature(mundo, mundo.objects.land));
const paises = Object.fromEntries(
  feature(mundo, mundo.objects.countries)
    .features.filter((f) => f.id in PAISES)
    .map((f) => [PAISES[f.id], camino(f)]),
);

const faltan = Object.values(PAISES).filter((n) => !(n in paises));
if (faltan.length) throw new Error(`No están en el mapa: ${faltan.join(", ")}`);

const salida = `/*
   Generado por scripts/generar-globo.mjs. No se edita a mano.

   Natural Earth (world-atlas, countries-110m), en equirectangular sobre
   ${ANCHO} × ${ALTO}: de 180°O a 180°E y de 90°N a 90°S.
*/

export const GLOBO_ANCHO = ${ANCHO};
export const GLOBO_ALTO = ${ALTO};

/** Toda la tierra, con las fronteras disueltas. */
export const TIERRA =
  ${JSON.stringify(tierra)};

/** Los países donde trabajamos, por su nombre en español. */
export const PAISES: Record<string, string> = ${JSON.stringify(paises, null, 2)};
`;

writeFileSync(new URL("../content/globo-datos.ts", import.meta.url), salida);
console.log(
  `content/globo-datos.ts: ${(salida.length / 1024).toFixed(1)} KB, ` +
    `${Object.keys(paises).length} países`,
);
