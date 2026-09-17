import type { SiteCopy } from "./copy";

/**
 * Todo el texto del sitio en español.
 *
 * Esto es el respaldo: la fuente real es Sanity, y lo que hay acá es lo que se
 * muestra mientras el CMS esté vacío o no conteste. Las dos versiones tienen
 * la misma forma, así que agregar un campo obliga a traducirlo, que es
 * exactamente lo que uno quiere que pase.
 *
 * Los href van sin prefijo de idioma. El prefijo lo pone getCopy() una sola
 * vez, al armar el copy del idioma pedido: si cada componente tuviera que
 * acordarse, el día que se olvide uno el visitante se cae al otro idioma sin
 * entender por qué.
 *
 * Acá no hay colores, logos ni coordenadas. Eso es diseño, no texto, vive en
 * site.ts y se cruza por id. Traducir no debería poder romper una paleta.
 */
export const es: SiteCopy = {
  meta: {
    tagline: "Estudio de diseño y desarrollo web",
    description:
      "Diseñamos y desarrollamos sitios web con alcance cerrado, precio cerrado y fecha de entrega. De la primera charla al sitio publicado, en semanas.",
    keywords: [
      "diseño web",
      "desarrollo web",
      "landing page",
      "sitio web con CMS",
      "estudio de diseño web",
      "Argentina",
    ],
    ogLocale: "es_AR",
  },

  nav: [
    { label: "Proceso", href: "/#proceso" },
    { label: "Planes", href: "/#planes" },
    { label: "Proyectos", href: "/proyectos" },
    { label: "Notas", href: "/notas" },
  ],

  header: {
    plans: "Ver planes",
    cta: "Empezar un proyecto",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
  },

  hero: {
    titleSegments: [
      { text: "Construimos" },
      { text: "sitios web", mark: "paper" },
      { text: "que convierten visitantes en" },
      { text: "clientes.", mark: "ink" },
    ],
    lead: "Diseño, textos y desarrollo para que la gente que entra entienda qué hacés en diez segundos y termine escribiéndote.",
    primary: { label: "Empezar un proyecto", href: "/contacto" },
    secondary: { label: "Ver planes y precios", href: "/#planes" },
    proof: [
      "Precio cerrado",
      "Primera versión en 5 días",
      "El sitio queda a tu nombre",
    ],
    dashboard: {
      title: "Tu sitio, un mes después",
      status: "Todo funcionando",
      range: "Últimos 30 días",
      visits: { title: "Visitas del sitio", badge: "+18%", value: "12.480" },
      visitsStats: [
        { key: "Pico", value: "16:30" },
        { key: "Rebote", value: "32%" },
        { key: "Consultas", value: "24" },
      ],
      visitsAxis: ["1 dic", "7 dic", "14 dic", "21 dic", "28 dic"],
      conversion: {
        title: "Conversión",
        badge: "+12%",
        note: "Visitas que escriben",
      },
      speed: {
        title: "Velocidad",
        badge: "+6",
        mobile: "Móvil",
        desktop: "Escritorio",
      },
      traffic: {
        title: "De dónde llegan",
        note: "Últimos 30 días",
        channels: [
          "Búsqueda en Google",
          "Directo",
          "Redes sociales",
          "Otros",
        ],
      },
    },
  },

  socialProof: {
    label: "Clientes",
    claim: "Tomamos pocos proyectos a la vez y los hacemos enteros nosotros.",
  },

  approach: {
    eyebrow: "Cómo lo resolvemos",
    title: "Un alcance, un precio, una fecha.",
    lead: "Pantufla es un estudio chico que trabaja con un método fijo. Eso es lo que nos permite entregar rápido sin bajar el nivel del diseño.",
    pillars: [
      {
        id: "alcance",
        title: "Alcance cerrado antes de empezar",
        body: "Elegís un plan y sabés exactamente qué entra, qué no y cuánto sale. Si aparece algo fuera de alcance, se cotiza aparte y lo decidís vos.",
      },
      {
        id: "ritmo",
        title: "Ritmo corto y fechas visibles",
        body: "Trabajamos en bloques de días, no de meses. Cada etapa tiene una fecha y una sola ronda de cambios para que el proyecto no se enfríe.",
      },
      {
        id: "entrega",
        title: "Te lo entregamos andando",
        body: "El sitio se publica en tu cuenta, con tu dominio y un panel para que edites los textos, las fotos y las notas sin depender de nosotros.",
      },
    ],
  },

  process: {
    eyebrow: "El proceso",
    title: "Cuatro etapas. Quince días hábiles.",
    lead: "El mismo camino para todos los proyectos. Cambia el tamaño, no el método.",
    labels: { deliverable: "Te entregamos", yours: "Ponés vos" },
    steps: [
      {
        id: "brief",
        name: "Brief",
        when: "Día 1",
        body: "Completás un formulario de cinco minutos con qué hacés, a quién le vendés y qué necesitás que el sitio consiga. Si el proyecto encaja, en 24 horas tenés alcance, precio y fecha de entrega por escrito.",
        deliverable: "Propuesta cerrada",
        yours: "Responder el brief",
      },
      {
        id: "diseno",
        name: "Estructura y diseño",
        when: "Días 2 a 6",
        body: "Definimos qué secciones van, en qué orden y qué dice cada una. Sobre esa base diseñamos el sitio completo en desktop y mobile. Lo revisás y anotás cambios en un solo lugar.",
        deliverable: "Diseño final aprobado",
        yours: "Una ronda de comentarios",
      },
      {
        id: "desarrollo",
        name: "Desarrollo",
        when: "Días 7 a 13",
        body: "Construimos el sitio, cargamos tu contenido real y lo probamos en todos los tamaños de pantalla. Configuramos el panel de edición, la analítica y el formulario de contacto.",
        deliverable: "Sitio en un link de prueba",
        yours: "Textos, fotos y logo",
      },
      {
        id: "publicacion",
        name: "Publicación",
        when: "Días 14 y 15",
        body: "Publicamos en tu dominio, te pasamos los accesos y grabamos un video corto mostrándote cómo editar cada cosa. Después quedan quince días de ajustes finos incluidos.",
        deliverable: "Sitio online y las llaves",
        yours: "El dominio",
      },
    ],
    payment:
      "Se paga 50% para reservar la fecha y 50% el día que se publica. Si elegís pago único al inicio, te queda 15% menos.",
  },

  stack: {
    eyebrow: "Herramientas",
    title: "Con qué está hecho esto.",
    lead: "Nada exótico y nada casero: herramientas conocidas, que vas a poder seguir usando con cualquier otro estudio.",
  },

  pricing: {
    eyebrow: "Planes",
    title: "Elegí cómo empezar.",
    lead: "Una página sola, el sitio completo, o contanos si necesitás otra cosa. Precios en dólares y cerrados.",
    groupLabel: "Forma de pago",
    totalLabel: "Total",
    toggle: {
      once: { label: "Pago único", note: "−15%", noteLong: "15% menos" },
      split: { label: "En 2 pagos", note: "50/50", noteLong: "50% y 50%" },
    },
    guarantee:
      "Si la primera entrega de diseño no te convence, cortamos ahí y te devolvemos el anticipo completo. Sin discusión.",
    plans: [
      {
        id: "landing",
        name: "Landing",
        summary: "Una página que explica lo que hacés y te trae consultas.",
        bestFor: "Lanzamientos, servicios puntuales y campañas.",
        price: { once: 850, split: 500, splitCount: 2 },
        delivery: "5 a 7 días",
        cta: { label: "Empezar con Landing", href: "/contacto?plan=landing" },
        features: [
          "Una página, hasta 6 secciones",
          "Escribimos los textos con vos",
          "Formulario que te avisa por mail",
          "Publicado en tu dominio",
        ],
      },
      {
        id: "sitio",
        name: "Sitio",
        summary: "Tu sitio completo con un panel para que lo edites vos.",
        bestFor: "Estudios, agencias, clínicas, marcas y productos.",
        price: { once: 1500, split: 880, splitCount: 2 },
        delivery: "2 a 3 semanas",
        badge: "El más elegido",
        cta: { label: "Empezar con Sitio", href: "/contacto?plan=sitio" },
        features: [
          "Todo lo del plan Landing",
          "Hasta 6 páginas",
          "Panel para que lo edites vos",
          "Blog o listado de proyectos",
        ],
      },
    ],
    contact: {
      name: "Contactanos",
      summary: "Tu proyecto no entra en ninguno de los dos.",
      price: "A convenir",
      features: [
        "Sistemas de reservas y turnos",
        "Integraciones con lo que ya usás",
        "Migraciones desde otra plataforma",
        "Te decimos en 24 horas si podemos",
      ],
      cta: { label: "Contarnos el proyecto", href: "/contacto?plan=otra-cosa" },
    },
    existing: {
      title: "Ya tengo un sitio en Webflow o Framer.",
      summary:
        "No hace falta rehacerlo todo. Entramos a lo que ya tenés, lo dejamos prolijo y te lo devolvemos andando.",
      platforms: [
        {
          id: "webflow",
          name: "Webflow",
          detail:
            "Entramos al Designer y al CMS. Ordenamos las clases, arreglamos el responsive y dejamos las colecciones listas para que cargues vos.",
        },
        {
          id: "framer",
          name: "Framer",
          detail:
            "Trabajamos sobre tu proyecto: componentes, variantes, breakpoints y CMS. Si hace falta código, lo sumamos.",
        },
      ],
      services: [
        {
          title: "Administrarlo",
          detail:
            "Cargamos contenido y publicamos los cambios por vos. Por mes, y lo cortás cuando quieras.",
        },
        {
          title: "Mejorarlo",
          detail:
            "Velocidad, SEO técnico, responsive y accesibilidad. Te decimos qué encontramos antes de tocar nada.",
        },
        {
          title: "Rediseñarlo",
          detail:
            "Mismo contenido, otra cara. Se rehace el diseño sobre la plataforma que ya usás, sin migrar nada.",
        },
        {
          title: "Un cambio puntual",
          detail:
            "Una sección nueva, un formulario que no anda, una landing para una campaña. Se presupuesta por cambio.",
        },
      ],
      note: "Antes de presupuestar miramos tu sitio y te decimos qué conviene tocar y qué no.",
      cta: { label: "Mostranos tu sitio", href: "/contacto?plan=existente" },
    },
    alwaysIncluded: [
      "Diseño original, nada de plantillas",
      "Responsive real en mobile, tablet y desktop",
      "Carga rápida y buenas métricas de Core Web Vitals",
      "SEO técnico: metadatos, sitemap y datos estructurados",
      "El código, el dominio y las cuentas quedan a tu nombre",
      "Una llamada de cierre para dejarte andando",
    ],
    offerCatalog: "Planes de diseño y desarrollo web",
  },

  work: {
    eyebrow: "Proyectos",
    title: "Algunos sitios que salieron de acá.",
    lead: "Distintos rubros, distintos tamaños, el mismo método.",
    view: "Ver sitio",
    viewAll: "Ver todos los proyectos",
  },

  testimonials: {
    eyebrow: "Testimonios",
    title: "Lo que dicen los que ya pasaron por el proceso.",
    rating: "{value} de 5",
  },

  clientsMap: {
    eyebrow: "Dónde trabajamos",
    title: "Trabajamos desde Buenos Aires para donde haga falta.",
    note: "Todo el proceso pasa por escrito y por video. Hasta hoy publicamos sitios para clientes en {count} países.",
  },

  faq: {
    eyebrow: "Preguntas",
    title: "Acá están las respuestas.",
    cta: { claim: "¿Te quedó alguna duda?", label: "Hablemos", href: "/contacto" },
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
  },

  finalCta: {
    title: "Contanos qué necesitás.",
    lead: "Cinco minutos de formulario. En 24 horas te respondemos con alcance, precio y fecha, o te decimos con franqueza que no somos los indicados.",
    primary: { label: "Completar el brief", href: "/contacto" },
    expectationsTitle: "Qué pasa después",
    expectations: [
      "Leemos el brief el mismo día que llega.",
      "Te respondemos con alcance, precio y fecha en 24 horas hábiles.",
      "Si no somos los indicados, te lo decimos y te sugerimos a quién ver.",
      "No hay llamada de venta obligatoria: si preferís todo por escrito, va por escrito.",
    ],
    secondaryLabel: "Escribir a {email}",
  },

  form: {
    name: { label: "Nombre y apellido", placeholder: "Ana Ríos" },
    email: { label: "Email", placeholder: "ana@empresa.com" },
    company: {
      label: "Empresa o proyecto",
      optional: "(opcional)",
      placeholder: "Estudio Martel",
    },
    plan: { label: "Plan" },
    budget: { label: "Presupuesto", currency: "(USD)" },
    timeline: { label: "Plazo" },
    message: {
      label: "¿Qué necesitás?",
      hint: "Qué hacés, a quién le vendés y qué querés que el sitio consiga. Con tres o cuatro líneas alcanza.",
      placeholder:
        "Tenemos un estudio de arquitectura en Córdoba. Queremos mostrar las obras y que nos lleguen consultas de obra nueva…",
    },
    honeypot: "No completar",
    submit: "Enviar el brief",
    sending: "Enviando…",
    privacy:
      "Respondemos en 24 horas hábiles. No compartimos tus datos con nadie.",
    genericError: "No pudimos enviarlo",
    extraPlans: [
      { value: "existente", label: "Ya tengo un sitio en Webflow o Framer" },
      { value: "no-se", label: "Todavía no sé cuál me sirve" },
      { value: "otra-cosa", label: "Otra cosa (contame en el mensaje)" },
    ],
    budgetRanges: [
      "Menos de $1.000",
      "$1.000 – $2.500",
      "$2.500 – $5.000",
      "Más de $5.000",
      "Todavía no sé",
    ],
    timelineOptions: [
      "Lo antes posible",
      "En 2 a 4 semanas",
      "En 1 a 3 meses",
      "Estoy explorando",
    ],
    success: {
      title: "Recibido. Gracias.",
      body: "Lo leemos hoy mismo. Dentro de las próximas 24 horas hábiles te respondemos con el alcance, el precio y la fecha de entrega, o te decimos con franqueza si no somos los indicados para este proyecto.",
      urgent: "¿Es urgente? Escribinos a",
    },
  },

  pages: {
    contacto: {
      metaTitle: "Empezar un proyecto",
      metaDescription:
        "Contanos qué necesitás. En 24 horas te respondemos con alcance, precio y fecha de entrega.",
      eyebrow: "Empezar un proyecto",
      title: "Cinco minutos ahora, una propuesta cerrada mañana.",
      lead: "Cuanto más concreto sea el brief, más preciso es el presupuesto que te mandamos. No hace falta que tengas todo definido.",
      directTitle: "¿Preferís escribir directo?",
    },
    proyectos: {
      metaTitle: "Proyectos",
      metaDescription:
        "Sitios y landings que diseñamos y desarrollamos: rubro, alcance y tiempo real de entrega de cada uno.",
      eyebrow: "Proyectos",
      title: "Sitios que salieron de acá.",
      lead: "Entre landings de una sola página y sitios completos con panel de carga.",
    },
    notas: {
      metaTitle: "Notas",
      eyebrow: "Notas",
      title: "Cómo pensamos los proyectos.",
      lead: "Decisiones, criterios y aprendizajes de los sitios que hacemos. Sin relleno.",
      empty: "Todavía no hay notas.",
    },
  },

  notFound: {
    eyebrow: "Error 404",
    title: "Esta página no existe.",
    lead: "Puede que la hayamos movido o que el link esté mal escrito.",
    home: { label: "Volver al inicio", href: "/" },
    work: { label: "Ver proyectos", href: "/proyectos" },
  },

  footer: {
    blurb:
      "{tagline}. Alcance cerrado, precio cerrado y fecha de entrega. Trabajamos desde {location} para clientes de donde sea.",
    navTitle: "Navegación",
    contactTitle: "Contacto",
    contactLink: { label: "Contacto", href: "/contacto" },
    signature: "Diseñado y desarrollado en casa, en pantuflas.",
  },
};
