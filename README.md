# with icons

[withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com)

Open-source icons: **300 icons x 7 styles = 2,100 icons**, MIT licensed.
Every icon is one hand-drawn skeleton (24x24 grid, `forge/icons/<name>.json`); seven deterministic
renderers turn it into seven styles, so all 2,100 stay one consistent family.

```bash
npm i @withicons/react
```

```jsx
import { Home, Search } from '@withicons/react'          // line (the default style)
import { Home as HomeSolid } from '@withicons/react/solid' // any style is a subpath

<Home />
<Search size={20} strokeWidth={1.5} />
<HomeSolid size={32} color="#e11d48" title="Home" />
```

## The 7 styles

| style | kind | subpath | look |
|---|---|---|---|
| `line` | universal | *(default)* | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | universal | `/solid` | The filled companion to Line: bold mass and crisp knockouts. |
| `duo` | universal | `/duo` | The line drawing over a soft tonal fill. Recolour the tone with `--with-duo`. |
| `gloss` | creative | `/gloss` | Inflated, glossy and pillowy, with carved specular highlights, in one flat colour. |
| `engrave` | creative | `/engrave` | Banknote intaglio: a swelling contour and burin hatching that models light and shade. |
| `blueprint` | creative | `/blueprint` | A drafting-table drawing: hairline keylines, centre lines and open control nodes. |
| `sketch` | creative | `/sketch` | Loose marker strokes drawn twice, with crossing corners and a light hachure. |

Every style is single-colour `currentColor`: it follows your text color on light and dark backgrounds.
The universal styles are for everyday UI; the creative styles are for illustration, marketing and empty states.

## Packages

| package | install | canonical import |
|---|---|---|
| [`@withicons/react`](packages/react) | `npm i @withicons/react` | `import { Home } from '@withicons/react'` |
| [`@withicons/vue`](packages/vue) | `npm i @withicons/vue` | `import { Home } from '@withicons/vue'` |
| [`@withicons/svelte`](packages/svelte) | `npm i @withicons/svelte` | `import { Home } from '@withicons/svelte'` |
| [`@withicons/angular`](packages/angular) | `npm i @withicons/angular` | `import { WithIconComponent, Home } from '@withicons/angular'` |
| [`@withicons/solid`](packages/solid) | `npm i @withicons/solid` | `import { Home } from '@withicons/solid'` |
| [`@withicons/web`](packages/web) | `npm i @withicons/web` | `import '@withicons/web'` then `<with-icon name="home">` |
| [`@withicons/static`](packages/static) | `npm i @withicons/static` | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| [`@withicons/core`](packages/core) | `npm i @withicons/core` | `import { resolve, search } from '@withicons/core'` |

No build step, straight from a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/index.js"></script>
<with-icon name="home" variant="solid"></with-icon>
```

## The same API everywhere

- **Default path = `line`.** Other styles: `<pkg>/solid`, `<pkg>/duo`, `<pkg>/gloss`, `<pkg>/engrave`, `<pkg>/blueprint`, `<pkg>/sketch`.
- **Names:** PascalCase of the kebab-case icon name, exported twice: `ArrowRight` and `ArrowRightIcon`.
- **Deep imports:** `<pkg>/icons/home` (line) and `<pkg>/solid/icons/home`.
- **Props:** `size` (24), `color` (`currentColor`), `strokeWidth` (styles with live strokes), `absoluteStrokeWidth`,
  `title` (sets `role="img"`, otherwise `aria-hidden`), `className` / `class`; everything else goes to the `<svg>`.
- **Dynamic names:** `<Icon name="home" variant="solid" />`. It pulls in every icon, so prefer named imports.
- **Aliases:** names you might guess resolve to the real icon (`bin` -> `trash`, `house` -> `home`).
  `resolve()` in `@withicons/core` throws on ambiguous aliases (listing the candidates) and on unknown names (suggesting the 3 nearest).

## Website

The zero-build site in [`site/`](site) (open `site/index.html`) lets you browse and search all icons in every style,
copy the SVG or its import line, and read [`site/llms.txt`](site/llms.txt), a guide for AI agents.

## Repository

```
forge/icons/<name>.json    one skeleton per icon (the only hand-drawn input)
forge/styles/<style>.mjs   the seven style renderers
forge/lib/emit-*.mjs       package emitters
packages/*                 the npm packages (dist/ is generated)
site/                      the website
```

```bash
node forge/build.mjs                  # render every icon x style, emit every package + site data
node forge/build.mjs react vue        # only some emitters
node forge/tools/check.mjs home lock  # lint skeletons and render them through every style
```

Contributing an icon: read [`forge/CONTRACT.md`](forge/CONTRACT.md) and [`forge/PARTS.md`](forge/PARTS.md).

## License

MIT. Every icon is original work drawn on the with icons grid.
