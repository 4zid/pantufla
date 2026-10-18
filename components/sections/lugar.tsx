"use client";

import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { CheckIcon, ScissorsIcon, TagIcon } from "@/components/ui/icons";
import { Section, type Surface } from "@/components/ui/section";
import { PaseFormulario } from "@/components/pase/pase-formulario";
import { PaseLugar } from "@/components/pase/pase-lugar";

/*
   Las medidas del pase acostado, en fracciones del hueco. Salen de la
   textura (public/pase, 1280 × 2000): las esquinas tienen 80px de radio, y
   las muescas del talón 44px de radio, a 1484px de arriba. Acostado, lo que
   era el alto del pase es el ancho del hueco.
*/
const ESQUINAS = "rounded-[4%/6.25%]";
const MUESCA = "left-[74.2%] w-[4.4%]";

/** Un cupón vecino de la tira: el contorno punteado, con su talón. */
function Vecino({ lado }: { lado: "izquierda" | "derecha" }) {
  return (
    <div
      aria-hidden
      className={`absolute top-0 hidden h-full w-full sm:block ${ESQUINAS} border-[1.5px] border-dashed border-on-ink/20 bg-on-ink/[0.035] ${
        lado === "izquierda"
          ? /* En dos columnas quedaría debajo del texto. */
            "right-[calc(100%+1.75rem)] lg:hidden"
          : "left-[calc(100%+1.75rem)]"
      }`}
    >
      <span className="absolute inset-y-[8%] left-[74.2%] border-l border-dashed border-on-ink/15" />
    </div>
  );
}

/**
 * El banner del pase, a mitad de la home: donde aterriza.
 *
 * Toda la sección está armada alrededor de un hueco. Es una tarjeta en la
 * tinta del tema con una tira de cupones punteados de punta a punta, y al
 * del medio le falta el suyo: en su lugar hay un recorte del color de la
 * página, con la forma exacta del pase acostado —las esquinas, y dos
 * pestañas que calzan en las muescas del talón—, la línea de corte con su
 * tijera y un halo tenue. El único color es el champagne del foil del pase,
 * en la línea de corte, la tijera y las tildes: el resto es la tinta. El pase que vino volando desde
 * la portada (components/pase) baja, se acuesta y calza ahí: es la pieza que
 * faltaba. Al lado (abajo en el teléfono), el formulario con nombre y mail.
 *
 * Antes era la última sección y el pase acompañaba toda la home hasta el
 * final, que era demasiado. A la mitad el vuelo es la mitad de largo y el
 * pase aterriza cuando todavía hay ganas de leerlo.
 *
 * El hueco no lleva Reveal a propósito: su entrada es el aterrizaje, y el
 * pase 3D mide el lugar para apoyarse, así que tiene que estar quieto. Sin
 * el vuelo —en el teléfono, con menos movimiento pedido o sin la portada—
 * el pase está ahí desde el principio. La tarjeta es la tinta y no un color
 * fijo: con la sección en oscuro se da vuelta y queda clara sobre la página
 * oscura, con el hueco oscuro.
 */
export function Lugar({ surface = "mist" }: { surface?: Surface }) {
  const { lugar } = useCopy();

  /*
     En escritorio son dos columnas: el texto y el formulario a la
     izquierda, el hueco a la derecha. Apilado era altísimo —el titular, la
     bajada, el hueco, el formulario y los puntos uno abajo del otro pasaban
     de una pantalla—, y así la sección mide lo que mide el texto. En el
     teléfono sigue apilado y el hueco queda entre la bajada y el
     formulario: primero se ve el pase, abajo se dejan los datos. La grilla
     de lg ubica las tres partes sin cambiar el orden del documento.
  */
  return (
    <Section id="lugar" surface={surface} ritmo="compacto">
      <div
        data-pase-zona="banner"
        className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-center text-on-ink sm:px-12 md:rounded-[2.5rem] md:px-14 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-16 lg:py-16 lg:text-left xl:px-16"
      >
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-on-ink/15 bg-on-ink/[0.06] px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-on-ink/75">
              <TagIcon className="h-3.5 w-3.5 shrink-0" />
              {lugar.eyebrow}
            </span>
          </Reveal>
          <SplitHeading
            text={lugar.title}
            className="mx-auto mt-5 max-w-[14em] text-h2 lg:mx-0"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-4 max-w-[32rem] text-lead text-on-ink/70 lg:mx-0 lg:max-w-[28rem]">
              {lugar.lead}
            </p>
          </Reveal>
        </div>

        {/* La tira de cupones y el hueco. El contenedor mide lo que el hueco:
            los vecinos y el halo se ubican desde él y la tarjeta los corta. */}
        <div className="relative mx-auto mt-10 w-full max-w-[17rem] sm:max-w-[22rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:w-[22rem] lg:self-center xl:w-[24rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#e6d7bb,transparent)] opacity-25 blur-3xl"
          />
          <Vecino lado="izquierda" />
          <Vecino lado="derecha" />

          {/* La línea de corte, con la tijera encima. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-2.5 rounded-[calc(4%+10px)/calc(6.25%+10px)] border-[1.5px] border-dashed border-[#c8ae84]/60"
          >
            <ScissorsIcon className="absolute -top-[9px] left-7 h-4 w-4 bg-ink text-[#c8ae84]" />
          </div>

          {/* El recorte: el color de la página, con un poco de sombra
              adentro para que se lea como hueco y no como tarjeta. */}
          <div
            aria-hidden
            className={`absolute inset-0 ${ESQUINAS} bg-[var(--page-bg)] shadow-[inset_0_3px_16px_rgba(0,0,0,0.3)]`}
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-dashed border-line-strong px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-faint">
              {lugar.hueco}
            </span>
          </div>

          {/* Las pestañas: la tarjeta entra en las dos muescas del talón. */}
          <span
            aria-hidden
            className={`absolute top-0 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ${MUESCA}`}
          />
          <span
            aria-hidden
            className={`absolute bottom-0 aspect-square -translate-x-1/2 translate-y-1/2 rounded-full bg-ink ${MUESCA}`}
          />

          <PaseLugar
            origen="banner"
            acostado
            sizes="(min-width: 1280px) 250px, (min-width: 640px) 230px, 180px"
            className="w-full"
          />
        </div>

        <div className="mx-auto mt-10 max-w-[34rem] lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-8 lg:self-start">
          <Reveal delay={0.1}>
            <PaseFormulario origen="banner" conNombre sobreTinta />
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[0.78rem] text-on-ink/60 lg:justify-start">
              {lugar.points.map((punto) => (
                <li key={punto} className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#c8ae84]" />
                  {punto}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
