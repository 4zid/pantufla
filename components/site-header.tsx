"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { site } from "@/content/site";
import { useCopy, useHref } from "@/components/copy-provider";
import { ButtonLink } from "@/components/ui/button";
import { Iso } from "@/components/ui/brand";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { frenarScroll } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * La barra.
 *
 * Una franja fija arriba, de lado a lado, con el fondo de la página a medias
 * y desenfoque detrás: la marca a la izquierda, el menú en el medio, el
 * idioma y el botón a la derecha. Nada más. No cambia de ancho ni de alto, no
 * se esconde al bajar ni marca la sección en curso.
 *
 * Fue una píldora flotante que se compactaba al bajar, se escondía bajando y
 * volvía subiendo, y corría una pastilla detrás de la sección del menú. Cada
 * cosa tenía su razón, pero juntas eran una barra que se movía todo el
 * tiempo, y el usuario la quiso quieta.
 *
 * El contenido va con el mismo ancho y los mismos márgenes que el hero (90rem,
 * 96px a 1440), así la marca cae justo encima del titular.
 *
 * Los colores son todos tokens del tema: cuando la página se oscurece la
 * barra cambia con ella, al mismo ritmo, sin lógica propia. Lo único fijo es
 * el telón del menú, que oscurece lo de atrás en los dos temas.
 */
export function SiteHeader() {
  const { nav, header } = useCopy();
  const href = useHref();
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  /*
     El menú del teléfono abierto.

     - La página de atrás no se mueve: Lenis frenado y el body sin scroll.
     - La página de atrás no se puede tabular: va inert, con el salto al
       contenido incluido. El telón la tapa, y sin esto el Tab salía del menú
       a un botón del hero que no se ve.
     - Escape lo cierra y le devuelve el foco al botón que lo abrió.
     - Si la ventana crece hasta escritorio, se cierra: el panel no existe ahí
       y dejaba la página trabada sin nada a la vista que la destrabe.
  */
  useEffect(() => {
    if (!open) return;

    frenarScroll(true);
    document.body.style.overflow = "hidden";
    const atras = [
      document.querySelector<HTMLElement>('a[href="#contenido"]'),
      document.getElementById("contenido"),
      document.querySelector<HTMLElement>("body footer"),
    ].filter((el): el is HTMLElement => Boolean(el));
    atras.forEach((el) => (el.inert = true));

    function alTeclado(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      boton.current?.focus();
    }
    const escritorio = window.matchMedia("(min-width: 768px)");
    function alCambiarAncho() {
      if (escritorio.matches) setOpen(false);
    }

    document.addEventListener("keydown", alTeclado);
    escritorio.addEventListener("change", alCambiarAncho);
    return () => {
      frenarScroll(false);
      document.body.style.overflow = "";
      atras.forEach((el) => (el.inert = false));
      document.removeEventListener("keydown", alTeclado);
      escritorio.removeEventListener("change", alCambiarAncho);
    };
  }, [open]);

  // Navegar a otra página cierra el menú.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/*
        Telón. Sin él, el panel queda flotando sobre una página nítida y lo que
        haya justo debajo se lee como parte del menú: con el CTA del hero ahí
        abajo, el visitante veía el mismo botón dos veces, uno arriba del otro.
        Además da la segunda forma de cerrar, que es la que todo el mundo usa:
        tocar afuera.

        El color es fijo y no un token. Era la tinta al 45%, y la tinta se da
        vuelta con el tema: sobre una sección oscura el telón pasaba a ser una
        niebla blanca encima de la página.
      */}
      <button
        type="button"
        aria-label={header.closeMenu}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-[#0e0e0e]/45 backdrop-blur-[3px] transition-opacity duration-400 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 backdrop-blur-xl",
          /* Translúcida a propósito: deja ver que la página sigue abajo. Con
             el menú abierto no: es un panel, y con el fondo a medias el
             titular del hero se leía detrás de los enlaces como una mancha. */
          open ? "bg-paper" : "bg-paper/75",
        )}
      >
        {/* Tres columnas y no un flex con espacio entre: así el menú queda en
            el centro aunque la marca y los botones midan distinto. Las de los
            costados no bajan de lo que mide su contenido: en una tablet no
            entran tres columnas iguales, y con 1fr pelado el botón de la
            derecha se partía en tres renglones. Así, si no hay lugar, el menú
            se corre un poco en vez de aplastar al botón. */}
        <div className="mx-auto grid h-16 w-full max-w-[90rem] grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] items-center gap-5 px-5 md:px-10 xl:px-24">
          {/*
            La marca: el iso y el nombre en mayúsculas. El iso va en el corte
            pesado porque a 14 de alto la suela normal se afina.

            Estando en la home, la marca sube arriba de todo con el mismo
            scroll suave de las anclas (ver smooth-scroll.tsx).
          */}
          <Link
            href={href("/")}
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center gap-2.5 justify-self-start text-ink"
          >
            <Iso weight="heavy" className="h-[14px] w-auto shrink-0" />
            <span
              translate="no"
              className="whitespace-nowrap text-[0.92rem] font-semibold uppercase tracking-[0.08em]"
            >
              {site.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-[0.92rem] text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="col-start-3 hidden shrink-0 items-center gap-4 justify-self-end md:flex">
            <LocaleSwitcher />
            <ButtonLink href={header.ctaHref}>{header.cta}</ButtonLink>
          </div>

          <button
            ref={boton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? header.closeMenu : header.openMenu}
            aria-expanded={open}
            aria-controls={panelId}
            className="col-start-3 -mr-2 flex h-10 w-10 items-center justify-center justify-self-end rounded-full md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-full bg-ink transition-[translate,rotate] duration-300",
                  open ? "rotate-45" : "-translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-full bg-ink transition-[translate,rotate] duration-300",
                  open ? "-rotate-45" : "translate-y-1.5",
                )}
              />
            </span>
          </button>
        </div>

        {/*
          El panel está siempre en el árbol y lo que se anima es el alto, con
          el truco de la grilla: una fila que va de 0fr a 1fr sí transiciona,
          a diferencia de height auto. Montarlo y desmontarlo hacía que el
          menú apareciera entero en un cuadro.

          Cerrado va inert: como el contenido sigue en el DOM, sin esto los
          enlaces y el botón se pueden tabular detrás de un panel que no se
          ve. inert los saca del foco y del árbol de accesibilidad de una sola
          vez.
        */}
        <div
          id={panelId}
          inert={!open}
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out md:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0">
            <div className="border-t border-line px-5 pb-5 pt-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-[1.05rem] font-medium last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-3">
                <LocaleSwitcher />
                <ButtonLink
                  href={header.ctaHref}
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {header.cta}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
