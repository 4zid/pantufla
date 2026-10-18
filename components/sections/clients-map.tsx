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

      {/* El escenario: la palabra gigante atrás y el globo adelante. La
          palabra va centrada en la pantalla y no en la columna, y puede ser
          más ancha que el contenido —a 1440 mide 1300 px—, pero nunca más que
          la ventana: el tamaño sale del ancho de la ventana (14vw, y la
          palabra mide 6,6 veces su tamaño). Así no hay scroll de costado.

          En el teléfono el globo es casi tan ancho como la palabra y detrás
          la tapaba entera: ahí va arriba, y el globo sube a pisarle solo el
          pie de las letras. */}
      <div className="relative mt-10 md:mt-14">
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
            activo={activo}
            className="max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]"
          />
        </Reveal>
      </div>

      {/* Los países, abajo del planeta. Son el dato legible —el globo
          muestra el alcance, acá están los nombres— y también el control:
          señalar uno lo pone de frente en el globo.

          Cada uno es un botón y no un li con hover. El hover no existe en un
          teléfono, así que una lista que esperaba un mouse no respondía a
          nada. Con un botón se toca; el hover se sigue atendiendo aparte
          para que en escritorio pasar por encima alcance, sin hacer clic. */}
      <Reveal delay={0.15}>
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2 md:mt-10">
          {clients.map(({ country, city }) => {
            const encendido = activo === country;
            return (
              <li key={country}>
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
                  aria-pressed={encendido}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.9rem] font-medium tracking-[-0.015em] transition-[background-color,border-color,color,opacity] duration-300",
                    encendido
                      ? "border-ink bg-ink text-on-ink"
                      : "border-line bg-card text-ink hover:border-line-strong",
                    activo && !encendido && "opacity-50",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      encendido ? "bg-on-ink" : "bg-ink",
                    )}
                  />
                  {nombrePais(country, locale)}
                  {city ? (
                    <span
                      className={cn(
                        "font-normal",
                        encendido ? "text-on-ink/70" : "text-ink-faint",
                      )}
                    >
                      · {nombreCiudad(city, locale)}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>
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
