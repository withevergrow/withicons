# with icons: animation (`@withicons/motion`)

Animations are optional and ship separately, so icons never pay for them. They animate the element that holds the
icon (an inline `<svg>`, a component, `<with-icon>`, `<i class="with ...">` or any wrapper), so every style and every
package works. Pure CSS; the small JS API is only needed for `inview`, programmatic control and building swaps.

## Install

```bash
npm i @withicons/motion
```

```js
import '@withicons/motion/motion.css'   // the presets
import '@withicons/motion/icons.css'    // every animated icon's tuned motion (keyed by data-wm)
```

From a CDN, load the presets and only the icons you animate (each icon's file is ~0.3 KB gzipped):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">
```

In an unbundled `<script type="module">`, import `@withicons/motion/runtime` (`dist/runtime.js`) for `motion()` /
`swap()`, not `dist/index.js` (it pulls the full spec table).

Sizes (gzipped): `motion.css` ~10 KB (120 KB raw), `icons.css` ~17 KB (148 KB raw), one `icons/<name>.css` ~0.2 KB,
`element.js` ~6 KB, `runtime.js` ~6 KB.

## Which way to animate

| icon is | animate it with |
|---|---|
| inline `<svg>`, a framework component (React, Vue, Svelte, Solid, Angular), a live icon's svg | a `.wm` wrapper (classes below) whose **direct child** is the svg: the icon moves part by part (a bell's clapper swings a beat behind) |
| `<i class="with …">` (CSS mask) | a `.wm` wrapper; it moves as one piece |
| `<with-icon>` (web component) | the `motion` attribute + `dist/element.js`, **not** a `.wm` wrapper (below) |

### `<with-icon>`: use the `motion` attribute

The web component draws its svg inside a shadow root. A `.wm` wrapper around `<with-icon>` can only move the
element's outer box: the parts never move and `draw` cannot reach the strokes. Load the motion element after the icons:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/element.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">

<with-icon name="loader" motion="loop"></with-icon>
<button class="wm-trigger" aria-label="Notifications"><with-icon name="bell" motion="hover"></with-icon></button>
<with-icon name="rocket" motion="inview" preset="rise"></with-icon>
<with-icon name="play" swap-to="pause" swap-effect="morph" swap-trigger="click"></with-icon>
```

- `motion="loop|hover|once|inview"`, optional `preset="<preset>"`, `paused`, `offscreen="run"` (loops pause while
  scrolled out of view by default). Served from a CDN, `element.js` links each animated icon's own
  `icons/<name>.css` by itself; with a bundler, `import '@withicons/motion/element'` and `import '@withicons/motion/icons.css'`.
- Swaps: `swap-to="pause"` (or `pause@solid`), `swap-effect`, `swap-trigger="hover|click|focus|auto|manual"`,
  `swap-duration`, `swap-hold`, `swap-color`. Inside a button with `aria-pressed` / `aria-expanded` the icon follows that state.
- `motion.css` alone already runs `motion="loop"` and `"once"` on the whole element; `element.js` adds part motion,
  hover that finishes its one-shot, `inview`, `draw` and swaps.

### Check that it moves

Animations inside a shadow root are not listed on the element itself:

```js
document.querySelector('with-icon[motion]').shadowRoot.getAnimations().map(a => a.animationName)  // ['wm-ring-loop', …]
document.querySelector('.wm').getAnimations({ subtree: true }).length                              // wrapper + inline svg
```

With `element.js` the parts move inside the shadow root, each with its tuned lag, and the element's own box stays
still, so `el.getAnimations()` on a `<with-icon>` returns `[]` even while it moves (with `motion.css` alone, no
`element.js`, the whole element moves instead and its own list is not empty). Under `prefers-reduced-motion: reduce`
(often on in CI, remote desktops and screenshot tools) every list is empty by design.

### Touch screens

There is no hover on phones and tablets. The JS paths (`motion()` with `trigger: 'hover'`, `<with-icon motion="hover">`)
play the one-shot on tap; the CSS-only `wm-hover` depends on the browser's emulated `:hover` and is unreliable. For
mobile layouts prefer `wm-inview` / `motion="inview"` (plays as it scrolls into view), `wm-once`, or a calm `wm-loop`.

## Classes

| class / attribute | effect |
|---|---|
| `wm` | base class on the wrapper |
| `data-wm="<icon>"` | use that icon's tuned motion (from `icons/<icon>.css` or `icons.css`) |
| `wm-loop` | continuous animation, calm enough to run forever |
| `wm-hover` | one-shot on hover / focus of the wrapper or of any `.wm-trigger` ancestor (e.g. the button) |
| `wm-once` | plays the icon's one-shot (its hover motion) once on load |
| `wm-inview` | plays the one-shot when scrolled into view (needs the JS runtime) |
| `wm-paused` | pause |
| `wm-p-<preset>` | choose the preset explicitly (overrides the icon default) |
| `--wm-dur`, `--wm-k` | CSS variables: seconds per cycle, intensity (0.25-2); in React with TypeScript, cast: `style={{ '--wm-dur': '3s' } as React.CSSProperties}` |
| `wm-swap wm-fx-<effect>` + children `wm-a` / `wm-b` | icon A turns into icon B on `.wm-trigger:hover`, focus, `.is-on` or `aria-pressed="true"` |
| `wm-force` | keep animating under `prefers-reduced-motion` (avoid) |

Presets: spin, spin-once, tick, pulse, beat, breathe, float, bounce, sway, ring, wiggle, shake, nod, nudge, pass, rise,
drop, blink, flicker, twinkle, pop, tada, jelly, flip, rock, tilt, zoom, orbit, glow, draw (stroked styles), type, fill.
Swap effects: fade, scale, rotate, flip, slide-up, slide-down, slide-left, slide-right, blur, spin, morph, draw.

## Examples

```html
<span class="wm wm-loop" data-wm="loader"><svg>…</svg></span>
<button class="wm-trigger" aria-label="Notifications"><span class="wm wm-hover" data-wm="bell"><svg>…</svg></span></button>
<span class="wm-swap wm-fx-morph is-on"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>
```

```js
import { motion, swap, motionFor } from '@withicons/motion'
motion(el, 'bell', { trigger: 'hover' })               // { play(), pause(), destroy() }
swap(el, { from: playSvg, to: pauseSvg, effect: 'morph', trigger: 'click' })   // { toggle(on?), destroy() }
```

### Play on scroll in React (`inview`, any style, 3D included)

`wm-inview` is not picked up from markup by itself: `inview` runs through the JS runtime. `motion(el, name, options)`
from `@withicons/motion` adds the classes (`wm`, `wm-inview`, and `wm-3d` / `wm-backdrop` when `style` is a 3D or
backdrop style), watches the element with an IntersectionObserver (threshold 0.35) and plays the icon's one-shot each time
it scrolls in (`repeat: false`: only the first time). It returns `{ el, play(), pause(), destroy() }`; call `destroy()` on
unmount (it disconnects the observer and removes what it added). Calling `motion()` again on the same element replaces
the previous motion.

```jsx
import { useEffect, useRef } from 'react'
import { motion } from '@withicons/motion'
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { ShieldCheck, BotMessageSquare } from '@withicons/react/clay'

function Moving({ name, trigger = 'inview', children }) {
  const ref = useRef(null)
  useEffect(() => {
    const m = motion(ref.current, name, { trigger, style: 'clay', repeat: false })   // style: plays in 3D
    return () => m.destroy()
  }, [name, trigger])
  return <span ref={ref}>{children}</span>   // the icon's svg must be the direct child
}

<Moving name="bot-message-square" trigger="loop"><BotMessageSquare size={72} /></Moving>   {/* the one loop */}
<Moving name="shield-check"><ShieldCheck size={72} /></Moving>                              {/* plays on scroll */}
```

Other triggers work the same (`'loop'` pauses off-screen by itself, `'hover'` plays on hover, focus or tap of the
nearest `.wm-trigger`, `'once'` on mount). Vue: call it in `onMounted` and `destroy()` in `onBeforeUnmount`; Svelte:
in `onMount`, returning `() => m.destroy()`. MCP `animate_icon(..., trigger: "inview", format: "react")` writes this code.
`<with-icon>` needs none of it: `motion="inview"` (with `element.js`) is scanned from the markup.

Agents: `animate_icon({ name, trigger, preset?, to?, effect?, style?, format })` (MCP), `npx withicons animate <name>`,
or `GET https://withicons.com/api/motion/<name>?trigger=hover&format=react`.

As files (slides, documents, email, social): `npx withicons export <name> --format gif|apng|animated-svg|pptx-animated|lottie`
with `--motion loop|hover|once|swap|<preset>` (MCP: `export_icon`). Frames come from these same keyframes, so a GIF moves
exactly like the icon on the page. GIF: pass the slide colour as `--background`. For a title slide that needs a more
noticeable move than the calm tuned loop, run `npx withicons motions <icon>` (same as `animate <icon> --list`): the default
loop and hover, the icon's alternates with commands, and the livelier picks (tada, jelly, bounce, beat, wiggle, pop);
MCP `animate_icon` returns them as `alternates` and `lively`. `npx withicons animate --list` lists every preset.
Exported files carry no motion part classes; code formats keep them. See SKILL.md section 7 and
[files.md](files.md) (sizes, limits, padding, dark backgrounds, email).

## 3D motion (3D styles) and per-style moves (soft3d)

The 3D styles (`clay`, `glass`, `liquid`, `chrome`, `soft3d`, `luxe`, `skeuo`, `dock`, `plush`) draw objects with volume,
so they move like objects: an icon's own motion plays as its 3D counterpart (it turns in depth, lifts toward you and
lands, its highlight slides and its ground shadow shrinks as it rises). Flat styles keep their motion exactly.

| flat | 3D | | flat | 3D |
|---|---|---|---|---|
| spin | turn | | beat | pump |
| spin-once, flip, tada | turn-once | | pulse, zoom, rise | lift |
| orbit, rock, sway | wobble | | bounce, jelly, pop | squish |
| tilt, nudge | lean | | float, breathe | drift |
| ring | chime | | glow, twinkle | gleam |
| wiggle, shake | swivel | | nod | bow |

How to turn it on:

- `<with-icon variant="clay" motion="loop">`: automatic (the element adds `wm-3d` from `variant`).
- A wrapper around a component or inline SVG: add class `wm-3d`: `<span class="wm wm-loop wm-3d" data-wm="rocket"><RocketClay /></span>`
  (`icons.css` / `icons/<name>.css` carry each icon's 3D variables). `bento` and `dock` draw a tile behind the glyph:
  add `wm-backdrop` so the tile stays still.
- JS: `motion(el, 'rocket', { trigger: 'loop', style: 'clay' })` adds the classes itself.
- Files: `npx withicons export rocket --style clay --format gif` (and Lottie, APNG, animated SVG, PowerPoint) record the
  3D motion; what you see live is what you download (no CSS 3D is used, so every player renders it).
- MCP `animate_icon(name, style: "clay")` and `npx withicons animate rocket --style clay` write the code with `wm-3d`.

Name a 3D preset directly with `preset` / `wm-p-<preset>` in any style: `turn`, `turn-once`, `wobble`, `chime`, `swivel`,
`bow`, `lean`, `lift`, `pump`, `squish`, `drift`, `gleam`, and the part moves `pop-up`, `press` (raised parts such as
buttons, lenses and lids pop up or press down) and `hop`. An explicit preset is always taken literally.

**Per-style moves (soft3d).** In `soft3d` every icon offers 3-5 moves: its own (mapped to 3D), then `pop-up` and `press` when
it has raised parts, then `hop`, `turn`, `gleam`, `lift`, `wobble`, `drift`, `squish` until there are three. Other 3D
styles offer the icon's own moves in 3D. List them with `npx withicons motions camera --style soft3d` or MCP `animate_icon`
(`moves` in the result), then pass one as the preset:
`npx withicons animate camera --style soft3d --preset pop-up --format react`.

For an AI or SaaS landing page: one rich 3D style for the hero and feature icons, `motion="inview"` (or `wm-inview`) so
each plays once as it scrolls in, and one calm loop at most; reduced motion still turns everything off.

## Guidelines

- Motion should explain state or invite action: loading (spin/tick), new notification (ring), like (beat/pop),
  play/pause or menu/close (swap). Keep continuous loops to one or two icons per screen.
- Hover effects belong on interactive elements; put `.wm-trigger` on the button so the whole target plays the icon.
  Touch screens have no hover: see "Touch screens" above.
- To replay a one-shot (`wm-once`) from code: remove the class, read `el.offsetWidth`, add it again. In React, do this
  on a ref; changing the `key` remounts the icon (and resets a live icon's value instead of animating it).
- `prefers-reduced-motion: reduce` disables every animation unless `wm-force` is set. Don't set it.
- The accessible name stays on the control; an animated icon is still decorative.

## Icons with a tuned animation

<!-- motion:start -->
734 icons have a tuned animation (any icon can use any preset). The table (icon, loop, hover, swaps, what it says) is in [motion-icons.md](motion-icons.md); grep it for one icon.
<!-- motion:end -->
