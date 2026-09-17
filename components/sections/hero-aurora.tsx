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
 *
 * Abajo no se apaga contra el blanco. Antes había un degradé al color papel en
 * el último tercio, y eso dibujaba un borde donde terminaba el hero. La
 * sección que sigue arranca con esta misma bruma, así que el corte ya no
 * existe: lo que hay es una superficie que sigue.
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
    </div>
  );
}
