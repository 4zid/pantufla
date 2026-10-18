"use client";

import type { Surface } from "@/components/ui/section";

import { Reveal } from "@/components/motion/reveal";
import { socialProof } from "@/content/site";
import { useCopy } from "@/components/copy-provider";
import { RielPausable } from "@/components/ui/riel-pausable";

/**
 * Tira de prueba social, justo debajo del hero.
 *
 * Va angosta y sin reglas: es un apoyo, no una sección. Si respira como las
 * demás compite con el titular, que es lo último que conviene a dos
 * centímetros del hero.
 *
 * Comparte el color del hero a propósito. Con un fondo propio quedaba una
 * banda distinta justo debajo y se leía como que el hero terminaba de golpe;
 * con el mismo, el hero se hunde en la tira y lo que separa las dos cosas es
 * el aire, no una línea de color. Las reglas sobraban por lo mismo.
 *
 * Son solo los logos, de punta a punta de la pantalla. Antes tenía a la
 * izquierda las caras del estudio y una frase; sin esa columna el riel no
 * arranca cortado contra un divisor —se veía la mitad de un logo saliendo de
 * atrás de la línea— y la tira dice una sola cosa: para quién trabajamos.
 *
 * Las marcas corren en un riel y no quietas en fila. Quietas, la fila mide
 * lo que suman los logos y deja un hueco al final que cambia con cada cliente
 * que se suma. Moviéndose, la tira no tiene largo fijo —siempre está llena—
 * y además se lee como una lista que sigue, que es exactamente lo que se
 * quiere decir. La mecánica del empalme está explicada en globals.css.
 *
 * Los logos no son <img>: son una máscara pintada con currentColor (ver
 * .logo-cliente en globals.css). Una imagen guarda su color y quedaría igual
 * cuando la página pasa a oscuro; la máscara toma la tinta del tema y cambia
 * con ella, igual que el texto que reemplaza.
 */

/**
 * Cuántas veces se repite la lista en cada mitad de la pista.
 *
 * Siete marcas miden unos 1010px. Con una sola pasada por mitad, a mitad de
 * la animación el final de la pista entra en pantalla y queda un hueco. Tres
 * pasadas dan unos 3000px por mitad, que tapa el hueco hasta en pantallas de
 * 2560.
 */
const REPES = 3;

/**
 * Cuánto tarda la pista en correr media vuelta.
 *
 * La animación mueve la mitad de la pista en este tiempo, así que cada marca
 * nueva la alarga y, con el mismo tiempo, la acelera. El tiempo crece con la
 * pista para que el riel vaya siempre a unos 58px por segundo: con cinco
 * marcas eran 34s, con seis 42s y con siete, ya con el logo de Acacia en vez
 * de su nombre escrito, 52s. Con la tira a lo ancho los logos se separaron
 * un poco más (56px en vez de 48) y una pasada mide unos 1068px: 55s. Si se
 * suma otra marca o se cambia un logo, la cuenta es la misma: el ancho de una
 * pasada sobre 58, por tres.
 */
const DURACION = "55s";

/**
 * Cuánta superficie ocupa cada logo, en píxeles cuadrados, y hasta qué alto.
 *
 * Igualar la altura deja una palabra larga enorme al lado de una marca
 * cuadrada que casi no se ve; igualar la superficie los pone a pesar parecido.
 * El tope existe para la cuadrada: con la misma superficie que una palabra
 * mediría el doble de alto que el resto de la tira.
 */
const SUPERFICIE = 2600;
const ALTO_MAXIMO = 30;

function medidas(proporcion: number, escala = 1) {
  const alto = Math.min(
    ALTO_MAXIMO,
    Math.sqrt((SUPERFICIE * escala) / proporcion),
  );
  return { width: Math.round(alto * proporcion), height: Math.round(alto) };
}

export function SocialProof({ surface = "mist" }: { surface?: Surface }) {
  const copy = useCopy();
  const marcas = socialProof.brands;

  return (
    <section
      aria-label={copy.socialProof.label}
      data-surface={surface}
      className="relative"
    >
      <Reveal className="relative z-10 py-8 lg:py-10">
        {/*
          El riel. La lista real la anuncia el lector de pantalla una sola vez;
          las copias de más existen para que el empalme no se vea y van
          escondidas.
        */}
        <RielPausable className="w-full">
          <div
            className="ticker w-full overflow-hidden"
            style={{ "--ticker-fade": "6rem" } as React.CSSProperties}
          >
            <ul
              className="ticker-track items-center"
              style={{ "--ticker-duration": DURACION } as React.CSSProperties}
            >
              {Array.from({ length: REPES * 2 }).map((_, copia) =>
                marcas.map((marca) => (
                  <li
                    key={`${copia}-${marca.name}`}
                    aria-hidden={copia > 0 || undefined}
                    translate="no"
                    className="flex items-center whitespace-nowrap pr-14 text-[1.05rem] font-semibold tracking-[-0.03em] text-ink-soft"
                  >
                    {marca.logo ? (
                      <span
                        role="img"
                        aria-label={marca.name}
                        className="logo-cliente"
                        style={
                          {
                            ...medidas(marca.proporcion, marca.escala),
                            "--logo": `url(${marca.logo})`,
                          } as React.CSSProperties
                        }
                      />
                    ) : (
                      marca.name
                    )}
                  </li>
                )),
              )}
            </ul>
          </div>
        </RielPausable>
      </Reveal>
    </section>
  );
}
