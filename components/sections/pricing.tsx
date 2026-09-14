"use client";

import { useId, useState } from "react";

import type { Tone } from "@/components/art/blob";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { pricing, type BillingMode } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Section, SectionHead } from "@/components/ui/section";
import { toneTextBase, toneTextDeep } from "@/lib/tones";
import { cn } from "@/lib/cn";

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function Pricing() {
  const [mode, setMode] = useState<BillingMode>("once");
  const groupId = useId();

  return (
    <Section id="planes">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead
          accent="verde"
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          lead={pricing.lead}
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
                    "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2.5 text-[0.8rem] font-medium transition-colors duration-200 sm:flex-none sm:gap-2 sm:px-4 sm:text-[0.9rem]",
                    active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tabular-nums",
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

      <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2">
        {pricing.plans.map((plan) => {
          const dark = plan.featured;
          const total = plan.price.split * plan.price.splitCount;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex h-full flex-col rounded-panel p-8 md:p-10",
                dark
                  ? "bg-deep text-paper shadow-[0_30px_70px_-40px_rgba(35,28,18,0.6)]"
                  : "border border-line bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={cn(
                    "text-[1.6rem] font-semibold tracking-[-0.03em]",
                    dark && "text-paper",
                  )}
                >
                  {plan.name}
                </h3>
                {dark && "badge" in plan && plan.badge ? (
                  <span className="rounded-full bg-white/12 px-3 py-1 text-[0.75rem] font-medium text-paper">
                    {plan.badge}
                  </span>
                ) : null}
              </div>

              <p
                className={cn(
                  "mt-3 max-w-sm text-[1.02rem] leading-relaxed",
                  dark ? "text-white/60" : "text-ink-soft",
                )}
              >
                {plan.summary}
              </p>

              {/* Precio: la cifra manda y el detalle queda abajo, chico. */}
              <div className="mt-9">
                {mode === "once" ? (
                  <div className="flex items-baseline gap-3">
                    <Counter
                      value={plan.price.once}
                      prefix="$"
                      className="text-[3.4rem] font-semibold leading-none tracking-[-0.045em]"
                    />
                    <span
                      className={cn(
                        "text-[1.05rem] line-through",
                        dark ? "text-white/35" : "text-ink-faint",
                      )}
                    >
                      ${money.format(total)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <Counter
                      value={plan.price.split}
                      prefix="$"
                      className="text-[3.4rem] font-semibold leading-none tracking-[-0.045em]"
                    />
                    <span
                      className={cn(
                        "text-[1.05rem]",
                        dark ? "text-white/55" : "text-ink-soft",
                      )}
                    >
                      × {plan.price.splitCount}
                    </span>
                  </div>
                )}
                <p
                  className={cn(
                    "mt-3 text-[0.9rem]",
                    dark ? "text-white/45" : "text-ink-faint",
                  )}
                >
                  {mode === "once"
                    ? `Pago único · Entrega en ${plan.delivery}`
                    : `50% y 50% · Total $${money.format(total)} · Entrega en ${plan.delivery}`}
                </p>
              </div>

              <ButtonLink
                href={plan.cta.href}
                variant={dark ? "onDark" : "primary"}
                size="lg"
                className="mt-8 w-full"
              >
                {plan.cta.label}
              </ButtonLink>

              <ul className="mt-9 space-y-3.5 border-t pt-8 [border-color:currentColor]/10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[0.98rem]">
                    <CheckIcon
                      className={cn(
                        "mt-[4px] h-4 w-4 shrink-0",
                        dark
                          ? toneTextBase[plan.tone as Tone]
                          : toneTextDeep[plan.tone as Tone],
                      )}
                    />
                    <span
                      className={cn("leading-snug", dark && "text-white/85")}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p
                className={cn(
                  "mt-8 text-[0.88rem]",
                  dark ? "text-white/40" : "text-ink-faint",
                )}
              >
                Ideal para {plan.bestFor.charAt(0).toLowerCase() + plan.bestFor.slice(1)}
              </p>
            </div>
          );
        })}
      </Reveal>

      <Reveal>
        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.92rem] text-ink-soft">
          <CheckIcon className="h-4 w-4 shrink-0 text-verde-deep" />
          {pricing.guarantee}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-3 text-[0.92rem] text-ink-faint">{pricing.outside}</p>
      </Reveal>

    </Section>
  );
}
