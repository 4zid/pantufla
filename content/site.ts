/**
 * Lo que no se traduce.
 *
 * El texto vive en Sanity y, como respaldo, en copy.es.ts y copy.en.ts. Acá
 * queda todo lo demás: los datos de contacto, los tonos, los logos, las
 * coordenadas. Es una separación con una regla simple detrás —Sanity guarda
 * palabras, el código guarda estructura— y sirve para que traducir no pueda
 * romper una paleta ni cambiar de lugar una tarjeta.
 *
 * El cruce entre las dos mitades es por id. Si un id no coincide, el build
 * avisa; si estuviera todo junto en un archivo por idioma, el español y el
 * inglés se irían separando de a poco sin que nadie lo note.
 */

export const site = {
  name: "Pantufla",
  legalName: "Pantufla Studio",
  email: "hola@pantufla.design",
  whatsapp: "https://wa.me/5491100000000",
  location: "Buenos Aires, Argentina",
  social: [
    { label: "Instagram", href: "https://instagram.com/pantufla.design" },
    { label: "LinkedIn", href: "https://linkedin.com/company/pantufla-design" },
    { label: "Behance", href: "https://www.behance.net/lautarolacaze" },
  ],
} as const;

export type BillingMode = "once" | "split";

/* ------------------------------------------------------------------ */
/* Diseño de cada bloque, cruzado por id con el texto                  */
/* ------------------------------------------------------------------ */

export const approachDesign: Record<string, { tone: string; art: string }> = {
  alcance: { tone: "aqua", art: "precio" },
  ritmo: { tone: "rosa", art: "reloj" },
  entrega: { tone: "verde", art: "llaves" },
};

export const processDesign: Record<
  string,
  { number: string; art: string; tone: string }
> = {
  brief: { number: "01", art: "brief", tone: "aqua" },
  diseno: { number: "02", art: "diseno", tone: "rosa" },
  desarrollo: { number: "03", art: "desarrollo", tone: "verde" },
  publicacion: { number: "04", art: "llaves", tone: "miel" },
};

/**
 * Dónde cae cada capacidad en la grilla y de qué color habla.
 *
 * El bento no es una grilla de cuatro iguales: dos chicas arriba, una
 * vertical a la derecha y una ancha abajo. Esa forma no es decorativa, le toca
 * a cada tarjeta por lo que tiene adentro —la vertical lleva un teléfono y la
 * ancha un gráfico, y ninguna de las dos entra en la otra— así que la celda es
 * parte del diseño de la tarjeta y vive acá, no en el texto.
 *
 * Abajo de md es una sola columna y todo esto no aplica: cuatro tarjetas
 * apiladas en el orden en que están escritas.
 */
export const bentoDesign: Record<
  string,
  {
    tone: "aqua" | "rosa" | "verde" | "miel";
    area: string;
    art: string;
    /**
     * Cómo se reparten el texto y el dibujo adentro de la tarjeta.
     *
     * «apilada» pone el texto arriba y el dibujo abajo a todo el ancho.
     * «lado» los pone uno al lado del otro, que solo entra en la tarjeta
     * ancha. Tener las cuatro apiladas era la mitad del problema: por más
     * distinto que fuera cada dibujo, cuatro tarjetas con el texto arriba y
     * una banda de color abajo se leen como la misma tarjeta repetida.
     */
    composicion: "apilada" | "lado";
  }
> = {
  velocidad: {
    tone: "aqua",
    area: "md:col-start-1 md:row-start-1",
    art: "cronometro",
    composicion: "apilada",
  },
  seo: {
    tone: "rosa",
    area: "md:col-start-2 md:row-start-1",
    art: "respuesta",
    composicion: "apilada",
  },
  pantallas: {
    tone: "verde",
    area: "md:col-start-3 md:row-start-1 md:row-span-2",
    art: "pantallas",
    composicion: "apilada",
  },
  resultados: {
    tone: "miel",
    area: "md:col-start-1 md:col-span-2 md:row-start-2",
    art: "formulario",
    composicion: "lado",
  },
};

export const planDesign: Record<string, { tone: string; featured: boolean }> = {
  landing: { tone: "aqua", featured: false },
  sitio: { tone: "rosa", featured: true },
};

export const platformDesign: Record<
  string,
  { logo: string; logoWidth: number }
> = {
  webflow: { logo: "/logos/webflow-wordmark.svg", logoWidth: 120 },
  framer: { logo: "/logos/framer-wordmark.svg", logoWidth: 89 },
};

/* ------------------------------------------------------------------ */
/* Prueba social                                                       */
/* ------------------------------------------------------------------ */

/**
 * La frase de esta tira no dice cuántos clientes hay, y es a propósito: ver la
 * nota larga en copy.es.ts.
 *
 * Las marcas son los clientes reales, escritos en tipografía y no en logos:
 * mismo criterio que el riel del stack. Dibujarles un símbolo a mano sería
 * inventarles una identidad que no tienen, que es peor que no poner ninguna.
 *
 * Es la misma lista que fallbackProjects, a mano y no importada: aquello es el
 * respaldo del CMS y esto es el contenido de la tira. Si se suma un cliente,
 * va en los dos lados.
 */
export const socialProof = {
  faces: [
    { initials: "MP", from: "#6fcfca", to: "#166b67" },
    { initials: "RL", from: "#f2a5b6", to: "#a3405a" },
    { initials: "DF", from: "#f4c87d", to: "#8a5a12" },
  ],
  brands: ["Lupa Studio", "Remmy", "Acacia", "Rostar", "2MG"],
} as const;

/**
 * ⚠️ Reemplazar por los países donde realmente hay clientes antes de publicar.
 * El pie de la sección cuenta esta lista, así que el número siempre coincide
 * con lo que se muestra: no hay una cifra escrita a mano que se desactualice.
 *
 * El país va en español y funciona como clave: el nombre que se muestra sale
 * del copy del idioma que esté activo.
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

/**
 * De dónde salen las líneas del mapa.
 *
 * El estudio es también una de las ciudades de la lista de arriba, y no está
 * duplicado por descuido: en el mapa cumple dos papeles distintos —es el origen
 * de todas las líneas y es un cliente más— y separarlos acá evita que el
 * componente tenga que adivinar cuál de las nueve es la casa.
 */
export const studio = { city: "Buenos Aires", lon: -58.4, lat: -34.6 } as const;

/* ------------------------------------------------------------------ */
/* Stack                                                               */
/* ------------------------------------------------------------------ */

/**
 * El riel de herramientas. Son nombres de marca: no se traducen.
 *
 * Las marcas salen de Brandfetch. Vienen en la variante para fondo oscuro —o
 * sea, en blanco— así que se les horneó la tinta del sitio en el archivo:
 * un SVG cargado con <img> es un documento aparte y no hereda el color del
 * CSS, así que currentColor no serviría. Quedan todas monocromas, que es lo
 * que evita que catorce marcas de catorce paletas distintas se peleen entre
 * sí sobre el papel.
 *
 * Supabase es la excepción: Brandfetch solo tiene un PNG. Tiene alpha, así
 * que el filtro del CSS lo lleva a tinta sin tocar el recorte.
 *
 * Sanity, TypeScript y GSAP van sin marca: lo único que hay de ellos es un
 * cuadrado opaco de color, que al lado de marcas monocromas se ve como un
 * parche. Se quedan con el punto de tono, que ya es parte del lenguaje del
 * sitio. Si conseguís esos tres SVG, se agregan acá y listo.
 *
 * Dos filas que corren en sentidos opuestos: la de arriba es con qué se
 * diseña y dónde vive el contenido, la de abajo con qué se construye.
 */
export const stackRows = [
  [
    { name: "Figma", tone: "aqua", logo: "/logos/figma.svg" },
    { name: "Webflow", tone: "rosa", logo: "/logos/webflow.svg" },
    { name: "Framer", tone: "verde", logo: "/logos/framer.svg" },
    { name: "Sanity", tone: "miel", logo: null },
    { name: "Supabase", tone: "aqua", logo: "/logos/supabase.png" },
    { name: "Resend", tone: "rosa", logo: "/logos/resend.svg" },
    { name: "Vercel", tone: "verde", logo: "/logos/vercel.svg" },
  ],
  [
    { name: "Next.js", tone: "miel", logo: "/logos/nextjs.svg" },
    { name: "TypeScript", tone: "aqua", logo: null },
    { name: "Tailwind", tone: "rosa", logo: "/logos/tailwind.svg" },
    { name: "GSAP", tone: "verde", logo: null },
    { name: "GitHub", tone: "miel", logo: "/logos/github.svg" },
    { name: "Claude", tone: "aqua", logo: "/logos/claude.svg" },
    { name: "ChatGPT", tone: "rosa", logo: "/logos/chatgpt.svg" },
  ],
] as const;
