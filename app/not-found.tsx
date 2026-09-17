import { headers } from "next/headers";

import { CopyProvider } from "@/components/copy-provider";
import { SiteChrome } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui/button";
import { getCopy } from "@/content/get-copy";
import { LOCALE_HEADER, defaultLocale, isLocale } from "@/lib/i18n";

import "./globals.css";

/**
 * Pantalla de 404.
 *
 * Abre el documento ella misma —html, body, hoja de estilos— porque Next se
 * saltea el layout raíz cuando una ruta no existe. Si no lo hiciera, el 404
 * saldría sin estilos y sin idioma declarado.
 *
 * Y el idioma no sale de la URL, porque una dirección inventada puede no tener
 * prefijo: lo pasa el middleware en un header, que es el único que sabe con qué
 * idioma venía el visitante.
 */
export default async function NotFound() {
  const cabeceras = await headers();
  const crudo = cabeceras.get(LOCALE_HEADER) ?? undefined;
  const locale = isLocale(crudo) ? crudo : defaultLocale;
  const copy = await getCopy(locale);
  const { notFound } = copy;

  return (
    <html lang={locale}>
      <body className="min-h-dvh antialiased">
        <CopyProvider copy={copy} locale={locale}>
          <SiteChrome>
            <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
              <p className="eyebrow">{notFound.eyebrow}</p>
              <h1 className="mt-4 text-h2">{notFound.title}</h1>
              <p className="mt-4 max-w-md text-lead text-ink-soft">
                {notFound.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={notFound.home.href} size="lg">
                  {notFound.home.label}
                </ButtonLink>
                <ButtonLink
                  href={notFound.work.href}
                  variant="secondary"
                  size="lg"
                >
                  {notFound.work.label}
                </ButtonLink>
              </div>
            </div>
          </SiteChrome>
        </CopyProvider>
      </body>
    </html>
  );
}
