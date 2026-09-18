"use client";

import { useId, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";

import { gsap, registerGsap } from "@/lib/motion";

import { Counter } from "@/components/motion/counter";
import { PricingExisting } from "@/components/sections/pricing-existing";
import { Reveal } from "@/components/motion/reveal";
import { type BillingMode } from "@/content/site";
import { useCopy } from "@/components/copy-provider";
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
  const { pricing } = useCopy();
  const [mode, setMode] = useState<BillingMode>("once");
  const groupId = useId();
  const toggle = useRef<HTMLDivElement>(null);

  /**
   * La pastilla oscura se desliza hasta la opción elegida en vez de aparecer
   * y desaparecer. Se mide la posición real de cada botón porque los dos no
   * miden lo mismo: cada uno lleva su propio distintivo de descuento al lado
   * de la etiqueta.
   */
  useGSAP(
    () => {
      registerGsap();
      const root = toggle.current;
      if (!root) return;

      const activo = root.querySelector<HTMLElement>(`[data-value="${mode}"]`);
      const pastilla = root.querySelector<HTMLElement>("[data-thumb]");
      if (!activo || !pastilla) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(pastilla, {
        x: activo.offsetLeft,
        width: activo.offsetWidth,
        duration: reduced ? 0 : 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [mode] },
  );

  return (
    <Section id="planes" surface="mist" className="py-16 md:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead
          icon="etiqueta"
          eyebrow={pricing.eyebrow}
          title={pricing.title}
        />

        <Reveal delay={0.2}>
          <div
            ref={toggle}
            role="radiogroup"
            aria-label={pricing.groupLabel}
            className="relative flex w-full shrink-0 rounded-full border border-line-strong bg-card p-1 sm:w-auto"
          >
            {/* La pastilla que viaja. Va detrás de los botones y sin capturar
                el puntero, así el clic sigue llegando al botón de abajo. */}
            <span
              aria-hidden
              data-thumb
              className="pointer-events-none absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-ink"
            />
            {(["once", "split"] as const).map((value) => {
              const option = pricing.toggle[value];
              const active = mode === value;
              return (
                <button
                  key={value}
                  id={`${groupId}-${value}`}
                  data-value={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(value)}
                  className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.8rem] font-medium transition-colors duration-300 sm:flex-none sm:gap-2 sm:px-4 sm:text-[0.88rem]",
                    active ? "text-white" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums",
                      "transition-colors duration-300",
                      active ? "bg-white/15 text-white" : "bg-verde-soft text-verde-deep",
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
                  ? "bg-deep text-white shadow-[0_30px_70px_-40px_rgba(35,28,18,0.6)]"
                  : "border border-line bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className={cn("text-[1.3rem] font-semibold tracking-[-0.03em]", dark && "text-white")}>
                  {plan.name}
                </h3>
                {dark && "badge" in plan && plan.badge ? (
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.72rem] font-medium text-white">
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
                    <span className={cn("text-[0.95rem] line-through", dark ? "text-white/50" : "text-ink-faint")}>
                      ${money.format(total)}
                    </span>
                  ) : (
                    <span className={cn("text-[0.95rem]", dark ? "text-white/55" : "text-ink-soft")}>
                      × {plan.price.splitCount}
                    </span>
                  )}
                </div>
                <p className={cn("mt-2 text-[0.85rem]", dark ? "text-white/55" : "text-ink-faint")}>
                  {mode === "once"
                    ? pricing.toggle.once.label
                    : `${pricing.totalLabel} $${money.format(total)}`} · Entrega en {plan.delivery}
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

      <Reveal delay={0.1}>
        <PricingExisting />
      </Reveal>
    </Section>
  );
}
