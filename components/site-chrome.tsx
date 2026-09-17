import { ThemeScroll } from "@/components/theme-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * El marco del sitio: salto al contenido, barra y pie.
 *
 * Vive en un componente propio y no en el layout raíz porque /studio cuelga de
 * la misma raíz: si la barra se monta ahí arriba, queda flotando encima del
 * panel de Sanity. Lo usan el grupo (site) y la pantalla de 404, que es la
 * única ruta con marco que no puede entrar al grupo.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <ThemeScroll />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-paper"
      >
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
