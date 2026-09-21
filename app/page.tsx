import { IntroSequence } from "@/components/intro/intro-sequence";
import { NavRail } from "@/components/layout/nav-rail";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { Machines } from "@/components/home/machines";
import { Now } from "@/components/home/now";
import { WorkTeaser } from "@/components/home/work-teaser";
import { Connect } from "@/components/home/connect";

/* The home page is about Sujith. Projects are previewed by the teaser
 * and live in full at /work. */
export default function Page() {
  return (
    <>
      <IntroSequence />
      <div id="site">
        <NavRail />
        <MobileNav />
        <main id="main" className="relative z-[1]">
          <Hero />
          <About />
          <Machines />
          <Now />
          <WorkTeaser />
          <Connect />
        </main>
      </div>
    </>
  );
}
