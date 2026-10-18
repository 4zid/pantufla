import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { PaseFormulario } from "@/components/pase/pase-formulario";
import { PaseLugar } from "@/components/pase/pase-lugar";
import { HeroGaleria } from "@/components/sections/hero-galeria";
import { HeroTexto } from "@/components/sections/hero-intro";
import type { Pantalla } from "@/content/hero-galeria";

/**
 * La portada.
 *
 * Arriba, dos columnas: a la izquierda todo el texto alineado —la pastilla de
 * disponibilidad, el titular, la bajada y los botones— y a la derecha el pase
 * de Pantufla, con el formulario para reservar un lugar en la agenda debajo.
 * Abajo, de punta a punta, la galería de pantallas corriendo como un riel.
 *
 * El pase es un papel en 3D (components/pase) que no se queda acá: cuando el
 * hero se va de la pantalla se despega de su lugar, acompaña el scroll y
 * aterriza en el de la última sección. Lo que hay en la página es el lugar
 * (PaseLugar), con una imagen del pase que es lo que se ve sin 3D.
 *
 * Abajo de lg el pase va debajo de los botones, y en el teléfono todo corre
 * seguido.
 *
 * Entra sin JavaScript: la pastilla, el titular, la bajada, los botones y el
 * pase tienen su entrada de CSS (ver globals.css), y la galería es HTML que
 * el riel mueve con CSS.
 */
export function Hero({
  surface = "mist",
  pantallas,
  galeria,
}: {
  surface?: Surface;
  pantallas: Pantalla[];
  /** El nombre de la galería para el lector de pantalla. */
  galeria: string;
}) {
  /* La itálica solo existe en el titular, así que la precarga la pide el hero
     y no el layout: las demás páginas no la bajan. */
  preload("/fonts/newsreader-italic-latin-v1.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <section
      data-surface={surface}
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(140%_60%_at_50%_0%,rgba(255,255,255,0.7)_0%,transparent_55%)] md:bg-[radial-gradient(90%_70%_at_75%_10%,rgba(255,255,255,0.75)_0%,transparent_60%)]"
      />

      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-12 px-5 pt-[120px] md:px-10 md:pt-[176px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20 xl:px-24">
        <HeroTexto />

        <div
          data-pase-zona="hero"
          className="mx-auto w-full max-w-[23rem] lg:mx-0 lg:w-[21rem] xl:w-[23rem]"
        >
          <PaseLugar
            origen="hero"
            entra={0.5}
            sizes="(min-width: 1280px) 232px, 216px"
            className="mx-auto w-[13rem] sm:w-[13.5rem] xl:w-[14.5rem]"
          />
          <div data-entra style={{ "--entra": "0.6s" } as React.CSSProperties}>
            <PaseFormulario origen="hero" className="mt-7" />
          </div>
        </div>
      </div>

      <HeroGaleria pantallas={pantallas} label={galeria} />
    </section>
  );
}
