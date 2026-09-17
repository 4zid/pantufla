/**
 * Los dos temas del sitio y cómo se mezclan.
 *
 * No son dos hojas de estilo: son los mismos tokens con otros valores. Como
 * Tailwind resuelve cada utilidad contra la variable CSS —bg-card es
 * var(--color-card)— mover las variables en :root repinta el sitio entero sin
 * que ningún componente sepa que existe un modo oscuro.
 *
 * Por eso los valores son todos sólidos y ninguno lleva alpha: para pasar de
 * uno al otro hay que interpolar canal por canal, y un color con transparencia
 * no se puede interpolar contra lo que tenga detrás sin saber qué hay detrás.
 */

export type Tema = Record<string, [number, number, number]>;

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const claro: Tema = {
  "--color-paper": rgb("#ffffff"),
  "--color-paper-alt": rgb("#f5f5f4"),
  "--color-card": rgb("#ffffff"),
  "--color-ink": rgb("#121212"),
  "--color-ink-soft": rgb("#565656"),
  "--color-ink-faint": rgb("#767676"),
  "--color-line": rgb("#e7e7e7"),
  "--color-line-strong": rgb("#d6d6d6"),
  "--color-mist": rgb("#eaedf8"),
};

/**
 * El oscuro no es el claro invertido. La tinta baja apenas del blanco puro
 * —sobre negro, el blanco puro vibra— y las superficies se separan de a poco:
 * el papel es el fondo, la tarjeta sube un escalón y la línea otro. Con un
 * solo gris para todo, las tarjetas desaparecen.
 */
export const oscuro: Tema = {
  "--color-paper": rgb("#0e0e0e"),
  "--color-paper-alt": rgb("#151515"),
  "--color-card": rgb("#1b1b1b"),
  "--color-ink": rgb("#f4f4f2"),
  "--color-ink-soft": rgb("#a6a6a2"),
  "--color-ink-faint": rgb("#7a7a76"),
  "--color-line": rgb("#2a2a2a"),
  "--color-line-strong": rgb("#3c3c3c"),
  "--color-mist": rgb("#14161f"),
};

/** Las superficies que puede pedir una sección para el fondo de la página. */
export const superficies = {
  mist: rgb("#eaedf8"),
  paper: rgb("#ffffff"),
  deep: rgb("#0e0e0e"),
} as const;

export type NombreSuperficie = keyof typeof superficies;

export function mezclar(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function css([r, g, b]: [number, number, number]) {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}
