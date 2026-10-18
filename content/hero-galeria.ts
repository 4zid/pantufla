/**
 * Las pantallas que corren abajo del hero.
 *
 * Son capturas sueltas de los proyectos, de escritorio y de teléfono, sin
 * marco (el navegador y el teléfono los dibuja la galería), y la galería las
 * acomoda en columnas tipo masonry: dos de escritorio apiladas, una de
 * teléfono de alto entero, o una de escritorio grande cuando le sigue un
 * teléfono (ver hero-galeria.tsx).
 *
 * La galería no tiene lista propia. Cada proyecto carga las suyas en el
 * Studio, en «Pantallas para la portada», y la galería se arma sola con las
 * de todos, en el orden de los proyectos (ver get-hero-galeria.ts).
 *
 * Estas son el respaldo para cuando Sanity no contesta, y también el
 * original de lo que se subió: las mismas capturas, en el mismo orden. Las de
 * Kine, Daily y Tierras Argentinas salen de sus HTML de Claude Design,
 * recortadas pantalla por pantalla sin el marco; las de 2MG, de sus mockups
 * en assets/proyectos/2mg.
 */

export type FormatoPantalla = "desktop" | "mobile";

export type Pantalla = {
  id: string;
  src: string;
  /** Las medidas del archivo: arman el ancho de la columna y le reservan el lugar. */
  ancho: number;
  alto: number;
  formato: FormatoPantalla;
  alt: string;
  /**
   * El slug del proyecto. Las columnas se arman proyecto por proyecto, así
   * dos pantallas apiladas nunca son de dos proyectos distintos.
   */
  proyecto: string;
  /** El caso del proyecto, si lo tiene escrito. */
  href?: string;
};

const pantalla = (
  proyecto: string,
  n: number,
  formato: FormatoPantalla,
  [ancho, alto]: [number, number],
  alt: string,
): Pantalla => ({
  id: `${proyecto}-${n}`,
  src: `/hero/pantallas/${proyecto}-${n}-${formato}.webp`,
  ancho,
  alto,
  formato,
  alt,
  proyecto,
});

/*
   El orden de cada proyecto arma sus columnas: en Kine y Tierras Argentinas
   va una grande, un teléfono, dos apiladas y otro teléfono; en Daily y 2MG,
   al revés, las apiladas primero. Así, de un proyecto al siguiente el riel
   alterna en vez de repetir el mismo bloque.

   Sin href a propósito: el respaldo no sabe qué fichas existen en Sanity.
   get-hero-galeria.ts les pone el del caso a las de los proyectos que lo
   tienen en el respaldo de proyectos.
*/
export const pantallasDeRespaldo: Pantalla[] = [
  pantalla(
    "kine",
    1,
    "desktop",
    [1600, 979],
    "La portada de Kine: «Tus pacientes, ordenados. Su evolución, a la vista.»",
  ),
  pantalla(
    "kine",
    2,
    "mobile",
    [639, 1404],
    "El mapa corporal de Kine en el teléfono, con el dolor marcado en la rodilla derecha",
  ),
  pantalla(
    "kine",
    3,
    "desktop",
    [1098, 627],
    "Kine en escritorio: del primer dolor al alta, con el mapa corporal y la curva del dolor por sesión",
  ),
  pantalla(
    "kine",
    4,
    "desktop",
    [1098, 627],
    "El informe kinésico de Kine, listo para imprimir, con la evolución del dolor",
  ),
  pantalla(
    "kine",
    5,
    "mobile",
    [639, 1404],
    "La portada de Kine en el teléfono: «Tus pacientes, ordenados. Su evolución, a la vista.»",
  ),

  pantalla(
    "daily",
    1,
    "desktop",
    [990, 468],
    "El gráfico de Daily con el placer y el control de cada día de la semana",
  ),
  pantalla(
    "daily",
    2,
    "desktop",
    [990, 555],
    "El día en Daily: el ánimo del jueves y la reflexión del paciente",
  ),
  pantalla(
    "daily",
    3,
    "mobile",
    [579, 1284],
    "El registro diario de Daily en el teléfono: la semana y las actividades del viernes",
  ),
  pantalla(
    "daily",
    4,
    "desktop",
    [1600, 974],
    "El informe semanal de Daily para el terapeuta: placer, control y constancia del paciente",
  ),
  pantalla(
    "daily",
    5,
    "mobile",
    [579, 1284],
    "«Contale tu día» en Daily: el paciente cuenta su día y la app lo ordena en actividades",
  ),

  pantalla(
    "tierras-argentinas",
    1,
    "desktop",
    [1600, 996],
    "La portada de Tierras Argentinas: «¿De quién es la tierra argentina?»",
  ),
  pantalla(
    "tierras-argentinas",
    2,
    "mobile",
    [678, 1458],
    "Tierras Argentinas en el teléfono: caso por caso, con el expediente del Grupo Benetton",
  ),
  pantalla(
    "tierras-argentinas",
    3,
    "desktop",
    [1140, 657],
    "La línea de tiempo de Tierras Argentinas, de la Ley de Tierras al DNU 70/2023",
  ),
  pantalla(
    "tierras-argentinas",
    4,
    "desktop",
    [1140, 657],
    "Dónde pesa más: el porcentaje de tierra rural en manos extranjeras por provincia",
  ),
  pantalla(
    "tierras-argentinas",
    5,
    "mobile",
    [678, 1458],
    "El Senado banca por banca, en el teléfono",
  ),

  pantalla(
    "2mg",
    1,
    "desktop",
    [1600, 741],
    "Los servicios de 2MG: creatividad, puesta en marcha y equipamiento",
  ),
  pantalla(
    "2mg",
    2,
    "desktop",
    [1600, 748],
    "El proceso de un evento de 2MG en cuatro pasos, de la idea a la postproducción",
  ),
  pantalla(
    "2mg",
    3,
    "mobile",
    [660, 1512],
    "La portada de 2MG en el teléfono: «Tecnología que potencia cada mensaje»",
  ),
  pantalla(
    "2mg",
    4,
    "desktop",
    [1600, 987],
    "La portada de 2MG en escritorio, con los botones de WhatsApp y de propuesta",
  ),
  pantalla(
    "2mg",
    5,
    "mobile",
    [660, 1512],
    "Las preguntas frecuentes de 2MG en el teléfono",
  ),
];
