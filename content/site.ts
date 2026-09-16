/**
 * Todo el copy y los datos comerciales del sitio viven acá.
 * Cambiar precios, pasos del proceso o preguntas frecuentes no requiere
 * tocar ningún componente.
 */

export const site = {
  name: "Pantufla",
  legalName: "Pantufla Studio",
  tagline: "Estudio de diseño y desarrollo web",
  description:
    "Diseñamos y desarrollamos sitios web con alcance cerrado, precio cerrado y fecha de entrega. De la primera charla al sitio publicado, en semanas.",
  email: "hola@pantufla.design",
  whatsapp: "https://wa.me/5491100000000",
  location: "Buenos Aires, Argentina",
  social: [
    { label: "Instagram", href: "https://instagram.com/pantufla.design" },
    { label: "LinkedIn", href: "https://linkedin.com/company/pantufla-design" },
    { label: "Behance", href: "https://www.behance.net/lautarolacaze" },
  ],
} as const;

export const nav = [
  { label: "Proceso", href: "/#proceso" },
  { label: "Planes", href: "/#planes" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Notas", href: "/notas" },
] as const;

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  badge: "Diseño y desarrollo web",
  badgeNote: "Cupos de octubre abiertos",
  title: "Tu sitio web listo en tres semanas.",
  lead:
    "Un alcance cerrado, un precio cerrado y una fecha de entrega. Vos aprobás, nosotros publicamos. Sin presupuestos por hora ni proyectos que se estiran.",
  primary: { label: "Empezar un proyecto", href: "/contacto" },
  secondary: { label: "Ver planes y precios", href: "/#planes" },
  proof: [
    "Precio cerrado",
    "Primera versión en 5 días",
    "El sitio queda a tu nombre",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Problema — nombrar la frustración con las palabras del cliente      */
/* ------------------------------------------------------------------ */

export const problem = {
  eyebrow: "El problema",
  title: "Nadie abandona un sitio web por el diseño. Lo abandona por el proceso.",
  lead:
    "La mayoría de los proyectos que llegan acá vienen de una experiencia parecida. Estas cuatro, casi siempre.",
  items: [
    {
      title: "El presupuesto abre y no cierra nunca",
      body: "Se cotiza por hora, aparecen imprevistos y la cifra final no se parece a la del primer mail.",
    },
    {
      title: "Dos semanas esperando una respuesta",
      body: "El proyecto avanza cuando el otro tiene un rato libre. No hay fechas, hay buena voluntad.",
    },
    {
      title: "Quedás atado a quien lo hizo",
      body: "Cambiar un precio o subir una nota implica escribirle a alguien, esperar y pagar de nuevo.",
    },
    {
      title: "Queda lindo, pero no trae nada",
      body: "Un sitio bonito que no explica qué vendés, a quién y por qué te tendrían que elegir a vos.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Cómo trabajamos                                                     */
/* ------------------------------------------------------------------ */

export const approach = {
  eyebrow: "Cómo lo resolvemos",
  title: "Un alcance, un precio, una fecha.",
  lead:
    "Pantufla es un estudio chico que trabaja con un método fijo. Eso es lo que nos permite entregar rápido sin bajar el nivel del diseño.",
  pillars: [
    {
      title: "Alcance cerrado antes de empezar",
      tone: "aqua",
      art: "precio",
      body: "Elegís un plan y sabés exactamente qué entra, qué no y cuánto sale. Si aparece algo fuera de alcance, se cotiza aparte y lo decidís vos.",
    },
    {
      title: "Ritmo corto y fechas visibles",
      tone: "rosa",
      art: "reloj",
      body: "Trabajamos en bloques de días, no de meses. Cada etapa tiene una fecha y una sola ronda de cambios para que el proyecto no se enfríe.",
    },
    {
      title: "Te lo entregamos andando",
      tone: "verde",
      art: "llaves",
      body: "El sitio se publica en tu cuenta, con tu dominio y un panel para que edites los textos, las fotos y las notas sin depender de nosotros.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Proceso                                                             */
/* ------------------------------------------------------------------ */

export const process = {
  eyebrow: "El proceso",
  title: "Cuatro etapas. Quince días hábiles.",
  lead:
    "El mismo camino para todos los proyectos. Cambia el tamaño, no el método.",
  steps: [
    {
      number: "01",
      name: "Brief",
      art: "brief",
      tone: "aqua",
      when: "Día 1",
      body: "Completás un formulario de cinco minutos con qué hacés, a quién le vendés y qué necesitás que el sitio consiga. Si el proyecto encaja, en 24 horas tenés alcance, precio y fecha de entrega por escrito.",
      deliverable: "Propuesta cerrada",
      yours: "Responder el brief",
    },
    {
      number: "02",
      name: "Estructura y diseño",
      art: "diseno",
      tone: "rosa",
      when: "Días 2 a 6",
      body: "Definimos qué secciones van, en qué orden y qué dice cada una. Sobre esa base diseñamos el sitio completo en desktop y mobile. Lo revisás y anotás cambios en un solo lugar.",
      deliverable: "Diseño final aprobado",
      yours: "Una ronda de comentarios",
    },
    {
      number: "03",
      name: "Desarrollo",
      art: "desarrollo",
      tone: "verde",
      when: "Días 7 a 13",
      body: "Construimos el sitio, cargamos tu contenido real y lo probamos en todos los tamaños de pantalla. Configuramos el panel de edición, la analítica y el formulario de contacto.",
      deliverable: "Sitio en un link de prueba",
      yours: "Textos, fotos y logo",
    },
    {
      number: "04",
      name: "Publicación",
      art: "llaves",
      tone: "miel",
      when: "Días 14 y 15",
      body: "Publicamos en tu dominio, te pasamos los accesos y grabamos un video corto mostrándote cómo editar cada cosa. Después quedan quince días de ajustes finos incluidos.",
      deliverable: "Sitio online y las llaves",
      yours: "El dominio",
    },
  ],
  payment:
    "Se paga 50% para reservar la fecha y 50% el día que se publica. Si elegís pago único al inicio, te queda 15% menos.",
} as const;

/* ------------------------------------------------------------------ */
/* Planes                                                              */
/* ------------------------------------------------------------------ */

export type BillingMode = "once" | "split";

export const pricing = {
  eyebrow: "Planes",
  title: "Elegí cómo empezar.",
  lead:
    "Una página sola, el sitio completo, o contanos si necesitás otra cosa. Precios en dólares y cerrados.",
  toggle: {
    once: { label: "Pago único", note: "−15%", noteLong: "15% menos" },
    split: { label: "En 2 pagos", note: "50/50", noteLong: "50% y 50%" },
  },
  guarantee:
    "Si la primera entrega de diseño no te convence, cortamos ahí y te devolvemos el anticipo completo. Sin discusión.",
  plans: [
    {
      id: "landing",
      tone: "aqua",
      name: "Landing",
      summary: "Una página que explica lo que hacés y te trae consultas.",
      bestFor: "Lanzamientos, servicios puntuales y campañas.",
      price: { once: 850, split: 500, splitCount: 2 },
      delivery: "5 a 7 días",
      featured: false,
      cta: { label: "Empezar con Landing", href: "/contacto?plan=landing" },
      features: [
        "Una página, hasta 6 secciones",
        "Escribimos los textos con vos",
        "Formulario que te avisa por mail",
        "Publicado en tu dominio",
      ],
      excluded: [],
    },
    {
      id: "sitio",
      tone: "rosa",
      name: "Sitio",
      summary: "Tu sitio completo con un panel para que lo edites vos.",
      bestFor: "Estudios, agencias, clínicas, marcas y productos.",
      price: { once: 2200, split: 1300, splitCount: 2 },
      delivery: "2 a 3 semanas",
      featured: true,
      badge: "El más elegido",
      cta: { label: "Empezar con Sitio", href: "/contacto?plan=sitio" },
      features: [
        "Todo lo del plan Landing",
        "Hasta 6 páginas",
        "Panel para que lo edites vos",
        "Blog o listado de proyectos",
      ],
      excluded: [],
    },
  ],
  contact: {
    name: "Contactanos",
    summary: "Tu proyecto no entra en ninguno de los dos.",
    price: "A convenir",
    features: [
      "Tiendas online y reservas",
      "Integraciones con lo que ya usás",
      "Migraciones desde otra plataforma",
      "Te decimos en 24 horas si podemos",
    ],
    cta: { label: "Contarnos el proyecto", href: "/contacto?plan=otra-cosa" },
  },
  alwaysIncluded: [
    "Diseño original, nada de plantillas",
    "Responsive real en mobile, tablet y desktop",
    "Carga rápida y buenas métricas de Core Web Vitals",
    "SEO técnico: metadatos, sitemap y datos estructurados",
    "El código, el dominio y las cuentas quedan a tu nombre",
    "Una llamada de cierre para dejarte andando",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes — manejo de objeciones                          */
/* ------------------------------------------------------------------ */

export const faq = {
  eyebrow: "Preguntas frecuentes",
  title: "Lo que casi siempre nos preguntan antes de arrancar.",
  items: [
    {
      q: "¿Y si necesito más páginas de las que incluye el plan?",
      a: "Se suman por separado y con precio fijo antes de empezar, así el presupuesto nunca se mueve solo. Si desde el brief se ve que necesitás bastante más, te lo decimos ahí mismo con un número aparte.",
    },
    {
      q: "¿De quién es el sitio cuando termina el proyecto?",
      a: "Tuyo. El dominio, el hosting, el panel de contenido y el repositorio quedan a tu nombre. Nosotros salimos de las cuentas cuando vos digas. No usamos plataformas que te aten a nosotros.",
    },
    {
      q: "¿Puedo editar el contenido sin saber programar?",
      a: "Sí, en el plan Sitio. Entrás a un panel, cambiás textos, subís fotos, publicás una nota nueva y el sitio se actualiza solo. Te dejamos un video corto explicando cada parte.",
    },
    {
      q: "¿Cuánto sale mantenerlo por mes?",
      a: "El sitio andando cuesta entre 0 y 20 dólares por mes según el tráfico, más el dominio (unos 15 dólares al año). Eso lo pagás vos directo al proveedor. Si querés que nos ocupemos de cambios y mejoras todos los meses, tenemos un abono aparte.",
    },
    {
      q: "¿Usan inteligencia artificial para trabajar?",
      a: "Sí, en la parte técnica y repetitiva: andamiaje de código, tareas de configuración, primeras versiones de textos. El diseño, la estructura y las decisiones las tomamos nosotros. Es la razón por la que podemos entregar en semanas y cobrar lo que cobramos.",
    },
    {
      q: "¿Qué necesitan de mí para arrancar?",
      a: "El brief completo, tu logo si tenés, las fotos que quieras usar y una idea de los textos. Si no tenés textos, los escribimos nosotros y vos los aprobás. Nada más.",
    },
    {
      q: "¿Cómo se paga y en qué momento?",
      a: "50% para reservar la fecha en el calendario y 50% el día que publicamos. Si preferís pagarlo todo al inicio, te descontamos 15%. Aceptamos transferencia, Wise, Payoneer y stablecoins. Facturamos.",
    },
    {
      q: "¿Qué pasa si me atraso con el contenido?",
      a: "Congelamos el proyecto y retomamos cuando estés listo, sin costo extra durante 30 días. Pasado ese plazo la fecha de entrega se reagenda según la disponibilidad que haya.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* CTA final                                                           */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Contanos qué necesitás.",
  lead:
    "Cinco minutos de formulario. En 24 horas te respondemos con alcance, precio y fecha, o te decimos con franqueza que no somos los indicados.",
  primary: { label: "Completar el brief", href: "/contacto" },
  secondary: { label: `Escribir a ${site.email}`, href: `mailto:${site.email}` },
} as const;

/**
 * ⚠️ Reemplazar por los países donde realmente hay clientes antes de publicar.
 * El pie de la sección cuenta esta lista, así que el número siempre coincide
 * con lo que se muestra: no hay una cifra escrita a mano que se desactualice.
 */
export const clients = [
  { city: "Buenos Aires", country: "Argentina", lon: -58.4, lat: -34.6 },
  { city: "Córdoba", country: "Argentina", lon: -64.2, lat: -31.4 },
  { city: "Montevideo", country: "Uruguay", lon: -56.2, lat: -34.9 },
  { city: "Santiago", country: "Chile", lon: -70.7, lat: -33.4 },
  { city: "Ciudad de México", country: "México", lon: -99.1, lat: 19.4 },
  { city: "Miami", country: "Estados Unidos", lon: -80.2, lat: 25.8 },
  { city: "Madrid", country: "España", lon: -3.7, lat: 40.4 },
  { city: "Barcelona", country: "España", lon: 2.2, lat: 41.4 },
  { city: "Berlín", country: "Alemania", lon: 13.4, lat: 52.5 },
] as const;

export const budgetRanges = [
  "Menos de $1.000",
  "$1.000 – $2.500",
  "$2.500 – $5.000",
  "Más de $5.000",
  "Todavía no sé",
] as const;

export const timelineOptions = [
  "Lo antes posible",
  "En 2 a 4 semanas",
  "En 1 a 3 meses",
  "Estoy explorando",
] as const;
