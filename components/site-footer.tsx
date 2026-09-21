"use client";

import Link from "next/link";

import { site } from "@/content/site";
import { fill } from "@/content/copy";
import { Logo } from "@/components/ui/icons";
import { useCopy, useHref } from "@/components/copy-provider";

export function SiteFooter() {
  const { nav, footer, meta } = useCopy();
  const href = useHref();
  const year = new Date().getFullYear();

  return (
    <footer data-surface="mist" className="border-t border-line">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={href("/")} className="flex items-center gap-2.5">
              <Logo className="h-7 w-7 text-aqua-deep" />
              <span className="text-[1.06rem] font-semibold tracking-[-0.02em]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              {fill(footer.blurb, {
                tagline: meta.tagline,
                location: site.location,
              })}
            </p>
          </div>

          {/* Los enlaces llevan py-1 y la lista compensa con menos space-y.
              Medidos en un teléfono daban 19px de alto: pasan el mínimo de WCAG
              2.2 por separación —29px de centro a centro contra los 24 que
              pide— pero 19px es un renglón de texto, no un objetivo, y el pie
              es donde alguien busca el mail con el pulgar. */}
          <div>
            <p className="eyebrow">{footer.navTitle}</p>
            <ul className="mt-4 space-y-1.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={footer.contactLink.href}
                  className="inline-block py-1 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                >
                  {footer.contactLink.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">{footer.contactTitle}</p>
            <ul className="mt-4 space-y-1.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-block py-1 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              {site.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block py-1 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[0.85rem] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}
          </p>
          <p>{footer.signature}</p>
        </div>
      </div>
    </footer>
  );
}
