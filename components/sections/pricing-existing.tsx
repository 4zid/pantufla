"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import { useCopy } from "@/components/copy-provider";
import { gsap, registerGsap } from "@/lib/motion";
import { toneTextDeep } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Desplegable para el que ya tiene un sitio hecho.
 *
 * Va plegado: el que viene a ver precios no tiene por qué leerlo, y abierto de
 * entrada le compite a las tarjetas. Pero tampoco es una pregunta frecuente
 * —es plata que entra— así que ocupa una fila entera abajo de los planes en
 * vez de perderse en el FAQ.
 *
 * La apertura va en tres tiempos para que no sea un salto: primero la altura,
 * después el bloque entero, y recién ahí las filas de a una. Al cerrar no hay
 * escalonado: escalonar la salida se siente lento.
 */
export function PricingExisting() {
  const { existing } = useCopy().pricing;
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = panel.current;
      if (!el) return;

      const inner = el.firstElementChild;
      const rows = el.querySelectorAll<HTMLElement>("[data-row]");
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(el, { height: open ? "auto" : 0 });
        gsap.set([inner, ...rows], { opacity: open ? 1 : 0, y: 0 });
        return;
      }

      gsap.to(el, {
        height: open ? "auto" : 0,
        duration: 0.6,
        ease: "power3.inOut",
      });

      gsap.to(inner, {
        opacity: open ? 1 : 0,
        y: open ? 0 : -10,
        duration: 0.45,
        delay: open ? 0.1 : 0,
        ease: "power2.out",
      });

      gsap.to(rows, {
        opacity: open ? 1 : 0,
        y: open ? 0 : 14,
        duration: 0.5,
        delay: open ? 0.18 : 0,
        stagger: open ? 0.06 : 0,
        ease: "power3.out",
      });
    },
    { dependencies: [open] },
  );

  return (
    <div className="mt-5 overflow-hidden rounded-panel border border-line bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="planes-sitio-existente"
        className="group flex w-full items-center justify-between gap-6 p-7 text-left lg:p-8"
      >
        <span>
          <span className="block text-[1.15rem] font-semibold tracking-[-0.03em] sm:text-[1.3rem]">
            {existing.title}
          </span>
          <span className="mt-2 block max-w-xl text-[0.95rem] leading-snug text-ink-soft">
            {existing.summary}
          </span>
        </span>

        <span
          aria-hidden
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300",
            open
              ? "border-verde-deep bg-verde-deep text-white"
              : "border-line-strong text-ink-soft group-hover:border-ink group-hover:text-ink",
          )}
        >
          <PlusIcon
            className={cn(
              "h-4 w-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
              open && "rotate-[135deg]",
            )}
          />
        </span>
      </button>

      <div
        id="planes-sitio-existente"
        ref={panel}
        aria-hidden={!open}
        className="overflow-hidden"
        style={open ? undefined : { height: 0 }}
      >
        <div
          className="border-t border-line px-7 pb-7 pt-7 lg:px-8 lg:pb-8"
          style={open ? undefined : { opacity: 0 }}
        >
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            {/* Las dos plataformas: qué tocamos adentro de cada una. */}
            <div className="space-y-4">
              {existing.platforms.map((platform) => (
                <div
                  key={platform.name}
                  data-row
                  style={open ? undefined : { opacity: 0 }}
                  className="rounded-2xl border border-line bg-card p-5"
                >
                  {/*
                    El isologotipo original de cada plataforma: la marca con su
                    color y la tipografía en negro, que es la versión que las
                    dos publican para fondo claro. Va suelto sobre la tarjeta,
                    sin pastilla de color detrás: teñir un logo ajeno con la
                    paleta de uno lo deja pareciendo una imitación.

                    Sin texto al lado porque el logotipo ya trae el nombre.
                  */}
                  <Image
                    src={platform.logo}
                    alt={platform.name}
                    width={platform.logoWidth}
                    height={20}
                    unoptimized
                    className="h-5 w-auto"
                  />
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
                    {platform.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Qué se puede pedir, en filas: separarlas por estructura y no
                por iconos es lo que las hace distinguibles de un vistazo. */}
            <div>
              <dl className="border-t border-line">
                {existing.services.map((service, i) => (
                  <div
                    key={service.title}
                    data-row
                    style={open ? undefined : { opacity: 0 }}
                    className="flex gap-5 border-b border-line py-4"
                  >
                    <dt className="flex min-w-0 shrink-0 items-baseline gap-3 sm:w-44">
                      <span
                        className={cn(
                          "text-[0.8rem] font-semibold tabular-nums",
                          toneTextDeep[
                            (["aqua", "rosa", "verde", "miel"] as const)[i % 4]
                          ],
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.98rem] font-medium leading-snug">
                        {service.title}
                      </span>
                    </dt>
                    <dd className="text-[0.92rem] leading-relaxed text-ink-soft">
                      {service.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-[0.88rem] leading-relaxed text-ink-faint">
                  {existing.note}
                </p>
                <ButtonLink href={existing.cta.href} className="shrink-0">
                  {existing.cta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
