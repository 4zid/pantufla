# Pantufla

Sitio del estudio: diseño y desarrollo web con alcance cerrado, precio cerrado y
fecha de entrega.

Next.js (App Router) · Tailwind CSS v4 · Sanity · Resend · Vercel.

---

## Antes de publicar

Tres cosas quedaron con contenido de relleno a propósito. Reemplazalas:

1. **Proyectos y testimonios.** Están en `content/demo-content.ts` con nombres
   inventados. Se muestran **solo mientras el CMS esté vacío**: apenas cargues el
   primer proyecto real en `/studio`, Sanity gana y el relleno desaparece. No
   publiques el sitio con esos datos.
2. **Los países del mapa.** `content/site.ts` → `clients`. El pie de la sección
   cuenta esa lista, así que el número siempre coincide con lo que se muestra:
   sacá las ciudades donde todavía no hubo un proyecto y el texto se ajusta solo.
3. **El logo.** `components/ui/icons.tsx` → `Logo`. Es una pantufla dibujada en
   dos trazos, pensada como marca provisoria hasta que tengas la tuya.
4. **Datos de contacto y redes.** `content/site.ts` → `site`.

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completá las variables
npm run dev
```

El sitio arranca aunque no haya nada configurado: sin `NEXT_PUBLIC_SANITY_PROJECT_ID`
las consultas devuelven vacío y se usa el contenido de muestra. `/studio` muestra
una pantalla con los pasos que faltan en vez de romper.

### Sanity

El proyecto ya existe: **`6zkp4mb1`**, dataset `production`. El ID vive en
`sanity/env.ts` porque es público, así que leer contenido y abrir `/studio`
funciona sin configurar nada.

Lo único que hace falta cargar es el token de escritura, que se usa **solo** para
guardar los briefs que llegan del formulario:

1. En [sanity.io/manage](https://www.sanity.io/manage) → API → Tokens, creá uno
   con permiso *Editor*.
2. Cargalo como `SANITY_API_WRITE_TOKEN` en Vercel y en tu `.env.local`.

Si agregás un dominio nuevo, sumalo en **API → CORS origins** con *Allow
credentials* tildado, o `/studio` no va a abrir ahí.

El panel queda en `/studio`, dentro del mismo deploy. No hay que hostearlo aparte.

### Resend (avisos del formulario)

El dominio **pantufla.design** ya está verificado en Resend (DKIM y los dos
CNAME de SPF, región `eu-west-1`).

Hacen falta las **tres** variables, no solo la clave: sin `BRIEF_NOTIFICATION_TO`
y `BRIEF_NOTIFICATION_FROM` el route handler no manda nada. El `FROM` tiene que
ser una dirección del dominio verificado (`brief@pantufla.design`); el `TO` puede
ser cualquier casilla donde quieras recibir los briefs.

Los dos destinos son independientes: si falla el mail, el brief igual queda
guardado en Sanity, y al revés. Solo devuelve error si no hay ninguno de los dos.

### Vercel

Variables a cargar en el panel de Vercel:

| Variable | Para qué |
| --- | --- |
| `SANITY_API_WRITE_TOKEN` | guardar los briefs en el CMS |
| `RESEND_API_KEY` | mandar el aviso por mail |
| `BRIEF_NOTIFICATION_TO` | a qué casilla llega el brief |
| `BRIEF_NOTIFICATION_FROM` | `brief@pantufla.design` (dominio verificado) |
| `NEXT_PUBLIC_SITE_URL` | el dominio principal, para sitemap y metadatos |

`NEXT_PUBLIC_SITE_URL` tiene que coincidir con el dominio que marques como
principal en Vercel: si es el apex va `https://pantufla.design`, si es el www va
con el `www.` adelante.

---

## Dónde se edita cada cosa

| Qué | Dónde |
| --- | --- |
| Precios, planes, descuento del toggle | `content/site.ts` → `pricing` |
| Pasos del proceso y forma de pago | `content/site.ts` → `process` |
| Preguntas frecuentes | `content/site.ts` → `faq` |
| Textos del hero, problema y método | `content/site.ts` |
| Proyectos, notas y testimonios | `/studio` (Sanity) |
| Colores, tipografía y escala | `app/globals.css` → `@theme` |

Cambiar un precio o agregar una pregunta no requiere tocar ningún componente.

---

## Por qué la home está ordenada así

El orden sigue el recorrido **problema → prueba → proceso → precio → objeciones**,
que es el que mejor rinde en sitios de servicios:

1. **Hero** — promesa concreta con plazo, propuesta de valor en menos de 30
   palabras, un solo CTA primario y tres pruebas de respaldo.
2. **Problema** — nombra las cuatro frustraciones típicas con las palabras del
   cliente, antes de hablar de nosotros.
3. **Método** — cómo se resuelve cada una.
4. **Proceso** — cuatro etapas con fecha, entregable y qué pone el cliente. Baja
   la ansiedad de "¿y esto cuánto tarda?".
5. **Planes** — dos opciones y nada más: una página sola o el sitio completo.
   El cliente que busca una web no siempre sabe lo que necesita, y tres niveles
   con un "a medida" abierto lo obligan a decidir algo que todavía no puede.
   La segunda va en oscuro y con la insignia de "más elegido"; debajo quedan la
   garantía y una salida por escrito para lo que no entra en ninguno de los dos.
6. **Proyectos y testimonios** — prueba social después del precio, no antes.
7. **Preguntas frecuentes** — objeciones de compra: propiedad del sitio, costo de
   mantenimiento, formas de pago, uso de IA.
8. **Cierre** — un solo CTA.

El hero cuenta el resultado, no el proceso. Sobre un gradiente de los cuatro
colores flotan cuatro paneles —el sitio publicado, las visitas subiendo, una
venta nueva y la conversación de aprobación— y al bajar **convergen en el
dashboard** que se arma debajo del título: es lo que el cliente tiene un mes
después de la entrega.

El vuelo funciona así: cada hueco del dashboard mide **exactamente lo mismo** que
su panel, así que converger es una traslación pura, sin escalado ni deformación.
Los paneles y los huecos viven en el mismo contenedor, de modo que la diferencia
entre sus rectángulos no depende del scroll y se puede recalcular en cada
`refresh`. La colocación en la grilla va explícita (`col-start` / `row-start`):
con colocación automática, los paneles que ocupan dos filas empujan al resto.

Los cuatro paneles se reparten entre la zona media y la de abajo, siempre por
debajo del título: arriba manda el titular y ahí no entra nada. Antes salían por los costados y el texto quedaba
cortado contra el borde. Por eso además aparecen recién a partir de **1440px**,
que es el ancho donde caben sin pisar el titular; abajo de eso el dashboard se
muestra ya armado y no hay vuelo.

El toggle de precios no es mensual/anual, porque el estudio no vende una
suscripción. Ofrece **pago único con 15% de descuento** contra **dos pagos**: la
misma mecánica de descuento, aplicada a algo real, y alineada con cobrar rápido.

---

## Movimiento

El sitio usa GSAP con ScrollTrigger. Las primitivas están en `components/motion/`
y se combinan en las secciones:

| Componente | Qué hace |
| --- | --- |
| `Reveal` | Aparición al entrar en pantalla. Con `stagger` escalona los hijos directos. |
| `SplitHeading` | Titular que sube palabra por palabra detrás de una máscara. |
| `Counter` | Cifra que rueda hasta su valor. Se usa en los precios al cambiar el toggle. |
| `Magnetic` | El botón sigue apenas al cursor. Solo con puntero fino. |
| `DrawnLineArt` | Dibuja la ilustración trazo por trazo al entrar en pantalla. |
| `ProjectStack` | Fichas de proyecto que se apilan con el scroll, una sobre otra. |

Los paneles del hero además **se arrastran**. El arrastre vive en un hijo del
marco que vuela, así los dos transforms no compiten por el mismo elemento; al
empezar la convergencia, lo que se haya movido a mano vuelve a cero para que el
panel aterrice donde corresponde.

En `ProjectStack` la ficha que se va se achica pero **no baja su opacidad**: si
se transparentara el elemento entero, su texto se leería a través de la que
llega. El apagado lo hace un velo dentro de la propia ficha.

**Dos reglas que sostienen todo esto:**

1. Nada se oculta desde CSS a secas. Un script inline agrega `.motion-ready` a
   `<html>` antes del primer pintado, y recién entonces el CSS oculta lo que se
   va a animar. Si el JS no corre, el sitio queda completo y visible.
2. Cada animación pasa por `gsap.matchMedia()`. Con `prefers-reduced-motion:
   reduce` no se anima nada y todo aparece en su lugar final.

Las dos están verificadas: con reduced-motion y con JavaScript desactivado,
cero elementos quedan invisibles.

---

## Decisiones de diseño

- **Una sola familia tipográfica** (Schibsted Grotesk), trabajada por peso, tamaño
  y color. Sin mono decorativa en etiquetas ni versalitas de relleno.
- **Papel cálido de base y cuatro colores de marca** en pastel: aqua, rosa, verde
  y miel. Un grano muy leve sobre el fondo para que no quede plano.

### Cómo se usan los cuatro colores

Cada color viene en tres pasos y cada paso tiene un uso fijo. La regla que los
mantiene legibles: **el pastel base nunca lleva texto chico sobre papel** — no
llega a 2:1. Para eso está la variante profunda, que pasa AA en los dos fondos
claros.

| Paso | Para qué | Contraste sobre papel |
| --- | --- | --- |
| `-soft` | fondo de pastillas y washes | — |
| base | rellenos, formas, ilustración, y texto sobre la banda oscura | 9,6–11,9:1 en oscuro |
| `-deep` | texto e iconos chicos sobre papel | 4,9–5,8:1 |

El color es taxonomía, no decoración: cada etapa del proceso, cada plan y cada
pilar del método tiene su color asignado en `content/site.ts` y se resuelve con
los mapas de `lib/tones.ts`. Tailwind no arma nombres de clase en runtime, así
que las variantes están escritas enteras ahí.
- Bandas oscuras en Proceso y en el cierre para marcar el ritmo de lectura.
- Sin degradados en texto, sin vidrio esmerilado, sin emoji como iconos: los
  iconos son SVG propios en `components/ui/icons.tsx`.
- **La volanta de sección no va en mayúsculas con tracking.** Ese tratamiento
  está en medio internet y se lee a plantilla. Acá es una regla corta más el
  texto en caja baja, en el color que le toca a esa sección: el color es lo que
  la vuelve nuestra.
- **Ninguna sección repite el patrón de grilla de tarjetas con borde.** Problema
  y testimonios van con filetes y aire en vez de cajas, que es lo que les sacaba
  personalidad.
- Los assets son código, no imágenes: los blobs (`components/art/blob.tsx`) son
  SVG con gradientes multi-stop y luz interna, sin `box-shadow`; la ilustración
  (`components/art/line-art.tsx`) es un set de trazos con la misma mano.
- Del ref se tomó el lenguaje, no la paleta: tipografía como imagen, movimiento,
  contención suelta de las formas. El papel cálido se mantiene porque es lo que
  distingue a Pantufla del resto de los estudios.

---

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # tsc --noEmit
```
