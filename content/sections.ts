/**
 * Qué secciones tiene la home, en orden, y cómo se apaga cada una.
 *
 * Es la única lista. De acá salen los interruptores del panel, el orden en que
 * se pintan y la poda de los enlaces que apuntan a una sección apagada. Sumar
 * una sección al sitio es sumar una línea acá y usarla en page.tsx; si se
 * agrega al page y no acá, no aparece el interruptor, y es lo único que puede
 * quedar desincronizado.
 *
 * El ancla importa tanto como el nombre. Media docena de enlaces del copy
 * apuntan a #planes, #proyectos o #brief; apagar esas secciones sin tocar los
 * enlaces deja botones que scrollean a ninguna parte, que es peor que no tener
 * la sección. Sabiendo qué ancla cae con qué sección, la poda es automática.
 */

export type SeccionId =
  | "hero"
  | "socialProof"
  | "approach"
  | "bento"
  | "process"
  | "stackTicker"
  | "pricing"
  | "work"
  | "testimonials"
  | "clientsMap"
  | "faq"
  | "finalCta";

/** De qué color está la página mientras se mira la sección. */
export type Fondo = "claro" | "oscuro";

export type Seccion = {
  id: SeccionId;
  /** Cómo se llama en el panel. */
  titulo: string;
  /** Qué aclarar abajo del interruptor, cuando apagarla tiene consecuencias. */
  nota?: string;
  /** El id del <section>, si tiene. Los enlaces a esta ancla caen con ella. */
  ancla?: string;
  /** El fondo con el que sale de fábrica; el panel puede cambiarlo. */
  fondo: Fondo;
};

export const SECCIONES: Seccion[] = [
  {
    id: "hero",
    fondo: "claro",
    titulo: "Portada",
    nota: "Es el único título de nivel 1 de la página. Sin ella la home arranca por la prueba social y los buscadores no encuentran un titular.",
  },
  {
    id: "socialProof",
    fondo: "claro",
    titulo: "Prueba social",
  },
  {
    id: "approach",
    fondo: "claro",
    titulo: "Cómo trabajamos",
    ancla: "metodo",
  },
  {
    id: "bento",
    fondo: "claro",
    titulo: "Capacidades",
    ancla: "capacidades",
  },
  {
    id: "process",
    fondo: "oscuro",
    titulo: "Proceso",
    nota: "«Proceso» sale del menú si se apaga.",
    ancla: "proceso",
  },
  {
    id: "stackTicker",
    fondo: "claro",
    titulo: "Con qué trabajamos",
    ancla: "stack",
  },
  {
    id: "pricing",
    fondo: "claro",
    titulo: "Planes y precios",
    nota: "Se lleva «Planes» del menú y los enlaces a planes del resto del sitio.",
    ancla: "planes",
  },
  {
    id: "work",
    fondo: "oscuro",
    titulo: "Proyectos",
    nota: "Las fichas de cada proyecto siguen publicadas y accesibles; lo que se apaga es la fila de la home.",
    ancla: "proyectos",
  },
  {
    id: "testimonials",
    fondo: "claro",
    titulo: "Testimonios",
    ancla: "testimonios",
  },
  {
    id: "clientsMap",
    fondo: "claro",
    titulo: "Mapa de clientes",
    ancla: "clientes",
  },
  {
    id: "faq",
    fondo: "claro",
    titulo: "Preguntas frecuentes",
    nota: "También deja de declararlas como datos estructurados, que es lo correcto: no se le puede decir a un buscador que la página tiene preguntas que no tiene.",
    ancla: "faq",
  },
  {
    id: "finalCta",
    fondo: "oscuro",
    titulo: "Formulario de contacto",
    nota: "Es adonde apuntan casi todos los botones del sitio. Apagándola pasan a llevar a la página de reunión, que es el otro camino para escribirnos.",
    ancla: "brief",
  },
];

/** Todas prendidas: lo que rige mientras el panel no diga otra cosa. */
export const SECCIONES_POR_DEFECTO: Record<SeccionId, boolean> =
  Object.fromEntries(SECCIONES.map((s) => [s.id, true])) as Record<
    SeccionId,
    boolean
  >;

/**
 * Adónde va un enlace que apuntaba a una sección apagada.
 *
 * La reunión es la única página que no se puede apagar y es un camino de
 * contacto de verdad, así que un botón que se quedó sin destino sigue llevando
 * a alguna parte en vez de desaparecer. Los del menú son la excepción y se
 * borran: un menú tiene cuatro entradas y que dos lleven al mismo lado se nota.
 */
export const DESTINO_DE_RESCATE = "/reunion";

export type Secciones = Record<SeccionId, boolean>;

/** El fondo de cada sección tal como sale de fábrica. */
export const FONDOS_POR_DEFECTO: Record<SeccionId, Fondo> = Object.fromEntries(
  SECCIONES.map((s) => [s.id, s.fondo]),
) as Record<SeccionId, Fondo>;

export type Fondos = Record<SeccionId, Fondo>;
