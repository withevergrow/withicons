# @withicons/svelte

500 icons x 20 styles for Svelte 4 and Svelte 5. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/svelte
```

```svelte
<script>
  import { Home, Search } from '@withicons/svelte';       // line (default style)
  import { Home as HomeSolid } from '@withicons/svelte/solid';
</script>

<nav>
  <Home />
  <Search size={20} strokeWidth={1.5} class="text-slate-500" />
  <HomeSolid size={32} color="#e11d48" title="Home" />
</nav>
```

- Default import path = **line** style. Every other style is a subpath: `@withicons/svelte/solid`, `@withicons/svelte/duo`, ...
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports (one file per icon): `@withicons/svelte/icons/home`, `@withicons/svelte/solid/icons/home`.

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
| `line` | `@withicons/svelte` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/svelte/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/svelte/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/svelte/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/svelte/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/svelte/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/svelte/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |
| `glass` | `@withicons/svelte/glass` | creative | Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen. |
| `kawaii` | `@withicons/svelte/kawaii` | creative | Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web. |
| `sticker` | `@withicons/svelte/sticker` | creative | Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. |
| `pixel` | `@withicons/svelte/pixel` | creative | Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens. |
| `retro` | `@withicons/svelte/retro` | creative | Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch. |
| `luxe` | `@withicons/svelte/luxe` | creative | Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights. |
| `bauhaus` | `@withicons/svelte/bauhaus` | creative | Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black. |
| `skeuo` | `@withicons/svelte/skeuo` | creative | Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail. |
| `anime` | `@withicons/svelte/anime` | creative | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow tone, bright specular shine and the odd sparkle, in sky blue, sakura pink and warm gold. |
| `gothic` | `@withicons/svelte/gothic` | creative | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches, tracery and rose windows. |
| `pastel` | `@withicons/svelte/pastel` | creative | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | `@withicons/svelte/coquette` | creative | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | `@withicons/svelte/plush` | creative | Stuffed-toy icons sewn from felt: puffy panels, dark piping, running stitches, buttons and embroidered details. |

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@0.2.0/dist/icons/bell.css">

<span class="wm wm-loop" data-wm="bell"><!-- any bell icon --></span>          <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- on hover/focus -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon to icon -->
```

`prefers-reduced-motion` turns every animation off. JS API: `import { motion, swap, motionFor } from '@withicons/motion'`.

## Generic icon (dynamic names)

```svelte
<script>
  import { Icon } from '@withicons/svelte';   // or: import Icon from '@withicons/svelte/icon'
</script>

<Icon name="home" variant="solid" size={20} />
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.
**Bundle cost:** `Icon` references every icon in every style (500 x 20). It is tree-shaken away when unused; when used, prefer named imports wherever the name is static.

## Custom icons

`<IconBase iconNode={[['path', { d: 'M4 12h16' }]]} name="my-icon" variant="line" />` renders your own IconNode data
(`[tag, attrs][]`, 24x24 grid) with the same props.

## Theming palette styles in Svelte

Set the palette variables with Svelte's `--css-prop` syntax, a `style` attribute on the icon, or any parent:

```svelte
<script>
  import { Rocket } from '@withicons/svelte/retro';
  import { Home } from '@withicons/svelte/sticker';
</script>

<Rocket --with-retro-1="#fde047" --with-retro-2="#a855f7" />
<Home style="--with-sticker-sky: #22c55e" size={48} />
```

## Animation in Svelte

```svelte
<script>
  import '@withicons/motion/motion.css';
  import '@withicons/motion/icons.css';
  import { motion } from '@withicons/motion';
  import { Bell, Rocket } from '@withicons/svelte';

  // optional: a Svelte action for the JS triggers (inview, hover that always finishes)
  const wm = (el, name) => { const m = motion(el, name, { trigger: 'inview' }); return { destroy: () => m.destroy() } };
</script>

<span class="wm wm-loop" data-wm="bell"><Bell /></span>
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell"><Bell /></span> Alerts</button>
<span use:wm={'rocket'}><Rocket size={32} /></span>
```

## Right-to-left layouts

Icons are drawn left to right. Mirror the directional ones (arrows, chevrons, undo/redo, send, log-in/out) in RTL
with one global rule. The icon's own class takes the flip, so a motion wrapper around it can still move:

```svelte
<ChevronRight class="rtl-mirror" />

<style>
  :global([dir='rtl'] .rtl-mirror) { transform: scaleX(-1); }
</style>
```

## TypeScript

Every icon is typed as `WithIconComponent`: a Svelte 4 component class and a Svelte 5 `Component` at once.

```ts
import type { ComponentProps } from 'svelte';
import type { WithIconComponent, WithIconProps, IconName, StyleName } from '@withicons/svelte';
import { Home } from '@withicons/svelte';

type Props = ComponentProps<typeof Home>;   // Svelte 5 (Svelte 4: ComponentProps<Home>)
const nav: { label: string; icon: WithIconComponent }[] = [{ label: 'Home', icon: Home }];
```

`name` on `<Icon>` is checked against `IconName | IconAlias` and `variant` against `StyleName`.

## Svelte notes

- Components are shipped as `.svelte` source in the classic syntax, which both Svelte 4 and Svelte 5 compile
  (Svelte 5 runs them in legacy mode; they work inside runes components and hydrate cleanly after SSR / SvelteKit).
  Do not force `compilerOptions.runes: true` on `node_modules`: use `dynamicCompileOptions` for your own files instead.
- Svelte 5 event props (`onclick`) spread onto the `<svg>`. Icons dispatch no component events, so Svelte 4 `on:click`
  is not forwarded: put it on a wrapping `<button>` (the better pattern for accessibility anyway).
- Dev-server speed (SvelteKit / Vite SSR): `import { Home } from '@withicons/svelte'` makes the dev server compile every
  icon of that style (500 small `.svelte` files) on a cold start, which can take tens of seconds. Deep imports compile only
  what you use: `import Home from '@withicons/svelte/icons/home'`, `import Home from '@withicons/svelte/solid/icons/home'`.
  Production builds tree-shake both forms to the same output.
- Tree-shaking is per icon: the first icon adds about 3 KB gzipped on Svelte 4 and about 9 KB on Svelte 5 (the shared
  renderer plus Svelte 5's legacy-mode runtime, paid once), and each further icon about 0.2 KB.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, 20 deterministic styles, 10,000 icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
