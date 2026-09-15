import { HeroAurora } from "@/components/sections/hero-aurora";
import { HeroIntro } from "@/components/sections/hero-intro";
import { HeroScene } from "@/components/sections/hero-scene";

/**
 * En desktop el hero mide dos pantallas y el escenario queda fijo: eso es lo
 * que da el recorrido en el que los paneles convergen en el dashboard.
 * En mobile es una sección normal, con el dashboard ya armado abajo del título.
 */
export function Hero() {
  return (
    <section className="relative min-[1440px]:h-[220vh]">
      <div className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-32 min-[1440px]:sticky min-[1440px]:top-0 min-[1440px]:flex min-[1440px]:h-screen min-[1440px]:flex-col min-[1440px]:justify-start min-[1440px]:pb-0 min-[1440px]:pt-28">
        <HeroAurora />
        <HeroIntro />
        <HeroScene />
      </div>
    </section>
  );
}
