import type { Image, PortableTextBlock } from "sanity";

export type SanityProject = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  sector?: string;
  year?: string;
  plan?: string;
  deliveredIn?: string;
  cover?: Image & { alt?: string };
  gallery?: (Image & {
    alt?: string;
    dimensiones?: { width: number; height: number };
  })[];
  /** La imagen para cuando se comparte el link de la ficha. */
  social?: Image & { alt?: string };
  services?: string[];
  results?: { value: string; label: string }[];
  url?: string;
  /**
   * Fondo de la tarjeta, como ruta de /public.
   *
   * Solo lo usa el contenido de respaldo: desde Sanity el fondo entra por
   * cover, que es un asset de verdad. Están los dos porque son dos orígenes
   * distintos para lo mismo y el componente prueba cover primero.
   */
  art?: string;
  body?: PortableTextBlock[];
  /** Si tiene el caso escrito. La home lo usa para enlazar la ficha. */
  conCaso?: boolean;
};

export type SanityTestimonial = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  rating?: number;
  avatar?: Image;
};
