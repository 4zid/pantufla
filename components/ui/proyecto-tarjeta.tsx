"use client";

import Image from "next/image";
import Link from "next/link";

import { useCopy, useHref } from "@/components/copy-provider";
import { Reveal } from "@/components/motion/reveal";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { dominioDe, mockupDe, type PantallaMockup } from "@/content/mockup";
import type { SanityProject } from "@/sanity/types";

/*
   Los tamaños pedidos al optimizador. La grilla es de dos columnas desde md
   adentro de .shell (72rem): la tarjeta mide hasta ~550px, la ventana el 80%
   y el teléfono el 21%.
*/
const SIZES_VENTANA = "(min-width: 768px) 460px, 82vw";
const SIZES_TELEFONO = "(min-width: 768px) 120px, 22vw";

/**
 * La ventana: una barra con tres puntos y el dominio, y la captura abajo.
 * Es la misma ventana de la galería del hero, más chica y con la dirección
 * del sitio, que dice de un vistazo que es un sitio publicado.
 */
function Ventana({
  pantalla,
  dominio,
  titulo,
}: {
  pantalla?: PantallaMockup;
  dominio: string | null;
  titulo: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-card shadow-[0_24px_50px_-32px_rgba(17,24,60,0.5)] md:rounded-[12px]">
      <div
        aria-hidden
        className="flex h-[18px] shrink-0 items-center gap-[4px] border-b border-line px-2 md:h-[22px] md:gap-[5px] md:px-2.5"
      >
        <i className="h-[5px] w-[5px] rounded-full bg-line-strong md:h-[6px] md:w-[6px]" />
        <i className="h-[5px] w-[5px] rounded-full bg-line-strong md:h-[6px] md:w-[6px]" />
        <i className="h-[5px] w-[5px] rounded-full bg-line-strong md:h-[6px] md:w-[6px]" />
        {dominio ? (
          <span className="mx-auto max-w-[60%] truncate rounded-full bg-paper-alt px-2.5 text-[8px] leading-[13px] text-ink-faint md:text-[9px] md:leading-[15px]">
            {dominio}
          </span>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1 bg-paper-alt">
        {pantalla ? (
          <Image
            src={pantalla.src}
            alt=""
            fill
            sizes={SIZES_VENTANA}
            className="object-cover object-top"
          />
        ) : (
          /* Sin captura, el nombre: la ventana sigue diciendo «sitio» sin
             mostrar algo que no es. */
          <span
            aria-hidden
            translate="no"
            className="absolute inset-0 flex items-center justify-center text-[1.4rem] font-semibold tracking-[-0.035em] text-ink-faint md:text-[1.75rem]"
          >
            {titulo}
          </span>
        )}
      </div>
    </div>
  );
}

/** El teléfono: el marco oscuro, la isla y la captura adentro. */
function Telefono({ pantalla }: { pantalla: PantallaMockup }) {
  return (
    <div className="h-full rounded-[16px] bg-[#101012] p-[3px] shadow-[0_24px_44px_-24px_rgba(17,24,60,0.6)] md:rounded-[20px] md:p-1">
      <div className="relative h-full overflow-hidden rounded-[13px] bg-card md:rounded-[16px]">
        <Image
          src={pantalla.src}
          alt=""
          fill
          sizes={SIZES_TELEFONO}
          className="object-cover object-top"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-[2.5%] h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-[#101012]"
        />
      </div>
    </div>
  );
}

/**
 * La tarjeta de un proyecto: el mockup arriba —una ventana y un teléfono
 * sobre un plano gris, nada más— y abajo el nombre, el rubro, la bajada y
 * los enlaces.
 *
 * El mockup lleva al sitio publicado. Al pasar el mouse se desenfoca y en el
 * medio aparece una pastilla blanca con «Ver sitio»: dice qué pasa con el
 * clic sin tapar las capturas mientras nadie las está apuntando. Es blanca
 * con letra negra en los dos temas, porque se apoya sobre las capturas, que
 * son claras.
 *
 * Ese enlace es para el mouse y nada más: va fuera del orden del teclado y
 * escondido del lector de pantalla, porque abajo están los mismos destinos
 * en texto —«Leer el caso» cuando está escrito y «Ver sitio» siempre—, que
 * es lo que usan el teclado y el teléfono, donde no hay mouse que haga
 * aparecer la pastilla. Dos enlaces al mismo lugar en el orden del teclado
 * serían una parada de más en cada tarjeta.
 *
 * Las capturas van con alt vacío: son decorado, y el nombre del proyecto
 * está en el titular. Con menos movimiento pedido el desenfoque y la
 * pastilla aparecen sin transición.
 */
export function ProyectoTarjeta({
  proyecto,
  heading: Titulo = "h3",
}: {
  proyecto: SanityProject;
  heading?: "h2" | "h3";
}) {
  const { work } = useCopy();
  const href = useHref();
  const { escritorio, telefono } = mockupDe(proyecto);
  const dominio = dominioDe(proyecto.url);

  const caso = proyecto.conCaso ? href(`/proyectos/${proyecto.slug}`) : null;
  const sitio = proyecto.url;

  /* Con teléfono, la ventana se corre arriba a la izquierda y el teléfono
     se apoya abajo a la derecha, montado sobre ella. Sin teléfono, la
     ventana va al centro. */
  const mockup = (
    <div className="absolute inset-0 transition-[filter,transform] duration-500 ease-out group-hover/escenario:scale-[1.02] group-hover/escenario:blur-[6px] motion-reduce:transition-none">
      <div
        className={`absolute left-[10%] w-[80%] ${
          telefono ? "top-[12%]" : "top-1/2 -translate-y-1/2"
        }`}
      >
        <div className="aspect-[16/10.6]">
          <Ventana
            pantalla={escritorio}
            dominio={dominio}
            titulo={proyecto.title}
          />
        </div>
      </div>
      {telefono ? (
        <div className="absolute bottom-[7%] right-[7%] aspect-[9/19.5] w-[21%]">
          <Telefono pantalla={telefono} />
        </div>
      ) : null}
    </div>
  );
  const escenario =
    "relative block aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line bg-paper-alt md:rounded-[1.5rem]";

  return (
    <article>
      {sitio ? (
        <a
          href={sitio}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden
          className={`group/escenario ${escenario}`}
        >
          {mockup}
          <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 translate-y-[calc(-50%+6px)] items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[0.88rem] font-medium text-[#121212] opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] transition-[opacity,translate] duration-300 ease-out group-hover/escenario:-translate-y-1/2 group-hover/escenario:opacity-100 motion-reduce:transition-none">
            {work.view}
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </span>
        </a>
      ) : (
        <div className={escenario}>{mockup}</div>
      )}

      <div className="mt-5 flex items-baseline justify-between gap-6">
        <Titulo
          translate="no"
          className="text-[1.15rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.25rem]"
        >
          {proyecto.title}
        </Titulo>
        {proyecto.sector ? (
          <span className="shrink-0 text-[0.8rem] text-ink-faint">
            {proyecto.sector}
          </span>
        ) : null}
      </div>
      {proyecto.tagline ? (
        <p className="mt-2 max-w-[34rem] text-[0.92rem] leading-relaxed text-ink-soft">
          {proyecto.tagline}
        </p>
      ) : null}

      {/* El caso primero, cuando está escrito: es lo que esta página tiene
          y el sitio publicado no. */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] font-medium">
        {caso ? (
          <Link
            href={caso}
            className="group/caso inline-flex items-center gap-1.5 text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
          >
            {work.readCase}
            <span className="sr-only">: {proyecto.title}</span>
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/caso:translate-x-0.5" />
          </Link>
        ) : null}
        {sitio ? (
          <a
            href={sitio}
            target="_blank"
            rel="noreferrer"
            className={
              caso
                ? "inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
                : "inline-flex items-center gap-1 text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            }
          >
            {work.view}
            <span className="sr-only">: {proyecto.title}</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * La grilla de tarjetas: dos columnas desde md, una en el teléfono. La usan
 * la home (los cuatro destacados) y /proyectos (todos).
 */
export function GrillaProyectos({
  proyectos,
  heading,
  className,
}: {
  proyectos: SanityProject[];
  heading?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Reveal
      stagger
      className={`grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-16 ${className ?? ""}`}
    >
      {proyectos.map((proyecto) => (
        <ProyectoTarjeta
          key={proyecto._id}
          proyecto={proyecto}
          heading={heading}
        />
      ))}
    </Reveal>
  );
}
