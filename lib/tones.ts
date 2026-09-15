export type Tone = "aqua" | "rosa" | "verde" | "miel";

/**
 * Mapas explícitos de tono a clase. Tailwind no resuelve nombres de clase
 * armados en runtime, así que las variantes tienen que estar escritas enteras.
 */

/** Sobre papel: solo la variante profunda pasa contraste AA. */
export const toneTextDeep: Record<Tone, string> = {
  aqua: "text-aqua-deep",
  rosa: "text-rosa-deep",
  verde: "text-verde-deep",
  miel: "text-miel-deep",
};

/** Sobre la banda oscura: la pastel base rinde más de 9:1. */
export const toneTextBase: Record<Tone, string> = {
  aqua: "text-aqua",
  rosa: "text-rosa",
  verde: "text-verde",
  miel: "text-miel",
};

/** Pastilla clara con su texto profundo. */
export const tonePill: Record<Tone, string> = {
  aqua: "bg-aqua-soft text-aqua-deep",
  rosa: "bg-rosa-soft text-rosa-deep",
  verde: "bg-verde-soft text-verde-deep",
  miel: "bg-miel-soft text-miel-deep",
};

export const toneBg: Record<Tone, string> = {
  aqua: "bg-aqua",
  rosa: "bg-rosa",
  verde: "bg-verde",
  miel: "bg-miel",
};

/** Sólido con texto claro: para el distintivo del plan destacado. */
export const toneSolid: Record<Tone, string> = {
  aqua: "bg-aqua-deep text-white",
  rosa: "bg-rosa-deep text-white",
  verde: "bg-verde-deep text-white",
  miel: "bg-miel-deep text-white",
};
