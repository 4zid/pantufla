import { hero } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";

import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 md:pt-20">
      {/* Halo cálido detrás del título, muy suave. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #f6e7de 0%, rgba(247,245,240,0) 70%)",
        }}
      />

      <div className="shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-line-strong bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
            <span className="whitespace-nowrap">{hero.badge}</span>
            <span className="hidden whitespace-nowrap text-ink-faint sm:inline">
              · {hero.badgeNote}
            </span>
          </p>

          <h1 className="mt-7 text-display">{hero.title}</h1>

          <p className="mx-auto mt-6 max-w-xl text-lead text-ink-soft">
            {hero.lead}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={hero.primary.href} size="lg" className="w-full sm:w-auto">
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondary.href}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hero.secondary.label}
            </ButtonLink>
          </div>

          <ul className="mx-auto mt-9 flex max-w-3xl flex-col items-center justify-center gap-x-7 gap-y-2.5 sm:flex-row sm:flex-wrap">
            {hero.proof.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[0.88rem] text-ink-soft"
              >
                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-clay" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <HeroVisual />
    </section>
  );
}
