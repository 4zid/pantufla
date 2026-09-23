import type { SiteCopy } from "./copy";
import { localizeHrefs } from "./copy";
import {
  approachDesign,
  planDesign,
  platformDesign,
  processDesign,
} from "./site";
import type { Locale } from "@/lib/i18n";

/**
 * Cruza el texto con el diseño y deja el copy listo para pintar.
 *
 * Los componentes reciben un solo objeto donde cada pilar ya trae su tono y
 * cada plan su color: no tienen que saber que el texto viene de un lado y la
 * paleta del otro. Esa costura se cose una vez, acá.
 *
 * Si un id no tiene diseño, el bloque igual se pinta —con el tono por defecto—
 * en vez de romper la página. Un texto nuevo cargado en Sanity no debería
 * poder tirar el sitio abajo por no tener todavía un color asignado.
 */

type Con<T, E> = T & E;

export type ResolvedCopy = Omit<
  SiteCopy,
  "approach" | "process" | "pricing"
> & {
  approach: Omit<SiteCopy["approach"], "pillars"> & {
    pillars: Con<SiteCopy["approach"]["pillars"][number], { art: string }>[];
  };
  process: Omit<SiteCopy["process"], "steps"> & {
    steps: Con<
      SiteCopy["process"]["steps"][number],
      { number: string; art: string; tone: string }
    >[];
  };
  pricing: Omit<SiteCopy["pricing"], "plans" | "existing"> & {
    plans: Con<
      SiteCopy["pricing"]["plans"][number],
      { tone: string; featured: boolean }
    >[];
    existing: Omit<SiteCopy["pricing"]["existing"], "platforms"> & {
      platforms: Con<
        SiteCopy["pricing"]["existing"]["platforms"][number],
        { logo: string; logoWidth: number }
      >[];
    };
  };
};

/**
 * Acepta la nota de pago vieja —un párrafo suelto— y la deja en la forma
 * nueva. El botón no se puede inventar, así que sale del texto de respaldo:
 * el del idioma ya está resuelto cuando esto corre.
 */
function normalizarPago(
  valor: SiteCopy["process"]["payment"] | string,
): SiteCopy["process"]["payment"] {
  if (typeof valor === "string") {
    return {
      segments: [{ text: valor }],
      cta: { label: "", href: "/contacto" },
    };
  }
  return valor;
}

export function resolveCopy(copy: SiteCopy, locale: Locale): ResolvedCopy {
  const c = localizeHrefs(copy, locale);

  return {
    ...c,
    approach: {
      ...c.approach,
      pillars: c.approach.pillars.map((p) => ({
        ...p,
        art: approachDesign[p.id]?.art ?? "precio",
      })),
    },
    process: {
      ...c.process,
      /*
         La nota de pago era un string y ahora son tramos con un botón. El
         documento que ya está cargado en Sanity sigue teniendo el string, y
         Sanity manda la sección entera —el merge es por sección, no por
         campo—, así que hasta que alguien vuelva a guardarla desde el Studio
         llega la forma vieja. Sin esto la página se cae en producción y anda
         en local, que es la peor de las combinaciones.
      */
      payment: normalizarPago(c.process.payment),
      steps: c.process.steps.map((s, i) => ({
        ...s,
        number: processDesign[s.id]?.number ?? String(i + 1).padStart(2, "0"),
        art: processDesign[s.id]?.art ?? "brief",
        tone:
          processDesign[s.id]?.tone ?? ["aqua", "rosa", "verde", "miel"][i % 4],
      })),
    },
    pricing: {
      ...c.pricing,
      plans: c.pricing.plans.map((p, i) => ({
        ...p,
        tone: planDesign[p.id]?.tone ?? ["aqua", "rosa"][i % 2],
        // Sin diseño asignado ninguno queda destacado: destacar de más es peor
        // que no destacar, porque deja dos planes peleando por el mismo lugar.
        featured: planDesign[p.id]?.featured ?? false,
      })),
      existing: {
        ...c.pricing.existing,
        platforms: c.pricing.existing.platforms.map((p) => ({
          ...p,
          logo: platformDesign[p.id]?.logo ?? "",
          logoWidth: platformDesign[p.id]?.logoWidth ?? 100,
        })),
      },
    },
  };
}
