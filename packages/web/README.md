# @withicons/web

`<with-icon>`: a dependency-free custom element for 300 icons x 7 styles. Works in any framework or none.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@0.1.0/dist/index.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
```

Or with a bundler:

```bash
npm i @withicons/web
```
```js
import '@withicons/web'   // registers <with-icon>; each style's data loads on first use
```

## Attributes

| attribute | default | notes |
|---|---|---|
| `name` | — | canonical name or unambiguous alias (`bin` -> `trash`) |
| `variant` | `line` | `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch` (`style` is reserved in HTML) |
| `size` | `24` | px number or any CSS length |
| `color` | `currentColor` | inherits the CSS text color by default |
| `stroke-width` | style default | only styles with live strokes (line, duo, blueprint, sketch) |
| `absolute-stroke-width` | off | keep the stroke constant in px at any size |
| `label` | — | accessible name (`role="img"`); otherwise `aria-hidden` |

The same names work as JS properties (`el.variant = 'solid'`). Style the inner svg with `with-icon::part(svg)`.

## Entry points

| import | what | size |
|---|---|---|
| `@withicons/web` (`dist/index.js`) | element + lazy per-style chunks (`dist/data/<style>.js`) | tiny + ~59 KB per style used |
| `@withicons/web/full` (`dist/full.js`) | one file, every style inline, adds sync `svg(name, opts)` | ~2085 KB |

SSR-safe: importing never touches the DOM; the element is only defined when `customElements` exists.

```js
import { loadSvg } from '@withicons/web'
const markup = await loadSvg('home', { variant: 'solid', size: 20 })
```

<!-- with-classes:start -->
## Icon classes (Font Awesome style)

Plain `<i>`/`<span>` elements with classes, no build step. Two interchangeable ways to render them:

### 1. CSS only (zero JS)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-line.css">

<i class="with with-home"></i>                      <!-- line (default) -->
<i class="with with-search with-2x with-spin"></i>
```

One file per style (`with-line.css`, `with-solid.css`, `with-duo.css`, `with-gloss.css`, `with-engrave.css`, `with-blueprint.css`, `with-sketch.css`) or every style at once:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-all.css">

<i class="with with-home with-solid"></i>
<span class="with with-heart with-gloss"></span>
```

Without a style class an icon is `line` (when `with-line.css` or `with-all.css` is loaded; if you load a single other style file,
bare `with with-<name>` uses that style). Each icon is an SVG data-URI used as a CSS `mask` over `background-color: currentColor`,
so it takes the text colour and font size (`1em` square, `vertical-align: -.125em`). Masks are single-colour: the duo tint
and blueprint construction lines render as translucent `currentColor`. Use the JS runtime for real multi-colour and stroke width.

| file | size | gzip |
|---|---|---|
| `with-line.css` | 117 KB | 15 KB |
| `with-solid.css` | 367 KB | 106 KB |
| `with-duo.css` | 181 KB | 19 KB |
| `with-gloss.css` | 443 KB | 108 KB |
| `with-engrave.css` | 663 KB | 178 KB |
| `with-blueprint.css` | 313 KB | 43 KB |
| `with-sketch.css` | 354 KB | 82 KB |
| `with-all.css` | 2388 KB | 538 KB |
| `with-icons.js` | 12 KB | 4 KB |

### 2. JS runtime (inline SVG)

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/classes/with-icons.js" defer></script>

<i class="with with-home with-duo" style="--with-duo:#f59e0b"></i>
<i class="with with-ruler with-blueprint" style="--with-accent:#38bdf8"></i>
<i class="with with-settings" data-with-stroke-width="1.5"></i>
```

A classic (non-module), dependency-free script. It injects an inline `<svg class="with-svg">` into every element with class
`with` and an `with-<name>` class, and keeps doing so for elements added or changed later (MutationObserver on added nodes and
`class` / `aria-label` / `data-with-stroke-width` changes). Only the styles actually used are downloaded
(`dist/data/<style>.js`, resolved relative to the script's URL; override with `data-with-base="…/"` on the script tag).
It can be combined with the CSS files: the mask shows until the SVG arrives, then it is switched off.

- `data-with-stroke-width="1.5"` on the element: stroke width for `line`, `duo`, `blueprint`, `sketch`.
- Aliases work (`with-bin` -> `trash`, with a one-time console hint); unknown names warn with the nearest suggestions.
- Opt a subtree out with `data-with-skip`.
- `window.WithIcons`: `render(root?)`, `svg(name, style?, opts?)` (Promise of an svg string), `load(style)`, `styles`, `version`.
  Types: `dist/classes/with-icons.d.ts`.

### Modifiers

| class | effect |
|---|---|
| `with-xs` / `with-sm` / `with-lg` | .75em / .875em / 1.33em (lg also `vertical-align: -.25em`) |
| `with-2x` … `with-5x` | 2em … 5em |
| `with-fw` | fixed width 1.25em, icon centred (for lists / menus) |
| `with-spin` / `with-pulse` | rotate continuously (1.6s linear) / in 8 steps; disabled under `prefers-reduced-motion` |
| `with-rotate-90` / `-180` / `-270` | rotate |
| `with-flip-h` / `with-flip-v` / `with-flip-both` | mirror (combines with rotate and spin) |

### Accessibility

Icons are decorative by default (empty element; the JS-rendered svg is `aria-hidden`). For a meaningful icon give the element
a name: `<i class="with with-trash" role="img" aria-label="Delete"></i>`. With the JS runtime, an `aria-label` also becomes the
svg's `role="img"` + `<title>`. Inside a labelled button keep the icon decorative.

### CSS or JS?

- **CSS**: zero JS, works in emails-to-web, static sites, CMS content; one HTTP request; single-colour.
- **JS**: true multi-colour (`--with-duo`, `--with-accent`), `data-with-stroke-width`, aliases and typo hints, only the styles you use are fetched.
- Using a framework? Prefer the component packages (`@withicons/react`, `vue`, `svelte`…) or `<with-icon>`.
<!-- with-classes:end -->

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
