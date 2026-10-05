# @withicons/solid

500 icons x 20 styles for SolidJS. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/solid
```

```tsx
import { Home, Search } from '@withicons/solid'        // line (default style)
import { Home as HomeSolid } from '@withicons/solid/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} class="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}

// Plain ESM, no JSX inside the package: works in the browser, with hydration and with
// renderToString / SolidStart. ref, onClick, style and aria-* spread onto the <svg>.
```

- Default import path = **line** style. Every other style is a subpath: `@withicons/solid/solid`, `@withicons/solid/duo`, ...
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports (one file per icon): `@withicons/solid/icons/home`, `@withicons/solid/solid/icons/home`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | the style's own: line and duo `1.75`, blueprint `1.25`, sketch `1.3`, kawaii `2.2` | only these live-stroke styles; the others ignore it |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` and sets `role="img"`; otherwise `aria-hidden="true"` |
| `class` | `string` | — | appended to `withi withi-<name>` |
| ...rest | | | spread onto the `<svg>` |

## Styles

| style | import | kind | look |
|---|---|---|---|
| `line` | `@withicons/solid` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/solid/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/solid/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/solid/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/solid/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/solid/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/solid/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |
| `glass` | `@withicons/solid/glass` | creative | Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen. |
| `kawaii` | `@withicons/solid/kawaii` | creative | Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web. |
| `sticker` | `@withicons/solid/sticker` | creative | Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. |
| `pixel` | `@withicons/solid/pixel` | creative | Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens. |
| `retro` | `@withicons/solid/retro` | creative | Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch. |
| `luxe` | `@withicons/solid/luxe` | creative | Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights. |
| `bauhaus` | `@withicons/solid/bauhaus` | creative | Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black. |
| `skeuo` | `@withicons/solid/skeuo` | creative | Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail. |
| `anime` | `@withicons/solid/anime` | creative | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold. |
| `gothic` | `@withicons/solid/gothic` | creative | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows. |
| `pastel` | `@withicons/solid/pastel` | creative | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | `@withicons/solid/coquette` | creative | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | `@withicons/solid/plush` | creative | Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details. |

Duo's tint can be recoloured with the CSS variable `--with-duo`.

### Palette styles

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

### Change every colour in Solid

`color` sets the outline (it is `currentColor`); every other colour of a palette style is an inherited CSS variable,
so the `style` prop (typed for `--*` keys, no cast needed) or any CSS rule re-themes one icon:

```tsx
import { Pizza } from '@withicons/solid/retro'

<Pizza size={48} color="#3b1f12" style={{
  '--with-retro-1': '#f4b942',
  '--with-retro-2': '#d9412b',
  '--with-retro-3': '#2f8f4e',
  '--with-retro-4': '#f7e3b5',
  '--with-retro-shadow': '#5b2a12',
}} />
```

Every icon also has 20-30 colour palettes picked for it in [`@withicons/core`](https://www.npmjs.com/package/@withicons/core)
(`npm i @withicons/core`). Every component carries its drawing as `iconNode`, and `applyPalette` maps a palette onto
the variables that icon uses, in any style:

```tsx
import { For } from 'solid-js'
import { Pizza } from '@withicons/solid/retro'
import pizza from '@withicons/core/palettes/pizza.json'
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

const looks = pizza.palettes.map(p => ({ ...p, ...applyPalette(JSON.stringify(Pizza.iconNode), p.colors) }))

<For each={looks}>{p => <Pizza size={40} style={p.vars} color={p.color ?? undefined} title={p.name} />}</For>
```

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

## Animation in Solid

Import the two stylesheets of [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion) once, then put the
classes on a wrapper (or straight on the icon: `class` and `data-*` reach its `<svg>`). `motionAttrs` returns plain
`class` / `data-wm` / `style` strings, so it spreads in JSX and renders on the server:

```tsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { motionAttrs } from '@withicons/motion'
import { Bell } from '@withicons/solid'

<span class="wm wm-loop" data-wm="bell"><Bell /></span>
<button class="wm-trigger"><span {...motionAttrs('bell', { trigger: 'hover' })}><Bell /></span> Alerts</button>
```

For the JS-only triggers (`inview`, a hover that always finishes) call `motion(el, name, options)` in `onMount` with a
`ref`, and `destroy()` the handle in `onCleanup`.

## Right-to-left

Icons are drawn for left-to-right text. In Arabic, Hebrew, Persian or Urdu layouts, mirror the directional ones (arrows,
chevrons, undo/redo, reply, send, log-in/out) with a class; symmetric icons and logos stay as they are:

```css
[dir="rtl"] .with-rtl { transform: scaleX(-1); }   /* every browser */
.with-rtl:dir(rtl) { transform: scaleX(-1); }      /* also follows inherited direction (Chrome 120+, Safari 16.4+, Firefox) */
```

```tsx
<ChevronRight class="with-rtl" />

// animated: mirror the icon, and point nudge / pass the other way on the wrapper
<span class="wm wm-hover" data-wm="arrow-right" style={{ '--wm-dx': isRtl() ? -1 : 1 }}>
  <ArrowRight class="with-rtl" />
</span>
```

## SSR, SolidStart and module formats

- Components are plain ESM built on `solid-js/web`'s `Dynamic`: no JSX compile step inside the package. They render with
  `renderToString` / `renderToStream` and SolidStart, and hydrate onto the server markup (the `<title>` is created in the
  SVG namespace on both sides). Works with `solid-js` 1.6 and later; SSR and hydration are tested on 1.6 and 1.9.
- Every entry has a `solid` export condition, so `vite-plugin-solid` bundles the icons with your app and they always
  share its `solid-js` instance.
- The root and every style subpath ship ESM (`import`) and CommonJS (`require`) with matching types.
  The per-icon deep paths (`icons/*`, `<style>/icons/*`) and `/icon` are ESM only.
- `sideEffects: false` and one module per icon: a bundler keeps only the icons you import (the shared runtime plus
  about 0.1 kB gzipped per line icon).

## Generic icon (dynamic names)

```tsx
import { Icon } from '@withicons/solid'

<Icon name="home" variant="solid" size={20} />   // name and variant are reactive
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.
**Bundle cost:** `Icon` references every icon in every style (500 x 20). It is tree-shaken away when unused; when used, prefer named imports wherever the name is static.

## Custom icons

`createWithIcon(name, style, displayName, iconNode)` builds a component from IconNode data (`[tag, attrs][]`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, 20 deterministic styles, 10,000 icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
