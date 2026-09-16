import { Suspense } from "react";

import { BriefForm } from "@/components/brief-form";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { finalCta, site } from "@/content/site";

/**
 * Cierre.
 *
 * Con withForm el brief se completa acá mismo, sin ir a otra página: es el
 * final de la home, donde el visitante ya leyó todo y mandarlo a /contacto es
 * pedirle un clic más justo en el momento de decidir. El formulario ya viene
 * en tarjeta clara, así que sobre la banda oscura se apoya solo.
 *
 * Sin la prop queda la versión de botón, que es la que usan las páginas
 * internas: ahí el cierre es un remate, no el lugar donde se convierte.
 */
export function FinalCta({ withForm = false }: { withForm?: boolean }) {
  if (withForm) {
    return (
      <Section id="brief" tone="deep" className="overflow-hidden py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SplitHeading text={finalCta.title} className="text-h2 text-paper" />
            <Reveal delay={0.15}>
              <p className="mt-5 text-lead text-white/60">{finalCta.lead}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <ul className="mt-9 space-y-3.5 border-t border-white/12 pt-8">
                {finalCta.expectations.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.93rem]">
                    <CheckIcon className="mt-[5px] h-3.5 w-3.5 shrink-0 text-aqua" />
                    <span className="leading-relaxed text-white/70">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-[0.9rem] text-white/45">
                ¿Preferís escribir directo?{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-paper underline underline-offset-4"
                >
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          {/* useSearchParams necesita su frontera: sin esto la home entera
              dejaría de generarse estática. */}
          <Suspense
            fallback={
              <div className="h-[640px] rounded-panel border border-line bg-card" />
            }
          >
            <BriefForm />
          </Suspense>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="deep" className="overflow-hidden py-24 md:py-32">
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
