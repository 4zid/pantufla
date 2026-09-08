"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { nav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Barra flotante: sin borde mientras está arriba, y al bajar aparece un velo
 * difuminado en lugar de una línea dura. Los links van al centro y a la derecha
 * quedan dos niveles de acción — un enlace de texto y un botón sólido.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled || open
          ? "border-b border-line/80 bg-paper/95 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-7 w-7 text-aqua-deep" />
          <span className="text-[1.06rem] font-semibold tracking-[-0.02em]">
            {site.name}
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.94rem] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <Link
            href="/#planes"
            className="text-[0.94rem] text-ink-soft transition-colors hover:text-ink"
          >
            Ver planes
          </Link>
          <ButtonLink href="/contacto">Empezar un proyecto</ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
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
        <div className="border-t border-line bg-paper md:hidden">
          <div className="shell flex flex-col gap-1 py-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-lg font-medium"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="/contacto"
              size="lg"
              className="mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              Empezar un proyecto
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
