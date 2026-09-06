import { finalCta } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export function FinalCta() {
  return (
    <Section tone="deep" className="py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2 text-paper">{finalCta.title}</h2>
        <p className="mx-auto mt-5 max-w-lg text-lead text-white/60">
          {finalCta.lead}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink
            href={finalCta.primary.href}
            variant="onDark"
            size="lg"
            className="w-full sm:w-auto"
          >
            {finalCta.primary.label}
          </ButtonLink>
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
