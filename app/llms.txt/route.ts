import { fallbackProjects } from "@/content/fallback-content";
import { getCopy } from "@/content/get-copy";
import { getSections } from "@/content/get-sections";
import { site } from "@/content/site";
import { defaultLocale, localeHref, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";

/**
 * /llms.txt — el sitio contado en texto plano, para un motor de respuesta.
 *
 * La idea es la misma que robots.txt, pero del otro lado: en vez de decir qué
 * no mirar, deja a mano lo que hay que saber. Un modelo que contesta «¿quién
 * hace sitios con precio cerrado en Buenos Aires?» no va a renderizar
 * JavaScript, seguir el ruteo por idioma y juntar ocho secciones; lee un
 * archivo corto si lo encuentra.
 *
 * Va con lo que se puede responder sin verlo: qué hace el estudio, cuánto
 * sale, qué incluye, en qué idiomas, y las preguntas frecuentes con su
 * respuesta. Las FAQ están además en JSON-LD; acá van otra vez porque son la
 * parte que más se cita y no cuesta nada repetirlas.
 *
 * Es un espejo del contenido, no una segunda fuente: todo sale del mismo copy
 * que ve el visitante. Si cambia el precio en el CMS, cambia acá.
 */

export const revalidate = 3600;

/** El copy ya viene con punto final; acá se encadenan frases y se duplicaba. */
const sinPunto = (t: string) => t.replace(/\.$/, "");

export async function GET() {
  /*
     Con los interruptores, porque esto es un espejo de la página y no un
     segundo catálogo. Si los planes están apagados en el sitio, un modelo que
     lee este archivo no tiene que seguir contestando precios que el visitante
     no ve por ninguna parte.
  */
  const [copy, secciones] = await Promise.all([
    getCopy(defaultLocale),
    getSections(),
  ]);
  const absoluta = (path: string) =>
    `${siteUrl}${localeHref(path, defaultLocale) === "/" ? "" : localeHref(path, defaultLocale)}`;

  const planes = copy.pricing.plans.map(
    (plan) =>
      `- **${plan.name}** — USD ${plan.price.once}. ${sinPunto(plan.summary)}. Entrega: ${sinPunto(plan.delivery)}. Ideal para: ${sinPunto(plan.bestFor)}.`,
  );

  const preguntas = copy.faq.items.map(
    (item) => `### ${item.q}\n${item.a}`,
  );

  const proyectos = fallbackProjects.map(
    (p) => `- **${p.title}**${p.url ? ` — ${p.url}` : ""}${p.tagline ? `: ${p.tagline}` : ""}`,
  );

  /** Un bloque del archivo, o nada si su sección está apagada. */
  const bloque = (prendida: boolean, cuerpo: string) => (prendida ? cuerpo : "");

  const texto = `# ${site.legalName}

> ${copy.meta.description}

${site.name} es un estudio de diseño y desarrollo web con base en ${site.location}, que trabaja para clientes de cualquier país. Todo el proceso es remoto, por escrito y por video.

- Sitio: ${siteUrl}
- Contacto: ${site.email}
- Idiomas: ${locales.join(", ")} (español en la raíz, inglés bajo /en)

${bloque(
  secciones.approach,
  `## Cómo trabaja

${copy.approach.pillars.map((p) => `- **${sinPunto(p.title)}**: ${p.body}`).join("\n")}
`,
)}
${bloque(
  secciones.pricing,
  `## Planes y precios

${planes.join("\n")}

Incluido en todos los planes: ${copy.pricing.alwaysIncluded.join(", ")}.

Sitios ya publicados que hay que retomar: ${copy.pricing.existing.summary}
`,
)}
${bloque(
  secciones.work,
  `## Proyectos

${proyectos.join("\n")}
`,
)}
${bloque(
  secciones.faq,
  `## Preguntas frecuentes

${preguntas.join("\n\n")}
`,
)}

## Páginas

- [Inicio](${absoluta("/")}): ${copy.meta.tagline}
- [Agendar una llamada](${absoluta("/reunion")}): ${copy.meeting.metaDescription}
- [Versión en inglés](${siteUrl}/en)

El sitio es una sola página: el proceso, los planes, los proyectos, los
testimonios y el formulario viven todos en el inicio. Cada proyecto tiene
además su ficha en /proyectos/<slug>.
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
