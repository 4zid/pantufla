"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { ControlGlobo } from "@/components/sections/globo-3d";
import { RielPausable } from "@/components/ui/riel-pausable";
import {
  DIAMETRO_VISIBLE,
  VISTA_INICIAL,
  giroPara,
  inclinacionPara,
  proyectar,
} from "@/lib/globo";
import { cn } from "@/lib/cn";
import { sePuede3d } from "@/lib/webgl";

export type PaisGlobo = {
  /** La clave del país, en español (content/site.ts). */
  pais: string;
  /** Lo que dice la marca, ya en el idioma de la página. */
  nombre: string;
  lon: number;
  lat: number;
};

/* Dónde cae cada marca con el globo quieto: es la vista de la imagen de
   respaldo y del primer cuadro del 3D. */
const GIRO_INICIAL = giroPara(VISTA_INICIAL.lon);
const INCLINACION_INICIAL = inclinacionPara(VISTA_INICIAL.lat);

/** El círculo del globo dentro del cuadro, para el grano de la imagen. */
const MARGEN = `${(((1 - DIAMETRO_VISIBLE) / 2) * 100).toFixed(2)}%`;

/**
 * El grano de la imagen quieta: ruido fractal en gris, repetido. El 3D lo
 * dibuja en el shader; la imagen lo trae aparte porque el ruido no se
 * comprime y horneado la haría pesar el triple.
 */
const GRANO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E")`;

/**
 * El globo de «Dónde trabajamos»: blanco y negro, girando despacio, con los
 * países donde trabajamos en tinta y una marca con el nombre de cada uno.
 *
 * Primero es una imagen: el mismo globo quieto (public/globo, sacada del 3D
 * con scripts/generar-globo-imagen.mjs), con las marcas ubicadas encima con
 * la misma cuenta que usa el 3D (lib/globo.ts). Es lo que se ve sin
 * JavaScript, sin WebGL, con una placa por software o con menos movimiento
 * pedido. Con el tema oscuro la imagen se invierte, que en blanco y negro da
 * el globo oscuro.
 *
 * Cuando la sección se acerca a la pantalla y el navegador está libre, se baja
 * la escena (globo-3d.ts, con Three.js, que es el mismo paquete del pase) y
 * el globo empieza a girar. El primer cuadro es igual a la imagen, así el
 * cambio no se ve.
 *
 * Se mueve solo, así que se puede frenar como los rieles (RielPausable): con
 * el mouse encima, con un toque, con el foco adentro o con el botón del
 * teclado. Y `activo` —el país que se señala en la lista de al lado— lo
 * hace girar hasta ponerlo de frente y lo deja ahí.
 */
export function Globo({
  paises,
  activo,
  className,
}: {
  paises: PaisGlobo[];
  activo: string | null;
  className?: string;
}) {
  const caja = useRef<HTMLDivElement>(null);
  const marcas = useRef<(HTMLSpanElement | null)[]>([]);
  const control = useRef<ControlGlobo | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let vivo = true;
    let espera = 0;
    const conIdle = "requestIdleCallback" in window;

    const arrancar = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!sePuede3d("globo3d").si) return;
      try {
        const { montarGlobo } = await import("@/components/sections/globo-3d");
        if (!vivo) return;
        const riel = el.closest<HTMLElement>("[data-riel]");
        control.current = montarGlobo({
          contenedor: el,
          marcas: paises.flatMap((p, i) => {
            const m = marcas.current[i];
            return m ? [{ lon: p.lon, lat: p.lat, el: m }] : [];
          }),
          quieto: () =>
            !!riel?.matches(":hover, :focus-within, [data-pausado]"),
          alListo: () => setListo(true),
          conGrano:
            new URLSearchParams(window.location.search).get("globo3d") !==
            "limpio",
        });
      } catch (error) {
        console.warn("[globo] sin 3D:", error);
      }
    };

    /* Se baja cuando falta poco para llegar, no con la página: es la mitad
       de abajo de la home y Three.js pesa. */
    const cerca = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        cerca.disconnect();
        espera = conIdle
          ? window.requestIdleCallback(() => void arrancar(), { timeout: 2000 })
          : window.setTimeout(() => void arrancar(), 300);
      },
      { rootMargin: "600px 0px" },
    );
    cerca.observe(el);

    return () => {
      vivo = false;
      cerca.disconnect();
      if (conIdle) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
      control.current?.destruir();
      control.current = null;
    };
  }, [paises]);

  useEffect(() => {
    const p = paises.find((x) => x.pais === activo);
    control.current?.enfocar(p ? { lon: p.lon, lat: p.lat } : null);
  }, [activo, paises]);

  return (
    <RielPausable className={cn("mx-auto w-full max-w-[32rem]", className)}>
      <div ref={caja} className="relative aspect-square w-full touch-pan-y">
        {/* Una sombra apenas, debajo: el globo se apoya, no flota. */}
        <span
          aria-hidden
          className="absolute inset-x-[18%] bottom-[1%] h-[6%] rounded-[50%] bg-ink/[0.07] blur-xl"
        />
        <Image
          src="/globo/globo.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 512px, 90vw"
          className={cn("globo-respaldo", listo && "opacity-0")}
        />
        {listo ? null : (
          <span
            aria-hidden
            className="absolute rounded-full opacity-[0.16]"
            style={{ inset: MARGEN, backgroundImage: GRANO }}
          />
        )}

        {paises.map((p, i) => {
          const quieto = proyectar(
            p.lon,
            p.lat,
            GIRO_INICIAL,
            INCLINACION_INICIAL,
          );
          const encendido = activo === p.pais;
          return (
            <span
              key={p.pais}
              ref={(m) => {
                marcas.current[i] = m;
              }}
              aria-hidden
              className="pointer-events-none absolute z-10"
              style={{
                left: `${quieto.x * 100}%`,
                top: `${quieto.y * 100}%`,
                opacity: quieto.frente,
              }}
            >
              <span
                className={cn(
                  "flex items-center transition-opacity duration-300",
                  activo && !encendido && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-paper-alt transition-transform duration-300",
                    encendido && "scale-150",
                  )}
                />
                <span
                  className={cn(
                    "ml-1 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.68rem] font-medium tracking-[-0.01em] shadow-[0_6px_16px_-10px_rgba(0,0,0,0.35)] transition-colors duration-300",
                    encendido
                      ? "border-ink bg-ink text-on-ink"
                      : "border-line bg-card text-ink",
                  )}
                >
                  {p.nombre}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </RielPausable>
  );
}
