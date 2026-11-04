import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { HeroTexto } from "@/components/sections/hero-intro";
import { HeroMosaico } from "@/components/sections/hero-mosaico";
import type { Pantalla } from "@/content/hero-galeria";

/**
 * La portada.
 *
 * Tipográfica y centrada: el titular grande a todo el ancho, la bajada y los dos botones, todo al centro. Abajo, el
 * mosaico: una grilla quieta de placas negras con teléfonos, íconos y una
 * pieza de interfaz (ver hero-mosaico.tsx). El texto y el mosaico son una
 * sola primera pantalla, y el mosaico es el visual del hero. Antes iba ahí
 * una galería de pantallas que corría como un riel; se sacó porque
 * resultaba muy grande y lenta.
 *
 * Adentro del titular van tres pictogramas en pastillas —la ventana de un
 * sitio, el cursor del visitante, el sobre del cliente que escribe—, como
 * los íconos de apps en el titular de Mobbin, pero propios y monocromos (ver
 * split-heading.tsx, los tramos con `icon`). Son la identidad del hero: se
 * pensó un objeto 3D metálico detrás del texto y la usuaria prefirió esto.
 *
 * Tuvo a la derecha el pase de Pantufla, un papel 3D que volaba con el
 * scroll hasta un banner a mitad de página con un formulario para reservar
 * un cupo. Se fue entero: con poco flujo de clientes la idea del cupón no se
 * entendía, y a la usuaria le quedó rara.
 *
 * Entra sin JavaScript: la pastilla, el titular, la bajada y los botones
 * tienen su entrada de CSS (ver globals.css), y el mosaico es HTML quieto
 * con la misma entrada.
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
        <HeroTexto />
      </div>

      <HeroMosaico pantallas={pantallas} label={galeria} />
    </section>
  );
}
