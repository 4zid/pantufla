import type { Tone } from "@/components/art/blob";
import { problem } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHead } from "@/components/ui/section";
import { toneTextDeep } from "@/lib/tones";

/** Un color por frustración: los mismos cuatro que usa el resto del sitio. */
const tones: Tone[] = ["rosa", "miel", "verde", "aqua"];

export function Problem() {
  return (
    <Section id="problema" className="pt-28 md:pt-36">
      <SectionHead
        accent="rosa"
        eyebrow={problem.eyebrow}
        title={problem.title}
        lead={problem.lead}
      />

      {/*
        Antes era una grilla de cajas con borde, que es el patrón de tarjetas
        que se ve en cualquier plantilla. Ahora son bloques separados por
        filetes, con un punto de color por ítem: se lee como una enumeración
        editorial y respira mucho más.
      */}
      <Reveal stagger className="mt-16 grid gap-x-16 gap-y-12 sm:grid-cols-2">
        {problem.items.map((item, i) => (
          <div key={item.title} className="border-t border-line pt-6">
            <span
              className={`text-[0.85rem] font-semibold tabular-nums ${toneTextDeep[tones[i]]}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 max-w-sm text-[1.3rem] font-semibold leading-snug tracking-[-0.025em]">
              {item.title}
            </h3>
            <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-ink-soft">
              {item.body}
            </p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
