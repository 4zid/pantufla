"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCopy, useHref } from "@/components/copy-provider";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/icons";
import { Wordmark } from "@/components/ui/wordmark";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { cn } from "@/lib/cn";

/**
 * Barra flotante.
 *
 * No va pegada al borde: es una píldora despegada, con margen y desenfoque
 * detrás. Arriba de todo se muestra expandida y, al bajar, se compacta: menos
 * alto, menos aire y sin el enlace secundario.
 *
 * Y se esconde al bajar, vuelve al subir. Bajando, el visitante está leyendo y
 * la barra es lo único que le tapa la página —justo la primera línea de cada
 * título, que es lo que peor cae—. Subiendo está buscando algo, y lo que busca
 * casi siempre es el menú. Aparece sola antes de que llegue arriba de todo.
 */
/**
 * Cuánto hay que scrollear en un sentido para que la barra haga caso, y a
 * partir de qué altura se permite esconderla.
 *
 * El umbral no es un lujo: sin él alcanza el rebote de un trackpad o el temblor
 * de un pulgar para cruzar el cero varias veces por segundo, y la barra entra y
 * sale sola. Con 64px de por medio hay que haber decidido moverse.
 *
 * Y arriba de los 96 primeros píxeles no se esconde nunca. Ahí todavía se está
 * en el hero, la barra es parte de la composición y hacerla desaparecer a los
 * dos dedos de scroll se lee como un error.
 */
const UMBRAL = 64;
const LIBRE = 96;

export function SiteHeader() {
  const { nav, header } = useCopy();
  const href = useHref();
  const [compact, setCompact] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    /*
       El ancla no es «la posición del cuadro anterior»: es desde dónde se está
       midiendo el recorrido en el sentido actual. La diferencia importa. Contra
       la posición anterior, cualquier píxel hacia arriba ya es «subir» y el
       umbral no llega a acumularse nunca; contra un ancla que solo se mueve
       cuando se cambia de sentido o cuando se actúa, el umbral mide lo que
       tiene que medir: cuánto se recorrió seguido para el mismo lado.
    */
    let ancla = window.scrollY;
    let sentido = 0;
    let pedido = 0;

    function decidir() {
      pedido = 0;
      // El rebote de iOS devuelve negativos arriba y de más abajo; sin el clamp
      // el sentido se invierte solo al final de la página.
      const y = Math.max(0, window.scrollY);
      setCompact(y > 40);

      if (y <= LIBRE) {
        setOculto(false);
        ancla = y;
        sentido = 0;
        return;
      }

      const s = Math.sign(y - ancla);
      if (s === 0) return;
      if (s !== sentido) {
        // Cambió de sentido: se vuelve a anclar y hay que recorrer el umbral
        // otra vez. Es lo que evita el temblor alrededor del punto de corte.
        sentido = s;
        ancla = y;
        return;
      }
      if (Math.abs(y - ancla) < UMBRAL) return;

      setOculto(s > 0);
      ancla = y;
    }

    function alScrollear() {
      if (pedido) return;
      pedido = requestAnimationFrame(decidir);
    }

    decidir();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/*
        Telón. Sin él, el panel queda flotando sobre una página nítida y lo que
        haya justo debajo se lee como parte del menú: con el CTA del hero ahí
        abajo, el visitante veía el mismo botón dos veces, uno arriba del otro.
        Además da la segunda forma de cerrar, que es la que todo el mundo usa:
        tocar afuera.
      */}
      <button
        type="button"
        aria-label={header.closeMenu}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/45 backdrop-blur-[3px] transition-opacity duration-400 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <header
        /* El menú abierto manda sobre todo: esconder la barra con el panel
           desplegado se llevaría el panel con ella. */
        data-oculto={oculto && !open ? "" : undefined}
        /* Si alguien llega con el tabulador, la barra tiene que estar. Sin
           esto, el primer Tab después de bajar mueve el foco a un enlace que
           está fuera de la pantalla: se ve el anillo de foco en ningún lado y
           no hay forma de saber dónde se está parado. */
        onFocusCapture={() => setOculto(false)}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 transition-transform duration-300 ease-out sm:pt-4",
          /* -120% y no -100%: el 100% es el alto de la barra y deja asomando
             la sombra, que sobresale de la caja. */
          oculto && !open && "-translate-y-[120%]",
          /* Para quien pidió menos movimiento, la barra igual se esconde —no es
             un adorno, es lo que despeja la lectura— pero sin el deslizamiento. */
          "motion-reduce:transition-none",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full border backdrop-blur-xl transition-[max-width,padding,background-color,border-color,box-shadow] duration-500 ease-out",
            // Cerrada es una píldora. Abierta no puede serlo: rounded-full sobre
            // una caja de 344px de alto no redondea las esquinas, dibuja un
            // círculo, y con el desenfoque atrás el menú se veía como una mancha
            // blanca gigante encima del titular.
            //
            // Y el radio NO va en la lista de arriba: es la única propiedad que
            // no se puede transicionar acá. El navegador recorta el radio a la
            // mitad del lado más corto, así que mientras baja de 9999 a 26 la
            // caja —que ya creció a 344px de alto— se dibuja como un óvalo que
            // se va enderezando. Medio segundo de globo blanco cada vez que se
            // abre el menú. Cambiándolo de golpe no se nota: abajo el alto se
            // anima, y el ojo mira eso.
            open ? "rounded-[26px]" : "rounded-full",
            /* 4xl y no 3xl: con 3xl la fila no entraba y el grupo de la
               derecha, que es shrink-0, se comía el padding en vez de
               achicarse. Medido: el botón quedaba a 12px del borde teniendo 16
               declarados, contra 17 del lado del logo. Esa asimetría es lo que
               se lee como «pegado». Sigue siendo un achique claro contra los
               6xl de la barra expandida. */
            compact || open
              ? "max-w-4xl border-line px-3 shadow-[0_8px_30px_-12px_rgba(35,28,18,0.25)] sm:px-4"
              : "max-w-6xl border-transparent px-4 sm:px-6",
            // Cerrada es translúcida a propósito: flota sobre el contenido y deja
            // ver que hay algo abajo. Abierta no: es un panel, y con el fondo a
            // medias el titular del hero se leía por detrás de los enlaces como
            // una mancha. Un menú tiene que tapar lo que hay atrás.
            open ? "bg-paper" : compact ? "bg-paper/80" : "bg-paper/40",
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
              <Wordmark className="h-[1.35rem] text-ink" />
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
                href={header.plansHref}
                className={cn(
                  "overflow-hidden whitespace-nowrap text-[0.92rem] text-ink-soft transition-all duration-400 hover:text-ink",
                  compact
                    ? "pointer-events-none max-w-0 opacity-0"
                    : "max-w-[8rem] opacity-100",
                )}
              >
                {header.plans}
              </Link>
              <LocaleSwitcher />
              <ButtonLink href={header.ctaHref} size={compact ? "sm" : "md"}>
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

          {/*
            El panel está siempre en el árbol y lo que se anima es el alto, con
            el truco de la grilla: una fila que va de 0fr a 1fr sí transiciona,
            a diferencia de height auto. Montarlo y desmontarlo hacía que el
            menú apareciera entero en un cuadro.

            Cerrado va inert: como el contenido sigue en el DOM, sin esto los
            cuatro enlaces y el botón se pueden tabular detrás de un panel que
            no se ve. inert los saca del foco y del árbol de accesibilidad de
            una sola vez.
          */}
          <div
            inert={!open}
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out md:hidden",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0">
              <div className="border-t border-line pb-4 pt-3">
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
        </div>
      </header>
    </>
  );
}
