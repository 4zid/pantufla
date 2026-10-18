import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { Pantalla } from "@/content/hero-galeria";
import { RielPausable } from "@/components/ui/riel-pausable";

/*
   Las tres formas de columna. Todas miden lo mismo de alto (--alto), que es
   lo que hace que el riel se lea como una sola franja aunque cada columna
   sea distinta:

   - pila: dos pantallas de escritorio, una arriba de la otra.
   - alto: un teléfono de alto entero.
   - grande: una pantalla de escritorio de alto entero, cuando queda una sola
     antes de un teléfono.

   Se arman proyecto por proyecto: dos pantallas apiladas son siempre del
   mismo, y la última de escritorio de un proyecto, si queda sola, va grande
   aunque el proyecto siguiente empiece con otra de escritorio.
*/
type Columna =
  | { tipo: "pila"; items: [Pantalla, Pantalla] }
  | { tipo: "alto"; item: Pantalla }
  | { tipo: "grande"; item: Pantalla };

function columnas(pantallas: Pantalla[]): Columna[] {
  const salida: Columna[] = [];
  for (let i = 0; i < pantallas.length;) {
    const actual = pantallas[i];
    const siguiente =
      pantallas[i + 1]?.proyecto === actual.proyecto
        ? pantallas[i + 1]
        : undefined;
    if (actual.formato === "mobile") {
      salida.push({ tipo: "alto", item: actual });
      i += 1;
    } else if (siguiente?.formato === "desktop") {
      salida.push({ tipo: "pila", items: [actual, siguiente] });
      i += 2;
    } else {
      salida.push({ tipo: "grande", item: actual });
      i += 1;
    }
  }
  return salida;
}

/*
   El ancho de cada columna sale de las proporciones de sus capturas, para
   que se vean enteras: es lo que la hace masonry y no una grilla de cajas
   iguales donde cada captura se recorta distinto.

   - El teléfono tiene un ancho fijo: todos los teléfonos iguales se leen
     como teléfonos, y una captura de otra proporción se recorta abajo.
   - La grande es tan ancha como pide su captura con el alto de la columna
     menos la barra del navegador.
   - En la pila, las dos capturas comparten el ancho y se reparten el alto
     según su proporción (ver flex en la pila): el ancho que hace que las
     dos entren justas es el alto disponible dividido por la suma de las
     inversas de sus proporciones.

   Las proporciones se acotan para que una captura rara (una página entera
   de largo, una tira finita) no deje una columna absurda: pasado el tope,
   se recorta.

   Todo va en calc() sobre --alto y --g, así sigue valiendo en los tres
   tamaños del riel. BARRA es lo que ocupa la ventana arriba de la captura:
   la barra de 18px más el borde de arriba y el de abajo; a los costados, el
   borde suma 2px.
*/
const BARRA = 20;
const TELEFONO = 0.47;
const PROPORCION_GRANDE = [1.3, 1.9] as const;
const PROPORCION_PILA = [1.2, 2.6] as const;

const proporcion = (p: Pantalla, [min, max]: readonly [number, number]) =>
  Math.min(max, Math.max(min, p.ancho / p.alto));

const fija = (n: number) => Number(n.toFixed(4));

/** El ancho de la columna en CSS, y en px con el alto de escritorio. */
function anchoDe(c: Columna, alto: number, g: number) {
  if (c.tipo === "alto") {
    return { css: `calc(var(--alto) * ${TELEFONO})`, px: alto * TELEFONO };
  }
  if (c.tipo === "grande") {
    const r = fija(proporcion(c.item, PROPORCION_GRANDE));
    return {
      css: `calc((var(--alto) - ${BARRA}px) * ${r} + 2px)`,
      px: (alto - BARRA) * r + 2,
    };
  }
  const m = fija(
    1 / c.items.reduce((s, p) => s + 1 / proporcion(p, PROPORCION_PILA), 0),
  );
  return {
    css: `calc((var(--alto) - var(--g) - ${2 * BARRA}px) * ${m} + 2px)`,
    px: (alto - g - 2 * BARRA) * m + 2,
  };
}

/*
   Los tres altos del riel (--alto) y su separación (--g), de chico a
   grande, para estimar el largo y para el sizes de cada imagen. Tienen que
   ser los mismos que las clases de la sección.
*/
const ALTOS = [
  { alto: 300, g: 12 },
  { alto: 400, g: 16, desde: 768 },
  { alto: 440, g: 16, desde: 1280 },
] as const;

/** Qué ancho pedirle a la imagen en cada tamaño del riel. */
function sizesDe(c: Columna, menos = 0) {
  return [...ALTOS]
    .reverse()
    .map((t) => {
      const px = Math.round(anchoDe(c, t.alto, t.g).px - menos);
      return "desde" in t ? `(min-width: ${t.desde}px) ${px}px` : `${px}px`;
    })
    .join(", ");
}

/*
   La duración sale del largo de la lista con el alto de escritorio, para
   que corra a la misma velocidad haya las pantallas que haya: unos 70px por
   segundo. A 40 tardaba más de dos minutos en dar la vuelta y se sentía
   quieta.
*/
const VELOCIDAD = 70;

/** Una pantalla de escritorio: la barra de una ventana y la captura abajo. */
function Escritorio({ p, sizes }: { p: Pantalla; sizes: string }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-card shadow-[0_22px_44px_-30px_rgba(17,24,60,0.45)]">
      <div
        aria-hidden
        className="flex h-[18px] shrink-0 items-center gap-[5px] border-b border-line px-2.5"
      >
        <i className="h-[6px] w-[6px] rounded-full bg-line-strong" />
        <i className="h-[6px] w-[6px] rounded-full bg-line-strong" />
        <i className="h-[6px] w-[6px] rounded-full bg-line-strong" />
      </div>
      <div className="relative min-h-0 flex-1">
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/** Un teléfono: el marco oscuro, la isla y la captura adentro. */
function Telefono({ p, sizes }: { p: Pantalla; sizes: string }) {
  return (
    <div className="h-full rounded-[30px] bg-[#101012] p-[5px] shadow-[0_22px_44px_-28px_rgba(17,24,60,0.55)]">
      <div className="relative h-full overflow-hidden rounded-[25px] bg-card">
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-[7px] h-[13px] w-[32%] -translate-x-1/2 rounded-full bg-[#101012]"
        />
      </div>
    </div>
  );
}

function Enlace({
  p,
  children,
  className,
  style,
}: {
  p: Pantalla;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  if (!p.href)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  return (
    <Link
      href={p.href}
      style={style}
      className={`${className ?? ""} block transition-transform duration-500 ease-out hover:-translate-y-1 motion-reduce:transition-none`}
    >
      {children}
    </Link>
  );
}

/**
 * La galería del hero: capturas de los proyectos, de escritorio y de
 * teléfono, en columnas tipo masonry que corren de derecha a izquierda como
 * un riel.
 *
 * Es un riel como los otros (ver .ticker en globals.css): la lista va dos
 * veces y la pista se corre la mitad de su ancho. Se frena con el mouse
 * encima, con el foco adentro, con un toque y con el botón del teclado
 * (RielPausable), y con menos movimiento pedido no corre.
 *
 * La copia de la lista es para el empalme y nada más: va escondida para el
 * lector de pantalla y fuera del orden del teclado.
 */
export function HeroGaleria({
  pantallas,
  label,
}: {
  pantallas: Pantalla[];
  label: string;
}) {
  if (!pantallas.length) return null;
  const cols = columnas(pantallas);

  const { alto, g } = ALTOS[ALTOS.length - 1];
  const largo = cols.reduce(
    (total, c) => total + anchoDe(c, alto, g).px + g,
    0,
  );
  const duracion = `${Math.max(30, Math.round(largo / VELOCIDAD))}s`;

  return (
    <RielPausable className="mt-16 md:mt-28">
      <section
        aria-label={label}
        className="ticker w-full overflow-hidden [--alto:300px] [--g:12px] md:[--alto:400px] md:[--g:16px] xl:[--alto:440px]"
        style={{ "--ticker-fade": "3rem" } as CSSProperties}
      >
        <ul
          className="ticker-track py-6"
          style={{ "--ticker-duration": duracion } as CSSProperties}
        >
          {[0, 1].map((copia) =>
            cols.map((c, i) => {
              const ancho = anchoDe(c, alto, g).css;
              return (
                <li
                  key={`${copia}-${i}`}
                  aria-hidden={copia === 1 || undefined}
                  inert={copia === 1 || undefined}
                  className="shrink-0 pr-[var(--g)]"
                >
                  {c.tipo === "pila" ? (
                    <div
                      className="flex flex-col gap-[var(--g)]"
                      style={{ width: ancho, height: "var(--alto)" }}
                    >
                      {/* Cada una crece según la inversa de su proporción
                          sobre la base de la barra: así las dos capturas
                          llenan el ancho de la columna justas. */}
                      {c.items.map((p) => (
                        <Enlace
                          key={p.id}
                          p={p}
                          className="min-h-0"
                          style={{
                            flex: `${fija(1 / proporcion(p, PROPORCION_PILA))} 1 ${BARRA}px`,
                          }}
                        >
                          <Escritorio p={p} sizes={sizesDe(c, 2)} />
                        </Enlace>
                      ))}
                    </div>
                  ) : (
                    <Enlace p={c.item} className="h-[var(--alto)]">
                      <div style={{ width: ancho, height: "var(--alto)" }}>
                        {c.tipo === "alto" ? (
                          <Telefono p={c.item} sizes={sizesDe(c, 10)} />
                        ) : (
                          <Escritorio p={c.item} sizes={sizesDe(c, 2)} />
                        )}
                      </div>
                    </Enlace>
                  )}
                </li>
              );
            }),
          )}
        </ul>
      </section>
    </RielPausable>
  );
}
