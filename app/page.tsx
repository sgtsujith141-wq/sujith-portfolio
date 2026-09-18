import { LivingSystem } from "@/components/canvas/living-system";
import { NavRail } from "@/components/layout/nav-rail";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SkipLink } from "@/components/layout/skip-link";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/scenes/hero";
import { Work } from "@/components/scenes/work";
import { Evidence } from "@/components/scenes/evidence";
import { About } from "@/components/scenes/about";
import { Exploration } from "@/components/scenes/exploration";
import { Connect } from "@/components/scenes/connect";

export default function Page() {
  return (
    <LivingSystem>
      <SkipLink />
      <NavRail />
      <MobileNav />
      <main id="main" className="relative z-[1]">
        <Hero />
        <Work />
        <Evidence />
        <About />
        <Exploration />
        <Connect />
      </main>
      <Footer />
    </LivingSystem>
  );
}
