import { pantallasDeRespaldo } from "@/content/hero-galeria";
import { urlForImage } from "@/sanity/image";
import type { SanityProject } from "@/sanity/types";

/*
   Sin texto alternativo: en la tarjeta las capturas son decorado del enlace,
   que ya dice qué proyecto es (ver proyecto-tarjeta.tsx).
*/
export type PantallaMockup = {
  src: string;
  ancho: number;
  alto: number;
};

/**
 * Lo que dibuja la tarjeta de un proyecto: una ventana de escritorio y, si
 * hay, un teléfono encima.
 *
 * Sin pantallas, la ventana queda con el nombre del proyecto adentro: es un
 * mockup honesto, no una captura inventada.
 */
export type Mockup = {
  escritorio?: PantallaMockup;
  telefono?: PantallaMockup;
};

/* La ventana de la tarjeta es 16:10: de las capturas de escritorio entra la
   que más se le parece, así el recorte se come lo menos posible. */
const VENTANA = 16 / 10;

function masParecida<T extends { ancho: number; alto: number }>(lista: T[]) {
  return [...lista].sort(
    (a, b) =>
      Math.abs(a.ancho / a.alto - VENTANA) -
      Math.abs(b.ancho / b.alto - VENTANA),
  )[0];
}

/**
 * El mockup de un proyecto, de lo más propio a lo más genérico:
 *
 * 1. Sus pantallas de Sanity («Pantallas para la portada»), las mismas que
 *    corren en el hero: de ahí sale la de escritorio que mejor entra en la
 *    ventana y el primer teléfono.
 * 2. Las mismas pantallas en local (content/hero-galeria.ts), para cuando
 *    Sanity no contesta o el proyecto viene del respaldo.
 *
 * La portada no entra, aunque esté: es una imagen compuesta —un mockup con
 * sus propios marcos, o una ilustración (las de Lupa, Rostar y Acacia son
 * fondos negros con un brillo)— y adentro de una ventana de navegador se
 * leería como un sitio roto. Tampoco el arte de relleno de /public/proyectos.
 * Para que la tarjeta de un proyecto tenga capturas alcanza con cargarle
 * pantallas, que de paso lo suman a la galería del hero.
 */
export function mockupDe(proyecto: SanityProject): Mockup {
  const deSanity = (proyecto.pantallas ?? []).flatMap((p) => {
    const d = p.dimensiones;
    const movil = p.formato === "mobile";
    const src = urlForImage(p)
      ?.width(movil ? 420 : 1200)
      .url();
    if (!src || !d?.width || !d.height) return [];
    return [
      {
        movil,
        src,
        ancho: d.width,
        alto: d.height,
      },
    ];
  });

  const pantallas = deSanity.length
    ? deSanity
    : pantallasDeRespaldo
        .filter((p) => p.proyecto === proyecto.slug)
        .map((p) => ({ ...p, movil: p.formato === "mobile" }));

  const escritorios = pantallas.filter((p) => !p.movil);
  const telefono = pantallas.find((p) => p.movil);
  const sinMarca = (p?: PantallaMockup & { movil: boolean }) =>
    p ? { src: p.src, ancho: p.ancho, alto: p.alto } : undefined;

  return {
    escritorio: escritorios.length
      ? sinMarca(masParecida(escritorios))
      : undefined,
    telefono: sinMarca(telefono),
  };
}

/** El dominio del sitio publicado, para la barra de la ventana. */
export function dominioDe(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
