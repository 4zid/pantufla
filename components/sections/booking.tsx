"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

import { site } from "@/content/site";
import { useCopy } from "@/components/copy-provider";

/**
 * El calendario de reservas.
 *
 * El motor es Cal.com y no algo nuestro, y la razón no es la interfaz —esa es
 * la parte fácil— sino las cuatro que vienen abajo de ella: saber cuándo la
 * persona que atiende está ocupada, impedir que dos visitantes tomen el mismo
 * turno, traducir la hora a la zona horaria de cada uno —los clientes están en
 * siete países— y mandar recordatorios, el link de video y los avisos de
 * cancelación. Construir eso a mano es construir un calendario, y un calendario
 * a medio hacer no falla a la vista: falla el día que alguien aparece una hora
 * tarde.
 *
 * El límite de una reunión por día tampoco se programa acá: es un ajuste del
 * tipo de evento en Cal —Limits & buffers, 1 por day— y por eso vive del lado
 * de quien atiende, que es quien lo va a querer cambiar.
 *
 * Va embebido y no como un enlace afuera. Mandar a alguien a otro dominio justo
 * en el momento de decidir es perderlo: cambia el color, cambia la tipografía y
 * deja de estar tratando con Pantufla. Acá el mes se abre adentro de la página.
 *
 * Si la variable no está cargada, no se rompe nada: se muestra la tarjeta de
 * respaldo con el mail. Es el estado en el que vive el sitio hasta que alguien
 * cree la cuenta, y una página de reservas que explota porque falta una
 * variable es peor que una que te da una dirección.
 */

/** El identificador del evento en Cal, del estilo "pantufla/20min". */
const ENLACE = process.env.NEXT_PUBLIC_CAL_LINK;

export function Booking() {
  const { meeting } = useCopy();
  const [listo, setListo] = useState(false);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    if (!ENLACE) return;
    let vivo = true;

    (async () => {
      try {
        const cal = await getCalApi();
        if (!vivo) return;
        cal("ui", {
          // El mes entero y no la lista de horarios: con una sola reunión por
          // día, lo que el visitante necesita ver es qué días quedan, no qué
          // horas. En la lista, un día ocupado no se distingue de uno que
          // todavía no miró.
          layout: "month_view",
          cssVarsPerTheme: {
            light: { "cal-brand": "#166b67" },
            dark: { "cal-brand": "#6fcfca" },
          },
          hideEventTypeDetails: false,
        });
        setListo(true);
      } catch {
        // La red puede fallar y el bloqueador de publicidad de alguien también.
        // En los dos casos hace falta una salida que no sea una caja vacía.
        if (vivo) setFallo(true);
      }
    })();

    return () => {
      vivo = false;
    };
  }, []);

  if (!ENLACE || fallo) {
    return (
      /* Angosta y no al ancho del calendario: hereda el contenedor ancho, y
         una tarjeta de cien caracteres estirada a 100rem se ve como algo que
         se rompió, no como una alternativa. Es además el estado en el que vive
         el sitio hasta que exista la cuenta de Cal, así que tiene que parecer
         a propósito. */
      <div className="mx-auto max-w-xl rounded-panel border border-line bg-card p-8 text-center md:p-12">
        <p className="text-[1.05rem] font-medium">{meeting.fallback}</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-3 inline-block text-[0.98rem] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
        >
          {site.email}
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-card p-2">
      {/* El alto reservado desde el principio: el embed tarda en montar y sin
          una altura mínima la página da un salto cuando entra, justo cuando el
          visitante ya apuntó el dedo a algo. */}
      <div className="relative min-h-[620px] overflow-hidden rounded-[18px] md:min-h-[680px]">
        {!listo ? (
          <div
            aria-hidden
            className="absolute inset-0 grid place-items-center text-[0.92rem] text-ink-faint"
          >
            {meeting.loading}
          </div>
        ) : null}

        <Cal
          calLink={ENLACE}
          className="h-full w-full"
          style={{ minHeight: "620px" }}
          config={{ layout: "month_view" }}
        />
      </div>
    </div>
  );
}
