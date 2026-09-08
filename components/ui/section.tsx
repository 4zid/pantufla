import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Logo } from "@/components/ui/icons";
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

/**
 * La marca en chico delante de cada volanta es la firma que se repite en todo
 * el sitio, el equivalente a los { } del ref. Es propia y no hay que explicarla.
 */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", onDark && "text-white/45")}>
      <Logo className="h-3.5 w-3.5 shrink-0 text-aqua-deep" />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <Reveal>
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <SplitHeading
        text={title}
        className={cn("mt-4 text-h2", onDark && "text-paper")}
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
