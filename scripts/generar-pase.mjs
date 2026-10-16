/**
 * Genera las texturas del pase 3D (public/pase): la cara en español y en
 * inglés, el dorso y el mapa de capas.
 *
 *   node scripts/generar-pase.mjs
 *
 * El pase se dibuja en HTML y CSS —mucho más fácil de ajustar que a mano en
 * un canvas— y Chromium lo saca a 2x con fondo transparente, así la silueta
 * (las esquinas, las muescas del talón y el troquel de la cinta) viaja en el
 * alfa. Después sharp lo pasa a WebP.
 *
 * El mapa de capas le dice al material qué es cada zona, un canal por cosa:
 * rojo, cuánto tiene de holográfico; verde, la rugosidad; azul, el metal. El
 * papel queda mate, el panel del titular un poco satinado y el sticker y la
 * esquina holográficos.
 *
 * Los textos del pase están acá y no en el Studio porque son parte del
 * dibujo. Lo único que el sitio escribe encima en vivo es el panel del
 * titular, cuando alguien reserva (ver components/pase/pase-3d.ts): si se
 * mueve el panel, hay que mover también PANEL en ese archivo.
 *
 * Necesita Playwright con Chromium. En el entorno de Claude Code en la nube
 * ya están instalados; en otra máquina, `npx playwright install chromium`.
 */
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const { chromium } = await import("playwright").catch(
  () => import("/opt/node22/lib/node_modules/playwright/index.mjs"),
);

const RAIZ = resolve(fileURLToPath(import.meta.url), "../..");
const OUT = join(RAIZ, "public/pase");
const TMP = mkdtempSync(join(tmpdir(), "pase-"));
mkdirSync(OUT, { recursive: true });
const F = `file://${join(RAIZ, "public/fonts")}`;
const ISO =
  "M5.5 25a3 3 0 0 1 0-6H11C17 19 18.3 15.3 18.7 13.2A2.2 2.2 0 0 1 20.9 11H21a8 8 0 0 1 8 8v3a3 3 0 0 1-3 3Z";

const W = 640,
  H = 1000,
  CORTE = 742;
const silueta = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><mask id="m"><rect width="${W}" height="${H}" rx="40" fill="#fff"/><circle cx="0" cy="${CORTE}" r="22" fill="#000"/><circle cx="${W}" cy="${CORTE}" r="22" fill="#000"/><rect x="262" y="30" width="116" height="22" rx="11" fill="#000"/></mask></defs><rect width="${W}" height="${H}" fill="#fff" mask="url(#m)"/></svg>`,
);

const textos = {
  es: {
    pase: "Pantufla · Pase prioritario",
    n: "N.º 0042",
    bajada: "Estudio de diseño y desarrollo web",
    titular: "Titular",
    nombre: "Tu lugar",
    libre: "Libre",
    info: [
      ["Acceso", "Agenda"],
      ["Cupos", "Pocos por mes"],
      ["Turno", "El próximo"],
    ],
    vale: "Vale por un lugar",
  },
  en: {
    pase: "Pantufla · Priority pass",
    n: "No. 0042",
    bajada: "Web design and development studio",
    titular: "Holder",
    nombre: "Your spot",
    libre: "Open",
    info: [
      ["Access", "Calendar"],
      ["Slots", "Few a month"],
      ["Turn", "The next one"],
    ],
    vale: "Admit one",
  },
};

// Un globo de alambre, como el de la referencia, pero en blanco suave.
const globo = (() => {
  let s = `<svg class="globo" viewBox="-200 -200 400 400" width="560" height="560">`;
  for (let i = 1; i <= 6; i++)
    s += `<ellipse cx="0" cy="0" rx="${(i * 200) / 6}" ry="190" fill="none"/>`;
  for (let i = -5; i <= 5; i++) {
    const y = i * 32;
    const r = Math.sqrt(Math.max(0, 190 * 190 - y * y)) * 1.05;
    s += `<line x1="${-r}" y1="${y}" x2="${r}" y2="${y}"/>`;
  }
  return s + `<circle r="190" fill="none"/></svg>`;
})();

const codigo = (() => {
  let s = "",
    x = 0,
    k = 7;
  while (x < 290) {
    k = (k * 9301 + 49297) % 233280;
    const w = 2 + (k % 5);
    const g = 2 + ((k >> 3) % 4);
    s += `<i style="left:${x}px;width:${w}px"></i>`;
    x += w + g;
  }
  return s;
})();

function cara(t, modo) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${F}/schibsted-grotesk-latin-v1.woff2);font-weight:400 600}
@font-face{font-family:N;src:url(${F}/newsreader-italic-latin-v1.woff2);font-style:italic}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:transparent;width:${W}px;height:${H}px;overflow:hidden}
body{font-family:S,sans-serif;-webkit-font-smoothing:antialiased;color:#121212}
.pase{position:relative;width:${W}px;height:${H}px;overflow:hidden;
  -webkit-mask:url("data:image/svg+xml,${silueta}") 0 0/100% 100% no-repeat;
  background:
    radial-gradient(62% 40% at 12% 14%, #6fcfca 0%, rgba(111,207,202,0) 72%),
    radial-gradient(55% 38% at 96% 26%, #f2a5b6 0%, rgba(242,165,182,0) 72%),
    radial-gradient(70% 44% at 88% 84%, #f4c87d 0%, rgba(244,200,125,0) 72%),
    radial-gradient(62% 44% at 6% 70%, #a6cf95 0%, rgba(166,207,149,0) 72%),
    radial-gradient(50% 30% at 55% 50%, #fdeed4 0%, rgba(253,238,212,0) 80%),
    #f7f2ec}
.globo{position:absolute;left:180px;top:-60px;stroke:rgba(255,255,255,.55);stroke-width:1.2;opacity:.9}
.k{font-size:15px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}
.fila{position:absolute;left:44px;right:44px;top:82px;display:flex;justify-content:space-between}
.marca{position:absolute;left:38px;top:150px;font-size:128px;font-weight:600;letter-spacing:-.055em;line-height:1}
.bajada{position:absolute;left:46px;top:300px;font-size:21px;color:#3d3d3d}
.bajada i{font-family:N;font-size:1.15em}
.panel{position:absolute;left:40px;top:410px;width:420px;height:150px;border-radius:24px;background:#fffdf9;padding:24px 28px}
.panel .k{font-size:13px;color:#6a6a6a}
.nombre{font-size:46px;font-weight:600;letter-spacing:-.035em;margin-top:6px}
.pill{position:absolute;right:22px;top:22px;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;border:1.5px solid #121212;border-radius:999px;padding:5px 11px}
.sello{position:absolute;left:476px;top:398px;width:136px;height:136px;border-radius:50%;
  background:conic-gradient(from 200deg,#6fcfca,#f2a5b6,#f4c87d,#a6cf95,#6fcfca);display:grid;place-items:center;
  box-shadow:inset 0 0 0 6px rgba(255,255,255,.55)}
.sello svg{width:74px;height:40px}
.info{position:absolute;left:40px;right:40px;top:604px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1.5px solid rgba(18,18,18,.18);padding-top:18px}
.info div{padding-right:10px}.info .k{font-size:12px;color:#4f4f4f}.info b{display:block;font-size:22px;font-weight:600;letter-spacing:-.02em;margin-top:6px}
.perfo{position:absolute;left:34px;right:34px;top:${CORTE - 1}px;border-top:2.5px dashed rgba(18,18,18,.35)}
.codigo{position:absolute;left:44px;top:790px;width:300px;height:120px}
.codigo i{position:absolute;top:0;bottom:0;background:#121212}
.talon{position:absolute;right:44px;top:790px;text-align:right}
.talon .k{font-size:13px}.talon b{display:block;font-size:40px;font-weight:600;letter-spacing:-.03em;margin-top:12px;font-variant-numeric:tabular-nums}
.esquina{position:absolute;right:0;top:0;width:96px;height:96px;background:linear-gradient(225deg,transparent 50%,#d9e9f4 50%,#f4c8d6 70%,#fdeed4 85%,#c8eae5)}
/* El mapa de capas: R holográfico, G rugosidad, B metal. Todo lo impreso
   queda con la rugosidad del papel; solo cambian el panel (laminado), el
   sticker y la esquina (holográficos). */
.capas .pase{background:rgb(0,195,0)!important}
.capas .pase *{color:transparent!important;border-color:transparent!important;stroke:transparent!important}
.capas .codigo i{background:transparent}
.capas .panel{background:rgb(0,120,0)}
.capas .sello{background:rgb(255,45,150);box-shadow:none}
.capas .sello svg path{fill:rgb(255,45,150)}
.capas .esquina{background:linear-gradient(225deg,transparent 50%,rgb(255,40,170) 50%)}
</style></head><body class="${modo}"><div class="pase">
${globo}
<div class="fila"><span class="k">${t.pase}</span></div>
<div class="marca">pantufla</div>
<p class="bajada">${t.bajada}</p>
<div class="panel"><span class="k">${t.titular}</span><p class="nombre">${t.nombre}</p><span class="pill">${t.libre}</span></div>
<div class="sello"><svg viewBox="3 11 26 14"><path d="${ISO}" fill="#121212"/></svg></div>
<div class="info">${t.info.map(([a, b]) => `<div><span class="k">${a}</span><b>${b}</b></div>`).join("")}</div>
<div class="perfo"></div>
<div class="codigo">${codigo}</div>
<div class="talon"><span class="k">${t.vale}</span><b>${t.n}</b></div>
<div class="esquina"></div>
</div></body></html>`;
}

function dorso() {
  const isos = Array.from(
    { length: 48 },
    (_, i) =>
      `<svg viewBox="3 11 26 14" style="left:${(i % 6) * 112 - 20 + (Math.floor(i / 6) % 2) * 56}px;top:${Math.floor(i / 6) * 128 + 20}px"><path d="${ISO}"/></svg>`,
  ).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${F}/schibsted-grotesk-latin-v1.woff2);font-weight:400 600}
*{box-sizing:border-box;margin:0;padding:0}html,body{background:transparent;width:${W}px;height:${H}px;overflow:hidden}
.pase{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:S,sans-serif;color:#fff;
  -webkit-mask:url("data:image/svg+xml,${silueta}") 0 0/100% 100% no-repeat;
  background:radial-gradient(70% 50% at 20% 20%,#2a8f89 0%,rgba(42,143,137,0) 70%),radial-gradient(70% 55% at 85% 90%,#a3405a 0%,rgba(163,64,90,0) 70%),linear-gradient(170deg,#166b67,#1f5b62 55%,#5d3a52)}
.pase svg{position:absolute;width:76px;height:41px;fill:rgba(255,255,255,.09)}
.centro{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:260px;height:140px;fill:#fbe4e9}
.pie{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:17px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.8)}
</style></head><body><div class="pase">${isos}<svg class="centro" viewBox="3 11 26 14" style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:260px;height:140px;fill:#fbe4e9"><path d="${ISO}"/></svg><p class="pie">pantufla.design</p></div></body></html>`;
}

const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
const salidas = [
  ["cara-es", cara(textos.es, "")],
  ["cara-en", cara(textos.en, "")],
  ["capas", cara(textos.es, "capas")],
  ["dorso", dorso()],
];
for (const [nombre, html] of salidas) {
  const archivo = join(TMP, `${nombre}.html`);
  writeFileSync(archivo, html);
  await p.goto(`file://${archivo}`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  const png = await p.screenshot({ omitBackground: true });
  const destino = join(OUT, `${nombre}.webp`);
  if (nombre === "capas") {
    // Sin alfa (la silueta la pone la cara) y a la mitad: no necesita más.
    await sharp(png)
      .resize(W, H)
      .removeAlpha()
      .webp({ quality: 90 })
      .toFile(destino);
  } else {
    await sharp(png).webp({ quality: 86, alphaQuality: 100 }).toFile(destino);
  }
  console.log(destino);
}
await b.close();
