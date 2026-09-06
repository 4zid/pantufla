import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-[#2c2820]",
  secondary:
    "border border-line-strong bg-card text-ink hover:border-ink hover:bg-paper-alt",
  ghost: "text-ink hover:bg-paper-alt",
  onDark: "bg-paper text-ink hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-[0.94rem]",
  lg: "h-12 px-7 text-[1rem]",
};

type Props = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Props & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "children" | "className"
  >) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = cn(base, variants[variant], sizes[size], className);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...(props as ComponentProps<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
