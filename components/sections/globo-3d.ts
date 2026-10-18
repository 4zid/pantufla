import {
  CanvasTexture,
  Color,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from "three";

import { GLOBO_ALTO, GLOBO_ANCHO, PAISES, TIERRA } from "@/content/globo-datos";
import {
  DISTANCIA,
  FOV,
  VISTA_INICIAL,
  giroPara,
  inclinacionPara,
  proyectar,
} from "@/lib/globo";

/**
 * El globo de «Dónde trabajamos» en 3D: una esfera blanca y negra que gira
 * despacio, con los países donde trabajamos en tinta.
 *
 * La esfera no lleva una foto de la Tierra sino una máscara: una textura
 * equirectangular dibujada acá mismo, al arrancar, con la tierra en el canal
 * rojo, los países marcados en el verde y la grilla de meridianos y
 * paralelos en el azul (ver content/globo-datos.ts). El shader pinta cada
 * canal con un color del tema —el mar en paper-alt, la tierra en
 * line-strong, los países en la tinta—, así el globo sigue al tema como
 * cualquier otro componente: con la sección en oscuro desde el panel, se da
 * vuelta solo. Hacia el borde se tiñe apenas, para que se lea como esfera y
 * no como un disco.
 *
 * Encima va un acabado holográfico, como el foil del pase: un brillo
 * nacarado en la misma paleta (champagne, perla, verde agua y rosa
 * apagados) que depende del ángulo y de la posición en la superficie, así
 * corre por el globo mientras gira y se carga hacia el borde. Y un grano
 * fino, fijo en la pantalla como el de una foto, que le saca lo liso de lo
 * digital. El grano va después de pasar a sRGB para que se vea parejo en la
 * tinta y en el gris claro.
 *
 * Gira alrededor de los polos, de oeste a este como la Tierra, una vuelta
 * cada setenta segundos. Se queda quieto mientras `quieto()` diga que sí (el
 * mouse encima, el foco adentro o la pausa del riel: ver globo.tsx). Fuera
 * de la pantalla no dibuja, y cuando no hay nada que mover la escena se
 * duerme.
 *
 * Las marcas con los nombres son HTML (para usar la tipografía del sitio);
 * acá solo se las mueve, cuadro a cuadro, con la misma cuenta que usa la
 * imagen de respaldo (lib/globo.ts).
 */

export type MarcaGlobo = { lon: number; lat: number; el: HTMLElement };

export type ControlGlobo = {
  destruir: () => void;
};

/** Una vuelta cada setenta segundos, en radianes por segundo. */
const VELOCIDAD = (2 * Math.PI) / 70;

/* La máscara. 2048 × 1024 alcanza para un globo de 500 px en una pantalla de
   doble densidad: unos cinco píxeles de textura por grado contra cinco de
   pantalla. */
function dibujarMascara() {
  const lienzo = document.createElement("canvas");
  lienzo.width = GLOBO_ANCHO;
  lienzo.height = GLOBO_ALTO;
  const c = lienzo.getContext("2d")!;
  c.fillStyle = "#000";
  c.fillRect(0, 0, GLOBO_ANCHO, GLOBO_ALTO);
  // Cada capa en su canal: sumadas, no se tapan entre sí.
  c.globalCompositeOperation = "lighter";

  c.strokeStyle = "#0000ff";
  c.lineWidth = 1.6;
  c.beginPath();
  for (let lon = -180; lon < 180; lon += 20) {
    const x = ((lon + 180) / 360) * GLOBO_ANCHO;
    c.moveTo(x, 0);
    c.lineTo(x, GLOBO_ALTO);
  }
  for (let lat = -60; lat <= 60; lat += 20) {
    const y = ((90 - lat) / 180) * GLOBO_ALTO;
    c.moveTo(0, y);
    c.lineTo(GLOBO_ANCHO, y);
  }
  c.stroke();

  c.fillStyle = "#ff0000";
  c.fill(new Path2D(TIERRA));
  c.fillStyle = "#00ff00";
  for (const camino of Object.values(PAISES)) c.fill(new Path2D(camino));
  return lienzo;
}

const vertice = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmento = /* glsl */ `
  uniform sampler2D mascara;
  uniform vec3 mar;
  uniform vec3 tierra;
  uniform vec3 pais;
  uniform vec3 grilla;
  uniform vec3 borde;
  uniform float ruido;
  uniform float densidad;
  varying vec2 vUv;
  varying vec3 vNormal;

  // La paleta del foil del pase (scripts/generar-pase.mjs), en vuelta.
  vec3 foil(float t) {
    vec3 a = vec3(0.722, 0.604, 0.416);
    vec3 b = vec3(0.965, 0.945, 0.910);
    vec3 c = vec3(0.788, 0.835, 0.824);
    vec3 d = vec3(0.906, 0.835, 0.824);
    float s = fract(t) * 4.0;
    vec3 col = s < 1.0 ? mix(a, b, s)
      : s < 2.0 ? mix(b, c, s - 1.0)
      : s < 3.0 ? mix(c, d, s - 2.0)
      : mix(d, a, s - 3.0);
    return pow(col, vec3(2.2));
  }

  float azar(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec4 m = texture2D(mascara, vUv);
    vec3 color = mix(mar, grilla, m.b * 0.8);
    color = mix(color, tierra, m.r);
    color = mix(color, pais, m.g);

    float frente = clamp(vNormal.z, 0.0, 1.0);
    float canto = 1.0 - frente;

    // El holográfico: el tono corre con el ángulo y con el lugar del globo.
    float t = canto * 1.4 + vNormal.x * 0.35 + vNormal.y * 0.25
      + (vUv.x * 2.0 + vUv.y) * 1.1;
    vec3 holo = foil(t);
    // Tiñe sin aclarar: el foil dividido por su propio brillo cambia el tono
    // y no la luz. Aclarando, la tierra se perdía contra el mar.
    float luz = dot(holo, vec3(0.2126, 0.7152, 0.0722));
    // Un reflejo y no un color: el globo sigue siendo blanco y negro.
    float fuerza = 0.16 + 0.26 * pow(canto, 1.4);
    color = mix(color, color * holo / max(luz, 0.001), fuerza);
    // El nácar, solo en el canto: ahí sí aclara, como un borde de luz.
    color = mix(color, holo * 1.15, pow(canto, 2.5) * 0.22);
    // Sobre la tinta casi no hay color que teñir: ahí el foil brilla encima,
    // apenas (en lineal un poco ya es mucho: la tinta se volvía gris).
    color += holo * m.g * (0.006 + 0.04 * canto);

    // Hacia el borde, el color del borde: la esfera se lee redonda.
    color = mix(color, borde, pow(canto, 3.0) * 0.5);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>

    // El grano, en píxeles de CSS y fijo en la pantalla.
    float n = azar(floor(gl_FragCoord.xy / densidad));
    gl_FragColor.rgb += (n - 0.5) * ruido;
  }
`;

export function montarGlobo({
  contenedor,
  marcas,
  quieto,
  alListo,
  conGrano = true,
}: {
  contenedor: HTMLElement;
  marcas: MarcaGlobo[];
  /** Si tiene que dejar de girar solo en este cuadro. */
  quieto: () => boolean;
  alListo: () => void;
  /**
   * Sin grano solo para sacar la imagen de respaldo
   * (scripts/generar-globo-imagen.mjs): el ruido no se comprime y la
   * imagen pesaría el triple. Ahí el grano lo pone el CSS.
   */
  conGrano?: boolean;
}): ControlGlobo {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  const densidad = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(densidad);
  renderer.setClearColor(0x000000, 0);
  const lienzo = renderer.domElement;
  lienzo.setAttribute("aria-hidden", "true");
  lienzo.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  contenedor.appendChild(lienzo);

  const escena = new Scene();
  const camara = new PerspectiveCamera(FOV, 1, 0.1, 20);
  camara.position.set(0, 0, DISTANCIA);

  const textura = new CanvasTexture(dibujarMascara());
  textura.colorSpace = NoColorSpace;
  textura.minFilter = LinearMipmapLinearFilter;
  textura.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const colores = {
    mar: new Color(),
    tierra: new Color(),
    pais: new Color(),
    grilla: new Color(),
    borde: new Color(),
  };
  const material = new ShaderMaterial({
    vertexShader: vertice,
    fragmentShader: fragmento,
    uniforms: {
      mascara: { value: textura },
      mar: { value: colores.mar },
      tierra: { value: colores.tierra },
      pais: { value: colores.pais },
      grilla: { value: colores.grilla },
      borde: { value: colores.borde },
      ruido: { value: conGrano ? 0.07 : 0 },
      densidad: { value: densidad },
    },
  });
  const geometria = new SphereGeometry(1, 96, 64);
  const esfera = new Mesh(geometria, material);

  // Primero el giro (los polos), después la inclinación: como lib/globo.ts.
  const inclinacion = new Group();
  const giro = new Group();
  giro.add(esfera);
  inclinacion.add(giro);
  escena.add(inclinacion);

  const reposo = inclinacionPara(VISTA_INICIAL.lat);
  giro.rotation.y = giroPara(VISTA_INICIAL.lon);
  inclinacion.rotation.x = reposo;

  /* Los colores salen de los tokens del tema. Se leen al arrancar y, cuando
     el tema cambia, durante lo que dura la transición de los tokens (600 ms,
     ver globals.css): así el globo se apaga con el resto de la página y no
     después. */
  const estilo = getComputedStyle(contenedor);
  const leerColores = () => {
    const token = (nombre: string) =>
      estilo.getPropertyValue(nombre).trim() || "#888";
    colores.mar.setStyle(token("--color-paper-alt"));
    colores.tierra.setStyle(token("--color-line-strong"));
    colores.pais.setStyle(token("--color-ink"));
    colores.grilla.setStyle(token("--color-line"));
    colores.borde.setStyle(token("--color-line-strong"));
  };
  leerColores();
  let coloresHasta = 0;
  const observador = new MutationObserver(() => {
    coloresHasta = performance.now() + 700;
    despertar();
  });
  observador.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-tema"],
  });

  let lado = 0;
  const medir = () => {
    const nuevo = contenedor.clientWidth;
    if (!nuevo || nuevo === lado) return;
    lado = nuevo;
    renderer.setSize(lado, lado, false);
    despertar();
  };
  const tamano = new ResizeObserver(medir);
  tamano.observe(contenedor);

  let visible = true;
  const vista = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) despertar();
  });
  vista.observe(contenedor);

  /* Sin 3D las marcas van con left y top en porcentajes (la vista quieta);
     acá se las lleva al origen y se las mueve con transform, que no obliga al
     navegador a recalcular el layout en cada cuadro. */
  for (const m of marcas) {
    m.el.style.left = "0";
    m.el.style.top = "0";
  }

  const moverMarcas = () => {
    for (const m of marcas) {
      const p = proyectar(
        m.lon,
        m.lat,
        giro.rotation.y,
        inclinacion.rotation.x,
      );
      m.el.style.transform = `translate3d(${(p.x * lado).toFixed(1)}px, ${(p.y * lado).toFixed(1)}px, 0)`;
      m.el.style.opacity = p.frente.toFixed(3);
      m.el.style.visibility = p.frente > 0 ? "visible" : "hidden";
    }
  };

  let cuadro = 0;
  let antes = 0;
  let primero = true;
  const paso = (ahora: number) => {
    cuadro = 0;
    const dt = Math.min(0.05, antes ? (ahora - antes) / 1000 : 0);
    antes = ahora;
    let seguir = false;

    if (!quieto()) {
      giro.rotation.y += VELOCIDAD * dt;
      seguir = true;
    }

    if (ahora < coloresHasta) {
      leerColores();
      seguir = true;
    }

    renderer.render(escena, camara);
    moverMarcas();
    if (primero) {
      primero = false;
      alListo();
    }

    /* Quieto (el mouse encima, por ejemplo) se sigue mirando cada tanto si
       hay que volver a girar: el hover no avisa cuando se va. */
    if (visible) {
      if (seguir) cuadro = requestAnimationFrame(paso);
      else espera = window.setTimeout(despertar, 250);
    }
  };
  let espera = 0;
  function despertar() {
    window.clearTimeout(espera);
    if (!cuadro && visible && lado) {
      antes = 0;
      cuadro = requestAnimationFrame(paso);
    }
  }

  medir();
  despertar();

  return {
    destruir() {
      cancelAnimationFrame(cuadro);
      window.clearTimeout(espera);
      observador.disconnect();
      tamano.disconnect();
      vista.disconnect();
      geometria.dispose();
      material.dispose();
      textura.dispose();
      renderer.dispose();
      lienzo.remove();
    },
  };
}
