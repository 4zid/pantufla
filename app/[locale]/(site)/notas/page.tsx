import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FinalCta } from "@/components/sections/final-cta";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { getCopy } from "@/content/get-copy";
import { localeHref, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { allPostsQuery } from "@/sanity/queries";
import type { SanityPost } from "@/sanity/types";

export const revalidate = 60;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { pages } = await getCopy(locale);
  return {
    title: pages.notas.metaTitle,
    description: pages.notas.lead,
    alternates: {
      canonical: localeHref("/notas", locale),
      languages: { es: "/notas", en: "/en/notas" },
    },
  };
}

/** La fecha se escribe como la escribe cada idioma, no traducida a mano. */
function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function NotesPage({ params }: Props) {
  const { locale } = await params;
  const [{ pages }, posts] = await Promise.all([
    getCopy(locale),
    sanityFetch<SanityPost[]>(allPostsQuery, { language: locale }, [], ["post"]),
  ]);

  return (
    <>
      <PageHeader
        icon="capas"
        eyebrow={pages.notas.eyebrow}
        title={pages.notas.title}
        lead={pages.notas.lead}
      />

      <div className="shell py-16 md:py-20">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = urlForImage(post.cover)?.width(800).height(500).url();
              return (
                <Link
                  key={post._id}
                  href={localeHref(`/notas/${post.slug}`, locale)}
                  className="group flex flex-col overflow-hidden rounded-panel border border-line bg-card transition-colors hover:border-line-strong"
                >
                  {image ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-paper-alt">
                      <Image
                        src={image}
                        alt={post.cover?.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2.5 text-[0.8rem] text-ink-faint">
                      {post.topic ? (
                        <>
                          <span className="font-medium text-aqua-deep">{post.topic}</span>
                          <span className="h-1 w-1 rounded-full bg-line-strong" />
                        </>
                      ) : null}
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt, locale)}
                      </time>
                    </div>
                    <h2 className="mt-3 flex items-start justify-between gap-3 text-[1.12rem] font-semibold leading-snug tracking-[-0.02em]">
                      {post.title}
                      <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-aqua-deep" />
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-panel border border-dashed border-line-strong p-12 text-center">
            <p className="text-[1.05rem] font-medium">{pages.notas.empty}</p>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-ink-soft">
              Las notas se escriben desde el panel de contenido, en{" "}
              <Link href="/studio" className="underline underline-offset-4">
                /studio
              </Link>
              . Apenas publiques la primera, aparece acá.
            </p>
          </div>
        )}
      </div>

      <FinalCta />
    </>
  );
}
