"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { BoletoDorado } from "@/components/boleto/boleto-dorado";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";

type Pose = {
  x: number;
  y: number;
  escala: number;
  giro: number;
  rx: number;
  ry: number;
};

const acotar = (v: number) => Math.min(1, Math.max(0, v));
/** Arranca y frena suave, para que el despegue y el aterrizaje no den un tirón. */
const suave = (t: number) => t * t * (3 - 2 * t);
const entre = (a: number, b: number, t: number) => a + (b - a) * t;
const mezclar = (a: Pose, b: Pose, t: number): Pose => ({
  x: entre(a.x, b.x, t),
  y: entre(a.y, b.y, t),
  escala: entre(a.escala, b.escala, t),
  giro: entre(a.giro, b.giro, t),
  rx: entre(a.rx, b.rx, t),
  ry: entre(a.ry, b.ry, t),
});

/** Qué tan chico va mientras acompaña: lo justo para no tapar la lectura. */
const ESCALA_VUELO = 0.42;

/**
 * El boleto dorado que acompaña el scroll: sale de la portada, cruza la página
 * de un costado al otro como un papel que se lleva el viento y aterriza en el
 * boleto de la última sección.
 *
 * Es una copia que solo dibuja (BoletoDorado decorativo), fija en la pantalla
 * y sin puntero: nunca tapa un clic. Los dos boletos de verdad se quedan en
 * su lugar y son los que tienen el formulario; el vuelo los apaga (opacidad
 * cero) mientras la copia está en el aire y los vuelve a prender cuando se
 * apoya encima, en la misma posición y el mismo tamaño, así que el relevo no
 * se ve.
 *
 * Todo lo mueve el scroll y nada se mueve solo: con la página quieta, el
 * boleto queda quieto donde está. El aleteo —la inclinación en los tres ejes
 * y el brillo que se corre— también sale de la posición del scroll.
 *
 * Las etapas, en px de scroll:
 *
 *   salida   el boleto del hero sube con la página hasta que su borde de
 *            arriba llega al 12% de la ventana. Hasta ahí no vuela nada.
 *   despegue durante media pantalla la copia se despega del lugar del hero
 *            y se achica hasta su tamaño de vuelo.
 *   vuelo    acompaña: cruza de lado a lado y sube y baja un poco, con un
 *            cruce cada tres pantallas de scroll más o menos. Va en el
 *            tercio de abajo de la ventana, que es donde menos se lee.
 *            Siempre arranca y termina del lado derecho, donde están los dos
 *            lugares.
 *   llegada  la última pantalla antes del cierre baja hasta el lugar de la
 *            última sección, que queda en el centro de la ventana.
 *
 * El foco manda sobre todo esto: si alguien está escribiendo en un boleto, o
 * llega a él con el teclado, ese boleto se ve entero y la copia se esconde.
 * Por eso se apagan con opacidad y no con visibility: un elemento con
 * visibility hidden no recibe el foco, y quien navega con el teclado se
 * saltearía el formulario del cierre sin enterarse.
 *
 * Solo desde la tablet y sin menos movimiento pedido. En el teléfono la copia
 * taparía media pantalla de texto, así que ahí los dos boletos se ven quietos
 * en su lugar, que es también lo que se ve sin JavaScript.
 */
export function BoletoVuelo() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsap();
    const vuelo = ref.current;
    if (!vuelo) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const lugarA = document.querySelector<HTMLElement>(
          '[data-boleto-lugar="hero"]',
        );
        const lugarB = document.querySelector<HTMLElement>(
          '[data-boleto-lugar="cierre"]',
        );
        const realA = lugarA?.querySelector<HTMLElement>("[data-boleto]");
        const realB = lugarB?.querySelector<HTMLElement>("[data-boleto]");
        const papel = vuelo.querySelector<HTMLElement>(".boleto");
        if (!lugarA || !lugarB || !realA || !realB || !papel) return;

        /*
           Las medidas se toman al refrescar y no en cada cuadro: leer el
           layout en medio del scroll obliga al navegador a recalcularlo
           cada vez. Las posiciones quedan en coordenadas de la página; la
           de la ventana sale de restarles el scroll.
        */
        const medir = () => {
          const y = window.scrollY;
          const a = lugarA.getBoundingClientRect();
          const b = lugarB.getBoundingClientRect();
          return {
            ax: a.left + a.width / 2,
            ay: a.top + y + a.height / 2,
            aw: a.width,
            ah: a.height,
            bx: b.left + b.width / 2,
            by: b.top + y + b.height / 2,
            bw: b.width,
            vw: window.innerWidth,
            vh: window.innerHeight,
            max: ScrollTrigger.maxScroll(window),
          };
        };

        let m = medir();
        vuelo.style.width = `${m.aw}px`;

        const etapas = () => {
          const salida = Math.max(0, m.ay - m.ah / 2 - m.vh * 0.12);
          const despegue = salida + m.vh * 0.55;
          const llegada = Math.min(m.by - m.vh * 0.5, m.max - 1);
          const descenso = Math.max(despegue, llegada - m.vh * 0.9);
          return { salida, despegue, descenso, llegada };
        };

        const seguir = (s: number, e: ReturnType<typeof etapas>): Pose => {
          const tramo = Math.max(1, e.descenso - e.despegue);
          const q = acotar((s - e.despegue) / tramo);
          // Cruces pares: así arranca y termina a la derecha.
          const cruces = 2 * Math.max(1, Math.round(tramo / (m.vh * 3)));
          const mitad = (m.aw * ESCALA_VUELO) / 2 + 28;
          const lado = 0.5 + 0.5 * Math.cos(Math.PI * q * cruces);
          return {
            x: entre(mitad, m.vw - mitad, lado),
            y: m.vh * (0.7 + 0.07 * Math.sin(Math.PI * q * cruces * 2)),
            escala: ESCALA_VUELO,
            // Se inclina hacia donde va, como un papel que planea.
            giro: -Math.sin(Math.PI * q * cruces) * 16,
            rx: 16 * Math.sin(s / 210),
            ry: 24 * Math.sin(s / 150 + 1),
          };
        };

        const pose = (s: number): Pose | null => {
          const e = etapas();
          if (s < e.salida || s >= e.llegada) return null;

          const enA: Pose = {
            x: m.ax,
            y: m.ay - s,
            escala: 1,
            giro: 0,
            rx: 0,
            ry: 0,
          };
          const enB: Pose = {
            x: m.bx,
            y: m.by - s,
            escala: m.bw / m.aw,
            giro: 0,
            rx: 0,
            ry: 0,
          };

          if (s < e.despegue) {
            const t = suave((s - e.salida) / (e.despegue - e.salida));
            return mezclar(enA, seguir(s, e), t);
          }
          if (s <= e.descenso) return seguir(s, e);

          const t = suave(
            acotar((s - e.descenso) / Math.max(1, e.llegada - e.descenso)),
          );
          const p = mezclar(seguir(s, e), enB, t);
          // Un arco antes de apoyarse: sube un poco y baja.
          p.y -= Math.sin(Math.PI * t) * m.vh * 0.06;
          return p;
        };

        const pintar = (s: number) => {
          const activo = document.activeElement;
          const focoA = !!activo && realA.contains(activo);
          const focoB = !!activo && realB.contains(activo);
          const p = focoA || focoB ? null : pose(s);

          if (!p) {
            vuelo.style.visibility = "hidden";
            realA.style.opacity = "";
            const aterrizado = focoB || s >= etapas().llegada;
            realB.style.opacity = aterrizado ? "" : "0";
            return;
          }

          realA.style.opacity = "0";
          realB.style.opacity = "0";
          vuelo.style.visibility = "visible";
          vuelo.style.transform =
            `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) ` +
            `translate(-50%, -50%) perspective(900px) ` +
            `rotateX(${p.rx.toFixed(2)}deg) rotateY(${p.ry.toFixed(2)}deg) ` +
            `rotate(${p.giro.toFixed(2)}deg) scale(${p.escala.toFixed(3)})`;
          papel.style.setProperty(
            "--hx",
            `${(50 + 45 * Math.sin(s / 260)).toFixed(1)}%`,
          );
        };

        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => pintar(self.scroll()),
          onRefresh: () => {
            m = medir();
            vuelo.style.width = `${m.aw}px`;
            pintar(window.scrollY);
          },
        });

        /*
           La página cambia de alto sin cambiar de ancho —se abre una
           pregunta frecuente, se cargan más proyectos— y eso mueve el lugar
           del cierre. ScrollTrigger solo vuelve a medir con un resize, así
           que esto mira el alto del documento y vuelve a medir cuando cambia.
        */
        let espera = 0;
        const alto = new ResizeObserver(() => {
          window.clearTimeout(espera);
          espera = window.setTimeout(() => {
            m = medir();
            pintar(window.scrollY);
          }, 120);
        });
        alto.observe(document.body);

        const conFoco = () => pintar(window.scrollY);
        document.addEventListener("focusin", conFoco);
        document.addEventListener("focusout", conFoco);

        pintar(window.scrollY);

        return () => {
          st.kill();
          alto.disconnect();
          window.clearTimeout(espera);
          document.removeEventListener("focusin", conFoco);
          document.removeEventListener("focusout", conFoco);
          vuelo.style.visibility = "hidden";
          realA.style.opacity = "";
          realB.style.opacity = "";
        };
      },
    );

    return () => mm.revert();
  });

  return (
    <div
      ref={ref}
      aria-hidden
      inert
      className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
      style={{ visibility: "hidden" }}
    >
      <BoletoDorado origen="hero" decorativo />
    </div>
  );
}
