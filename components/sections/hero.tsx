import { preload } from "react-dom";

import type { Surface } from "@/components/ui/section";
import { HeroBajada, HeroTitular } from "@/components/sections/hero-intro";
import {
  HeroCarrusel,
  type Diapositiva,
} from "@/components/sections/hero-carrusel";
import { HeroOnda } from "@/components/sections/hero-onda";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";

/**
 * El grano de arriba de la cinta, como en el diseño: ruido fractal en gris,
 * casi invisible (2%), que le saca el brillo plástico al degradé. Va como
 * una baldosa de SVG de fondo y no como un filtro sobre toda la sección: un
 * filtro de 1440×900 se vuelve a calcular cada vez que algo se mueve encima,
 * y la baldosa se dibuja una vez y se repite.
 */
const GRANO = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>',
)}")`;

/**
 * La portada, del diseño de Claude Design (Pantufla_Hero.html).
 *
 * Una pantalla entera en escritorio: la pastilla y el titular arriba a la
 * izquierda, la bajada con los botones abajo a la izquierda y el carrusel de
 * proyectos abajo a la derecha. Atrás, la cinta de colores (hero-onda), un
 * brillo blanco desde arriba y el grano.
 *
 * El marco mide hasta 1440 y deja 64px a cada lado, que es el margen del
 * diseño; la barra de arriba usa el mismo (ver site-header), así el logo cae
 * justo encima de la pastilla.
 *
 * Abajo de xl las dos mitades de abajo no entran una al lado de la otra
 * (necesitan 1124px) y van apiladas: la bajada y, debajo, el carrusel. En el
 * teléfono todo corre seguido, sin repartir la pantalla, como en el marco de
 * 390 del diseño.
 *
 * Entra sin JavaScript: la pastilla, el titular, la bajada y los botones
 * tienen su entrada de CSS (ver globals.css). La cinta y el carrusel llegan
 * con el JS; la cinta con un fundido, para no aparecer de golpe.
 */
export function Hero({
  surface = "mist",
  projects,
}: {
  surface?: Surface;
  projects: SanityProject[];
}) {
  /* La itálica solo existe acá, así que la precarga la pide el hero y no el
     layout: las demás páginas no la bajan. */
  preload("/fonts/newsreader-italic-latin-v1.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  /*
     Las tarjetas: los proyectos con caso. La imagen es la de redes si hay
     (está pensada para un recorte apaisado y la tarjeta es de 16:10) y si
     no, la portada.
  */
  const diapositivas: Diapositiva[] = projects
    .filter((p) => p.conCaso)
    .flatMap((p) => {
      const imagen = urlForImage(p.social ?? p.cover)
        ?.width(1200)
        .url();
      return imagen
        ? [{ id: p._id, titulo: p.title, slug: p.slug, imagen }]
        : [];
    });

  return (
    <section
      data-surface={surface}
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(140%_60%_at_50%_0%,rgba(255,255,255,0.75)_0%,transparent_55%)] md:bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.75)_0%,transparent_55%)]"
      />
      <HeroOnda />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] opacity-[0.0225]"
        style={{ backgroundImage: GRANO, backgroundSize: "200px 200px" }}
      />

      <div className="mx-auto flex w-full max-w-[90rem] flex-col px-5 pb-6 pt-[104px] md:min-h-svh md:px-8 md:pb-12 md:pt-[150px] xl:px-16 xl:pb-16">
        <HeroTitular />

        <div className="mt-5 flex flex-col gap-9 md:mt-auto md:gap-12 md:pt-14 xl:flex-row xl:items-end xl:justify-between">
          <HeroBajada />
          {diapositivas.length ? (
            <div
              data-entra
              style={{ "--entra": "0.6s" } as React.CSSProperties}
              className="w-full xl:w-auto"
            >
              <HeroCarrusel diapositivas={diapositivas} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
