# Imágenes de los casos

Las imágenes que se ven en las fichas de `/proyectos/<slug>` viven en Sanity:
la portada, la galería y la imagen para redes de cada proyecto. Estos archivos
son el original de lo que se subió, para no depender de que el Studio sea el
único lugar donde están. El sitio no los lee.

Están al doble del tamaño del mockup (2560×1600 los de 16:10, 3200×2400 los
de 4:3), en JPG calidad 90. Sanity sirve cada una al tamaño y formato que pide
la página, y la ficha las muestra enteras, con su proporción.

## Tierras Argentinas

Salen de los mockups de Tierras Argentinas (capturas reales del sitio, con sus
colores), exportados marco por marco.

| Archivo | En Sanity | Qué muestra |
| --- | --- | --- |
| `portada.jpg` | Imagen de portada | El titular y el mapa por provincia |
| `casos.jpg` | Galería, 1 | Caso por caso |
| `senado.jpg` | Galería, 2 | El Senado banca por banca |
| `mobile.jpg` | Galería, 3 | Tres pantallas en el teléfono |
| `redes.jpg` | Imagen para redes | El ranking por provincia, escritorio y teléfono |

## 2MG

Salen de los mockups de 2MG, cuatro marcos de 4:3 exportados uno por uno. La
de redes no es un marco: es la portada entera, con el fondo estirado hacia
los costados hasta llegar a 1,91:1 (2400×1260), para que el recorte de las
redes no le corte ni el navegador ni el teléfono.

Los marcos tienen sombras de 130px de difuminado. Chromium las pinta de a
mosaicos de 256px y, exportadas así, quedaban en bloques; se exportan con
`--default-tile-width=4096 --default-tile-height=4096`.

| Archivo | En Sanity | Qué muestra |
| --- | --- | --- |
| `portada.jpg` | Imagen de portada | El hero en escritorio y en el teléfono |
| `secciones.jpg` | Galería, 1 | Las tres áreas y el proceso de un evento |
| `mobile.jpg` | Galería, 2 | Tres pantallas en el teléfono |
| `componentes.jpg` | Galería, 3 | Componentes: tarjetas, botones, preguntas, chat |
| `redes.jpg` | Imagen para redes | La portada, a 1,91:1 |
