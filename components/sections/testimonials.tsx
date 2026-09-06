import Image from "next/image";

import { urlForImage } from "@/sanity/image";
import type { SanityTestimonial } from "@/sanity/types";
import { Section, SectionHead } from "@/components/ui/section";

export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  if (!items.length) return null;

  return (
    <Section id="testimonios">
      <SectionHead
        eyebrow="Testimonios"
        title="Lo que dicen los que ya pasaron por el proceso."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.slice(0, 3).map((item) => {
          const avatar = urlForImage(item.avatar)?.width(96).height(96).url();
          return (
            <figure
              key={item._id}
              className="flex flex-col rounded-panel border border-line bg-card p-7"
            >
              <blockquote className="flex-1 text-[1.02rem] leading-relaxed">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-alt text-[0.85rem] font-semibold text-ink-soft">
                    {item.name.slice(0, 1)}
                  </span>
                )}
                <div>
                  <p className="text-[0.92rem] font-medium">{item.name}</p>
                  {item.role ? (
                    <p className="text-[0.82rem] text-ink-faint">{item.role}</p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Section>
  );
}
