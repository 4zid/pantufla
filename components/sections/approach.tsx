import { approach } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { toneTextDeep, type Tone } from "@/lib/tones";

const tones: Tone[] = ["aqua", "rosa", "verde"];

export function Approach() {
  return (
    <Section id="metodo" tone="alt">
      <SectionHead
        accent="aqua"
        eyebrow={approach.eyebrow}
        title={approach.title}
        lead={approach.lead}
      />

      {/*
        Filas anchas con el título a la izquierda y el desarrollo a la derecha.
        La sección de arriba es una grilla de bloques chicos y esta tenía el
        mismo aire; separarlas por estructura, y no por decoración, es lo que
        hace que dejen de parecer la misma. Sin iconos: el texto alcanza.
      */}
      <Reveal stagger className="mt-16 border-t border-line-strong">
        {approach.pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            className="grid gap-4 border-b border-line-strong py-9 md:grid-cols-[1fr_1.25fr] md:gap-14 md:py-12"
          >
            <h3 className="flex items-start gap-4 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[1.75rem]">
              <span
                className={`mt-2 text-[0.85rem] font-semibold tabular-nums ${toneTextDeep[tones[i]]}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
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
