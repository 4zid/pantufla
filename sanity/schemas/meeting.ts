import { defineField, defineType } from "sanity";

/**
 * Una reunión reservada, tal como la manda Cal.com.
 *
 * Es un espejo, no la fuente: el calendario de verdad lo lleva Cal, que es
 * quien sabe cuándo hay lugar y quien le avisa a todo el mundo. Esto existe
 * para que las reuniones aparezcan en el Studio al lado de los briefs, y no
 * haya que entrar a dos paneles para saber qué entró esta semana.
 *
 * Por eso es de solo lectura. Cambiar acá una fecha no cambiaría nada del otro
 * lado: quedaría un dato que dice una cosa y un calendario que dice otra, que
 * es peor que no tener el dato.
 *
 * El uid es el de Cal y es lo que hace idempotente al webhook: si Cal reintenta
 * un envío —lo hace cuando no le contestamos rápido—, se vuelve a escribir el
 * mismo documento en vez de crear otra reunión igual.
 */
export const meeting = defineType({
  name: "meeting",
  title: "Reunión agendada",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "uid", title: "ID en Cal.com", type: "string" }),
    defineField({ name: "name", title: "Nombre", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "startsAt",
      title: "Cuándo",
      type: "datetime",
      description: "En UTC. El Studio lo muestra en tu horario.",
    }),
    defineField({
      name: "timeZone",
      title: "Zona horaria de quien reservó",
      type: "string",
      description:
        "La suya, no la nuestra: es el dato que dice a qué hora lo vive del otro lado.",
    }),
    defineField({ name: "duration", title: "Minutos", type: "number" }),
    defineField({ name: "notes", title: "Qué quiere charlar", type: "text", rows: 5 }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Agendada", value: "agendada" },
          { title: "Reprogramada", value: "reprogramada" },
          { title: "Cancelada", value: "cancelada" },
        ],
      },
    }),
    defineField({ name: "meetingUrl", title: "Link de la videollamada", type: "url" }),
    defineField({ name: "receivedAt", title: "Recibido", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Próximas primero",
      name: "startsAtAsc",
      by: [{ field: "startsAt", direction: "asc" }],
    },
    {
      title: "Últimas reservadas",
      name: "receivedDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "startsAt", status: "status" },
    prepare({ title, subtitle, status }) {
      const cuando = subtitle
        ? new Date(subtitle).toLocaleString("es-AR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "sin fecha";
      return {
        title: title || "Sin nombre",
        subtitle: `${cuando}${status && status !== "agendada" ? ` · ${status}` : ""}`,
      };
    },
  },
});
