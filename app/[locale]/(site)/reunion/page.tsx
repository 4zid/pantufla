import type { Metadata } from "next";
import Link from "next/link";

import { Booking } from "@/components/sections/booking";
import { Reveal } from "@/components/motion/reveal";
import { ArrowIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/content/site";
import { getCopy } from "@/content/get-copy";
import { ID_ESTUDIO, absoluta, migas, nodoPagina } from "@/lib/schema";
import { localeHref, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { meeting } = await getCopy(locale);
  return {
    title: meeting.metaTitle,
    description: meeting.metaDescription,
    alternates: {
      canonical: localeHref("/reunion", locale),
      languages: { es: "/reunion", en: "/en/reunion" },
    },
  };
}

/**
 * La página de reservas.
 *
 * Las tres cosas que pasan en la llamada van arriba del calendario y no al
 * costado. Al costado competirían por el ancho justo con lo único que hay que
 * hacer acá, que es elegir un día: el mes necesita lugar, y apretado contra una
 * columna de texto obliga a scrollear dentro del embed, que es de las peores
 * cosas que le podés hacer a alguien en un teléfono.
 *
 * Arriba tienen otra ventaja: se leen antes de elegir. Nadie reserva veinte
 * minutos de su semana sin saber qué va a pasar en ellos, y si la respuesta
 * está al costado del calendario llega tarde.
 */
export default async function ReunionPage({ params }: Props) {
  const { locale } = await params;
  const { meeting } = await getCopy(locale);

  return (
    <>
      <PageHeader
        icon="ayuda"
        eyebrow={meeting.eyebrow}
        title={meeting.title}
        lead={meeting.lead}
      />

      <div className="py-14 md:py-20">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{meeting.expectTitle}</p>
          </Reveal>

          <Reveal stagger className="mt-7 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {meeting.expect.map((paso, i) => (
              <div key={paso.title} className="border-t border-line pt-5">
                <span
                  aria-hidden
                  className="text-[0.78rem] font-semibold tabular-nums text-aqua-deep"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[1.05rem] font-semibold tracking-[-0.02em]">
                  {paso.title}
                </p>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-ink-soft">
                  {paso.detail}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* El calendario va en el contenedor ancho: el mes es una grilla de
            siete columnas y en el ancho de lectura entra pero se lee apretado. */}
        <div className="shell-wide mt-12 md:mt-16">
          <Reveal>
            <Booking />
          </Reveal>
        </div>

        {/* La salida para quien no quiere hablar. Va abajo y en voz baja: el
            camino del brief no menciona la reunión en ningún lado, y este no
            debería empujar al otro, solo dejarlo a mano para el que llegó acá
            sin querer una llamada. */}
        <div className="shell mt-12 text-center">
          <Reveal>
            <p className="text-[0.95rem] text-ink-faint">
              {meeting.preferWrite}
            </p>
            <Link
              href={meeting.write.href}
              className="group mt-2 inline-flex items-center gap-2 py-2 text-[0.98rem] font-medium"
            >
              {meeting.write.label}
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>

      <JsonLd
        nodos={[
          nodoPagina({
            locale,
            path: "/reunion",
            title: meeting.title,
            description: meeting.metaDescription,
          }),
          /* Una reserva es una acción, y declararla así es lo que permite que
             un motor de respuesta conteste «sí, se puede agendar» con el link
             en vez de mandar a la home a buscarlo. */
          {
            "@type": "ReserveAction",
            name: meeting.metaTitle,
            target: {
              "@type": "EntryPoint",
              urlTemplate: absoluta("/reunion", locale),
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
              ],
            },
            provider: { "@id": ID_ESTUDIO },
          },
          migas(locale, [
            { name: site.name, path: "/" },
            { name: meeting.eyebrow, path: "/reunion" },
          ]),
        ]}
      />
    </>
  );
}
