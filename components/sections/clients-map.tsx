"use client";

import { useMemo } from "react";

import { clients } from "@/content/site";
import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { nombreCiudad, nombrePais } from "@/content/countries";
import { Reveal } from "@/components/motion/reveal";
import { Globo, type PaisGlobo } from "@/components/sections/globo";
import { Section, type Surface } from "@/components/ui/section";
import { cn } from "@/lib/cn";

/**
 * Dónde trabajamos.
 *
 * Un globo blanco y negro, holográfico, que gira despacio delante de una
 * palabra gigante («Worldwide», en el Black de la Schibsted), con los países
 * donde trabajamos en tinta y una marca con el nombre de cada uno (ver
 * globo.tsx). Abajo del planeta, los mismos países en pastillas.
 *
 * Antes era un mapa plano con una línea desde Buenos Aires hasta cada
 * ciudad, en el celeste de la marca. El globo dice lo mismo —desde acá para
 * donde haga falta— con el blanco y negro del resto de la página.
 *
 * El globo muestra el alcance y las pastillas dicen los nombres, que es lo
 * que se puede leer sin seguir algo que gira. Además son el control:
 * señalar un país (con el mouse, con el dedo o con el teclado) hace girar el
 * globo hasta ponerlo de frente y enciende su marca. Son dos vistas de lo
 * mismo, no un globo con una leyenda.
 *
 * Con los testimonios prendidos va adentro de esa sección (embedded): eran
 * dos bloques de prueba seguidos, cada uno con su etiqueta y su titular, y se
 * leían como dos veces lo mismo. Juntos son una sola: lo que dicen y desde
 * dónde. Ahí el titular baja a h3 y se centra, para colgar de la cita y no
 * abrir una sección nueva.
 */
export function ClientsMap({
  surface,
  embedded = false,
}: {
  surface?: Surface;
  /** Adentro de los testimonios: sin sección propia ni etiqueta. */
  embedded?: boolean;
}) {
  const { clientsMap } = useCopy();
  const locale = useLocale();

  /* Memorizado a propósito: el globo se vuelve a armar si cambia esta lista,
     y una lista nueva en cada render lo armaría de nuevo. */
  const paises = useMemo<PaisGlobo[]>(
    () =>
      clients.map((c) => ({
        pais: c.country,
        nombre: nombrePais(c.country, locale),
        lon: c.lon,
        lat: c.lat,
      })),
    [locale],
  );

  const bajada = fill(clientsMap.note, { count: clients.length });

  const cuerpo = (
    <>
      {/* Sin título a la vista: el globo con su palabra gigante ya es el
          encabezado. Queda para el índice y para quien navega con lector,
          con la cuenta de países que antes iba en la bajada. */}
      {embedded ? (
        <h3 className="sr-only">
          {clientsMap.title} {bajada}
        </h3>
      ) : (
        <h2 className="sr-only">
          {clientsMap.title} {bajada}
        </h2>
      )}

      {/* El escenario: la palabra gigante atrás y el globo adelante. La
          palabra va centrada en la pantalla y no en la columna, y puede ser
          más ancha que el contenido —a 1440 mide 1300 px—, pero nunca más que
          la ventana: el tamaño sale del ancho de la ventana (14vw, y la
          palabra mide 6,6 veces su tamaño). Así no hay scroll de costado.

          En el teléfono el globo es casi tan ancho como la palabra y detrás
          la tapaba entera: ahí va arriba, y el globo sube a pisarle solo el
          pie de las letras. */}
      <div className="relative">
        <Reveal
          y={40}
          className="pointer-events-none relative text-center md:absolute md:left-1/2 md:top-[44%] md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <p
            aria-hidden
            className="select-none whitespace-nowrap text-[min(14vw,16rem)] font-black uppercase leading-[0.8] tracking-[-0.045em] text-ink"
          >
            {clientsMap.backdrop}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="relative -mt-[6vw] md:mt-0">
          <Globo
            paises={paises}
            className="max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]"
          />
        </Reveal>
      </div>

      {/* Los nombres están en las marcas del globo, que son decorado: para
          el lector de pantalla, la lista entera acá. */}
      <ul className="sr-only">
        {clients.map(({ country, city }) => (
          <li key={country}>
            {nombrePais(country, locale)}
            {city ? `, ${nombreCiudad(city, locale)}` : null}
          </li>
        ))}
      </ul>
    </>
  );

  return embedded ? (
    <div id="clientes">{cuerpo}</div>
  ) : (
    <Section id="clientes" surface={surface}>
      {cuerpo}
    </Section>
  );
}
