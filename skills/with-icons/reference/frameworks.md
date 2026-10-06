# with icons: install and usage per framework

Every framework package exposes the same thing: one component per icon, PascalCase of the kebab-case name, exported as
`Name` and `NameIcon`. The default path is the **line** style; each other style is a subpath
(`/line` is also accepted): `/solid`, `/duo`, `/gloss`, `/engrave`, `/blueprint`, `/sketch`, palette styles `/glass`, `/kawaii`,
`/sticker`, `/pixel`, `/retro`, studio styles `/luxe`, `/bauhaus`, `/skeuo`, storybook styles `/anime`, `/gothic`, `/pastel`,
`/coquette`, `/plush` (all 20 in React, Vue, Svelte, Solid and Angular).
Animation is a separate, optional package for every framework: see [motion.md](motion.md). Deep imports: `<pkg>/icons/<name>` and `<pkg>/<style>/icons/<name>`.

## Props (identical across React, Vue, Svelte, Solid and Angular)

| prop | default | notes |
|---|---|---|
| `size` | `24` | number (px) or CSS length |
| `color` | `currentColor` | omit it and set CSS `color` on a parent instead |
| `strokeWidth` | style default (1.75) | only styles with live strokes: line, duo, blueprint, sketch, kawaii; nothing on the filled styles |
| `absoluteStrokeWidth` | `false` | keeps stroke px constant when scaled |
| `title` | none | adds `<title>` and `role="img"`; without it the svg is `aria-hidden="true"` |
| `className` / `class` | none | appended to `withi withi-<name>` |

Everything else (`onClick`, `style`, `data-*`, `aria-*`) is spread onto the `<svg>`. The web component uses attributes:
`name variant size color stroke-width absolute-stroke-width label mirror-rtl` (it uses `variant`, not `style`).

## Accessibility

1. **Decorative icon next to visible text**: nothing to add. It is `aria-hidden` by default.
2. **Icon-only button or link**: put the accessible name on the control, not on the icon:
   `<button type="button" aria-label="Delete row"><Trash /></button>`.
3. **Standalone meaningful icon** (status, rating): pass `title="Error"` (components) or `label="Error"` (web component).
4. Icon classes (`<i class="with ...">`) have no semantics. Add `aria-hidden="true"` and visible or `.sr-only` text.
5. Exported SVG files contain a `<title>`. Next to visible text add `aria-hidden="true"` (inline) or `alt=""` (`<img>`).
6. Never rely on the icon alone for meaning in forms or errors. Keep 3:1 contrast for meaningful icons, and give
   icon-only controls a target of at least 24x24 CSS px (44 recommended on touch) using padding, not a bigger icon.
7. An animated icon is still decorative: the accessible name stays on the button, never in the animation. Live icons
   name themselves from their value unless you pass `label` ([live.md](live.md)).

## Pitfalls

- `import { Bin } from '@withicons/react'` fails because aliases are not exports. Resolve to `Trash` first.
- The generic `<Icon name=... variant=...>` component bundles **all 500 icons in every style**. Use it only for truly
  dynamic names (CMS data); named imports tree-shake down to the icons you use.
- `<img src=".../home.svg">` cannot inherit `currentColor` and renders black. Inline the SVG, use the component, the
  sprite or the classes when the colour must follow text. Standalone `.svg` files (CDN, `@withicons/static`, `get_icon`
  with `flat: true`) have the palette baked in, which is what Figma, PowerPoint, Keynote and image converters need;
  inline code keeps the variables.
- SVG sprites must be served from **your own origin**. Browsers block cross-origin `<use href>`.
- Don't put multi-colour styles, loops or Crafted styles in dense 16-20px controls: they turn to noise.
- Svelte 4: `on:click` is not forwarded to the icon. Wrap it in a `<button>`. Angular `name=` usage needs
  `provideWithIcons(...)` registration; passing `[icon]` needs none.
- Packages are `0.x`: check `npm view @withicons/react version` if an install fails. The site offers direct SVG
  downloads as a fallback.
- Don't mix with icons and another icon set in the same UI region. Replace the old set's icons one-for-one using search.
- Icon classes, CDN sizes, pinning and right-to-left: the sections below.

## React (also Next.js, Remix, Vite, React Native Web)

```bash
npm i @withicons/react
```

```jsx
import { Home, Search, Trash } from '@withicons/react'          // line
import { Home as HomeSolid } from '@withicons/react/solid'      // another style

export function Toolbar({ active }) {
  return (
    <nav className="flex gap-2 text-slate-600">
      {active ? <HomeSolid /> : <Home />}
      <Search size={20} strokeWidth={1.5} />
      <button type="button" aria-label="Delete row"><Trash size={18} /></button>
    </nav>
  )
}
```

TypeScript: every package ships its types (`.d.ts`). A CSS custom property in a React
`style` needs a cast: `style={{ '--with-duo': '#fde68a' } as React.CSSProperties}`.

Next.js App Router: the icons are plain function components with no hooks or state, so they work in Server Components.
Dynamic names (CMS data only): `import { Icon } from '@withicons/react'` then `<Icon name="bin" variant="solid" />` inside `<Suspense>` (line renders at once; other styles load on first use; `await preloadStyles('solid')` before `renderToString`; `@withicons/react/icon` bundles every style, synchronous). Root and style imports load one style, so no `optimizePackageImports` or deep imports are needed.

## Vue 3 / Nuxt

```bash
npm i @withicons/vue
```

```vue
<script setup>
import { Home, Search } from '@withicons/vue'
import { Home as HomeSolid } from '@withicons/vue/solid'
</script>

<template>
  <Home />
  <Search :size="20" :stroke-width="1.5" class="text-slate-500" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>
```

## Svelte 4 / Svelte 5 / SvelteKit

```bash
npm i @withicons/svelte
```

```svelte
<script>
  import { Home, Search } from '@withicons/svelte'
  import { Home as HomeSolid } from '@withicons/svelte/solid'
</script>

<Home />
<Search size={20} strokeWidth={1.5} class="text-slate-500" />
<HomeSolid size={32} color="#e11d48" title="Home" />
```

The components ship as classic-syntax `.svelte` source and compile in both Svelte 4 and 5. Do not force `runes: true`
on `node_modules`. In Svelte 4, `on:click` is not forwarded, so wrap the icon in a `<button>`.

## Angular 17+

```bash
npm i @withicons/angular
```

Pass the icon object (tree-shaken, no setup):

```ts
import { Component } from '@angular/core'
import { WithIconComponent, Home, Search } from '@withicons/angular'
import { Home as HomeSolid } from '@withicons/angular/solid'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: `
    <with-icon [icon]="Home" />
    <with-icon [icon]="Search" [size]="20" [strokeWidth]="1.5" />
    <with-icon [icon]="HomeSolid" [size]="32" color="#e11d48" title="Home" />
  `,
})
export class ToolbarComponent { Home = Home; Search = Search; HomeSolid = HomeSolid }
```

Or register once and use names:

```ts
// app.config.ts
import { provideWithIcons, Home, Search } from '@withicons/angular'
export const appConfig = { providers: [provideWithIcons(Home, Search)] }
```

```html
<with-icon name="home" />
<with-icon name="home" variant="solid" [size]="20" />
```

`class`/`style` apply to the `<with-icon>` host (`display: inline-flex`).

## SolidJS / SolidStart

```bash
npm i @withicons/solid
```

```tsx
import { Home, Search } from '@withicons/solid'
import { Home as HomeSolid } from '@withicons/solid/solid'

export const Toolbar = () => (
  <nav>
    <Home />
    <Search size={20} strokeWidth={1.5} class="text-slate-500" />
    <HomeSolid size={32} color="#e11d48" title="Home" />
  </nav>
)
```

## Web component (any HTML, Astro, Lit, Rails, Django, WordPress, no build)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="bin" variant="solid" size="32" color="#e11d48" label="Delete"></with-icon>
```

CDN links on this page use `@latest`. For a look that never changes under you, pin a version instead
(`@withicons/web@<version>`, and the same version for every `@withicons/*` file on the page; `npm view @withicons/web version`
prints the current one).

The page downloads only what it shows: `cdn.js` is 7 KB gzipped, then each icon is its own small file
(`dist/icons/<style>/<name>.js`, a `line` icon about 150 bytes gzipped). Never load `@withicons/web/full` on a page
(every icon of every style, ~6 MB gzipped); it is for scripts and tools.

With a bundler: `npm i @withicons/web`, then `import '@withicons/web'`. Each style's data loads on first use.
Attributes: `name` (canonical or alias), `variant`, `size`, `color`, `stroke-width`, `absolute-stroke-width`, `label`,
`mirror-rtl` (flip a directional icon in right-to-left text). Animate it with the `motion` attribute, not a `.wm` wrapper
(the svg is in a shadow root): see [motion.md](motion.md).
Style the inner svg with `with-icon::part(svg)`. SVG string without the DOM: `import { loadSvg } from '@withicons/web'`,
then `await loadSvg('home', { variant: 'solid', size: 20 })`.

## Icon classes (Font Awesome style)

Each icon is a `currentColor` mask, 1em square. Recommended: the loader, which links just the CSS of the icons on the
page, in any mix of styles (6 KB gzipped, then ~270 bytes per `line` icon):

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>
<i class="with with-home" aria-hidden="true"></i>
<i class="with with-heart with-solid" aria-hidden="true"></i>
<i class="with with-search with-2x with-spin" aria-hidden="true"></i>
```

Zero JS: link `.../classes@latest/dist/with-base.css` plus `.../classes@latest/dist/<style>/<name>.css` per icon, or one whole style per file
(`.../classes@latest/dist/with-line.css`, all 500 line icons, 26 KB gzipped; the richest styles are several hundred KB).
`with-all.css` imports every style (~6.3 MB gzipped): prototypes only, never a production page.
With a bundler: `npm i @withicons/classes`, then `import '@withicons/classes/with-line.css'` (or `with-base.css` + `line/home.css` per icon).
Size: the icon is 1em square, so it follows the text size. Setting only `height` does not grow it (the width stays 1em).
Three ways, each giving a 48 px icon:

```html
<i class="with with-home" style="font-size: 48px"></i>      <!-- 1. font-size (also scales with the text around it) -->
<i class="with with-home with-3x"></i>                       <!-- 2. a size class: 3 x the text size -->
<i class="with with-home" style="--with-size: 48px"></i>    <!-- 3. an exact size, whatever the text size -->
```

Size classes: `with-xs`, `with-sm`, `with-lg`, `with-2x` to `with-5x` (multiples of the text size), plus `with-fw` (fixed width for lists).
`font-size` on the `<i>` itself gives an exact pixel size (`font-size: 20px` is a 20 px icon), whatever the text around it.
`--with-size` needs `@withicons/classes` 0.2.2 or newer (`@latest` has it; a pinned older version ignores it, so use `font-size` there).
Animations: `with-spin` (continuous, 1.6 s) and `with-pulse` (a stepped spin in 8 steps, like an old spinner; not an
opacity pulse), both reduced-motion safe. To measure an icon, read `offsetWidth` / `offsetHeight`
(layout size); `getBoundingClientRect()` grows and shrinks while a spinning or rotated icon turns.

Rotate, mirror and right-to-left:

```html
<i class="with with-arrow-right with-rtl" aria-hidden="true"></i>   <!-- mirrored only inside dir="rtl" text -->
<i class="with with-arrow-up with-rotate-90" aria-hidden="true"></i>  <!-- also with-rotate-180, with-rotate-270 -->
<i class="with with-undo with-flip-h" aria-hidden="true"></i>        <!-- always mirrored; also with-flip-v, with-flip-both -->
```

Put `with-rtl` on directional icons (arrows, chevrons, undo/redo, reply, send, log-in/out, indent) and leave the
others alone: a clock, a check or a play button means the same in every direction.
`with-rtl` and `with-flip-*` use the CSS `scale` property and `with-rotate-*` the `rotate` property (not `transform`),
so they combine with `with-spin` / `with-pulse`. To test a mirror, read `getComputedStyle(el).scale` (`'-1 1'` when
flipped); `transform` stays `none`.
The loader watches the page (a MutationObserver on added nodes and `class` changes), so icons rendered later by a
framework or added with `classList` load their CSS too.
Palette styles in classes: the fills are a background image in the default colours, but the ink is still a
`currentColor` mask, so `color` (and a dark-mode text colour) recolours the outline.
For true multi-colour, stroke width and alias names, use the JS runtime instead:
`<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-icons.js" defer></script>`.
It fetches only the icons shown (from `@withicons/web`, same version) and turns `<i class="with with-home with-duo">` into inline SVG (`--with-duo`, `--with-accent`, `data-with-stroke-width`).

## Static SVG and sprites (CMS, docs, no JS)

Not for email: mail clients strip SVG, so use exported PNGs there ([files.md](files.md#email)).

```bash
npm i @withicons/static
```

```html
<!-- copy node_modules/@withicons/static/dist/sprite-line.svg next to your pages (same origin!) -->
<svg width="24" height="24" style="color:#0f766e"><use href="/sprite-line.svg#with-home"/></svg>
```

Single files on the CDN (`<img>` renders black because it cannot use currentColor):

```
https://cdn.jsdelivr.net/npm/@withicons/static@latest/dist/svg/<style>/<name>.svg
```

`dist/icons.json` lists every icon (name, category, description, aliases, tags, styles).

## Right-to-left (components)

The framework components have no mirror prop. Add a class and flip the svg in RTL with one CSS rule
(`:dir()` follows the nearest `dir` attribute, so a `dir="ltr"` island inside an RTL page is left alone):

```css
.rtl-flip:dir(rtl) { transform: scaleX(-1); }
```

```jsx
<ArrowRight className="rtl-flip" />            {/* React; class="rtl-flip" in Vue, Svelte, Solid */}
```

Angular: `[dir="rtl"] with-icon.rtl-mirror > svg { transform: scaleX(-1); }` on `<with-icon class="rtl-mirror" [icon]="ChevronRight" />`.
Web component: the `mirror-rtl` attribute. Icon classes: `with-rtl`. If the icon also animates, flip the svg (as here)
and animate a wrapper, so the two transforms do not fight.

## Core (Node, build tools, codegen)

```js
import { resolve, find, search, suggest, toSvg, icons } from '@withicons/core'
import solid from '@withicons/core/nodes/solid'

resolve('bin').name       // 'trash'
resolve('ArrowRight').name // 'arrow-right'
find('nope')              // null
search('delete')          // ranked IconMeta[]
toSvg(solid.home, 'solid', { size: 32, title: 'Home' })  // '<svg ...>'
```

`resolve` throws `WITH_AMBIGUOUS_ICON` (see `err.candidates`) or `WITH_UNKNOWN_ICON` (see `err.suggestions`).

## Slides, docs and no-code tools

Non-developers: open https://withicons.com/icons.html, pick an icon and a style, then **Copy SVG** or **Download PNG/SVG**.
Step-by-step guides for PowerPoint, Google Slides, Keynote, Canva, Figma, Word, Notion, WordPress, Webflow and Framer
are at https://withicons.com/guides/.
