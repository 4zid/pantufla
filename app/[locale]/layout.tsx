import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { CopyProvider } from "@/components/copy-provider";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import { isLocale, localeHref, locales, type Locale } from "@/lib/i18n";

import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantufla.design";

/**
 * Raíz del documento, una por idioma.
 *
 * El layout raíz vive adentro de [locale] y no arriba porque es el único lugar
 * donde se sabe qué idioma se está sirviendo, y el atributo lang del html no es
 * decorativo: de ahí sacan el idioma los lectores de pantalla, el corrector del
 * navegador y los buscadores. Un sitio en inglés declarado como español se lee
 * en voz alta con acento español, palabra por palabra.
 *
 * Las dos versiones se generan estáticas: generateStaticParams las enumera y
 * ninguna necesita servidor para responder.
 */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = await getCopy(locale);

  const titulo = `${site.name} — ${copy.meta.tagline}`;
  const canonical = localeHref("/", locale);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: titulo, template: `%s — ${site.name}` },
    description: copy.meta.description,
    keywords: [...copy.meta.keywords],
    authors: [{ name: site.legalName }],
    openGraph: {
      type: "website",
      locale: copy.meta.ogLocale,
      url: `${siteUrl}${canonical === "/" ? "" : canonical}`,
      siteName: site.name,
      title: titulo,
      description: copy.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: copy.meta.description,
    },
    alternates: {
      canonical,
      // Cada página se declara a sí misma y a su par en el otro idioma. Sin
      // esto Google trata las dos versiones como copias y elige una sola.
      languages: {
        es: "/",
        en: "/en",
        "x-default": "/",
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = await getCopy(locale as Locale);

  return (
    <html lang={locale}>
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
        Acá solo se abre el documento. La barra y el pie los pone el grupo
        (site): montados a este nivel se colarían también en /studio, que
        necesita la pantalla entera.
      */}
      <body className="min-h-dvh antialiased">
        <CopyProvider copy={copy} locale={locale as Locale}>
          {children}
        </CopyProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
