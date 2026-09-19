import { PersonalNetwork } from "./personal-network";
import { Reveal } from "@/components/animations/reveal";
import { SectionHeader } from "@/components/ui/section-header";

/* 03 · TECHNICAL WORLD — the signature section. */
export function TechnicalWorld() {
  return (
    <section
      id="network"
      aria-labelledby="network-title"
      className="relative px-6 py-28 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="03"
          label="Technical world"
          title={<span id="network-title">Everything I explore, and how it connects.</span>}
          lede="Seven things I actually spend time on. Choose one and it opens: what it means to me, where it shows up in the machine running at home, and which of my projects it runs through. The field behind this page follows the same selection."
        />
        <Reveal className="mt-14" amount={0.1}>
          <PersonalNetwork />
        </Reveal>
      </div>
    </section>
  );
}
