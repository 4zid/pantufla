import { finalCta } from "@/content/site";
import { Blob } from "@/components/art/blob";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function FinalCta() {
  return (
    <Section tone="deep" className="overflow-hidden py-24 md:py-32">
      <Blob
        tone="aqua"
        shape="dome"
        className="pointer-events-none absolute -left-16 top-1/2 hidden h-56 w-56 -translate-y-1/2 opacity-30 blur-[2px] lg:block"
      />
      <Blob
        tone="rosa"
        shape="drop"
        className="pointer-events-none absolute -right-12 top-10 hidden h-48 w-48 opacity-25 lg:block"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <SplitHeading text={finalCta.title} className="text-h2 text-paper" />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-lg text-lead text-white/60">
            {finalCta.lead}
          </p>
        </Reveal>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic className="w-full sm:w-auto">
            <ButtonLink
              href={finalCta.primary.href}
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
            >
              {finalCta.primary.label}
            </ButtonLink>
          </Magnetic>
          <ButtonLink
            href={finalCta.secondary.href}
            size="lg"
            className="w-full border border-white/15 bg-transparent text-paper hover:bg-white/10 sm:w-auto"
          >
            {finalCta.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
