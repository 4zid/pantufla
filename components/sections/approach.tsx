import { approach } from "@/content/site";
import { Blob } from "@/components/art/blob";
import { DrawnLineArt } from "@/components/art/drawn-line-art";
import type { LineArtName } from "@/components/art/line-art";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";

export function Approach() {
  return (
    <Section id="metodo" tone="alt" className="overflow-hidden">
      <Blob
        tone="olive"
        shape="pill"
        className="pointer-events-none absolute -right-24 -top-10 hidden h-72 w-72 opacity-50 lg:block"
      />

      <SectionHead
        eyebrow={approach.eyebrow}
        title={approach.title}
        lead={approach.lead}
      />

      <Reveal stagger className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        {approach.pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="group rounded-panel border border-line bg-card p-7 transition-colors duration-300 hover:border-line-strong md:p-8"
          >
            <DrawnLineArt
              name={pillar.art as LineArtName}
              className="h-10 w-10 text-clay transition-transform duration-500 group-hover:-rotate-6"
            />
            <h3 className="mt-6 text-h3">{pillar.title}</h3>
            <p className="mt-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
              {pillar.body}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
