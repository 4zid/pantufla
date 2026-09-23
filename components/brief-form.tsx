"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { useCopy } from "@/components/copy-provider";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[0.98rem] text-ink transition-colors placeholder:text-ink-faint focus:border-ink focus:outline-none";

const labelClass = "block text-[0.88rem] font-medium";

/**
 * El selector: el mismo campo, sin la flecha del sistema y con la nuestra.
 *
 * Con la apariencia nativa, Safari pinta su flecha pegada al borde de la
 * derecha y el texto sigue corriendo por debajo, así que «En 2 a 4 semanas»
 * terminaba en «semana». Acá el campo reserva lugar para la flecha, la flecha
 * es un ícono nuestro que no recibe clics, y el texto largo se corta con
 * puntos suspensivos en vez de meterse abajo.
 */
function Selector({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select
        {...props}
        className={`${fieldClass} appearance-none truncate pr-10`}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}

export function BriefForm() {
  const { form, pricing } = useCopy();

  // Las opciones se arman con los planes reales más las tres salidas que no
  // son un plan. Van adentro del componente porque ahora dependen del idioma:
  // el que llega en inglés tiene que poder elegir en inglés, y el mail que nos
  // llega dice lo mismo que vio la persona al elegir.
  const planOptions = [
    ...pricing.plans.map((plan) => ({ value: plan.id, label: plan.name })),
    ...form.extraPlans,
  ];
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan");
  const initialPlan = planOptions.some((p) => p.value === planFromUrl)
    ? (planFromUrl as string)
    : "sitio";

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const planLabel =
      planOptions.find((p) => p.value === data.plan)?.label ??
      String(data.plan);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, plan: planLabel }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || form.genericError);

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : form.genericError);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-panel border border-line bg-card p-8 text-ink md:p-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aqua-soft text-aqua-deep">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h2 className="mt-5 text-h3">{form.success.title}</h2>
        <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
          {form.success.body}
        </p>
        <p className="mt-5 text-[0.9rem] text-ink-faint">
          {form.success.urgent}{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-panel border border-line bg-card p-6 text-ink md:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            {form.name.label}
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder={form.name.placeholder}
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            {form.email.label}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={form.email.placeholder}
            className={`${fieldClass} mt-2`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="company">
          {form.company.label}{" "}
          <span className="font-normal text-ink-faint">
            {form.company.optional}
          </span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder={form.company.placeholder}
          className={`${fieldClass} mt-2`}
        />
      </div>

      {/*
        Tres columnas desiguales: el plan es una palabra y las otras dos son
        una frase. Repartidas iguales, «En 2 a 4 semanas» no entraba en la
        columna del formulario y se cortaba con puntos suspensivos. Entre lg
        y xl el formulario ya está en su columna pero todavía es angosto, y
        tres no entran de ningún modo: ahí van dos y el plazo abajo, ancho.
      */}
      <div className="mt-5 grid gap-5 sm:grid-cols-[0.75fr_1.15fr_1.1fr] lg:grid-cols-2 xl:grid-cols-[0.75fr_1.15fr_1.1fr]">
        <div>
          <label className={labelClass} htmlFor="plan">
            {form.plan.label}
          </label>
          <Selector
            id="plan"
            name="plan"
            defaultValue={initialPlan}
            className="mt-2"
          >
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Selector>
        </div>

        <div>
          <label className={labelClass} htmlFor="budget">
            {form.budget.label}{" "}
            <span className="font-normal text-ink-faint">
              {form.budget.currency}
            </span>
          </label>
          <Selector
            id="budget"
            name="budget"
            defaultValue={form.budgetRanges[1]}
            className="mt-2"
          >
            {form.budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Selector>
        </div>

        <div className="lg:col-span-2 xl:col-span-1">
          <label className={labelClass} htmlFor="timeline">
            {form.timeline.label}
          </label>
          <Selector
            id="timeline"
            name="timeline"
            defaultValue={form.timelineOptions[1]}
            className="mt-2"
          >
            {form.timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Selector>
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          {form.message.label}
        </label>
        <p className="mt-1 text-[0.85rem] text-ink-faint">
          {form.message.hint}
        </p>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={form.message.placeholder}
          className={`${fieldClass} mt-2 resize-y`}
        />
      </div>

      {/* Trampa para bots: oculta a la vista y fuera del orden de tabulación. */}
      <div
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">{form.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="mt-5 text-[0.9rem] text-aqua-deep">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="w-full shrink-0 sm:w-auto"
        >
          {status === "sending" ? form.sending : form.submit}
        </Button>
        <p className="text-[0.85rem] leading-relaxed text-ink-faint">
          {form.privacy}
        </p>
      </div>
    </form>
  );
}
