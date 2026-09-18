"use client";

import { useGSAP } from "@gsap/react";
import { useMemo, useRef, useState } from "react";

import { clients, studio } from "@/content/site";
import { useCopy, useLocale } from "@/components/copy-provider";
import { fill } from "@/content/copy";
import { nombrePais } from "@/content/countries";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { TIERRA, VISTA, aX, aY, porcentajeX, porcentajeY } from "@/content/world";
import { ease, gsap, registerGsap, START } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Dónde hay clientes.
 *
 * Una silueta del mundo y una línea desde Buenos Aires hasta cada ciudad. La
 * silueta sale de Natural Earth —ver content/world.ts— y las líneas son el
 * contenido: el titular dice «trabajamos desde acá para donde estés» y esto es
 * esa frase dibujada.
 *
 * Antes era una grilla de puntos con un pin de color miel encima. Tenía dos
 * problemas. A esta escala la trama no se leía como un mapa, y el miel no está
 * en ningún otro lado del sitio: aparecía un amarillo suelto sin relación con
 * nada. Ahora la tierra es tinta apagada —fondo, no dibujo— y todo lo que es
 * información va en el celeste de la marca.
 *
 * El otro problema era la lectura. Nueve ciudades en un mapa del mundo se
 * pisan: Madrid y Barcelona quedan a cinco pixeles, Buenos Aires y Montevideo
 * a siete. Ningún tamaño de pin arregla eso. Así que el mapa muestra el alcance
 * y la lista de al lado dice los nombres, que es lo que se puede leer sin
 * entrecerrar los ojos. Pasar por una fila enciende sus ciudades en el mapa y
 * al revés: son dos vistas de lo mismo, no un mapa con una leyenda.
 */

/** Cuánto se arquea una línea, como fracción de su propio largo. */
const CURVA = 0.19;

/**
 * Una curva entre dos puntos, siempre arqueada hacia arriba.
 *
 * La normal de un segmento tiene dos sentidos; se elige el que sube porque una
 * línea que se hunde por debajo de sus dos extremos se lee como una caída y no
 * como un recorrido.
 */
function arco(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const largo = Math.hypot(dx, dy) || 1;
  const nx = -dy / largo;
  const ny = dx / largo;
  const sentido = ny > 0 ? -1 : 1;
  const cx = (x1 + x2) / 2 + nx * largo * CURVA * sentido;
  const cy = (y1 + y2) / 2 + ny * largo * CURVA * sentido;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(
    1,
  )} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

const casa = { x: aX(studio.lon), y: aY(studio.lat) };

const destinos = clients
  .filter((c) => c.city !== studio.city)
  .map((c) => ({ ...c, d: arco(casa.x, casa.y, aX(c.lon), aY(c.lat)) }));

export function ClientsMap() {
  const { clientsMap } = useCopy();
  const locale = useLocale();
  const scope = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<string | null>(null);

  /** Las ciudades agrupadas por país, en el orden en que están cargadas. */
  const paises = useMemo(() => {
    const mapa = new Map<string, string[]>();
    for (const c of clients) {
      const ciudades = mapa.get(c.country) ?? [];
      ciudades.push(c.city);
      mapa.set(c.country, ciudades);
    }
    return [...mapa].map(([pais, ciudades]) => ({ pais, ciudades }));
  }, []);

  useGSAP(
    () => {
      registerGsap();
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const linea = gsap.utils.toArray<SVGPathElement>("[data-arco]", root);

        // Cada línea se dibuja sola, de Buenos Aires hacia afuera. El largo lo
        // mide el navegador y no una cuenta a mano: son curvas distintas y con
        // un dash fijo las cortas terminarían antes de empezar.
        linea.forEach((path) => {
          const largo = path.getTotalLength();
          gsap.set(path, { strokeDasharray: largo, strokeDashoffset: largo });
        });

        gsap.to(linea, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          stagger: 0.09,
          scrollTrigger: { trigger: root, start: START, once: true },
        });

        gsap.from(gsap.utils.toArray("[data-pin]", root), {
          opacity: 0,
          scale: 0.4,
          duration: 0.5,
          ease,
          stagger: 0.09,
          delay: 0.55,
          scrollTrigger: { trigger: root, start: START, once: true },
        });

        gsap.from(root.querySelectorAll("[data-tierra]"), {
          opacity: 0,
          duration: 0.9,
          ease,
          scrollTrigger: { trigger: root, start: START, once: true },
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Section id="clientes">
      <SectionHead
        icon="globo"
        eyebrow={clientsMap.eyebrow}
        title={clientsMap.title}
        lead={fill(clientsMap.note, { count: paises.length })}
      />

      <div
        ref={scope}
        className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center lg:gap-12"
      >
        <Reveal>
          <div
            className="relative w-full"
            style={{ aspectRatio: `${VISTA.ancho} / ${VISTA.alto}` }}
          >
            <svg
              viewBox={`${VISTA.x} ${VISTA.y} ${VISTA.ancho} ${VISTA.alto}`}
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              {/* La tierra es fondo: tinta muy bajada, sin borde. Si lleva
                  contorno compite con las líneas, que son lo que se mira. */}
              <path
                data-tierra
                d={TIERRA}
                className="fill-ink/[0.13]"
                fillRule="evenodd"
              />

              <g fill="none" strokeLinecap="round">
                {destinos.map((c) => (
                  <path
                    key={c.city}
                    data-arco
                    d={c.d}
                    className={cn(
                      "stroke-aqua-deep transition-opacity duration-300",
                      activo && activo !== c.country
                        ? "opacity-20"
                        : "opacity-60",
                    )}
                    strokeWidth={activo === c.country ? 2.4 : 1.6}
                  />
                ))}
              </g>
            </svg>

            {/* Los pines van en HTML y no en el SVG para poder usar la
                tipografía y las transiciones del sitio.

                Son decorativos, y no por comodidad: eran botones y no se podían
                tocar. En un teléfono el mapa entero mide 350px, así que Buenos
                Aires y Montevideo quedan con los centros a 2px, Madrid y
                Barcelona a 6. Diez pares por debajo de los 44px. Con botones de
                28px encimados, tocar uno es tocar el de al lado —medido: el
                navegador ni siquiera deja llegar al primero, otro pin le come el
                evento— y en desktop pasa igual, porque las distancias escalan
                junto con el mapa.

                Así que el control es la lista de abajo, que tiene una fila por
                país, no se pisa con nada y se puede tocar. El mapa muestra el
                alcance; los nombres los pone la lista. */}
            {clients.map((c) => {
              const encendido = activo === c.country;
              return (
                <span
                  key={c.city}
                  data-pin
                  aria-hidden
                  className="pointer-events-none absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                  style={{
                    left: `${porcentajeX(c.lon)}%`,
                    top: `${porcentajeY(c.lat)}%`,
                  }}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute rounded-full bg-aqua transition-all duration-300",
                      encendido
                        ? "h-[18px] w-[18px] opacity-45 md:h-6 md:w-6"
                        : "h-3 w-3 opacity-30 md:h-[18px] md:w-[18px]",
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "relative rounded-full bg-aqua-deep ring-2 ring-paper transition-all duration-300",
                      encendido
                        ? "h-2 w-2 md:h-[9px] md:w-[9px]"
                        : "h-1.5 w-1.5 md:h-[7px] md:w-[7px]",
                    )}
                  />
                </span>
              );
            })}

            {/* La casa. Va marcada distinto porque no es un destino más: es de
                donde salen todas las líneas, y el titular de la sección la
                nombra. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${porcentajeX(studio.lon)}%`,
                top: `${porcentajeY(studio.lat)}%`,
              }}
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-aqua-deep ring-[3px] ring-paper md:h-3 md:w-3" />
              <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[0.72rem] font-medium tracking-[-0.01em] text-ink-soft">
                {studio.city}
              </span>
            </span>
          </div>
        </Reveal>

        {/* La lista. Es la parte legible del dato —el mapa muestra el alcance,
            acá están los nombres— y también es el control: encender un país en
            el mapa se hace desde acá y no desde el mapa, por lo que explica la
            nota de los pines.

            Cada fila es un botón y no un li con hover. El hover no existe en un
            teléfono, así que la sección entera no respondía a nada: ni el mapa,
            que estaba encimado, ni la lista, que esperaba un mouse. Con un
            botón se toca; el hover se sigue atendiendo aparte para que en
            escritorio pasar por encima siga alcanzando, sin obligar a hacer
            clic. */}
        <Reveal delay={0.1}>
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-1 lg:gap-x-0">
            {paises.map(({ pais, ciudades }) => (
              <li key={pais} className="border-t border-line">
                <button
                  type="button"
                  /* El pointerType distingue el dedo del mouse: sin eso, en un
                     teléfono el toque dispara también el enter y el leave, y el
                     país se enciende y se apaga en el mismo gesto. */
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "touch") setActivo(pais);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== "touch") setActivo(null);
                  }}
                  onFocus={() => setActivo(pais)}
                  onBlur={() => setActivo(null)}
                  /* Enciende, no alterna. Alternaba, y con el dedo no servía:
                     el toque da el foco antes del click, así que onFocus
                     prendía el país y el click —viendo que ya estaba
                     prendido— lo apagaba. Un gesto, cero cambios. Medido:
                     aria-pressed quedaba en false después de tocar.

                     Apagar tampoco hace falta. Esto resalta un país, no es
                     una casilla: se toca otro y listo, y al salir del botón
                     el blur limpia. */
                  onClick={() => setActivo(pais)}
                  aria-pressed={activo === pais}
                  className={cn(
                    "block w-full py-3 text-left transition-opacity duration-300",
                    activo && activo !== pais ? "opacity-45" : "opacity-100",
                  )}
                >
                  <span className="flex items-center gap-2 text-[0.95rem] font-medium tracking-[-0.015em]">
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-deep transition-transform duration-300",
                        activo === pais ? "scale-150" : "scale-100",
                      )}
                    />
                    {nombrePais(pais, locale)}
                  </span>
                  <span className="mt-0.5 block pl-3.5 text-[0.82rem] leading-snug text-ink-faint">
                    {ciudades.join(" · ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
