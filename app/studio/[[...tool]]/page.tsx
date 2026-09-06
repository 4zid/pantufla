import Link from "next/link";

import { hasSanity } from "@/sanity/env";

import { StudioClient } from "./studio-client";

export const dynamic = "force-static";

export const metadata = {
  title: "Contenido",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  // Sin projectId el Studio no puede arrancar: en vez de tirar un 500,
  // explicamos qué falta.
  if (!hasSanity) return <StudioSetup />;

  return <StudioClient />;
}

function StudioSetup() {
  const steps = [
    "Creá un proyecto en sanity.io/manage (dataset: production).",
    "Copiá el Project ID y pegalo en NEXT_PUBLIC_SANITY_PROJECT_ID.",
    "Agregá http://localhost:3000 y tu dominio como CORS origins con credenciales.",
    "Reiniciá el servidor y volvé a esta página.",
  ];

  return (
    <div className="shell flex min-h-[70vh] items-center py-20">
      <div className="max-w-xl">
        <p className="eyebrow">Panel de contenido</p>
        <h1 className="mt-4 text-h2">Falta conectar Sanity.</h1>
        <p className="mt-5 text-lead text-ink-soft">
          El sitio funciona igual y muestra el contenido de muestra, pero el panel
          necesita un proyecto de Sanity para abrirse.
        </p>
        <ol className="mt-9 space-y-4 border-t border-line pt-8">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="text-[0.85rem] font-semibold tabular-nums text-clay">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.98rem] leading-relaxed text-ink-soft">
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-9 text-[0.9rem] text-ink-faint">
          Las variables están listadas en <code>.env.example</code>.{" "}
          <Link href="/" className="text-ink underline underline-offset-4">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
