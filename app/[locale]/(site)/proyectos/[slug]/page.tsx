import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FinalCta } from "@/components/sections/final-cta";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { Prose } from "@/components/ui/portable-text";
import { JsonLd } from "@/components/json-ld";
import { fallbackProjects } from "@/content/fallback-content";
import { site } from "@/content/site";
import { getCopy } from "@/content/get-copy";
import { localeHref, locales, type Locale } from "@/lib/i18n";
import { ID_ESTUDIO, absoluta, migas, nodoPagina } from "@/lib/schema";
import { sanityFetch } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/queries";
import type { SanityProject } from "@/sanity/types";

export const revalidate = 60;

type Params = { params: Promise<{ locale: Locale; slug: string }> };

async function getProject(slug: string) {
  const fromCms = await sanityFetch<SanityProject | null>(
    projectBySlugQuery,
    { slug },
    null,
    ["project"],
  );
  return fromCms ?? fallbackProjects.find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(projectSlugsQuery, {}, []);
  const all = slugs.length ? slugs : fallbackProjects.map((p) => p.slug);
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "404" };

  // El canónico tiene que llevar el prefijo del idioma. Sin él, la ficha en
  // inglés declaraba como canónica la dirección en español: le estaba diciendo
  // al buscador que la versión inglesa es una copia y que no la indexe.
  const ruta = `/proyectos/${project.slug}`;
  return {
    title: project.title,
    description: project.tagline,
    alternates: {
      canonical: localeHref(ruta, locale),
      languages: Object.fromEntries(
        locales.map((otro) => [otro, localeHref(ruta, otro)]),
      ),
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { locale, slug } = await params;
  const [project, { pages }] = await Promise.all([
    getProject(slug),
    getCopy(locale),
  ]);
  if (!project) notFound();

  const cover = urlForImage(project.cover)?.width(1600).height(1000).url();

  return (
    <>
      <article>
        <div className="shell pb-14 pt-12 md:pt-16">
          <Link
            href={localeHref("/proyectos", locale)}
            className="group inline-flex items-center gap-2 text-[0.9rem] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowIcon className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {pages.proyectos.eyebrow}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h1 className="text-h2">{project.title}</h1>
              {project.tagline ? (
                <p className="mt-5 max-w-xl text-lead text-ink-soft">
                  {project.tagline}
                </p>
              ) : null}
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-medium"
                >
                  Ver el sitio publicado
                  <ArrowUpRightIcon className="h-4 w-4 text-ink-faint transition-colors group-hover:text-aqua-deep" />
                </a>
              ) : null}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 text-[0.9rem] sm:grid-cols-4 lg:grid-cols-2">
              {project.sector ? (
                <div>
                  <dt className="text-ink-faint">Rubro</dt>
                  <dd className="mt-1 font-medium">{project.sector}</dd>
                </div>
              ) : null}
              {project.plan ? (
                <div>
                  <dt className="text-ink-faint">Plan</dt>
                  <dd className="mt-1 font-medium">{project.plan}</dd>
                </div>
              ) : null}
              {project.deliveredIn ? (
                <div>
                  <dt className="text-ink-faint">Entrega</dt>
                  <dd className="mt-1 font-medium">{project.deliveredIn}</dd>
                </div>
              ) : null}
              {project.year ? (
                <div>
                  <dt className="text-ink-faint">Año</dt>
                  <dd className="mt-1 font-medium">{project.year}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <div className="shell">
          <div className="relative aspect-[16/10] overflow-hidden rounded-panel border border-line bg-paper-alt">
            {cover ? (
              <Image
                src={cover}
                alt={project.cover?.alt || project.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(150deg, #e9dfd2 0%, #c9b8a3 100%)",
                }}
              />
            )}
          </div>
        </div>

        {project.results?.length ? (
          <div className="shell mt-14">
            <div className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {project.results.map((result) => (
                <div key={result.label} className="bg-paper p-7">
                  <p className="text-[2rem] font-semibold leading-none tracking-[-0.035em]">
                    {result.value}
                  </p>
                  <p className="mt-2.5 text-[0.9rem] text-ink-soft">
                    {result.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="shell py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
            {project.services?.length ? (
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow">Qué hicimos</p>
                <ul className="mt-5 space-y-2.5">
                  {project.services.map((service) => (
                    <li key={service} className="text-[0.95rem] text-ink-soft">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div />
            )}

            <div>
              {project.body?.length ? (
                <Prose value={project.body} />
              ) : (
                <p className="text-[1.02rem] leading-[1.7] text-ink-soft">
                  El detalle de este caso todavía no está cargado. Podés escribirlo
                  desde el panel de contenido, en el campo “Caso completo”.
                </p>
              )}

              {project.gallery?.length ? (
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                  {project.gallery.map((image, i) => {
                    const url = urlForImage(image)?.width(900).height(700).url();
                    if (!url) return null;
                    return (
                      <Image
                        key={i}
                        src={url}
                        alt={image.alt || ""}
                        width={900}
                        height={700}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="rounded-card border border-line object-cover"
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
      <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: `/proyectos/${project.slug}`,
            title: project.title,
            description: project.tagline,
          }),
          migas(locale, [
            { name: site.name, path: "/" },
            { name: pages.proyectos.eyebrow, path: "/proyectos" },
            { name: project.title, path: `/proyectos/${project.slug}` },
          ]),
          {
            // El trabajo, no la ficha: lo que identifica al proyecto es el
            // sitio publicado. Así un motor puede atar esa dirección con este
            // estudio.
            "@type": "WebSite",
            ...(project.url ? { "@id": project.url, url: project.url } : {}),
            name: project.title,
            ...(project.tagline ? { description: project.tagline } : {}),
            creator: { "@id": ID_ESTUDIO },
            mainEntityOfPage: absoluta(`/proyectos/${project.slug}`, locale),
          },
        ]}
      />
    </>
  );
}
