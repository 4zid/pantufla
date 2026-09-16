import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { Tag } from "@/components/ui/tag";
import { StarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { urlForImage } from "@/sanity/image";
import type { SanityTestimonial } from "@/sanity/types";
import { cn } from "@/lib/cn";

function Stars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${value} de 5`}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "h-4 w-4",
            i < value ? "text-star" : "text-line-strong",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Testimonios en tarjetas.
 *
 * Cada una trae lo mismo y en el mismo orden —estrellas, cita, quién lo dijo y
 * de dónde—, que es lo que las hace comparables de un vistazo. La empresa va
 * separada del cargo y no todo junto en una línea: es el dato que le dice al
 * visitante si el que habla se parece a él.
 *
 * Las iniciales cubren a quien no mandó foto, así ninguna tarjeta queda con un
 * hueco donde las otras tienen algo.
 */
export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  if (!items.length) return null;

  return (
    <Section id="testimonios" tone="alt">
      <div className="max-w-2xl">
        <Reveal>
          <Tag icon="cita">Testimonios</Tag>
        </Reveal>
        <SplitHeading
          text="Lo que dicen los que ya pasaron por el proceso."
          className="mt-5 text-h2"
        />
      </div>

      <Reveal stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((item) => {
          const avatar = urlForImage(item.avatar)?.width(96).height(96).url();
          const initials = item.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("");

          return (
            <figure
              key={item._id}
              className="flex h-full flex-col rounded-panel border border-line bg-card p-6 lg:p-7"
            >
              <Stars value={item.rating ?? 5} />

              <blockquote className="mb-7 mt-5 text-[1.02rem] leading-[1.6] text-ink">
                {item.quote}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt=""
                    aria-hidden
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-alt text-[0.78rem] font-semibold text-ink-soft"
                  >
                    {initials}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-[0.95rem] font-medium">
                    {item.name}
                  </span>
                  <span className="block truncate text-[0.85rem] text-ink-faint">
                    {[item.role, item.company].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </Reveal>
    </Section>
  );
}
