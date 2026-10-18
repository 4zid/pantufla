"use client";

import { useMemo, useState } from "react";

import { clients } from "@/content/site";
import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { nombreCiudad, nombrePais } from "@/content/countries";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Globo, type PaisGlobo } from "@/components/sections/globo";
import { Section, SectionHead, type Surface } from "@/components/ui/section";
import { cn } from "@/lib/cn";

/**
 * Dónde trabajamos.
 *
 * Un globo blanco y negro que gira despacio, con los países donde
 * trabajamos en tinta y una marca con el nombre de cada uno (ver globo.tsx),
 * y al lado la lista de esos países.
 *
 * Antes era un mapa plano con una línea desde Buenos Aires hasta cada
 * ciudad, en el celeste de la marca. El globo dice lo mismo —desde acá para
 * donde haga falta— con el blanco y negro del resto de la página.
 *
 * El globo muestra el alcance y la lista dice los nombres, que es lo que se
 * puede leer sin seguir algo que gira. La lista además es el control:
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
  const [activo, setActivo] = useState<string | null>(null);

  /* Memorizado a propósito: el globo se vuelve a armar si cambia esta lista,
     y una lista nueva en cada render lo armaría de nuevo a cada paso del
     mouse por la lista. */
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
      {embedded ? (
        <div className="mx-auto max-w-2xl text-center">
          <SplitHeading as="h3" text={clientsMap.title} className="text-h3" />
          <Reveal delay={0.1}>
            <p className="mt-4 text-lead text-ink-soft">{bajada}</p>
          </Reveal>
        </div>
      ) : (
        <SectionHead
          icon="globo"
          eyebrow={clientsMap.eyebrow}
          title={clientsMap.title}
          lead={bajada}
        />
      )}

      <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center lg:gap-12">
        <Reveal>
          <Globo paises={paises} activo={activo} />
        </Reveal>

        {/* La lista. Es la parte legible del dato —el globo muestra el
            alcance, acá están los nombres— y también es el control: señalar
            un país lo pone de frente en el globo.

            Cada fila es un botón y no un li con hover. El hover no existe en
            un teléfono, así que una lista que esperaba un mouse no respondía
            a nada. Con un botón se toca; el hover se sigue atendiendo aparte
            para que en escritorio pasar por encima alcance, sin obligar a
            hacer clic. */}
        <Reveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-1 lg:gap-x-0">
            {clients.map(({ country, city }) => (
              <li key={country} className="border-t border-line">
                <button
                  type="button"
                  /* El pointerType distingue el dedo del mouse: sin eso, en un
                     teléfono el toque dispara también el enter y el leave, y el
                     país se enciende y se apaga en el mismo gesto. */
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "touch") setActivo(country);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== "touch") setActivo(null);
                  }}
                  onFocus={() => setActivo(country)}
                  onBlur={() => setActivo(null)}
                  /* Enciende, no alterna: el toque da el foco antes del clic,
                     así que alternar prendía el país con el foco y lo apagaba
                     con el clic. Se toca otro y listo, y al salir del botón
                     el blur limpia. */
                  onClick={() => setActivo(country)}
                  aria-pressed={activo === country}
                  className={cn(
                    "block w-full py-3 text-left transition-opacity duration-300",
                    activo && activo !== country ? "opacity-45" : "opacity-100",
                  )}
                >
                  <span className="flex items-center gap-2 text-[0.95rem] font-medium tracking-[-0.015em]">
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full bg-ink transition-transform duration-300",
                        activo === country ? "scale-150" : "scale-100",
                      )}
                    />
                    {nombrePais(country, locale)}
                  </span>
                  {city ? (
                    <span className="mt-0.5 block pl-3.5 text-[0.82rem] leading-snug text-ink-faint">
                      {nombreCiudad(city, locale)}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );

  return embedded ? (
    <div id="clientes" className="mt-24 md:mt-32">
      {cuerpo}
    </div>
  ) : (
    <Section id="clientes" surface={surface}>
      {cuerpo}
    </Section>
  );
}
