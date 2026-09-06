import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock } from "sanity";

import { urlForImage } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 text-[1.02rem] leading-[1.7] text-ink-soft">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 text-[1.6rem] font-semibold tracking-[-0.025em]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 text-[1.25rem] font-semibold tracking-[-0.02em]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-clay pl-5 text-[1.1rem] leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-2 pl-5 text-[1.02rem] leading-[1.7] text-ink-soft [&>li]:list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 space-y-2 pl-5 text-[1.02rem] leading-[1.7] text-ink-soft [&>li]:list-decimal">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-clay"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1400).url();
      if (!url) return null;
      return (
        <figure className="mt-10">
          <Image
            src={url}
            alt={value?.alt || ""}
            width={1400}
            height={900}
            sizes="(max-width: 768px) 100vw, 720px"
            className="rounded-card border border-line"
          />
          {value?.caption ? (
            <figcaption className="mt-3 text-[0.85rem] text-ink-faint">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function Prose({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="max-w-[68ch]">
      <PortableText value={value} components={components} />
    </div>
  );
}
