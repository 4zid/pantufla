import type { PortableTextBlock } from "sanity";

/**
 * Los casos escritos, como respaldo de lo que está en Sanity.
 *
 * La fuente es el campo «Caso completo» de cada proyecto en el Studio; esto es
 * lo mismo, para que la ficha y el enlace «Leer el caso» se vean igual con el
 * CMS caído o en un clon recién hecho. Si se edita un caso en el Studio, gana
 * el Studio: esto no se lee mientras Sanity conteste.
 *
 * Están escritos a partir de lo que muestra cada sitio publicado. No llevan
 * métricas ni plazos porque no los tenemos: un número inventado sobre un
 * cliente real es mentir en la ficha.
 *
 * Cada caso es una lista de renglones: [estilo, texto]. «li» es un ítem de
 * lista; el resto es el estilo del bloque. Se arma en Portable Text abajo,
 * que es la forma que tiene el campo en Sanity.
 */
type Renglon = ["h2" | "normal" | "li", string];

function aBloques(prefijo: string, renglones: Renglon[]): PortableTextBlock[] {
  return renglones.map(([estilo, texto], i) => ({
    _type: "block",
    _key: `${prefijo}${i + 1}`,
    style: estilo === "li" ? "normal" : estilo,
    ...(estilo === "li" ? { listItem: "bullet", level: 1 } : {}),
    markDefs: [],
    children: [
      { _type: "span", _key: `${prefijo}${i + 1}s`, text: texto, marks: [] },
    ],
  }));
}

export const casos: Record<string, PortableTextBlock[]> = {
  "tierras-argentinas": aBloques("ta", [
    ["h2", "El punto de partida"],
    [
      "normal",
      "Los datos sobre tierra rural en manos extranjeras existen: el Registro Nacional de Tierras Rurales, fallos judiciales, notas de prensa. Pero están desparramados y escritos para especialistas. La idea fue juntarlos en un solo lugar que cualquiera pudiera recorrer, y que cada número se pudiera verificar.",
    ],
    ["h2", "Lo que tiene el sitio"],
    [
      "li",
      "Un mapa de la Argentina, provincia por provincia, con el porcentaje de tierra extranjerizada según el RNTR y el tope del 15% de la Ley de Tierras como referencia.",
    ],
    [
      "li",
      "Una ficha por caso —quién compró, cuántas hectáreas, dónde— con sus fuentes públicas enlazadas, y un filtro entre casos comprobados y en negociación.",
    ],
    [
      "li",
      "La historia de la ley, de 2011 al debate actual, y el Senado banca por banca: cómo votó cada uno.",
    ],
    [
      "li",
      "Los datos para llevarse: los casos en PDF y el dataset completo en JSON, con licencia abierta.",
    ],
    [
      "li",
      "Un rastreo diario de la prensa que lista las últimas noticias sobre el tema.",
    ],
    ["h2", "La regla"],
    [
      "normal",
      "Es un sitio de datos sobre un tema discutido, así que la regla de diseño fue de contenido: todo lo que se afirma lleva su fuente al lado, y lo que no está comprobado se marca como tal. El tono visual acompaña: sobrio, sin dramatizar, con el mapa y los números adelante.",
    ],
  ]),
  "2mg": aBloques("mg", [
    ["h2", "El punto de partida"],
    [
      "normal",
      "2MG es una productora técnica con veinte años en eventos corporativos en Argentina, Chile y Uruguay: pantallas LED, proyección, audio, streaming y traducción simultánea, con equipamiento propio. Ofrecen mucho, y el riesgo de un sitio así es que se lea como un catálogo de equipos. Quien contrata un evento quiere saber otra cosa: si van a estar a la altura el día que importa.",
    ],
    ["h2", "Cómo lo armamos"],
    [
      "li",
      "Presentamos la oferta en tres áreas —creatividad, puesta en marcha y equipamiento— en vez de una lista larga de servicios.",
    ],
    [
      "li",
      "Contamos el proceso de un evento de punta a punta: del primer brief al día del evento, y del desmontaje al reporte de cierre.",
    ],
    [
      "li",
      "Sumamos lo que da confianza: testimonios por tipo de evento, preguntas frecuentes y el equipo que está detrás.",
    ],
    [
      "li",
      "Dos caminos de contacto según el apuro: WhatsApp para una respuesta en el día y un formulario de propuesta que ya pregunta el tipo de evento.",
    ],
    ["h2", "La idea"],
    [
      "normal",
      "Que el sitio se sienta como la empresa trabaja: prolijo, técnico y sin ruido. La tecnología aparece como lo que hace posible el evento, no como el protagonista.",
    ],
  ]),
  "247wc": aBloques("wc", [
    ["h2", "El punto de partida"],
    [
      "normal",
      "Buscar un baño en la calle es una búsqueda con apuro, y las apps de mapas no están pensadas para eso: muestran todo, piden cuenta o hay que instalar algo. 247WC hace una sola cosa: te dice cuál es el baño público más cercano y te lleva caminando.",
    ],
    ["h2", "Lo que tiene la app"],
    [
      "li",
      "La app web: un botón busca los baños públicos a menos de 3 km, con datos abiertos de OpenStreetMap, y los ordena por distancia.",
    ],
    [
      "li",
      "La guía: una brújula que apunta al baño y cuenta los metros que faltan, o la ruta en Google Maps para quien la prefiera.",
    ],
    [
      "li",
      "Los filtros que importan cuando hay apuro: gratis, abierto las 24 horas, accesible y con cambiador. Si no hay baños públicos cerca, suma bares y negocios.",
    ],
    [
      "li",
      "Nada que instalar ni registrarse: se agrega a la pantalla de inicio y abre como una app, en español e inglés, con modo oscuro. La ubicación no se guarda.",
    ],
    [
      "li",
      "La landing que la presenta, con el recorrido en tres pasos: escanear, elegir y llegar.",
    ],
    ["h2", "La idea"],
    [
      "normal",
      "Cada pantalla responde una sola pregunta, y la más importante —dónde está el baño— se contesta con un toque. Todo lo demás está, pero no se interpone.",
    ],
  ]),
};
