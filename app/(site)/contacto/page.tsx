import type { Metadata } from "next";
import { Suspense } from "react";

import { BriefForm } from "@/components/brief-form";
import { CheckIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { finalCta, process, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Empezar un proyecto",
  description:
    "Contanos qué necesitás. En 24 horas te respondemos con alcance, precio y fecha de entrega.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Empezar un proyecto"
        title="Cinco minutos ahora, una propuesta cerrada mañana."
        lead="Cuanto más concreto sea el brief, más preciso es el presupuesto que te mandamos. No hace falta que tengas todo definido."
      />

      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Suspense
            fallback={
              <div className="h-[640px] rounded-panel border border-line bg-card" />
            }
          >
            <BriefForm />
          </Suspense>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Qué pasa después</p>
            <ul className="mt-6 space-y-4">
              {finalCta.expectations.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem]">
                  <CheckIcon className="mt-[5px] h-4 w-4 shrink-0 text-aqua-deep" />
                  <span className="leading-relaxed text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-panel border border-line bg-card p-6">
              <p className="text-[0.95rem] font-medium">
                ¿Preferís escribir directo?
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 inline-block text-[0.95rem] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                {site.email}
              </a>
              <p className="mt-5 border-t border-line pt-5 text-[0.88rem] leading-relaxed text-ink-faint">
                {process.payment}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
