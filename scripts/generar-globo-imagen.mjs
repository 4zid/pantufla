/**
 * Saca la imagen quieta del globo de «Dónde trabajamos» del globo 3D y la
 * guarda en public/globo/globo.webp.
 *
 * Es lo que se ve sin WebGL, con una placa por software o con menos
 * movimiento pedido (ver components/sections/globo.tsx), así que tiene que
 * ser exactamente el primer cuadro del 3D: la misma vista (VISTA_INICIAL en
 * lib/globo.ts), los mismos colores. Por eso no se dibuja aparte: se abre la
 * home con el 3D forzado, con el mouse encima para que no gire, y se
 * fotografía el globo solo, sin las marcas (esas van en HTML encima) y con
 * el fondo transparente. Se saca con el tema claro; el oscuro la invierte.
 *
 * Hay que volver a sacarla si cambian los países, la vista, los colores o
 * el dibujo. Con el sitio levantado:
 *
 *   npm run build && PORT=3350 npm run start
 *   node scripts/generar-globo-imagen.mjs [http://localhost:3350]
 *
 * Necesita Playwright con Chromium. En el entorno de Claude Code en la nube
 * ya están instalados; en otra máquina, `npx playwright install chromium`.
 */
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const { chromium } = await import("playwright").catch(
  () => import("/opt/node22/lib/node_modules/playwright/index.mjs"),
);

const RAIZ = resolve(fileURLToPath(import.meta.url), "../..");
const OUT = join(RAIZ, "public/globo");
const SITIO = process.argv[2] ?? "http://localhost:3350";
mkdirSync(OUT, { recursive: true });

// Con WebGL por software: es lo que hay en un navegador sin pantalla, y
// ?globo3d deja que el globo arranque igual.
const navegador = await chromium.launch({
  args: [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
  ],
});
const pagina = await navegador.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await pagina.goto(`${SITIO}/?globo3d`, { waitUntil: "networkidle" });

const caja = pagina.locator("#clientes [data-riel] > div").first();
await caja.scrollIntoViewIfNeeded();
// El mouse encima antes de que arranque: el primer cuadro queda quieto.
await caja.hover({ position: { x: 4, y: 4 } });
await pagina.waitForSelector("#clientes canvas", { timeout: 30000 });
await pagina.waitForTimeout(1500);

await pagina.evaluate(() => {
  for (const el of [document.documentElement, document.body]) {
    el.style.background = "transparent";
  }
  const caja = document.querySelector("#clientes canvas").parentElement;
  for (const el of caja.children) {
    if (el.tagName !== "CANVAS") el.style.display = "none";
  }
});
const png = await caja.screenshot({ omitBackground: true });
await navegador.close();

const salida = join(OUT, "globo.webp");
/* En gris, que es lo que es. La mediana borra el ruido fino que deja el
   render por software (sin ella la imagen pesa el doble) sin ablandar las
   costas, que tienen varios píxeles de ancho. */
await sharp(png)
  .resize(1024, 1024, { fit: "cover" })
  .grayscale()
  .median(3)
  .webp({ quality: 72, alphaQuality: 80, effort: 6 })
  .toFile(salida);
const { size } = await import("node:fs").then((fs) => fs.statSync(salida));
console.log(`public/globo/globo.webp: ${(size / 1024).toFixed(0)} KB`);
