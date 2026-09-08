import { problem } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";

export function Problem() {
  return (
    <Section id="problema" className="pt-28 md:pt-36">
      <SectionHead
        eyebrow={problem.eyebrow}
        title={problem.title}
        lead={problem.lead}
      />

      <Reveal
        stagger
        className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2"
      >
        {problem.items.map((item, i) => (
          <div
            key={item.title}
            className="group bg-paper p-7 transition-colors duration-300 hover:bg-card md:p-9"
          >
            <span className="text-[0.8rem] font-semibold tabular-nums text-clay">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">
              {item.title}
            </h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
              {item.body}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
