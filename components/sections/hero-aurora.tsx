/**
 * Fondo del hero.
 *
 * Una superficie de bruma que se aclara hacia el pie, para que la sección
 * siguiente entre sin corte. Antes eran cuatro manchas de color muy
 * desenfocadas; con las tarjetas del tablero encima, el fondo tiene que
 * callarse: dos cosas con color compiten y ninguna gana.
 *
 * El halo de arriba es lo único que queda de aquello, y va muy tenue: sostiene
 * el titular sin ensuciar el blanco de las tarjetas.
 */
export function HeroAurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-mist"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.75) 0%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-paper))",
        }}
      />
    </div>
  );
}
