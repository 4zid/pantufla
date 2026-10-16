"use client";

import { BoletoDorado } from "@/components/boleto/boleto-dorado";
import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { CheckIcon } from "@/components/ui/icons";
import { Section, type Surface } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";

/**
 * La última sección de la home: donde aterriza el boleto dorado.
 *
 * Va después del formulario de brief y es el otro camino, el corto: quien
 * llegó hasta el final sin escribir el brief puede dejar solo el mail y
 * guardarse un lugar en la agenda. El boleto que lo acompañó volando desde la
 * portada (boleto-vuelo.tsx) se acomoda en el lugar de la derecha, que tiene
 * el boleto de verdad.
 *
 * El boleto no lleva Reveal a propósito: su entrada es el aterrizaje. Sin el
 * vuelo —en el teléfono, con menos movimiento pedido o si la portada está
 * apagada— está ahí desde el principio.
 */
export function Lugar({ surface = "mist" }: { surface?: Surface }) {
  const { lugar } = useCopy();

  return (
    <Section id="lugar" surface={surface} className="py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <div className="max-w-xl">
          <Reveal>
            <Tag icon="etiqueta">{lugar.eyebrow}</Tag>
          </Reveal>
          <SplitHeading text={lugar.title} className="mt-5 text-h2" />
          <Reveal delay={0.15}>
            <p className="mt-5 text-lead text-ink-soft">{lugar.lead}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-8 space-y-3">
              {lugar.points.map((punto) => (
                <li key={punto} className="flex gap-3 text-[0.95rem]">
                  <CheckIcon className="mt-[5px] h-3.5 w-3.5 shrink-0 text-miel-deep" />
                  <span className="leading-relaxed text-ink-soft">{punto}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div
          data-boleto-lugar="cierre"
          className="w-full max-w-[29rem] justify-self-center lg:w-[29rem] lg:justify-self-end"
        >
          <BoletoDorado origen="cierre" />
        </div>
      </div>
    </Section>
  );
}
