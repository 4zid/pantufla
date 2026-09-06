import { process } from "@/content/site";
import { Section, SectionHead } from "@/components/ui/section";

export function Process() {
  return (
    <Section id="proceso" tone="deep">
      <SectionHead
        eyebrow={process.eyebrow}
        title={process.title}
        lead={process.lead}
        onDark
      />

      <ol className="mt-16 border-t border-white/10">
        {process.steps.map((step) => (
          <li
            key={step.number}
            className="grid gap-5 border-b border-white/10 py-9 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10 md:py-11"
          >
            <div className="flex items-center gap-4 md:w-24 md:flex-col md:items-start md:gap-2">
              <span className="text-[1.5rem] font-semibold tabular-nums leading-none tracking-[-0.03em] text-white/25 md:text-[2rem]">
                {step.number}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.72rem] font-medium text-white/70">
                {step.when}
              </span>
            </div>

            <div className="max-w-2xl">
              <h3 className="text-h3 text-paper">{step.name}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-white/60">
                {step.body}
              </p>
            </div>

            <dl className="grid gap-4 text-[0.85rem] sm:grid-cols-2 md:w-56 md:grid-cols-1 md:gap-3.5">
              <div>
                <dt className="text-white/35">Te entregamos</dt>
                <dd className="mt-1 font-medium text-paper">{step.deliverable}</dd>
              </div>
              <div>
                <dt className="text-white/35">Ponés vos</dt>
                <dd className="mt-1 font-medium text-paper">{step.yours}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-xl text-[0.92rem] leading-relaxed text-white/45">
        {process.payment}
      </p>
    </Section>
  );
}
