/**
 * Las tres ilustraciones de «Cómo lo resolvemos», una por pilar.
 *
 * Son dibujos de línea, monocromos, en currentColor: toman el color del
 * texto y se dan vuelta solos con el tema. Trazo de 1,6 en una caja de 40,
 * terminales redondos, y nada de relleno salvo un punto o dos: tienen que
 * pesar lo mismo que el titular de al lado, no más.
 *
 * Cada una dice lo que dice el pilar sin repetirlo: una etiqueta de precio
 * para el alcance cerrado, un reloj para el ritmo corto, unas llaves para la
 * entrega a tu nombre. Se cruzan con el texto por approachDesign.art.
 */

const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Props = { className?: string };

/** La etiqueta de precio: alcance y precio cerrados antes de empezar. */
function Precio({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M6 8.5A2.5 2.5 0 0 1 8.5 6h9.4a3 3 0 0 1 2.1.9l13.3 13.3a2.5 2.5 0 0 1 0 3.5l-9.6 9.6a2.5 2.5 0 0 1-3.5 0L6.9 20a3 3 0 0 1-.9-2.1Z"
        {...trazo}
      />
      <circle cx="13" cy="13" r="2" {...trazo} />
      <path d="M19 26.5 25.5 20" {...trazo} />
    </svg>
  );
}

/** El reloj: bloques de días, fechas a la vista. */
function Reloj({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="21" r="13" {...trazo} />
      <path d="M20 13.5V21l5 3.5" {...trazo} />
      <path d="M16.5 5.5h7M20 5.5V8" {...trazo} />
    </svg>
  );
}

/** Las llaves: el sitio queda en tu cuenta, a tu nombre. */
function Llaves({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="13.5" cy="15" r="7" {...trazo} />
      <circle cx="13.5" cy="15" r="1.6" fill="currentColor" />
      <path d="M18.5 20 32 33.5M27.5 29l3-3M23.5 25l3-3" {...trazo} />
    </svg>
  );
}

const dibujos: Record<string, (p: Props) => React.ReactElement> = {
  precio: Precio,
  reloj: Reloj,
  llaves: Llaves,
};

export function ApproachArt({ art, className }: Props & { art: string }) {
  const Dibujo = dibujos[art] ?? Precio;
  return <Dibujo className={className} />;
}
