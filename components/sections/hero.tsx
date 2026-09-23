import type { Surface } from "@/components/ui/section";
import { HeroAurora } from "@/components/sections/hero-aurora";
import { HeroIntro } from "@/components/sections/hero-intro";
import { HeroScene } from "@/components/sections/hero-scene";

/**
 * En desktop el hero mide tres pantallas y el escenario queda fijo: eso es lo
 * que da el recorrido en el que los paneles convergen en el dashboard. Eran
 * dos y el vuelo entero entraba en dos vueltas de rueda; con 200vh de
 * recorrido en vez de 120 hay lugar para que se vea venir.
 * En mobile es una sección normal, con el dashboard ya armado abajo del título.
 *
 * El titular queda centrado en la pantalla, con las tarjetas flanqueándolo.
 *
 * Para que el centro sea el de la pantalla y no el del espacio sobrante, el
 * aire de arriba hace de contrapeso de lo que el tablero reserva abajo (ver
 * hero-scene). Sin ese contrapeso el bloque se centra en lo que queda después
 * del tablero y termina unos 50px alto.
 *
 * Va cuarenta pixeles por debajo de la reserva, y eso deja el titular unos
 * veinte arriba del centro exacto. Es a propósito: el
 * centro óptico de un bloque de texto está un poco más alto que el
 * geométrico, y esos 40px son los que le hacen falta al titular para no
 * apretarse cuando el tablero se lleva más pantalla.
 *
 * El aire de arriba en mobile va acotado a menos de 1440 (max-[1439px]), que
 * es lo que lo mantiene lejos del valor de escritorio: los dos viven en el
 * mismo elemento pero nunca se pisan, porque no hay ancho donde los dos
 * apliquen. Y va adentro del marco, no en la sección: puesto afuera, esos
 * 112px quedaban arriba del fondo, que arranca donde arranca el marco, y en el
 * teléfono se veía una banda blanca con un corte recto contra la bruma.
 */
export function Hero({ surface = "mist" }: { surface?: Surface }) {
  return (
    <section
      data-surface={surface}
      className="relative max-[1439px]:pb-16 min-[1440px]:h-[300vh]"
    >
      <div className="relative overflow-hidden min-[1440px]:sticky min-[1440px]:top-0 min-[1440px]:flex min-[1440px]:h-screen min-[1440px]:flex-col">
        <HeroAurora />
        <div className="max-[1439px]:pt-28 min-[1440px]:flex min-[1440px]:min-h-0 min-[1440px]:flex-1 min-[1440px]:items-center min-[1440px]:pt-[calc(var(--hero-reserve)-40px)]">
          <HeroIntro />
        </div>
        <HeroScene />

        {/*
          El piso. El marco mide una pantalla y corta el tablero por la mitad
          con una línea recta, que es lo que delata que hay algo escondido.
          Acá esa línea se disuelve: lo último que se ve entra en desenfoque y
          se funde con el color del fondo, así el corte pasa a ser una
          profundidad de campo.

          El desenfoque va con máscara para que crezca de arriba hacia abajo:
          aplicado parejo, emborronaría también la parte que sí se tiene que
          leer.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden h-[130px] min-[1440px]:block"
        >
          <div
            className="absolute inset-0 backdrop-blur-[6px]"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 45%, #000 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 45%, #000 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(234,237,248,0) 0%, rgba(234,237,248,0.55) 55%, var(--color-mist) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
