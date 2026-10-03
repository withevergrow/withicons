# @withicons/core

Framework-free data for with icons: 500 icons in 20 styles (`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`), 10,000 SVGs in all, as standalone SVG files, IconNode data, metadata, alias resolution and search.

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
- `luxe` (creative, palette) — Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights.
- `bauhaus` (creative, palette) — Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black.
- `skeuo` (creative, palette) — Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail.
- `anime` (creative, palette) — Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold.
- `gothic` (creative, palette) — Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows.
- `pastel` (creative, palette) — Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth.
- `coquette` (creative, palette) — Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold.
- `plush` (creative, palette) — Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details.

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

## Colour palettes

Every icon ships 20-30 colour palettes picked for it (pizza: Margherita, Pepperoni…; heart: Classic red, Rose…), for the
styles that paint with more than one colour (`duo`, `blueprint`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`). A palette sets colour **roles**; each style maps the roles onto its
own CSS variables, so one palette works in every style:

| role | paints |
|---|---|
| `ink` | outlines and faces (`color` / `currentColor`) |
| `c1` | the main body colour (duo tint, glass back, kawaii body, sticker 1st colour, pixel fill, retro 1st stripe, luxe / bauhaus / skeuo / anime / gothic / pastel / coquette / plush main surface) |
| `c2` `c3` `c4` | 2nd-4th colours in order of appearance (sticker, kawaii, retro stripes) or by name (`--with-luxe-c2`, `--with-bauhaus-c3`) |
| `tint` · `accent` · `shadow` · `shine` · `edge` | glass pane · blush, sparkles, gold trim · drop shadows and depth · highlights · borders and bevels |

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
