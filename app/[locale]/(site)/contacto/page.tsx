import type { Metadata } from "next";
import { Suspense } from "react";

import { BriefForm } from "@/components/brief-form";
import { CheckIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import { localeHref, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getCopy(locale);
  return {
    title: pages.contacto.metaTitle,
    description: pages.contacto.metaDescription,
    alternates: {
      canonical: localeHref("/contacto", locale),
      languages: { es: "/contacto", en: "/en/contacto" },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const { pages, finalCta, process } = await getCopy(locale);

  return (
    <>
      <PageHeader
        icon="ruta"
        eyebrow={pages.contacto.eyebrow}
        title={pages.contacto.title}
        lead={pages.contacto.lead}
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
            <p className="eyebrow">{finalCta.expectationsTitle}</p>
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
                {pages.contacto.directTitle}
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
