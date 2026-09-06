"use client";

import { useId, useState } from "react";

import { pricing, type BillingMode } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon, MinusIcon } from "@/components/ui/icons";
import { Section, SectionHead } from "@/components/ui/section";
import { cn } from "@/lib/cn";

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

type Price =
  | { once: number; split: number; splitCount: number; from?: undefined }
  | { from: number; once?: undefined; split?: undefined; splitCount?: undefined };

function PlanPrice({ price, mode }: { price: Price; mode: BillingMode }) {
  if (price.from !== undefined) {
    return (
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[0.95rem] text-ink-soft">Desde</span>
          <span className="text-[2.4rem] font-semibold leading-none tracking-[-0.035em]">
            ${money.format(price.from)}
          </span>
        </div>
        <p className="mt-2 text-[0.85rem] text-ink-faint">
          El precio final sale del brief. Sin sorpresas después.
        </p>
      </div>
    );
  }

  const total = price.split * price.splitCount;

  return (
    <div>
      {mode === "once" ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.4rem] font-semibold leading-none tracking-[-0.035em]">
              ${money.format(price.once)}
            </span>
            <span className="text-[0.95rem] text-ink-faint line-through">
              ${money.format(total)}
            </span>
          </div>
          <p className="mt-2 text-[0.85rem] text-ink-faint">
            Pago único al reservar la fecha.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[2.4rem] font-semibold leading-none tracking-[-0.035em]">
              ${money.format(price.split)}
            </span>
            <span className="text-[0.95rem] text-ink-soft">
              × {price.splitCount}
            </span>
          </div>
          <p className="mt-2 text-[0.85rem] text-ink-faint">
            50% al reservar y 50% al publicar. Total ${money.format(total)}.
          </p>
        </>
      )}
    </div>
  );
}

export function Pricing() {
  const [mode, setMode] = useState<BillingMode>("once");
  const groupId = useId();

  return (
    <Section id="planes">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          lead={pricing.lead}
        />

        {/* Toggle de forma de pago */}
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
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[0.85rem] font-medium transition-colors duration-200 sm:flex-none sm:px-4 sm:text-[0.9rem]",
                  active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                )}
              >
                {option.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tabular-nums",
                    active
                      ? "bg-white/15 text-paper"
                      : "bg-clay-soft text-clay",
                  )}
                >
                  <span className="sm:hidden">{option.note}</span>
                  <span className="hidden sm:inline">{option.noteLong}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-start">
        {pricing.plans.map((plan) => {
          const featured = plan.featured;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex h-full flex-col rounded-panel border p-7 md:p-8",
                featured
                  ? "border-ink bg-card shadow-[0_30px_60px_-40px_rgba(35,28,18,0.45)] lg:-mt-4 lg:pb-10"
                  : "border-line bg-card/60",
              )}
            >
              {featured && "badge" in plan && plan.badge ? (
                <span className="absolute -top-3 left-7 rounded-full bg-clay px-3 py-1 text-[0.72rem] font-semibold text-white">
                  {plan.badge}
                </span>
              ) : null}

              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em]">
                  {plan.name}
                </h3>
                <span className="text-[0.8rem] text-ink-faint">
                  {plan.delivery}
                </span>
              </div>

              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {plan.summary}
              </p>

              <div className="mt-7">
                <PlanPrice price={plan.price as Price} mode={mode} />
              </div>

              <ButtonLink
                href={plan.cta.href}
                variant={featured ? "primary" : "secondary"}
                size="lg"
                className="mt-7 w-full"
              >
                {plan.cta.label}
              </ButtonLink>

              <p className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.07em] text-ink-faint">
                Ideal para
              </p>
              <p className="mt-1.5 text-[0.9rem] text-ink-soft">{plan.bestFor}</p>

              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[0.92rem]">
                    <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-clay" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
                {plan.excluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2.5 text-[0.92rem] text-ink-faint"
                  >
                    <MinusIcon className="mt-[3px] h-4 w-4 shrink-0" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Garantía */}
      <div className="mt-10 flex flex-col gap-3 rounded-panel border border-line bg-paper-alt p-6 sm:flex-row sm:items-center sm:gap-5 md:p-7">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
          <CheckIcon className="h-4.5 w-4.5" />
        </span>
        <p className="text-[0.98rem] leading-relaxed">{pricing.guarantee}</p>
      </div>

      {/* Siempre incluido */}
      <div className="mt-16">
        <p className="eyebrow">En todos los planes</p>
        <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.alwaysIncluded.map((item) => (
            <li key={item} className="flex gap-2.5 text-[0.95rem]">
              <CheckIcon className="mt-[4px] h-4 w-4 shrink-0 text-clay" />
              <span className="leading-snug text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
