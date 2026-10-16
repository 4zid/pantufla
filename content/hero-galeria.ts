/**
 * Las pantallas que corren abajo del hero.
 *
 * Son capturas sueltas de sitios, de escritorio y de teléfono, y la galería
 * las acomoda en columnas tipo masonry: dos de escritorio apiladas, una de
 * teléfono de alto entero, o una de escritorio grande cuando le sigue un
 * teléfono (ver hero-galeria.tsx).
 *
 * Las de verdad se cargan en el Studio, en «Pantallas del hero». Estas son el
 * respaldo mientras ese documento está vacío: sitios inventados, renderizados
 * como capturas, que no son trabajos del estudio y no llevan a ninguna parte.
 * Están para que la galería se vea con su movimiento y su ritmo hasta que
 * lleguen las reales; apenas el documento tiene una sola pantalla, se usan
 * las de Sanity y estas dejan de aparecer.
 */

export type FormatoPantalla = "desktop" | "mobile";

export type Pantalla = {
  id: string;
  src: string;
  /** Las medidas del archivo, para reservar el lugar antes de que cargue. */
  ancho: number;
  alto: number;
  formato: FormatoPantalla;
  alt: string;
  /** El caso del proyecto, si la pantalla es de uno que lo tiene escrito. */
  href?: string;
};

const escritorio = (nombre: string, alt: string): Pantalla => ({
  id: `${nombre}-desktop`,
  src: `/hero/pantallas/${nombre}-desktop.jpg`,
  ancho: 1440,
  alto: 900,
  formato: "desktop",
  alt,
});

const telefono = (nombre: string, alt: string): Pantalla => ({
  id: `${nombre}-mobile`,
  src: `/hero/pantallas/${nombre}-mobile.jpg`,
  ancho: 780,
  alto: 1688,
  formato: "mobile",
  alt,
});

/*
   El orden arma las columnas: dos de escritorio seguidas van apiladas, y una
   de escritorio sola antes de un teléfono va grande. Así el riel alterna
   alturas en vez de repetir el mismo bloque.
*/
export const pantallasDeRelleno: Pantalla[] = [
  escritorio("brisa", "Sitio de un hotel frente al mar, en escritorio"),
  escritorio("faro", "Sitio de una app de finanzas, en escritorio"),
  telefono("kaffa", "Tienda de café en el teléfono"),
  escritorio("lumen", "Sitio de una clínica, en escritorio"),
  escritorio("molde", "Tienda de muebles, en escritorio"),
  telefono("norte", "Estudio de arquitectura en el teléfono"),
  escritorio("kaffa", "Tienda de café, en escritorio"),
  telefono("brisa", "Hotel frente al mar en el teléfono"),
  escritorio("norte", "Estudio de arquitectura, en escritorio"),
  telefono("lumen", "Clínica en el teléfono"),
  telefono("molde", "Tienda de muebles en el teléfono"),
];
