import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/final-cta";
import { ArrowIcon } from "@/components/ui/icons";
import { Prose } from "@/components/ui/portable-text";
import { localeHref, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/queries";
import type { SanityPost } from "@/sanity/types";

export const revalidate = 60;

type Params = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(postSlugsQuery, {}, []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<SanityPost | null>(
    postBySlugQuery,
    { slug },
    null,
    ["post"],
  );
  if (!post) return { title: "Nota no encontrada" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/notas/${post.slug}` },
    openGraph: { type: "article", publishedTime: post.publishedAt },
  };
}

export default async function PostPage({ params }: Params) {
  const { locale, slug } = await params;
  const post = await sanityFetch<SanityPost | null>(
    postBySlugQuery,
    { slug },
    null,
    ["post"],
  );
  if (!post) notFound();

  const cover = urlForImage(post.cover)?.width(1600).height(900).url();
  const date = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <>
      <article className="shell py-12 md:py-16">
        <Link
          href={localeHref("/notas", locale)}
          className="group inline-flex items-center gap-2 text-[0.9rem] text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowIcon className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Todas las notas
        </Link>

        <header className="mt-10 max-w-[68ch]">
          <div className="flex items-center gap-2.5 text-[0.85rem] text-ink-faint">
            {post.topic ? (
              <>
                <span className="font-medium text-aqua-deep">{post.topic}</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
              </>
            ) : null}
            <time dateTime={post.publishedAt}>{date}</time>
          </div>
          <h1 className="mt-4 text-h2">{post.title}</h1>
          {post.excerpt ? (
            <p className="mt-5 text-lead text-ink-soft">{post.excerpt}</p>
          ) : null}
        </header>

        {cover ? (
          <Image
            src={cover}
            alt={post.cover?.alt || post.title}
            width={1600}
            height={900}
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="mt-12 rounded-panel border border-line object-cover"
          />
        ) : null}

        <div className="mt-12">
          <Prose value={post.body} />
        </div>
      </article>

      <FinalCta />
    </>
  );
}
