"use client";

import { useId, useState } from "react";

import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { pricing, type BillingMode } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Section, SectionHead } from "@/components/ui/section";
import { toneTextBase, toneTextDeep, type Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** Marco común de las tres tarjetas, para que entren parejas en una pantalla. */
const card =
  "flex h-full flex-col rounded-panel p-7 lg:p-8";

export function Pricing() {
  const [mode, setMode] = useState<BillingMode>("once");
  const groupId = useId();

  return (
    <Section id="planes" className="py-16 md:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead
          accent="verde"
          eyebrow={pricing.eyebrow}
          title={pricing.title}
        />

        <Reveal delay={0.2}>
          <div
            role="radiogroup"
            aria-label="Forma de pago"
            className="flex w-full shrink-0 rounded-full border border-line-strong bg-card p-1 sm:w-auto"
          >
            {(["once", "split"] as const).map((value) => {
              const option = pricing.toggle[value];
              const active = mode === value;
              return (
                <button
                  key={value}
                  id={`${groupId}-${value}`}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(value)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.8rem] font-medium transition-colors duration-200 sm:flex-none sm:gap-2 sm:px-4 sm:text-[0.88rem]",
                    active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums",
                      active ? "bg-white/15 text-paper" : "bg-verde-soft text-verde-deep",
                    )}
                  >
                    <span className="sm:hidden">{option.note}</span>
                    <span className="hidden sm:inline">{option.noteLong}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-3">
        {pricing.plans.map((plan) => {
          const dark = plan.featured;
          const total = plan.price.split * plan.price.splitCount;

          return (
            <div
              key={plan.id}
              className={cn(
                card,
                dark
                  ? "bg-deep text-paper shadow-[0_30px_70px_-40px_rgba(35,28,18,0.6)]"
                  : "border border-line bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className={cn("text-[1.3rem] font-semibold tracking-[-0.03em]", dark && "text-paper")}>
                  {plan.name}
                </h3>
                {dark && "badge" in plan && plan.badge ? (
                  <span className="rounded-full bg-white/12 px-2.5 py-1 text-[0.72rem] font-medium text-paper">
                    {plan.badge}
                  </span>
                ) : null}
              </div>

              <p className={cn("mt-2 text-[0.95rem] leading-snug", dark ? "text-white/60" : "text-ink-soft")}>
                {plan.summary}
              </p>

              <div className="mt-7">
                <div className="flex items-baseline gap-2">
                  <Counter
                    value={mode === "once" ? plan.price.once : plan.price.split}
                    prefix="$"
                    className="text-[2.8rem] font-semibold leading-none tracking-[-0.045em]"
                  />
                  {mode === "once" ? (
                    <span className={cn("text-[0.95rem] line-through", dark ? "text-white/35" : "text-ink-faint")}>
                      ${money.format(total)}
                    </span>
                  ) : (
                    <span className={cn("text-[0.95rem]", dark ? "text-white/55" : "text-ink-soft")}>
                      × {plan.price.splitCount}
                    </span>
                  )}
                </div>
                <p className={cn("mt-2 text-[0.85rem]", dark ? "text-white/45" : "text-ink-faint")}>
                  {mode === "once" ? "Pago único" : `Total $${money.format(total)}`} · Entrega en {plan.delivery}
                </p>
              </div>

              <ButtonLink
                href={plan.cta.href}
                variant={dark ? "onDark" : "primary"}
                className="mt-6 w-full"
              >
                {plan.cta.label}
              </ButtonLink>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[0.92rem]">
                    <CheckIcon
                      className={cn(
                        "mt-[4px] h-3.5 w-3.5 shrink-0",
                        dark ? toneTextBase[plan.tone as Tone] : toneTextDeep[plan.tone as Tone],
                      )}
                    />
                    <span className={cn("leading-snug", dark && "text-white/85")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Tercera tarjeta: lo que no entra en ninguno de los dos planes. */}
        <div className={cn(card, "border border-dashed border-line-strong")}>
          <h3 className="text-[1.3rem] font-semibold tracking-[-0.03em]">
            {pricing.contact.name}
          </h3>
          <p className="mt-2 text-[0.95rem] leading-snug text-ink-soft">
            {pricing.contact.summary}
          </p>

          <div className="mt-7">
            <p className="text-[2.8rem] font-semibold leading-none tracking-[-0.045em]">
              {pricing.contact.price}
            </p>
            <p className="mt-2 text-[0.85rem] text-ink-faint">
              Según alcance · Respondemos en 24 h
            </p>
          </div>

          <ButtonLink
            href={pricing.contact.cta.href}
            variant="secondary"
            className="mt-6 w-full"
          >
            {pricing.contact.cta.label}
          </ButtonLink>

          <ul className="mt-6 space-y-2.5">
            {pricing.contact.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-[0.92rem]">
                <CheckIcon className="mt-[4px] h-3.5 w-3.5 shrink-0 text-miel-deep" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
