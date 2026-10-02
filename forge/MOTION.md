# with icons — motion contract

Animations ship as a **separate, optional package**: `@withicons/motion`. Icons never depend on it.
Motion works on **every style and every package** because it animates the element that holds the icon
(an inline `<svg>`, a `<with-icon>`, an `<i class="with ...">`, or any wrapper), not individual paths.
One optional extra, `draw`, animates strokes and only applies to inline SVGs of stroked styles.

## 1. Per-icon motion spec: `forge/motion/<name>.json`

One file per icon, hand-authored (like skeletons). `name` must equal the filename and an icon in `forge/icons/`.

```json
{
  "name": "bell",
  "intent": "rings like a notification just arrived",
  "loop":  { "preset": "ring", "origin": [12, 3.5], "duration": 1.8 },
  "hover": { "preset": "ring", "origin": [12, 3.5], "amount": 1.2 },
  "alt":   [ { "preset": "shake" }, { "preset": "pop" } ],
  "swap":  [ { "to": "bell-off", "effect": "flip" }, { "to": "bell-ring", "effect": "fade" } ]
}
```

| field | required | meaning |
|---|---|---|
| `intent` | yes | ≤ 80 chars, plain English: what the motion *says* ("spins while loading", "beats like a heart"). Shown on the website. |
| `loop` | yes | the icon's **continuous** animation. Must loop seamlessly and be calm enough to run forever (no violent shake). |
| `hover` | yes | a **one-shot** animation played on hover / focus / tap. May use the same preset as `loop`. |
| `alt` | no | 0–3 other presets that also suit the icon (offered in the editor). |
| `swap` | no | 0–4 transitions to *other icons of the set* that this icon naturally turns into (play→pause, eye→eye-off, menu→close, sun→moon, lock→unlock, heart→heart in solid style). `to` must be an existing icon name **or** `"<name>@<style>"` (same icon, other style, e.g. `"heart@solid"` for a like toggle). |

A **motion object** (`loop`, `hover`, items of `alt`):

| key | type | default | meaning |
|---|---|---|---|
| `preset` | string | — | one of the presets below |
| `origin` | `[x, y]` | `[12, 12]` | pivot in the 24×24 icon grid (bell: top hook; pendulum: pivot; leaf: stem base; flag: pole foot) |
| `dir` | number (deg) | preset default | direction for directional presets. **0 = right, 90 = down, 180 = left, 270 = up** (SVG coordinates). An arrow-up-right nudges at `315`. |
| `amount` | number 0.25–2 | 1 | intensity multiplier (angle / distance / scale delta) |
| `duration` | number s 0.3–6 | preset default | one cycle |
| `steps` | int 0–12 | 0 | > 0 makes the motion stepped (`loader` uses 8; a clock hand 12) |

`swap` items: `{ "to": "<name>|<name>@<style>", "effect": "<swap effect>" }`.

## 2. Presets (the closed vocabulary)

Every preset is a CSS `@keyframes` named `wm-<preset>` in `motion.css`, driven by CSS variables so one keyframe
serves every icon: `--wm-ox --wm-oy` (origin, %), `--wm-dx --wm-dy` (unit direction), `--wm-k` (amount),
`--wm-dur` (seconds), `--wm-steps`.

| preset | motion | default dur | good for |
|---|---|---|---|
| `spin` | full 360° turn, linear | 1.2 s | loader, refresh, settings (slow), fan, globe (slow) |
| `spin-once` | 360° turn eased, rests | 0.8 s | refresh/rotate on hover |
| `tick` | stepped rotation (set `steps`) | 1 s | clock, timer, loader with 8 steps |
| `pulse` | scale 1 → 1.1 → 1 | 1.4 s | record, live, target, notification dot |
| `beat` | heartbeat double-thump | 1.2 s | heart, heart-pulse, like |
| `breathe` | slow scale + opacity swell | 3 s | moon, leaf, meditation, calm things |
| `float` | gentle vertical bob | 2.6 s | cloud, balloon, plane, ghost, bot |
| `bounce` | drop-and-squash bounce | 1 s | ball, package, download badge, pin |
| `sway` | slow rotate ±6° about origin | 2.8 s | plant, leaf, flag, tree, flame base |
| `ring` | decaying swing ±16° about origin | 1.4 s | bell, alarm-clock |
| `wiggle` | quick small rotate jitter | 0.8 s | edit, pencil, brush, bug |
| `shake` | horizontal shake (no) | 0.6 s | error, lock denied, x-circle, ban |
| `nod` | vertical nod (yes) | 0.8 s | check, thumbs-up |
| `nudge` | move along `dir` and back | 1.2 s | arrows, chevrons, send, external-link, log-out |
| `pass` | slide out along `dir`, re-enter from the opposite side | 1.4 s | arrow conveyor, fast-forward, upload/download payload |
| `rise` | move up and fade, reappear | 1.6 s | upload, rocket, steam, balloon |
| `drop` | move down and fade, reappear | 1.6 s | download, droplet, rain |
| `blink` | squash Y at origin (eye blink) | 3.5 s | eye, smile, bot |
| `flicker` | irregular opacity / tiny scale | 1.6 s | flame, zap, lightbulb, candle |
| `twinkle` | scale + small rotate + glow | 1.8 s | star, sparkles, wand, gem |
| `pop` | 0.85 → 1.12 → 1 (one-shot friendly) | 0.5 s | add, plus, gift, badge, like |
| `tada` | scale + rock celebration | 1 s | trophy, award, party, crown |
| `jelly` | squash-and-stretch wobble | 0.9 s | toggle, button-ish, smile |
| `flip` | rotateY 360° | 1.2 s | coin, card, id-card, swap, repeat |
| `rock` | slow rotate ±10° | 2.4 s | boat, anchor, hourglass, cradle |
| `tilt` | lean ±8° and hold | 1.6 s | search lens, magnet, cursor |
| `zoom` | scale up 1.18 and back | 1.2 s | zoom-in/out, maximize, focus |
| `orbit` | small circular drift | 2.4 s | planet, satellite, atom, compass needle-ish |
| `glow` | drop-shadow halo pulse in currentColor | 1.8 s | lightbulb, sun, sparkles, power |
| `draw` | strokes draw on (dash offset), stroked styles only, falls back to `pop` | 1.6 s | signature, pen-tool, route, chart-line, check |
| `type` | tiny stepped jitter like keystrokes | 0.9 s | keyboard, terminal, type, chat bubbles |
| `fill` | opacity ramps 0.35 → 1 (charging) | 1.6 s | battery-charging, signal, wifi, volume, progress |

**Swap effects** (icon A turns into icon B): `fade`, `scale`, `rotate`, `flip`, `slide-up`, `slide-down`,
`slide-left`, `slide-right`, `blur`, `spin`, `morph` (scale + rotate + blur together), `draw` (stroked styles; falls back to `fade`).

## 3. Public API (implemented by `packages/motion`; the website uses the same files)

Pure CSS, no JS required:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/icons.css"> <!-- per-icon defaults -->

<!-- continuous: the icon's own loop (from icons.css) -->
<span class="wm wm-loop" data-wm="bell"> <svg …bell…/> </span>
<!-- one-shot on hover/focus of the icon, or of any ancestor with .wm-trigger (e.g. a button) -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell"><svg…/></span> Notifications</button>
<!-- choose a preset explicitly (overrides the icon default), with options as CSS vars -->
<span class="wm wm-loop wm-p-spin" style="--wm-dur:2s"><svg…/></span>
<!-- swap: two icons stacked; shows B on hover of .wm-trigger, or when the wrapper has .is-on / aria-pressed="true" -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a" …play…/><svg class="wm-b" …pause…/></span>
```

Classes: `wm` (base), triggers `wm-loop` `wm-hover` `wm-once` (plays once on load) `wm-inview` (JS) `wm-paused`;
explicit preset `wm-p-<preset>`; swap wrapper `wm-swap` + `wm-fx-<effect>` with children `wm-a` / `wm-b`,
toggled by `.wm-trigger:hover`, `:focus-visible`, `.is-on` or `[aria-pressed="true"]`.
`prefers-reduced-motion: reduce` disables everything unless the element also has `wm-force`.

JS (`import { motion, swap, motionFor, PRESETS, EFFECTS } from '@withicons/motion'`):
- `motionFor(name)` → the icon's spec (from `dist/icons.js`) or null
- `motion(el, nameOrSpec, { trigger: 'loop'|'hover'|'once'|'inview', preset?, duration?, amount? })` → applies classes/vars, returns `{ play(), pause(), destroy() }`
- `swap(el, { from: svgOrHtml, to: svgOrHtml, effect, trigger: 'hover'|'click'|'manual' })` → builds the stacked swap, returns `{ toggle(on?), destroy() }`
- Importing `@withicons/motion/element` upgrades `<with-icon motion="loop|hover|once" preset="…" swap-to="name" swap-effect="flip">`.

Generated outputs (owned by `forge/lib/emit-motion.mjs`): `packages/motion/dist/{motion.css,icons.css,icons.js,index.js,element.js,*.d.ts}`,
and for the website `site/vendor/motion/motion.css`, `site/vendor/motion/motion.js` (classic script exposing `window.WithMotion`)
and `site/data/motion.js` (`window.WITH_MOTION = { <name>: spec }`).

Validate specs with `node forge/tools/check-motion.mjs [names...]`.

## Implementation notes (`packages/motion`, `forge/lib/emit-motion.mjs`)

Hand-written sources: `packages/motion/src/{meta,keyframes,index,element,export}.js` (+ `.d.ts`, `README.md`).
`node forge/lib/emit-motion.mjs` regenerates every motion output without the full build; `npm test -w @withicons/motion` checks them.

- **Durations.** `duration` is one loop cycle in `loop`, and the length of the one-shot in `hover`. Each preset has a
  one-shot length and a loop cycle (`PRESET_DEFAULTS[p].shot / .cycle`). One-shot presets (`pop`, `ring`, `tada`, `blink`, …)
  have a second keyframes block `wm-<preset>-loop` that plays the action then rests, so a looping `pop` breathes instead of
  stuttering. Continuous presets (`spin`, `float`, `breathe`, …) use `wm-<preset>` for both.
- **Variables.** Public: `--wm-dur --wm-k --wm-ox --wm-oy --wm-dx --wm-dy --wm-steps --wm-ease --wm-delay`, plus
  `--wm-glow` (halo colour of `glow`/`twinkle`), `--wm-swap-dur`, `--wm-swap-cycle`, `--wm-persp` (flip swap depth).
  Internal (do not set): icons.css writes `--wmL…` (loop) and `--wmH…` (hover) per icon; `wm-p-<preset>` writes `--wmP…`.
  Resolution order: `--wm-*` (yours) > explicit preset > the icon's slot > preset default.
- **Steps.** `steps` / `--wm-steps` (≥ 1) only affect presets without built-in easing: `spin`, `tick`, `orbit`.
  `--wm-steps` works from an inline style (`style="--wm-steps:8"`); elsewhere set `--wm-ease: steps(8)`.
- **Origin.** On a wrapper (span, svg, with-icon, i.with) percentages are of its box = the 24-grid. Inside an SVG
  (`svg .wm`, exported `<g>`) `transform-box: view-box` keeps the same 24-grid meaning.
- **Triggers.** CSS-only `wm-hover` plays while hovered/focused (it snaps back if the pointer leaves mid-way);
  `motion(el, name, { trigger: 'hover' })` adds `wm-js` and plays the one-shot to the end on pointerenter / focusin / tap.
  `wm-inview` plays the hover one-shot each time the element enters the viewport (JS). `wm-run` is the JS "play now" class.
  `<with-icon>` also works by attribute: `motion="loop|hover|once|inview"`, `preset="…"`, `paused`, and icons.css matches `with-icon[name="…"]`.
- **draw.** Needs the runtime (`motion()`, `prepareDraw()`, the element module or `animatedSvg()`), which sets `pathLength="1"`
  on stroked shapes (`data-wm-pl`) and marks filled/dashed ones `data-wm-fill` (they fade in). Without it, or on filled styles, `draw` = `pop`.
- **Swaps.** Toggling uses CSS *transitions* (reversible mid-way, A exits fast, B enters with a spring); the same states also
  exist as keyframes `wm-fx-<effect>-a / -b` used by `.wm-swap.wm-loop` (alternates forever) and by exports.
  Extra "on" states besides `.is-on` / `[aria-pressed="true"]`: `[aria-expanded="true"]`, `[aria-checked="true"]`, on the wrapper or an ancestor.
  `draw` swaps retract A and draw B (needs `.wm-drawable`, set by `swap()`), otherwise fade.
- **Derived specs.** Icons without `forge/motion/<name>.json` get a spec derived from name keywords / direction words /
  category, marked `"auto": true` in `icons.js` and `site/data/motion.js`. Swaps to icons that do not exist yet are dropped.
- **Extras beyond §3.** `motionAttrs(nameOrSpec, options)` (class/data-wm/style for framework markup), `prepareDraw`,
  `PRESET_DEFAULTS`, `EFFECT_DEFAULTS`, `specVars`; calling `motion()`/`swap()` again on an element replaces the previous one.
  `@withicons/motion/export`: `animatedSvg(svg, opts)` (self-contained, only the keyframes it needs, scoped class; `swapTo` for
  A↔B), `frameSvg`, `renderFrames` (canvases), `encodeGif`, `gif`, `webm`. The website's `window.WithMotion` has all of it.
- **Swap timing (per swap).** On the `wm-swap` wrapper or any ancestor: `--wm-swap-dur` (one transition; default the
  effect's own, `EFFECT_DEFAULTS`), `--wm-swap-ease` (easing of the incoming icon's movement; default the effect's own:
  a spring for scale / rotate / spin / morph, a soft landing for the rest; named feels in `SWAP_EASES`: springy, smooth,
  snappy, gentle, linear), `--wm-swap-delay` (wait before switching; it shifts every part of the transition, the draw
  effect's inner delays included), `--wm-swap-hold` (auto: rest on each icon, default `SWAP_HOLD` = 0.9 s). Unset, the
  generated CSS is the original look (each var falls back to the old literal value).
- **Auto swaps.** `wm-swap-auto`: CSS-only A → B → A loop with keyframes `wm-fx-<effect>-auto-a / -b` built from
  `swapLoopStops(effect, swapCycle(dur, SWAP_HOLD), dur, { hold })`; its duration is `2 × (--wm-swap-dur + --wm-swap-hold)`, so a
  custom duration or hold stretches the default proportions. `swap(el, { trigger: 'auto', duration, hold, delay, ease })`
  and `<with-icon swap-trigger="auto">` add `wm-js` and time real transitions with a timer instead (exact, reversible,
  paused offscreen / in hidden tabs, still under reduced motion). `swapLoopStops(effect, cycle, d, { hold, ease })` lets a
  transition take up to half the cycle when built from a hold (the legacy 24% cap stays for `wm-loop`).
- **Focus swaps.** `wm-swap-focus`: After shows while a `.wm-trigger` ancestor has `:focus-within`, or the wrapper itself.
  Hover / keyboard-focus previews skip wrappers that are `.wm-js` (script-driven), `.wm-swap-focus`, `.wm-swap-auto` or
  `.wm-loop`.
- **Element swap attributes.** `swap-trigger="click|hover|focus|auto|manual"`, `swap-duration`, `swap-ease`, `swap-delay`,
  `swap-hold` (seconds), `swap-color` (After's ink) and `swap-colors` (After's own `--with-*` declarations, set on the inner
  B so they win over the host's). Every repaint re-applies them (`dressSwap`), so changing an attribute updates in place.
- **Swap exports.** `animatedSwapSvg(a, b, { effect, duration, hold, ease })`: with `hold` the cycle is `swapCycle(duration, hold)`;
  without it the legacy 2.4 s (`cycle` still wins). `exportDuration({ swapTo, … })` follows the same rule, so `gif()` /
  `video()` record whole cycles. Each icon keeps its own root attributes and colours (bake them into each SVG).
- **The website editor (`site/js/editor.js`, "Turn into").** One state object (to, toStyle, link, effect, speed / dur,
  ease, delay, hold, trigger, on, paused) drives every live copy, the code and the exports. Live copies are `.wm-swap.wm-js`
  wrappers whose markup only changes with the drawing; on / off is a class applied by `syncSwaps()`, so switching
  mid-transition reverses smoothly and re-rendering never replays a switch. Both forms carry every `--with-*` variable they
  use (`initial` when not customised), so palettes never leak between Before and After or in from the page. After's
  drawing in any style comes from its own icon page (`site/icons/<name>.html` symbols, ~110 KB) before falling back to a
  style data file.

## Parts choreography (run 9)

Whole-element motion made decorations spin with the object (a Bauhaus backdrop square spinning with the sun).
From run 9, **renderers tag what they draw** and **motion animates parts**:

| class on an SVG node | meaning | default behaviour while the icon animates |
|---|---|---|
| `wm-k` / `wm-a` / `wm-s` | the object, by skeleton plate (K body, A moving/secondary part, S badge/modifier) — only where a style keeps plates as separate nodes | the main preset (K), optionally a part override (A/S) |
| (no class) | object geometry a style fuses together | treated as `wm-k` |
| `wm-deco` | decoration that is not the object: backdrop shapes, sparkles, hearts, stars, confetti, accent dots | its own gentle loop (`breathe` / `float` / `twinkle`, counter-phased), never the main preset |
| `wm-shadow` | cast/drop shadow, ground, extrusion that sits under the object | stays put; squashes/fades in sync for `bounce`, `float`, `rise`, `drop`, `jelly` |
| `wm-shine` | specular highlight on the object | moves with the object; may glint once per loop |

Classes are tiny (`class="wm-deco"`), harmless without motion CSS, and preserved by every package. Rotations use
`transform-box: view-box` so every part pivots around the same `origin` in icon coordinates.

Spec additions in `forge/motion/<name>.json` (all optional; validated by check-motion):

```json
{ "parts": { "A": { "preset": "ring", "origin": [12, 18], "amount": 1.6, "delay": 0.08 } },
  "deco": "float" }
```

- `parts.A` / `parts.S`: a motion object (+ `delay` seconds, 0–1) for that plate, applied when the style exposes plates;
  otherwise the whole object plays the main preset.
- `deco`: `"breathe" | "float" | "twinkle" | "still"` (default: chosen by the engine per preset).
