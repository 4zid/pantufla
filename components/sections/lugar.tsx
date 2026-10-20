"use client";

import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
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

/**
 * El banner del pase, a mitad de la home: donde aterriza.
 *
 * Toda la sección está armada alrededor de un hueco. Es una tarjeta en la
 * tinta del tema con un recorte del color de la página, con la forma exacta
 * del pase acostado —las esquinas, y dos pestañas que calzan en las muescas
 * del talón— y la línea de corte punteada en blanco. El pase que vino
 * volando desde la portada (components/pase) baja, se acuesta y calza ahí:
 * es la pieza que faltaba. Ahí no responde al mouse (ver pase-3d.ts):
 * inclinado dejaría de calzar.
 *
 * Se lee en tres pasos, de arriba abajo: el título dice qué es (tomamos
 * pocos proyectos), la bajada qué hacer (dejar nombre y mail) y el
 * formulario lo hace, con una sola línea de letra chica. Tenía además una
 * etiqueta que repetía el título, una bajada de tres renglones, etiquetas
 * arriba de cada campo, tres tildes que repetían la letra chica y cupones
 * vecinos punteados a los costados del hueco: a la usuaria le pareció
 * cargadísimo y que no se entendía. Las tildes eran champagne, y tampoco.
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
     Centrada y apilada, pero contenida: el ritmo compacto, la tarjeta con
     menos relleno, el hueco un poco más chico y los saltos entre partes más
     cortos. Pasó por dos columnas —texto a la izquierda, hueco a la
     derecha— para que no fuera altísima, y se volvió: el hueco al medio es
     lo que hace que el pase se lea como la pieza que faltaba.
  */
  return (
    <Section id="lugar" surface={surface} ritmo="compacto">
      <div
        data-pase-zona="banner"
        className="relative rounded-[2rem] bg-ink px-6 pb-8 pt-12 text-center text-on-ink sm:px-12 md:rounded-[2.5rem] md:px-16 md:pb-10 md:pt-14"
      >
        <SplitHeading
          text={lugar.title}
          className="mx-auto max-w-[14em] text-h2"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-4 max-w-[30rem] text-lead text-on-ink/70">
            {lugar.lead}
          </p>
        </Reveal>

        {/* El hueco. El contenedor mide lo que mide el pase acostado. */}
        <div className="relative mx-auto mt-10 w-full max-w-[16rem] sm:max-w-[20rem] md:mt-12 lg:max-w-[22rem]">
          {/* La línea de corte: punteada y en el color del texto de la
              tarjeta, blanca sobre la tinta. Llevaba una tijera y era
              champagne; con el pase encima sobraban las dos cosas. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-2.5 rounded-[calc(4%+10px)/calc(6.25%+10px)] border-[1.5px] border-dashed border-on-ink/60"
          />

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
            sizes="(min-width: 1024px) 230px, (min-width: 640px) 210px, 170px"
            className="w-full"
          />
        </div>

        {/* Sin Reveal: el pase de la portada es un enlace que baja hasta acá
            (#lugar), y el salto deja el formulario justo en el borde de abajo
            de la pantalla, donde la entrada no llegaba a dispararse. Quien
            vino a reservar caía en un banner sin formulario. */}
        <PaseFormulario className="mx-auto mt-10 max-w-[36rem]" />
      </div>
    </Section>
  );
}
