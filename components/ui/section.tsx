import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Tag, type TagIconName } from "@/components/ui/tag";
import { cn } from "@/lib/cn";

export function Section({
  id,
  children,
  className,
  tone = "paper",
  overlay,
  wide = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "alt" | "deep" | "deepFade";
  /** Capa decorativa a sangre, detrás del contenido y fuera del ancho de
      lectura. Va acá y no dentro de los hijos porque el contenido vive en
      .shell, que tiene ancho máximo: un degradé ahí adentro se corta. */
  overlay?: ReactNode;
  /** Usa el contenedor ancho, para secciones que no son un renglón de lectura. */
  wide?: boolean;
}) {
  const tones = {
    paper: "",
    alt: "bg-paper-alt",
    deep: "bg-deep text-paper",
    /*
       Tinta clara, fondo por cuenta de quien llama. Es para las secciones
       oscuras que no quieren entrar de golpe: el negro lo pinta el overlay y
       así puede desbordar la sección y difuminarse en las puntas, cosa que un
       background-color no sabe hacer.
    */
    deepFade: "text-paper",
  };

  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", tones[tone], className)}
    >
      {overlay}
      <div className={cn("relative z-10", wide ? "shell-wide" : "shell")}>
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  onDark = false,
  icon,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
  icon?: TagIconName;
}) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow ? (
        <Reveal>
          <div className={cn(align === "center" && "flex justify-center")}>
            <Tag icon={icon} onDark={onDark}>
              {eyebrow}
            </Tag>
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
