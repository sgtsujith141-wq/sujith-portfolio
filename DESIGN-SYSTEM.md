# Design system

Matches the approved reference `portfolio-final.html`.

## Colour: monochrome, dark everywhere

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b0b0c` | page |
| `--panel` | `#151517` | cards, panels |
| `--line` / `--line2` | `#232326` / `#36363b` | 1 px rules |
| `--text` | `#ecece8` | body |
| `--hi` | `#ffffff` | highlight, solid buttons |
| `--dim` | `#9b9b96` | secondary text |
| `--faint` | `#82827d` | labels, captions |

`--faint` is specified as `#64645f`, which is 3.3:1 against `--bg` and fails
WCAG AA for the 12 px labels it is used on. It is lifted to `#82827d`
(5.1:1 on `--bg`, 4.7:1 on panels), the closest grey that passes. Approved
by Sujith, 2 Oct 2026.

No accent colours, gradients only as scrims, no rounded corners, no glows
outside the intro's CRT.

## Type

- **Doto 900:** only the hero name and the large faint index numbers on
  project cards.
- **JetBrains Mono 400 / 500 / 700 / 800** for everything else. Headings are
  800, uppercase, -0.05em. Body is 15.5 px / 1.72.
- Arrows, ✕ and the block cursor are in no Google Fonts subset, so they fall
  back to the system monospace, as in the reference.

## Layout

12-column grid, max 1280 px, side padding `clamp(20px, 5vw, 64px)`. Section
title sticky in columns 1–4, content in 5–12, stacked below 900 px. No
horizontal scroll from 360 px up.

## Motion

Easing `cubic-bezier(.2,.8,.2,1)` and `cubic-bezier(.7,0,.2,1)`. Section rules
draw across, headings decrypt and end in a blinking `_`, about paragraphs wipe
in, education values and skill names type out, lists stagger, buttons sweep
on hover. Every effect is off under `prefers-reduced-motion`.
