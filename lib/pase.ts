import { useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n";

/**
 * El estado del pase, compartido por todo lo que lo muestra.
 *
 * El formulario de la portada y el del banner son dos, pero para quien los
 * usa son el mismo pase: si reservó arriba, el de abajo tiene que estar ya
 * reservado, no volver a pedirle los datos. Y el pase 3D imprime el nombre y
 * el mail en su cara apenas se reserva. Por eso el estado vive acá, fuera de
 * React, y cada parte se suscribe.
 *
 * La reserva se recuerda en el navegador (localStorage): quien vuelve otro
 * día ve su lugar guardado en vez del campo vacío. Es una comodidad y nada
 * más; lo que vale es el documento que guarda /api/lugar en Sanity. Si el
 * navegador no deja guardar (ventana privada, permisos), se pierde el
 * recuerdo y no pasa nada más.
 */

export type EstadoPase =
  | { fase: "libre" }
  | { fase: "enviando" }
  | { fase: "reservado"; email: string; nombre?: string }
  | { fase: "error"; motivo: "invalido" | "nombre" | "fallo" };

export type OrigenPase = "hero" | "banner";

/** Lo que deja quien reserva. El nombre solo lo pide el banner. */
export type DatosPase = { email: string; nombre?: string };

const CLAVE = "pantufla-pase";
const INICIAL: EstadoPase = { fase: "libre" };

let estado: EstadoPase = INICIAL;
let leido = false;
const oyentes = new Set<() => void>();

/*
   Se guarda como JSON con el mail y el nombre. Antes se guardaba el mail
   solo, como texto: lo que no se lee como JSON se toma como ese mail, así
   quien reservó con la versión anterior no pierde su pase.
*/
function recordado(): EstadoPase {
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    if (!guardado) return INICIAL;
    try {
      const datos = JSON.parse(guardado) as Partial<DatosPase>;
      if (typeof datos?.email === "string") {
        return {
          fase: "reservado",
          email: datos.email,
          nombre: typeof datos.nombre === "string" ? datos.nombre : undefined,
        };
      }
    } catch {
      /* El formato de antes: el mail suelto. */
    }
    return { fase: "reservado", email: guardado };
  } catch {
    return INICIAL;
  }
}

function recordar(datos: DatosPase | null) {
  try {
    if (datos) window.localStorage.setItem(CLAVE, JSON.stringify(datos));
    else window.localStorage.removeItem(CLAVE);
  } catch {
    /* Sin permiso para guardar: el pase se olvida al recargar, y listo. */
  }
}

function cambiar(nuevo: EstadoPase) {
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

export function usePase() {
  return useSyncExternalStore(suscribir, leer, () => INICIAL);
}

export async function reservarLugar(
  { email, nombre }: DatosPase,
  origen: OrigenPase,
  idioma: Locale,
  trampa: string,
  /** Si el formulario pide el nombre: entonces no puede llegar vacío. */
  conNombre = false,
) {
  const limpio = email.trim();
  const quien = nombre?.trim().slice(0, 80) || undefined;
  if (conNombre && !quien) {
    cambiar({ fase: "error", motivo: "nombre" });
    return;
  }
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
        nombre: quien,
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
    recordar({ email: limpio, nombre: quien });
    cambiar({ fase: "reservado", email: limpio, nombre: quien });
  } catch {
    cambiar({ fase: "error", motivo: "fallo" });
  }
}

/** Vuelve a mostrar el campo, para dejar otro mail. */
export function soltarPase() {
  recordar(null);
  cambiar(INICIAL);
}
