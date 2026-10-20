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
 * Una píldora que flota arriba, despegada del borde, con el fondo de la
 * página a medias y desenfoque detrás: la marca a la izquierda, el menú en el
 * medio, el idioma y el botón a la derecha. Tiene un solo tamaño: no se
 * compacta al bajar ni marca la sección en curso.
 *
 * Lo único que hace es irse. Bajando, el visitante está leyendo y la barra es
 * lo único que le tapa la página; vuelve solo cuando sube, que es cuando está
 * buscando algo, y lo que busca casi siempre es el menú.
 *
 * Fue una píldora que además se achicaba al bajar, se quedaba a la vista en
 * los saltos del menú y corría una pastilla detrás de la sección. Después,
 * una franja quieta de lado a lado. El usuario la quiso así: flotante,
 * compacta, y que se vaya.
 *
 * Los colores son todos tokens del tema: cuando la página se oscurece la
 * barra cambia con ella, al mismo ritmo, sin lógica propia. Lo único fijo es
 * el telón del menú, que oscurece lo de atrás en los dos temas.
 */

/**
 * Cuánto hay que scrollear seguido para un lado para que la barra haga caso,
 * y hasta qué altura no se va nunca.
 *
 * El umbral es lo que la deja quieta ante el rebote de un trackpad o el
 * temblor de un pulgar, que cruzan el cero varias veces por segundo. Es chico
 * a propósito: bajar o subir de verdad se nota en el primer par de rueditas.
 *
 * Y arriba de todo se queda: ahí todavía se está en el hero y la barra es
 * parte de la composición.
 */
const UMBRAL = 24;
const LIBRE = 80;

export function SiteHeader() {
  const { nav, header } = useCopy();
  const href = useHref();
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [oculta, setOculta] = useState(false);
  const focoAdentro = useRef(false);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /*
       El ancla no es «la posición del cuadro anterior»: es desde dónde se está
       midiendo el recorrido en el sentido actual. Contra la posición anterior,
       cualquier píxel para arriba ya es «subir» y el umbral no se acumula
       nunca; contra un ancla que solo se mueve al cambiar de sentido o al
       actuar, mide lo que tiene que medir: cuánto se recorrió seguido para el
       mismo lado.
    */
    let ancla = window.scrollY;
    let sentido = 0;
    let pedido = 0;

    function decidir() {
      pedido = 0;
      // El rebote de iOS devuelve negativos arriba y de más abajo; sin el clamp
      // el sentido se invierte solo al final de la página.
      const y = Math.max(0, window.scrollY);

      if (y <= LIBRE || focoAdentro.current) {
        setOculta(false);
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

      setOculta(s > 0);
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
  }, [pathname]);

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
        /* Si alguien llega con el tabulador, la barra tiene que estar, y
           tiene que quedarse mientras el foco siga adentro: una barra
           escondida con el foco en uno de sus enlaces es un anillo de foco en
           ningún lado. Solo el foco del teclado: un clic en un enlace también
           lo enfoca, y contado como foco dejaba la barra clavada a la vista. */
        onFocusCapture={(e) => {
          if (!(e.target as HTMLElement).matches(":focus-visible")) return;
          focoAdentro.current = true;
          setOculta(false);
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focoAdentro.current = false;
          }
        }}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-300 ease-out sm:px-4",
          /* Más que el 100%: el 100% es el alto de la barra y deja asomando
             la sombra, que sobresale de la caja. El menú abierto manda:
             esconder la barra se llevaría el panel con ella. */
          oculta && !open && "-translate-y-[150%]",
          /* Con menos movimiento pedido se va igual —no es un adorno, es lo
             que despeja la lectura— pero sin el deslizamiento. */
          "motion-reduce:transition-none",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full max-w-3xl border border-line shadow-[0_8px_30px_-12px_rgba(35,28,18,0.25)] backdrop-blur-xl",
            /* Cerrada es una píldora. Abierta no puede serlo: rounded-full
               sobre una caja de 300px de alto dibuja un óvalo. El radio cambia
               de golpe y no transiciona: el navegador lo recorta a la mitad
               del lado más corto, y animarlo era medio segundo de globo
               blanco mientras el panel crecía.

               Translúcida a propósito: deja ver que la página sigue abajo.
               Abierta no: es un panel, y con el fondo a medias el titular del
               hero se leía detrás de los enlaces como una mancha. */
            open ? "rounded-[24px] bg-paper" : "rounded-full bg-paper/75",
          )}
        >
          {/* Tres columnas y no un flex con espacio entre: así el menú queda
              en el centro aunque la marca y los botones midan distinto. Las
              de los costados no bajan de lo que mide su contenido: si no hay
              lugar, el menú se corre un poco en vez de aplastar al botón.

              El botón va a 6px del borde, en el mismo centro que la curva de
              la píldora: así se lee como una pieza adentro de otra. */}
          <div className="grid h-12 grid-cols-[minmax(max-content,1fr)_auto_minmax(max-content,1fr)] items-center gap-4 pl-4 pr-1.5 sm:pl-5">
            {/*
              La marca: el iso y el nombre en mayúsculas. El iso va en el
              corte pesado porque a 14 de alto la suela normal se afina.

              Estando en la home, la marca sube arriba de todo con el mismo
              scroll suave de las anclas (ver smooth-scroll.tsx).
            */}
            <Link
              href={href("/")}
              onClick={() => setOpen(false)}
              className="flex shrink-0 items-center gap-2.5 justify-self-start text-ink"
            >
              <Iso weight="heavy" className="h-[13px] w-auto shrink-0" />
              <span
                translate="no"
                className="whitespace-nowrap text-[0.86rem] font-semibold uppercase tracking-[0.08em]"
              >
                {site.name}
              </span>
            </Link>

            <nav className="hidden items-center md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-[0.88rem] text-ink-soft transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="col-start-3 hidden shrink-0 items-center gap-3 justify-self-end md:flex">
              <LocaleSwitcher />
              <ButtonLink href={header.ctaHref} size="sm">
                {header.cta}
              </ButtonLink>
            </div>

            <button
              ref={boton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? header.closeMenu : header.openMenu}
              aria-expanded={open}
              aria-controls={panelId}
              className="col-start-3 flex h-9 w-9 items-center justify-center justify-self-end rounded-full md:hidden"
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
            ve. inert los saca del foco y del árbol de accesibilidad de una
            sola vez.
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
              <div className="mx-4 border-t border-line pb-4 pt-1">
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
                <div className="mt-3 flex items-center gap-3">
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
