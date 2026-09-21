import type { Segment } from "@/components/motion/split-heading";
import type { Locale } from "@/lib/i18n";
import { localeHref } from "@/lib/i18n";

/**
 * La forma del texto del sitio, igual en los dos idiomas.
 *
 * Que el tipo viva acá y no se infiera del español es a propósito: inferido,
 * agregar un campo en español lo haría opcional en inglés sin que nadie se
 * entere, y el sitio saldría a producción con un hueco. Declarado, agregar un
 * campo rompe la compilación hasta que las dos versiones lo tengan.
 */

export type Link = { label: string; href: string };

export type SiteCopy = {
  meta: {
    tagline: string;
    description: string;
    keywords: string[];
    ogLocale: string;
  };
  nav: Link[];
  header: {
    plans: string;
    cta: string;
    openMenu: string;
    skip: string;
    closeMenu: string;
    language: string;
  };
  hero: {
    titleSegments: Segment[];
    lead: string;
    primary: Link;
    secondary: Link;
    proof: string[];
    dashboard: {
      title: string;
      status: string;
      range: string;
      visits: { title: string; badge: string; value: string };
      visitsStats: { key: string; value: string }[];
      visitsAxis: string[];
      conversion: { title: string; badge: string; note: string };
      speed: { title: string; badge: string; mobile: string; desktop: string };
      traffic: { title: string; note: string; channels: string[] };
    };
  };
  socialProof: { label: string; claim: string };
  approach: {
    eyebrow: string;
    title: string;
    lead: string;
    pillars: { id: string; title: string; body: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    lead: string;
    labels: { deliverable: string; yours: string };
    steps: {
      id: string;
      name: string;
      when: string;
      body: string;
      deliverable: string;
      yours: string;
    }[];
    /**
     * El cierre de la sección. Va en tramos como el titular de la portada
     * porque el descuento tiene que verse, no leerse: en un párrafo corrido,
     * «15% menos» es una frase más entre otras quince.
     */
    payment: { segments: Segment[]; cta: Link };
  };
  stack: { eyebrow: string; title: string; lead: string };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    groupLabel: string;
    totalLabel: string;
    toggle: Record<"once" | "split", { label: string; note: string; noteLong: string }>;
    guarantee: string;
    plans: {
      id: string;
      name: string;
      summary: string;
      bestFor: string;
      price: { once: number; split: number; splitCount: number };
      delivery: string;
      badge?: string;
      cta: Link;
      features: string[];
    }[];
    contact: {
      name: string;
      summary: string;
      price: string;
      features: string[];
      cta: Link;
    };
    existing: {
      title: string;
      summary: string;
      platforms: { id: string; name: string; detail: string }[];
      services: { title: string; detail: string }[];
      note: string;
      cta: Link;
    };
    alwaysIncluded: string[];
    offerCatalog: string;
  };
  /**
   * Las cuatro capacidades, en grilla bento.
   *
   * El texto va acá y la forma —qué tono lleva y qué celda ocupa— en
   * site.ts, cruzado por id como el resto. Cambiar un título no puede mover
   * una tarjeta de lugar.
   */
  bento: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { id: string; title: string; body: string }[];
    /**
     * Los pocos textos que van adentro de los dibujos.
     *
     * Van acá y no en site.ts porque se traducen: el separador decimal cambia
     * de idioma, y la pregunta del buscador tiene que estar en la lengua de
     * quien la leería. Son cortos a propósito —un dibujo con un párrafo
     * adentro deja de ser un dibujo— pero son texto de verdad y no barras
     * grises, que es lo que hace que la figura se lea como una pantalla y no
     * como un relleno.
     */
    figures: {
      /** Cuánto tarda un sitio nuestro. */
      speedOurs: string;
      /** El número contra el que se compara. */
      speedTheirs: string;
      /** Lo que alguien le escribe a un buscador o a un modelo. */
      seoQuestion: string;
      /** Lo que le contesta. */
      seoAnswer: string;
      /** El botón del formulario dibujado. */
      formButton: string;
    };
  };
  work: {
    eyebrow: string;
    title: string;
    lead: string;
    view: string;
    /** El botón que suma dos proyectos más a los cuatro de la home. */
    loadMore: string;
    /** «4 de 6», para que se sepa cuánto falta antes de tocar. */
    counter: string;
  };
  testimonials: { eyebrow: string; title: string; rating: string };
  clientsMap: { eyebrow: string; title: string; note: string };
  faq: {
    eyebrow: string;
    title: string;
    cta: { claim: string; label: string; href: string };
    items: { q: string; a: string }[];
  };
  /**
   * La reserva de llamada. Es el otro camino de entrada y no se cruza con el
   * brief: quien completa el formulario no ve una reunión en ningún lado.
   */
  meeting: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    lead: string;
    expectTitle: string;
    expect: { title: string; detail: string }[];
    /** Mientras el calendario monta. */
    loading: string;
    /** Si no hay calendario conectado o no cargó. */
    fallback: string;
    preferWrite: string;
    write: Link;
  };
  finalCta: {
    title: string;
    lead: string;
    primary: Link;
    expectationsTitle: string;
    expectations: string[];
    secondaryLabel: string;
  };
  form: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    company: { label: string; optional: string; placeholder: string };
    plan: { label: string };
    budget: { label: string; currency: string };
    timeline: { label: string };
    message: { label: string; hint: string; placeholder: string };
    honeypot: string;
    submit: string;
    sending: string;
    privacy: string;
    genericError: string;
    extraPlans: { value: string; label: string }[];
    budgetRanges: string[];
    timelineOptions: string[];
    success: { title: string; body: string; urgent: string };
  };
  pages: {
    proyectos: {
      metaTitle: string;
      metaDescription: string;
      eyebrow: string;
      title: string;
      lead: string;
    };
  };
  notFound: {
    eyebrow: string;
    title: string;
    lead: string;
    home: Link;
    work: Link;
  };
  footer: {
    blurb: string;
    navTitle: string;
    contactTitle: string;
    contactLink: Link;
    signature: string;
  };
};

/**
 * Le pone el prefijo de idioma a todos los href de una sola pasada.
 *
 * Los textos se escriben con las rutas en su forma corta —/contacto, /#planes—
 * y acá se traducen a la URL del idioma que toca. Es recursivo y a ciegas:
 * cualquier clave que se llame href y empiece con barra entra. La alternativa
 * era acordarse en cada componente, y el día que uno se olvide el visitante se
 * cae al otro idioma sin entender por qué.
 */
function conPrefijo<T>(valor: T, locale: Locale): T {
  if (Array.isArray(valor)) {
    return valor.map((v) => conPrefijo(v, locale)) as unknown as T;
  }
  if (valor && typeof valor === "object") {
    const salida: Record<string, unknown> = {};
    for (const [clave, v] of Object.entries(valor)) {
      salida[clave] =
        clave === "href" && typeof v === "string"
          ? localeHref(v, locale)
          : conPrefijo(v, locale);
    }
    return salida as T;
  }
  return valor;
}

export function localizeHrefs(copy: SiteCopy, locale: Locale): SiteCopy {
  return conPrefijo(copy, locale);
}

/** Reemplaza {marcadores} en un texto. Para las frases que llevan un dato. */
export function fill(plantilla: string, valores: Record<string, string | number>) {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) =>
    String(valores[clave] ?? `{${clave}}`),
  );
}
