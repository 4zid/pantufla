import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { isologoSvg } from "@/components/ui/brand";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import { isLocale, locales } from "@/lib/i18n";

/**
 * La imagen que se ve cuando alguien pega el link.
 *
 * Hasta ahora el sitio declaraba twitter:card summary_large_image y no tenía
 * ninguna imagen que poner, así que en WhatsApp, en Slack o en un mensaje
 * directo el link salía como una línea de texto gris. Es el formato en el que
 * más se comparte un sitio de estudio —se lo pasan por mensaje, no se lo
 * googlea— y también lo que un motor de respuesta muestra al citar la fuente.
 *
 * Se genera una por idioma, con la bajada traducida, y queda estática en el
 * build: no hay nada acá que dependa del pedido.
 */

export const alt = `${site.name} — ${site.legalName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// A nivel de módulo: el archivo no depende del pedido y se lee una sola vez.
const fuente = await readFile(
  join(process.cwd(), "assets/schibsted-grotesk.ttf"),
);

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = await getCopy(isLocale(locale) ? locale : "es");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#eaedf8",
        // El mismo resplandor celeste que tiene el sitio abajo del proceso.
        backgroundImage:
          "radial-gradient(90% 70% at 100% 100%, rgba(111,207,202,0.55) 0%, rgba(234,237,248,0) 70%)",
        fontFamily: "Schibsted",
        color: "#121212",
      }}
    >
      {/*
          El isologotipo como imagen y no como <svg> en línea: Satori no aplica
          el transform de un path, y el iso del isologotipo se ubica con uno.
          Una <img> con el SVG entero la rasteriza resvg, que sí lo entiende.
          332 × 56 es la caja del dibujo (296.5 × 50) a 56 de alto.
        */}
      <img
        src={`data:image/svg+xml,${encodeURIComponent(isologoSvg("#121212"))}`}
        width={332}
        height={56}
        alt=""
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26,
          maxWidth: 940,
        }}
      >
        <div
          style={{
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
          }}
        >
          {copy.meta.tagline}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            color: "#565656",
          }}
        >
          {copy.hero.lead}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 26, color: "#565656" }}>
        pantufla.design
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Schibsted", data: fuente, style: "normal", weight: 400 },
      ],
    },
  );
}
