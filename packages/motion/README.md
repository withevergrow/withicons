# @withicons/motion

Gentle, purposeful animation for [with icons](https://withicons.com). A bell that rings, a heart that beats,
an arrow that nudges the way it points, a play button that flips into pause.

- **Optional and separate.** The icons never depend on it. Add it only where you want motion.
- **Pure CSS at its core.** Add a class and the icon moves. The small JavaScript helper is optional.
- **Works with all 500 icons, in all 15 styles, from every package.** It animates the element that holds the icon: an inline `<svg>`,
  a `<with-icon>`, an `<i class="with ...">` or any wrapper.
- **Every icon already knows how to move.** Each of the 500 has its own continuous loop and hover animation, tuned by hand.
- **Respects people.** When someone asks their system for reduced motion, everything stops (unless you opt in with `wm-force`).

## Install

```bash
npm i @withicons/motion
```

```js
import '@withicons/motion/motion.css'   // the presets (about 10 KB gzipped)
import '@withicons/motion/icons.css'    // each icon's own loop and hover, all 500 (about 18 KB gzipped)
```

From a CDN, with no build step, load the presets and only the icons you animate. Each icon's defaults are also a file of
their own, `dist/icons/<name>.css` (about 0.5 KB, 0.3 KB gzipped):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/icons/bell.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/icons/heart.css">
```

With `<with-icon>` you do not even list them: the element module, served from a CDN, links `icons/<name>.css` for each
animated icon when `icons.css` is not on the page (see [Web component](#web-component)). `icons.css` (every icon) is the
simple choice for bundled apps, where it is one cached file.

## Use it with CSS only

Wrap the icon (or put the classes on the `<svg>` itself) and say which icon it is with `data-wm`:

```html
<!-- moves all the time, using the bell's own loop (it rings from its hook) -->
<span class="wm wm-loop" data-wm="bell"><svg>…bell…</svg></span>

<!-- plays once when the button is hovered or focused -->
<button class="wm-trigger">
  <span class="wm wm-hover" data-wm="bell"><svg>…</svg></span> Notifications
</button>

<!-- plays once when the page loads -->
<span class="wm wm-once" data-wm="check"><svg>…</svg></span>

<!-- pick any preset yourself and tune it with CSS variables -->
<span class="wm wm-loop wm-p-spin" style="--wm-dur: 2s"><svg>…</svg></span>
```

| class | what it does |
|---|---|
| `wm` | base class |
| `wm-loop` | the continuous animation |
| `wm-hover` | a one-shot on hover or keyboard focus of the icon, or of any ancestor with `wm-trigger` (on touch a tap plays it; `motion(el, name, { trigger: 'hover' })` replays it on every tap) |
| `wm-once` | a one-shot when the page loads |
| `wm-inview` | a one-shot when it scrolls into view (needs the JS helper) |
| `wm-paused` | freezes it |
| `wm-force` | keeps it moving even with reduced motion (use rarely, for essential loaders) |
| `wm-p-<preset>` | use this preset instead of the icon's own |

| variable | meaning | example |
|---|---|---|
| `--wm-dur` | seconds per loop, or the one-shot length (`flicker` never goes below 1.2 s, to stay under 3 flashes a second) | `--wm-dur: 2s` |
| `--wm-k` | intensity, 0.25 to 2 | `--wm-k: 1.5` |
| `--wm-ox`, `--wm-oy` | pivot point | `--wm-ox: 50%; --wm-oy: 15%` |
| `--wm-dx`, `--wm-dy` | direction for `nudge` and `pass` (a unit vector) | `--wm-dx: 0; --wm-dy: -1` (up) |
| `--wm-steps` | stepped rotation for `spin`, `tick`, `orbit` | `--wm-steps: 8` |
| `--wm-ease` | timing function for `spin`, `tick`, `orbit` | `--wm-ease: steps(12)` |
| `--wm-delay` | start later (negative = start part-way through) | `--wm-delay: .2s` |
| `--wm-glow` | colour of the `glow` and `twinkle` halo | `--wm-glow: #fbbf24` |

**Glow and twinkle** draw their halo with a CSS `filter`. Put them on an HTML wrapper (`<span class="wm">`, `<i>`,
`<with-icon>`) or on the outer `<svg>`: Safari ignores CSS filters on elements *inside* an SVG, so `svg .wm` on a `<g>`
moves but has no halo there. Browsers without `color-mix()` (Safari before 16.2) get a simpler solid halo.
Filters repaint every frame, so keep looping glows to one or two per screen.

## Presets

| preset | motion | good for |
|---|---|---|
| `spin` | a steady full turn | loader, refresh, settings (slow), fan |
| `spin-once` | one eased turn that settles | refresh or rotate on hover |
| `tick` | a stepped turn (set `--wm-steps`) | clock, timer, 8-step loader |
| `pulse` | grows a little and back | record, live, target |
| `beat` | a heartbeat double-thump | heart, like |
| `breathe` | a slow swell and fade | moon, leaf, calm things |
| `float` | a gentle bob | cloud, balloon, plane, bot |
| `bounce` | a hop with a little squash | ball, package, pin |
| `sway` | a slow lean from the base | plant, flag, tree |
| `ring` | a swing that dies down | bell, alarm clock |
| `wiggle` | a quick playful jiggle | edit, pencil, bug |
| `shake` | a side-to-side "no" | error, denied, close |
| `nod` | an up-and-down "yes" | check, thumbs up |
| `nudge` | moves the way it points and back | arrows, send, log out |
| `pass` | slides out and comes back round from the other side | conveyor arrows, upload, download |
| `rise` | lifts away and pops back | upload, rocket, steam |
| `drop` | falls away and comes back | download, droplet, rain |
| `blink` | a quick blink | eye, smile, bot |
| `flicker` | an irregular flame flicker | flame, zap, candle |
| `twinkle` | a glint with a soft halo | star, sparkles, gem |
| `pop` | a springy pop | add, gift, like |
| `tada` | a little celebration | trophy, award, party |
| `jelly` | a squash-and-stretch wobble | toggle, smile |
| `flip` | turns over like a coin | coin, card, swap |
| `rock` | a slow rock side to side | boat, anchor, hourglass |
| `tilt` | leans in and holds | search, magnet, cursor |
| `zoom` | zooms in and back | zoom in, maximize |
| `orbit` | drifts in a small circle | planet, compass, atom |
| `glow` | a soft halo that swells | lightbulb, sun, power |
| `draw` | strokes draw themselves on (outline styles; others pop) | signature, chart line, check |
| `type` | jitters like keystrokes | keyboard, terminal, chat |
| `fill` | dims and fills up again, like charging | battery, signal, volume |

### Parts move on their own

Styles that compose more than the object (a Bauhaus backdrop square, sticker sparkles, a luxe cast shadow) tag those
shapes, and an inline SVG then animates part by part instead of as one block:

| class on a node | while the icon animates |
|---|---|
| none, `wm-k`, `wm-shine` | the object: plays the preset about the icon's origin |
| `wm-a`, `wm-s` | a moving part / badge: the icon's own override (a bell's clapper rings a beat later), else follows the object |
| `wm-deco` | a decoration: its own gentle loop (`breathe`, `float` or `twinkle`, counter-phased), never the main preset |
| `wm-shadow` | stays on the ground and shrinks / fades for `bounce`, `float`, `rise`, `drop`, `jelly`; otherwise stays attached |

So a spinning Bauhaus sun turns while its square breathes, and a rising rocket leaves its shadow behind. Nothing to
set up: `motion.css` detects tagged SVGs with `:has()` (`motion()` and `<with-icon>` also mark them `wm-parts`, so
older browsers get it too). Choose the decorations' loop with `motion(el, 'sun', { deco: 'float' })` or
`style="--wm-deco: wm-deco-twinkle"` (`none` keeps them still). `<img>` and CSS-class icons (`<i class="with …">`)
cannot reach their shapes and move as a whole. Exports (animated SVG, frames, GIF, video) move the same way.

## Swap: turn one icon into another

Stack two icons in a `wm-swap` wrapper. The second one (`wm-b`) shows when the wrapper, or a parent, has the `is-on`
class or `aria-pressed="true"` (also `aria-expanded` and `aria-checked`). That state always wins.

```html
<!-- a toggle: the state decides the icon, on every device -->
<button aria-pressed="false" aria-label="Play" onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed') !== 'true')">
  <span class="wm-swap wm-fx-flip">
    <svg class="wm-a">…play…</svg>
    <svg class="wm-b">…pause…</svg>
  </span>
</button>

<!-- a preview: B shows while the button is hovered (mouse, trackpad) or keyboard-focused -->
<button class="wm-trigger">
  <span class="wm-swap wm-fx-scale"><svg class="wm-a">…heart…</svg><svg class="wm-b">…heart (solid)…</svg></span> Like
</button>
```

A `wm-trigger` only previews B when it has no `aria-pressed` / `aria-expanded` / `aria-checked` of its own, and the hover
preview only applies where a real hover exists (`@media (hover:hover)`). Phones and tablets have no hover, so anything
that must change on touch needs state: a click toggle like the one above, `swap(el, { trigger: 'click' })`, or
`swap-trigger="click"` on `<with-icon>`. Label the control itself (`aria-label`), not the two icons.

Effects: `fade` `scale` `rotate` `flip` `slide-up` `slide-down` `slide-left` `slide-right` `blur` `spin` `morph` `draw`.
Add `wm-loop` to the wrapper to keep alternating forever (great for demos). `--wm-swap-dur` sets the transition length.
Transitions are reversible: move away halfway and the icon turns back smoothly.

### Timing, and switching on its own or on focus

Every swap can carry its own timing as CSS variables on the wrapper (or any parent). Leave them out and each effect
keeps its tuned default.

| Variable | What it sets | Default |
|---|---|---|
| `--wm-swap-dur` | one transition | the effect's own (fade 0.3 s … draw 0.75 s) |
| `--wm-swap-ease` | the feel of the incoming icon | the effect's own (a spring for scale, rotate, spin, morph) |
| `--wm-swap-delay` | a wait before switching (auto: before the first switch) | `0s` |
| `--wm-swap-hold` | auto: the rest on each icon | `0.9s` |

```html
<!-- slower, springier, a beat late -->
<span class="wm-swap wm-fx-morph" style="--wm-swap-dur: .8s; --wm-swap-ease: cubic-bezier(.3,1.75,.5,1); --wm-swap-delay: .1s">…</span>

<!-- auto: turns into B and back on its own, resting 1.5 s on each (stops for reduced motion) -->
<span class="wm-swap wm-fx-flip wm-swap-auto" style="--wm-swap-hold: 1.5s" role="img" aria-label="Uploading">
  <svg class="wm-a">…cloud…</svg><svg class="wm-b">…cloud-upload…</svg>
</span>

<!-- focus: B while the button (or a field inside the .wm-trigger) has focus, from a click, a tap or the keyboard -->
<label class="wm-trigger"><span class="wm-swap wm-fx-scale wm-swap-focus">…search… …close…</span><input type="search"></label>
```

One auto cycle is `2 × (duration + hold)`. With CSS only, `wm-swap-auto` keeps each effect's default proportions and
stretches them to that cycle; `swap(el, { trigger: 'auto' })` and `<with-icon swap-trigger="auto">` time every
transition exactly, pause while scrolled away or in a background tab, and stay on the first icon for visitors who
prefer reduced motion. Named feels for `--wm-swap-ease` are exported as `SWAP_EASES`: `springy`, `smooth`, `snappy`,
`gentle`, `linear` (`natural` = the effect's own).

A wrapper with `wm-js` is driven by a script (it toggles `is-on` itself): hover and focus previews leave it alone.

## JavaScript helper (optional, tiny, no dependencies)

```js
import { motion, swap, motionFor, motionAttrs, PRESETS, EFFECTS } from '@withicons/motion'

motion(el, 'bell')                                   // the bell's own loop
motion(el, 'bell', { trigger: 'hover' })             // one-shot on hover, focus or tap; it finishes even if the pointer leaves
motion(el, 'rocket', { trigger: 'inview' })          // plays when scrolled into view
motion(el, null, { preset: 'spin', duration: 2 })    // any preset, with options
const m = motion(el, 'heart'); m.pause(); m.play(); m.destroy()

swap(button, { from: playSvg, to: pauseSvg, effect: 'flip', trigger: 'click' })  // toggles, sets aria-pressed, hides the inactive icon from screen readers
swap(badge, { from: bellSvg, to: bellRingSvg, effect: 'morph', trigger: 'auto', duration: .8, hold: 1.2, ease: 'springy' })  // on its own
const s = swap(field, { from: searchSvg, to: closeSvg, trigger: 'focus' }); s.toggle(true); s.destroy()
motionFor('bell')  // { intent: 'rings from its hook…', loop: {…}, hover: {…}, alt: […], swap: […] }
motionAttrs('bell', { trigger: 'hover' })  // { class: 'wm wm-hover', 'data-wm': 'bell' } for markup you render yourself (SSR)
```

Size: `motion()` and `swap()` are about 4 KB gzipped, the `<with-icon>` upgrade about 5 KB. They read each icon's own
defaults from `icons.css` (or the icon's own `icons/<name>.css`) on the element, so load it before calling them.
`motionFor()`, `motionAttrs()` and the export helpers need the full spec table of all 500 icons (`@withicons/motion/icons`,
about 29 KB gzipped); bundlers only include it when you import one of those. Without a bundler (a CDN
`<script type="module">`), import `@withicons/motion/runtime` (`dist/runtime.js`: `motion()`, `swap()` and the rest without
the table) or the element, never `dist/index.js` unless you need `motionFor()`, since an unbundled import downloads every
module it names.

Options for `motion()`: `trigger` (`loop`, `hover`, `once`, `inview`), `preset`, `duration`, `amount`, `origin` ([x, y] on the
24 × 24 grid), `dir` (degrees: 0 right, 90 down, 180 left, 270 up), `steps`, `delay`, `force`, `offscreen`.

Loops started by `motion()` (and `swap(…, { trigger: 'loop' })`, and `<with-icon motion="loop">`) pause while they are
scrolled out of view, so a long page only animates what is on screen. Pass `offscreen: 'run'` to keep one running.
For loops you write as plain classes, `pauseWhenOffscreen(el)` does the same. A plain CSS `wm-loop` without the
helper keeps running offscreen.

### Export animated SVG, GIF or video

```js
import { animatedSvg, gif, video, webm } from '@withicons/motion/export'

animatedSvg(svgString, { name: 'bell' })                  // a self-contained animated SVG (only the keyframes it needs)
animatedSvg(playSvg, { swapTo: pauseSvg, effect: 'flip' }) // two icons turning into each other, forever
animatedSvg(playSvg, { swapTo: pauseSvg, effect: 'morph', duration: .8, hold: 1.2, ease: 'springy' }) // with your timing: cycle 2 × (.8 + 1.2) s
await gif(playSvg, { swapTo: pauseKawaiiSvg, effect: 'scale', hold: 1 }, { size: 256 })  // each icon keeps its own style and colours
await gif(svgString, { name: 'bell' }, { size: 128, background: '#fff' })  // Blob (browser)
const { blob, ext } = await video(svgString, { name: 'bell' }, { size: 256 }) // WebM, or MP4 where WebM can't be recorded
await webm(svgString, { name: 'bell' }, { size: 256 })                      // Blob; rejects where WebM can't be recorded
```

- Animated SVGs play in browsers, `<img>` and most web tools. Apps that show SVG as a still picture (Figma, PowerPoint,
  Keynote, Illustrator, file previews) see the first icon only: the halo of `glow` / `twinkle` and the second icon
  of a swap are hidden until the animation runs. Use a GIF for slides.
- `gif()` streams: it draws each frame on one reused canvas and compresses it straight away, so memory stays at about
  one frame and the page stays responsive. Long loops keep their length and get fewer frames per second
  (`maxFrames`, default 150).
- `video()` records WebM (VP9 or VP8) where the browser can, otherwise MP4 (Safari before 18.4), and returns the real
  `mimeType` and `ext`. Recording pauses while the tab is hidden, so the video never stretches.
- `flicker` is never exported faster than 1.2 s per cycle, so a full-slide GIF stays under 3 flashes a second.

## Right-to-left layouts

Directional icons (arrows, chevrons, send, log out) are drawn pointing right. To mirror one in a right-to-left page,
put the mirroring on the same element as `wm`, for example `<i class="with with-arrow-right with-rtl wm wm-loop" data-wm="arrow-right">`
from `@withicons/web`, or `[dir=rtl] .my-icon { scale: -1 1 }` on the wrapper. The `nudge` and `pass` motion then follows
the mirrored arrow. Mirroring only the inner `<svg>` would leave the motion pointing the original way.

## Frameworks

The core is plain classes, so it works everywhere. Import the CSS once, then add the classes.

**React**

```jsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { Bell } from '@withicons/react'

<button className="wm-trigger">
  <span className="wm wm-hover" data-wm="bell"><Bell /></span> Alerts
</button>
```

**Vue**

```vue
<script setup>
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { Bell } from '@withicons/vue'
</script>
<template>
  <span class="wm wm-loop" data-wm="bell"><Bell /></span>
</template>
```

**Svelte**

```svelte
<script>
  import '@withicons/motion/motion.css'
  import '@withicons/motion/icons.css'
  import { Bell } from '@withicons/svelte'
</script>
<span class="wm wm-loop" data-wm="bell"><Bell /></span>
```

**Angular** — add both CSS files to `styles` in `angular.json`, then:

```html
<!-- in a component that imports WithIconComponent, with Bell = Bell from '@withicons/angular' -->
<span class="wm wm-hover" data-wm="bell"><with-icon [icon]="Bell" /></span>
```

For JS triggers (`inview`, hover that always finishes) call `motion(element, name, options)` in a mounted / effect hook and
`destroy()` when the component unmounts.

## Web component

With `@withicons/web`, import the element upgrade once and use attributes:

```js
import '@withicons/motion/element'
```

From a CDN (one animated bell: about 42 KB gzipped in all, `motion.css`, the element and `cdn.js` included):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/motion.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@0.2.0/dist/cdn.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/element.js"></script>

<with-icon name="bell" motion="loop"></with-icon>   <!-- links dist/icons/bell.css by itself -->
```

Served from a package path (jsDelivr, unpkg, `/node_modules/…`), the element links `icons/<name>.css` next to itself for
each animated icon, unless `icons.css` already styles it. Self-hosting a copy elsewhere? Call
`setMotionIconBase('/vendor/motion/icons/')` from `@withicons/motion/element` (or `null` to turn it off).

```html
<with-icon name="bell" motion="loop"></with-icon>
<with-icon name="bell" motion="hover" preset="shake"></with-icon>
<with-icon name="rocket" motion="inview"></with-icon>
<with-icon name="play" swap-to="pause" swap-effect="flip" swap-trigger="click"></with-icon>
<with-icon name="heart" swap-to="heart@solid" swap-effect="scale"></with-icon>
<with-icon name="cloud" swap-to="cloud-upload@kawaii" swap-effect="slide-up" swap-trigger="auto" swap-hold="1.2"
           swap-duration="0.6" swap-ease="springy" swap-color="#2F5BFF" swap-colors="--with-kawaii-fill-1: #FFD23F"></with-icon>

<!-- inside a control that has state, the icon follows it (whatever swap-trigger says) -->
<button aria-expanded="false" aria-label="Menu" onclick="…"><with-icon name="menu" swap-to="close"></with-icon></button>
```

`motion="loop|once"` and `preset` work with the CSS alone; the element module adds finishing hover, `inview`, `draw`,
swaps and offscreen pausing for loops (`offscreen="run"` turns it off).

Swaps and devices:

- `swap-trigger="click"` inside a `<button>` makes the whole button the toggle (padding, Enter and Space included) and
  gives it `aria-pressed`. On its own, the icon becomes a focusable toggle button (`role="button"`, `tabindex="0"`,
  `aria-pressed`, Enter and Space). Give it an `aria-label`.
- Inside an element with `aria-pressed`, `aria-expanded` or `aria-checked`, the icon mirrors that state.
- `swap-trigger="hover"` previews on mouse hover and keyboard focus. On touch, a tap toggles it, because touch screens
  have no hover. For anything important, use a click toggle.
- `swap-trigger="focus"` shows B while the icon or the control around it has focus; `swap-trigger="auto"` turns into B
  and back on its own (`swap-hold`, pauses offscreen, stays still for reduced motion).
- Timing: `swap-duration`, `swap-ease` (a `SWAP_EASES` name or any CSS easing), `swap-delay`, `swap-hold` (seconds).
- After's own colours: `swap-color` (its ink) and `swap-colors` (its palette variables, `--with-…: #hex; …`). Without them
  B wears the host's colour and variables.

## Reduced motion

Under `prefers-reduced-motion: reduce` every animation stops and swaps become a quick crossfade (no movement, no delay);
auto swaps stay on the first icon.
Add `wm-force` only to motion that carries meaning, such as a loading spinner.

## Browser support

Chrome, Edge and Opera 90+, Firefox 90+, Safari and iOS 15+ (Samsung Internet 15+). Everything degrades quietly:
older engines keep the icons still or show the plain crossfade. Hover-only behaviour has a touch alternative (see Swap).

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
