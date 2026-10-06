"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { useCopy, useHref } from "@/components/copy-provider";
import { ArrowIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type Diapositiva = {
  id: string;
  titulo: string;
  slug: string;
  imagen: string;
};

/** Lo que tarda en pasar solo al siguiente, igual que en el diseño. */
const ESPERA = 4500;
/** Lo que dura el corrimiento de una tarjeta a la otra. */
const CORRIMIENTO = 700;

const dosCifras = (n: number) => String(n).padStart(2, "0");

/**
 * El carrusel del hero: los proyectos con caso escrito, en tarjetas que
 * corren solas de a una.
 *
 * Muestra los que tienen caso y no todos porque son los únicos con mockups
 * de verdad: las portadas de los demás son imágenes de relleno, y en el
 * hero, que es lo primero que se ve, una tarjeta con una mancha de color
 * dice «todavía no hay trabajo para mostrar». Cada tarjeta lleva a su caso.
 * Un proyecto con caso nuevo entra solo.
 *
 * Es un riel sin fin: la lista va dos veces seguidas y, cuando el corrimiento
 * llega a la copia, salta sin animación al original, que es idéntico. Hacia
 * atrás es al revés: desde el primero salta a la copia y de ahí corre.
 *
 * Avanza solo cada 4,5 s, y la barra de abajo es el reloj: el paso lo dispara
 * el final de su animación, así que pausar la barra pausa el carrusel sin un
 * segundo temporizador que mantener a la par. Se pausa con el mouse encima,
 * con el foco adentro y fuera de pantalla. Si alguien usa las flechas deja de
 * avanzar solo —tomó el control—, como los testimonios cuando se elige una
 * cara, y recién ahí anuncia cada cambio al lector de pantalla. Con menos
 * movimiento pedido no avanza solo nunca y las tarjetas no se deslizan.
 *
 * Desde la tablet mide dos tarjetas, como en el diseño, aunque haya lugar
 * para más: con dos proyectos, una tercera tarjeta a la vista sería la
 * primera repetida.
 *
 * El recorte es overflow-clip y no hidden: hidden arma un contenedor con
 * scroll, y al tabular a una tarjeta que no se ve el navegador lo
 * scrolleaba por su cuenta, por fuera del corrimiento, y lo desarmaba.
 */
export function HeroCarrusel({
  diapositivas,
}: {
  diapositivas: Diapositiva[];
}) {
  const { hero, work } = useCopy();
  const href = useHref();
  const n = diapositivas.length;

  const raiz = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [animado, setAnimado] = useState(true);
  const [vuelta, setVuelta] = useState(0);
  const [solo, setSolo] = useState(true);
  const [quieto, setQuieto] = useState(false);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [aLaVista, setALaVista] = useState(true);
  const salto = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const leer = () => setQuieto(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const vista = new IntersectionObserver(([e]) =>
      setALaVista(e.isIntersecting),
    );
    vista.observe(el);
    return () => vista.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(salto.current), []);

  if (n === 0) return null;

  /* Saltar sin animación y, en el cuadro siguiente, devolverle la
     animación: el doble requestAnimationFrame asegura que el navegador
     pintó la posición nueva antes de volver a transicionar. */
  const saltarA = (destino: number, despues?: number) => {
    setAnimado(false);
    setPos(destino);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setAnimado(true);
        if (despues !== undefined) setPos(despues);
      }),
    );
  };

  const correr = (dir: 1 | -1) => {
    window.clearTimeout(salto.current);
    setVuelta((v) => v + 1);
    if (dir > 0) {
      const sig = pos + 1;
      setAnimado(true);
      setPos(sig);
      if (sig >= n) {
        salto.current = window.setTimeout(
          () => saltarA(0),
          quieto ? 0 : CORRIMIENTO + 20,
        );
      }
    } else if (pos === 0) {
      saltarA(n, n - 1);
    } else {
      setAnimado(true);
      setPos(pos - 1);
    }
  };

  const tomarControl = (dir: 1 | -1) => {
    setSolo(false);
    correr(dir);
  };

  const actual = pos % n;
  const avanzaSolo = solo && !quieto && n > 1;
  const pausado = encima || foco || !aLaVista;
  /* La lista dos veces, para el salto sin costura. Con una sola tarjeta no
     hay riel. */
  const tarjetas = n > 1 ? [...diapositivas, ...diapositivas] : diapositivas;

  return (
    <div
      ref={raiz}
      role="region"
      aria-roledescription="carrusel"
      aria-label={hero.carousel.label}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      onFocus={() => setFoco(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFoco(false);
        }
      }}
      className="w-full [--gap:12px] [--tarjeta:290px] md:w-[616px] md:[--gap:16px] md:[--tarjeta:300px] xl:shrink-0"
    >
      <div className="overflow-clip">
        <ul
          className={cn(
            "flex gap-[var(--gap)]",
            animado &&
              !quieto &&
              "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
          )}
          style={
            {
              transform: `translateX(calc(${pos} * (var(--tarjeta) + var(--gap)) * -1))`,
            } as CSSProperties
          }
        >
          {tarjetas.map((d, i) => {
            const copia = i >= n;
            return (
              <li
                key={`${d.id}-${i}`}
                aria-hidden={copia || undefined}
                inert={copia || undefined}
                className="w-[var(--tarjeta)] shrink-0"
              >
                <Link
                  href={href(`/proyectos/${d.slug}`)}
                  aria-label={`${work.readCase}: ${d.titulo}`}
                  onFocus={() => {
                    if (i !== pos) {
                      setSolo(false);
                      setAnimado(true);
                      setPos(i);
                    }
                  }}
                  className="group/tarjeta relative block aspect-[300/188] overflow-hidden rounded-2xl bg-card shadow-[inset_0_0_0_1px_rgba(17,24,60,0.06)]"
                >
                  <Image
                    src={d.imagen}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 300px, 290px"
                    className="object-cover transition-transform duration-500 ease-out group-hover/tarjeta:scale-[1.03] motion-reduce:transition-none"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {n > 1 ? (
        <div className="mt-4 flex items-center gap-4 md:mt-5 md:gap-5">
          <div className="flex gap-2">
            {(
              [
                [-1, hero.carousel.prev],
                [1, hero.carousel.next],
              ] as const
            ).map(([dir, etiqueta]) => (
              <button
                key={dir}
                type="button"
                aria-label={etiqueta}
                onClick={() => tomarControl(dir)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-card text-ink transition-colors hover:border-ink md:h-9 md:w-9"
              >
                <ArrowIcon
                  className={cn("h-4 w-4", dir < 0 && "-scale-x-100")}
                />
              </button>
            ))}
          </div>

          {/* El reloj. Corriendo solo, se llena en 4,5 s y al llenarse pasa
              a la siguiente; quieto, marca por dónde va la lista. */}
          <div className="relative h-px flex-1 overflow-hidden bg-line-strong">
            {avanzaSolo ? (
              <span
                key={vuelta}
                aria-hidden
                onAnimationEnd={() => correr(1)}
                className="absolute inset-0 origin-left bg-ink"
                style={{
                  animation: `barra ${ESPERA}ms linear forwards`,
                  animationPlayState: pausado ? "paused" : "running",
                }}
              />
            ) : (
              <span
                aria-hidden
                className="absolute inset-0 origin-left bg-ink transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{ transform: `scaleX(${(actual + 1) / n})` }}
              />
            )}
          </div>

          <p
            aria-hidden
            className="whitespace-nowrap text-[0.8125rem] tabular-nums tracking-[0.02em] text-ink-faint"
          >
            <span className="text-ink">{dosCifras(actual + 1)}</span> /{" "}
            {dosCifras(n)}
          </p>

          {/* Lo que oye el lector de pantalla, recién cuando alguien usa
              las flechas: anunciar cada paso automático sería una voz que
              no para mientras se lee el resto. */}
          <p className="sr-only" aria-live={solo ? "off" : "polite"}>
            {`${diapositivas[actual].titulo}, ${actual + 1} / ${n}`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
