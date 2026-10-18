/**
 * La geometría del globo de «Dónde trabajamos», sin Three.js.
 *
 * La usan la escena 3D (components/sections/globo-3d.ts) y el componente
 * (components/sections/globo.tsx), que ubica las marcas con los nombres de
 * los países también sobre la imagen quieta de respaldo. Las dos tienen que
 * hacer exactamente la misma cuenta, o las marcas caerían corridas de su
 * país cuando cambia una por otra.
 *
 * La esfera mide 1 de radio y está en el origen. La cámara la mira desde
 * +z, a DISTANCIA, con un campo vertical de FOV grados. El globo gira con
 * dos ángulos, como los grupos de la escena: primero `giro` alrededor del eje
 * de los polos y después `inclinacion` alrededor del eje horizontal.
 */

export const DISTANCIA = 4.1;
export const FOV = 30;

/**
 * Cómo se ve quieto: centrado en el Atlántico, un poco al norte. Desde ahí
 * entran los cinco países a la vez —Estados Unidos y Dinamarca cerca de los
 * bordes, Argentina abajo—, que es lo que muestran la imagen de respaldo y
 * el primer cuadro del 3D.
 */
export const VISTA_INICIAL = { lon: -38, lat: 14 } as const;

const RAD = Math.PI / 180;

/**
 * Un punto de la superficie, en las mismas coordenadas que la esfera de
 * Three.js (SphereGeometry): la longitud -180 cae en -x, la 0 en +x y la
 * -90 de frente a la cámara, en +z. Así la textura equirectangular calza sin
 * correrla.
 */
export function punto(lon: number, lat: number) {
  const fi = ((lon + 180) / 360) * 2 * Math.PI;
  const tita = (90 - lat) * RAD;
  return {
    x: -Math.cos(fi) * Math.sin(tita),
    y: Math.cos(tita),
    z: Math.sin(fi) * Math.sin(tita),
  };
}

/** El giro que pone una longitud de frente a la cámara. */
export function giroPara(lon: number) {
  return Math.PI / 2 - ((lon + 180) / 360) * 2 * Math.PI;
}

/** La inclinación que pone una latitud a la altura de la cámara. */
export const inclinacionPara = (lat: number) => lat * RAD;

/**
 * Dónde cae un punto del globo en la pantalla, en fracciones del cuadro (0 a
 * 1, desde arriba a la izquierda), y cuánto se ve.
 *
 * `frente` va de 0 a 1: 0 cuando el punto está del otro lado del globo o
 * justo en el borde, 1 cuando está bien de frente. Con eso la marca se
 * desvanece al llegar al borde en vez de desaparecer de golpe.
 */
export function proyectar(
  lon: number,
  lat: number,
  giro: number,
  inclinacion: number,
) {
  const p = punto(lon, lat);
  const cg = Math.cos(giro);
  const sg = Math.sin(giro);
  const x1 = p.x * cg + p.z * sg;
  const z1 = -p.x * sg + p.z * cg;
  const ci = Math.cos(inclinacion);
  const si = Math.sin(inclinacion);
  const y2 = p.y * ci - z1 * si;
  const z2 = p.y * si + z1 * ci;

  const t = Math.tan((FOV / 2) * RAD);
  const prof = DISTANCIA - z2;
  /* Un punto de la esfera se ve si la cámara queda de su lado del plano
     tangente: z > 1 / DISTANCIA. Un poco más adentro empieza a aparecer. */
  const borde = 1 / DISTANCIA;
  const frente = Math.min(1, Math.max(0, (z2 - borde) / 0.28));
  return {
    x: 0.5 + x1 / (prof * t) / 2,
    y: 0.5 - y2 / (prof * t) / 2,
    frente,
  };
}
