"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { faq } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { PlusIcon } from "@/components/ui/icons";
import { Section, SectionHead } from "@/components/ui/section";
import { gsap, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const list = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = list.current;
      if (!root) return;

      const panels =
        root.querySelectorAll<HTMLDivElement>("[data-faq-panel]");
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      panels.forEach((panel, i) => {
        const isOpen = open === i;
        const duration = reduced ? 0 : 0.42;

        gsap.to(panel, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          duration,
          ease: isOpen ? "power2.out" : "power2.in",
        });
      });
    },
    { dependencies: [open] },
  );

  return (
    <Section id="faq" tone="alt">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead accent="verde" eyebrow={faq.eyebrow} title={faq.title} />
          <Reveal delay={0.2}>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-soft">
              ¿Falta alguna? Escribinos y te la respondemos sin vueltas antes de
              que decidas nada.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div ref={list} className="border-t border-line-strong">
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
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="text-[1.02rem] font-medium leading-snug tracking-[-0.015em] transition-colors group-hover:text-aqua-deep">
                        {item.q}
                      </span>
                      <PlusIcon
                        className={cn(
                          "mt-1 h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300",
                          isOpen && "rotate-45 text-aqua-deep",
                        )}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    data-faq-panel
                    aria-hidden={!isOpen}
                    className="overflow-hidden"
                    style={isOpen ? undefined : { height: 0, opacity: 0 }}
                  >
                    <p className="pb-6 pr-10 text-[0.96rem] leading-relaxed text-ink-soft">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
