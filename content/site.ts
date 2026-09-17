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
 * nota larga en copy.es.ts. Acá quedan las caras y las marcas, que son dibujo.
 *
 * Las marcas son de relleno y van dibujadas en código para que se vea la forma
 * de la tira. Las reales entran como SVG en public/logos, igual que las del
 * stack.
 */
export const socialProof = {
  faces: [
    { initials: "MP", from: "#6fcfca", to: "#166b67" },
    { initials: "RL", from: "#f2a5b6", to: "#a3405a" },
    { initials: "DF", from: "#f4c87d", to: "#8a5a12" },
  ],
  brands: ["Aureo", "Nimbo", "Cardinal", "Vela", "Tallo"],
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
