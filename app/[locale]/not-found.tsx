"use client";

import { useCopy } from "@/components/copy-provider";
import { SiteChrome } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui/button";

/**
 * Las URLs que no matchean ninguna ruta se renderizan sobre el layout raíz y no
 * sobre el del grupo (site), así que el marco lo monta la propia pantalla.
 *
 * Es de cliente para poder leer el copy del contexto: un 404 en inglés que
 * contesta en español es exactamente el momento en que uno menos quiere que el
 * sitio parezca roto.
 */
export default function NotFound() {
  const { notFound } = useCopy();

  return (
    <SiteChrome>
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">{notFound.eyebrow}</p>
        <h1 className="mt-4 text-h2">{notFound.title}</h1>
        <p className="mt-4 max-w-md text-lead text-ink-soft">{notFound.lead}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={notFound.home.href} size="lg">
            {notFound.home.label}
          </ButtonLink>
          <ButtonLink href={notFound.work.href} variant="secondary" size="lg">
            {notFound.work.label}
          </ButtonLink>
        </div>
      </div>
    </SiteChrome>
  );
}
