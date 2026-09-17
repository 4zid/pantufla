import { HeroAurora } from "@/components/sections/hero-aurora";
import { HeroIntro } from "@/components/sections/hero-intro";
import { HeroScene } from "@/components/sections/hero-scene";

/**
 * En desktop el hero mide dos pantallas y el escenario queda fijo: eso es lo
 * que da el recorrido en el que los paneles convergen en el dashboard.
 * En mobile es una sección normal, con el dashboard ya armado abajo del título.
 *
 * El titular queda centrado en la pantalla, con las tarjetas flanqueándolo.
 *
 * Para que el centro sea el de la pantalla y no el del espacio sobrante, el
 * aire de arriba mide exactamente lo que el tablero reserva abajo (175px, ver
 * hero-scene). Sin ese contrapeso el bloque se centra en lo que queda después
 * del tablero y termina unos 50px alto.
 *
 * El aire de arriba en mobile va acotado a menos de 1440 (max-[1439px]), que
 * es lo que lo mantiene lejos del valor de escritorio: los dos viven en el
 * mismo elemento pero nunca se pisan, porque no hay ancho donde los dos
 * apliquen. Y va adentro del marco, no en la sección: puesto afuera, esos
 * 112px quedaban arriba del fondo, que arranca donde arranca el marco, y en el
 * teléfono se veía una banda blanca con un corte recto contra la bruma.
 */
export function Hero() {
  return (
    <section className="relative max-[1439px]:pb-16 min-[1440px]:h-[220vh]">
      <div className="relative overflow-hidden min-[1440px]:sticky min-[1440px]:top-0 min-[1440px]:flex min-[1440px]:h-screen min-[1440px]:flex-col">
        <HeroAurora />
        <div className="max-[1439px]:pt-28 min-[1440px]:flex min-[1440px]:min-h-0 min-[1440px]:flex-1 min-[1440px]:items-center min-[1440px]:pt-[180px] [@media(min-height:960px)]:min-[1440px]:pt-[280px]">
          <HeroIntro />
        </div>
        <HeroScene />
      </div>
    </section>
  );
}
