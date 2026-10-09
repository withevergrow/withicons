# @withicons/web

`<with-icon>`: a dependency-free custom element for 734 icons x 34 styles. Works in any framework or none.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
```

From a CDN the page downloads only what it shows: `cdn.js` (24 KB, 9 KB gzip) plus one small file per icon
and style it renders (`dist/icons/<style>/<name>.js`). A `line` icon is typically 265 bytes (158 gzip);
a `soft3d` icon, the richest style, about 9.1 KB (2.0 KB gzip). Five `line` icons cost about
10 KB gzipped in all. The URLs are versioned, so the CDN and the browser cache them for good.
`dist/index.js` works from a CDN too (it switches to the same per-icon files when it is served from one) but also carries
the bundler chunk table (133 KB, 16 KB gzip).

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
| `variant` | `line` | `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` (`style` is reserved in HTML) |
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
| `@withicons/web/cdn` (`dist/cdn.js`) | element; every icon loads its own file (`dist/icons/<style>/<name>.js`). For `<script type="module">` from a CDN or a self-hosted copy of `dist/` | 24 KB (9 KB gzip) + ~158 bytes gzip per `line` icon shown |
| `@withicons/web` (`dist/index.js`) | element + lazy per-style chunks (`dist/data/<style>.js`); per-icon files when served unbundled from a CDN | 133 KB (16 KB gzip) + one chunk per style used: `line` 214 KB (45 KB gzip), the largest 214 KB (45 KB gzip); a heavy style loads one small shard per icon used (~40 KB, at most 111 KB / 30 KB gzip) |
| `@withicons/web/full` (`dist/full.js`) | every style registered up front (static imports of the chunks), adds sync `svg(name, opts)` | every icon of every style: ~96 MB (20 MB gzip). For scripts and tools, never for a web page |

A style's chunk loads once, the first time an icon of that style renders. The heavy styles (`solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`)
are split into shards of a few icons each (`dist/data/<style>/<n>.js`): an icon loads only its own shard, so one `luxe`
icon costs a few KB instead of the whole style. `loadVariant()` and `@withicons/web/data/<style>` still return the whole style. Canonical names resolve with no
extra download (the entry knows every name); an alias loads one small shard (`dist/data/alias/<n>.js`, at most 11 KB), and
only a typo loads `dist/data/meta.js` (167 KB, 42 KB gzip) for the "did you mean" warning. Bundlers (Vite, webpack,
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

`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` paint a default multi-colour palette. The main ink stays `currentColor`
(so `color` still recolours the outline; `sticker` draws its bold outline with `--with-sticker-ink` instead, `pixel` draws its bold outline with `--with-pixel-ink` instead, `luxe` draws its bold outline with `--with-luxe-ink` instead, `skeuo` draws its bold outline with `--with-skeuo-ink` instead, `anime` draws its bold outline with `--with-anime-ink` instead, `gothic` draws its bold outline with `--with-gothic-ink` instead, `pastel` draws its bold outline with `--with-pastel-ink` instead, `coquette` draws its bold outline with `--with-coquette-ink` instead, `plush` draws its bold outline with `--with-plush-ink` instead, `clay` draws its bold outline with `--with-clay-ink` instead, `bento` draws its bold outline with `--with-bento-ink` instead, `suite` draws its bold outline with `--with-suite-ink` instead, `dock` draws its bold outline with `--with-dock-ink` instead, `liquid` draws its bold outline with `--with-liquid-ink` instead, `chrome` draws its bold outline with `--with-chrome-ink` instead, `soft3d` draws its bold outline with `--with-soft3d-ink` instead, `utsav` draws its bold outline with `--with-utsav-ink` instead, `rangoli` draws its bold outline with `--with-rangoli-ink` instead, `halloween` draws its bold outline with `--with-halloween-ink` instead, `christmas` draws its bold outline with `--with-christmas-ink` instead, `lunar` draws its bold outline with `--with-lunar-ink` instead, `valentine` draws its bold outline with `--with-valentine-ink` instead) and every other colour is a CSS custom property with a built-in default,
so you can re-theme a page, a section or one icon without touching the SVG:

```css
.brand { --with-kawaii-c1: #c4b5fd; --with-retro-1: #fde047; }
```

| style | variables (default) |
|---|---|
| `glass` | `--with-glass-accent` #F2679E, `--with-glass-back` #7484FF, `--with-glass-c1` #F07CA2, `--with-glass-c2` #E2577F, `--with-glass-c3` #F5B82E, `--with-glass-c4` #FF8A3D, `--with-glass-etch` #3E3A8C, `--with-glass-frost` #FFFFFF, `--with-glass-pane` #E4E8FF, `--with-glass-shadow` #6A45D6, `--with-glass-shine` #FFFFFF |
| `kawaii` | `--with-kawaii-accent` #FF5C9A, `--with-kawaii-blush` #FF6F9C, `--with-kawaii-c1` #BB9275, `--with-kawaii-c2` #504948, `--with-kawaii-c4` #85CDC5, `--with-kawaii-face` currentColor, `--with-kawaii-fill-1` #FF6FA5, `--with-kawaii-fill-2` #FF9A66, `--with-kawaii-fill-3` #FFD23A, `--with-kawaii-fill-4` #45D99A, `--with-kawaii-fill-5` #5AB4FF, `--with-kawaii-fill-6` #A98BFF, `--with-kawaii-shine` #FFFFFF, `--with-kawaii-sparkle` #FFB627 |
| `sticker` | `--with-sticker-accent` #FF6FB5, `--with-sticker-bubblegum` #FF6FB5, `--with-sticker-c1` #A96539, `--with-sticker-c2` #2A2120, `--with-sticker-c4` #22A495, `--with-sticker-edge` #FFFFFF, `--with-sticker-grape` #A98BFF, `--with-sticker-ink` #1D1530, `--with-sticker-lemon` #FFD43B, `--with-sticker-mint` #3FDDA4, `--with-sticker-peach` #FF9563, `--with-sticker-shadow` #1D1530, `--with-sticker-shine` #FFFFFF, `--with-sticker-sky` #5BC6FF |
| `pixel` | `--with-pixel-accent` #FF8A1F, `--with-pixel-c2` #E53935, `--with-pixel-c3` #B71C1C, `--with-pixel-fill` currentColor, `--with-pixel-ink` #23263A, `--with-pixel-shadow` #7A4A2A, `--with-pixel-shine` #FFFFFF, `--with-pixel-tint` #B9D5F3 |
| `retro` | `--with-retro-1` #F4B53F, `--with-retro-2` #EF7D2D, `--with-retro-3` #DE4B3A, `--with-retro-4` #178A86, `--with-retro-cream` #FFF3D9, `--with-retro-letter` #2A160E, `--with-retro-shadow` #6B3323, `--with-retro-tint` #FFF3D9 |
| `luxe` | `--with-luxe-accent` #E3AE47, `--with-luxe-c1` #2039B4, `--with-luxe-c2` #C0174F, `--with-luxe-c3` #16206E, `--with-luxe-c4` #7B4A12, `--with-luxe-edge` #9CC2FF, `--with-luxe-ink` #0B1033, `--with-luxe-shadow` #0A0B26, `--with-luxe-shine` #FFFFFF, `--with-luxe-tint` #FFEFC4 |
| `bauhaus` | `--with-bauhaus-accent` #2E7A5E, `--with-bauhaus-c1` #E0412E, `--with-bauhaus-c2` #F2B33D, `--with-bauhaus-c3` #2A6BC2, `--with-bauhaus-c4` #2A6BC2, `--with-bauhaus-ink` currentColor, `--with-bauhaus-shadow` #151515, `--with-bauhaus-tint` #F3EBDD |
| `skeuo` | `--with-skeuo-accent` #F1CF98, `--with-skeuo-c1` #5560E0, `--with-skeuo-c2` #BFC7D0, `--with-skeuo-c3` #E0483A, `--with-skeuo-c4` #1E2B3B, `--with-skeuo-edge` currentColor, `--with-skeuo-ink` #22160F, `--with-skeuo-shadow` #15110D, `--with-skeuo-shine` #FFFFFF, `--with-skeuo-tint` #FFFFFF |
| `anime` | `--with-anime-accent` #FF5D78, `--with-anime-c1` #4BA8F5, `--with-anime-c2` #FF8DB6, `--with-anime-c3` #FFC740, `--with-anime-c4` #5FCF8C, `--with-anime-edge` #BFE6FF, `--with-anime-ink` #2B2148, `--with-anime-shadow` #4B2C8F, `--with-anime-shine` #FFFFFF, `--with-anime-tint` #FFF5EC |
| `gothic` | `--with-gothic-accent` #C79A38, `--with-gothic-c1` #B3163B, `--with-gothic-c2` #2552B4, `--with-gothic-c3` #E6A421, `--with-gothic-c4` #1C8A5F, `--with-gothic-edge` #837A6F, `--with-gothic-ink` #221A26, `--with-gothic-shadow` #140F18, `--with-gothic-shine` #FFF6DE, `--with-gothic-tint` #D3CDC0 |
| `pastel` | `--with-pastel-accent` #FFC3D7, `--with-pastel-c1` #CDBBF7, `--with-pastel-c2` #CDBBF7, `--with-pastel-c3` #FFE29C, `--with-pastel-c4` #ABE6CD, `--with-pastel-edge` #B6A1EF, `--with-pastel-ink` #6A55B8, `--with-pastel-shadow` #9E87E6, `--with-pastel-shine` #FFFFFF, `--with-pastel-tint` #ECE5FC |
| `coquette` | `--with-coquette-accent` #D9A45B, `--with-coquette-c1` #F8BCCB, `--with-coquette-c2` #EC8DA6, `--with-coquette-c3` #D7385F, `--with-coquette-c4` #FCEADD, `--with-coquette-edge` #FFFBF6, `--with-coquette-ink` #7E2443, `--with-coquette-shadow` #A8345C, `--with-coquette-shine` #FFFFFF, `--with-coquette-tint` #FFE4EB |
| `plush` | `--with-plush-accent` #FF8DB4, `--with-plush-c1` #F4695E, `--with-plush-c2` #FFC53D, `--with-plush-c3` #4C9FE6, `--with-plush-c4` #4FBF8A, `--with-plush-edge` #FFF9F0, `--with-plush-ink` #4A2C3D, `--with-plush-shadow` #3A1E46, `--with-plush-shine` #FFFFFF, `--with-plush-tint` #FFF0D9 |
| `clay` | `--with-clay-accent` #E89A1C, `--with-clay-c1` #7B6CFF, `--with-clay-c2` #FFB257, `--with-clay-c3` #FF5C97, `--with-clay-c4` #2CC0A8, `--with-clay-ink` #2A1D5C, `--with-clay-shadow` #24166B, `--with-clay-shine` #FFFFFF, `--with-clay-tint` #E3DEFF |
| `bento` | `--with-bento-accent` #F43F75, `--with-bento-c1` #6366F1, `--with-bento-c2` #2A2120, `--with-bento-c3` #6366F1, `--with-bento-c4` #6366F1, `--with-bento-edge` #EEF0FF, `--with-bento-ink` #1E1B4B, `--with-bento-shadow` #312E81, `--with-bento-shine` #FFFFFF, `--with-bento-tint` #EEF0FF |
| `suite` | `--with-suite-accent` #FF7A3D, `--with-suite-c1` #3478F6, `--with-suite-c2` #7B61F0, `--with-suite-c3` #15A5B8, `--with-suite-c4` #5C9DFF, `--with-suite-edge` #F2F7FF, `--with-suite-ink` #1F4FB8, `--with-suite-shadow` #0B1E5B, `--with-suite-shine` #FFFFFF, `--with-suite-tint` #E4EEFF |
| `dock` | `--with-dock-accent` #FF3B30, `--with-dock-c1` #2F7DF6, `--with-dock-c2` #FFC94A, `--with-dock-c4` #E2E2FF, `--with-dock-ink` #14182B, `--with-dock-shadow` #1545C2, `--with-dock-shine` #FFFFFF, `--with-dock-tint` #DCE8FF |
| `liquid` | `--with-liquid-accent` #FF5F8F, `--with-liquid-c1` #4A9DFF, `--with-liquid-c2` #A77BFF, `--with-liquid-c3` #1C3F9E, `--with-liquid-c4` #FF7EC1, `--with-liquid-edge` #B9E6FF, `--with-liquid-ink` #2A1414, `--with-liquid-shadow` #0C1A3A, `--with-liquid-shine` #FFFFFF, `--with-liquid-tint` #FFE3B0 |
| `chrome` | `--with-chrome-accent` #FF3E9E, `--with-chrome-c1` #8794AA, `--with-chrome-c2` #5E6A82, `--with-chrome-c3` #3E4556, `--with-chrome-c4` #CDB9A4, `--with-chrome-edge` #F4F7FC, `--with-chrome-ink` #10131B, `--with-chrome-shadow` #1A1E2A, `--with-chrome-shine` #FFFFFF, `--with-chrome-tint` #DCE5F2 |
| `soft3d` | `--with-soft3d-accent` #FF6A4D, `--with-soft3d-c1` #E5483F, `--with-soft3d-c2` #EEF1F5, `--with-soft3d-c3` #3A404C, `--with-soft3d-c4` #BFC7D2, `--with-soft3d-edge` #FFF8EE, `--with-soft3d-ink` #2A2226, `--with-soft3d-shadow` #1D2130, `--with-soft3d-shine` #FFFFFF, `--with-soft3d-tint` #A9D8F2 |
| `brutal` | `--with-brutal-accent` #FF8A3D, `--with-brutal-c1` #FFD23F, `--with-brutal-c2` #FF6BA8, `--with-brutal-c3` #4D7CFE, `--with-brutal-c4` #3DDC97, `--with-brutal-ink` currentColor, `--with-brutal-shine` #FFFFFF, `--with-brutal-tint` #DDB89C |
| `utsav` | `--with-utsav-accent` #D4A017, `--with-utsav-c1` #F59E0B, `--with-utsav-c2` #F97316, `--with-utsav-c3` #E11D74, `--with-utsav-c4` #0F766E, `--with-utsav-edge` #F4C95D, `--with-utsav-ink` #3B0A45, `--with-utsav-shadow` #5E3518, `--with-utsav-shine` #FFF4DC, `--with-utsav-tint` #E8B48C |
| `rangoli` | `--with-rangoli-accent` #FFC21A, `--with-rangoli-c1` #FFB21F, `--with-rangoli-c2` #F2462C, `--with-rangoli-c3` #E81F7A, `--with-rangoli-c4` #7B2FE0, `--with-rangoli-edge` #7B2FE0, `--with-rangoli-ink` #2B1660, `--with-rangoli-shadow` #5A1240, `--with-rangoli-shine` #FFFFFF, `--with-rangoli-tint` #FFF3D8 |
| `halloween` | `--with-halloween-accent` #FFB52E, `--with-halloween-c1` #FF9F2E, `--with-halloween-c2` #E5530F, `--with-halloween-c3` #8B55E0, `--with-halloween-c4` #86D13A, `--with-halloween-edge` #7344C9, `--with-halloween-ink` #1D1029, `--with-halloween-shadow` #2A1642, `--with-halloween-shine` #FFF6E2, `--with-halloween-tint` #FFF1B8 |
| `christmas` | `--with-christmas-accent` #F4C24D, `--with-christmas-c1` #C8203A, `--with-christmas-c2` #1F6E46, `--with-christmas-c3` #E2A93B, `--with-christmas-c4` #FFF5E6, `--with-christmas-edge` #FFB347, `--with-christmas-ink` #3A0F17, `--with-christmas-shadow` #4A0716, `--with-christmas-shine` #FFFFFF, `--with-christmas-tint` #C9DAEC |
| `lunar` | `--with-lunar-accent` #E8B030, `--with-lunar-c1` #E8282E, `--with-lunar-c2` #B0101E, `--with-lunar-c3` #11896A, `--with-lunar-c4` #E8B030, `--with-lunar-edge` #A8700F, `--with-lunar-ink` #4A0A10, `--with-lunar-shadow` #5E3518, `--with-lunar-shine` #FFEBA6, `--with-lunar-tint` #FFF1D6 |
| `valentine` | `--with-valentine-accent` #5DB86A, `--with-valentine-c1` #FF6B8E, `--with-valentine-c2` #E8304F, `--with-valentine-c3` #8B4A36, `--with-valentine-c4` #FFF3E3, `--with-valentine-edge` #FF8FB0, `--with-valentine-ink` #6A1B3A, `--with-valentine-shadow` #A3163F, `--with-valentine-shine` #FFFFFF, `--with-valentine-tint` #F5C451 |

Inline SVG (components, `<with-icon>`, sprites, IconNode data) keeps the variables. Standalone `.svg` files have them
flattened to the defaults, because `<img>`, design tools and rasterizers cannot see CSS.

`glass`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` draw real SVG gradients: a `<defs>` of `linearGradient` / `radialGradient` whose stop
colours are the same CSS variables, so palettes and `--with-*` overrides recolour them too. Every inline copy gets its own
gradient ids (components, `<with-icon>`, `with-icons.js`), so one page can show the same icon many times in different
colours. When you inline SVG strings yourself, pass `idSuffix` (`toSvg` in `@withicons/core`, `svg` / `loadSvg` in
`@withicons/web`, `render` in `@withicons/dynamic`) with a different value per copy. Files and `<img>` need nothing.

## Animation (optional)

Animations ship separately in [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion), so icons never pay for them.
They work with every style and every package because they animate the element that holds the icon:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">

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
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>
```

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
