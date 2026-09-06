"use client";

import { useState } from "react";

import { faq } from "@/content/site";
import { PlusIcon } from "@/components/ui/icons";
import { Section, SectionHead } from "@/components/ui/section";
import { cn } from "@/lib/cn";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" tone="alt">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow={faq.eyebrow} title={faq.title} />
          <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-soft">
            ¿Falta alguna? Escribinos y te la respondemos sin vueltas antes de
            que decidas nada.
          </p>
        </div>

        <div className="border-t border-line-strong">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-line-strong">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[1.02rem] font-medium leading-snug tracking-[-0.015em]">
                      {item.q}
                    </span>
                    <PlusIcon
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300",
                        isOpen && "rotate-45 text-clay",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  hidden={!isOpen}
                  className="pb-6 pr-10"
                >
                  <p className="text-[0.96rem] leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
