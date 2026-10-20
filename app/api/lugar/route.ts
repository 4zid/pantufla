import { createHash } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getWriteClient } from "@/sanity/client";

/**
 * Recibe el pase: alguien que quiere su lugar en la agenda, con nombre y
 * mail, desde el banner de la mitad de la home. La portada tuvo un formulario
 * con el mail solo; ya no está, pero el origen «hero» se sigue aceptando por
 * si queda alguna página vieja abierta.
 *
 * Sigue el camino del brief (api/brief): se guarda en Sanity, para que quede
 * en el Studio como «Lugar reservado», y se avisa por mail con las mismas
 * variables de Resend. Con que salga una de las dos alcanza; si fallan las
 * dos, se contesta error para que el pase no diga «reservado» sin que nadie
 * se haya enterado.
 */

const esquema = z.object({
  email: z.email("Revisá el mail").max(200),
  nombre: z.string().trim().max(80).optional(),
  origen: z.enum(["hero", "banner"]).catch("hero"),
  idioma: z.enum(["es", "en"]).catch("es"),
  /** Campo trampa, como en el brief: las personas no lo ven. */
  website: z.string().optional(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const parsed = esquema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Revisá el mail" },
      { status: 400 },
    );
  }

  const { website, email, origen, idioma } = parsed.data;
  const nombre = parsed.data.nombre || undefined;
  // Trampa activada: OK para no darle pistas al bot.
  if (website) return NextResponse.json({ ok: true });

  const receivedAt = new Date().toISOString();
  let stored = false;
  let notified = false;

  /*
     El id sale del mail, en minúsculas: dejarlo dos veces —arriba y abajo,
     o volver otro día— no suma otra fila a la lista de espera. Con
     createIfNotExists queda la primera, que es la que dice desde cuándo
     espera. Va con hash y no con el mail a la vista porque los ids de Sanity
     solo aceptan letras, números, puntos, guiones y guiones bajos.

     El nombre es la excepción: si la primera vez dejó solo el mail (desde la
     portada) y después vuelve con su nombre (desde el banner), se suma, sin
     pisar uno que ya estuviera.
  */
  const id = `lugar.${createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 32)}`;

  const writeClient = getWriteClient();
  if (writeClient) {
    try {
      await writeClient.createIfNotExists({
        _id: id,
        _type: "lugar",
        email,
        ...(nombre ? { nombre } : {}),
        origen,
        idioma,
        receivedAt,
      });
      if (nombre) {
        await writeClient.patch(id).setIfMissing({ nombre }).commit();
      }
      stored = true;
    } catch (error) {
      console.error("[lugar] no se pudo guardar en Sanity:", error);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_NOTIFICATION_TO;
  const from = process.env.BRIEF_NOTIFICATION_FROM;

  if (apiKey && to && from) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `Lugar reservado — ${nombre ?? email}`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#17150f;max-width:560px">
            <h2 style="margin:0 0 12px;font-size:20px">Alguien reservó su lugar</h2>
            <p style="margin:0 0 16px;font-size:14px;line-height:1.6">Dejó sus datos en el pase ${
              origen === "banner"
                ? "del banner de la mitad de la home"
                : "de la portada"
            } y quiere que le escriban cuando se abra el próximo cupo.</p>
            ${nombre ? `<p style="margin:0 0 4px;font-size:16px;font-weight:600">${escapeHtml(nombre)}</p>` : ""}
            <p style="margin:0;font-size:${nombre ? "14px;color:#4a463d" : "16px;font-weight:600"}">${escapeHtml(email)}</p>
            <p style="margin:16px 0 0;color:#8d8779;font-size:13px">Idioma: ${idioma}</p>
          </div>
        `,
      });
      notified = true;
    } catch (error) {
      console.error("[lugar] no se pudo enviar el mail:", error);
    }
  }

  if (!stored && !notified) {
    console.error("[lugar] recibido sin destino configurado");
    return NextResponse.json({ error: "Sin destino" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
