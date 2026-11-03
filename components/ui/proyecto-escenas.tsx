import { cn } from "@/lib/cn";

/**
 * Las escenas de las tarjetas de proyecto: una pieza por proyecto, derecha
 * y centrada, sobre un plano del color de la marca, con aire alrededor. La
 * referencia que trajo la usuaria son esas miniaturas de portfolio donde un
 * solo componente —un reproductor, un teléfono, una grilla— se saca de la
 * página y se vuelve la imagen, en calma y en el mismo tono que el fondo.
 *
 * Lo que no va, porque lo probamos y quedó mal: cosas inclinadas, tarjetas
 * flotando alrededor, etiquetas en mayúsculas espaciadas, cifras en serif.
 * Todo es sans, de frente y con una sola pieza protagonista.
 *
 * Las medidas van en cqw (la caja de la tarjeta es un contenedor de
 * consultas), así la miniatura es la misma a 350px y a 550px. Los textos
 * son de muestra, como en una viñeta del bento: parte del dibujo, no copy.
 * Los colores son los de cada proyecto, fijos en los dos temas, como los
 * logos.
 */

/* ------------------------------------------------------------------ */
/* Daily: la tarjeta del resumen semanal                               */
/* ------------------------------------------------------------------ */

/**
 * Daily: la tarjeta índigo del promedio semanal, la imagen del producto,
 * grande y sola en el medio del plano lavanda; sus círculos apenas marcados.
 */
export function EscenaDaily() {
  return (
    <div className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3cqw] bg-[#3b3fe8] p-[4.4cqw] text-white shadow-[0_6cqw_12cqw_-6cqw_rgba(59,63,232,0.55)]">
      <span className="pointer-events-none absolute -right-[12%] -top-[34%] h-[64cqw] w-[64cqw] rounded-full border border-white/15" />
      <span className="pointer-events-none absolute -right-[2%] -top-[14%] h-[36cqw] w-[36cqw] rounded-full border border-white/20" />
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-white/40 px-[2.4cqw] py-[0.9cqw] text-[2cqw]">
          Resumen
        </span>
        <span className="text-[2cqw] text-white/60">Semana 41</span>
      </div>
      <div className="mt-[5cqw] flex gap-[7cqw]">
        <div>
          <p className="text-[2.1cqw] text-white/65">Placer</p>
          <p className="mt-[0.6cqw] text-[9cqw] font-semibold leading-none tracking-[-0.035em]">
            5,6
            <span className="text-[3cqw] font-normal text-white/60">/10</span>
          </p>
        </div>
        <div>
          <p className="text-[2.1cqw] text-white/65">Control</p>
          <p className="mt-[0.6cqw] text-[9cqw] font-semibold leading-none tracking-[-0.035em]">
            6<span className="text-[3cqw] font-normal text-white/60">/10</span>
          </p>
        </div>
      </div>
      <p className="mt-[4cqw] text-[2cqw] text-white/65">
        Promedio de la semana · 41 actividades en 6 días
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tierras Argentinas: la grilla                                       */
/* ------------------------------------------------------------------ */

/**
 * Tierras Argentinas: la grilla de cuadraditos del sitio, cada uno una
 * porción de tierra y los azules en manos extranjeras, sola y centrada
 * sobre el papel, como un mapa abstracto. Debajo, una línea que la lee.
 */
const AZULES = new Set([
  3, 17, 24, 31, 46, 52, 58, 67, 75, 83, 90, 101, 109, 116, 122, 131, 138, 145,
  153, 160,
]);

export function EscenaTierras() {
  return (
    <div className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2">
      <div aria-hidden className="grid grid-cols-14 gap-[1cqw]">
        {Array.from({ length: 168 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[0.4cqw]",
              AZULES.has(i) ? "bg-[#0a64d2]" : "bg-[#dcd9cf]",
            )}
          />
        ))}
      </div>
      <p className="mt-[3.6cqw] text-center text-[2.2cqw] text-black/50">
        13,2 millones de hectáreas ·{" "}
        <span className="font-medium text-[#0a64d2]">5 %</span> en manos
        extranjeras
      </p>
    </div>
  );
}
