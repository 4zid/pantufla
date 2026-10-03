/**
 * El calendario de reservas, y si está conectado.
 *
 * El identificador del evento en Cal.com, del estilo "pantufla/20min", sale
 * de NEXT_PUBLIC_CAL_LINK. Mientras no esté cargado, /reunion muestra la
 * tarjeta de respaldo con el mail, y los botones que prometen «agendar» no
 * pueden llevar ahí: alguien que tocó «Agendar 20 minutos» y encuentra «el
 * calendario todavía no está conectado» siente que el sitio está roto. Así
 * que esos botones miran esto y, sin calendario, ofrecen el mail.
 *
 * Es NEXT_PUBLIC, así que se resuelve en el build: cargar la variable en
 * Vercel pide un deploy nuevo para que el sitio se entere.
 */
export const ENLACE_CAL = process.env.NEXT_PUBLIC_CAL_LINK;

export const calendarioConectado = Boolean(ENLACE_CAL);
