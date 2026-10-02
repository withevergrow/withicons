# @withicons/core

Framework-free data for with icons: 500 icons in 12 styles (`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`), 6,000 SVGs in all, as standalone SVG files, IconNode data, metadata, alias resolution and search.

```bash
npm i @withicons/core
```

```js
import { resolve, search, toSvg } from '@withicons/core'
import { Home } from '@withicons/core/nodes/solid'       // one icon: only it ends up in your bundle
import kawaii from '@withicons/core/nodes/kawaii'        // every kawaii icon, keyed by canonical name

resolve('trash').name        // 'trash'   (canonical name)
resolve('bin').name          // 'trash'   (alias with one match)
resolve('ArrowRight').name   // 'arrow-right'
resolve('expand')            // throws: ambiguous alias, err.candidates = ['chevron-down', ...]
resolve('hoem')              // throws: unknown icon, err.suggestions = ['home', ...]

search('delete')             // ranked IconMeta[] (name, alias, tag, category, description)
toSvg(Home, 'solid', { size: 32, color: '#e11d48', title: 'Home' })  // '<svg ...>'
toSvg(kawaii[resolve('bin').name], 'kawaii', { flat: true })  // palette defaults baked in, for files and rasterizers
```

## Files

| path | contents |
|---|---|
| `dist/svg/<style>/<name>.svg` | optimized standalone SVG (`currentColor`, 24x24; CSS variables flattened to their defaults) |
| `dist/icons.json` | `[{ name, category, description, aliases, tags, styles }]` |
| `dist/aliases.json` | `{ alias: [canonical names] }` (more than one name = ambiguous) |
| `dist/styles.json` | `[{ name, title, kind, description, strokeWidth, root, palette, vars }]` |
| `dist/nodes/<style>.js` | IconNode data (`[tag, attrs][]`, keeps the CSS variables): one tree-shakable named export per icon (`Home`, `ArrowRight`) plus `nodes` / default `{ [name]: IconNode }` |
| `dist/palettes/<name>.json` | `{ name, auto, palettes: [{ id, name, tags, colors }] }`: colour palettes picked for that icon (see below) |
| `dist/palettes/index.json` | `{ roles, roleLabels, tags, icons: { [name]: { count, auto, tags } } }` |
| `dist/palettes/palette-map.mjs` (import it as `@withicons/core/palettes/palette-map.js`) | `rolesFor`, `applyPalette`, `bakePalette` (also `palette-map.cjs` and `palette-map.d.ts`) |

Import a file: `import url from '@withicons/core/svg/solid/home.svg'`.
CDN: `https://cdn.jsdelivr.net/npm/@withicons/core@0.2.0/dist/svg/line/home.svg`

## API

| export | description |
|---|---|
| `resolve(name)` | canonical name, PascalCase or alias -> `IconMeta`. Throws `code: 'WITH_AMBIGUOUS_ICON'` (`candidates`) or `'WITH_UNKNOWN_ICON'` (`suggestions`, 3 nearest) |
| `find(name)` | like `resolve`, returns `null` instead of throwing |
| `search(query, { limit, category })` | ranked `IconMeta[]` |
| `suggest(name, count = 3)` | nearest canonical names |
| `toSvg(iconNode, style, { size, color, strokeWidth, absoluteStrokeWidth, title, class, flat })` | SVG string (`flat`: CSS variables -> default colours) |
| `icons`, `iconNames`, `styles`, `styleNames`, `aliases`, `categories` | metadata |

## Styles

- `line` (universal) — A precise 1.75px outline with round caps and joins. The default for any interface.
- `solid` (universal) — The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap.
- `duo` (universal) — The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo.
- `gloss` (creative) — Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour.
- `engrave` (creative) — Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow.
- `blueprint` (creative) — A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint.
- `sketch` (creative) — Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching.
- `glass` (creative, palette) — Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen.
- `kawaii` (creative, palette) — Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web.
- `sticker` (creative, palette) — Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two.
- `pixel` (creative, palette) — Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens.
- `retro` (creative, palette) — Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch.

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

## Colour palettes

Every icon ships 20-30 colour palettes picked for it (pizza: Margherita, Pepperoni…; heart: Classic red, Rose…), for the
styles that paint with more than one colour (`duo`, `blueprint`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`). A palette sets colour **roles**; each style maps the roles onto its
own CSS variables, so one palette works in every style:

| role | paints |
|---|---|
| `ink` | outlines and faces (`color` / `currentColor`) |
| `c1` | the main body colour (duo tint, glass back, kawaii body, sticker 1st colour, pixel fill, retro 1st stripe) |
| `c2` `c3` `c4` | 2nd-4th colours in order of appearance (sticker, kawaii, retro stripes) |
| `tint` · `accent` · `shadow` · `shine` · `edge` | glass pane · blush and sparkles · drop shadows · highlights · sticker border |

```js
import pizza from '@withicons/core/palettes/pizza.json' with { type: 'json' }
import { applyPalette, bakePalette } from '@withicons/core/palettes/palette-map.js'
import retro from '@withicons/core/nodes/retro'
import { toSvg } from '@withicons/core'

const svg = toSvg(retro.pizza, 'retro')
const colors = pizza.palettes[0].colors   // { ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge }
applyPalette(svg, colors)   // { vars: { '--with-retro-1': '#F4B942', … }, color: '#3B1F12' }: set them as inline CSS
bakePalette(svg, colors)    // the same SVG with the colours written in, for files, design tools and rasterizers
```

`dist/palettes/index.json` lists every icon with its palette count and tags (`auto: true` marks the general fallback set).

## Right-to-left

Icons are drawn for left-to-right text. In Arabic, Hebrew, Persian or Urdu layouts, mirror the directional ones (arrows,
chevrons, undo/redo, reply, send, log-in/out) with a class; symmetric icons and logos stay as they are:

```css
[dir="rtl"] .with-rtl { transform: scaleX(-1); }   /* every browser */
.with-rtl:dir(rtl) { transform: scaleX(-1); }      /* also follows inherited direction (Chrome 120+, Safari 16.4+, Firefox) */
```

```js
import { ArrowRight } from '@withicons/core/nodes/line'
toSvg(ArrowRight, 'line', { class: 'with-rtl' })
```

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

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
