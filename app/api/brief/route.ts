import { NextResponse } from "next/server";
import { z } from "zod";

import { getWriteClient } from "@/sanity/client";

const briefSchema = z.object({
  name: z.string().min(2, "Escribí tu nombre").max(120, "El nombre es muy largo"),
  email: z.email("Revisá el email"),
  company: z.string().max(160, "El nombre de la empresa es muy largo").optional(),
  plan: z.string().max(60),
  budget: z.string().max(60),
  timeline: z.string().max(60),
  message: z
    .string()
    .min(10, "Contanos un poco más")
    .max(4000, "El mensaje es muy largo"),
  /**
   * Campo trampa: los bots lo completan, las personas no lo ven. Se acepta
   * cualquier valor y se descarta más abajo, para no darle al bot una pista
   * de que fue detectado.
   */
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

  const parsed = briefSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Revisá los datos" },
      { status: 400 },
    );
  }

  const { website, ...brief } = parsed.data;
  // Trampa activada: respondemos OK para no darle información al bot.
  if (website) return NextResponse.json({ ok: true });

  const receivedAt = new Date().toISOString();
  let stored = false;
  let notified = false;

  // 1. Guardar el brief en Sanity para que quede en el panel.
  const writeClient = getWriteClient();
  if (writeClient) {
    try {
      await writeClient.create({ _type: "brief", ...brief, receivedAt });
      stored = true;
    } catch (error) {
      console.error("[brief] no se pudo guardar en Sanity:", error);
    }
  }

  // 2. Avisar por mail.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_NOTIFICATION_TO;
  const from = process.env.BRIEF_NOTIFICATION_FROM;

  if (apiKey && to && from) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const rows = [
        ["Nombre", brief.name],
        ["Email", brief.email],
        ["Empresa", brief.company || "—"],
        ["Plan", brief.plan],
        ["Presupuesto", brief.budget],
        ["Plazo", brief.timeline],
      ]
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#8d8779">${label}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(String(value))}</td></tr>`,
        )
        .join("");

      await resend.emails.send({
        from,
        to,
        replyTo: brief.email,
        subject: `Brief nuevo — ${brief.name} (${brief.plan})`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#17150f;max-width:560px">
            <h2 style="margin:0 0 20px;font-size:20px">Brief nuevo</h2>
            <table style="border-collapse:collapse;font-size:14px">${rows}</table>
            <p style="margin:24px 0 8px;color:#8d8779;font-size:13px">Mensaje</p>
            <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(brief.message)}</p>
          </div>
        `,
      });
      notified = true;
    } catch (error) {
      console.error("[brief] no se pudo enviar el mail:", error);
    }
  }

  if (!stored && !notified) {
    console.error("[brief] recibido sin destino configurado:", brief);
    return NextResponse.json(
      {
        error:
          "No pudimos registrar el mensaje. Escribinos directo a hola@pantufla.studio.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
