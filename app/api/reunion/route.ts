import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

import { getWriteClient } from "@/sanity/client";

/**
 * Las reservas de Cal.com, espejadas en Sanity.
 *
 * El calendario sigue siendo de Cal: él sabe cuándo hay lugar, él avisa y él
 * reprograma. Esto solo copia lo que pasó para que las reuniones aparezcan en
 * el Studio al lado de los briefs, y no haya que abrir dos paneles para saber
 * qué entró esta semana.
 *
 * Es un espejo y no una fuente, así que nunca contesta con error cuando Sanity
 * falla: Cal reintenta los webhooks que no responden 2xx, y un reintento no
 * arregla que falte el token de escritura. Lo único que lograría es que la
 * misma reserva vuelva a golpear cada pocos minutos. Si algo falla queda en el
 * log y la reserva existe igual, que es lo que importa: la reunión está en el
 * calendario de quien atiende.
 */

/** Node y no edge: la firma usa crypto. */
export const runtime = "nodejs";

/**
 * Cal firma el cuerpo con HMAC-SHA256 y el secreto del webhook, y lo manda en
 * esta cabecera. Sin verificarla, cualquiera que sepa la URL puede escribir
 * reuniones inventadas en el CMS.
 */
const CABECERA = "x-cal-signature-256";

const ESTADOS = {
  BOOKING_CREATED: "agendada",
  BOOKING_RESCHEDULED: "reprogramada",
  BOOKING_CANCELLED: "cancelada",
} as const;

/**
 * Solo lo que se guarda. Cal manda bastante más y el resto se descarta a
 * propósito: lo que no se usa no se copia, y menos todavía a un CMS donde lo
 * va a ver una persona.
 */
const evento = z.object({
  triggerEvent: z.string(),
  payload: z.object({
    uid: z.string(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    length: z.number().optional(),
    // La agenda puede tener varios invitados; el primero es quien reservó.
    attendees: z
      .array(
        z.object({
          name: z.string().optional(),
          email: z.string().optional(),
          timeZone: z.string().optional(),
        }),
      )
      .optional(),
    responses: z
      .object({
        notes: z.union([z.string(), z.object({ value: z.string() })]).optional(),
      })
      .partial()
      .optional(),
    additionalNotes: z.string().optional(),
    metadata: z.object({ videoCallUrl: z.string().optional() }).partial().optional(),
  }),
});

/** Comparación en tiempo constante, para no filtrar la firma a fuerza de medir. */
function firmaValida(cuerpo: string, firma: string, secreto: string) {
  const esperada = createHmac("sha256", secreto).update(cuerpo).digest("hex");
  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(firma, "utf8");
  // timingSafeEqual tira si los largos no coinciden, y el largo no es secreto.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secreto = process.env.CAL_WEBHOOK_SECRET;
  if (!secreto) {
    console.error("[reunion] falta CAL_WEBHOOK_SECRET");
    return Response.json({ error: "sin configurar" }, { status: 500 });
  }

  // Texto y no JSON: la firma se calcula sobre los bytes exactos que mandó Cal,
  // y volver a serializar cambia el espaciado y la invalida.
  const cuerpo = await request.text();
  const firma = request.headers.get(CABECERA);
  if (!firma || !firmaValida(cuerpo, firma, secreto)) {
    return Response.json({ error: "firma inválida" }, { status: 401 });
  }

  let datos: z.infer<typeof evento>;
  try {
    datos = evento.parse(JSON.parse(cuerpo));
  } catch {
    return Response.json({ error: "cuerpo ilegible" }, { status: 400 });
  }

  const estado = ESTADOS[datos.triggerEvent as keyof typeof ESTADOS];
  // Un disparador que no miramos no es un error: Cal puede estar mandando más
  // de lo que el sitio usa, y contestarle mal lo haría reintentar para siempre.
  if (!estado) return Response.json({ guardado: false, evento: datos.triggerEvent });

  const cliente = getWriteClient();
  if (!cliente) {
    console.error("[reunion] falta SANITY_API_WRITE_TOKEN");
    return Response.json({ guardado: false });
  }

  const p = datos.payload;
  const quien = p.attendees?.[0];
  const notas =
    typeof p.responses?.notes === "string"
      ? p.responses.notes
      : p.responses?.notes?.value || p.additionalNotes;

  try {
    /*
       El id del documento sale del uid de Cal, así que el webhook es
       idempotente: Cal reintenta cuando no le contestamos rápido, y sin esto
       cada reintento dejaría otra reunión igual en el Studio. Con createOrReplace
       el reintento reescribe la misma.

       Y sirve para lo mismo cuando alguien reprograma o cancela: llega el mismo
       uid con otro estado y actualiza la fila que ya estaba, en vez de dejar
       dos versiones de la misma reunión contándose distinto.
    */
    await cliente.createOrReplace({
      _id: `meeting.${p.uid}`,
      _type: "meeting",
      uid: p.uid,
      name: quien?.name,
      email: quien?.email,
      startsAt: p.startTime,
      timeZone: quien?.timeZone,
      duration:
        p.length ??
        (p.startTime && p.endTime
          ? Math.round(
              (Date.parse(p.endTime) - Date.parse(p.startTime)) / 60000,
            )
          : undefined),
      notes: notas,
      status: estado,
      meetingUrl: p.metadata?.videoCallUrl,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[reunion] no se pudo guardar en Sanity:", error);
  }

  return Response.json({ guardado: true, estado });
}

/** Para ver de un vistazo si está configurado, sin tener que reservar algo. */
export async function GET() {
  return Response.json({
    listo: Boolean(process.env.CAL_WEBHOOK_SECRET),
    escribe: Boolean(process.env.SANITY_API_WRITE_TOKEN),
    eventos: Object.keys(ESTADOS),
  });
}
