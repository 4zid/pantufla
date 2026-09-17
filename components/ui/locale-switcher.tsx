"use client";

import { usePathname, useRouter } from "next/navigation";

import { useCopy, useLocale } from "@/components/copy-provider";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  defaultLocale,
  locales,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Selector de idioma.
 *
 * Dos letras y un fondo que se corre: con dos idiomas, un desplegable es un
 * clic de más para mostrar una lista de dos. El que está activo se lee, el
 * otro se toca.
 *
 * Al elegir se guarda la cookie, y desde ese momento la detección por país deja
 * de opinar. Es la regla que hace que el selector sirva para algo: si el sitio
 * volviera a mandarte al idioma que acabás de descartar, el botón sería
 * decorativo.
 *
 * Cambia de idioma sin cambiar de página: se le saca el prefijo al camino
 * actual y se le pone el del idioma nuevo. Mandar a alguien al inicio por
 * cambiar de idioma es perderle la página que estaba leyendo.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const actual = useLocale();
  const { header } = useCopy();
  const router = useRouter();
  const pathname = usePathname() || "/";

  function cambiar(destino: Locale) {
    if (destino === actual) return;

    document.cookie = `${LOCALE_COOKIE}=${destino};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;

    // usePathname() devuelve la URL como la ve el visitante: en español no trae
    // prefijo, en inglés sí. Se normaliza a la forma sin prefijo y después se
    // le pone el del idioma destino.
    const sinPrefijo =
      pathname === `/${actual}` || pathname.startsWith(`/${actual}/`)
        ? pathname.slice(actual.length + 1) || "/"
        : pathname;

    const destinoPath =
      destino === defaultLocale
        ? sinPrefijo
        : `/${destino}${sinPrefijo === "/" ? "" : sinPrefijo}`;

    router.push(destinoPath);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={header.language}
      className={cn(
        "relative flex shrink-0 items-center rounded-full bg-paper-alt p-0.5",
        className,
      )}
    >
      {/* La pastilla se corre entre las dos mitades en vez de aparecer y
          desaparecer: el movimiento cuenta que son dos estados de lo mismo. */}
      <span
        aria-hidden
        className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-card shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          transform: `translateX(${locales.indexOf(actual) * 100}%)`,
        }}
      />
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => cambiar(locale)}
          aria-current={locale === actual}
          lang={locale}
          className={cn(
            "relative z-10 w-8 rounded-full py-1 text-[0.76rem] font-semibold uppercase tracking-[0.04em] transition-colors duration-300",
            locale === actual ? "text-ink" : "text-ink-faint hover:text-ink-soft",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
