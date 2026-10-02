# with icons: install and usage per framework

Every framework package exposes the same thing: one component per icon, PascalCase of the kebab-case name, exported as
`Name` and `NameIcon`. The default path is the **line** style; each other style is a subpath
(`/solid`, `/duo`, `/gloss`, `/engrave`, `/blueprint`, `/sketch`, `/glass`, `/kawaii`, `/sticker`, `/pixel`, `/retro`).
Animation is a separate, optional package for every framework: see [motion.md](motion.md). Deep imports: `<pkg>/icons/<name>` and `<pkg>/<style>/icons/<name>`.

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

Next.js App Router: the icons are plain function components with no hooks or state, so they work in Server Components.
Dynamic names (CMS data only, because it bundles every icon): `import { Icon } from '@withicons/react'` then `<Icon name="bin" variant="solid" />`.

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
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@0.1/dist/index.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="bin" variant="solid" size="32" color="#e11d48" label="Delete"></with-icon>
```

With a bundler: `npm i @withicons/web`, then `import '@withicons/web'`. Each style's data loads on first use.
Attributes: `name` (canonical or alias), `variant`, `size`, `color`, `stroke-width`, `absolute-stroke-width`, `label`.
Style the inner svg with `with-icon::part(svg)`. SVG string without the DOM: `import { loadSvg } from '@withicons/web'`,
then `await loadSvg('home', { variant: 'solid', size: 20 })`.

## Icon classes (Font Awesome style)

CSS only, zero JS (each icon is a `currentColor` mask, 1em square):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web@0.1/dist/classes/with-line.css">
<i class="with with-home" aria-hidden="true"></i>
<i class="with with-search with-2x with-spin" aria-hidden="true"></i>
```

All styles in one file: `.../classes/with-all.css`, then `<i class="with with-heart with-solid"></i>`.
Size utilities: `with-xs`, `with-sm`, `with-lg`, `with-2x`, and so on, plus `with-fw`. Animations: `with-spin`, `with-pulse`, both reduced-motion safe.
For true multi-colour, stroke width and alias names, use the JS runtime instead:
`<script src="https://cdn.jsdelivr.net/npm/@withicons/web@0.1/dist/classes/with-icons.js" defer></script>`.
It turns `<i class="with with-home with-duo">` into inline SVG (`--with-duo`, `--with-accent`, `data-with-stroke-width`).

## Static SVG and sprites (email, CMS, docs, no JS)

```bash
npm i @withicons/static
```

```html
<!-- copy node_modules/@withicons/static/dist/sprite-line.svg next to your pages (same origin!) -->
<svg width="24" height="24" style="color:#0f766e"><use href="/sprite-line.svg#with-home"/></svg>
```

Single files on the CDN (`<img>` renders black because it cannot use currentColor):

```
https://cdn.jsdelivr.net/npm/@withicons/static@0.1/dist/svg/<style>/<name>.svg
```

`dist/icons.json` lists every icon (name, category, description, aliases, tags, styles).

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
