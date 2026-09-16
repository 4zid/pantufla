import { SiteChrome } from "@/components/site-chrome";

/**
 * Grupo (site): todo lo que lleva barra y pie. No agrega un segmento a la URL,
 * así que /contacto sigue siendo /contacto. Lo que queda fuera del grupo
 * —/studio— se renderiza pelado sobre el layout raíz.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
