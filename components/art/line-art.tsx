/**
 * Set de ilustración de línea propio. Trazo de 1.6, puntas redondeadas, sin
 * relleno: todos los dibujos comparten la misma mano para que se lean como un
 * set y no como iconos sueltos de una librería.
 *
 * Cada trazo va en su propio <path> para poder dibujarlos en secuencia.
 */

export type LineArtName =
  | "brief"
  | "diseno"
  | "desarrollo"
  | "llaves"
  | "precio"
  | "reloj"
  | "pantufla";

const paths: Record<LineArtName, string[]> = {
  // Hoja con esquina doblada y renglones: el brief.
  brief: [
    "M13 5h14l8 8v30a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z",
    "M27 5v8h8",
    "M17 24h14",
    "M17 31h14",
    "M17 38h9",
  ],
  // Artboard con bloques y cursor: la etapa de diseño.
  diseno: [
    "M5 9h38a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z",
    "M19 43h10",
    "M24 35v8",
    "M9 15h11v10H9z",
    "M26 15h12",
    "M26 21h8",
    "M28 26l9 4-4 1.5-1.5 4Z",
  ],
  // Corchetes y una barra: el desarrollo.
  desarrollo: ["M17 15 7 24l10 9", "M31 15l10 9-10 9", "M27 11l-6 26"],
  // Llave: te entregamos las llaves del sitio.
  llaves: [
    "M17 26a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z",
    "M22.7 28.3 41 10",
    "M34 7l5 5",
    "M29.5 11.5l5 5",
  ],
  // Candado cerrado: precio cerrado.
  precio: [
    "M11 21h26a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V24a3 3 0 0 1 3-3Z",
    "M16 21v-6a8 8 0 0 1 16 0v6",
    "M24 30v5",
  ],
  // Cronómetro: el ritmo corto.
  reloj: [
    "M24 13a16 16 0 1 1 0 32 16 16 0 0 1 0-32Z",
    "M24 21v8l5.5 4",
    "M19 5h10",
    "M24 5v8",
  ],
  // La marca, en trazo.
  pantufla: [
    "M7 27c0-6.6 5.4-12 12-12 2.4 0 4.6 1.2 5.8 3.2l2.9 4.7c.7 1.1 1.8 1.9 3.1 2.2l4.8 1.2c3 .7 5.1 3.4 5.1 6.5 0 3.7-3 6.7-6.7 6.7H14c-3.9 0-7-3.1-7-7v-5.5Z",
    "M14 15.5V12a5 5 0 0 1 5-5h2.5",
  ],
};

export function LineArt({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: LineArtName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name].map((d, i) => (
        <path key={i} d={d} data-stroke pathLength={1} />
      ))}
    </svg>
  );
}
