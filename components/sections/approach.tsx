"use client";

import { useCopy } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { ApproachArt } from "@/components/ui/approach-art";
import { Section, SectionHead, type Surface } from "@/components/ui/section";

export function Approach({ surface }: { surface?: Surface }) {
  const { approach } = useCopy();
  return (
    <Section id="metodo" surface={surface}>
      <SectionHead
        icon="ruta"
        eyebrow={approach.eyebrow}
        title={approach.title}
        lead={approach.lead}
      />

      {/*
        Filas anchas con el título a la izquierda y el desarrollo a la derecha.
        La sección de arriba es una grilla de bloques chicos y esta tenía el
        mismo aire; separarlas por estructura, y no por decoración, es lo que
        hace que dejen de parecer la misma.

        Delante de cada título, un dibujo de línea del color del texto, en el
        lugar donde antes iba el número: dice de qué se trata el pilar de un
        vistazo y no compite con el titular porque pesa lo mismo que él.

        El reparto de las columnas está medido para que el título más largo
        («Alcance cerrado antes de empezar») entre en una línea con el ancho
        de lectura completo; más angosto se corta, y está bien.
      */}
      <Reveal stagger className="mt-16 border-t border-line-strong">
        {approach.pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="grid gap-4 border-b border-line-strong py-9 md:grid-cols-[1fr_1.15fr] md:gap-14 md:py-12"
          >
            <h3 className="flex items-start gap-5 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[1.75rem]">
              <ApproachArt
                art={pillar.art}
                className="mt-[-0.15em] h-10 w-10 shrink-0 text-ink"
              />
              {pillar.title}
            </h3>
            <p className="text-[1.02rem] leading-relaxed text-ink-soft md:pt-1">
              {pillar.body}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
