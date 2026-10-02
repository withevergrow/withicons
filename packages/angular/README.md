# @withicons/angular

500 icons x 15 styles for Angular: one standalone `<with-icon>` component plus
tree-shakable icon data. Works with SSR and hydration. `currentColor` by default.

```bash
npm i @withicons/angular
```

Angular 17+. The component ships as partial Ivy (Angular Package Format, built with Angular 22.2.1),
linked by the Angular CLI like any Angular library.

## 1. Pass the icon (tree-shaken, no setup)

```ts
import { Component } from '@angular/core'
import { WithIconComponent, Home, Search } from '@withicons/angular'   // line (default style)
import { Home as HomeSolid } from '@withicons/angular/solid'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: `
    <with-icon [icon]="Home" />
    <with-icon [icon]="Search" [size]="20" [strokeWidth]="1.5" class="text-slate-500" />
    <with-icon [icon]="HomeSolid" [size]="32" color="#e11d48" title="Home" />
  `,
})
export class ToolbarComponent {
  Home = Home; Search = Search; HomeSolid = HomeSolid
}
```

## 2. By name + variant

Register the icons once, then use them by name anywhere below that injector:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideWithIcons, Home, Search } from '@withicons/angular'
import { Home as HomeSolid } from '@withicons/angular/solid'
// import * as solid from '@withicons/angular/solid'   // a whole style: provideWithIcons(solid)

export const appConfig: ApplicationConfig = { providers: [provideWithIcons(Home, Search, HomeSolid)] }
```

```html
<with-icon name="home" />
<with-icon name="home" variant="solid" [size]="20" />
```

`name` takes canonical names (`arrow-right`). An unregistered name renders nothing and warns once in dev mode.

## Inputs

| input | type | default | notes |
|---|---|---|---|
| `icon` | `WithIconData` | — | `Home`, `HomeIcon`, `@withicons/angular/<style>/icons/<name>`; wins over `name` |
| `name` | `string` | — | resolved against `provideWithIcons(...)` |
| `variant` | `WithIconVariant` | `'line'` | style used with `name`: `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo` |
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | style default (`1.75`) | only styles with live strokes (line, duo, blueprint, sketch, kawaii) |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` (a tooltip) and sets `role="img"`; otherwise `aria-hidden="true"` |
| `aria-label` | `string` | — | accessible name without a tooltip; moved to the `<svg role="img">` |
| `aria-labelledby` | `string` | — | id(s) of the element(s) that name the icon; moved to the `<svg role="img">` |

`class`, `style`, `id` and event bindings apply to the `<with-icon>` host element (`display: inline-flex`), as with
any Angular component. The inner `<svg>` carries `class="withi withi-<name>"`. `title`, `aria-label` and
`aria-labelledby` are moved from the host to the `<svg>`, so a screen reader announces one image with that name:

```html
<button type="button" (click)="remove()"><with-icon [icon]="Trash" aria-label="Delete" /></button>
```

## Styles

| style | import | kind | look |
|---|---|---|---|
| `line` | `@withicons/angular` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/angular/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/angular/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/angular/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/angular/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/angular/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/angular/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |
| `glass` | `@withicons/angular/glass` | creative | Layered frosted glass: a vivid colour glows through a translucent pane with a crisp rim, a specular edge and a soft sheen. |
| `kawaii` | `@withicons/angular/kawaii` | creative | Chubby pastel shapes with a soft thick outline and a tiny blushing face: the cutest icons on the web. |
| `sticker` | `@withicons/angular/sticker` | creative | Die-cut vinyl stickers in candy colours: bold ink outlines, a puffy white border, a soft drop shadow, a glossy shine and a sparkle or two. |
| `pixel` | `@withicons/angular/pixel` | creative | Hand-tuned 16-bit pixel art: crisp one-pixel outlines, a shaded sprite body and a highlight pixel. Pixel-perfect at 16, 32 and 48 px on 1x, 2x and 3x screens. |
| `retro` | `@withicons/angular/retro` | creative | Warm 70s vibes: chunky outlines, sunset-striped fills and a hard offset shadow, like a vintage patch. |
| `luxe` | `@withicons/angular/luxe` | creative | Premium multi-layered 3D: jewel enamel, polished gold and ruby set in deep extruded slabs, with soft shadows, lit chamfers and crisp highlights. |
| `bauhaus` | `@withicons/angular/bauhaus` | creative | Bauhaus compositions in miniature: circles, arches, half and quarter discs and pills in red, yellow, blue and black. |
| `skeuo` | `@withicons/angular/skeuo` | creative | Skeuomorphic: every icon is a tactile object in a real material (paper, leather, metal, brass, wood, glass), lit from above with soft shadows, inner walls and debossed detail. |

- Every icon is exported twice: `Home` and `HomeIcon`. Deep imports (one file per icon):
  `@withicons/angular/icons/home`, `@withicons/angular/solid/icons/home`.
- Duo's tint can be recoloured with the CSS variable `--with-duo`.


## Palette styles

`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo` paint a default multi-colour palette. The main ink stays `currentColor`
(so `color` still recolours the outline; `sticker` draws its bold outline with `--with-sticker-ink` instead, `luxe` draws its bold outline with `--with-luxe-ink` instead, `skeuo` draws its bold outline with `--with-skeuo-ink` instead) and every other colour is a CSS custom property with a built-in default,
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

Inline SVG (components, `<with-icon>`, sprites, IconNode data) keeps the variables. Standalone `.svg` files have them
flattened to the defaults, because `<img>`, design tools and rasterizers cannot see CSS.

### Change every colour in Angular

CSS variables set on the `<with-icon>` host reach the SVG, so a `[style]` binding (or any CSS rule) re-themes one icon:

```ts
import { Pizza } from '@withicons/angular/retro'
```

```html
<with-icon [icon]="Pizza" [size]="48" color="#3b1f12"
           [style]="{ '--with-retro-1': '#f4b942', '--with-retro-2': '#d9412b', '--with-retro-3': '#2f8f4e' }" />
```

Every icon also has 20-30 colour palettes picked for it in [`@withicons/core`](https://www.npmjs.com/package/@withicons/core)
(`npm i @withicons/core`). `applyPalette` maps a palette onto the variables this icon uses, in any style:

```ts
import { Component } from '@angular/core'
import { WithIconComponent } from '@withicons/angular'
import { Pizza } from '@withicons/angular/retro'
import pizza from '@withicons/core/palettes/pizza.json'          // needs "resolveJsonModule": true
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

@Component({
  selector: 'app-menu',
  imports: [WithIconComponent],
  template: `
    @for (p of looks; track p.id) {
      <with-icon [icon]="Pizza" [size]="40" [style]="p.vars" [color]="p.color" [title]="p.name" />
    }
  `,
})
export class MenuComponent {
  Pizza = Pizza
  looks = pizza.palettes.map(p => ({ id: p.id, name: p.name, ...applyPalette(JSON.stringify(Pizza.node), p.colors) }))
}
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

### Animation in Angular

Put the motion classes on the `<with-icon>` host, and add the two stylesheets to `angular.json`
(`"styles": ["src/styles.css", "node_modules/@withicons/motion/dist/motion.css", "node_modules/@withicons/motion/dist/icons.css"]`):

```html
<with-icon class="wm wm-loop" data-wm="bell" [icon]="Bell" />
<button class="wm-trigger"><with-icon class="wm wm-hover" data-wm="bell" [icon]="Bell" /> Alerts</button>
```

## Right-to-left layouts

Icons are drawn left to right. Mirror the directional ones (arrows, chevrons, undo/redo, send, log-in/out) in RTL
with one rule on the inner `<svg>`, which leaves the host free for motion transforms:

```css
[dir="rtl"] with-icon.rtl-mirror > svg { transform: scaleX(-1); }
```

```html
<with-icon class="rtl-mirror" [icon]="ChevronRight" />
```

## No Angular compiler?

`@withicons/web` is a framework-free `<with-icon>` custom element; use it (instead of this package, never both)
with `schemas: [CUSTOM_ELEMENTS_SCHEMA]`.

## Maintainers

`src/` is the component source. `node packages/angular/scripts/build-component.mjs` compiles it with ng-packagr
in an isolated toolchain (`.tmp/angular-toolchain`, or `WITH_ANGULAR_TOOLCHAIN=<dir>`) into `prebuilt/`;
`node forge/build.mjs angular` writes `dist/` (prebuilt component + generated icon data) and warns when
`prebuilt/` is older than `src/`.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, 15 deterministic styles, 7,500 icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
