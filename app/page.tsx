import { CommandPaletteProvider } from "@/components/palette/command-palette";
import { WorldProvider } from "@/components/world/world";
import { IntroSequence } from "@/components/intro/intro-sequence";
import { Reticle } from "@/components/ui/reticle";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Opening } from "@/components/sections/opening";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Cybersecurity } from "@/components/sections/cybersecurity";
import { Capabilities } from "@/components/sections/capabilities";
import { Hackathons } from "@/components/sections/hackathons";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <WorldProvider>
      <CommandPaletteProvider>
      <IntroSequence />
      <Reticle />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[140] focus:border focus:border-accent focus:bg-base focus:px-4 focus:py-2 focus:text-[12px] focus:text-accent"
      >
        Skip to content
      </a>

      <div id="site">
        <Nav />
        <main>
          <Opening />
          <About />
          <Projects />
          <Cybersecurity />
          <Capabilities />
          <Hackathons />
          <Contact />
        </main>
        <Footer />
      </div>
      </CommandPaletteProvider>
    </WorldProvider>
  );
}
