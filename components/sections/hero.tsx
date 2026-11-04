import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { HeroGaleria } from "@/components/sections/hero-galeria";
import { HeroTexto } from "@/components/sections/hero-intro";
import type { Pantalla } from "@/content/hero-galeria";

/**
 * La portada.
 *
 * Tipográfica y centrada: la pastilla de disponibilidad, el titular grande
 * a todo el ancho, la bajada y los dos botones, todo al centro. Abajo, de
 * punta a punta, la galería de pantallas corriendo como un riel, más alta y
 * más cerca que antes: el texto y la galería son una sola primera pantalla,
 * y la galería es el visual del hero.
 *
 * Detrás del titular hay un lugar reservado ([data-hero-objeto]) para un
 * objeto oscuro y metálico que se inclina apenas con el mouse; el texto va
 * encima. Todavía no está: espera la referencia estética de la usuaria.
 *
 * Tuvo a la derecha el pase de Pantufla, un papel 3D que volaba con el
 * scroll hasta un banner a mitad de página con un formulario para reservar
 * un cupo. Se fue entero: con poco flujo de clientes la idea del cupón no se
 * entendía, y a la usuaria le quedó rara.
 *
 * Entra sin JavaScript: la pastilla, el titular, la bajada y los botones
 * tienen su entrada de CSS (ver globals.css), y la galería es HTML que el
 * riel mueve con CSS.
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(255,255,255,0.75)_0%,transparent_60%)]"
      />

      {/* El relleno de arriba despeja la barra flotante y deja el titular en
          el primer tercio de la pantalla; lo que sigue es la galería. */}
      <div className="shell relative pt-32 md:pt-40">
        {/* El lugar del objeto: detrás del texto, centrado en el titular. */}
        <div
          data-hero-objeto
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2"
        />
        <HeroTexto />
      </div>

      <HeroGaleria pantallas={pantallas} label={galeria} />
    </section>
  );
}
