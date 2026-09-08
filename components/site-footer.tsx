import Link from "next/link";

import { nav, site } from "@/content/site";
import { Logo } from "@/components/ui/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="shell py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7 text-aqua-deep" />
              <span className="text-[1.06rem] font-semibold tracking-[-0.02em]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
              {site.tagline}. Alcance cerrado, precio cerrado y fecha de entrega.
              Trabajamos desde {site.location} para clientes de donde sea.
            </p>
          </div>

          <div>
            <p className="eyebrow">Navegación</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contacto"
                  className="text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contacto</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
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
                    className="text-[0.95rem] text-ink-soft transition-colors hover:text-ink"
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
          <p>Diseñado y desarrollado en casa, en pantuflas.</p>
        </div>
      </div>
    </footer>
  );
}
