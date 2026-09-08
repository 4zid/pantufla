import { Blob } from "@/components/art/blob";
import { HeroIntro } from "@/components/sections/hero-intro";
import { HeroVisual } from "@/components/sections/hero-visual";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 md:pt-20">
      {/* Halo cálido detrás del título. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #f6e7de 0%, rgba(247,245,240,0) 70%)",
        }}
      />

      {/* Blobs: no compiten con el título, lo acompañan desde los márgenes. */}
      <Blob
        tone="clay"
        shape="drop"
        className="pointer-events-none absolute -left-24 top-40 hidden h-64 w-64 opacity-70 blur-[1px] lg:block"
      />
      <Blob
        tone="sand"
        shape="dome"
        className="pointer-events-none absolute -right-20 top-24 hidden h-52 w-52 opacity-60 lg:block"
      />

      <HeroIntro />
      <HeroVisual />
    </section>
  );
}
