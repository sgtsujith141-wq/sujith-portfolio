# Creative direction — The Living System

*Phase B document. Written before implementation; kept as the reference the build was held to.*

## The one idea

The visitor is not reading a page about Sujith's work. They are moving through the
structure of it. One graph — Sujith → projects → technologies → concepts → evidence —
sits behind the whole site on a single canvas that never resets. Scrolling is the
camera. Each section asks the graph to take a different formation, and each project
pulls its own cluster forward when it is being read.

Everything else on the site is subordinate to that continuity: the hero grows out of the
first formation instead of playing an overlay; the project case studies are the graph's
clusters given room; the final section is the graph folding back to a single point.

## What it must never become

- A fake terminal, a fake desktop or a fake dashboard. No "ACCESS GRANTED", no green.
- Particles. The nodes are named things with real relationships. Unlabelled ambient
  nodes exist only as a lattice that gives the labelled ones a field to sit in.
- Spectacle that costs readability. The canvas is capped at low alpha, text columns get
  a scrim, and every animation can be skipped by scrolling past it.
- A claim the repositories do not support. The content layer is typed and every
  number carries the date and method by which it was checked.

## Visual system

**Palette.** Near-black graphite (`#090b0f`) with graphite surfaces one step up.
Electric blue (`#4f7cff`) is the primary accent and the colour of "active". Cyan
(`#3fd2f0`) is the signal colour used for highlights, packets and CryptoDrishti's world.
Violet (`#8b7cf6`) is used sparingly for depth and for Aether Health. Text is off-white
(`#e8ecf2`) with two muted steps that both pass 4.5:1 on the base.

**Type.** Archivo (variable, width axis) for display — set slightly wide (`wdth 108`)
at 500 weight with tight tracking, which reads as engineered rather than decorative.
Geist for body. Geist Mono for the small technical labels that carry section indices,
coordinates and verification dates. All three are open-licensed (SIL OFL) and are
self-hosted through `next/font`, so there is no third-party request at runtime.

**Lines.** One-pixel hairlines and 0.5px inset hairlines on surfaces. Diagrams are drawn
with the same line weight as the canvas edges so the SVG and the background feel like
one material.

**Glow.** Only on active nodes and only as a 1px ring plus a soft 12–18px shadow at
low alpha. Never on text.

## Formations (what the graph does per section)

| Section | Formation | Camera |
|---|---|---|
| 01 Introduction | Condense from centre; labelled nodes settle into an orbit that keeps the name's box clear | Slow push-in while the hero is read, then pull back |
| 02 Selected Work | Four clusters, one per project, spaced across the viewport; the active project's cluster brightens and its concept/tech/evidence nodes label themselves | Pans toward the active cluster, opposite the text column |
| 03 Evidence | Lattice. Nodes snap to a grid; evidence nodes lit; edges orthogonal | Static, slight parallax |
| 04 About | Calm, wide spread; the "core" cluster (systems, cybersecurity, AI) gently forward | Widest framing |
| 05 Exploration | Four loose groups drifting; planned themes rendered as unfilled nodes | Slow drift |
| 06 Connect | Everything converges on a single point; edges shorten and fade | Push-in to the centre |

Transitions between formations are spring-eased over ~1.2s and are driven by section
progress, so scrolling back reverses them.

## Motion rules

- The hero choreography is the opening sequence: system initialises → nodes visible →
  name → statement → nav and actions. About 2.4 seconds, never blocks scrolling, replays
  on every real page load, consults no storage. `prefers-reduced-motion` renders the
  final state immediately.
- One pinned scene only (the Selected Work introduction, where the graph reorganises
  into the four project worlds). Everything else scrolls normally with scrubbed reveals.
- Magnetic movement is capped at 6px and only on fine pointers.
- No custom cursor.

## Interaction inventory

Rail navigation with live section coordinates · project tabs that also drive the
background focus · architecture explorer with hover/focus detail · SurakshaScore signal
model with selectable evidence tiers and categories · evolution timeline · screenshot
lightbox-free gallery with keyboard navigation · magnetic actions · animated underlines
· scroll progress · reveal choreography.
