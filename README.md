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
2. **Los países del mapa.** `content/site.ts` → `clients`. El pie de la sección
   cuenta esa lista, así que el número siempre coincide con lo que se muestra.
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
los briefs que llegan del formulario y las reuniones que llegan de Cal.com:

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
la hora a la zona de cada uno —hay clientes en siete países— y mandar
recordatorios, el link de video y los avisos de cancelación.

Lo arma **quien atiende las reuniones**, con su cuenta y su calendario. Así no
hay que pedirle nada a nadie para reprogramar:

1. Crear la cuenta en [cal.com](https://cal.com) (el plan gratis alcanza) y
   conectar ahí su Google Calendar. Desde ese momento no se puede reservar
   encima de algo que ya tenga.
2. Crear un tipo de evento de **20 minutos**.
3. En **Limits & buffers** de ese evento, en *booking frequency*, poner `1` y
   elegir `day`. Eso es lo que hace que entre una sola reunión por día: cuando
   alguien reserva, el día queda cerrado para el resto.
4. Copiar el identificador del link. De `https://cal.com/pantufla/20min` va
   `pantufla/20min`, y se carga en Vercel como `NEXT_PUBLIC_CAL_LINK`.
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
| Briefs y reuniones que llegan | Studio → *Briefs recibidos*, *Reuniones agendadas* (solo lectura) |
| Texto de respaldo, si el Studio no tiene nada cargado | `content/copy.es.ts` y `content/copy.en.ts` |
| Colores, íconos y números de cada bloque, celdas del bento | `content/site.ts` |
| Contacto, clientes del mapa, marcas de la prueba social, riel de herramientas | `content/site.ts` |
| Logos de los clientes de la tira | `public/logos/clientes` + `content/site.ts` → `socialProof` |
| Orden de las secciones de la home | `content/sections.ts` |
| Colores, tipografía y escala | `app/globals.css` → `@theme` |

Los textos son un documento por idioma, y lo que no se carga cae al texto del
repositorio, así que se puede pasar al Studio de a una sección. El texto y el
diseño se cruzan por id: el color de un plan o el número de una etapa viven en
`content/site.ts`, no en el Studio, y **cambiar un id en el Studio deja ese
bloque sin su diseño**.

`/notas`, `/contacto` y el listado `/proyectos` se sacaron y redirigen a la
home: a la portada, al formulario y a la sección de proyectos
(`next.config.ts`). Las notas también salieron del Studio. Las fichas de cada
proyecto, en `/proyectos/<slug>`, siguen publicadas.

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
selector del header, gana su elección, que queda en una cookie. Todo eso pasa en
`middleware.ts`.

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
| 6 | Proceso | `#proceso` | oscuro |
| 7 | Con qué está hecho | `#stack` | claro, **apagada** |
| 8 | Planes | `#planes` | claro |
| 9 | Testimonios | `#testimonios` | claro |
| 10 | Mapa de clientes | `#clientes` | claro |
| 11 | Preguntas frecuentes | `#faq` | claro |
| 12 | Formulario | `#brief` | oscuro |

El recorrido sigue **promesa → prueba → qué incluye → cómo → precio →
objeciones → contacto**:

- **Portada.** El titular dice lo que diferencia al estudio —sitios con precio
  cerrado y fecha de entrega—, la bajada dice para qué sirve el sitio, y hay un
  CTA principal al formulario, uno secundario a los planes y tres respaldos
  cortos (garantía de devolución, primera versión en 5 días, el sitio queda a
  tu nombre). Debajo del titular se arma el tablero de *Tu sitio, un mes
  después*, con visitas, conversión, velocidad y de dónde llegan.
- **Cómo lo resolvemos.** Tres pilares: alcance cerrado, ritmo corto con fechas
  visibles, y el sitio entregado andando.
- **Proyectos.** Justo después de la promesa: el trabajo se ve antes que el
  precio. Iba después de los planes, a la mitad de la página en el teléfono, y
  quien quería ver qué hace el estudio tenía que pasar por todo lo demás.
  Los que tienen el caso escrito suman «Leer el caso» (ver *Los proyectos*).
- **Capacidades.** Un bento de cuatro celdas, cada una con su viñeta animada:
  velocidad de carga, que te encuentren (también en asistentes de IA), el
  sitio en el teléfono, y las consultas que llegan. Las promesas son las que
  se pueden sostener: el objetivo de carga es de menos de dos segundos en un
  teléfono, y la viñeta de la IA muestra lo que puede contestar, no lo que
  contesta seguro.
- **Proceso.** Cuatro etapas, cada una con fecha: quince días hábiles un
  Sitio, una semana una Landing. El riel que las une lleva
  los cuatro colores del bento en el mismo orden y llega a cada número con su
  color ya hecho.
- **Planes.** Dos opciones y nada más: una página sola o el sitio completo, más
  un bloque para quien ya tiene un sitio en Webflow o Framer (administrarlo,
  mejorarlo, rediseñarlo o un cambio puntual).
- **Con qué está hecho.** Sale apagada: cortaba el paso del proceso a los
  planes. Lo que decía —herramientas conocidas, que no te atan a nadie— es
  ahora una pregunta frecuente. Se prende desde el Studio si se la quiere de
  vuelta.
- **Testimonios y mapa.** Con los dos prendidos van en una sola sección: la
  cita arriba y, abajo, el mapa con su titular en chico. Eran dos bloques de
  prueba seguidos, cada uno con etiqueta y título, y se leían como dos veces lo
  mismo. Con uno solo prendido, ese sale solo, como antes.
- **Preguntas frecuentes.** Objeciones de compra: páginas de más, propiedad del
  sitio, editar sin programar, con qué herramientas, costo mensual, uso de IA,
  formas de pago. Al pie ofrece agendar una reunión, o el mail mientras el
  calendario no esté conectado.
- **Formulario.** Un solo cierre, con el brief: plan, presupuesto y plazo van en
  desplegables propios del sitio, no en el `<select>` del sistema.

El toggle de precios no es mensual/anual, porque el estudio no vende una
suscripción. Ofrece **pago único con 15% de descuento** contra **dos pagos de
50%**: la misma mecánica de descuento, aplicada a algo real, y alineada con
cobrar rápido.

### El vuelo del hero

A partir de **1440px** el hero mide tres pantallas y el escenario queda fijo:
los cuatro paneles arrancan dispersos alrededor del titular, con tres pastillas
flotando en los huecos, y al bajar **convergen en el tablero**. Las pastillas
hacen lo mismo: dejan de mecerse apenas empieza el scroll y se acomodan en fila
en la cabecera del tablero, entre «Tu sitio, un mes después» y «Últimos 30
días». Aterrizan achicadas para entrar en ese hueco, y cuánto se calcula en el
momento: si el texto cambia en el Studio, la fila se reacomoda sola.

Abajo de 1440 no hay vuelo: el tablero se muestra ya armado y **cortado igual
que en escritorio**. Se ve la cabecera y el arranque de las tarjetas, y el piso
difuminado del hero disuelve el resto.

Cada hueco del tablero mide **exactamente lo mismo** que su panel, así que
converger es una traslación pura, sin deformación. Los paneles y los huecos
viven en el mismo contenedor, de modo que la diferencia entre sus rectángulos no
depende del scroll y se puede recalcular en cada `refresh`.

Los paneles además **se arrastran**. El arrastre vive en un hijo del marco que
vuela, así los dos transforms no compiten por el mismo elemento; al empezar la
convergencia, lo que se haya movido a mano vuelve a cero. `Draggable` se carga
recién cuando hace falta, no en el primer paquete de JavaScript.

### Los proyectos

Se recorre con el scroll normal, sin trabar la rueda. En escritorio el título
queda quieto a media altura mientras pasa la columna de proyectos, y se prende
el que cruza esa altura; en los demás se apaga la esfera y el texto baja un
poco, sin dejar de leerse. En el teléfono es una lista, con el mismo resaltado,
y la esfera prendida muestra «Ver sitio», porque ahí no hay mouse que lo
descubra.

Cada proyecto tiene además su ficha en `/proyectos/<slug>`. Lo que muestra sale
del Studio: si el proyecto no tiene portada ni caso escrito («Caso completo»),
la ficha es una cabecera con el nombre, la bajada, el enlace y los datos; la
portada y el caso aparecen solos cuando se cargan.

El caso escrito es lo que decide si la ficha existe para afuera:

- **Con caso**, la fila de la home suma «Leer el caso», la ficha va al sitemap
  y se indexa.
- **Sin caso**, la ficha se puede abrir pero va con `noindex`, fuera del
  sitemap, y la home no la enlaza (la esfera lleva al sitio publicado). Es una
  página flaca y no tiene sentido mandarla a Google.

Hoy tienen caso **Tierras Argentinas**, **2MG** y **247WC**. Están escritos a
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

`components/site-header.tsx`. Una píldora flotante que se compacta al bajar y
se esconde mientras se lee; vuelve apenas se sube.

- **Se queda a la vista** cuando bajar no es leer: en un salto desde el menú
  (la página va a «Planes», no se está leyendo), con el foco del teclado
  adentro, y con el menú del teléfono abierto. El salto lo avisa el scroll
  suave por `lib/scroll.ts`; cualquier gesto propio en el medio lo corta.
- **Marca la sección en curso.** Una pastilla se corre detrás del enlace de la
  sección que cruza la pantalla (y en el menú del teléfono, un punto). El
  enlace lleva `aria-current="location"`.
- **No se anima al cargar.** Si la página abre a mitad de camino (recargar, un
  enlace a `/#planes`), la barra sale compacta de entrada en vez de achicarse a
  la vista.
- **El botón tiene un solo tamaño.** Cambiaba de golpe al compactar mientras la
  barra se achicaba suave.
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
   (`components/ui/riel-pausable.tsx`). Los testimonios rotan solos hasta que
   se elige una cara, esperan mientras alguien los lee y no rotan con
   movimiento reducido.

---

## Decisiones de diseño

- **Una sola familia tipográfica** (Schibsted Grotesk), trabajada por peso,
  tamaño y color. Va alojada en el propio sitio, recortada a los pesos 400–600
  y al alfabeto latino (40 KB), precargada y con un respaldo ajustado a sus
  medidas para que el texto no salte cuando llega la fuente. Si se cambia el
  archivo, hay que subir el `-vN` del nombre: se sirve con caché inmutable.
- **Fondo de bruma** (`#eaedf8`) en claro y casi negro en oscuro, con un grano
  muy leve para que no quede plano. El blanco queda para lo que se destaca: las
  tarjetas, la píldora del menú, los botones sobre oscuro.
- **Cuatro colores de marca** en pastel: aqua, rosa, verde y miel.
- **La etiqueta de sección** es una pastilla con ícono y el texto en mayúsculas,
  en gris neutro. Suelto sobre el fondo, ese tratamiento se lee a plantilla;
  adentro de una pastilla se lee como un rótulo de sistema. El color lo ponen
  el titular y el contenido.
- Sin degradados en texto, sin vidrio esmerilado, sin emoji como íconos: los
  íconos son SVG propios en `components/ui/icons.tsx`, y la marca (el iso de la
  pantufla) está en `components/ui/brand.tsx`, copiada tal cual del kit.

### Cómo se usan los cuatro colores

Cada color viene en tres pasos y cada paso tiene un uso fijo. La regla que los
mantiene legibles: **el pastel base nunca lleva texto chico sobre fondo claro**.
Para eso está la variante profunda.

| Paso | Para qué |
| --- | --- |
| `-soft` | fondo de pastillas y washes |
| base | rellenos, formas, ilustración, y texto sobre fondo oscuro |
| `-deep` | texto e íconos chicos sobre fondo claro |

El color es taxonomía, no decoración: cada etapa del proceso, cada plan y cada
celda del bento tiene su color asignado en `content/site.ts` y se resuelve con
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
