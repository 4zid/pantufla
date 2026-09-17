"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import {
  PanelConversion,
  PanelTrafico,
  PanelVelocidad,
  PanelVisitas,
} from "@/components/sections/hero-panels";
import { useCopy } from "@/components/copy-provider";
import { Draggable, ease, gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Escena del hero.
 *
 * Arriba de lg los cuatro paneles arrancan dispersos alrededor del título y,
 * al bajar, vuelan hasta sus lugares dentro del dashboard.
 *
 * La caja de maquetado de cada panel mide exactamente lo mismo que su hueco:
 * el panel se ve más grande por una escala, no por un tamaño distinto. Así el
 * vuelo sigue siendo la diferencia entre dos rectángulos iguales más la vuelta
 * de la escala a 1, y nada se deforma al aterrizar. Como los dos elementos
 * viven en el mismo contenedor, esa diferencia tampoco depende del scroll.
 *
 * Abajo de lg no hay vuelo: el dashboard se muestra ya armado.
 */

/**
 * El tablero es modular: tres tamaños distintos que encastran en una grilla de
 * tres columnas por dos filas.
 *
 *   ┌───────────────┬───────┬───────┐
 *   │               │ conv. │ vel.  │
 *   │    visitas    ├───────┴───────┤
 *   │               │    tráfico    │
 *   └───────────────┴───────────────┘
 *
 * Cuatro tarjetas iguales se leen como una grilla de relleno. Con tamaños
 * distintos, el tamaño mismo dice qué mira uno primero.
 *
 * Cada caja mide exactamente lo que mide su hueco: el vuelo sigue siendo la
 * diferencia entre dos rectángulos iguales.
 */
const SLOT = { w: 400, h: 380, sw: 192, sh: 176, mw: 400, mh: 188 };

/**
 * En el teléfono el tablero se rearma, no se apila.
 *
 * Las medidas de escritorio puestas en una columna daban 1098px de tarjetas:
 * dos pantallas enteras de gráficos antes de llegar a nada más. Acá las dos
 * chicas van a la par, las dos anchas ocupan el ancho completo y cada una mide
 * lo que necesita su contenido y ni un pixel más. El tablero pasa a ~600px:
 * sigue siendo la prueba de lo que el sitio entrega, pero cabe de un vistazo.
 */
const FONO: Record<string, { h: number; area: string }> = {
  visitas: { h: 268, area: "col-span-2" },
  conversion: { h: 146, area: "" },
  velocidad: { h: 146, area: "" },
  trafico: { h: 196, area: "col-span-2" },
};

const panels = [
  {
    id: "visitas",
    node: <PanelVisitas />,
    w: SLOT.w,
    h: SLOT.h,
    area: "min-[1440px]:col-start-1 min-[1440px]:row-start-1 min-[1440px]:row-span-2",
    // Cada una levita con su propia inclinación: iguales se leerían como una
    // sola lámina rígida partida en cuatro.
    tilt: { rotate: 2.5, rotateX: 8, rotateY: -13 },
  },
  {
    id: "conversion",
    node: <PanelConversion />,
    w: SLOT.sw,
    h: SLOT.sh,
    area: "min-[1440px]:col-start-2 min-[1440px]:row-start-1",
    // Las de la izquierda fugan hacia la izquierda y las de la derecha hacia
    // la derecha: dos tarjetas del mismo costado mirando a lugares opuestos
    // se leen como dos escenas distintas pegadas.
    tilt: { rotate: -3, rotateX: 11, rotateY: 12 },
  },
  {
    id: "velocidad",
    node: <PanelVelocidad />,
    w: SLOT.sw,
    h: SLOT.sh,
    area: "min-[1440px]:col-start-3 min-[1440px]:row-start-1",
    tilt: { rotate: 3.5, rotateX: 9, rotateY: 14 },
  },
  {
    id: "trafico",
    node: <PanelTrafico />,
    w: SLOT.mw,
    h: SLOT.mh,
    area: "min-[1440px]:col-start-2 min-[1440px]:col-span-2 min-[1440px]:row-start-2",
    tilt: { rotate: 2, rotateX: 10, rotateY: -11 },
  },
] as const;

const SCATTER_SCALE = 1.18;

/**
 * Dónde arranca cada panel antes de converger.
 *
 * Dos por costado, en diagonal, con el titular en el hueco del medio: así
 * queda centrado en la pantalla en vez de tener que cederles la mitad de
 * abajo.
 *
 * El reparto no es decorativo, sale de la medida. A 1440 el texto ocupa de 345
 * a 1081, o sea que cada costado deja una franja de unos 350px. Ahí entra una
 * tarjeta chica entera, o una grande sangrando por el borde, pero no dos al
 * lado de la otra.
 *
 * Y el sangrado va siempre por la derecha. El contenido de las tarjetas está
 * alineado a la izquierda —título arriba, número abajo—, así que cortar por
 * ese lado se lleva justo lo único que hay para leer: la grande arrancó a la
 * izquierda y se veía el gráfico sin saber de qué era. Cortadas por la
 * derecha se pierde la cola de los números y se entienden igual. Por eso las
 * dos que sangran, la grande y la de tráfico, van a la derecha, y las dos
 * chicas quedan enteras a la izquierda.
 *
 * De 1600 para arriba las posiciones se corren hacia afuera: lo que se busca
 * es que apenas asomen fuera de cuadro, y un porcentaje fijo las trae hacia
 * adentro a medida que crece la pantalla hasta dejar de cortarlas.
 *
 * El arranque vertical tampoco es libre: arriba está la barra flotante, y una
 * tarjeta que asoma por debajo deja ver un pedazo de dato suelto al lado del
 * logo. Abajo sí pueden bajar todo lo que quieran, porque el tablero recién
 * aparece cuando el visitante empieza a bajar.
 *
 * Aparecen recién a partir de 1440px: abajo de ese ancho no hay costado libre.
 */
const scattered: Record<string, string> = {
  visitas: "right-[-10%] top-[11%] min-[1600px]:right-[-5%]",
  conversion: "left-[2%] top-[15%] min-[1600px]:left-[5%]",
  velocidad: "left-[3%] top-[52%] min-[1600px]:left-[6%]",
  trafico: "right-[-6%] top-[67%] min-[1600px]:right-[-2%]",
};

export function HeroScene() {
  const { dashboard } = useCopy().hero;
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 1440px) and (prefers-reduced-motion: no-preference)",
          simple: "(max-width: 1439px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean };
          const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);
          const frame = root.querySelector<HTMLElement>("[data-dashboard]");

          if (!desktop) return;

          gsap.set(cards, {
            rotate: (i) => panels[i].tilt.rotate,
            rotateX: (i) => panels[i].tilt.rotateX,
            rotateY: (i) => panels[i].tilt.rotateY,
            scale: SCATTER_SCALE,
            transformPerspective: 1400,
          });

          // Se pueden agarrar y mover. El arrastre vive en el hijo, así que no
          // compite con el transform que usa el vuelo.
          const draggables = cards.map((card) =>
            Draggable.create(card.querySelector("[data-drag]"), {
              type: "x,y",
              inertia: false,
              cursor: "grab",
              activeCursor: "grabbing",
            }),
          );
          gsap.from(cards, {
            opacity: 0,
            y: 34,
            duration: 1,
            ease,
            stagger: 0.09,
            delay: 0.5,
          });

          /** Cuánto tiene que viajar una tarjeta hasta su hueco. */
          const flight = (card: HTMLElement) => {
            const slot = root.querySelector<HTMLElement>(
              `[data-slot="${card.dataset.card}"]`,
            );
            if (!slot) return { x: 0, y: 0 };

            const saved = {
              x: gsap.getProperty(card, "x") as number,
              y: gsap.getProperty(card, "y") as number,
              rotate: gsap.getProperty(card, "rotation") as number,
              rotateX: gsap.getProperty(card, "rotationX") as number,
              rotateY: gsap.getProperty(card, "rotationY") as number,
              scale: gsap.getProperty(card, "scaleX") as number,
            };
            gsap.set(card, {
              x: 0,
              y: 0,
              rotate: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
            });
            const c = card.getBoundingClientRect();
            const s = slot.getBoundingClientRect();
            gsap.set(card, saved);

            return { x: s.left - c.left, y: s.top - c.top };
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.closest("section"),
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          if (frame) {
            // Solo opacidad: el marco no se desplaza.
            //
            // Antes entraba desde y:70 y los huecos se movían con él. Cada
            // panel mide su hueco cuando arranca su propio vuelo —GSAP resuelve
            // los valores por función una sola vez, ahí— así que apuntaban a
            // una posición que el marco todavía estaba dejando atrás y
            // aterrizaban 70px más abajo, con el hueco vacío asomando arriba.
            // Con el marco quieto, lo que se mide es lo que hay.
            tl.fromTo(
              frame,
              { opacity: 0 },
              { opacity: 1, ease: "power2.out", duration: 0.3 },
              0.05,
            );
          }

          cards.forEach((card, i) => {
            const at = 0.18 + i * 0.05;

            // Lo que el visitante haya movido a mano vuelve a cero antes de
            // volar: si no, el panel aterriza corrido respecto del hueco.
            tl.to(
              card.querySelector("[data-drag]"),
              { x: 0, y: 0, ease: "power2.inOut", duration: 0.3 },
              at,
            );

            tl.to(
              card,
              {
                x: () => flight(card).x,
                y: () => flight(card).y,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                // Se pasa apenas del hueco y vuelve, como una pieza que se
                // acomoda al encastrar. Va con back y no con un rebote aparte
                // porque el vuelo está atado al scroll: un tween suelto al
                // final se dispararía cada vez que el visitante cruza ese
                // punto, para adelante y para atrás.
                ease: "back.out(1.15)",
                duration: 0.62,
              },
              at,
            );
          });

          return () => {
            draggables.flat().forEach((d) => d.kill());
            gsap.set(cards, { clearProps: "all" });
          };
        },
      );

      return () => mm.revert();
    },
    { scope },
  );

  // Sin borde: lo que separa una tarjeta del fondo es la sombra, no una
  // línea. Un borde de 1px sobre un fondo claro las endurece y las saca del
  // registro de producto.
  const frameClasses =
    "overflow-hidden rounded-[20px] bg-card shadow-[0_2px_4px_-2px_rgba(17,24,60,0.06),0_24px_48px_-20px_rgba(17,24,60,0.22)]";

  return (
    <div ref={scope} className="pointer-events-none min-[1440px]:shrink-0">
      {/* Paneles sueltos: solo en desktop, donde hay lugar para dispersarlos.
          Van encima del dashboard para que se vean al aterrizar. */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 hidden min-[1440px]:block"
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            data-card={panel.id}
            style={{ width: panel.w, height: panel.h }}
            className={cn("absolute", scattered[panel.id])}
          >
            <div
              data-drag
              className={cn("pointer-events-auto h-full w-full", frameClasses)}
            >
              {panel.node}
            </div>
          </div>
        ))}
      </div>

      {/*
        Dashboard. En desktop los huecos quedan vacíos hasta que llegan los
        paneles; en mobile ya vienen adentro.

        Va en el flujo y no anclado al pie del contenedor. Anclado abajo, su
        borde superior dependía del alto del viewport y en pantallas de menos
        de 1000px subía hasta taparle la línea de prueba al titular. En el
        flujo, el orden lo garantiza la maquetación.

        Reserva una franja más corta de lo que mide y deja que el resto sangre
        por el piso: el marco ya está hecho para cortarse abajo —no lleva borde
        inferior— y reservando el alto completo el titular quedaba arrinconado
        contra la barra en pantallas bajas.
      */}
      {/* relative z-10: el fondo del hero es absolute y el marco no tenía
          posición, así que el degradé que apaga la bruma contra el pie le
          pasaba por encima y se tragaba la cabecera del tablero. Se veían
          las tarjetas —van en z-20— flotando sobre nada. */}
      <div className="relative z-10 mt-12 min-[1440px]:mt-0 min-[1440px]:h-[180px] min-[1440px]:overflow-visible [@media(min-height:960px)]:min-[1440px]:h-[280px]">
        <div className="shell">
          <div
            data-dashboard
            className="mx-auto w-full overflow-hidden rounded-t-[28px] bg-mist shadow-[0_-24px_60px_-30px_rgba(17,24,60,0.25)] min-[1440px]:w-fit"
          >
            {/* Cabecera del tablero, no de un navegador: lo que se muestra es
                el panel del sitio, no una captura de pantalla. */}
            <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-4 min-[1440px]:gap-6 min-[1440px]:px-6 min-[1440px]:pt-5">
              <div>
                <p className="text-[0.95rem] font-semibold tracking-[-0.02em] min-[1440px]:text-[1.05rem]">
                  {dashboard.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.72rem] text-ink-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-verde-deep" />
                  {dashboard.status}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-card px-3.5 py-2 text-[0.72rem] font-medium">
                {dashboard.range}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 min-[1440px]:grid-cols-[400px_192px_192px] min-[1440px]:grid-rows-[176px_188px] min-[1440px]:gap-4 min-[1440px]:p-4">
              {panels.map((panel) => (
                <div
                  key={panel.id}
                  data-slot={panel.id}
                  style={{ height: FONO[panel.id].h }}
                  className={cn(
                    "overflow-hidden rounded-[20px] bg-white/45 min-[1440px]:h-auto",
                    FONO[panel.id].area,
                    panel.area,
                  )}
                >
                  {/* En desktop el hueco queda vacío: lo llena la tarjeta. */}
                  <div className="h-full min-[1440px]:hidden">{panel.node}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
