"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/content/site";
import { useCopy, useHref } from "@/components/copy-provider";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/icons";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { cn } from "@/lib/cn";

/**
 * Barra flotante.
 *
 * No va pegada al borde: es una píldora despegada, con margen y desenfoque
 * detrás. Arriba de todo se muestra expandida y, al bajar, se compacta —menos
 * alto, menos aire y sin el enlace secundario— pero sigue acompañando siempre.
 */
export function SiteHeader() {
  const { nav, header } = useCopy();
  const href = useHref();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto w-full rounded-full border backdrop-blur-xl transition-[max-width,padding,background-color,border-color,box-shadow] duration-500 ease-out",
          compact || open
            ? "max-w-3xl border-line bg-paper/80 px-3 shadow-[0_8px_30px_-12px_rgba(35,28,18,0.25)] sm:px-4"
            : "max-w-6xl border-transparent bg-paper/40 px-4 sm:px-6",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-5 transition-[height] duration-500 ease-out",
            compact || open ? "h-12 sm:h-14" : "h-14 sm:h-16",
          )}
        >
          <Link
            href={href("/")}
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <Logo className="h-6 w-6 text-aqua-deep" />
            <span className="text-[1.02rem] font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-[0.92rem] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-4 md:flex">
            {/* El enlace secundario se retira cuando la barra se compacta. */}
            <Link
              href={href("/#planes")}
              className={cn(
                "overflow-hidden whitespace-nowrap text-[0.92rem] text-ink-soft transition-all duration-400 hover:text-ink",
                compact ? "pointer-events-none max-w-0 opacity-0" : "max-w-[8rem] opacity-100",
              )}
            >
              {header.plans}
            </Link>
            <LocaleSwitcher />
            <ButtonLink href={href("/contacto")} className={cn(compact && "h-9 px-4")}>
              {header.cta}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? header.closeMenu : header.openMenu}
            aria-expanded={open}
            className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-ink transition-all duration-300",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-ink transition-all duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>

        {open ? (
          <div className="border-t border-line pb-4 pt-3 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line px-2 py-3 text-[1.05rem] font-medium last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3">
              <LocaleSwitcher />
              <ButtonLink
                href={href("/contacto")}
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {header.cta}
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
