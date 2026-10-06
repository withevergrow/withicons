# @withicons/react

500 icons x 20 styles for React. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/react
```

```jsx
import { Home, Search } from '@withicons/react'        // line (default style)
import { Home as HomeSolid } from '@withicons/react/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} className="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}
```

- **One rule:** the root is the **line** style, every other style is a subpath (`@withicons/react/solid`, `@withicons/react/duo`, ...).
  Import the icons you use by name from the style you want. That is all.
- Fast everywhere: each style is a single module, so the root or a style subpath loads that one style (never all 20),
  quickly in Node, SSR, Jest and Vitest, and bundlers keep only the icons you import. No bundler config needed
  (no `optimizePackageImports`, no deep imports).
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports keep working: `@withicons/react/icons/home`, `@withicons/react/solid/icons/home`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | the style's own: line and duo `1.75`, blueprint `1.25`, sketch `1.3`, kawaii `2.2` | only these live-stroke styles; the others ignore it |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` and sets `role="img"`; otherwise `aria-hidden="true"` |
| `className` | `string` | — | appended to `withi withi-<name>` |
| ...rest | | | spread onto the `<svg>` |

## Styles

| style | import | group | look |
|---|---|---|---|
| `line` | `@withicons/react` | Everyday | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/react/solid` | Everyday | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/react/duo` | Everyday | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/react/gloss` | Crafted | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/react/engrave` | Crafted | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/react/blueprint` | Crafted | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/react/sketch` | Crafted | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |
| `glass` | `@withicons/react/glass` | Playful | Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen. |
| `kawaii` | `@withicons/react/kawaii` | Playful | Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web. |
| `sticker` | `@withicons/react/sticker` | Playful | Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. |
| `pixel` | `@withicons/react/pixel` | Playful | Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens. |
| `retro` | `@withicons/react/retro` | Playful | Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch. |
| `luxe` | `@withicons/react/luxe` | Studio | Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights. |
| `bauhaus` | `@withicons/react/bauhaus` | Studio | Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black. |
| `skeuo` | `@withicons/react/skeuo` | Studio | Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail. |
| `anime` | `@withicons/react/anime` | Storybook | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold. |
| `gothic` | `@withicons/react/gothic` | Storybook | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows. |
| `pastel` | `@withicons/react/pastel` | Storybook | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | `@withicons/react/coquette` | Storybook | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | `@withicons/react/plush` | Storybook | Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details. |

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


## Change every colour of one icon

`color` sets the outline (it is `currentColor`); every other colour of a palette style is a CSS variable, so the
`style` prop (or any CSS rule on an ancestor) re-themes a single icon. `style` is typed to accept `--*` variables,
so TypeScript needs no cast:

```jsx
import { Pizza } from '@withicons/react/retro'

<Pizza size={48} color="#3b0764" style={{
  '--with-retro-1': '#fde047',
  '--with-retro-2': '#fb923c',
  '--with-retro-3': '#f43f5e',
  '--with-retro-4': '#0d9488',
  '--with-retro-shadow': '#3b0764',
}} />
```

Variables a given icon does not use are simply ignored, so one palette object can theme a whole toolbar.

## Animation in React

Import the two stylesheets of [`@withicons/motion`](https://www.npmjs.com/package/@withicons/motion) once, then put the
classes straight on the icon (they are spread onto its `<svg>`):

```jsx
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'
import { useState } from 'react'
import { Bell, Play, Pause } from '@withicons/react'

export function Controls() {
  const [playing, setPlaying] = useState(false)
  return (
    <>
      <Bell className="wm wm-loop" data-wm="bell" />
      <button className="wm-trigger"><Bell className="wm wm-hover" data-wm="bell" /> Alerts</button>
      <button aria-pressed={playing} aria-label="Play" onClick={() => setPlaying(p => !p)}>
        <span className="wm-swap wm-fx-flip"><Play className="wm-a" /><Pause className="wm-b" /></span>
      </button>
    </>
  )
}
```

## Right-to-left layouts

Icons are drawn left to right. To mirror the directional ones (arrows, chevrons, undo and redo, send, reply, log in and
out) in Arabic, Hebrew, Persian or Urdu UIs, give them a class and add one rule. It uses the `scale` property, so it
composes with motion's transforms and a nudge follows the mirrored direction:

```css
.with-rtl:dir(rtl) { scale: -1 1; }
@supports not selector(:dir(rtl)) { [dir="rtl"] .with-rtl { scale: -1 1; } }  /* iOS 15 to 16.3 */
```

```jsx
<ChevronRight className="with-rtl" />
```

## SSR, Server Components and module formats

- Components are plain `forwardRef` components with no hooks, state or effects. They render in React Server Components
  (Next.js App Router, no `'use client'` needed), with `react-dom/server`, and hydrate without mismatches.
  Works with React 16.8 and later; SSR and hydration are tested on React 18 and 19.
- The root and every style subpath ship ESM (`import`) and CommonJS (`require`) with matching types.
  The per-icon deep paths (`icons/*`, `<style>/icons/*`) and `/icon` are ESM only.
- Each style is one module of `/*#__PURE__*/` components with `sideEffects: false`: Vite, webpack (Next.js), Rollup and
  esbuild keep only the icons you import, and Node, Jest and Vitest load one file per style. Next.js needs no
  `optimizePackageImports` entry, and named imports from the root are as small as deep imports.

## Generic icon (dynamic names)

```jsx
import { Suspense } from 'react'
import { Icon } from '@withicons/react'

<Icon name="home" size={20} />                      // line: renders at once
<Suspense fallback={null}>
  <Icon name="home" variant="solid" size={20} />    // solid: loaded on first use
</Suspense>
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.

**How `Icon` loads styles.** The root `Icon` renders the **line** style at once (a dynamic name needs every line icon,
so using `Icon` brings that style). Any other `variant` is loaded the first time it renders: one dynamic import per
style (one chunk in a bundle, one file in Node), shared by every `Icon` of that style.
Until a style has loaded, its `Icon` suspends like any `React.lazy` component, so wrap it in `<Suspense>`.
Server Components and streaming SSR (Next.js App Router, `renderToPipeableStream`) wait for it and send the finished
`<svg>`; a synchronous `renderToString` needs `await preloadStyles(...)` first. With `require()` (CommonJS, Jest)
styles load synchronously and `Icon` never suspends.

To have other styles ready up front, `await preloadStyles('solid', 'duo')` (no argument = every style). Or import
`Icon` from `@withicons/react/icon`: it imports every icon of every style (500 x 20, heavy) and always renders synchronously.
`Icon` is tree-shaken away when unused; prefer named imports wherever the name is static.

## Custom icons

`createWithIcon(name, style, displayName, iconNode)` builds a component from IconNode data (`[tag, attrs][]`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, 20 deterministic styles, 10,000 icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
