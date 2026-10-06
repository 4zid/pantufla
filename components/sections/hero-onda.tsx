"use client";

import { useEffect, useRef } from "react";

/**
 * La cinta del fondo del hero: una banda en degradé de blanco a verde
 * profundo (#166B67) que cruza la pantalla, se da vuelta sobre sí misma y se
 * corre un poco hacia el cursor.
 *
 * Viene de Claude Design (Pantufla_Hero.html). El shader es el mismo; lo que
 * cambia es todo lo que lo rodea:
 *
 * - Los valores salen del panel de ajustes del diseño (5,2 giros, capa de
 *   atrás entera…), salvo el color y el ancho, que se cambiaron después a
 *   pedido: el diseño la tenía en miel, rosa y aqua, y más ancha. Ver
 *   PALETA y AJUSTES.
 * - Un solo lienzo. El diseño tenía uno por marco (escritorio y teléfono) con
 *   un recorrido distinto para cada uno; acá se elige el recorrido según la
 *   forma del lienzo: apaisado, el de escritorio; vertical, el del teléfono.
 * - Se para cuando el hero sale de pantalla. El shader busca, para cada
 *   píxel, el punto más cercano de la curva —unas sesenta evaluaciones por
 *   píxel—, y dibujarlo sesenta veces por segundo mientras alguien lee los
 *   planes no tiene sentido.
 * - Con menos movimiento pedido se dibuja un solo cuadro, quieto, y el
 *   cursor no la mueve.
 * - Sin WebGL no pasa nada: el lienzo queda vacío y el hero se ve con el
 *   fondo de bruma, que es lo que se ve igual mientras carga.
 * - Sin placa de video tampoco. Si el navegador no tiene aceleración (una
 *   placa vieja en su lista negra, una máquina virtual), WebGL igual
 *   funciona, pero calculado por el procesador: medido en Lighthouse, cada
 *   cuadro tomaba 400 ms del hilo principal y la página quedaba trabada. Con
 *   failIfMajorPerformanceCaveat el navegador no da el contexto en ese caso,
 *   y la cinta directamente no está.
 * - Y si con placa igual va lenta (un teléfono modesto), se arregla sola:
 *   mide cuánto tardan los cuadros y, si van por debajo de 30 por segundo,
 *   dibuja a la mitad de resolución; si aun así no llega, se queda quieta en
 *   el último cuadro.
 *
 * Entra con un fundido apenas tiene el primer cuadro: el texto del hero no
 * espera al JavaScript (ver globals.css) y la cinta no tiene que aparecer de
 * golpe atrás de un titular que ya está.
 */

const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform float uTime;uniform vec3 uMouse;uniform vec3 uCfg;uniform float uCursor;
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
uniform vec3 uA;uniform vec3 uB;
vec3 pal(float k){
  return mix(uA,uB,0.5-0.5*cos(6.2831853*k));
}
uniform vec4 uP01;uniform vec4 uP23;
vec2 P0,P1,P2,P3;
vec2 bez(float t){float s=1.0-t;return s*s*s*P0+3.0*s*s*t*P1+3.0*s*t*t*P2+t*t*t*P3;}
vec2 bezd(float t){float s=1.0-t;return 3.0*s*s*(P1-P0)+6.0*s*t*(P2-P1)+3.0*t*t*(P3-P2);}
float nearestT(vec2 q){
  float bt=0.0;float bd=1e9;
  for(int i=0;i<=48;i++){float t=float(i)/48.0;vec2 d=bez(t)-q;float dd=dot(d,d);if(dd<bd){bd=dd;bt=t;}}
  float h=0.5/48.0;
  for(int k=0;k<5;k++){
    float ta=clamp(bt-h,0.0,1.0),tb=clamp(bt+h,0.0,1.0);
    vec2 da=bez(ta)-q,db=bez(tb)-q;float fa=dot(da,da),fb=dot(db,db);
    if(fa<bd){bd=fa;bt=ta;}
    if(fb<bd){bd=fb;bt=tb;}
    h*=0.5;
  }
  return bt;
}
uniform vec4 uK1;uniform vec4 uK2;uniform vec4 uK3;uniform vec4 uK4;
vec4 band(float sd,float s,float t,float seed,float shift,float scaleW,float pull,float g,float backTone){
  float nt=t*uK4.z;
  float off=uCfg.x*uK1.w*(0.72*snoise(vec2(s*2.1+seed,nt*0.08))+0.28*snoise(vec2(s*4.4+seed*2.0+7.0,nt*0.13+3.0)))+shift;
  off+=pull*g;
  float tw=s*uK1.y+t*uK1.z+seed*1.9+1.4*snoise(vec2(s*1.1+seed,nt*0.06+11.0));
  float ct=cos(tw),st=sin(tw);
  float W=uCfg.y*uK2.x*scaleW*(1.0+0.12*g);
  float hw=W*(0.06+0.94*abs(ct));
  float v=(sd-off)/hw;
  float u=s;
  float edgePx=mix(70.0,1.4,uK1.x);
  float aa=min(0.95,edgePx/(uRes.y*hw));
  float A=1.0-smoothstep(1.0-aa,1.0,abs(v));
  float glow=uK3.w*exp(-max(abs(sd-off)-hw,0.0)*uRes.y/uRes.y*28.0)*(1.0-A);
  if(A<=0.0&&glow<0.002) return vec4(0.0);
  float front=step(0.0,ct);
  vec3 c=pal(u*uK2.y+tw*0.035+uTime*uK2.z+seed*0.13);
  vec3 face=mix(mix(c,vec3(1.0),0.55),c,front);
  face=mix(face,mix(c,vec3(1.0),0.7),backTone);
  float across=v*sign(ct+1e-4);
  face*=0.9+0.1*across;
  float fold=pow(1.0-abs(ct),2.2);
  face=mix(face,vec3(1.0),fold*uK3.x);
  float q=(across-0.55*st)/0.3;
  face=mix(face,vec3(1.0),exp(-q*q)*uK2.w*front);
  float lip=smoothstep(0.7,1.0,abs(v))*0.12*front;
  face*=1.0-lip;
  float l=dot(face,vec3(0.299,0.587,0.114));
  face=clamp(mix(vec3(l),face,uK4.w),0.0,1.0);
  float o=uK3.z;
  vec3 gc=mix(c,vec3(1.0),0.3);
  return vec4((face*A+gc*glow)*o,(A+glow)*o);
}
void main(){
  vec2 p=gl_FragCoord.xy/uRes;p.y=1.0-p.y;
  float asp=uRes.x/uRes.y;vec2 q=vec2(p.x*asp,p.y);
  P0=vec2(uP01.x*asp,uP01.y);P1=vec2(uP01.z*asp,uP01.w);P2=vec2(uP23.x*asp,uP23.y);P3=vec2(uP23.z*asp,uP23.w);
  float t=uTime;
  float s=nearestT(q);
  vec2 c=bez(s);vec2 T=normalize(bezd(s));vec2 n=vec2(-T.y,T.x);
  float sd=dot(q-c,n);
  vec2 mq=vec2(uMouse.x*asp,uMouse.y);vec2 mc=mq-c;
  float g=exp(-dot(mc,mc)/(uK4.y*uK4.y))*uMouse.z*uCursor;
  float pull=uK4.x*dot(mc,n);
  vec4 frontB=band(sd,s,t,0.0,0.0,1.0,pull,g,0.0);
  vec4 back=band(sd,s,t*0.82,4.0,uCfg.y*uK2.x*0.9,0.78,pull*0.6,g*0.6,1.0)*uK3.y;
  vec3 rgb=frontB.rgb+back.rgb*(1.0-frontB.a);
  float A=frontB.a+back.a*(1.0-frontB.a);
  float d=(hash(gl_FragCoord.xy+fract(t))-0.5)*(2.0/255.0);
  gl_FragColor=vec4(rgb+d*A,A);
}`;

const hex = (h: string) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];

/**
 * Los dos extremos del degradé: blanco y el verde profundo de la marca
 * (aqua-deep). El diseño traía tres colores que se recorrían en ciclo, y con
 * dos así quedaba casi toda la cinta blanca y el verde en un tramo corto al
 * final. Ahora el color va y viene entre los dos con un coseno (ver pal en
 * el shader): sin saltos ni mesetas, y siempre con los dos a la vista.
 */
const PALETA = ["#ffffff", "#166b67"].map(hex);

/**
 * Los ajustes del panel de Claude Design. Tres cambiaron después, junto con el
 * color:
 * - grosor, de 1 a 0,6: la cinta, más angosta;
 * - escalaGradiente, de 0,55 a 1: el degradé hace el recorrido entero (blanco,
 *   verde, blanco) a lo largo de la cinta, así en cualquier momento se ven los
 *   dos colores, y no media cinta blanca o media verde según el momento;
 * - pliegues, de 0,85 a 0,5: en cada vuelta la cinta se aclaraba hacia el
 *   blanco, y con el blanco ya en la paleta lavaba el verde.
 */
const AJUSTES = {
  escalaGradiente: 1,
  velGradiente: 1,
  saturacion: 1,
  brillo: 0.45,
  pliegues: 0.5,
  resplandor: 0,
  opacidad: 1,
  nitidez: 0.97,
  grosor: 0.6,
  giros: 5.2,
  amplitud: 1,
  opacidadTrasera: 1,
  velocidad: 1,
  velGiro: 1,
  ondulacion: 1,
  fuerzaCursor: 1,
  radioCursor: 0.245,
};

/**
 * Por dónde pasa la cinta, en fracciones del lienzo: punto de partida, dos
 * puntos de control y llegada de una curva de Bézier. En escritorio entra por
 * la derecha arriba y sale por abajo hacia el medio; en el teléfono es más
 * fina y más recta, para no tapar el titular.
 */
const RECORRIDOS = {
  ancho: {
    path: [1.15, 0.8, 0.8, 1.05, 0.5, 0.55, 0.57, -0.12],
    amp: 0.05,
    thick: 0.075,
  },
  alto: {
    path: [1.3, 0.8, 0.7, 1.02, 0.45, 0.45, 0.9, -0.1],
    amp: 0.025,
    thick: 0.042,
  },
} as const;

const UNIFORMES = [
  "uRes",
  "uTime",
  "uMouse",
  "uCfg",
  "uCursor",
  "uA",
  "uB",
  "uP01",
  "uP23",
  "uK1",
  "uK2",
  "uK3",
  "uK4",
] as const;

/**
 * Arma la cinta en el lienzo y devuelve cómo desarmarla. Si no hay WebGL (o
 * solo hay WebGL por software) no arma nada y el lienzo queda vacío.
 */
function montar(canvas: HTMLCanvasElement, hero: HTMLElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return;

  /*
     failIfMajorPerformanceCaveat no alcanza: según cómo arranque el
     navegador, igual entrega el contexto aunque detrás no haya placa (pasaba
     con el Chrome de Lighthouse, que dibuja con SwiftShader, por software).
     El nombre del dibujante lo delata. Los de software conocidos: SwiftShader
     (Chrome sin placa), llvmpipe y softpipe (Linux sin placa) y el «Basic
     Render» de Windows.
  */
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const dibujante = String(
    gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "",
  );
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(dibujante)) {
    return;
  }

  const compilar = (tipo: number, fuente: string) => {
    const s = gl.createShader(tipo);
    if (!s) return null;
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compilar(gl.VERTEX_SHADER, VS);
  const fs = compilar(gl.FRAGMENT_SHADER, FS);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

  // Un triángulo que cubre toda la pantalla.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.useProgram(prog);
  const a = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const loc = Object.fromEntries(
    UNIFORMES.map((n) => [n, gl.getUniformLocation(prog, n)]),
  ) as Record<(typeof UNIFORMES)[number], WebGLUniformLocation | null>;

  // Lo que no cambia de un cuadro al otro va una sola vez.
  const k = AJUSTES;
  gl.uniform4f(loc.uK1, k.nitidez, k.giros, 0.24 * k.velGiro, k.amplitud);
  gl.uniform4f(
    loc.uK2,
    k.grosor,
    k.escalaGradiente,
    0.012 * k.velGradiente,
    k.brillo,
  );
  gl.uniform4f(
    loc.uK3,
    k.pliegues,
    k.opacidadTrasera,
    k.opacidad,
    k.resplandor,
  );
  gl.uniform4f(
    loc.uK4,
    0.35 * k.fuerzaCursor,
    k.radioCursor,
    k.ondulacion,
    k.saturacion,
  );
  gl.uniform3fv(loc.uA, PALETA[0]);
  gl.uniform3fv(loc.uB, PALETA[1]);

  const quieta = window.matchMedia("(prefers-reduced-motion: reduce)");
  /* El punto de la animación en que arranca, distinto en cada visita. */
  const semilla = Math.random() * 100;
  let t = 0;
  let ultimo = performance.now();
  let cuadro = 0;
  let visible = false;
  let pintada = false;
  /* La calidad, que baja sola si los cuadros no llegan (ver paso). */
  let escala = 1;
  let lenta = false;
  let muestras = 0;
  let acumulado = 0;
  let golpes = 0;
  const mouse = { x: 0.5, y: 0.5, on: 0, tx: 0.5, ty: 0.5, ton: 0 };

  const dibujar = () => {
    /* En el teléfono a 1x: el borde de la cinta ya es difuso (unos 3,5 px
         de suavizado) y no se nota, y son la mitad de píxeles que calcular.
         En escritorio hasta 1,5x, como en el diseño. */
    const tope = window.matchMedia("(pointer: coarse)").matches ? 1 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, tope) * escala;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.on += (mouse.ton - mouse.on) * 0.06;

    const r = w >= h ? RECORRIDOS.ancho : RECORRIDOS.alto;
    const [x0, y0, cx1, cy1, cx2, cy2, x3, y3] = r.path;
    gl.uniform2f(loc.uRes, w, h);
    gl.uniform1f(loc.uTime, t + semilla);
    gl.uniform3f(loc.uMouse, mouse.x, mouse.y, mouse.on);
    gl.uniform1f(loc.uCursor, quieta.matches ? 0 : 1);
    gl.uniform3f(loc.uCfg, r.amp, r.thick, 0);
    gl.uniform4f(loc.uP01, x0, y0, cx1, cy1);
    gl.uniform4f(loc.uP23, cx2, cy2, x3, y3);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!pintada) {
      pintada = true;
      canvas.style.opacity = "1";
    }
  };

  const paso = (ahora: number) => {
    const intervalo = ahora - ultimo;
    const dt = Math.min(0.05, intervalo / 1000);
    ultimo = ahora;
    t = (t + dt * k.velocidad) % 600;

    const antes = performance.now();
    dibujar();
    const costo = performance.now() - antes;

    /*
         El control de calidad, en dos niveles.

         Uno, inmediato, por si algún dibujante por software se escapó del
         nombre: si dibujar un cuadro le toma al hilo principal más que un
         cuadro entero (16 ms), o si entre cuadro y cuadro pasan más de
         100 ms, dos veces así y se queda quieta; un solo cuadro de más de
         250 ms alcanza. Sin placa, cada cuadro costaba 400 ms, y esperar a
         juntar un promedio eran segundos de página trabada.

         Otro, de a poco: cada 25 cuadros mira el promedio de los últimos 20
         (los primeros cinco no cuentan: ahí el navegador todavía compila el
         shader y arma el lienzo). Por debajo de 30 cuadros por segundo baja
         a la mitad de resolución; si ya estaba a la mitad, se queda quieta.
      */
    muestras += 1;
    if (costo > 16 || (muestras > 1 && intervalo > 100)) golpes += 1;
    if (golpes >= 2 || (muestras > 1 && intervalo > 250)) lenta = true;
    if (muestras > 5) acumulado += intervalo;
    if (muestras === 25) {
      if (acumulado / 20 > 34) {
        if (escala > 0.5) escala = 0.5;
        else lenta = true;
      }
      muestras = 0;
      acumulado = 0;
    }

    if (!lenta) cuadro = requestAnimationFrame(paso);
  };

  const arrancar = () => {
    cancelAnimationFrame(cuadro);
    if (!visible) return;
    muestras = 0;
    acumulado = 0;
    if (quieta.matches || lenta) {
      dibujar();
      return;
    }
    ultimo = performance.now();
    cuadro = requestAnimationFrame(paso);
  };

  const vista = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    arrancar();
  });
  vista.observe(hero);

  /* Quieta no hay cuadros que redibujen al cambiar el tamaño. */
  const medida = new ResizeObserver(() => {
    if ((quieta.matches || lenta) && visible) dibujar();
  });
  medida.observe(canvas);
  quieta.addEventListener("change", arrancar);

  /* Solo el mouse: en el teléfono el dedo está scrolleando, no apuntando. */
  const mover = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = (e.clientY - r.top) / r.height;
    mouse.ton = 1;
  };
  const salir = () => {
    mouse.ton = 0;
  };
  hero.addEventListener("pointermove", mover, { passive: true });
  hero.addEventListener("pointerleave", salir);

  /* Si el navegador se queda sin memoria de video, suelta el contexto: no
       se insiste, la cinta se va y el hero queda con su fondo. */
  const perdido = () => {
    cancelAnimationFrame(cuadro);
    vista.disconnect();
    canvas.style.opacity = "0";
  };
  canvas.addEventListener("webglcontextlost", perdido);

  return () => {
    cancelAnimationFrame(cuadro);
    vista.disconnect();
    medida.disconnect();
    quieta.removeEventListener("change", arrancar);
    hero.removeEventListener("pointermove", mover);
    hero.removeEventListener("pointerleave", salir);
    canvas.removeEventListener("webglcontextlost", perdido);
  };
}

export function HeroOnda() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;

    /*
       La cinta arranca cuando el navegador está libre y no en el montaje:
       compilar el shader puede tomar decenas de milisegundos del hilo
       principal, y en ese momento la página todavía está cargando lo que
       sí importa. El texto del hero ya está a la vista (entra por CSS), y la
       cinta llega un instante después con su fundido.
    */
    let desarmar: (() => void) | undefined;
    let cancelada = false;
    const empezar = () => {
      if (!cancelada) desarmar = montar(canvas, hero);
    };
    const ocioso = "requestIdleCallback" in window;
    const espera = ocioso
      ? window.requestIdleCallback(empezar, { timeout: 2000 })
      : window.setTimeout(empezar, 600);

    return () => {
      cancelada = true;
      if (ocioso) window.cancelIdleCallback(espera);
      else window.clearTimeout(espera);
      desarmar?.();
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      aria-hidden
      /* El fundido de abajo: en algunos cuadros la cinta toca el borde
         inferior, y ahí la sección la cortaba con una línea recta justo
         encima de la tira de clientes. */
      className="pointer-events-none absolute inset-0 -z-10 block h-full w-full opacity-0 transition-opacity duration-700 ease-out [mask-image:linear-gradient(to_bottom,#000_80%,transparent)] motion-reduce:transition-none"
    />
  );
}
