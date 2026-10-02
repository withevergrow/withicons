# @withicons/static

500 icons x 12 styles (6,000 SVGs) as plain SVG: one sprite per style plus standalone files. No JavaScript.

```bash
npm i @withicons/static
```

## Sprite

Serve `node_modules/@withicons/static/dist/sprite-line.svg` from your own origin, then:

```html
<svg width="24" height="24"><use href="sprite-line.svg#with-home"/></svg>
<svg width="24" height="24" style="color:#e11d48"><use href="sprite-solid.svg#with-home"/></svg>
```

- Symbol ids are `with-<name>`. Icons use `currentColor`, so set `color` on the outer `<svg>` (or any parent).
- Browsers block `<use>` of a sprite on another origin, so copy the sprite next to your pages (or inline it in the HTML with `style="display:none"`).
- One sprite per style: `sprite-line.svg` (~170 KB), `sprite-solid.svg` (~602 KB), `sprite-duo.svg` (~278 KB), `sprite-gloss.svg` (~714 KB), `sprite-engrave.svg` (~1087 KB), `sprite-blueprint.svg` (~611 KB), `sprite-sketch.svg` (~568 KB), `sprite-glass.svg` (~1466 KB), `sprite-kawaii.svg` (~633 KB), `sprite-sticker.svg` (~1187 KB), `sprite-pixel.svg` (~350 KB), `sprite-retro.svg` (~1013 KB).

## Single SVGs (CDN)

```
https://cdn.jsdelivr.net/npm/@withicons/static@0.2.0/dist/svg/<style>/<name>.svg
https://cdn.jsdelivr.net/npm/@withicons/static@0.2.0/dist/svg/line/home.svg
https://cdn.jsdelivr.net/npm/@withicons/static@0.2.0/dist/svg/solid/home.svg
```

```html
<img src="https://cdn.jsdelivr.net/npm/@withicons/static@0.2.0/dist/svg/line/home.svg" width="24" height="24" alt="Home">
```

(An `<img>` cannot inherit `currentColor`; its ink renders black. Inline the SVG or use the sprite to recolour.
Standalone files have CSS variables flattened to their default colours, so palette styles look right in `<img>`,
Figma, PowerPoint, Keynote and rasterizers such as sharp or resvg.)

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

## Right-to-left

Icons are drawn for left-to-right text. In Arabic, Hebrew, Persian or Urdu layouts, mirror the directional ones (arrows,
chevrons, undo/redo, reply, send, log-in/out) with a class; symmetric icons and logos stay as they are:

```css
[dir="rtl"] .with-rtl { transform: scaleX(-1); }   /* every browser */
.with-rtl:dir(rtl) { transform: scaleX(-1); }      /* also follows inherited direction (Chrome 120+, Safari 16.4+, Firefox) */
```

```html
<svg class="with-rtl" width="24" height="24"><use href="sprite-line.svg#with-arrow-right"/></svg>
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

`dist/icons.json` lists every icon's name, category, description, aliases, tags and styles.

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
