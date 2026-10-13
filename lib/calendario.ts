/**
 * El calendario de reservas, y si está conectado.
 *
 * El identificador del evento en Cal.com, del estilo "lautaro-lacaze-wi4kmc/15min", sale
 * de NEXT_PUBLIC_CAL_LINK. Mientras no esté cargado, /reunion muestra la
 * tarjeta de respaldo con el mail, y los botones que prometen «agendar» no
 * pueden llevar ahí: alguien que tocó «Agendar 15 minutos» y encuentra «el
 * calendario todavía no está conectado» siente que el sitio está roto. Así
 * que esos botones miran esto y, sin calendario, ofrecen el mail.
 *
 * Es NEXT_PUBLIC, así que se resuelve en el build: cargar la variable en
 * Vercel pide un deploy nuevo para que el sitio se entere.
 */
export const ENLACE_CAL = identificador(process.env.NEXT_PUBLIC_CAL_LINK);

/**
 * El embed de Cal pide el identificador solo («usuario/evento») y le pega
 * adelante su propio dominio. Lo natural al cargar la variable es copiar el
 * link entero de la barra del navegador, y con la URL completa el embed armaba
 * una dirección doble y el calendario no cargaba. Así que se acepta de las dos
 * formas: si viene con el dominio de Cal adelante, se lo saca acá.
 */
function identificador(valor: string | undefined) {
  const limpio = valor
    ?.trim()
    .replace(/^https?:\/\/(?:app\.)?cal\.com\//i, "")
    .replace(/\/+$/, "");
  return limpio || undefined;
}

export const calendarioConectado = Boolean(ENLACE_CAL);
