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
*/
type Columna =
  | { tipo: "pila"; items: [Pantalla, Pantalla] }
  | { tipo: "alto"; item: Pantalla }
  | { tipo: "grande"; item: Pantalla };

function columnas(pantallas: Pantalla[]): Columna[] {
  const salida: Columna[] = [];
  for (let i = 0; i < pantallas.length;) {
    const actual = pantallas[i];
    const siguiente = pantallas[i + 1];
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
   El ancho de cada columna en unidades de --alto, para estimar el largo del
   riel y darle una duración que mantenga la misma velocidad haya las
   pantallas que haya: unos 40px por segundo con el alto de escritorio.
*/
const ANCHO = { pila: 0.77, alto: 0.47, grande: 1.55 } as const;
const ALTO_ESCRITORIO = 440;
const VELOCIDAD = 40;

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
function Telefono({ p }: { p: Pantalla }) {
  return (
    <div className="h-full rounded-[30px] bg-[#101012] p-[5px] shadow-[0_22px_44px_-28px_rgba(17,24,60,0.55)]">
      <div className="relative h-full overflow-hidden rounded-[25px] bg-card">
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes="(min-width: 768px) 210px, 150px"
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
}: {
  p: Pantalla;
  children: React.ReactNode;
  className?: string;
}) {
  if (!p.href) return <div className={className}>{children}</div>;
  return (
    <Link
      href={p.href}
      className={`${className ?? ""} block transition-transform duration-500 ease-out hover:-translate-y-1 motion-reduce:transition-none`}
    >
      {children}
    </Link>
  );
}

/**
 * La galería del hero: capturas de sitios, de escritorio y de teléfono, en
 * columnas tipo masonry que corren de derecha a izquierda como un riel.
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

  const largo = cols.reduce(
    (total, c) => total + ANCHO[c.tipo] * ALTO_ESCRITORIO + 16,
    0,
  );
  const duracion = `${Math.max(30, Math.round(largo / VELOCIDAD))}s`;

  return (
    <RielPausable className="mt-14 md:mt-20">
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
              const ancho = `calc(var(--alto) * ${ANCHO[c.tipo]})`;
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
                      {c.items.map((p) => (
                        <Enlace key={p.id} p={p} className="min-h-0 flex-1">
                          <Escritorio
                            p={p}
                            sizes="(min-width: 1280px) 340px, (min-width: 768px) 310px, 230px"
                          />
                        </Enlace>
                      ))}
                    </div>
                  ) : (
                    <Enlace p={c.item} className="h-[var(--alto)]">
                      <div style={{ width: ancho, height: "var(--alto)" }}>
                        {c.tipo === "alto" ? (
                          <Telefono p={c.item} />
                        ) : (
                          <Escritorio
                            p={c.item}
                            sizes="(min-width: 1280px) 690px, (min-width: 768px) 620px, 470px"
                          />
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
