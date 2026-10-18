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
 * Es sobrio a propósito: papel marfil, una sola tinta y la mezcla de la
 * itálica de Newsreader con Schibsted. El único color es el borde, un foil
 * champagne y perla que rodea toda la silueta, también las muescas y el
 * troquel. El dorso es negro, con la marca en marfil.
 *
 * El mapa de capas le dice al material qué es cada zona, un canal por cosa:
 * rojo, cuánto tiene de tornasolado; verde, la rugosidad; azul, el metal. El
 * papel queda mate, el panel del titular un poco satinado, el sello como un
 * foil negro y el borde como un foil metálico.
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
  CORTE = 742,
  /* El ancho del borde de foil: rodea todo, también las muescas y el troquel. */
  B = 8;
const silueta = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><mask id="m"><rect width="${W}" height="${H}" rx="40" fill="#fff"/><circle cx="0" cy="${CORTE}" r="22" fill="#000"/><circle cx="${W}" cy="${CORTE}" r="22" fill="#000"/><rect x="262" y="30" width="116" height="22" rx="11" fill="#000"/></mask></defs><rect width="${W}" height="${H}" fill="#fff" mask="url(#m)"/></svg>`,
);
/* La silueta del papel, B px más adentro: lo que queda entre las dos es el
   borde de foil, que así sigue también las muescas y el troquel. */
const papel = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><mask id="m"><rect x="${B}" y="${B}" width="${W - 2 * B}" height="${H - 2 * B}" rx="${40 - B}" fill="#fff"/><circle cx="0" cy="${CORTE}" r="${22 + B}" fill="#000"/><circle cx="${W}" cy="${CORTE}" r="${22 + B}" fill="#000"/><rect x="${262 - B}" y="${30 - B}" width="${116 + 2 * B}" height="${22 + 2 * B}" rx="${11 + B}" fill="#000"/></mask></defs><rect width="${W}" height="${H}" fill="#fff" mask="url(#m)"/></svg>`,
);

/*
   El foil del borde: champagne que pasa por un perla con un dejo del aqua y
   del rosa de la marca. Es el único color del pase; en el 3D es metálico y
   tornasolado (ver el mapa de capas), así que cambia apenas cuando el papel
   se dobla.
*/
const FOIL =
  "linear-gradient(135deg,#b89a6a 0%,#e6d7bb 20%,#f6f1e8 36%,#c9d5d2 54%,#e7d5d2 72%,#c2a577 100%)";

const textos = {
  es: {
    serif: "Pase",
    sans: "prioritario",
    tamSerif: 150,
    n: "0042",
    numero: "N.º",
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
    anillo: "Pantufla · Pase prioritario · Agenda · ",
  },
  en: {
    serif: "Priority",
    sans: "pass",
    tamSerif: 124,
    n: "0042",
    numero: "No.",
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
    anillo: "Pantufla · Priority pass · Calendar · ",
  },
};

/* Un guilloché, como el de un billete: arcos finos de dos familias de
   círculos con el centro afuera del pase, que se cruzan en moiré. Casi no
   se ve; está para que el papel tenga trama. */
const guilloche = (() => {
  let s = `<svg class="guilloche" viewBox="0 0 ${W} 560" width="${W}" height="560">`;
  for (let r = 190; r <= 560; r += 9)
    s += `<circle cx="${W + 70}" cy="-90" r="${r}"/>`;
  for (let r = 260; r <= 620; r += 13)
    s += `<circle cx="${W + 230}" cy="40" r="${r}" class="b"/>`;
  return s + `</svg>`;
})();

const codigo = (() => {
  let s = "",
    x = 0,
    k = 7;
  while (x < 250) {
    k = (k * 9301 + 49297) % 233280;
    const w = 2 + (k % 5);
    const g = 2 + ((k >> 3) % 4);
    s += `<i style="left:${x}px;width:${w}px"></i>`;
    x += w + g;
  }
  return s;
})();

/* El sello: un círculo de tinta con la marca y el nombre alrededor, como un
   estampado en foil negro. */
const sello = (t) => `<div class="sello"><svg viewBox="-68 -68 136 136">
<defs><path id="aro" d="M 0 -51 A 51 51 0 1 1 -0.01 -51"/></defs>
<circle r="61" class="linea"/><circle r="41" class="linea punteada"/>
<text><textPath href="#aro" textLength="316" lengthAdjust="spacing">${t.anillo.toUpperCase()}</textPath></text>
<path d="${ISO}" transform="translate(-29.5 -33.3) scale(1.846)"/>
</svg></div>`;

function cara(t, modo) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${F}/schibsted-grotesk-latin-v1.woff2);font-weight:400 600}
@font-face{font-family:N;src:url(${F}/newsreader-italic-latin-v1.woff2);font-style:italic}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:transparent;width:${W}px;height:${H}px;overflow:hidden}
body{font-family:S,sans-serif;-webkit-font-smoothing:antialiased;color:#151413}
.pase{position:relative;width:${W}px;height:${H}px;overflow:hidden;
  -webkit-mask:url("data:image/svg+xml,${silueta}") 0 0/100% 100% no-repeat;background:${FOIL}}
.papel{position:absolute;inset:0;overflow:hidden;
  -webkit-mask:url("data:image/svg+xml,${papel}") 0 0/100% 100% no-repeat;
  background:radial-gradient(90% 60% at 80% 18%,#fbf8f2 0%,rgba(251,248,242,0) 70%),linear-gradient(180deg,#f6f2ea,#efe9de)}
.marco{position:absolute;inset:${B + 10}px;border:1px solid rgba(21,20,19,.1);border-radius:${40 - B - 10}px}
.guilloche{position:absolute;left:0;top:0;fill:none;stroke:rgba(150,120,80,.15);stroke-width:.7}
.guilloche .b{stroke:rgba(150,120,80,.09)}
.k{font-size:13px;font-weight:600;letter-spacing:.3em;text-transform:uppercase}
.n{font-family:N;font-style:italic}
.fila{position:absolute;left:46px;right:46px;top:76px;display:flex;justify-content:space-between;align-items:center}
.fila svg{width:34px;height:18px;fill:#151413}
.serif{position:absolute;left:40px;top:${t.tamSerif >= 150 ? 122 : 140}px;font-family:N;font-style:italic;font-weight:400;font-size:${t.tamSerif}px;line-height:.86;letter-spacing:-.02em}
.sans{position:absolute;left:46px;top:268px;font-size:54px;font-weight:600;letter-spacing:-.045em;line-height:1}
.bajada{position:absolute;left:47px;top:350px;font-size:17px;color:#5e5850}
.panel{position:absolute;left:40px;top:410px;width:420px;height:150px;border-radius:20px;background:#fbf9f4;border:1.5px solid rgba(21,20,19,.12);padding:24px 28px}
.panel .k{font-size:12px;letter-spacing:.24em;color:#7a736b}
.nombre{font-family:N;font-style:italic;font-size:58px;line-height:1;letter-spacing:-.01em;margin-top:14px}
.pill{position:absolute;right:22px;top:20px;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;border:1.2px solid #151413;border-radius:999px;padding:5px 11px}
.sello{position:absolute;left:478px;top:417px;width:136px;height:136px;border-radius:50%;background:#171615}
.sello svg{width:136px;height:136px;display:block;fill:#efe8da;overflow:visible}
.sello .linea{fill:none;stroke:#efe8da;stroke-width:1.2;opacity:.8}
.sello .punteada{stroke-dasharray:2 3.5;opacity:.5}
.sello text{font-family:S;font-size:9px;font-weight:600;fill:#efe8da}
.info{position:absolute;left:40px;right:40px;top:598px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(21,20,19,.16);padding-top:18px}
.info div{padding-right:10px}.info .k{font-size:11px;letter-spacing:.24em;color:#7a736b}
.info b{display:block;font-family:N;font-style:italic;font-weight:400;font-size:27px;letter-spacing:-.005em;margin-top:6px}
.perfo{position:absolute;left:40px;right:40px;top:${CORTE - 1}px;border-top:2px dashed rgba(21,20,19,.26)}
.codigo{position:absolute;left:46px;top:792px;width:260px;height:110px}
.codigo i{position:absolute;top:0;bottom:0;background:#1d1c1a}
.talon{position:absolute;right:46px;top:788px;text-align:right}
.talon .k{font-size:12px;letter-spacing:.24em;color:#5e5850}
.talon b{display:block;font-size:52px;font-weight:600;letter-spacing:-.04em;margin-top:14px;font-variant-numeric:tabular-nums}
.talon b em{font-family:N;font-style:italic;font-weight:400;font-size:.62em;letter-spacing:0;margin-right:.18em}
/* El mapa de capas: R tornasol, G rugosidad, B metal. El papel y todo lo
   impreso quedan mates; el panel un poco satinado; el sello, foil negro
   brillante; y el borde, foil metálico apenas tornasolado. */
.capas .pase{background:rgb(120,70,220)!important}
.capas .papel{background:rgb(0,205,0)!important}
.capas .papel *{color:transparent!important;border-color:transparent!important}
.capas .guilloche,.capas .marco,.capas .codigo,.capas .perfo,.capas .fila svg{visibility:hidden}
.capas .panel{background:rgb(0,150,0)}
.capas .sello{background:rgb(30,70,170)}
.capas .sello svg{visibility:hidden}
</style></head><body class="${modo}"><div class="pase"><div class="papel">
${guilloche}
<div class="marco"></div>
<div class="fila"><span class="k">Pantufla</span><svg viewBox="3 11 26 14"><path d="${ISO}"/></svg></div>
<div class="serif">${t.serif}</div>
<div class="sans">${t.sans}</div>
<p class="bajada">${t.bajada}</p>
<div class="panel"><span class="k">${t.titular}</span><p class="nombre">${t.nombre}</p><span class="pill">${t.libre}</span></div>
${sello(t)}
<div class="info">${t.info.map(([a, b]) => `<div><span class="k">${a}</span><b>${b}</b></div>`).join("")}</div>
<div class="perfo"></div>
<div class="codigo">${codigo}</div>
<div class="talon"><span class="k">${t.vale}</span><b><em>${t.numero}</em>${t.n}</b></div>
</div></div></body></html>`;
}

function dorso() {
  const isos = Array.from(
    { length: 48 },
    (_, i) =>
      `<svg viewBox="3 11 26 14" style="left:${(i % 6) * 112 - 20 + (Math.floor(i / 6) % 2) * 56}px;top:${Math.floor(i / 6) * 128 + 20}px"><path d="${ISO}"/></svg>`,
  ).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(${F}/schibsted-grotesk-latin-v1.woff2);font-weight:400 600}
@font-face{font-family:N;src:url(${F}/newsreader-italic-latin-v1.woff2);font-style:italic}
*{box-sizing:border-box;margin:0;padding:0}html,body{background:transparent;width:${W}px;height:${H}px;overflow:hidden}
.pase{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:S,sans-serif;
  -webkit-mask:url("data:image/svg+xml,${silueta}") 0 0/100% 100% no-repeat;background:${FOIL}}
.papel{position:absolute;inset:0;overflow:hidden;color:#efe8da;
  -webkit-mask:url("data:image/svg+xml,${papel}") 0 0/100% 100% no-repeat;
  background:radial-gradient(70% 50% at 50% 42%,#24221f 0%,rgba(36,34,31,0) 75%),#151413}
.marco{position:absolute;inset:${B + 10}px;border:1px solid rgba(239,232,218,.12);border-radius:${40 - B - 10}px}
.papel > svg{position:absolute;width:76px;height:41px;fill:rgba(239,232,218,.045)}
.centro{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);width:200px;height:108px;fill:#efe8da}
.lema{position:absolute;left:0;right:0;top:56%;text-align:center;font-family:N;font-style:italic;font-size:34px;color:rgba(239,232,218,.85)}
.pie{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:14px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:rgba(239,232,218,.6)}
</style></head><body><div class="pase"><div class="papel">${isos}<div class="marco"></div><svg class="centro" viewBox="3 11 26 14" style="position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);width:200px;height:108px;fill:#efe8da"><path d="${ISO}"/></svg><p class="lema">pantufla</p><p class="pie">pantufla.design</p></div></div></body></html>`;
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
