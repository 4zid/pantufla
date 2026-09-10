import type { Tone } from "@/components/art/blob";
import { toneTextBase, toneTextDeep } from "@/lib/tones";
import { cn } from "@/lib/cn";

/**
 * Entradilla de sección: una regla corta y el texto en caja baja, en el color
 * que le toca a esa sección. El color es lo que la hace nuestra; el tratamiento
 * en mayúsculas con tracking que había antes se lee a plantilla.
 */
export function Eyebrow({
  children,
  tone = "aqua",
  onDark = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "eyebrow",
        onDark ? toneTextBase[tone] : toneTextDeep[tone],
      )}
    >
      {children}
    </p>
  );
}
