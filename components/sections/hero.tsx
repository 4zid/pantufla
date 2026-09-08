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
    <section className="relative lg:h-[220vh]">
      <div className="relative overflow-hidden pb-16 pt-14 md:pb-20 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-start lg:pb-0 lg:pt-24 xl:pt-28">
        <HeroAurora />
        <HeroIntro />
        <HeroScene />
      </div>
    </section>
  );
}
