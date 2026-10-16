import { useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n";

/**
 * El estado del boleto dorado, compartido entre los dos que hay en la página.
 *
 * El de la portada y el del cierre son dos formularios, pero para quien los
 * usa son el mismo boleto: si reservó arriba, el que aterriza abajo tiene que
 * llegar ya reservado, no volver a pedirle el mail. Por eso el estado vive
 * acá, fuera de React, y cada boleto se suscribe.
 *
 * La reserva se recuerda en el navegador (localStorage): quien vuelve otro
 * día ve su lugar guardado en vez del campo vacío. Es una comodidad y nada
 * más; lo que vale es el documento que guarda /api/lugar en Sanity. Si el
 * navegador no deja guardar (ventana privada, permisos), se pierde el
 * recuerdo y no pasa nada más.
 */

export type EstadoBoleto =
  | { fase: "libre" }
  | { fase: "enviando" }
  | { fase: "reservado"; email: string }
  | { fase: "error"; motivo: "invalido" | "fallo" };

export type OrigenBoleto = "hero" | "cierre";

const CLAVE = "pantufla-boleto";
const INICIAL: EstadoBoleto = { fase: "libre" };

let estado: EstadoBoleto = INICIAL;
let leido = false;
const oyentes = new Set<() => void>();

function recordado(): EstadoBoleto {
  try {
    const email = window.localStorage.getItem(CLAVE);
    return email ? { fase: "reservado", email } : INICIAL;
  } catch {
    return INICIAL;
  }
}

function recordar(email: string | null) {
  try {
    if (email) window.localStorage.setItem(CLAVE, email);
    else window.localStorage.removeItem(CLAVE);
  } catch {
    /* Sin permiso para guardar: el boleto se olvida al recargar, y listo. */
  }
}

function cambiar(nuevo: EstadoBoleto) {
  estado = nuevo;
  for (const avisar of oyentes) avisar();
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

function leer() {
  if (!leido && typeof window !== "undefined") {
    leido = true;
    estado = recordado();
  }
  return estado;
}

export function useBoleto() {
  return useSyncExternalStore(suscribir, leer, () => INICIAL);
}

export async function reservarLugar(
  email: string,
  origen: OrigenBoleto,
  idioma: Locale,
  trampa: string,
) {
  const limpio = email.trim();
  // La misma regla floja del navegador: algo, arroba, algo, punto, algo. La
  // de verdad es la del servidor; esto solo evita un viaje para nada.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    cambiar({ fase: "error", motivo: "invalido" });
    return;
  }

  cambiar({ fase: "enviando" });
  try {
    const respuesta = await fetch("/api/lugar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: limpio,
        origen,
        idioma,
        website: trampa,
      }),
    });
    if (respuesta.status === 400) {
      cambiar({ fase: "error", motivo: "invalido" });
      return;
    }
    if (!respuesta.ok) throw new Error(String(respuesta.status));
    recordar(limpio);
    cambiar({ fase: "reservado", email: limpio });
  } catch {
    cambiar({ fase: "error", motivo: "fallo" });
  }
}

/** Vuelve a mostrar el campo, para dejar otro mail. */
export function soltarBoleto() {
  recordar(null);
  cambiar(INICIAL);
}
