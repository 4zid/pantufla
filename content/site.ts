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

/** Qué dibujo lleva cada pilar de «Cómo lo resolvemos» (ver approach-art). */
export const approachDesign: Record<string, { art: string }> = {
  alcance: { art: "precio" },
  ritmo: { art: "reloj" },
  entrega: { art: "llaves" },
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
 * El orden de las tarjetas del bento, que es dos por dos (una columna en el
 * teléfono). El chat va primero, como en la referencia: es la viñeta que más
 * dice de un vistazo. El orden del texto en el copy no cambia; el lugar lo
 * pone esto.
 */
export const bentoDesign: Record<string, { area: string }> = {
  seo: { area: "order-1" },
  velocidad: { area: "order-2" },
  pantallas: { area: "order-3" },
  resultados: { area: "order-4" },
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
 * Las marcas son los clientes reales, con el logo que mandó cada uno. Están
 * en public/logos/clientes en negro sobre transparente: la tira los pinta con
 * la tinta del tema a través de una máscara, así que de cada archivo solo
 * cuenta la forma. Por eso van todos en un color, aunque el original sea
 * naranja o azul: siete paletas distintas en una tira angosta se pelean, y un
 * logo pintado no se daría vuelta con el fondo oscuro.
 *
 * Un cliente sin logo va con el nombre escrito. Dibujarle un símbolo a mano
 * sería inventarle una identidad que no tiene.
 *
 * `proporcion` es ancho sobre alto del archivo: con eso la tira le da a cada
 * logo la misma superficie, que es lo que hace que una marca cuadrada y una
 * palabra larga pesen parecido.
 * `escala` corrige a ojo el que igual queda liviano: Remmy tiene la palabra
 * fina y el círculo se lleva la altura, así que con la misma superficie que
 * los demás la palabra se lee chica.
 *
 * Casi todos están también en fallbackProjects, a mano y no importados:
 * aquello es el respaldo del CMS y esto es el contenido de la tira. Un cliente
 * cuyo trabajo se muestra va en los dos lados. Numia es la excepción a
 * propósito: es cliente, pero su trabajo no va en la lista de proyectos.
 */

/**
 * Una marca de la tira. El tipo va escrito porque hoy todas tienen logo: sin
 * él, TypeScript deduce que nunca falta y el caso del nombre escrito deja de
 * compilar, aunque siga haciendo falta para el próximo cliente que no mande
 * archivo.
 */
type MarcaCliente =
  | { name: string; logo: string; proporcion: number; escala?: number }
  | { name: string; logo: null };

const marcasClientes: MarcaCliente[] = [
  {
    name: "Lupa Studio",
    logo: "/logos/clientes/lupa-studio.svg",
    proporcion: 180 / 32,
  },
  {
    name: "Remmy",
    logo: "/logos/clientes/remmy.svg",
    proporcion: 404 / 100,
    escala: 1.3,
  },
  {
    name: "Acacia",
    logo: "/logos/clientes/acacia.png",
    proporcion: 259 / 63,
  },
  {
    name: "Rostar",
    logo: "/logos/clientes/rostar.png",
    proporcion: 411 / 102,
  },
  { name: "2MG", logo: "/logos/clientes/2mg.png", proporcion: 178 / 181 },
  {
    name: "Block Desarrollos",
    logo: "/logos/clientes/block.png",
    proporcion: 300 / 80,
  },
  { name: "Numia", logo: "/logos/clientes/numia.png", proporcion: 512 / 123 },
];

export const socialProof = {
  faces: [
    { initials: "MP", from: "#6fcfca", to: "#166b67" },
    { initials: "RL", from: "#f2a5b6", to: "#a3405a" },
    { initials: "DF", from: "#f4c87d", to: "#8a5a12" },
  ],
  brands: marcasClientes,
} as const;

/**
 * Los países donde trabajamos: los que se pintan en el globo y la lista de
 * al lado. El pie de la sección cuenta esta lista, así que el número siempre
 * coincide con lo que se muestra: no hay una cifra escrita a mano que se
 * desactualice.
 *
 * El país va en español y funciona como clave: el nombre que se muestra sale
 * de content/countries.ts, y el contorno que se pinta, de
 * content/globo-datos.ts (un país nuevo hay que sumarlo también en
 * scripts/generar-globo.mjs). La ciudad va solo donde la sabemos.
 *
 * `lon` y `lat` son dónde va la marca con el nombre, y adónde gira el globo
 * cuando se señala el país: la capital, o el medio del país en Estados
 * Unidos, que es enorme y no tiene una ciudad que lo resuma. En Argentina es
 * Buenos Aires, la casa del estudio.
 */
export const clients: {
  country: string;
  city?: string;
  lon: number;
  lat: number;
}[] = [
  { country: "Argentina", lon: -58.4, lat: -34.6 },
  { country: "Colombia", lon: -74.1, lat: 4.7 },
  { country: "Estados Unidos", lon: -98.5, lat: 39.5 },
  { country: "España", lon: -3.7, lat: 40.4 },
  { country: "Dinamarca", city: "Copenhague", lon: 12.6, lat: 55.7 },
];

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
