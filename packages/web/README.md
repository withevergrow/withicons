# @withicons/web

`<with-icon>`: a dependency-free custom element for 500 icons x 20 styles. Works in any framework or none.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@0.2.0/dist/cdn.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
```

From a CDN the page downloads only what it shows: `cdn.js` (19 KB, 7 KB gzip) plus one small file per icon
and style it renders (`dist/icons/<style>/<name>.js`). A `line` icon is typically 229 bytes (148 gzip);
a `gothic` icon, the richest style, about 7.7 KB (2.6 KB gzip). Five `line` icons cost about
8 KB gzipped in all. The URLs are versioned, so the CDN and the browser cache them for good.
`dist/index.js` works from a CDN too (it switches to the same per-icon files when it is served from one) but also carries
the bundler chunk table (43 KB, 9 KB gzip).

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
| `variant` | `line` | `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush` (`style` is reserved in HTML) |
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
| `@withicons/web/cdn` (`dist/cdn.js`) | element; every icon loads its own file (`dist/icons/<style>/<name>.js`). For `<script type="module">` from a CDN or a self-hosted copy of `dist/` | 19 KB (7 KB gzip) + ~148 bytes gzip per `line` icon shown |
| `@withicons/web` (`dist/index.js`) | element + lazy per-style chunks (`dist/data/<style>.js`); per-icon files when served unbundled from a CDN | 43 KB (9 KB gzip) + one chunk per style used: `line` 116 KB (23 KB gzip), the largest 344 KB (32 KB gzip); a heavy style loads one small shard per icon used (~39 KB, at most 87 KB / 27 KB gzip) |
| `@withicons/web/full` (`dist/full.js`) | every style registered up front (static imports of the chunks), adds sync `svg(name, opts)` | every icon of every style: ~26 MB (6 MB gzip). For scripts and tools, never for a web page |

A style's chunk loads once, the first time an icon of that style renders. The heavy styles (`solid`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`)
are split into shards of a few icons each (`dist/data/<style>/<n>.js`): an icon loads only its own shard, so one `luxe`
icon costs a few KB instead of the whole style. `loadVariant()` and `@withicons/web/data/<style>` still return the whole style. Canonical names resolve with no
extra download (the entry knows every name); an alias loads one small shard (`dist/data/alias/<n>.js`, at most 8 KB), and
only a typo loads `dist/data/meta.js` (113 KB, 28 KB gzip) for the "did you mean" warning. Bundlers (Vite, webpack,
Rollup, esbuild) split the chunks automatically. Use `full` only for scripts and tools that need the sync `svg()`.

**Per-icon files.** `cdn.js` always loads icons from `icons/<style>/<name>.js` next to itself. `index.js` does the same when
it is served unbundled from a package path (jsDelivr, unpkg, `/node_modules/@withicons/web/dist/index.js`); in a bundled app
it uses the chunks. Self-hosting `dist/` under another path? Use `cdn.js`, or call `setIconBase('/vendor/withicons/dist/')`.
Loads are de-duplicated and kept in memory, so ten `home` icons cost one request.

SSR-safe: importing never touches the DOM; the element is only defined when `customElements` exists, so the same import
works in Node, Deno and edge runtimes, where `loadSvg` returns plain markup:

```js
import { loadSvg } from '@withicons/web'
const markup = await loadSvg('home', { variant: 'solid', size: 20 })
```

## Palette styles

`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush` paint a default multi-colour palette. The main ink stays `currentColor`
(so `color` still recolours the outline; `sticker` draws its bold outline with `--with-sticker-ink` instead, `luxe` draws its bold outline with `--with-luxe-ink` instead, `skeuo` draws its bold outline with `--with-skeuo-ink` instead, `anime` draws its bold outline with `--with-anime-ink` instead, `gothic` draws its bold outline with `--with-gothic-ink` instead, `pastel` draws its bold outline with `--with-pastel-ink` instead, `coquette` draws its bold outline with `--with-coquette-ink` instead, `plush` draws its bold outline with `--with-plush-ink` instead) and every other colour is a CSS custom property with a built-in default,
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
| `luxe` | `--with-luxe-accent` #E3AE47, `--with-luxe-c1` #2039B4, `--with-luxe-c2` #C0174F, `--with-luxe-c3` #16206E, `--with-luxe-c4` #7B4A12, `--with-luxe-edge` #9CC2FF, `--with-luxe-ink` #0B1033, `--with-luxe-shadow` #0A0B26, `--with-luxe-shine` #FFFFFF, `--with-luxe-tint` #FFEFC4 |
| `bauhaus` | `--with-bauhaus-accent` #2E7A5E, `--with-bauhaus-c1` #E0412E, `--with-bauhaus-c2` #F2B33D, `--with-bauhaus-c3` #2A6BC2, `--with-bauhaus-c4` #E9772E, `--with-bauhaus-ink` currentColor, `--with-bauhaus-shadow` #151515, `--with-bauhaus-tint` #F3EBDD |
| `skeuo` | `--with-skeuo-accent` #F1CF98, `--with-skeuo-c1` #2F72E4, `--with-skeuo-c2` #BFC7D0, `--with-skeuo-c3` #E0483A, `--with-skeuo-c4` #1E2B3B, `--with-skeuo-edge` currentColor, `--with-skeuo-ink` #4F4638, `--with-skeuo-shadow` #15110D, `--with-skeuo-shine` #FFFFFF, `--with-skeuo-tint` #FFFFFF |
| `anime` | `--with-anime-accent` #FF5D78, `--with-anime-c1` #4BA8F5, `--with-anime-c2` #FF8DB6, `--with-anime-c3` #FFC740, `--with-anime-c4` #5FCF8C, `--with-anime-edge` #BFE6FF, `--with-anime-ink` #2B2148, `--with-anime-shadow` #4B2C8F, `--with-anime-shine` #FFFFFF, `--with-anime-tint` #FFF5EC |
| `gothic` | `--with-gothic-accent` #C79A38, `--with-gothic-c1` #B3163B, `--with-gothic-c2` #2552B4, `--with-gothic-c3` #E6A421, `--with-gothic-c4` #1C8A5F, `--with-gothic-edge` #837A6F, `--with-gothic-ink` #221A26, `--with-gothic-shadow` #140F18, `--with-gothic-shine` #FFF6DE, `--with-gothic-tint` #D3CDC0 |
| `pastel` | `--with-pastel-c1` #CDBBF7, `--with-pastel-c2` #CDBBF7, `--with-pastel-c3` #FFE29C, `--with-pastel-c4` #B7D6FA, `--with-pastel-edge` #B6A1EF, `--with-pastel-ink` #6A55B8, `--with-pastel-shadow` #9E87E6, `--with-pastel-shine` #FFFFFF, `--with-pastel-tint` #ECE5FC |
| `coquette` | `--with-coquette-accent` #D9A45B, `--with-coquette-c1` #F8BCCB, `--with-coquette-c2` #EC8DA6, `--with-coquette-c3` #D7385F, `--with-coquette-c4` #FCEADD, `--with-coquette-edge` #FFFBF6, `--with-coquette-ink` #7E2443, `--with-coquette-shadow` #A8345C, `--with-coquette-shine` #FFFFFF, `--with-coquette-tint` #FFE4EB |
| `plush` | `--with-plush-accent` #FF8DB4, `--with-plush-c1` #F4695E, `--with-plush-c2` #FFC53D, `--with-plush-c3` #4C9FE6, `--with-plush-c4` #4FBF8A, `--with-plush-edge` #FFF9F0, `--with-plush-ink` #4A2C3D, `--with-plush-shadow` #3A1E46, `--with-plush-shine` #FFFFFF, `--with-plush-tint` #FFF0D9 |

Inline SVG (components, `<with-icon>`, sprites, IconNode data) keeps the variables. Standalone `.svg` files have them
flattened to the defaults, because `<img>`, design tools and rasterizers cannot see CSS.

## Animation (optional)

Animations ship separately in [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion), so icons never pay for them.
They work with every style and every package because they animate the element that holds the icon:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/icons/bell.css">

<span class="wm wm-loop" data-wm="bell"><!-- any bell icon --></span>          <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- on hover/focus -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon to icon -->
```

`prefers-reduced-motion` turns every animation off. JS API: `import { motion, swap, motionFor } from '@withicons/motion'`.

With `<with-icon>`, add the element module once and use attributes (it needs `motion.css`; each icon's own defaults come
from `icons.css`, or, from a CDN, the element links just `icons/<name>.css` for each animated icon):

```js
import '@withicons/motion/element'
```
```html
<with-icon name="bell" motion="loop"></with-icon>
<with-icon name="bell" motion="hover" preset="shake"></with-icon>
<with-icon name="play" swap-to="pause" swap-effect="flip" swap-trigger="click" aria-label="Play"></with-icon>
```

## Icon classes (Font Awesome style)

`<i class="with with-home"></i>` tags are their own package, [`@withicons/classes`](https://www.npmjs.com/package/@withicons/classes):

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@0.2.0/dist/with-loader.js" defer></script>
```

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
