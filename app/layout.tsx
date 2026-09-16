import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { site } from "@/content/site";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "diseño web",
    "desarrollo web",
    "landing page",
    "sitio web con CMS",
    "estudio de diseño web",
    "Argentina",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/*
          Marca el documento antes del primer pintado para que el CSS pueda
          ocultar lo que se va a animar. Si el JS está desactivado la clase
          nunca se agrega y el contenido queda visible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("motion-ready")`,
          }}
        />
      </head>
      {/*
        La raíz solo abre el documento. La barra y el pie los pone el grupo
        (site): montados acá se colarían también en /studio, que cuelga de esta
        misma raíz y necesita la pantalla entera.
      */}
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
