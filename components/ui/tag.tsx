import {
  CubeIcon,
  GlobeIcon,
  GridIcon,
  HelpIcon,
  LayersIcon,
  QuoteIcon,
  RouteIcon,
  TagIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Etiqueta de sección.
 *
 * Una pastilla con un icono y el texto en mayúsculas con tracking abierto.
 *
 * El mismo tratamiento en mayúsculas, suelto sobre el fondo, es el que se lee
 * a plantilla en medio internet. Adentro de una pastilla con icono deja de
 * serlo: pasa a leerse como un rótulo de sistema, que es lo que es.
 *
 * Va en gris neutro y no en el color de cada sección. El color lo ponen el
 * titular y el contenido; si la etiqueta también cambia, el ojo pierde el
 * punto fijo que le dice dónde empieza cada bloque.
 */

export const tagIcons = {
  cubo: CubeIcon,
  etiqueta: TagIcon,
  grilla: GridIcon,
  cita: QuoteIcon,
  ayuda: HelpIcon,
  capas: LayersIcon,
  globo: GlobeIcon,
  ruta: RouteIcon,
} as const;

export type TagIconName = keyof typeof tagIcons;

export function Tag({
  icon = "cubo",
  children,
}: {
  icon?: TagIconName;
  children: React.ReactNode;
}) {
  const Icon = tagIcons[icon];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-alt px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-soft">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </span>
  );
}
