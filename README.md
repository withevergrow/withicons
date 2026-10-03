# with icons

[withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com)

Open-source icons: **500 icons x 20 styles = 10,000 icons**, MIT licensed, with optional animations and a set of
**live icons** whose dates, times, counts and labels you set. Every icon is one hand-drawn skeleton (24x24 grid,
`forge/icons/<name>.json`); twenty deterministic renderers turn it into twenty styles, so all 10,000 stay one consistent family.

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

## The 20 styles

| style | kind | subpath | look |
|---|---|---|---|
| `line` | universal | *(default)* | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | universal | `/solid` | The filled companion to Line: bold mass and crisp knockouts. |
| `duo` | universal | `/duo` | The line drawing over a soft tonal fill. Recolour the tone with `--with-duo`. |
| `gloss` | creative | `/gloss` | Inflated, glossy and pillowy, with carved specular highlights, in one flat colour. |
| `engrave` | creative | `/engrave` | Banknote intaglio: a swelling contour and burin hatching that models light and shade. |
| `blueprint` | creative | `/blueprint` | A drafting-table drawing: hairline keylines, centre lines and open control nodes. |
| `sketch` | creative | `/sketch` | Loose marker strokes drawn twice, with crossing corners and a light hachure. |
| `glass` | palette | `/glass` | Layered frosted glass (glassmorphism): a vivid colour glowing through a translucent pane with a crisp rim. |
| `kawaii` | palette | `/kawaii` | Chubby pastel shapes with a soft thick outline and a tiny blushing face. |
| `sticker` | palette | `/sticker` | Y2K die-cut vinyl stickers: candy colours, a puffy white border, a glossy shine and sparkles. |
| `pixel` | palette | `/pixel` | Hand-tuned 16-bit pixel art, sharp at 16, 32 and 48px. |
| `retro` | palette | `/retro` | Warm 70s patches: chunky outlines, sunset-striped fills and a hard offset shadow. |
| `luxe` | studio | `/luxe` | Premium multi-layered 3D: sapphire enamel slabs with an extruded wall, polished gold, a jewel, lit chamfers and a crisp highlight. |
| `bauhaus` | studio | `/bauhaus` | Bauhaus posters in miniature: pure circles, squares and bars in red, yellow and blue, overprinted where they meet. |
| `skeuo` | studio | `/skeuo` | Skeuomorphic: each icon a small object in a real material (paper, leather, metal, brass, glass), lit from above. |
| `anime` | storybook | `/anime` | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow, a bright specular shine and the odd sparkle. |
| `gothic` | storybook | `/gothic` | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches and tracery. |
| `pastel` | storybook | `/pastel` | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | storybook | `/coquette` | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | storybook | `/plush` | Stuffed toys sewn from felt for kids: puffy panels, dark piping, running stitches, buttons and embroidery. |

The seven mono styles paint in `currentColor`, so they follow your text colour on light and dark backgrounds (duo's tone and
blueprint's accent can take a second colour through `--with-duo` and `--with-accent`).
The five palette styles, the three studio styles and the five storybook styles ship a default palette that reads on white and on
near-black; every colour is a CSS variable (`--with-<style>-<role>`; the studio and storybook styles use the palette role names:
`--with-luxe-c1`, `--with-bauhaus-c3`, `--with-anime-shadow`)
and the ink still follows `currentColor`, so one line of CSS re-themes them:

```css
.hero { --with-kawaii-fill-1: #c4b5fd; --with-retro-1: #fde047; --with-luxe-c1: #0f766e; --with-coquette-c3: #be123c; }
```

The universal styles are for everyday UI; the creative, palette, studio and storybook styles are for illustration, marketing, slides and empty states.

## Colour palettes

Every icon ships 20-30 colour palettes picked for that icon (pizza: Margherita, Pepperoni, Pesto verde…), 11,423 in all.
A palette sets ten colour roles (`ink`, `c1`-`c4`, `tint`, `accent`, `shadow`, `shine`, `edge`) and every multi-colour
style (`duo`, `blueprint`, `glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`,
`coquette`, `plush`) maps them onto its own variables, so one palette
changes **every** colour of an icon in any of those styles:

```js
import pizza from '@withicons/core/palettes/pizza.json' with { type: 'json' }
import { applyPalette, bakePalette } from '@withicons/core/palettes/palette-map.js'
import retro from '@withicons/core/nodes/retro'
import { toSvg } from '@withicons/core'

const svg = toSvg(retro.pizza, 'retro')
applyPalette(svg, pizza.palettes[1].colors)  // { vars: { '--with-retro-1': '#F7C64B', … }, color: '#3A1408' }: set as inline CSS
bakePalette(svg, pizza.palettes[1].colors)   // the same SVG with the hex colours written in, for files and design tools
```

The MCP server (`list_palettes`, and `get_icon` with `palette` / `colors`) and the CLI (`npx withicons palettes pizza`,
`npx withicons get pizza --style retro --palette pepperoni`) return the same palettes as ready code.

## Animation

Optional and separate: [`@withicons/motion`](packages/motion) animates the element that holds any icon, in any style
or package, with pure CSS. Every icon has a tuned continuous loop and hover effect, plus icon-to-icon swaps.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion/dist/icons.css">

<span class="wm wm-loop" data-wm="bell">…bell icon…</span>                                     <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>   <!-- on hover -->
<span class="wm-swap wm-fx-morph"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>
```

`prefers-reduced-motion` switches everything off. Agents get exact code from the MCP tool `animate_icon` or
`npx withicons animate bell --trigger hover --format react`. Spec: [`forge/MOTION.md`](forge/MOTION.md).

## Live icons

A separate set of up to 50 icons whose content you set: a calendar with a date, a clock with a time, a bell with a count,
a battery at a level, a weather icon with a temperature, a tag with a short word. Each is a small generator
(`forge/dynamic/<name>.mjs`) that builds an ordinary skeleton, so it renders in every style.

```js
import { render } from '@withicons/dynamic'
render('calendar-date', { day: 17, month: 'MAR' }, 'luxe', { size: 48 })   // -> SVG string
```
```html
<with-live-icon name="calendar-date" day="17" month="MAR" variant="bauhaus"></with-live-icon>
```

Try them at [withicons.com/live.html](https://withicons.com/live.html). Spec: [`forge/DYNAMIC.md`](forge/DYNAMIC.md).

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
| [`@withicons/motion`](packages/motion) | `npm i @withicons/motion` | `import '@withicons/motion/motion.css'` (animations, optional) |
| [`@withicons/dynamic`](packages/dynamic) | `npm i @withicons/dynamic` | `import { render } from '@withicons/dynamic'` (live icons) |
| [`@withicons/search`](packages/search) | `npm i @withicons/search` | `import { create } from '@withicons/search'` |
| [`@withicons/mcp`](packages/mcp) | `npx -y @withicons/mcp` | MCP server for AI assistants (search, code, animation) |
| [`withicons`](packages/cli) | `npx withicons search "throw away"` | CLI: search, code, `init` for AI coding tools |

No build step, straight from a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web/dist/index.js"></script>
<with-icon name="home" variant="solid"></with-icon>
```

## The same API everywhere

- **Default path = `line`.** Other styles: `<pkg>/solid`, `<pkg>/duo`, `<pkg>/gloss`, `<pkg>/engrave`, `<pkg>/blueprint`, `<pkg>/sketch`,
  `<pkg>/glass`, `<pkg>/kawaii`, `<pkg>/sticker`, `<pkg>/pixel`, `<pkg>/retro`, `<pkg>/luxe`, `<pkg>/bauhaus`, `<pkg>/skeuo`,
  `<pkg>/anime`, `<pkg>/gothic`, `<pkg>/pastel`, `<pkg>/coquette`, `<pkg>/plush`.
- **Names:** PascalCase of the kebab-case icon name, exported twice: `ArrowRight` and `ArrowRightIcon`.
- **Deep imports:** `<pkg>/icons/home` (line) and `<pkg>/solid/icons/home`.
- **Props:** `size` (24), `color` (`currentColor`), `strokeWidth` (styles with live strokes), `absoluteStrokeWidth`,
  `title` or `aria-label` (sets `role="img"`, otherwise `aria-hidden`), `className` / `class`; everything else goes to the `<svg>`.
  `<with-icon>` takes the same as attributes (`stroke-width`, `absolute-stroke-width`, `label`), plus `name` and `variant`.
- **Dynamic names:** `<Icon name="home" variant="solid" />`. It pulls in every icon, so prefer named imports.
- **Aliases:** names you might guess resolve to the real icon (`bin` -> `trash`, `house` -> `home`).
  `resolve()` in `@withicons/core` throws on ambiguous aliases (listing the candidates) and on unknown names (suggesting the 3 nearest).

## Website

The zero-build site in [`site/`](site) (open `site/index.html`) lets you browse and search all icons in every style,
copy the SVG or its import line, and read [`site/llms.txt`](site/llms.txt), a guide for AI agents. Every icon page has a
**Customize** studio: pick a style, change every colour of a multi-colour icon (one picker per colour, or one of the
icon's palettes), try its animations and swaps, and download it as PNG, SVG, PDF, GIF, video, Lottie, PowerPoint, Word,
favicons or framework code.

## Repository

```
forge/icons/<name>.json    one skeleton per icon (the only hand-drawn input)
forge/styles/<style>.mjs   the twenty style renderers
forge/dynamic/<name>.mjs   live icon generators (forge/DYNAMIC.md)
forge/motion/<name>.json   one animation spec per icon (forge/MOTION.md)
forge/palettes/<name>.json 20-30 colour palettes per icon (forge/PALETTES.md)
forge/lib/emit-*.mjs       package emitters
packages/*                 the npm packages (dist/ is generated)
site/                      the website
```

```bash
node forge/build.mjs                  # render every icon x style, emit every package + site data
node forge/build.mjs react vue        # only some emitters
node forge/tools/check.mjs home lock  # lint skeletons and render them through every style
node forge/tools/check-motion.mjs     # validate the animation specs
node forge/tools/check-palettes.mjs   # validate the colour palettes
```

Contributing an icon: read [`forge/CONTRACT.md`](forge/CONTRACT.md) and [`forge/PARTS.md`](forge/PARTS.md).

## License

MIT. Every icon is original work drawn on the with icons grid.
