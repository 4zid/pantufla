import { approach } from "@/content/site";
import { Section, SectionHead } from "@/components/ui/section";

export function Approach() {
  return (
    <Section id="metodo" tone="alt">
      <SectionHead
        eyebrow={approach.eyebrow}
        title={approach.title}
        lead={approach.lead}
      />

      <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        {approach.pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-panel border border-line bg-card p-7 md:p-8"
          >
            <h3 className="text-h3">{pillar.title}</h3>
            <p className="mt-3.5 text-[0.95rem] leading-relaxed text-ink-soft">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
