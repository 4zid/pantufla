import type { ReactNode } from "react";

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
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p className={cn("eyebrow", onDark && "text-white/45")}>{eyebrow}</p>
      ) : null}
      <h2 className={cn("mt-4 text-h2", onDark && "text-paper")}>{title}</h2>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-lead",
            onDark ? "text-white/60" : "text-ink-soft",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
