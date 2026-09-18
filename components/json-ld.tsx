import { grafo } from "@/lib/schema";

/**
 * El bloque de datos estructurados.
 *
 * Va como script en el cuerpo y no en el head: los motores leen el documento
 * entero y así no hay que arrastrar el grafo hasta generateMetadata, que corre
 * antes y en otro contexto.
 */
export function JsonLd({ nodos }: { nodos: unknown[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: grafo(nodos) }}
    />
  );
}
