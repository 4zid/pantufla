import { cn } from "@/lib/cn";

/**
 * Formas orgánicas con gradientes multi-stop: la luz viene de adentro, no de
 * una sombra. Traducidas a la paleta de papel cálido en vez de los neones del
 * ref. Son SVG puro, no cargan nada.
 */

type Tone = "clay" | "sand" | "olive" | "dusk";

const tones: Record<Tone, [string, string, string]> = {
  clay: ["#f2d9cd", "#d98f6e", "#a83e21"],
  sand: ["#f4ece0", "#dcc7a8", "#a98f66"],
  olive: ["#e8e9de", "#c2c5ae", "#8b8f74"],
  dusk: ["#efdcd8", "#c9a2a8", "#7e5f74"],
};

type Shape = "dome" | "pill" | "drop";

export function Blob({
  tone = "clay",
  shape = "dome",
  className,
  drift = true,
}: {
  tone?: Tone;
  shape?: Shape;
  className?: string;
  drift?: boolean;
}) {
  const [light, mid, deep] = tones[tone];
  const id = `${tone}-${shape}`;

  const paths: Record<Shape, string> = {
    dome: "M100 8c50.8 0 92 41.2 92 92 0 50.8-41.2 92-92 92S8 150.8 8 100 49.2 8 100 8Z",
    pill: "M62 20h76c23.2 0 42 18.8 42 42v76c0 23.2-18.8 42-42 42H62c-23.2 0-42-18.8-42-42V62c0-23.2 18.8-42 42-42Z",
    drop: "M100 12c34 26 74 55 74 96a74 74 0 1 1-148 0c0-41 40-70 74-96Z",
  };

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn(drift && "drift", className)}
    >
      <defs>
        <radialGradient id={`g-${id}`} cx="32%" cy="24%" r="82%">
          <stop offset="0%" stopColor={light} />
          <stop offset="52%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        {/* Realce especular: la lectura de volumen sale de acá. */}
        <radialGradient id={`s-${id}`} cx="30%" cy="18%" r="42%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={paths[shape]} fill={`url(#g-${id})`} />
      <path d={paths[shape]} fill={`url(#s-${id})`} />
    </svg>
  );
}
