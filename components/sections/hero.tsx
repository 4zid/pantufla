import { HeroAurora } from "@/components/sections/hero-aurora";
import { HeroCards } from "@/components/sections/hero-cards";
import { HeroIntro } from "@/components/sections/hero-intro";

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden pb-20 pt-14 md:pb-28 lg:min-h-screen lg:pb-32">
      <HeroAurora />
      <HeroCards />
      <HeroIntro />
    </section>
  );
}
