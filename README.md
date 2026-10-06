<div align="center">

<a href="https://withicons.com"><img src="https://withicons.com/media/github/banner.png" alt="with icons: 500 icons, 20 styles, all animated. 10,000 free, open-source icons." width="100%"></a>

<h3>Free, open-source icons that can’t sit still.</h3>

**500 icons x 20 styles = 10,000 icons.** Every one animated. Plus 50 live icons. MIT, no sign-up.<br>
For slides, Canva, Figma, websites, apps and AI agents.

[![npm](https://img.shields.io/npm/v/@withicons/react?label=npm&color=2F5BFF&logo=npm)](https://www.npmjs.com/package/@withicons/react)
[![License: MIT](https://img.shields.io/badge/license-MIT-22A861)](LICENSE)
[![npm provenance](https://img.shields.io/badge/npm-provenance-7252FF?logo=githubactions&logoColor=white)](https://www.npmjs.com/package/@withicons/react#provenance)
[![Icons](https://img.shields.io/badge/icons-10%2C000-FF5A36)](https://withicons.com/icons.html)
[![Web component](https://img.shields.io/badge/web%20component-7%20KB%20gzipped-FF4FA3)](https://withicons.com/developers.html)
[![MCP](https://img.shields.io/badge/MCP-ready-111318)](https://withicons.com/ai.html)

**[Browse icons](https://withicons.com/icons.html)** ·
[Live icons](https://withicons.com/live.html) ·
[Guides](https://withicons.com/guides/index.html) ·
[Developers](https://withicons.com/developers.html) ·
[For AI](https://withicons.com/ai.html) ·
[About](https://withicons.com/about.html)

<br>

<img src="https://withicons.com/media/github/animated.gif" alt="Eight animated icons in eight styles: a bell, a heart, a rocket, a cat, a sun, a gift, a star and a cloud." width="100%">

</div>

## Why with icons

- **One family, twenty looks.** Every icon is drawn once by hand on a 24x24 grid. Twenty deterministic renderers turn that
  drawing into twenty styles, from clean `line` to `luxe` 3D, `anime`, `kawaii`, `bauhaus` and felt `plush`. Switch styles and nothing moves.
- **Every icon moves.** Each one has its own tuned loop and hover animation, plus icon-to-icon swaps. Pure CSS, off for reduced motion.
- **Live icons.** A calendar with your date, a clock with your time, a bell with your count, in every style.
- **Built for people and AI agents.** Copy into Slides, Canva or Figma, install a package, or let your agent search by meaning through MCP.
- **Free means free.** MIT. Commercial use, no credit needed.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://withicons.com/media/github/styles-dark.png">
  <img src="https://withicons.com/media/github/styles-light.png" alt="The rocket icon in all 20 styles: line, solid, duo, gloss, engrave, blueprint, sketch, glass, kawaii, sticker, pixel, retro, luxe, bauhaus, skeuo, anime, gothic, pastel, coquette and plush." width="100%">
</picture>

## Quick start

Not a developer? Open **[withicons.com](https://withicons.com/icons.html)**, find an icon, copy it or download it
(PNG, SVG, PDF, PowerPoint, GIF, Lottie and more). The [guides](https://withicons.com/guides/index.html) show every app step by step.

<details open>
<summary><b>React</b></summary>

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
</details>

<details>
<summary><b>Vue</b></summary>

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
  <Search :size="20" :stroke-width="1.5" />
  <HomeSolid :size="32" color="#e11d48" title="Home" />
</template>
```
</details>

<details>
<summary><b>Svelte</b></summary>

```bash
npm i @withicons/svelte
```

```svelte
<script>
  import { Home, Search } from '@withicons/svelte'
  import { Home as HomeSolid } from '@withicons/svelte/solid'
</script>

<Home />
<Search size={20} strokeWidth={1.5} />
<HomeSolid size={32} color="#e11d48" title="Home" />
```
</details>

<details>
<summary><b>Angular, Solid</b></summary>

```bash
npm i @withicons/angular   # import { WithIconComponent, Home } from '@withicons/angular'
npm i @withicons/solid     # import { Home } from '@withicons/solid'
```
</details>

<details>
<summary><b>HTML, no build step (CDN)</b></summary>

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>
<with-icon name="home" variant="solid"></with-icon>
```

`cdn.js` is about 7 KB gzipped, then each icon is its own small file (a `line` icon is about 150 bytes gzipped).
</details>

<details>
<summary><b>CSS classes (Font Awesome style)</b></summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>
<i class="with with-home"></i> <i class="with with-heart with-solid"></i>
```

The loader (about 6 KB gzipped) links just the CSS of the icons on the page. Zero JavaScript: link one stylesheet per style, such as `with-line.css`.
</details>

<details>
<summary><b>Command line</b></summary>

```bash
npx withicons search "throw away"                         # find icons by meaning
npx withicons get trash --style solid --format react      # paste-ready code
npx withicons export bell --style anime --format gif      # files: svg, png, pdf, pptx, gif, lottie…
```
</details>

## For AI agents

One command adds the with icons agent skill and MCP server to Claude Code, Codex, Cursor, VS Code, Windsurf, opencode and more:

```bash
npx withicons init
```

- **MCP server:** remote at `https://withicons.com/mcp`, or local with `npx -y @withicons/mcp`. Tools to search by meaning,
  get paste-ready code, animate and export icons. Details: [withicons.com/ai.html](https://withicons.com/ai.html).
- **Agent skill:** [`skills/with-icons/SKILL.md`](skills/with-icons/SKILL.md) (also `npx withicons skill`).
- **llms.txt:** [withicons.com/llms.txt](https://withicons.com/llms.txt) and [llms-full.txt](https://withicons.com/llms-full.txt), plus a JSON catalogue at [icons.json](https://withicons.com/icons.json).

Then just ask: *“Add a settings icon in the duo style to the sidebar”* or *“Make the bell ring when a notification arrives.”*

## Reference

### The 20 styles

| style | group | subpath | look |
|---|---|---|---|
| `line` | Everyday | *(default)* | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | Everyday | `/solid` | The filled companion to Line: bold mass and crisp knockouts. |
| `duo` | Everyday | `/duo` | The line drawing over a soft tonal fill. Recolour the tone with `--with-duo`. |
| `gloss` | Crafted | `/gloss` | Inflated, glossy and pillowy, with carved specular highlights, in one flat colour. |
| `engrave` | Crafted | `/engrave` | Banknote intaglio: a swelling contour and burin hatching that models light and shade. |
| `blueprint` | Crafted | `/blueprint` | A drafting-table drawing: hairline keylines, centre lines and open control nodes. |
| `sketch` | Crafted | `/sketch` | Loose marker strokes drawn twice, with crossing corners and a light hachure. |
| `glass` | Playful | `/glass` | Layered frosted glass (glassmorphism): a vivid colour glowing through a translucent pane with a crisp rim. |
| `kawaii` | Playful | `/kawaii` | Chubby pastel shapes with a soft thick outline and a tiny blushing face. |
| `sticker` | Playful | `/sticker` | Y2K die-cut vinyl stickers: candy colours, a puffy white border, a glossy shine and sparkles. |
| `pixel` | Playful | `/pixel` | Hand-tuned 16-bit pixel art, sharp at 16, 32 and 48px. |
| `retro` | Playful | `/retro` | Warm 70s patches: chunky outlines, sunset-striped fills and a hard offset shadow. |
| `luxe` | Studio | `/luxe` | Premium multi-layered 3D: sapphire enamel slabs with an extruded wall, polished gold, a jewel, lit chamfers and a crisp highlight. |
| `bauhaus` | Studio | `/bauhaus` | Bauhaus posters in miniature: pure circles, squares and bars in red, yellow and blue, overprinted where they meet. |
| `skeuo` | Studio | `/skeuo` | Skeuomorphic: each icon a small object in a real material (paper, leather, metal, brass, glass), lit from above. |
| `anime` | Storybook | `/anime` | Anime cel style: crisp tapered ink line art, flat cel colour with one hard shadow, a bright specular shine and the odd sparkle. |
| `gothic` | Storybook | `/gothic` | Cathedral craft: carved limestone, stained glass in ruby, sapphire, gold and emerald set in dark lead, pointed arches and tracery. |
| `pastel` | Storybook | `/pastel` | Soft pastel colour fields in lavender, peach, mint, baby blue, butter and blush, with gentle tonal depth. |
| `coquette` | Storybook | `/coquette` | Ballet-pink romance: blush satin objects tied with ribbon-red bows, pearls, lace and delicate gold. |
| `plush` | Storybook | `/plush` | Stuffed toys sewn from felt for kids: puffy panels, dark piping, running stitches, buttons and embroidery. |

The seven mono styles paint in `currentColor`, so they follow your text colour on light and dark backgrounds (duo's tone and
blueprint's accent can take a second colour through `--with-duo` and `--with-accent`).
The five Playful styles, the three Studio styles and the five Storybook styles ship a default palette that reads on white and on
near-black; every colour is a CSS variable (`--with-<style>-<role>`; the Studio and Storybook styles use the palette role names:
`--with-luxe-c1`, `--with-bauhaus-c3`, `--with-anime-shadow`)
and the ink still follows `currentColor`, so one line of CSS re-themes them:

```css
.hero { --with-kawaii-fill-1: #c4b5fd; --with-retro-1: #fde047; --with-luxe-c1: #0f766e; --with-coquette-c3: #be123c; }
```

The styles come in five groups. Everyday (line, solid, duo) is for UI; Crafted, Playful, Studio and Storybook are for illustration, marketing, slides and empty states.

### Colour palettes

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

### Animation

Optional and separate: [`@withicons/motion`](packages/motion) animates the element that holds any icon, in any style
or package, with pure CSS. Every icon has a tuned continuous loop and hover effect, plus icon-to-icon swaps.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">  <!-- one file per animated icon -->

<span class="wm wm-loop" data-wm="bell">…bell icon…</span>                                     <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>   <!-- on hover -->
<span class="wm-swap wm-fx-morph"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>
```

`motion.css` (the presets) is about 10 KB gzipped and each icon's own moves are a 0.3 KB file; in a bundled app,
`import '@withicons/motion/icons.css'` has all 500 (about 18 KB gzipped). With `<with-icon motion="loop">` the element
links each icon's file for you. `prefers-reduced-motion` switches everything off. Agents get exact code from the MCP tool `animate_icon` or
`npx withicons animate bell --trigger hover --format react`. Spec: [`forge/MOTION.md`](forge/MOTION.md).

### Live icons

A separate set of up to 50 icons whose content you set: a calendar with a date, a clock with a time, a bell with a count,
a battery at a level, a weather icon with a temperature, a tag with a short word. Each is a small generator
(`forge/dynamic/<name>.mjs`) that builds an ordinary skeleton, so it renders in every style.

```js
import { render } from '@withicons/dynamic'
render('calendar-date', { day: 17, month: 'MAR' }, 'luxe', { size: 48 })   // -> SVG string
```
```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/dynamic@latest/dist/cdn/lite.js"></script>  <!-- ~35 KB gzipped; each icon and style loads on first use -->
<with-live-icon name="calendar-date" day="17" month="MAR" variant="bauhaus"></with-live-icon>
```

Try them at [withicons.com/live.html](https://withicons.com/live.html). Spec: [`forge/DYNAMIC.md`](forge/DYNAMIC.md).

### Packages

| package | install | canonical import |
|---|---|---|
| [`@withicons/react`](packages/react) | `npm i @withicons/react` | `import { Home } from '@withicons/react'` |
| [`@withicons/vue`](packages/vue) | `npm i @withicons/vue` | `import { Home } from '@withicons/vue'` |
| [`@withicons/svelte`](packages/svelte) | `npm i @withicons/svelte` | `import { Home } from '@withicons/svelte'` |
| [`@withicons/angular`](packages/angular) | `npm i @withicons/angular` | `import { WithIconComponent, Home } from '@withicons/angular'` |
| [`@withicons/solid`](packages/solid) | `npm i @withicons/solid` | `import { Home } from '@withicons/solid'` |
| [`@withicons/web`](packages/web) | `npm i @withicons/web` | `import '@withicons/web'` then `<with-icon name="home">` |
| [`@withicons/classes`](packages/classes) | `npm i @withicons/classes` | `import '@withicons/classes/with-line.css'` then `<i class="with with-home">` |
| [`@withicons/static`](packages/static) | `npm i @withicons/static` | `<svg><use href="sprite-line.svg#with-home"/></svg>` |
| [`@withicons/core`](packages/core) | `npm i @withicons/core` | `import { resolve, search } from '@withicons/core'` |
| [`@withicons/motion`](packages/motion) | `npm i @withicons/motion` | `import '@withicons/motion/motion.css'` (animations, optional) |
| [`@withicons/dynamic`](packages/dynamic) | `npm i @withicons/dynamic` | `import { render } from '@withicons/dynamic'` (live icons) |
| [`@withicons/search`](packages/search) | `npm i @withicons/search` | `import { create } from '@withicons/search'` |
| [`@withicons/mcp`](packages/mcp) | `npx -y @withicons/mcp` | MCP server for AI assistants (search, code, animation) |
| [`withicons`](packages/cli) | `npx withicons search "throw away"` | CLI: search, code, `init` for AI coding tools |

No build step, straight from a CDN. The page downloads only the icons it shows:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@latest/dist/cdn.js"></script>
<with-icon name="home" variant="solid"></with-icon>
```

`cdn.js` is 7 KB gzipped, then each icon is its own small file (a `line` icon about 150 bytes gzipped). Prefer
Font Awesome-style `<i>` tags? `with-loader.js` (6 KB gzipped) links just the CSS of the icons on the page, in any style:

```html
<script src="https://cdn.jsdelivr.net/npm/@withicons/classes@latest/dist/with-loader.js" defer></script>
<i class="with with-home"></i> <i class="with with-heart with-solid"></i>
```

Zero JavaScript: link one stylesheet per style (`with-line.css`, 26 KB gzipped). `with-all.css` imports every style
(about 6.3 MB gzipped) and is for prototypes only. Details: [`@withicons/classes`](packages/classes).

### The same API everywhere

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

### Website

The zero-build site in [`site/`](site) (open `site/index.html`) lets you browse and search all icons in every style,
copy the SVG or its import line, and read [`site/llms.txt`](site/llms.txt), a guide for AI agents. Every icon page has a
**Customize** studio: pick a style, change every colour of a multi-colour icon (one picker per colour, or one of the
icon's palettes), try its animations and swaps, and download it as PNG, SVG, PDF, GIF, video, Lottie, PowerPoint, Word,
favicons or framework code.

### Repository

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


## Contributing

Ideas, icon requests and drawings are very welcome.

- **Missing an icon?** [Request it](https://github.com/withevergrow/withicons/issues/new/choose) (search the [library](https://withicons.com/icons.html) first: many icons answer to several names).
- **Found a bug?** [Open an issue](https://github.com/withevergrow/withicons/issues). Questions and ideas go to [Discussions](https://github.com/withevergrow/withicons/discussions).
- **Drawing an icon or a style?** Read [`CONTRIBUTING.md`](CONTRIBUTING.md), [`forge/CONTRACT.md`](forge/CONTRACT.md) and [`forge/PARTS.md`](forge/PARTS.md). Agents working on this repo: [`AGENTS.md`](AGENTS.md).
- **Security:** please report privately, see [`SECURITY.md`](SECURITY.md).

## License

[MIT](LICENSE). Use the icons for anything, including commercial work, with no credit needed. If you pass on the icon files or
code themselves, keep the licence text with them. Every icon is original work drawn on the with icons grid.
The licence does not cover the with icons and Evergrow names and logos. Plain-English answers: [withicons.com/license.html](https://withicons.com/license.html).

<br>

<div align="center">

<a href="https://withicons.com"><img src="https://withicons.com/media/github/producthunt.gif" alt="An animated cat icon" width="120"></a>

**[withicons.com](https://withicons.com)**

Powered by <a href="https://withevergrow.com"><b>Evergrow</b></a>

<a href="https://withevergrow.com"><img src="https://withicons.com/brand/evergrow-square-128.webp" alt="Evergrow" width="40"></a>

</div>
