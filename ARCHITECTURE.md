# Architecture

Next.js 16 (App Router) · React 19 · TypeScript (strict, `noUncheckedIndexedAccess`) ·
Tailwind CSS 4 · Canvas 2D. Fully static: `/`, `/projects`, six
`/projects/[slug]` pages (`dynamicParams = false`), the OG image, sitemap and
robots. `/work` and `/work/:slug` redirect permanently to `/projects`.

No animation library: the reference's own eased scroller and scroll-linked
effects are ported directly, which keeps the bundle small (Lighthouse mobile
94–95 performance).

## Layers (app/layout.tsx)

```
<script> gate      before paint: adds .js, and .booting unless reduced motion
Background         fixed canvas + veil; starts on requestIdleCallback
Runtime            progress line, cursor ring, wipe panels; owns navigation
Boot               the intro; reads/writes nothing but its own DOM
Header / Footer    top bar, mobile menu, Replay intro
<main>             the route
```

## Navigation

Internal links are plain `<a>` so the site works without JavaScript.
`Runtime` intercepts them in the capture phase:

- same page with a hash: glide there with the eased scroller;
- project to project: `router.push`, and the explorer animates its own panel;
- home ↔ projects: the seven-panel wipe covers the screen, the route changes
  underneath, the scroll position is set (`/#work` lands on the Projects
  section), focus moves to the page heading, and the panels wipe away.

The explorer lives in `app/projects/layout.tsx`, so it stays mounted while the
slug changes. It reads the slug from the URL, which makes every explanation a
linkable, statically generated page.

## Degrading

- **No JavaScript:** every hidden starting state is scoped under `html.js`, so
  all content is visible, the projects track scrolls natively, and the intro
  never shows.
- **Reduced motion:** the gate never adds `.booting`, the scroller is not
  installed, the canvas draws one still frame, and the CSS media query removes
  every transition and animation.
- **Intro failure:** if the intro has not started within four seconds, the
  gate drops the cover on its own.
- **Background:** survives a zero-size first frame. Drawing is skipped while
  the size is 0, the grid is rebuilt as soon as the viewport has a size, no
  exception can stop the loop, and resize is handled.
