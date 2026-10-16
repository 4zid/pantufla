import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { BoletoDorado } from "@/components/boleto/boleto-dorado";
import { HeroGaleria } from "@/components/sections/hero-galeria";
import { HeroTexto } from "@/components/sections/hero-intro";
import type { Pantalla } from "@/content/hero-galeria";

/**
 * La portada.
 *
 * Arriba, dos columnas: a la izquierda todo el texto alineado —la pastilla de
 * disponibilidad, el titular, la bajada y los botones— y a la derecha el
 * boleto dorado, que es la ilustración y a la vez un formulario: deja el
 * mail para reservar un lugar en la agenda. Abajo, de punta a punta, la
 * galería de pantallas corriendo como un riel.
 *
 * El boleto no se queda acá. Cuando el hero se va de la pantalla, una copia
 * sale volando desde este lugar y acompaña el scroll hasta la última sección,
 * donde aterriza en el boleto de verdad (boleto-vuelo.tsx). Por eso el boleto
 * va dentro de un lugar con data-boleto-lugar: el vuelo mide ese lugar, no
 * el boleto, que se inclina con el mouse y entra con su animación.
 *
 * Abajo de lg el boleto va debajo de los botones, y en el teléfono todo corre
 * seguido.
 *
 * Entra sin JavaScript: la pastilla, el titular, la bajada, los botones y el
 * boleto tienen su entrada de CSS (ver globals.css), y la galería es HTML que
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
  /* La itálica solo existe en el titular y en el boleto, así que la precarga
     la pide el hero y no el layout: las demás páginas no la bajan. */
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

      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-12 px-5 pt-[112px] md:px-8 md:pt-[150px] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 xl:px-16">
        <HeroTexto />

        <div
          data-boleto-lugar="hero"
          className="w-full max-w-[29rem] lg:w-[27rem] xl:w-[29rem]"
        >
          <div data-entra style={{ "--entra": "0.55s" } as React.CSSProperties}>
            <BoletoDorado origen="hero" />
          </div>
        </div>
      </div>

      <HeroGaleria pantallas={pantallas} label={galeria} />
    </section>
  );
}
