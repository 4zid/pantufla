import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SplitHeading } from "@/components/motion/split-heading";
import { urlForImage } from "@/sanity/image";
import type { SanityTestimonial } from "@/sanity/types";

function Stars({ value = 5 }: { value?: number }) {
  return (
    <div
      className="flex gap-0.5 text-miel"
      role="img"
      aria-label={`${value} de 5`}
    >
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? "" : "text-line-strong"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  if (!items.length) return null;

  return (
    <Section id="testimonios">
      {/* Título fijo a la izquierda y las citas apiladas a la derecha. */}
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow tone="rosa">Testimonios</Eyebrow>
          </Reveal>
          <SplitHeading
            text="Lo que dicen los que ya pasaron por el proceso."
            className="mt-5 text-h2"
          />
        </div>

        <Reveal stagger className="border-t border-line">
          {items.slice(0, 3).map((item) => {
            const avatar = urlForImage(item.avatar)?.width(96).height(96).url();
            return (
              <figure key={item._id} className="border-b border-line py-8">
                <Stars value={item.rating ?? 5} />
                <blockquote className="mt-4 text-[1.15rem] leading-[1.5] tracking-[-0.015em]">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={item.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : null}
                  <p className="text-[0.92rem]">
                    <span className="font-medium">{item.name}</span>
                    {item.role ? (
                      <span className="text-ink-faint"> · {item.role}</span>
                    ) : null}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
