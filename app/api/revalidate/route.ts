import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";

/**
 * Le avisa al sitio que cambió algo en Sanity.
 *
 * Sin esto, publicar en el Studio no se veía. Cada consulta a Sanity queda
 * cacheada con una etiqueta —project, post, testimonial, siteCopy— y sin nadie
 * que las invalide lo único que las vence es el tiempo. O sea que un cambio
 * tardaba en aparecer, y si la página ya estaba servida desde el borde podía no
 * aparecer nunca hasta el próximo deploy. Que es exactamente lo que pasaba.
 *
 * Ahora Sanity pega acá al publicar, esto borra la etiqueta del tipo que
 * cambió y el próximo visitante ve el contenido nuevo. No hay build de por
 * medio: no hace falta redesplegar el sitio para cambiar un texto, que es todo
 * el punto de tener un CMS.
 *
 * Se invalida por tipo y no la página entera porque las etiquetas ya están
 * puestas en cada consulta. Publicar un proyecto no tiene por qué tirar el
 * caché de las notas.
 *
 * La firma no es opcional. Este endpoint es público —tiene que serlo, lo llama
 * Sanity desde afuera— así que sin verificar quién golpea, cualquiera puede
 * tirarle el caché al sitio todo el día. Sanity firma cada envío con un
 * secreto compartido y acá se comprueba antes de tocar nada.
 */

/** Node y no edge: la verificación de la firma usa crypto. */
export const runtime = "nodejs";

/** Los tipos que el sitio consulta con etiqueta. El resto se ignora. */
const TIPOS = new Set(["project", "post", "testimonial", "siteCopy"]);

export async function POST(request: Request) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    console.error("[revalidate] falta SANITY_REVALIDATE_SECRET");
    return Response.json({ error: "sin configurar" }, { status: 500 });
  }

  // El cuerpo se lee como texto y no como JSON: la firma se calcula sobre los
  // bytes exactos que mandó Sanity, y pasar por JSON.parse y volver a
  // serializar cambia el espaciado y la invalida.
  const cuerpo = await request.text();
  const firma = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!firma || !(await isValidSignature(cuerpo, firma, secreto))) {
    return Response.json({ error: "firma inválida" }, { status: 401 });
  }

  let tipo: unknown;
  try {
    tipo = (JSON.parse(cuerpo) as { _type?: unknown })._type;
  } catch {
    return Response.json({ error: "cuerpo ilegible" }, { status: 400 });
  }

  /*
     Sin _type no se sabe qué cambió, y pasa de verdad: alcanza con que el
     webhook lleve una proyección propia que no lo incluya, o que el evento sea
     un borrado, para que el cuerpo llegue con poco más que el id. Ignorarlo
     sería el peor final posible para un webhook —contesta 200, Sanity lo da
     por entregado, y el cambio no aparece nunca—, así que se vencen las cuatro
     etiquetas. Cuesta cuatro consultas de más en la próxima visita; a cambio
     no hay forma de que un cambio se pierda por cómo quedó configurado el
     webhook del otro lado.
  */
  if (typeof tipo !== "string") {
    for (const cada of TIPOS) revalidateTag(cada, { expire: 0 });
    return Response.json({
      revalidado: true,
      tipos: [...TIPOS],
      cuando: Date.now(),
    });
  }

  if (!TIPOS.has(tipo)) {
    // Un tipo que el sitio no consulta: un brief, por ejemplo. No es un error
    // —el webhook puede estar mandando más de lo que hace falta— y se contesta
    // 200 para que Sanity no lo marque como caído.
    return Response.json({ revalidado: false, tipo });
  }

  /*
     expire 0 y no el perfil "max" que recomienda la doc. Con "max" el
     contenido viejo se sigue sirviendo mientras la revalidación corre por
     detrás, así que el primero que entra después de publicar —que en general
     es el que publicó, yendo a ver cómo quedó— todavía ve lo de antes. Con
     expire 0 el próximo pedido espera y trae lo nuevo. Cuesta una request
     lenta cada vez que se publica; a cambio, publicar y recargar alcanza.
  */
  revalidateTag(tipo, { expire: 0 });
  return Response.json({ revalidado: true, tipo, cuando: Date.now() });
}

/**
 * Un GET para poder ver de un vistazo si el endpoint está vivo y configurado,
 * sin tener que publicar algo en el Studio para probarlo. No revalida nada ni
 * dice cuál es el secreto: solo si hay uno.
 */
export async function GET() {
  return Response.json({
    listo: Boolean(process.env.SANITY_REVALIDATE_SECRET),
    tipos: [...TIPOS],
  });
}
