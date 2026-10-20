import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { PaseLugar } from "@/components/pase/pase-lugar";
import { HeroGaleria } from "@/components/sections/hero-galeria";
import { HeroTexto } from "@/components/sections/hero-intro";
import type { Pantalla } from "@/content/hero-galeria";

/**
 * La portada.
 *
 * Arriba, dos columnas: a la izquierda todo el texto alineado —la pastilla de
 * disponibilidad, el titular, la bajada y los botones— y a la derecha el pase
 * de Pantufla. Abajo, de punta a punta, la galería de pantallas corriendo
 * como un riel.
 *
 * El pase es un enlace al banner (#lugar), donde se reserva con nombre y
 * mail: tocarlo baja hasta ahí, y el pase 3D hace el viaje con el scroll.
 * Tenía su propio formulario abajo, con el mail solo: era el mismo pedido dos
 * veces en la página y se fue. Si el banner está apagado en el Studio, el
 * pase no lleva a ningún lado y es solo el dibujo.
 *
 * El pase es un papel en 3D (components/pase) que no se queda acá: cuando el
 * hero se va de la pantalla se despega de su lugar, acompaña el scroll y
 * aterriza en el de la última sección. Lo que hay en la página es el lugar
 * (PaseLugar), con una imagen del pase que es lo que se ve sin 3D.
 *
 * Las dos columnas son mitades iguales adentro del mismo ancho que el resto
 * de la página (.shell), y el pase va centrado en la suya: así el texto y el
 * pase quedan a la misma distancia del centro y la portada se lee centrada
 * debajo de la barra, que también va al medio. Antes el hero tenía su propio
 * ancho, más grande que el de las secciones (90rem con 96px de margen), el
 * pase pegado al borde derecho y un hueco grande en el medio, con el titular a
 * 68px y los botones grandes: se veía todo un poco grande y corrido. Tomamos
 * de referencia la portada de Resend, más armónica.
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
  conBanner = false,
}: {
  surface?: Surface;
  pantallas: Pantalla[];
  /** Si el banner del pase está prendido: el pase lleva hasta ahí. */
  conBanner?: boolean;
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

      {/* Desde md el bloque ocupa la pantalla menos 5rem y centra su
          contenido en el alto: el texto y el pase quedan en el medio de la
          primera pantalla, y de la galería de abajo asoman apenas las
          puntas de las capturas (los 5rem son los 24px de aire de arriba de
          la galería más unos 56 de pantallas). El relleno de arriba es el
          de la barra flotante, así el centro es el del espacio libre y no el
          de la ventana entera. En el teléfono el texto y el pase no entran
          en una pantalla, y todo corre seguido. */}
      <div className="shell grid items-center gap-12 pt-28 md:min-h-[calc(100svh-5rem)] md:content-center md:pb-10 md:pt-24 lg:grid-cols-2 lg:gap-12">
        <HeroTexto />

        {/* Sin data-pase-zona a propósito: el foco adentro de una zona deja
            el pase apoyado ahí (ver pase-3d.ts), y el clic en el enlace lo
            enfoca. Con la zona, el pase se quedaba en la portada mientras la
            página bajaba al banner. La zona era para el formulario que había
            acá, para que el pase no se fuera mientras alguien escribía. */}
        <PaseLugar
          origen="hero"
          entra={0.5}
          href={conBanner ? "#lugar" : undefined}
          centrar='[data-pase-lugar="banner"]'
          sizes="(min-width: 1280px) 232px, 208px"
          className="mx-auto w-[13rem] xl:w-[14.5rem] lg:justify-self-center"
        />
      </div>

      <HeroGaleria pantallas={pantallas} label={galeria} />
    </section>
  );
}
