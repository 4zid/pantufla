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
2. **El logo.** `components/ui/icons.tsx` → `Logo`. Es una pantufla dibujada en
   dos trazos, pensada como marca provisoria hasta que tengas la tuya.
3. **Datos de contacto y redes.** `content/site.ts` → `site`.

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

1. Creá un proyecto en [sanity.io/manage](https://www.sanity.io/manage) con el
   dataset `production`.
2. Pegá el Project ID en `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. En **API → CORS origins**, agregá `http://localhost:3000` y tu dominio, los dos
   con *Allow credentials*.
4. En **API → Tokens**, creá uno con permiso *Editor* y pegalo en
   `SANITY_API_WRITE_TOKEN`. Solo se usa para guardar los briefs del formulario.

El panel queda en `/studio`, dentro del mismo deploy. No hay que hostearlo aparte.

### Resend (avisos del formulario)

Verificá tu dominio en [resend.com](https://resend.com) y completá `RESEND_API_KEY`,
`BRIEF_NOTIFICATION_TO` y `BRIEF_NOTIFICATION_FROM`.

Los dos destinos son independientes: si falla el mail, el brief igual queda
guardado en Sanity, y al revés. Solo devuelve error si no hay ninguno de los dos.

### Vercel

Importá el repo, cargá las mismas variables de entorno y listo. `NEXT_PUBLIC_SITE_URL`
tiene que apuntar al dominio final para que el sitemap y los metadatos salgan bien.

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
5. **Planes** — tres niveles, el del medio destacado (la insignia de "más elegido"
   sube su elección de forma consistente), toggle con el ahorro visible y una
   garantía debajo para bajar el riesgo percibido.
6. **Proyectos y testimonios** — prueba social después del precio, no antes.
7. **Preguntas frecuentes** — objeciones de compra: propiedad del sitio, costo de
   mantenimiento, formas de pago, uso de IA.
8. **Cierre** — un solo CTA.

El toggle de precios no es mensual/anual, porque el estudio no vende una
suscripción. Ofrece **pago único con 15% de descuento** contra **dos pagos**: la
misma mecánica de descuento, aplicada a algo real, y alineada con cobrar rápido.

---

## Decisiones de diseño

- **Una sola familia tipográfica** (Schibsted Grotesk), trabajada por peso, tamaño
  y color. Sin mono decorativa en etiquetas ni versalitas de relleno.
- **Paleta de papel cálido** con un acento arcilla, en vez del gris azulado
  habitual. Un grano muy leve sobre el fondo para que no quede plano.
- Bandas oscuras en Proceso y en el cierre para marcar el ritmo de lectura.
- Sin degradados en texto, sin vidrio esmerilado, sin emoji como iconos: los
  iconos son SVG propios en `components/ui/icons.tsx`.

---

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # tsc --noEmit
```
