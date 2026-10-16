"use client";

import { useEffect, useRef, useState } from "react";

import { useCopy, useLocale } from "@/components/copy-provider";
import { GIROS } from "@/components/pase/pase-lugar";
import type { ControlPase } from "@/components/pase/pase-3d";
import { usePase } from "@/lib/pase";

/**
 * Si vale la pena dibujar el pase en 3D en esta máquina.
 *
 * Con una placa de video por software (SwiftShader, llvmpipe: lo que da el
 * Chrome sin pantalla de Lighthouse, o una máquina virtual) cada cuadro
 * cuesta cientos de milisegundos, así que ni se baja Three.js: queda la
 * imagen. failIfMajorPerformanceCaveat ya lo pide, pero algunos navegadores
 * lo ignoran, y por eso también se mira el nombre del renderizador.
 *
 * ?pase3d lo fuerza, para probarlo en un navegador sin placa.
 */
function sePuede(): { si: boolean; forzado: boolean } {
  if (new URLSearchParams(window.location.search).has("pase3d")) {
    return { si: true, forzado: true };
  }
  try {
    const c = document.createElement("canvas");
    const op = { failIfMajorPerformanceCaveat: true };
    const gl =
      (c.getContext("webgl2", op) as WebGL2RenderingContext | null) ??
      (c.getContext("webgl", op) as WebGLRenderingContext | null);
    if (!gl) return { si: false, forzado: false };
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = String(
      info
        ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return {
      si: !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(nombre),
      forzado: false,
    };
  } catch {
    return { si: false, forzado: false };
  }
}

/**
 * La escena del pase: un canvas fijo que cubre la ventana, sin puntero, por
 * encima de las secciones y por debajo de la barra y del menú.
 *
 * Arranca cuando el navegador está libre, para no competir con la carga de la
 * página: el pase de la portada ya se ve como imagen y nadie espera nada. Se
 * vuelve a armar si cambia el ancho (de teléfono a tablet: deja de volar o
 * empieza a volar) o la preferencia de movimiento. Con menos movimiento
 * pedido no arranca y quedan las imágenes.
 *
 * `volar` lo decide la home: hace falta el lugar de la portada y el del
 * cierre. Igual en el teléfono no vuela: ahí el pase se queda en el lugar que
 * se ve, porque volando taparía media pantalla de texto.
 */
export function PaseEscena({ volar }: { volar: boolean }) {
  const { pase } = useCopy();
  const locale = useLocale();
  const estado = usePase();
  const lienzo = useRef<HTMLCanvasElement>(null);
  const control = useRef<ControlPase | null>(null);
  const sello = useRef<string | null>(null);
  const [activo, setActivo] = useState(false);
  const [vuelta, setVuelta] = useState(0);

  sello.current = estado.fase === "reservado" ? estado.email : null;

  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ancho = window.matchMedia("(min-width: 768px)");
    const otraVuelta = () => setVuelta((v) => v + 1);
    reducido.addEventListener("change", otraVuelta);
    ancho.addEventListener("change", otraVuelta);
    return () => {
      reducido.removeEventListener("change", otraVuelta);
      ancho.removeEventListener("change", otraVuelta);
    };
  }, []);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    let vivo = true;
    const raiz = document.documentElement;

    const apagar = () => {
      raiz.removeAttribute("data-pase-3d");
      setActivo(false);
      control.current?.destruir();
      control.current = null;
    };

    const arrancar = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { si, forzado } = sePuede();
      if (!si || !vivo) return;
      const lugar = (o: string) =>
        document.querySelector<HTMLElement>(`[data-pase-lugar="${o}"]`) ??
        undefined;
      const zona = (o: string) =>
        document.querySelector<HTMLElement>(`[data-pase-zona="${o}"]`) ??
        undefined;
      try {
        const { montarPase } = await import("@/components/pase/pase-3d");
        if (!vivo) return;
        const ctl = await montarPase({
          canvas,
          lugares: { hero: lugar("hero"), cierre: lugar("cierre") },
          zonas: { hero: zona("hero"), cierre: zona("cierre") },
          idioma: locale,
          volar: volar && window.matchMedia("(min-width: 768px)").matches,
          textos: { titular: pase.titular, reservado: pase.reservado },
          giros: GIROS,
          exigente: !forzado,
          alListo: () => {
            raiz.setAttribute("data-pase-3d", "");
            setActivo(true);
          },
          alFallar: apagar,
        });
        if (!vivo) {
          ctl.destruir();
          return;
        }
        control.current = ctl;
        ctl.sellar(sello.current);
      } catch (error) {
        // Queda la imagen. El aviso es para quien abra la consola a ver
        // por qué no hay 3D; a quien visita no le cambia nada.
        console.warn("[pase] sin 3D:", error);
        apagar();
      }
    };

    /* Safari no tiene requestIdleCallback: ahí espera un rato fijo. */
    const conIdle = "requestIdleCallback" in window;
    const espera = conIdle
      ? window.requestIdleCallback(() => void arrancar(), { timeout: 2500 })
      : window.setTimeout(() => void arrancar(), 800);

    return () => {
      vivo = false;
      if (conIdle) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
      apagar();
    };
  }, [locale, volar, pase.titular, pase.reservado, vuelta]);

  useEffect(() => {
    control.current?.sellar(estado.fase === "reservado" ? estado.email : null);
  }, [estado]);

  return (
    <canvas
      key={vuelta}
      ref={lienzo}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full transition-opacity duration-300"
      style={{ opacity: activo ? 1 : 0 }}
    />
  );
}
