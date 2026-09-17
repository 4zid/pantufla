import { chromium } from "playwright";
const SHOT = "/tmp/claude-0/-home-user-pantufla/3b116aba-468d-585e-9cfa-8864d4d13cb8/scratchpad";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
try {
  for (const [w, h, n] of [[1440,900,"t-1440"], [1920,1080,"t-1920"], [390,844,"t-390"]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: w < 700, locale: "es-AR" });
    const p = await ctx.newPage();
    await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await p.evaluate(() => document.querySelector("#testimonios").scrollIntoView({ block: "center" }));
    await p.waitForTimeout(1600);
    const d = await p.evaluate(() => {
      const s = document.querySelector("#testimonios");
      const r = s.getBoundingClientRect();
      const q = s.querySelector("blockquote").getBoundingClientRect();
      return { y: r.top, alto: Math.round(r.height), caras: s.querySelectorAll("ul button").length,
        cita: [Math.round(q.left), Math.round(q.right)], of: document.documentElement.scrollWidth - innerWidth };
    });
    console.log(`${n}: ${JSON.stringify(d)}`);
    await p.screenshot({ path: `${SHOT}/${n}.png`, clip: { x: 0, y: Math.max(0, d.y), width: w, height: Math.min(d.alto, h) } });
    await ctx.close();
  }
} finally { await b.close(); }
