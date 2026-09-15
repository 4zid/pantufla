import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Tone } from "@/lib/tones";
import { cn } from "@/lib/cn";

export function Section({
  id,
  children,
  className,
  tone = "paper",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "alt" | "deep";
}) {
  const tones = {
    paper: "",
    alt: "bg-paper-alt",
    deep: "bg-deep text-paper",
  };

  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", tones[tone], className)}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  accent = "aqua",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
  accent?: Tone;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <Reveal>
          <div className={cn(align === "center" && "flex justify-center")}>
            <Eyebrow tone={accent} onDark={onDark}>
              {eyebrow}
            </Eyebrow>
          </div>
        </Reveal>
      ) : null}

      <SplitHeading
        text={title}
        className={cn("mt-5 text-h2", onDark && "text-paper")}
      />

      {lead ? (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-5 text-lead",
              onDark ? "text-white/60" : "text-ink-soft",
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
