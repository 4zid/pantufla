import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/final-cta";
import { ArrowIcon } from "@/components/ui/icons";
import { Prose } from "@/components/ui/portable-text";
import { JsonLd } from "@/components/json-ld";
import { getCopy } from "@/content/get-copy";
import { site } from "@/content/site";
import { localeHref, locales, type Locale } from "@/lib/i18n";
import { ID_ESTUDIO, absoluta, migas } from "@/lib/schema";
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
  const { locale, slug } = await params;
  const post = await sanityFetch<SanityPost | null>(
    postBySlugQuery,
    { slug },
    null,
    ["post"],
  );
  if (!post) return { title: "404" };

  // Con el prefijo del idioma: ver la nota en la ficha de proyecto.
  const ruta = `/notas/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: localeHref(ruta, locale),
      languages: Object.fromEntries(
        locales.map((otro) => [otro, localeHref(ruta, otro)]),
      ),
    },
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
  const { pages } = await getCopy(locale);

  const cover = urlForImage(post.cover)?.width(1600).height(900).url();
  // La fecha en el idioma de la página: «12 de marzo de 2026» abajo de un
  // título en inglés se lee como un descuido.
  const date = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-AR", {
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
          {pages.notas.eyebrow}
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
      <JsonLd
        nodos={[
          {
            "@type": "Article",
            "@id": `${absoluta(`/notas/${post.slug}`, locale)}#pagina`,
            headline: post.title,
            ...(post.excerpt ? { description: post.excerpt } : {}),
            ...(cover ? { image: cover } : {}),
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            inLanguage: locale,
            author: { "@id": ID_ESTUDIO },
            publisher: { "@id": ID_ESTUDIO },
            mainEntityOfPage: absoluta(`/notas/${post.slug}`, locale),
          },
          migas(locale, [
            { name: site.name, path: "/" },
            { name: pages.notas.eyebrow, path: "/notas" },
            { name: post.title, path: `/notas/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}
