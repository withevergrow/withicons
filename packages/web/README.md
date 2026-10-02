# @withicons/web

`<with-icon>`: a dependency-free custom element for 500 icons x 12 styles. Works in any framework or none.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@0.2.0/dist/index.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
```

Or with a bundler:

```bash
npm i @withicons/web
```
```js
import '@withicons/web'   // registers <with-icon>; each style's data loads on first use
```

## Attributes

| attribute | default | notes |
|---|---|---|
| `name` | — | canonical name or unambiguous alias (`bin` -> `trash`) |
| `variant` | `line` | `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro` (`style` is reserved in HTML) |
| `size` | `24` | px number or any CSS length |
| `color` | `currentColor` | inherits the CSS text color by default |
| `stroke-width` | style default | only styles with live strokes (line, duo, blueprint, sketch, kawaii) |
| `absolute-stroke-width` | off | keep the stroke constant in px at any size |
| `label` | — | accessible name on the inner svg (`role="img"`); otherwise the svg is `aria-hidden` |
| `aria-label` / `aria-labelledby` | — | also work: the element itself becomes `role="img"` with that name |
| `mirror-rtl` | off | mirror the icon in right-to-left text (`dir="rtl"`), for directional icons such as `arrow-right` or `undo` |

The same names work as JS properties (`el.variant = 'solid'`, `el.strokeWidth = 1.5`, `el.mirrorRtl = true`).
Style the inner svg with `with-icon::part(svg)`:

```css
with-icon::part(svg) { transition: transform .2s }
button:hover with-icon::part(svg) { transform: scale(1.1) }
```

Unknown names render nothing and log one console warning with the nearest matches.

## Entry points

| import | what | size |
|---|---|---|
| `@withicons/web` (`dist/index.js`) | element + lazy per-style chunks (`dist/data/<style>.js`) | 11 KB (4 KB gzip) + one chunk per style used: `line` 103 KB (23 KB gzip), the largest 1466 KB (360 KB gzip) |
| `@withicons/web/full` (`dist/full.js`) | one file, every style inline, adds sync `svg(name, opts)` | ~8177 KB (1855 KB gzip) |

A style's chunk loads once, the first time an icon of that style renders. Aliases and typos also load `dist/data/meta.js`
(113 KB, 28 KB gzip), so canonical names are the fastest. Bundlers (Vite, webpack, Rollup, esbuild) split the
chunks automatically. Use `full` only where a single file matters more than size.

SSR-safe: importing never touches the DOM; the element is only defined when `customElements` exists, so the same import
works in Node, Deno and edge runtimes, where `loadSvg` returns plain markup:

```js
import { loadSvg } from '@withicons/web'
const markup = await loadSvg('home', { variant: 'solid', size: 20 })
```

## Palette styles

`glass`, `kawaii`, `sticker`, `pixel`, `retro` paint a default multi-colour palette. The main ink stays `currentColor`
(so `color` still recolours the outline; `sticker` draws its bold outline with `--with-sticker-ink` instead) and every other colour is a CSS custom property with a built-in default,
so you can re-theme a page, a section or one icon without touching the SVG:

```css
.brand { --with-kawaii-fill-1: #c4b5fd; --with-retro-1: #fde047; }
```

| style | variables (default) |
|---|---|
| `glass` | `--with-glass-accent` #FF4D8D, `--with-glass-back` #3D5AFE, `--with-glass-etch` #1B2390, `--with-glass-frost` #FFFFFF, `--with-glass-pane` #C7D0FF, `--with-glass-shine` #FFFFFF |
| `kawaii` | `--with-kawaii-accent` #FF5C9A, `--with-kawaii-blush` #FF6F9C, `--with-kawaii-face` currentColor, `--with-kawaii-fill-1` #FF6FA5, `--with-kawaii-fill-2` #FF9A66, `--with-kawaii-fill-3` #FFD23A, `--with-kawaii-fill-4` #45D99A, `--with-kawaii-fill-5` #5AB4FF, `--with-kawaii-fill-6` #A98BFF, `--with-kawaii-shine` #FFFFFF, `--with-kawaii-sparkle` #FFB627 |
| `sticker` | `--with-sticker-bubblegum` #FF6FB5, `--with-sticker-edge` #FFFFFF, `--with-sticker-grape` #A98BFF, `--with-sticker-ink` #1D1530, `--with-sticker-lemon` #FFD43B, `--with-sticker-mint` #3FDDA4, `--with-sticker-peach` #FF9563, `--with-sticker-shadow` #1D1530, `--with-sticker-shine` #FFFFFF, `--with-sticker-sky` #5BC6FF |
| `pixel` | `--with-pixel-fill` currentColor, `--with-pixel-shine` #FFFFFF |
| `retro` | `--with-retro-1` #F4B53F, `--with-retro-2` #EF7D2D, `--with-retro-3` #DE4B3A, `--with-retro-4` #178A86, `--with-retro-shadow` #6B3323 |

Inline SVG (components, `<with-icon>`, sprites, IconNode data) keeps the variables. Standalone `.svg` files have them
flattened to the defaults, because `<img>`, design tools and rasterizers cannot see CSS.

## Animation (optional)

Animations ship separately in [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion), so icons never pay for them.
They work with every style and every package because they animate the element that holds the icon:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/icons.css">

<span class="wm wm-loop" data-wm="bell"><!-- any bell icon --></span>          <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- on hover/focus -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon to icon -->
```

`prefers-reduced-motion` turns every animation off. JS API: `import { motion, swap, motionFor } from '@withicons/motion'`.

With `<with-icon>`, add the element module once and use attributes (it needs `motion.css`, plus `icons.css` for the
per-icon defaults):

```js
import '@withicons/motion/element'
```
```html
<with-icon name="bell" motion="loop"></with-icon>
<with-icon name="bell" motion="hover" preset="shake"></with-icon>
<with-icon name="play" swap-to="pause" swap-effect="flip" swap-trigger="click" aria-label="Play"></with-icon>
```

<!-- with-classes:start -->
## Icon classes (Font Awesome style)

Plain `<i>`/`<span>` elements with classes, no build step. Two interchangeable ways to render them:

### 1. CSS only (zero JS)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-line.css">

<i class="with with-home"></i>                      <!-- line (default) -->
<i class="with with-search with-2x with-spin"></i>
```

One file per style (`with-line.css`, `with-solid.css`, `with-duo.css`, `with-gloss.css`, `with-engrave.css`, `with-blueprint.css`, `with-sketch.css`, `with-glass.css`, `with-kawaii.css`, `with-sticker.css`, `with-pixel.css`, `with-retro.css`) or every style at once:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-all.css">

<i class="with with-home with-solid"></i>
<span class="with with-heart with-gloss"></span>
```

Without a style class an icon is `line` (when `with-line.css` or `with-all.css` is loaded; if you load a single other style file,
bare `with with-<name>` uses that style). Each icon is an SVG data-URI used as a CSS `mask` over `currentColor` (drawn in the
element's `::after`), so it takes the text colour and font size (`1em` square, `vertical-align: -.125em`). In mono styles the duo tint
and blueprint construction lines render as translucent `currentColor`.

**Palette styles** (`glass`, `kawaii`, `sticker`, `pixel`, `retro`) keep their colours in CSS-only mode too: the palette is the element's
`background-image` (default colours baked in) and the ink is the `currentColor` mask on top, with the original stacking order
preserved, so `color` still recolours the outline. The `--with-<style>-<role>` variables cannot reach into a data URI, so to
re-theme a palette use the JS runtime below (or a component), where every variable works.

Use the JS runtime for live CSS variables and stroke width.

| file | size | gzip |
|---|---|---|
| `with-line.css` | 199 KB | 25 KB |
| `with-solid.css` | 647 KB | 186 KB |
| `with-duo.css` | 309 KB | 32 KB |
| `with-gloss.css` | 759 KB | 179 KB |
| `with-engrave.css` | 1129 KB | 290 KB |
| `with-blueprint.css` | 595 KB | 94 KB |
| `with-sketch.css` | 614 KB | 142 KB |
| `with-glass.css` | 2711 KB | 403 KB |
| `with-kawaii.css` | 846 KB | 126 KB |
| `with-sticker.css` | 2103 KB | 227 KB |
| `with-pixel.css` | 514 KB | 39 KB |
| `with-retro.css` | 1103 KB | 256 KB |
| `with-all.css` | 11381 KB | 1959 KB |
| `with-icons.js` | 14 KB | 5 KB |

### 2. JS runtime (inline SVG)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>
```

A classic (non-module), dependency-free script. It injects an inline `<svg class="with-svg">` into every element with class
`with` and an `with-<name>` class, and keeps doing so for elements added or changed later (MutationObserver on added nodes and
`class` / `aria-label` / `data-with-stroke-width` changes). Only the styles actually used are downloaded
(`dist/data/<style>.js`, resolved relative to the script's URL; override with `data-with-base="…/"` on the script tag).
It can be combined with the CSS files: the mask shows until the SVG arrives, then it is switched off.

- `data-with-stroke-width="1.5"` on the element: stroke width for `line`, `duo`, `blueprint`, `sketch`, `kawaii`.
- Aliases work (`with-bin` -> `trash`, with a one-time console hint); unknown names warn with the nearest suggestions.
- Opt a subtree out with `data-with-skip`.
- `window.WithIcons`: `render(root?)`, `svg(name, style?, opts?)` (Promise of an svg string), `load(style)`, `styles`, `version`.
  Types: `dist/classes/with-icons.d.ts`.

### Modifiers

| class | effect |
|---|---|
| `with-xs` / `with-sm` / `with-lg` | .75em / .875em / 1.33em (lg also `vertical-align: -.25em`) |
| `with-2x` … `with-5x` | 2em … 5em |
| `with-fw` | fixed width 1.25em, icon centred (for lists / menus) |
| `with-spin` / `with-pulse` | rotate continuously (1.6s linear) / in 8 steps; disabled under `prefers-reduced-motion` |
| `with-rotate-90` / `-180` / `-270` | rotate |
| `with-flip-h` / `with-flip-v` / `with-flip-both` | mirror (combines with rotate and spin) |
| `with-rtl` | mirror only inside right-to-left text (`dir="rtl"`), for directional icons (`with-arrow-right`, `with-undo`…) |

### Accessibility

Icons are decorative by default (empty element; the JS-rendered svg is `aria-hidden`). For a meaningful icon give the element
a name: `<i class="with with-trash" role="img" aria-label="Delete"></i>`. With the JS runtime, an `aria-label` also becomes the
svg's `role="img"` + `<title>`. Inside a labelled button keep the icon decorative.

CSS-only icons stay visible in Windows High Contrast (forced colours: the ink takes the system text, link or button colour)
and they print even with the browser's "Background graphics" option off.

### CSS or JS?

- **CSS**: zero JS, works in emails-to-web, static sites, CMS content; one HTTP request; palette styles in their default colours.
- **JS**: live CSS variables (`--with-duo`, `--with-accent`, `--with-<style>-<role>`), `data-with-stroke-width`, aliases and typo hints, only the styles you use are fetched.
- Using a framework? Prefer the component packages (`@withicons/react`, `vue`, `svelte`…) or `<with-icon>`.
<!-- with-classes:end -->

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
