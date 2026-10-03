"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { site } from "@/content/site";
import { useCopy, useHref } from "@/components/copy-provider";
import { ButtonLink } from "@/components/ui/button";
import { Iso } from "@/components/ui/brand";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { frenarScroll, saltando } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * Barra flotante.
 *
 * No va pegada al borde: es una píldora despegada, con margen y desenfoque
 * detrás. Arriba de todo se muestra expandida y, al bajar, se compacta: menos
 * alto, menos aire y la marca se queda en el iso solo.
 *
 * Y se esconde al bajar, vuelve al subir. Bajando, el visitante está leyendo y
 * la barra es lo único que le tapa la página —justo la primera línea de cada
 * título, que es lo que peor cae—. Subiendo está buscando algo, y lo que busca
 * casi siempre es el menú. Aparece sola antes de que llegue arriba de todo.
 *
 * Hay tres momentos en los que bajar no es leer, y en esos la barra se queda:
 *
 * - Un salto desde el menú. La página baja porque alguien tocó «Planes»: va a
 *   un lugar, no está leyendo. Si la barra se va en el viaje, el título llega
 *   con 96px de aire reservados para una barra que ya no está, y el menú
 *   —que se acaba de usar— desaparece. Lo avisa smooth-scroll (lib/scroll.ts).
 * - El foco del teclado adentro. Una barra escondida con el foco en uno de sus
 *   enlaces es un anillo de foco en ningún lado.
 * - El menú del teléfono abierto, que es la barra misma.
 *
 * El menú marca en qué sección se está: una pastilla se corre detrás del
 * enlace de la sección que cruza la pantalla. En una página de una sola hoja
 * el menú es también el índice, y un índice que no dice dónde estás obliga a
 * adivinarlo por el contenido.
 *
 * Los colores son todos tokens del tema: cuando la página se oscurece la
 * barra cambia con ella, al mismo ritmo, sin lógica propia. Lo único fijo es
 * el telón del menú, que oscurece lo de atrás en los dos temas.
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

/** Desde dónde la barra va compacta. */
const COMPACTA = 40;

/**
 * La línea, en fracción del alto de la pantalla, contra la que se decide en
 * qué sección se está: un poco arriba del medio, que es donde está lo que se
 * lee y queda lejos de la barra. La sección que la cruza es la del menú.
 */
const LINEA_SECCION = 0.4;

/** El ancla de un href del menú: «/#planes» o «/en/#planes» → «planes». */
function anclaDe(href: string) {
  const i = href.indexOf("#");
  return i === -1 ? null : href.slice(i + 1);
}

export function SiteHeader() {
  const { nav, header } = useCopy();
  const href = useHref();
  const pathname = usePathname();
  const panelId = useId();
  const [compact, setCompact] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [open, setOpen] = useState(false);
  const [seccion, setSeccion] = useState<string | null>(null);
  /*
     Quieta hasta el primer cálculo. Si la página carga a mitad de camino —un
     recargar, un enlace a /#planes desde otra página— la barra sale del
     servidor expandida y tiene que pasar a compacta. Con las transiciones
     prendidas eso es medio segundo de barra achicándose sola apenas abre la
     página, que se lee como un error. Quieta, el cambio cae en un cuadro.
  */
  const [quieta, setQuieta] = useState(true);
  const focoAdentro = useRef(false);
  const boton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const pastilla = useRef<HTMLSpanElement>(null);
  const anclas = useRef<string[]>([]);
  anclas.current = nav
    .map((item) => anclaDe(item.href))
    .filter((a): a is string => Boolean(a));

  /*
     Compacta, la marca es el iso solo; expandida, o con el menú abierto, el
     iso con el nombre. Con el menú abierto la barra también está compacta,
     pero es un panel con lugar de sobra y el nombre le viene bien.
  */
  const soloIso = compact && !open;

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

    /* Qué sección cruza la línea. Son tres cajas: leerlas en el cuadro del
       scroll, antes de escribir nada, no fuerza ningún reflow. */
    function enCurso() {
      const linea = window.innerHeight * LINEA_SECCION;
      for (const id of anclas.current) {
        const caja = document.getElementById(id)?.getBoundingClientRect();
        if (caja && caja.top <= linea && caja.bottom > linea) return id;
      }
      return null;
    }

    function decidir() {
      pedido = 0;
      // El rebote de iOS devuelve negativos arriba y de más abajo; sin el clamp
      // el sentido se invierte solo al final de la página.
      const y = Math.max(0, window.scrollY);
      setCompact(y > COMPACTA);
      setSeccion(enCurso());

      if (y <= LIBRE || saltando() || focoAdentro.current) {
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
    // Dos cuadros: uno para que React pinte el estado de arriba quieto, otro
    // para que el navegador lo tome como punto de partida de las transiciones.
    let soltar = requestAnimationFrame(() => {
      soltar = requestAnimationFrame(() => setQuieta(false));
    });
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
      if (pedido) cancelAnimationFrame(pedido);
      cancelAnimationFrame(soltar);
    };
    // La página cambia de secciones al navegar: se vuelve a medir.
  }, [pathname]);

  /*
     La pastilla del menú se mueve escribiéndole el estilo y no con estado: es
     una posición que sale de medir el enlace, y pasarla por React sería un
     render más por cada cambio de sección para dibujar lo mismo.

     Cuando aparece de la nada no viaja: se ubica quieta y se prende. Si
     arrancara a correrse desde donde quedó la última vez, se la vería cruzar
     el menú entero para llegar a un enlace que ya estaba ahí.
  */
  useEffect(() => {
    const marca = pastilla.current;
    const lista = menu.current;
    if (!marca || !lista) return;

    function ubicar() {
      if (!marca || !lista) return;
      const enlace = seccion
        ? lista.querySelector<HTMLElement>(`a[data-ancla="${seccion}"]`)
        : null;
      if (!enlace) {
        marca.style.opacity = "0";
        return;
      }
      const apagada = marca.style.opacity !== "1";
      if (apagada) marca.style.transitionProperty = "opacity";
      marca.style.width = `${enlace.offsetWidth}px`;
      marca.style.translate = `${enlace.offsetLeft}px 0`;
      marca.style.opacity = "1";
      if (apagada) {
        requestAnimationFrame(() => {
          marca.style.transitionProperty = "";
        });
      }
    }

    ubicar();
    // La fuente puede llegar después del primer cálculo y cambiar el ancho
    // de los enlaces.
    document.fonts?.ready.then(ubicar);
    window.addEventListener("resize", ubicar);
    return () => window.removeEventListener("resize", ubicar);
  }, [seccion, nav]);

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
        data-quieta={quieta ? "" : undefined}
        /* El menú abierto manda sobre todo: esconder la barra con el panel
           desplegado se llevaría el panel con ella. */
        data-oculto={oculto && !open ? "" : undefined}
        /* Si alguien llega con el tabulador, la barra tiene que estar, y
           tiene que quedarse mientras el foco siga adentro. Solo el foco del
           teclado: un clic en un enlace también lo enfoca, y contado como
           foco dejaba la barra clavada a la vista después de cada salto. */
        onFocusCapture={(e) => {
          if (!(e.target as HTMLElement).matches(":focus-visible")) return;
          focoAdentro.current = true;
          setOculto(false);
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focoAdentro.current = false;
          }
        }}
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
            {/*
              La marca: el iso y el nombre en mayúsculas. Al compactarse el
              nombre se pliega —ancho a cero y se apaga— y queda el iso solo,
              que no se mueve ni cambia de tamaño; es el mismo pliegue que
              hacía el enlace secundario cuando la barra tenía uno, y es lo que
              hace correr el menú del medio sin saltos. El iso va en el corte
              pesado porque a 14 de alto la suela normal se afina.

              Estando en la home, la marca sube arriba de todo con el mismo
              scroll suave de las anclas (ver smooth-scroll.tsx).
            */}
            <Link
              href={href("/")}
              onClick={() => setOpen(false)}
              className="flex shrink-0 items-center text-ink"
            >
              <Iso weight="heavy" className="h-[14px] w-auto shrink-0" />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap text-[0.92rem] font-semibold uppercase tracking-[0.08em] transition-[max-width,opacity,margin] duration-500 ease-out",
                  soloIso
                    ? "ml-0 max-w-0 opacity-0"
                    : "ml-2.5 max-w-[8rem] opacity-100",
                )}
              >
                <span translate="no">{site.name}</span>
              </span>
            </Link>

            <nav
              ref={menu}
              className="relative hidden items-center gap-1 md:flex"
            >
              {/* La pastilla de la sección en curso. La tinta al 7% y no un
                  gris: la tinta se da vuelta con el tema, así que sobre la
                  barra oscura la pastilla es un claro apenas marcado y sobre
                  la clara un oscuro apenas marcado, sin un color por tema.
                  Se centra con my-auto y no con translate: el translate es lo
                  que se escribe para correrla. */}
              <span
                ref={pastilla}
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 my-auto h-8 rounded-full bg-ink/[0.07] opacity-0 transition-[translate,width,opacity] duration-300 ease-out"
              />
              {nav.map((item) => {
                const ancla = anclaDe(item.href);
                const actual = Boolean(ancla) && ancla === seccion;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-ancla={ancla ?? undefined}
                    aria-current={actual ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-1.5 text-[0.92rem] transition-colors duration-300",
                      actual ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* El botón tiene un solo tamaño. Pasaba de md a sm al compactarse,
                y como el tamaño no transiciona cambiaba de golpe mientras la
                barra se achicaba en medio segundo: un salto adentro de un
                movimiento. En la barra compacta, de 56px, el md entra con aire. */}
            <div className="hidden shrink-0 items-center gap-4 md:flex">
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
              className="-mr-1 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
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
            cuatro enlaces y el botón se pueden tabular detrás de un panel que
            no se ve. inert los saca del foco y del árbol de accesibilidad de
            una sola vez.

            Adentro también se marca la sección en curso, con un punto: abrir
            el menú a mitad de la página y ver dónde se está es la mitad de
            para qué se abre.
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
              <div className="border-t border-line pb-4 pt-3">
                {nav.map((item) => {
                  const ancla = anclaDe(item.href);
                  const actual = Boolean(ancla) && ancla === seccion;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={actual ? "location" : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-line px-2 py-3 text-[1.05rem] font-medium last:border-0"
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-ink transition-[opacity,scale] duration-300",
                          actual ? "opacity-100" : "scale-50 opacity-0",
                        )}
                      />
                    </Link>
                  );
                })}
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
