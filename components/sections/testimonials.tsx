import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { urlForImage } from "@/sanity/image";
import type { SanityTestimonial } from "@/sanity/types";

export function Testimonials({ items }: { items: SanityTestimonial[] }) {
  if (!items.length) return null;

  return (
    <Section id="testimonios">
      <SectionHead
        accent="rosa"
        eyebrow="Testimonios"
        title="Lo que dicen los que ya pasaron por el proceso."
      />

      {/*
        Sin tarjeta ni borde: la cita es lo único que importa, en cuerpo grande
        y separada por un filete. Las estrellitas y los avatares en fila son
        justamente lo que hace que estas secciones se parezcan todas.
      */}
      <Reveal stagger className="mt-16 grid gap-x-14 gap-y-14 md:grid-cols-3">
        {items.slice(0, 3).map((item) => {
          const avatar = urlForImage(item.avatar)?.width(96).height(96).url();
          return (
            <figure key={item._id} className="border-t border-line pt-7">
              <blockquote className="text-[1.15rem] leading-[1.5] tracking-[-0.015em]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-[0.92rem] font-medium">{item.name}</p>
                  {item.role ? (
                    <p className="text-[0.85rem] text-ink-faint">{item.role}</p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </Reveal>
    </Section>
  );
}
