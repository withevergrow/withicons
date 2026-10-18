# @withicons/classes

Font Awesome-style icon classes for 1000 icons x 34 styles: plain `<i>`/`<span>` tags, no build step,
no framework, zero dependencies. One line in your page:

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>
<i class="with with-heart with-solid"></i>
```

Every file sits at the top of `dist/`, so the URLs are short: `dist/with-loader.js`, `dist/with-line.css` (one style),
`dist/line/home.css` (one icon). Prefer a custom element or components? `<with-icon>` is
[`@withicons/web`](https://www.npmjs.com/package/@withicons/web); React, Vue, Svelte, Angular and Solid have their own packages.

The CSS files of the newest and the heaviest styles live in companion packages (jsDelivr serves at most 150 MB per package): `glass`, `skeuo`, `gothic`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `brutal` in [`@withicons/classes-plus`](https://www.npmjs.com/package/@withicons/classes-plus); `soft3d` in [`@withicons/soft3d`](https://www.npmjs.com/package/@withicons/soft3d) (`dist/classes/`); `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` in [`@withicons/holiday`](https://www.npmjs.com/package/@withicons/holiday) (`dist/classes/`).
`with-loader.js` and `with-icons.js` load them by themselves, from the same CDN or `node_modules` folder, so
`<i class="with with-home with-glass">` just works. A self-hosted copy: put their files next to this package's, or
point the loader at them with `data-with-css-<package>="…/"`. With a bundler, install the companion
(`npm i @withicons/classes-plus`) and import its files, e.g. `@withicons/classes-plus/with-glass.css`.

With a bundler or a self-hosted copy:

```bash
npm i @withicons/classes
```
```js
import '@withicons/classes/with-base.css'    // the base rules, then only the icons you use
import '@withicons/classes/line/home.css'
import '@withicons/classes/solid/heart.css'
// or a whole style: import '@withicons/classes/with-line.css' (every line icon; with-solid.css, with-duo.css, ...)
```

A small subset as one stylesheet without a bundler: concatenate the base rules and the icons' files,
`cd node_modules/@withicons/classes/dist && cat with-base.css line/home.css solid/heart.css > icons.css`.

Plain `<i>`/`<span>` elements with classes. Three interchangeable ways to render them, lightest first:

### 1. CSS on demand (recommended from a CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>

<i class="with with-home"></i>                      <!-- line (default) -->
<i class="with with-heart with-solid"></i>
<i class="with with-search with-2x with-spin"></i>
```

`with-loader.js` (22 KB, 9 KB gzip) adds the base rules, finds every `with with-<name>` on the
page and links just that icon's rule: `dist/<style>/<name>.css` (a `line` icon is typically 464 bytes,
292 gzip; a `liquid` icon about 15.2 KB, 3.0 KB gzip). Any style mix costs only the icons shown, and icons
added later (or re-classed) load theirs. The rendering is the CSS-only one below (masks, no inline SVG); aliases get their
canonical class added with a console hint. Without JavaScript, link the same files yourself:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-base.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/line/home.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/solid/heart.css">
```

### 2. One stylesheet per style (zero JS)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-line.css">

<i class="with with-home"></i>
<i class="with with-search with-2x with-spin"></i>
```

One file per style (`with-line.css`, `with-solid.css`, `with-duo.css`, `with-gloss.css`, `with-engrave.css`, `with-blueprint.css`, `with-sketch.css`, `with-glass.css`, `with-kawaii.css`, `with-sticker.css`, `with-pixel.css`, `with-retro.css`, `with-luxe.css`, `with-bauhaus.css`, `with-skeuo.css`, `with-anime.css`, `with-gothic.css`, `with-pastel.css`, `with-coquette.css`, `with-plush.css`, `with-clay.css`, `with-bento.css`, `with-suite.css`, `with-dock.css`, `with-liquid.css`, `with-chrome.css`, `with-soft3d.css`, `with-brutal.css`, `with-utsav.css`, `with-rangoli.css`, `with-halloween.css`, `with-christmas.css`, `with-lunar.css`, `with-valentine.css`), each holding all 1000 icons
(see the sizes below: the default `with-line.css` is 65 KB gzipped, the richest styles several hundred KB).
`with-all.css` imports every style file: 146.7 MB (27.1 MB gzipped) in 34 requests,
so keep it for prototypes and offline tools, never for a production page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-all.css">   <!-- heavy: every icon in every style -->

<i class="with with-home with-solid"></i>
<span class="with with-heart with-gloss"></span>
```

Without a style class an icon is `line` (when `with-line.css` or `with-all.css` is loaded; if you load a single other style file,
bare `with with-<name>` uses that style). Each icon is an SVG data-URI used as a CSS `mask` over `currentColor` (drawn in the
element's `::after`), so it takes the text colour and font size (`1em` square, `vertical-align: -.125em`). In mono styles the duo tint
and blueprint construction lines render as translucent `currentColor`.

**Palette styles** (`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`) keep their colours in CSS-only mode too: the palette is the element's
`background-image` (default colours baked in) and the ink is the `currentColor` mask on top, with the original stacking order
preserved, so `color` still recolours the outline. The `--with-<style>-<role>` variables cannot reach into a data URI, so to
re-theme a palette use the JS runtime below (or a component), where every variable works.

Use the JS runtime for live CSS variables and stroke width.

| file | size | gzip |
|---|---|---|
| `<style>/<name>.css` (one icon, typical) | 464 B (`line`) to 15.2 KB (`liquid`) | 292 B to 3.0 KB |
| `with-line.css` | 487 KB | 65 KB |
| `with-solid.css` | 1.5 MB | 431 KB |
| `with-duo.css` | 796 KB | 82 KB |
| `with-gloss.css` | 1.6 MB | 398 KB |
| `with-engrave.css` | 2.4 MB | 605 KB |
| `with-blueprint.css` | 1.3 MB | 198 KB |
| `with-sketch.css` | 1.3 MB | 331 KB |
| `with-glass.css` | 8.4 MB | 1.2 MB |
| `with-kawaii.css` | 1.9 MB | 295 KB |
| `with-sticker.css` | 4.6 MB | 494 KB |
| `with-pixel.css` | 1.3 MB | 147 KB |
| `with-retro.css` | 2.4 MB | 574 KB |
| `with-luxe.css` | 6.3 MB | 1.8 MB |
| `with-bauhaus.css` | 1.6 MB | 328 KB |
| `with-skeuo.css` | 10.6 MB | 1.3 MB |
| `with-anime.css` | 3.2 MB | 761 KB |
| `with-gothic.css` | 7.5 MB | 2.2 MB |
| `with-pastel.css` | 3.7 MB | 828 KB |
| `with-coquette.css` | 6.4 MB | 1.7 MB |
| `with-plush.css` | 5.2 MB | 1.3 MB |
| `with-clay.css` | 7.4 MB | 1.3 MB |
| `with-bento.css` | 3.9 MB | 298 KB |
| `with-suite.css` | 2.8 MB | 452 KB |
| `with-dock.css` | 6.2 MB | 775 KB |
| `with-liquid.css` | 14.5 MB | 2.0 MB |
| `with-chrome.css` | 6.7 MB | 1.7 MB |
| `with-soft3d.css` | 8.1 MB | 1.4 MB |
| `with-brutal.css` | 2.9 MB | 652 KB |
| `with-utsav.css` | 3.4 MB | 716 KB |
| `with-rangoli.css` | 2.6 MB | 585 KB |
| `with-halloween.css` | 4.7 MB | 689 KB |
| `with-christmas.css` | 4.5 MB | 749 KB |
| `with-lunar.css` | 2.3 MB | 497 KB |
| `with-valentine.css` | 4.1 MB | 702 KB |
| `with-all.css` (imports every style file) | 146.7 MB | 27.1 MB |
| `with-base.css` | 2 KB | 1 KB |
| `with-icons.js` | 31 KB | 11 KB |
| `with-loader.js` | 22 KB | 9 KB |

### 3. JS runtime (inline SVG)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>
```

A classic (non-module), dependency-free script that draws the icons from
[`@withicons/web`](https://www.npmjs.com/package/@withicons/web) at the same version. It injects an inline `<svg class="with-svg">` into every element with class
`with` and an `with-<name>` class, and keeps doing so for elements added or changed later (MutationObserver on added nodes and
`class` / `aria-label` / `data-with-stroke-width` changes). Only the icons actually shown are downloaded, one small
module each (`@withicons/web/dist/icons/<style>/<name>.js`, fetched from the sibling `@withicons/web` path on the
same CDN or `node_modules`, else jsDelivr; point it elsewhere with `data-with-web="/vendor/withicons-web/dist/"` on the script tag). `WithIcons.load(style)` still fetches a whole style.
It can be combined with the CSS files: the mask shows until the SVG arrives, then it is switched off.

- `data-with-stroke-width="1.5"` on the element: stroke width for `line`, `duo`, `blueprint`, `sketch`, `kawaii`.
- Aliases work (`with-bin` -> `trash`, with a one-time console hint); unknown names warn with the nearest suggestions.
- Opt a subtree out with `data-with-skip`.
- `window.WithIcons`: `render(root?)`, `svg(name, style?, opts?)` (Promise of an svg string), `load(style)`, `styles`, `version`.
  Types: `dist/with-icons.d.ts`.

### Size

An icon is `1em` square, so it follows the text size. Setting only `height` does not grow it (the width stays `1em`).
Any of these works:

```html
<i class="with with-home" style="font-size: 48px"></i>      <!-- 1. font-size (also scales with the text around it) -->
<i class="with with-home with-3x"></i>                       <!-- 2. a size class: 3 x the text size -->
<i class="with with-home" style="--with-size: 48px"></i>    <!-- 3. an exact size, whatever the text size -->
```

### Modifiers

| class | effect |
|---|---|
| `with-xs` / `with-sm` / `with-lg` | .75em / .875em / 1.33em (lg also `vertical-align: -.25em`) |
| `with-2x` … `with-5x` | 2em … 5em |
| `with-fw` | fixed width 1.25em, icon centred (for lists / menus) |
| `with-spin` / `with-pulse` | rotate continuously (1.6s linear) / in 8 steps; disabled under `prefers-reduced-motion` |
| `with-rotate-90` / `-180` / `-270` | rotate |
| `with-flip-h` / `with-flip-v` / `with-flip-both` | mirror (combines with rotate and spin) |
| `with-rtl` | mirror only inside right-to-left text (`dir="rtl"`), for directional icons (`with-arrow-right`, `with-undo`…) |

### Accessibility

Icons are decorative by default (empty element; the JS-rendered svg is `aria-hidden`). For a meaningful icon give the element
a name: `<i class="with with-trash" role="img" aria-label="Delete"></i>`. With the JS runtime, an `aria-label` also becomes the
svg's `role="img"` + `<title>`. Inside a labelled button keep the icon decorative.

CSS-only icons stay visible in Windows High Contrast (forced colours: the ink takes the system text, link or button colour)
and they print even with the browser's "Background graphics" option off.

### CSS or JS?

- **CSS on demand** (`with-loader.js`): the CSS rendering, downloading only the icons on the page.
- **CSS stylesheet**: zero JS, works in emails-to-web, static sites, CMS content; one request per style; palette styles in their default colours.
- **JS runtime**: live CSS variables (`--with-duo`, `--with-accent`, `--with-<style>-<role>`), `data-with-stroke-width`, aliases and typo hints, only the icons you show are fetched.
- Using a framework? Prefer the component packages (`@withicons/react`, `vue`, `svelte`…) or `<with-icon>` (`@withicons/web`).

## Files

| path | what |
|---|---|
| `dist/with-loader.js` | CSS on demand: links `dist/<style>/<name>.css` for each icon on the page |
| `dist/with-<style>.css` | one style, every icon (`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette`, `plush`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `brutal`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`) |
| `dist/<style>/<name>.css` | one icon in one style (needs `with-base.css` or the loader) |
| `dist/with-base.css` | the shared base rules and modifiers |
| `dist/with-all.css` | `@import` of every style file (prototypes only) |
| `dist/with-icons.js` (+ `.d.ts`) | JS runtime: inline SVG from `@withicons/web` |
| `dist/data/alias/<n>.js`, `dist/data/meta.js` | alias and typo lookups, loaded only for a non-canonical class |
| `dist/demo.html` | every style, modifier and runtime feature on one page |

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
