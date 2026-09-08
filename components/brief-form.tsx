"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { budgetRanges, pricing, site, timelineOptions } from "@/content/site";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[0.98rem] text-ink transition-colors placeholder:text-ink-faint focus:border-ink focus:outline-none";

const labelClass = "block text-[0.88rem] font-medium";

const planOptions = [
  ...pricing.plans.map((plan) => ({ value: plan.id, label: plan.name })),
  { value: "no-se", label: "Todavía no sé cuál me sirve" },
];

export function BriefForm() {
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
      planOptions.find((p) => p.value === data.plan)?.label ?? String(data.plan);

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, plan: planLabel }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "No pudimos enviarlo");

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No pudimos enviarlo");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-panel border border-line bg-card p-8 md:p-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aqua-soft text-aqua-deep">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h2 className="mt-5 text-h3">Recibido. Gracias.</h2>
        <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-ink-soft">
          Lo leemos hoy mismo. Dentro de las próximas 24 horas hábiles te
          respondemos con el alcance, el precio y la fecha de entrega, o te
          decimos con franqueza si no somos los indicados para este proyecto.
        </p>
        <p className="mt-5 text-[0.9rem] text-ink-faint">
          ¿Es urgente? Escribinos a{" "}
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
      className="rounded-panel border border-line bg-card p-6 md:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            Nombre y apellido
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Ana Ríos"
            className={`${fieldClass} mt-2`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ana@empresa.com"
            className={`${fieldClass} mt-2`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="company">
          Empresa o proyecto{" "}
          <span className="font-normal text-ink-faint">(opcional)</span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          placeholder="Estudio Martel"
          className={`${fieldClass} mt-2`}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="plan">
            Plan
          </label>
          <select
            id="plan"
            name="plan"
            defaultValue={initialPlan}
            className={`${fieldClass} mt-2`}
          >
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="budget">
            Presupuesto <span className="font-normal text-ink-faint">(USD)</span>
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue={budgetRanges[1]}
            className={`${fieldClass} mt-2`}
          >
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="timeline">
            Plazo
          </label>
          <select
            id="timeline"
            name="timeline"
            defaultValue={timelineOptions[1]}
            className={`${fieldClass} mt-2`}
          >
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          ¿Qué necesitás?
        </label>
        <p className="mt-1 text-[0.85rem] text-ink-faint">
          Qué hacés, a quién le vendés y qué querés que el sitio consiga. Con tres
          o cuatro líneas alcanza.
        </p>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tenemos un estudio de arquitectura en Córdoba. Queremos mostrar las obras y que nos lleguen consultas de obra nueva…"
          className={`${fieldClass} mt-2 resize-y`}
        />
      </div>

      {/* Trampa para bots: oculta a la vista y fuera del orden de tabulación. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No completar</label>
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
          {status === "sending" ? "Enviando…" : "Enviar el brief"}
        </Button>
        <p className="text-[0.85rem] leading-relaxed text-ink-faint">
          Respondemos en 24 horas hábiles. No compartimos tus datos con nadie.
        </p>
      </div>
    </form>
  );
}
