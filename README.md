# Pantufla

Sitio del estudio: diseño y desarrollo web con alcance cerrado, precio cerrado y
fecha de entrega.

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Sanity · GSAP + Lenis ·
Resend · Cal.com · Vercel.

En vivo en [www.pantufla.design](https://www.pantufla.design), en español en la
raíz y en inglés en `/en`.

---

## Contenido de respaldo

El sitio arranca con contenido propio aunque el CMS esté vacío. Tres cosas
conviene tener a mano:

1. **Proyectos y testimonios.** El respaldo está en
   `content/fallback-content.ts`. Se muestra **solo mientras el CMS no tenga
   ninguno**: apenas cargues el primer proyecto (o el primer testimonio) en
   `/studio`, Sanity gana y el respaldo de ese tipo deja de verse.
2. **Los países del globo.** `content/site.ts` → `clients` (hoy Argentina,
   Colombia, Estados Unidos, España y Dinamarca, con Copenhague). El pie de la
   sección cuenta esa lista, así que el número siempre coincide con lo que se
   muestra. Un país nuevo también hay que pintarlo: sumarlo en
   `scripts/generar-globo.mjs`, correrlo, ponerle nombre en
   `content/countries.ts` y volver a sacar la imagen quieta con
   `scripts/generar-globo-imagen.mjs` (ver *El globo*).
3. **Datos de contacto y redes.** `content/site.ts` → `site` (mail, WhatsApp,
   ubicación, redes).

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completá las variables
npm run dev
```

El sitio arranca aunque no haya nada configurado. El proyecto de Sanity viene
por defecto, y si Sanity no responde cada consulta cae al texto y al contenido
que ya están en el repositorio: el sitio nunca se rompe por el CMS.

### Sanity

El proyecto ya existe: **`6zkp4mb1`**, dataset `production`. El ID vive en
`sanity/env.ts` porque es público, así que leer contenido y abrir `/studio`
funciona sin configurar nada. Si algún día se vaciara, `/studio` muestra una
pantalla con los pasos que faltan en vez de romper.

Lo único que hace falta cargar es el token de escritura, que se usa para guardar
los briefs que llegan del formulario, las reuniones que llegan de Cal.com y los
lugares que se reservan con el pase:

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
| `SANITY_API_WRITE_TOKEN` | guardar los briefs y las reuniones en el CMS |
| `RESEND_API_KEY` | mandar el aviso por mail |
| `BRIEF_NOTIFICATION_TO` | a qué casilla llega el brief |
| `BRIEF_NOTIFICATION_FROM` | `brief@pantufla.design` (dominio verificado) |
| `NEXT_PUBLIC_SITE_URL` | el dominio principal, para sitemap y metadatos |
| `SANITY_REVALIDATE_SECRET` | que publicar en el Studio se vea sin redesplegar |
| `NEXT_PUBLIC_CAL_LINK` | el evento de Cal.com que se embebe en `/reunion` |
| `CAL_WEBHOOK_SECRET` | que las reservas aparezcan en el Studio |

`NEXT_PUBLIC_SITE_URL` tiene que coincidir con el dominio que marques como
principal en Vercel: si es el apex va `https://pantufla.design`, si es el www va
con el `www.` adelante. Hoy el principal es `https://www.pantufla.design` —el
apex está cargado como redirección 308 hacia él— y ese es el valor que usa
`lib/site-url.ts` cuando la variable no está. De ahí salen los canonical, los
hreflang, el sitemap y los `@id` del grafo de datos estructurados, así que
apuntarlo a un host que no resuelve es peor que no tenerlo.

### Ramas: main, staging y una por cambio

| Rama | Qué es |
| --- | --- |
| `main` | Producción. **Todo lo que entra acá sale en www.pantufla.design.** Es la rama principal del repo. |
| `staging` | Vista previa, para probar diseños antes de publicarlos. |
| `feat/<tema>` | Un cambio nuevo: una sección, una página, un rediseño. |
| `fix/<tema>` | Un arreglo puntual. |

El recorrido de un cambio:

1. Se abre una rama desde `main`: `feat/hero-nuevo`, `fix/menu-movil`. El
   nombre en minúsculas y con guiones, diciendo de qué se trata.
2. Se mergea en `staging` para verlo en la vista previa.
3. Cuando está aprobado, se mergea en `main` (con un pull request, así queda
   registrado qué entró y cuándo) y sale a producción.
4. La rama del cambio se borra. Si `main` recibió algo que `staging` no
   tiene, se trae con un merge para que las dos no se separen.

Sobre la vista previa:

- Cada push a `staging` arma una vista previa en Vercel, siempre en la misma
  dirección: `pantufla-git-staging-kalada.vercel.app`. Las ramas `feat/` y
  `fix/` también tienen la suya. Están detrás del login de Vercel del equipo;
  para mostrársela a alguien de afuera se comparte un link desde el panel del
  despliegue, o se le asigna un dominio propio (`staging.pantufla.design`) en
  Settings → Domains, eligiendo la rama.
- Las vistas previas no se indexan: `lib/entorno.ts` las reconoce por
  `VERCEL_ENV` y el sitio sale con `noindex` y un robots.txt cerrado, aunque
  tengan dominio propio.
- Staging lee el mismo contenido de Sanity que producción: lo que se publica en
  el Studio se ve en los dos.
- Si las variables de Resend y Sanity están habilitadas para Preview en Vercel,
  un brief enviado desde staging llega de verdad a la casilla y al Studio.
- Vercel no arma una rama cuyo último commit ya se construyó en otra: si
  `staging` queda en el mismo commit que `main`, no hay vista previa nueva
  hasta que reciba un commit propio.

### Que publicar en Sanity se vea

Cada consulta a Sanity sale etiquetada por tipo —`project`, `testimonial`,
`siteCopy`, `siteSections`— pero una etiqueta sola no se vence: hace falta que
alguien avise. Ese alguien es `/api/revalidate`, y sin el
webhook configurado un cambio publicado en el Studio tarda en aparecer o no
aparece hasta el próximo deploy.

Se arma una vez, en dos lados, con **el mismo string**:

1. Generá el secreto: `openssl rand -base64 32`.
2. En Vercel → Settings → Environment Variables, cargalo como
   `SANITY_REVALIDATE_SECRET` en los tres entornos y redesplegá (las variables
   se leen en el arranque, no en caliente).
3. En [sanity.io/manage](https://www.sanity.io/manage) → API → Webhooks → *Create
   webhook*:

   | Campo | Valor |
   | --- | --- |
   | URL | `https://www.pantufla.design/api/revalidate` |
   | Dataset | `production` |
   | Trigger on | Create, Update, Delete |
   | Filter | `!(_id in path("drafts.**")) && _type in ["project","testimonial","siteCopy","siteSections"]` |
   | Projection | dejalo vacío |
   | HTTP method | `POST` |
   | Secret | el mismo del paso 1 |

`siteSections` es el documento de los interruptores y fondos de la home. Si el
webhook se armó antes con un filtro que no lo incluía, hay que sumarlo: sin él,
prender, apagar o cambiar de fondo una sección no se ve hasta que el caché se
venza solo. Un filtro viejo que todavía nombre `post` no rompe nada: ese tipo
ya no existe y el endpoint lo ignora.

La exclusión de borradores no es un detalle: Sanity guarda el draft mientras se
escribe, así que sin ella el webhook dispara con cada tecla que se toca en el
Studio. Con ella dispara solo al publicar.

La proyección va vacía a propósito. Así Sanity manda el documento entero y el
endpoint lee el `_type` para saber qué etiqueta vencer. Si llegara sin `_type`,
el endpoint vence todas las etiquetas por las dudas.

Para comprobar que quedó: `GET https://www.pantufla.design/api/revalidate`
contesta `{"listo":true,...}` cuando la variable está cargada. Si dice
`"listo":false`, falta el secreto en Vercel o falta redesplegar.

El secreto no es opcional. El endpoint es público —tiene que serlo, lo llama
Sanity desde afuera— así que sin firma cualquiera puede tirarle el caché al
sitio todo el día.

### Las reservas de reunión

`/reunion` embebe un calendario de Cal.com. El motor es de ellos a propósito: lo
difícil de una reserva no es la pantalla sino saber cuándo está ocupada la
persona que atiende, impedir que dos visitantes tomen el mismo turno, traducir
la hora a la zona de cada uno —hay clientes en cinco países— y mandar
recordatorios, el link de video y los avisos de cancelación.

Lo arma **quien atiende las reuniones**, con su cuenta y su calendario. Así no
hay que pedirle nada a nadie para reprogramar:

1. Crear la cuenta en [cal.com](https://cal.com) (el plan gratis alcanza) y
   conectar ahí su Google Calendar. Desde ese momento no se puede reservar
   encima de algo que ya tenga.
2. Crear un tipo de evento de **15 minutos** (el sitio dice «15 minutos» en el
   botón de las preguntas frecuentes y en `/reunion`; si cambia la duración,
   hay que cambiar esos textos en el Studio).
3. En **Limits & buffers** de ese evento, en *booking frequency*, poner `1` y
   elegir `day`. Eso es lo que hace que entre una sola reunión por día: cuando
   alguien reserva, el día queda cerrado para el resto.
4. Copiar el identificador del link: de
   `https://cal.com/lautaro-lacaze-wi4kmc/15min` va
   `lautaro-lacaze-wi4kmc/15min` (si se pega el link entero, el sitio le saca
   el dominio solo, en `lib/calendario.ts`). Se carga en Vercel como
   `NEXT_PUBLIC_CAL_LINK`, de tipo **Config** y no Secret: lleva el prefijo
   `NEXT_PUBLIC_` porque el calendario se arma en el navegador, y Vercel no
   deja guardar como secreta una variable que el navegador va a ver. No hay
   nada que esconder: es el mismo link que abre cualquiera para reservar.
5. En **Settings → Developer → Webhooks**, crear uno que apunte a
   `https://www.pantufla.design/api/reunion`, con los eventos *Booking created*,
   *rescheduled* y *cancelled*, y un secreto generado con
   `openssl rand -base64 32`. Ese mismo string va en Vercel como
   `CAL_WEBHOOK_SECRET`.

Para comprobar que quedó: `GET https://www.pantufla.design/api/reunion` contesta
`{"listo":true,"escribe":true,...}` cuando están cargados `CAL_WEBHOOK_SECRET`
y `SANITY_API_WRITE_TOKEN`.

Hasta que exista la cuenta, `/reunion` no se rompe: muestra una tarjeta con el
mail para agendar a mano. Y los botones que prometen agendar (el de las
preguntas frecuentes) ofrecen el mail en su lugar, para no llevar a nadie a un
calendario que no está (`lib/calendario.ts`). Como la variable es
`NEXT_PUBLIC_`, el sitio se entera recién en el próximo deploy. Y las reuniones que entran quedan en el Studio como
*Reunión agendada*, al lado de los briefs, de solo lectura —el calendario de
verdad es el de Cal, y editar acá una fecha solo lograría que los dos digan
cosas distintas.

**El brief y la reunión no se cruzan**: quien completa el formulario no ve una
reunión en ningún lado. La reserva se ofrece desde el cierre de las preguntas
frecuentes, que es donde alguien llega con una duda sin resolver.

---

## Dónde se edita cada cosa

Casi todo se edita en `/studio`, sin tocar código:

| Qué | Dónde |
| --- | --- |
| Qué secciones de la home se muestran y si van en claro u oscuro | Studio → *Secciones de la home* |
| Todo el texto del sitio: titulares, planes y precios, proceso, preguntas frecuentes, formulario | Studio → *Textos del sitio (ES)* y *(EN)* |
| Proyectos y testimonios | Studio → *Proyectos*, *Testimonios* |
| Las pantallas que corren abajo del hero | Studio → *Proyectos* → cada proyecto, en *Pantallas para la portada* |
| Briefs, reuniones y lugares reservados que llegan | Studio → *Briefs recibidos*, *Reuniones agendadas*, *Lugares reservados* (solo lectura) |
| Texto de respaldo, si el Studio no tiene nada cargado | `content/copy.es.ts` y `content/copy.en.ts` |
| Colores, íconos y números de cada bloque, lugar de cada celda del bento | `content/site.ts` |
| Contacto, países del globo, marcas de la prueba social, riel de herramientas | `content/site.ts` |
| Logos de los clientes de la tira | `public/logos/clientes` + `content/site.ts` → `socialProof` |
| Orden de las secciones de la home | `content/sections.ts` |
| Colores, tipografía y escala | `app/globals.css` → `@theme` |

Los textos son un documento por idioma, y lo que no se carga cae al texto del
repositorio, así que se puede pasar al Studio de a una sección. El texto y el
diseño se cruzan por id: el color de un plan o el número de una etapa viven en
`content/site.ts`, no en el Studio, y **cambiar un id en el Studio deja ese
bloque sin su diseño**.

`/notas` y `/contacto` se sacaron y redirigen a la home: a la portada y al
formulario (`next.config.ts`). Las notas también salieron del Studio. El
listado `/proyectos` estuvo redirigido a la sección de la home y volvió a ser
una página, con todos los proyectos; las fichas de cada uno siguen en
`/proyectos/<slug>`.

Para sumar el logo de un cliente: el archivo va en `public/logos/clientes`, en
negro sobre transparente (SVG con `viewBox`, o PNG), y en `content/site.ts` →
`socialProof.brands` se le carga la ruta y la proporción (ancho / alto). La tira
lo pinta con la tinta del tema, así que el color del archivo no importa: solo
cuenta la forma. Un cliente sin logo sale con el nombre escrito. Cada logo
alarga el riel, y con el mismo tiempo de vuelta lo acelera: hay que subir
`DURACION` en `components/sections/social-proof.tsx` en la misma proporción
(la cuenta está ahí). Si su trabajo se muestra, el cliente también va como
proyecto, en el Studio y en `content/fallback-content.ts`; si no (como Numia),
va solo en la tira.

Para sumar un campo de texto nuevo hay que tocar tres lugares: el tipo en
`content/copy.ts`, los dos archivos de idioma y el esquema
`sanity/schemas/site-copy.ts`. El tipo está escrito a mano a propósito: si a un
idioma le falta el campo, el build no pasa.

---

## Idiomas

Español en la raíz, inglés en `/en`. Las rutas no se traducen: `/reunion` y
`/en/reunion`. La primera visita elige idioma por el país (el encabezado de
Vercel) y después por el idioma del navegador; si la persona ya eligió con el
selector del header, gana su elección, que queda en una cookie. Los buscadores
y las vistas previas de links no pasan por esa detección: cada URL les muestra su
idioma, sin redirigir (Google rastrea desde Estados Unidos y, si no, nunca vería
las páginas en español). Todo eso pasa en `middleware.ts`.

Los enlaces del texto se escriben sin el idioma adelante (`/#planes`,
`/reunion`) y el sitio les agrega el prefijo que corresponda.

---

## Cómo está armada la home

El orden sale de `content/sections.ts`, que es la única lista: de ahí salen
también los interruptores del Studio. Cada sección se puede apagar, y los
enlaces que apuntaban a ella se reescriben solos (los del menú desaparecen; el
resto pasa a llevar a `/reunion`, que no se puede apagar). Lo que el Studio no
dice sale como viene de fábrica: prendida, salvo el stack.

| # | Sección | Ancla | De fábrica |
| --- | --- | --- | --- |
| 1 | Portada | — | claro |
| 2 | Prueba social | — | claro |
| 3 | Cómo lo resolvemos | `#metodo` | claro |
| 4 | Proyectos | `#proyectos` | oscuro |
| 5 | Capacidades (bento) | `#capacidades` | claro |
| 6 | Pase (banner) | `#lugar` | claro |
| 7 | Proceso | `#proceso` | oscuro |
| 8 | Con qué está hecho | `#stack` | claro, **apagada** |
| 9 | Planes | `#planes` | claro |
| 10 | Testimonios | `#testimonios` | claro |
| 11 | Dónde trabajamos (globo) | `#clientes` | claro |
| 12 | Preguntas frecuentes | `#faq` | claro |
| 13 | Formulario | `#brief` | oscuro |

El recorrido sigue **promesa → prueba → qué incluye → cómo → precio →
objeciones → contacto**:

- **Portada.** Todo el texto alineado a la izquierda: una pastilla dice que el
  estudio toma proyectos, el titular dice para qué sirve el sitio —«Sitios que
  convierten *visitantes* en *clientes*»—, la bajada lo cuenta, y hay un CTA
  principal al formulario y uno secundario a los planes. A la derecha, el pase
  de Pantufla, que es un enlace: tocarlo baja al banner, donde se reserva;
  abajo, de punta a punta, la galería de pantallas (ver *El hero*).
  Las dos columnas son mitades iguales dentro del mismo ancho que el resto de
  la página, y el pase va centrado en la suya, así el texto
  y el pase quedan a la misma distancia del centro. Antes el hero tenía un
  ancho propio más grande, el pase pegado al borde derecho, un hueco grande al
  medio, el titular a 68px y botones grandes: se veía grande y descentrado. La
  referencia fue la portada de Resend.
- **Prueba social.** Solo los logos de los clientes, corriendo de punta a punta
  de la pantalla.
- **Cómo lo resolvemos.** Tres pilares: alcance cerrado, ritmo corto con fechas
  visibles, y el sitio entregado andando.
- **Proyectos.** Justo después de la promesa: el trabajo se ve antes que el
  precio. Iba después de los planes, a la mitad de la página en el teléfono, y
  quien quería ver qué hace el estudio tenía que pasar por todo lo demás.
  Son cuatro tarjetas con mockup, en una grilla de dos por dos: los proyectos
  marcados como *Destacado en la home* (hoy Kine, Daily, Tierras Argentinas y
  2MG), en el orden del campo *Orden*. El resto está en `/proyectos`, al que
  lleva «Ver todos los proyectos» (ver *Los proyectos*). El mismo orden manda
  en la galería del hero.
- **Capacidades.** Un bento de cuatro celdas, cada una con su viñeta animada:
  velocidad de carga, que te encuentren (también en asistentes de IA), el
  sitio en el teléfono, y las consultas que llegan. Las promesas son las que
  se pueden sostener: el objetivo de carga es de menos de dos segundos en un
  teléfono, y la viñeta de la IA muestra lo que puede contestar, no lo que
  contesta seguro. Sale de una referencia de producto: cuatro tarjetas
  grandes y suaves, dos por dos, cada una con una viñeta de interfaz arriba
  —un chat con su campo para escribir, una lista con la fila hecha, un
  documento con su barra de carga y un teléfono, una línea de tiempo con la
  consulta nueva— y abajo el titular grande y una bajada corta. Las piezas son
  blancas con borde finito sobre el gris de la tarjeta, sin colores: las
  tildes y la barra van en la tinta, y la cifra de velocidad y la respuesta
  del chat en la itálica del hero. Antes fue un damero en
  cuatro colores y después en gris con el texto arriba, y las dos veces quedó
  feo.
- **Pase (banner).** A la mitad de la home, después de ver el trabajo y lo
  que incluye: el camino corto, nombre y mail para guardarse un lugar en el
  próximo cupo. La sección está armada alrededor de un hueco: una tarjeta en
  la tinta del tema con un recorte de la forma exacta del pase acostado —las
  esquinas y dos pestañas que entran en las muescas del talón— y una línea de
  corte punteada en blanco. El pase que vino volando desde la portada se
  acuesta y calza ahí, como la pieza que faltaba. Ahí no responde al mouse:
  inclinado, se despegaba del borde del hueco.
  Se lee en tres pasos: el título dice qué es («Tomamos pocos proyectos por
  mes»), la bajada qué hacer, y abajo del hueco el formulario, que desde sm es
  una sola barra blanca con el nombre, el mail y el botón adentro, más una
  línea de letra chica. Las etiquetas de los campos quedan para el lector de
  pantalla: el ejemplo de adentro ya dice qué va. Tuvo una etiqueta arriba
  del título, una bajada de tres renglones, tres tildes debajo del formulario
  y cupones vecinos a los costados del hueco; era demasiado y no se entendía.
  Va centrada y apilada, con el aire justo para que no sea altísima: probó
  dos columnas y se volvió, porque el hueco al medio es lo que hace que el
  pase se lea como la pieza que faltaba. Antes era la última sección y el pase
  acompañaba la página entera, que era demasiado.
- **Proceso.** Cuatro etapas, cada una con fecha: quince días hábiles un
  Sitio, una semana una Landing. El riel que las une lleva
  los cuatro colores de la marca y llega a cada número con su color ya hecho.
- **Planes.** Dos opciones y nada más: una página sola o el sitio completo, más
  un bloque para quien ya tiene un sitio en Webflow o Framer (administrarlo,
  mejorarlo, rediseñarlo o un cambio puntual).
- **Con qué está hecho.** Sale apagada: cortaba el paso del proceso a los
  planes. Lo que decía —herramientas conocidas, que no te atan a nadie— es
  ahora una pregunta frecuente. Se prende desde el Studio si se la quiere de
  vuelta.
- **Globo y testimonios.** Con los dos prendidos van en una sola sección y
  sin títulos a la vista: arriba el globo con «WORLDWIDE» detrás, abajo los
  cuatro testimonios en una fila de celdas cuadradas, pegadas y sin borde,
  separadas por una línea fina, como la referencia de la grilla de etapas.
  Cada celda lleva el número arriba a la izquierda, la empresa arriba a la
  derecha y la cita con el nombre y el cargo; una va en la tinta, con el
  número dado vuelta, y sigue al mouse. En tablet son dos por dos y en el
  teléfono una debajo de otra. Los títulos quedan escondidos para el lector de
  pantalla y el índice. Con uno solo prendido, ese sale solo.

### El globo

«Dónde trabajamos» es un globo blanco y negro que gira despacio, de oeste a
este, una vuelta cada setenta segundos, delante de una palabra gigante:
«WORLDWIDE», en el Black (900) de la Schibsted, en mayúsculas y en la tinta.
La palabra se edita en el Studio (*Mapa de clientes* → *Palabra de atrás del
globo*) y mide el ancho de la ventana; en el teléfono va arriba del globo,
que le pisa el pie de las letras, porque detrás la tapaba entera.

Los países donde trabajamos van en tinta, con una marca con el nombre. No hay
lista aparte a la vista (para el lector de pantalla, sí). Reemplaza al mapa
plano con líneas desde Buenos Aires.

- **El acabado** es holográfico, como el foil del pase: un brillo nacarado en
  la misma paleta (champagne, perla, verde agua y rosa apagados) que corre por
  el globo mientras gira y se carga hacia el borde, y un grano fino, como el de
  una foto.

- **Cómo está hecho.** Three.js, el mismo paquete del pase, que se baja recién
  cuando la sección se acerca (`components/sections/globo-3d.ts`). La esfera
  no lleva una foto de la Tierra: lleva un dibujo de la tierra y de los
  países sacado de Natural Earth (`content/globo-datos.ts`, generado por
  `scripts/generar-globo.mjs`), y los colores salen del tema, así que con la
  sección en oscuro se da vuelta sola. Las marcas con los nombres son HTML.
- **Se puede frenar**, como los rieles: con el mouse encima, con un toque, con
  el foco adentro o con el botón del teclado. Fuera de la pantalla no dibuja.
- **Sin 3D** (sin WebGL, con placa de video por software o con menos
  movimiento pedido) queda una imagen quieta del mismo globo
  (`public/globo/globo.webp`), con las marcas encima en el mismo lugar y el
  grano puesto por CSS (horneado, el ruido triplicaba el peso). Esa imagen se
  saca del 3D con `scripts/generar-globo-imagen.mjs` y hay que volver a
  sacarla si cambian los países o el dibujo. `?globo3d` fuerza el 3D para
  probarlo en un navegador sin placa (`?globo3d=limpio`, sin grano, es lo que
  usa el script).
- **La fuente Black** es un recorte de 3 KB con solo las mayúsculas
  (`public/fonts/schibsted-grotesk-black-mayusculas-v1.woff2`, de
  `@fontsource/schibsted-grotesk`, OFL): el archivo de siempre llega hasta 600
  y el 900 entero eran 24 KB más para todo el sitio. Solo se baja cuando la
  palabra aparece.
- **Preguntas frecuentes.** Objeciones de compra: páginas de más, propiedad del
  sitio, editar sin programar, con qué herramientas, costo mensual, uso de IA,
  formas de pago. Al pie ofrece agendar una reunión, o el mail mientras el
  calendario no esté conectado.
- **Formulario.** El brief: plan, presupuesto y plazo van en desplegables
  propios del sitio, no en el `<select>` del sistema.

El toggle de precios no es mensual/anual, porque el estudio no vende una
suscripción. Ofrece **pago único con 15% de descuento** contra **dos pagos de
50%**: la misma mecánica de descuento, aplicada a algo real, y alineada con
cobrar rápido.

### El hero

En escritorio son dos columnas y una franja. A la izquierda, todo el texto
alineado: la pastilla de «Disponibles», el titular, la bajada y los dos
botones. A la derecha, el pase de Pantufla, que lleva al banner donde se
reserva (tuvo un formulario con el mail debajo; era el mismo pedido dos veces
en la página). Abajo, de punta a punta, la galería de pantallas corriendo.
Abajo de 1024 el pase pasa debajo de los botones, y en el teléfono todo corre
seguido.

- **El titular** lleva dos palabras en la itálica de Newsreader, en el mismo
  negro que el resto. Es la única otra letra del sitio y solo se baja en la
  home. En el Studio son los tramos con estilo «Itálica». A 1440 entra en dos
  líneas; más angosto, en tres.
- **El pase** es una pieza 3D (Three.js) con física de papel: una malla de
  puntos unidos por resortes que se dobla, flamea y se asienta como un papel
  blando. Es sobrio a propósito: papel marfil, una sola tinta, la itálica de
  Newsreader mezclada con Schibsted («*Pase* prioritario», «*Tu lugar*»), un
  sello negro como un foil estampado y el dorso negro. El único color es el
  borde, un foil champagne y perla que rodea toda la silueta (también las
  muescas y el troquel) y que en el 3D brilla como metal y cambia apenas de
  tono cuando el papel se dobla. Antes iba en los cuatro colores de la marca
  y era demasiado. En la portada, con
  el mouse encima se hunde donde apoya y se inclina hacia el puntero.
- **El vuelo.** Cuando el pase de la portada llega arriba de la pantalla, se
  despega curvándose, se achica (a un tercio, para que moleste poco mientras
  se lee) y acompaña el scroll cruzando la página de un costado al otro en el
  tercio de abajo de la ventana, una ida y vuelta cada cuatro pantallas, dando
  vueltas (a mitad de cada cruce se ve el dorso). Al llegar al banner de la mitad de la home
  baja, se acuesta un cuarto de vuelta, crece y calza exactamente en el hueco
  de ahí (llega cuando el hueco está en el medio de la pantalla). Lo mueven el
  scroll y el puntero: cuando el papel se asienta, deja de dibujar. Si alguien
  está escribiendo en el formulario del banner, el pase se queda ahí. Tocar el
  pase de la portada baja al banner, y el pase hace el viaje con el scroll.
  En el teléfono no vuela: se queda en el lugar que se ve, también acostado en
  el banner. Con movimiento reducido, sin placa de video o sin JavaScript se
  ve la imagen del pase, quieta, en los dos lugares.
- **El formulario** va debajo del pase, en el banner, no adentro: un campo
  tiene que quedarse quieto para que alguien escriba. Pide nombre y mail y va
  a `/api/lugar`, que lo guarda en el Studio como *Lugar reservado* (una sola
  fila por mail; si alguien dejó primero el mail solo, cuando había un
  formulario en la portada, y vuelve con su nombre, el nombre se suma) y
  avisa por mail con las mismas variables de Resend que el brief. Al
  reservar, el pase imprime en su cara el nombre (y el mail abajo, en chico)
  con la etiqueta «Reservado», y el navegador lo recuerda: quien vuelve ve su
  pase con sus datos, y un enlace para usar otro mail. Los textos del
  formulario están en el Studio, en *Pase* (ahí también el nombre del enlace
  del pase de la portada, para el lector de pantalla); los del banner, en
  *Banner del pase*.
- **El dibujo del pase** son imágenes en `public/pase` (la cara en español y
  en inglés, el dorso y un mapa de qué es holográfico, satinado o mate). Se
  generan con `node scripts/generar-pase.mjs`, que las dibuja en HTML: para
  cambiar un texto o un color del pase se edita ese archivo y se vuelve a
  correr.
- **La galería** son capturas de los proyectos, de escritorio y de teléfono,
  en columnas tipo masonry: dos de escritorio apiladas, un teléfono de alto
  entero, o una de escritorio grande cuando queda sola antes de un teléfono.
  Corre como los otros rieles y se frena igual. **Se arma sola**: no tiene
  lista propia, son las pantallas que cada proyecto carga en el Studio, en
  *Pantallas para la portada*, una atrás de la otra en el orden de los
  proyectos. Para sumar un proyecto a la galería alcanza con cargarle
  pantallas; para sacarlo, con borrárselas.
  - Cada pantalla es una captura suelta, **sin marco**: el navegador y el
    teléfono los dibuja la galería. Dice si es de escritorio o de teléfono y
    qué se ve (para quien no ve la imagen).
  - El orden dentro del proyecto arma sus columnas: dos de escritorio
    seguidas van apiladas, y una de escritorio sola antes de un teléfono va
    grande. Las columnas no mezclan proyectos.
  - Cada columna toma el ancho que piden sus capturas, así se ven enteras:
    una captura de escritorio de proporción común (16:10, 16:9) entra justa;
    una muy rara se recorta. Los teléfonos miden todos lo mismo; una captura
    de teléfono más corta que la pantalla se recorta abajo.
  - Si el proyecto tiene el caso escrito, sus pantallas llevan al caso.
  - Si ningún proyecto tiene pantallas, o Sanity no contesta, salen las del
    respaldo (`content/hero-galeria.ts`, archivos en `public/hero/pantallas`),
    que son las mismas capturas de Kine, Daily, Tierras Argentinas y 2MG.
    Las tres primeras salen de sus HTML de Claude Design, recortadas pantalla
    por pantalla; las de 2MG, de sus mockups en `assets/proyectos/2mg`.
- **La barra de arriba** es una píldora flotante con desenfoque, que se va al
  bajar y vuelve al subir (ver *La barra*).

### Los proyectos

En la home son los cuatro destacados (*Destacado en la home* en el Studio; si
no hay ninguno marcado, los cuatro primeros) en una grilla de dos por dos, una
columna en el teléfono. En `/proyectos` están todos, con la misma tarjeta y en
el mismo orden, destacados incluidos.

Cada tarjeta es un mockup mínimo sobre un plano gris: una ventana de navegador
con el dominio del sitio en la barra y, montado abajo a la derecha, un
teléfono. Las capturas salen de las mismas *Pantallas para la portada* que
corren en el hero: de las de escritorio entra la que mejor llena una ventana
16:10, y del teléfono la primera. Un proyecto sin pantallas muestra la ventana
con su nombre adentro; la portada no se usa ahí, porque es una imagen
compuesta (un mockup con sus propios marcos, o una ilustración) y adentro de
una ventana parecería un sitio roto. Para que la tarjeta tenga capturas
alcanza con cargarle pantallas, y eso también lo suma a la galería del hero.

Los botones viven adentro del mockup, y abajo quedan solo el nombre, el rubro
y la bajada. Al pasar el mouse el mockup se desenfoca y en el medio aparecen
«Ver sitio», una pastilla blanca con letra negra, y al lado, si el caso está
escrito, «Leer el caso», negra con letra blanca. El clic en el resto del
plano lleva al sitio. Con el teclado, el foco en un botón hace lo mismo que
el mouse; en el teléfono, donde no hay mouse, los botones están siempre,
abajo del plano y sin desenfoque.

Cada proyecto tiene además su ficha en `/proyectos/<slug>`. Lo que muestra sale
del Studio: si el proyecto no tiene portada ni caso escrito («Caso completo»),
la ficha es una cabecera con el nombre, la bajada, el enlace y los datos; la
portada y el caso aparecen solos cuando se cargan.

El caso escrito es lo que decide si la ficha existe para afuera:

- **Con caso**, la tarjeta suma el botón «Leer el caso», la ficha va al
  sitemap y se indexa.
- **Sin caso**, la ficha se puede abrir pero va con `noindex`, fuera del
  sitemap, y ninguna tarjeta la enlaza (llevan al sitio publicado). Es una
  página flaca y no tiene sentido mandarla a Google.

Hoy tienen caso **Tierras Argentinas** y **2MG**. Están escritos a
partir de lo que muestra cada sitio, sin métricas ni plazos porque no los
tenemos: conviene revisarlos y, si hay datos reales (tiempo de entrega,
resultados), sumarlos en el Studio. El respaldo local de esos textos está en
`content/casos.ts`. Para escribir otro alcanza con llenar «Caso completo» en el
Studio: el enlace, el sitemap y el índice se acomodan solos.

Las imágenes de una ficha salen de tres campos del proyecto en el Studio:

| Campo | Dónde se ve |
| --- | --- |
| Imagen de portada | Arriba de la ficha, entera |
| Galería | Abajo del caso, enteras, a todo el ancho y en orden |
| Imagen para redes | Al compartir el link (WhatsApp, LinkedIn, X), recortada a 1200×630; si falta, se usa la portada |

La portada y la galería se muestran con su proporción, sin recorte: sirven
mockups de 16:10 (como los de Tierras Argentinas) o de 4:3 (como los de 2MG).
Conviene subirlas al doble del tamaño del mockup. Los originales de lo que ya
está subido quedan en `assets/proyectos/`, con una tabla de qué archivo va en
qué campo. Tierras Argentinas y 2MG tienen las tres: portada, tres imágenes de
galería y una para redes.

---

## Fondo y tema

Las secciones no pintan fondo. Cada una declara si quiere la página clara u
oscura, y `components/theme-scroll.tsx` cambia el tema de toda la página cuando
una sección oscura ocupa la franja central de la pantalla. Los colores son
variables registradas con `@property` en `app/globals.css`, así que el cambio
es una transición (600 ms) y no un corte: el fondo es uno solo y va cambiando
con el scroll.

Por eso los componentes usan siempre los tokens y no colores escritos a mano:
lo que no sale de un token no se da vuelta con el tema.

El fondo funde en 600 ms, pero la tinta no: el texto salta de oscuro a claro
de una vez, a los 300 ms, que es el punto del fundido en el que las dos tintas
se leen igual (4 a uno). Un fundido de la tinta cruzándose con el del fondo
pasaba por un cuadro de gris sobre gris. Lo escrito sobre la tinta —el texto de
los botones negros— usa su propio token, `on-ink` (`text-on-ink`), que salta
en el mismo cuadro: botón y texto se dan vuelta juntos. Mientras dura el
cambio, los elementos no le suman su propia transición de color (el fade de
hover de un botón, por ejemplo), así nada queda atrasado.

**Regla:** algo con fondo `bg-ink` lleva el texto en `text-on-ink`, no en
`text-paper` ni en blanco.

El cambio también le llega al navegador: la barra del teléfono (`theme-color`)
toma el color del fondo, y en oscuro las barras de scroll y los controles
nativos pasan a su versión oscura (`color-scheme`).

---

## La barra

`components/site-header.tsx`. Una píldora que flota arriba, despegada del
borde, con el fondo de la página a medias y desenfoque detrás: la marca, el
menú en el medio, el idioma y el botón. Tiene un solo tamaño (no se compacta al
bajar) y no marca la sección en curso.

- **Se va al bajar y vuelve solo al subir.** Hace falta recorrer 24px seguidos
  para el mismo lado, así el rebote del trackpad no la hace entrar y salir.
  En los primeros 80px de la página no se va nunca.
- **El teclado la trae.** Con el foco del teclado adentro se queda a la vista
  (una barra escondida con el foco en un enlace es un anillo de foco en ningún
  lado). El clic con el mouse no cuenta.
- **Sigue los temas** sola: el fondo es el token del papel al 75%, así que en
  las secciones oscuras se oscurece con la página.
- **El menú del teléfono** frena el scroll de verdad (Lenis también, no solo el
  body), deja la página de atrás `inert`, se cierra con Escape devolviendo el
  foco al botón, y se cierra solo si la ventana pasa a escritorio.
- **La marca**, estando en la home, sube arriba de todo con el scroll suave.

---

## Movimiento

El sitio usa GSAP con ScrollTrigger, con Lenis para el scroll suave. Las
primitivas están en `components/motion/` y se combinan en las secciones:

| Componente | Qué hace |
| --- | --- |
| `Reveal` | Aparición al entrar en pantalla. Con `stagger` escalona los hijos directos. |
| `SplitHeading` | Titular que sube palabra por palabra detrás de una máscara. |
| `Counter` | Cifra que rueda hasta su valor. Se usa en los precios al cambiar el toggle. |
| `Magnetic` | El botón sigue apenas al cursor. Solo con puntero fino. |

Lenis también resuelve los clics a anclas de la misma página (el menú, los
CTA), con el margen justo para que el título no quede debajo del header.

**Las reglas que sostienen todo esto:**

1. Nada se oculta desde CSS a secas. Un script inline agrega `.motion-ready` a
   `<html>` antes del primer pintado, y recién entonces el CSS oculta lo que se
   va a animar. Si el JS no corre, el sitio queda completo y visible.
2. El estado inicial de cada entrada vive en el CSS, y las animaciones van con
   `gsap.to(..., { immediateRender: false })`. Nada de `from` / `fromTo` en
   las entradas: escriben estilos en el momento de crearse, y repartido en
   decenas de componentes eso era una cadena de reflows forzados durante la
   hidratación.
3. Cada animación pasa por `gsap.matchMedia()`. Con `prefers-reduced-motion:
   reduce` no se anima nada y todo aparece en su lugar final.
4. La entrada del hero es CSS puro, para que el titular (el LCP) no espere al
   JavaScript.
5. Lo que se mueve solo se puede frenar. Los rieles de herramientas y de
   clientes paran al pasar el mouse, con el foco adentro, con un toque en el
   teléfono y con un botón que aparece al llegar con el teclado
   (`components/ui/riel-pausable.tsx`). El globo y la galería del hero se
   frenan igual. Los testimonios ya no rotan: están los cuatro a la vista. El
   pase que vuela no se mueve solo: lo mueve el scroll.

---

## Decisiones de diseño

- **Una familia tipográfica** (Schibsted Grotesk), trabajada por peso,
  tamaño y color. Va alojada en el propio sitio, recortada a los pesos 400–600
  y al alfabeto latino (40 KB), precargada y con un respaldo ajustado a sus
  medidas para que el texto no salte cuando llega la fuente. Si se cambia el
  archivo, hay que subir el `-vN` del nombre: se sirve con caché inmutable.
  Y una itálica de acento, Newsreader, para las palabras en itálica del
  titular del hero y para el pase (va dibujada en sus texturas, y el nombre
  que imprime al reservar también va en ella): fijada en un peso y un tamaño
  óptico y recortada al latino (19 KB).
- **Mucho aire y letra contenida.** El contenido vive en un ancho de 72rem
  con márgenes que crecen con la pantalla (192px de cada lado a 1440), las
  secciones llevan 144–176px arriba y abajo en escritorio, y los titulares
  son un escalón más chicos que antes (42px el de sección y 52px el del hero
  a 1440, con los botones del hero en el tamaño mediano). El espaciado de cada sección se elige con un ritmo con nombre en
  `components/ui/section.tsx` (normal, compacto para planes y preguntas,
  amplio para el proceso), no con clases sueltas.
- **Fondo blanco** en claro y casi negro en oscuro, con un grano muy leve
  para que no quede plano. Era bruma (`#eaedf8`), un lila que teñía toda la
  página. Lo que antes se separaba del fondo por ser blanco ahora lleva su
  filete (tarjetas, campos) o un gris apenas más oscuro
  (las preguntas frecuentes, el tablero de capacidades, las etiquetas).
- **Cuatro colores de marca** en pastel: aqua, rosa, verde y miel. Hoy casi no
  se usan: los acentos (tildes, botones, números, el botón que abre un panel)
  van en la tinta, porque la marca es blanco y negro y los toques de color
  —el champagne del pase, el verde de un botón, una tilde por plan— se leían
  a plantilla. El único color que queda en la interfaz es el de los mensajes
  de error.
- **La etiqueta de sección** es una pastilla con ícono y el texto en mayúsculas,
  en gris neutro. Suelto sobre el fondo, ese tratamiento se lee a plantilla;
  adentro de una pastilla se lee como un rótulo de sistema. El color lo ponen
  el titular y el contenido.
- Sin degradados en texto ni emoji como íconos, y el vidrio esmerilado solo
  en la barra de arriba y en la pastilla del hero. Los íconos son SVG propios
  en `components/ui/icons.tsx`, y la marca (el iso de la pantufla) está en
  `components/ui/brand.tsx`, copiada tal cual del kit.

### Cómo se usan los cuatro colores

Cada color viene en tres pasos y cada paso tiene un uso fijo. La regla que los
mantiene legibles: **el pastel base nunca lleva texto chico sobre fondo claro**.
Para eso está la variante profunda.

| Paso | Para qué |
| --- | --- |
| `-soft` | fondo de pastillas y washes |
| base | rellenos, formas, ilustración, y texto sobre fondo oscuro |
| `-deep` | texto e íconos chicos sobre fondo claro |

El color es taxonomía, no decoración: cada etapa del proceso y cada plan
tiene su color asignado en `content/site.ts` y se resuelve con
los mapas de `lib/tones.ts`. Tailwind no arma nombres de clase en runtime, así
que las variantes están escritas enteras ahí.

---

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run start        # servir el build
npm run typecheck    # tsc --noEmit
npx prettier --write <archivos>   # formato
```

No hay tests ni linter configurado: `npm run lint` llama a `next lint`, que
Next 16 ya no trae. Los cambios se verifican con `npm run typecheck`,
`npm run build` y mirando la página.
