import { NavRail } from "@/components/layout/nav-rail";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { TechnicalWorld } from "@/components/home/technical-world";
import { HomeLabSection } from "@/components/home/homelab-section";
import { Exploring } from "@/components/home/exploring";
import { WorkTeaser } from "@/components/home/work-teaser";
import { Connect } from "@/components/home/connect";

/* The home page is about Sujith. Projects are previewed by the teaser
 * and live in full at /work. */
export default function Page() {
  return (
    <>
      <NavRail />
      <MobileNav />
      <main id="main" className="relative z-[1]">
        <Hero />
        <About />
        <TechnicalWorld />
        <HomeLabSection />
        <Exploring />
        <WorkTeaser />
        <Connect />
      </main>
    </>
  );
}
