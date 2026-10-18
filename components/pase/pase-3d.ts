import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  DirectionalLight,
  Euler,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
  BackSide,
  FrontSide,
  ClampToEdgeWrapping,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * El pase de Pantufla en 3D: un papel de verdad, con física.
 *
 * Es una malla de 13 × 20 puntos unidos por resortes (una tela de Verlet):
 * los que unen vecinos le dan el tamaño, los diagonales impiden que se
 * deforme como un rombo y los que saltan un punto le dan la rigidez del
 * papel, que se dobla pero no se arruga como un trapo. Cada punto, además,
 * está atado a donde debería estar el pase (su «lugar»), con un resorte que
 * tira fuerte en el centro y flojo en los bordes: por eso, cuando el pase se
 * mueve, el centro va adelante y los bordes llegan tarde y flamean.
 *
 * El aire empuja contra la cara del papel (solo contra la cara: de canto
 * corta el aire), así que al moverse de frente se curva y al moverse de canto
 * planea. Mientras vuela tiene un poco de peso. Apoyado, el peso y el aire se
 * apagan y el resorte del lugar se endurece: queda plano y quieto, donde
 * está su lugar en la página.
 *
 * El recorrido sale de la portada y llega al banner de la mitad de la home,
 * y en el camino se transforma: se achica al despegar, da vueltas sobre sí
 * mismo mostrando el dorso, se inclina hacia donde va y, al bajar, se acuesta
 * y crece hasta calzar en el hueco del banner. Todo sale de la posición del
 * scroll; el papel solo sigue moviéndose lo que tarda en asentarse, y
 * después la escena se duerme y deja de dibujar.
 *
 * Coordenadas: una unidad del mundo es un píxel CSS, el origen es el centro
 * de la ventana y la y crece hacia arriba. La cámara está a la distancia
 * justa para que el plano z = 0 se vea en tamaño real, así un pase plano en
 * z = 0 cae exactamente sobre el rectángulo de su lugar en la página.
 */

export type LugarPase = "hero" | "banner";

const LUGARES: LugarPase[] = ["hero", "banner"];

/** Lo que el pase imprime en su cara al reservar. */
export type SelloPase = { email: string; nombre?: string };

export type TextosPase = {
  titular: string;
  reservado: string;
};

export type OpcionesPase = {
  canvas: HTMLCanvasElement;
  lugares: Partial<Record<LugarPase, HTMLElement>>;
  /**
   * Lo que rodea a cada lugar, con su formulario. Si el foco está adentro
   * —alguien escribiendo su mail—, el pase se queda apoyado ahí.
   */
  zonas: Partial<Record<LugarPase, HTMLElement>>;
  idioma: "es" | "en";
  /** Si vuela de un lugar al otro. Si no, se queda en el que se ve. */
  volar: boolean;
  textos: TextosPase;
  /**
   * Inclinación de reposo de cada lugar, en grados de CSS (positivo es el
   * sentido de las agujas del reloj), los mismos que usa la imagen de
   * respaldo. Un lugar más ancho que alto es un pase acostado: -90.
   */
  giros: Record<LugarPase, number>;
  /**
   * Si los cuadros caros lo apagan. Se apaga en las pruebas forzadas con
   * ?pase3d, que corren en una placa por software y van lentas igual.
   */
  exigente: boolean;
  alListo: () => void;
  alFallar: () => void;
};

export type ControlPase = {
  sellar: (sello: SelloPase | null) => void;
  destruir: () => void;
};

/* La malla. */
const NX = 13;
const NY = 20;
const N = NX * NY;

/* La física, en px y segundos. */
const PASO = 1 / 60;
const K_APOYADO = 260;
const K_CENTRO = 120;
const K_BORDE = 20;
const AIRE = 3.4;
const PESO = 240;
const ROCE = 0.045;
const ARRASTRE_VUELO = 0.9;
const ITERACIONES = 5;
/* Chico: volando cruza el texto que alguien está leyendo. Era 0,42 y
   molestaba al scrollear. */
const ESCALA_VUELO = 0.34;

/* La textura de la cara, en px de la imagen (a 2x del diseño de 640 × 1000). */
const TEX_W = 1280;
const TEX_H = 2000;
const PANEL = { x: 80, y: 820, w: 840, h: 300, r: 40 };

type Pose = {
  x: number;
  y: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  /** 1: apoyado en un lugar; 0: volando. */
  apoyo: number;
};

const acotar = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const suave = (t: number) => t * t * (3 - 2 * t);
const entre = (a: number, b: number, t: number) => a + (b - a) * t;
const mezclar = (a: Pose, b: Pose, t: number): Pose => ({
  x: entre(a.x, b.x, t),
  y: entre(a.y, b.y, t),
  s: entre(a.s, b.s, t),
  rx: entre(a.rx, b.rx, t),
  ry: entre(a.ry, b.ry, t),
  rz: entre(a.rz, b.rz, t),
  apoyo: entre(a.apoyo, b.apoyo, t),
});
const RAD = Math.PI / 180;

function cargar(url: string) {
  return new Promise<HTMLImageElement>((ok, mal) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => ok(img);
    img.onerror = mal;
    img.src = url;
  });
}

/** Una sombra blanda y redondeada, dibujada una vez en un canvas. */
function texturaSombra() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 384;
  const g = c.getContext("2d")!;
  /* El rectángulo se dibuja fuera del lienzo y solo cae su sombra adentro:
     shadowBlur desenfoca en todos los navegadores, y ctx.filter no existe en
     Safari. */
  g.shadowColor = "rgba(17,24,60,1)";
  g.shadowBlur = 44;
  g.shadowOffsetX = 4000;
  g.fillStyle = "#000";
  g.beginPath();
  g.roundRect(48 - 4000, 48, 160, 288, 18);
  g.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * La luz y el material. Están juntos para poder ajustarlos de una: en las
 * pruebas forzadas (?pase3d) se pueden pisar desde la URL, por ejemplo
 * ?pase3d&env=0.5&luz=0.8, sin volver a compilar.
 */
const LUZ = {
  env: 0.46,
  luz: 0.75,
  brillo: 0.45,
  iris: 1,
};

function ajustes(forzado: boolean) {
  const a = { ...LUZ };
  if (!forzado) return a;
  const q = new URLSearchParams(window.location.search);
  for (const k of Object.keys(a) as (keyof typeof LUZ)[]) {
    const v = q.get(k);
    if (v !== null && !Number.isNaN(Number(v))) a[k] = Number(v);
  }
  return a;
}

export async function montarPase(o: OpcionesPase): Promise<ControlPase> {
  const aj = ajustes(!o.exigente);
  /* El estado del bucle va primero: dibujarCara y medir lo tocan antes de
     que arranque el primer cuadro. */
  let sacudir = true;
  let ultimoSy = -1;
  let quietos = 0;
  let pedido = 0;
  let dormido = true;
  let listo = false;
  let destruido = false;
  /* Hasta que el bucle está armado, despertar no hace nada: dibujar la cara
     y medir lo llaman mientras todavía se está construyendo la escena. */
  let armado = false;
  let tiempos: number[] = [];
  let golpes = 0;
  let antes = 0;

  const renderer = new WebGLRenderer({
    canvas: o.canvas,
    alpha: true,
    antialias: true,
    powerPreference: "default",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  const gruesa = window.matchMedia("(pointer: coarse)").matches;
  let densidad = Math.min(window.devicePixelRatio || 1, gruesa ? 1.5 : 2);
  renderer.setPixelRatio(densidad);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // La intensidad del entorno va en la escena: desde la r163, la del
  // material (envMapIntensity) solo cuenta para un envMap propio.
  scene.environmentIntensity = aj.env;
  pmrem.dispose();
  const luz = new DirectionalLight(0xffffff, aj.luz);
  luz.position.set(-0.6, 0.8, 1);
  scene.add(luz);

  const camara = new PerspectiveCamera(30, 1, 10, 20000);

  /* Las texturas: la cara se redibuja en un canvas para poder imprimirle
     el mail encima; el dorso y las capas van tal cual. */
  const [cara, dorso, capas] = await Promise.all([
    cargar(`/pase/cara-${o.idioma}.webp`),
    cargar("/pase/dorso.webp"),
    cargar("/pase/capas.webp"),
  ]);

  const lienzo = document.createElement("canvas");
  lienzo.width = TEX_W;
  lienzo.height = TEX_H;
  const pincel = lienzo.getContext("2d")!;
  const texCara = new CanvasTexture(lienzo);
  texCara.colorSpace = SRGBColorSpace;
  texCara.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const texDorso = new Texture(dorso);
  texDorso.colorSpace = SRGBColorSpace;
  // El dorso se ve desde atrás: se espeja para que se lea derecho.
  texDorso.wrapS = ClampToEdgeWrapping;
  texDorso.repeat.x = -1;
  texDorso.offset.x = 1;
  texDorso.needsUpdate = true;

  const texCapas = new Texture(capas);
  texCapas.colorSpace = NoColorSpace;
  texCapas.needsUpdate = true;

  let sello: SelloPase | null = null;
  const dibujarCara = async () => {
    pincel.clearRect(0, 0, TEX_W, TEX_H);
    pincel.drawImage(cara, 0, 0, TEX_W, TEX_H);
    if (sello) {
      /* El panel se vuelve a pintar entero con el mismo dibujo que tiene
         en la textura (scripts/generar-pase.mjs): el marfil del panel, su
         filete y la etiqueta. El nombre va en la itálica de Newsreader, como
         «Tu lugar»; la portada ya la bajó, así que está a mano. */
      await Promise.all([
        document.fonts.load('600 26px "Schibsted Grotesk"'),
        document.fonts.load('italic 400 100px "Newsreader"'),
      ]).catch(() => {});
      const { x, y, w, h, r } = PANEL;
      pincel.fillStyle = "#fbf9f4";
      pincel.strokeStyle = "rgba(21,20,19,0.12)";
      pincel.lineWidth = 3;
      pincel.beginPath();
      pincel.roundRect(x + 1.5, y + 1.5, w - 3, h - 3, r - 1.5);
      pincel.fill();
      pincel.stroke();
      pincel.fillStyle = "#7a736b";
      pincel.font = '600 24px "Schibsted Grotesk", sans-serif';
      pincel.letterSpacing = "5.8px";
      pincel.fillText(o.textos.titular.toUpperCase(), x + 56, y + 70);
      // La etiqueta, ahora rellena: el lugar ya es de alguien.
      pincel.font = '600 22px "Schibsted Grotesk", sans-serif';
      pincel.letterSpacing = "4.4px";
      const etiqueta = o.textos.reservado.toUpperCase();
      const ancho = pincel.measureText(etiqueta).width + 44;
      pincel.fillStyle = "#151413";
      pincel.beginPath();
      pincel.roundRect(x + w - 44 - ancho, y + 40, ancho, 46, 23);
      pincel.fill();
      pincel.fillStyle = "#fbf9f4";
      pincel.fillText(etiqueta, x + w - 44 - ancho + 22, y + 71);
      // Lo principal, tan grande como entre en el panel: el nombre si lo
      // dejó, y si no el mail. Con nombre, el mail va chico abajo.
      const principal = sello.nombre || sello.email;
      pincel.letterSpacing = "-1px";
      pincel.fillStyle = "#151413";
      let tam = sello.nombre ? 108 : 76;
      do {
        pincel.font = sello.nombre
          ? `italic 400 ${tam}px "Newsreader", Georgia, serif`
          : `600 ${tam}px "Schibsted Grotesk", sans-serif`;
        tam -= 4;
      } while (pincel.measureText(principal).width > w - 112 && tam > 30);
      pincel.fillText(principal, x + 56, y + (sello.nombre ? 190 : 200));
      if (sello.nombre) {
        pincel.letterSpacing = "0px";
        pincel.fillStyle = "#5e5850";
        tam = 32;
        do {
          pincel.font = `500 ${tam}px "Schibsted Grotesk", sans-serif`;
          tam -= 2;
        } while (pincel.measureText(sello.email).width > w - 112 && tam > 20);
        pincel.fillText(sello.email, x + 56, y + 252);
      }
      pincel.letterSpacing = "0px";
    }
    texCara.needsUpdate = true;
    despertar();
  };
  await dibujarCara();

  /* La malla del papel. */
  const geo = new PlaneGeometry(1, 1, NX - 1, NY - 1);
  const pos = geo.getAttribute("position") as BufferAttribute;
  const caraMat = new MeshPhysicalMaterial({
    map: texCara,
    roughnessMap: texCapas,
    metalnessMap: texCapas,
    iridescenceMap: texCapas,
    roughness: 1,
    metalness: 1,
    iridescence: aj.iris,
    specularIntensity: aj.brillo,
    iridescenceIOR: 1.55,
    iridescenceThicknessRange: [180, 620],
    transparent: true,
    side: FrontSide,
  });
  const dorsoMat = new MeshStandardMaterial({
    map: texDorso,
    roughness: 0.55,
    metalness: 0.1,
    transparent: true,
    side: BackSide,
  });
  const frente = new Mesh(geo as BufferGeometry, caraMat);
  const atras = new Mesh(geo as BufferGeometry, dorsoMat);
  frente.frustumCulled = false;
  atras.frustumCulled = false;
  scene.add(frente, atras);

  const sombraMat = new MeshBasicMaterial({
    map: texturaSombra(),
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const sombra = new Mesh(new PlaneGeometry(1, 1), sombraMat);
  sombra.renderOrder = -1;
  scene.add(sombra);

  /* El estado de cada punto: dónde está, dónde estaba y dónde debería
     estar. La forma de reposo se arma con el tamaño del lugar del hero. */
  const x = new Float32Array(N * 3);
  const xp = new Float32Array(N * 3);
  const meta = new Float32Array(N * 3);
  const metaAntes = new Float32Array(N * 3);
  const reposo = new Float32Array(N * 3);
  const kVuelo = new Float32Array(N);
  let W0 = 300;
  let H0 = W0 * (1000 / 640);

  const armarReposo = () => {
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const n = j * NX + i;
        const rx = (i / (NX - 1) - 0.5) * W0;
        const ry = (0.5 - j / (NY - 1)) * H0;
        reposo[n * 3] = rx;
        reposo[n * 3 + 1] = ry;
        reposo[n * 3 + 2] = 0;
        const d = Math.hypot(rx / (W0 / 2), ry / (H0 / 2)) / Math.SQRT2;
        kVuelo[n] = entre(K_CENTRO, K_BORDE, acotar(d));
      }
    }
  };

  /* Los resortes entre puntos: [a, b, largo en reposo, rigidez]. */
  type Resorte = [number, number, number, number];
  let resortes: Resorte[] = [];
  const armarResortes = () => {
    resortes = [];
    const largo = (a: number, b: number) =>
      Math.hypot(
        reposo[a * 3] - reposo[b * 3],
        reposo[a * 3 + 1] - reposo[b * 3 + 1],
      );
    const sumar = (a: number, b: number, k: number) =>
      resortes.push([a, b, largo(a, b), k]);
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const n = j * NX + i;
        if (i < NX - 1) sumar(n, n + 1, 1);
        if (j < NY - 1) sumar(n, n + NX, 1);
        if (i < NX - 1 && j < NY - 1) {
          sumar(n, n + NX + 1, 0.7);
          sumar(n + 1, n + NX, 0.7);
        }
        if (i < NX - 2) sumar(n, n + 2, 0.35);
        if (j < NY - 2) sumar(n, n + 2 * NX, 0.35);
      }
    }
  };

  /* Las medidas de la página. Se toman al arrancar y cuando algo cambia de
     tamaño, nunca en cada cuadro. */
  /* acostado: el lugar es más ancho que alto, así que el pase se apoya
     girado un cuarto de vuelta y su ancho es el alto del lugar. */
  type Caja = { x: number; y: number; w: number; h: number; acostado: boolean };
  const cajas: Partial<Record<LugarPase, Caja>> = {};
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let maxScroll = 0;

  const medir = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    const sy = window.scrollY;
    for (const lugar of LUGARES) {
      const el = o.lugares[lugar];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      cajas[lugar] = {
        x: r.left + r.width / 2,
        y: r.top + sy + r.height / 2,
        w: r.width,
        h: r.height,
        acostado: r.width > r.height,
      };
    }
    maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    // El tamaño de reposo es el del pase de la portada; sin portada, el del
    // banner, que acostado mide de ancho lo que su lugar de alto.
    const base = cajas.hero ?? cajas.banner;
    const ancho = base ? (base.acostado ? base.h : base.w) : 0;
    if (base && Math.abs(ancho - W0) > 0.5) {
      W0 = ancho;
      H0 = W0 * (1000 / 640);
      armarReposo();
      armarResortes();
      sacudir = true;
    }
    renderer.setSize(vw, vh, false);
    camara.aspect = vw / vh;
    camara.position.set(0, 0, vh / 2 / Math.tan((camara.fov * RAD) / 2));
    camara.updateProjectionMatrix();
    despertar();
  };

  /* Dónde va el pase según el scroll. */
  const apoyado = (lugar: LugarPase, sy: number): Pose | null => {
    const c = cajas[lugar];
    if (!c) return null;
    return {
      x: c.x,
      y: c.y - sy,
      s: (c.acostado ? c.h : c.w) / W0,
      rx: 0,
      ry: 0,
      // CSS gira a favor de las agujas y acá la y crece hacia arriba: el
      // mismo giro va con el signo dado vuelta.
      rz: -o.giros[lugar] * RAD,
      apoyo: 1,
    };
  };

  const etapas = () => {
    const a = cajas.hero!;
    const b = cajas.banner!;
    const salida = Math.max(0, a.y - vh * 0.15);
    const despegue = salida + vh * 0.6;
    const llegada = Math.min(b.y - vh * 0.5, maxScroll - 1);
    const descenso = Math.max(despegue, llegada - vh);
    return { salida, despegue, descenso, llegada };
  };

  const seguir = (sy: number, e: ReturnType<typeof etapas>): Pose => {
    const tramo = Math.max(1, e.descenso - e.despegue);
    const q = acotar((sy - e.despegue) / tramo);
    // Una ida y vuelta cada cuatro pantallas: con una cada tres, el pase
    // pasaba de un costado al otro tan seguido que distraía.
    const cruces = 2 * Math.max(1, Math.round(tramo / (vh * 4)));
    const mitad = (W0 * ESCALA_VUELO) / 2 + 40;
    const lado = 0.5 + 0.5 * Math.cos(Math.PI * q * cruces);
    return {
      x: entre(mitad, vw - mitad, lado),
      y: vh * (0.64 + 0.07 * Math.sin(Math.PI * q * cruces * 2)),
      s: ESCALA_VUELO,
      // Una vuelta entera por cada ida y vuelta: muestra el dorso a mitad
      // de cada cruce y vuelve de frente en cada costado.
      ry: Math.PI * q * cruces + 0.35 * Math.sin(Math.PI * q * cruces * 2),
      rx: 0.32 * Math.sin(Math.PI * q * cruces * 2 + 0.6),
      rz: -0.34 * Math.sin(Math.PI * q * cruces),
      apoyo: 0,
    };
  };

  const pose = (sy: number): Pose | null => {
    const activo = document.activeElement;
    for (const lugar of LUGARES) {
      if (activo && o.zonas[lugar]?.contains(activo)) {
        return apoyado(lugar, sy);
      }
    }
    if (!o.volar || !cajas.hero || !cajas.banner) {
      // Sin vuelo: el pase se queda en el lugar que se ve.
      for (const lugar of LUGARES) {
        const c = cajas[lugar];
        if (!c) continue;
        const arriba = c.y - c.h / 2 - sy;
        if (arriba < vh && arriba + c.h > 0) return apoyado(lugar, sy);
      }
      return null;
    }
    const e = etapas();
    if (sy < e.salida) return apoyado("hero", sy);
    if (sy >= e.llegada) return apoyado("banner", sy);
    if (sy < e.despegue) {
      const t = suave((sy - e.salida) / (e.despegue - e.salida));
      return mezclar(apoyado("hero", sy)!, seguir(sy, e), t);
    }
    if (sy <= e.descenso) return seguir(sy, e);
    const t = suave(
      acotar((sy - e.descenso) / Math.max(1, e.llegada - e.descenso)),
    );
    const desde = seguir(sy, e);
    const hasta = apoyado("banner", sy)!;
    // Que termine de frente: la vuelta más cercana, no volver a cero.
    hasta.ry = Math.round(desde.ry / (2 * Math.PI)) * 2 * Math.PI;
    const p = mezclar(desde, hasta, t);
    p.y -= Math.sin(Math.PI * t) * vh * 0.07;
    return p;
  };

  /*
     El puntero: hunde el papel donde apoya y lo inclina hacia él.

     Solo en la portada. En el banner el pase calza en un hueco con su forma
     exacta, y cualquier inclinación lo despega del borde: de un lado asoma
     una franja del hueco y del otro el pase se pasa, y la pieza que faltaba
     deja de calzar. Ahí se queda plano.
  */
  const CON_PUNTERO: LugarPase[] = ["hero"];
  let puntero: { lugar: LugarPase; u: number; v: number } | null = null;
  const alMover = (lugar: LugarPase) => (e: PointerEvent) => {
    const el = o.lugares[lugar];
    if (!el) return;
    const r = el.getBoundingClientRect();
    puntero = {
      lugar,
      u: (e.clientX - r.left) / r.width,
      v: (e.clientY - r.top) / r.height,
    };
    despertar();
  };
  const alSalir = () => {
    puntero = null;
    despertar();
  };
  const oyentes: [HTMLElement, string, EventListener][] = [];
  for (const lugar of CON_PUNTERO) {
    const el = o.lugares[lugar];
    if (!el) continue;
    const mover = alMover(lugar) as EventListener;
    for (const [tipo, fn] of [
      ["pointermove", mover],
      ["pointerdown", mover],
      ["pointerleave", alSalir as EventListener],
      ["pointercancel", alSalir as EventListener],
    ] as [string, EventListener][]) {
      el.addEventListener(tipo, fn, { passive: true });
      oyentes.push([el, tipo, fn]);
    }
  }

  /* El cuadro. */
  const m4 = new Matrix4();
  const q4 = new Quaternion();
  const eu = new Euler(0, 0, 0, "YXZ");
  const v3 = new Vector3();
  const escala = new Vector3();

  const calcularMetas = (p: Pose) => {
    let rx = p.rx;
    let ry = p.ry;
    if (puntero && p.apoyo > 0.5) {
      ry += (puntero.u - 0.5) * 0.32;
      rx += (puntero.v - 0.5) * 0.26;
    }
    eu.set(rx, ry, p.rz);
    q4.setFromEuler(eu);
    escala.set(p.s, p.s, p.s);
    m4.compose(v3.set(p.x - vw / 2, vh / 2 - p.y, 0), q4, escala);
    const e = m4.elements;
    for (let n = 0; n < N; n++) {
      const a = reposo[n * 3];
      const b = reposo[n * 3 + 1];
      meta[n * 3] = e[0] * a + e[4] * b + e[12];
      meta[n * 3 + 1] = e[1] * a + e[5] * b + e[13];
      meta[n * 3 + 2] = e[2] * a + e[6] * b + e[14];
    }
  };

  const fisica = (p: Pose, dtCuadro: number) => {
    const apoyo = p.apoyo;
    const arrastre = entre(ARRASTRE_VUELO, 1, apoyo);
    const normales = geo.getAttribute("normal") as BufferAttribute;
    const nn = normales.array as Float32Array;

    /* El lugar se movió: los puntos se llevan casi todo ese movimiento sin
       ganar velocidad (si no, el pase quedaría atrás de la página al
       scrollear) y el resto lo recuperan con los resortes. */
    let salto = 0;
    for (let k = 0; k < N * 3; k++) {
      const d = meta[k] - metaAntes[k];
      salto = Math.max(salto, Math.abs(d));
      x[k] += d * arrastre;
      xp[k] += d * arrastre;
    }
    if (sacudir || salto > vh * 0.6) {
      x.set(meta);
      xp.set(meta);
      sacudir = false;
    }

    const pasos = Math.min(3, Math.max(1, Math.round(dtCuadro / PASO)));
    const viento = 1 - apoyo;
    const pk = puntero && apoyo > 0.5 ? puntero : null;
    /* Dónde hunde el dedo, en las medidas del pase sin girar: el puntero se
       mide sobre el lugar en la pantalla, y en el banner el pase está
       acostado, así que hay que deshacer el giro. */
    let px = 0;
    let py = 0;
    const cp = pk ? cajas[pk.lugar] : undefined;
    if (pk && cp) {
      const sx = (pk.u - 0.5) * cp.w;
      const sy = (0.5 - pk.v) * cp.h;
      const cos = Math.cos(p.rz);
      const sin = Math.sin(p.rz);
      px = (cos * sx + sin * sy) / p.s;
      py = (-sin * sx + cos * sy) / p.s;
    }
    const radio = W0 * 0.42;

    for (let s = 0; s < pasos; s++) {
      for (let n = 0; n < N; n++) {
        const i3 = n * 3;
        const k = entre(kVuelo[n], K_APOYADO, apoyo);
        let ax = k * (meta[i3] - x[i3]);
        let ay = k * (meta[i3 + 1] - x[i3 + 1]) - PESO * viento;
        let az = k * (meta[i3 + 2] - x[i3 + 2]);
        if (viento > 0.001) {
          // El aire quieto contra el papel que se mueve, solo sobre la cara.
          const vfx = (meta[i3] - metaAntes[i3]) / dtCuadro;
          const vfy = (meta[i3 + 1] - metaAntes[i3 + 1]) / dtCuadro;
          const vfz = (meta[i3 + 2] - metaAntes[i3 + 2]) / dtCuadro;
          const rx = -(vfx * arrastre + (x[i3] - xp[i3]) / PASO);
          const ry = -(vfy * arrastre + (x[i3 + 1] - xp[i3 + 1]) / PASO);
          const rz = -(vfz * arrastre + (x[i3 + 2] - xp[i3 + 2]) / PASO);
          const nx = nn[i3];
          const ny = nn[i3 + 1];
          const nz = nn[i3 + 2];
          const contra = acotar(rx * nx + ry * ny + rz * nz, -900, 900);
          const f = AIRE * viento * contra;
          ax += f * nx;
          ay += f * ny;
          az += f * nz;
        }
        if (pk) {
          const d = Math.hypot(reposo[i3] - px, reposo[i3 + 1] - py);
          if (d < radio) {
            const t = 1 - d / radio;
            az -= 5200 * t * t;
          }
        }
        const vx = (x[i3] - xp[i3]) * (1 - ROCE);
        const vy = (x[i3 + 1] - xp[i3 + 1]) * (1 - ROCE);
        const vz = (x[i3 + 2] - xp[i3 + 2]) * (1 - ROCE);
        xp[i3] = x[i3];
        xp[i3 + 1] = x[i3 + 1];
        xp[i3 + 2] = x[i3 + 2];
        x[i3] += vx + ax * PASO * PASO;
        x[i3 + 1] += vy + ay * PASO * PASO;
        x[i3 + 2] += vz + az * PASO * PASO;
      }
      for (let it = 0; it < ITERACIONES; it++) {
        for (const [a, b, largo, rig] of resortes) {
          const a3 = a * 3;
          const b3 = b * 3;
          const dx = x[b3] - x[a3];
          const dy = x[b3 + 1] - x[a3 + 1];
          const dz = x[b3 + 2] - x[a3 + 2];
          const l = Math.hypot(dx, dy, dz) || 1;
          const c = ((l - largo * p.s) / l) * 0.5 * rig;
          x[a3] += dx * c;
          x[a3 + 1] += dy * c;
          x[a3 + 2] += dz * c;
          x[b3] -= dx * c;
          x[b3 + 1] -= dy * c;
          x[b3 + 2] -= dz * c;
        }
      }
    }
    metaAntes.set(meta);

    let lejos = 0;
    let rapido = 0;
    for (let k = 0; k < N * 3; k++) {
      lejos = Math.max(lejos, Math.abs(x[k] - meta[k]));
      rapido = Math.max(rapido, Math.abs(x[k] - xp[k]));
    }
    return { lejos, rapido };
  };

  const dibujar = (p: Pose | null) => {
    if (!p) {
      frente.visible = atras.visible = sombra.visible = false;
      renderer.render(scene, camara);
      return;
    }
    frente.visible = atras.visible = sombra.visible = true;
    (pos.array as Float32Array).set(x);
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    // La sombra: más corrida y más tenue cuanto más alto vuela.
    const alto = 1 - p.apoyo;
    sombra.position.set(
      p.x - vw / 2 + 10 + alto * 26,
      vh / 2 - p.y - 18 - alto * 40,
      -4,
    );
    sombra.rotation.z = p.rz;
    // De canto el papel casi no tapa luz: la sombra se angosta con el giro.
    const ancho = 0.25 + 0.75 * Math.abs(Math.cos(p.ry));
    sombra.scale.set(W0 * p.s * 1.3 * ancho, H0 * p.s * 1.2, 1);
    sombraMat.opacity = 0.2 - alto * 0.14;
    renderer.render(scene, camara);
  };

  const cuadro = (ahora: number) => {
    pedido = 0;
    const dt = antes ? Math.min(0.05, (ahora - antes) / 1000) : PASO;
    antes = ahora;
    const t0 = performance.now();

    const sy = window.scrollY;
    const p = pose(sy);
    let quieto = true;
    if (p) {
      calcularMetas(p);
      const { lejos, rapido } = fisica(p, dt);
      quieto = rapido < 0.012 && (p.apoyo < 1 || lejos < 0.06) && !puntero;
    } else {
      sacudir = true;
    }
    dibujar(p);

    if (!listo) {
      listo = true;
      o.alListo();
    }

    /* Si los cuadros salen caros, primero se baja la resolución y, si sigue
       igual, el pase vuelve a ser la imagen de respaldo. */
    if (o.exigente) tiempos.push(performance.now() - t0);
    if (tiempos.length >= 30) {
      const prom = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
      tiempos = [];
      if (prom > 24) {
        golpes += 1;
        if (golpes === 1 && densidad > 1) {
          densidad = 1;
          renderer.setPixelRatio(1);
          renderer.setSize(vw, vh, false);
        } else if (golpes >= 2) {
          o.alFallar();
          return;
        }
      }
    }

    if (sy !== ultimoSy) quietos = 0;
    else if (quieto) quietos += 1;
    ultimoSy = sy;
    if (quietos > 8) {
      dormido = true;
      antes = 0;
      return;
    }
    pedido = requestAnimationFrame(cuadro);
  };

  function despertar() {
    quietos = 0;
    if (!armado || !dormido || destruido) return;
    dormido = false;
    pedido = requestAnimationFrame(cuadro);
  }

  const alScroll = () => despertar();
  window.addEventListener("scroll", alScroll, { passive: true });
  document.addEventListener("focusin", alScroll);
  document.addEventListener("focusout", alScroll);
  window.addEventListener("resize", medir);
  const observador = new ResizeObserver(() => medir());
  observador.observe(document.body);
  for (const el of Object.values(o.lugares)) if (el) observador.observe(el);
  document.fonts.ready.then(medir).catch(() => {});

  const perdido = (e: Event) => {
    e.preventDefault();
    o.alFallar();
  };
  o.canvas.addEventListener("webglcontextlost", perdido);

  armarReposo();
  armarResortes();
  armado = true;
  medir();

  return {
    sellar: (nuevo) => {
      if (nuevo?.email === sello?.email && nuevo?.nombre === sello?.nombre) {
        return;
      }
      sello = nuevo;
      void dibujarCara();
    },
    destruir: () => {
      destruido = true;
      cancelAnimationFrame(pedido);
      window.removeEventListener("scroll", alScroll);
      document.removeEventListener("focusin", alScroll);
      document.removeEventListener("focusout", alScroll);
      window.removeEventListener("resize", medir);
      observador.disconnect();
      o.canvas.removeEventListener("webglcontextlost", perdido);
      for (const [el, tipo, fn] of oyentes) el.removeEventListener(tipo, fn);
      geo.dispose();
      caraMat.dispose();
      dorsoMat.dispose();
      sombraMat.dispose();
      texCara.dispose();
      texDorso.dispose();
      texCapas.dispose();
      renderer.dispose();
    },
  };
}
