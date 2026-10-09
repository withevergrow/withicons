# @withicons/mcp

An [MCP](https://modelcontextprotocol.io) server for **with icons** — {{icons}} MIT icons, each drawn in {{styles}} styles
({{styleList}}). Your AI assistant can search icons in plain English
("throw away", "settigns", "money", "cute heart", "8-bit star") and get paste-ready SVG, React, Vue, Svelte, Angular,
Solid, web-component, CSS-class or data-URI code, plus animation code for the optional `@withicons/motion` package
({{animated}} icons have a tuned animation; every icon can use any preset), every icon's 20-30 hand-picked colour
palettes for the multi-colour styles, a style recommender (`recommend_styles`: "Diwali sale banner", "avatar picker for
a kids app", "AI landing page" -> the best styles with packages, snippets, presets and palettes), and **files**: SVG, PNG, PDF, PowerPoint, Word, Lottie, app assets and animated
GIF / APNG / SVG / PowerPoint for slides and docs (`export_icon`).

Self-contained: the search engine, the MCP SDK, the export formats and every icon are bundled — no network. PNG-based and
animated files use `@resvg/resvg-js`, an optional dependency installed with the server where your platform has a prebuilt binary.

## Tools

| tool | arguments | returns |
|---|---|---|
| `search_icons` | `query`, `limit?` (10), `style?`, `category?`, `format?` (react) | ranked names, why each matched (`matched alias "bin"`, typo-tolerant), a ready snippet, a link |
| `get_icon` | `name` (name **or alias**), `style?` (line), `format?` (svg), `size?` (24), `color?`, `flat?`, `palette?`, `colors?` | the code: `svg`, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri`; for multi-colour styles the icon's colour variables (role + default) and its palette ids; with `palette` / `colors`, the code recoloured (every colour, not just one) plus the CSS; a `motion` summary when the icon has a tuned animation |
| `recommend_styles` | `for?` (what you are making, plain words), `use?` (app · slides · saas · ai · brand · kids · print · festive), `icon?`, `limit?` (6) | the best styles for the job, best first, each with its group, what it is good for, the React import, `<with-icon>` and class snippets, the npm packages holding its raw files, its download-all zip, 3D motion support, holiday palettes (holiday styles) and the Duo presets (duo); festival icon categories, avatar advice (inclusive skin-tone palettes) and notes. Nothing recognised: every use and group |
| `list_palettes` | `name`, `style?`, `tag?`, `limit?` | the icon's 20-30 palettes (id, name, tags, ten role colours); with `style`, the exact `--with-*` variables and a CSS rule per palette |
| `animate_icon` | `name`, `trigger?` (`loop` · `hover` · `once` · `inview` · `swap`), `preset?`, `to?`, `effect?`, `style?`, `format?` (html), `duration?` | paste-ready animation code (`html`, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), the icon's motion spec and install lines. `inview` and the `draw` preset come wired to the JS runtime (`motion(el, name, options)` in a mount hook / module script). In a 3D style (clay, glass, liquid, chrome, soft3d, luxe, skeuo, dock, plush) the motion plays in 3D: the code adds `wm-3d` (or `style` to `motion()`), and the result has `motion3d` and `moves` (the moves the icon offers in that style; soft3d 3-5: its own, then `pop-up` / `press`, then `hop`, `turn`, `gleam` …) |
| `export_icon` | `name`, `style?`, `format?` (svg; one or a comma list), `size?`, `background?`, `matte?`, `palette?`, `colors?`, `color?`, `motion?` (loop · hover · once · swap · none · a preset), `to?`, `effect?`, `fps?`, `seconds?`, `loop?`, `all_styles?`, `out_dir?`, `inline?` (local), `cursor?` (remote) | files: `svg`, `svg-flat`, `pdf`, `eps`, `png`, `png-set`, `ico`, `favicon-pack`, `android`, `ios`, `pptx`, `pptx-sheet`, `docx`, `lottie`, `dotlottie`, the code formats, and animated `gif`, `apng`, `animated-svg`, `pptx-animated`. Saved to `out_dir` when given; small files also come back inline (PNG / GIF as image content, text as text, the rest as base64 resources). The remote server makes the vector, code and Lottie formats and answers PNG-based / animated ones with the exact `npx withicons export …` command; large remote exports come in pages (`next: { cursor, remaining }`: call again with `cursor`), and plain `svg-flat` files then come back as `urls[]` to jsDelivr `@withicons/static` |
| `list_styles` | — | the {{styles}} styles with their group (Essentials, Product & brand, 3D & glass, Playful, Artistic, Holidays) and what they are good for, what they look like, `minSize`, `onDark`, and the colour variables of palette styles; plus `groups` and `uses` (the "What are you making?" picks) |
| `list_categories` | `category?` | categories with counts, or every icon in one category (festivals: `indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `halloween`; `avatars`; `ai` …) |
| `resolve_icon` | `name` | `resolved` (+ via alias), `ambiguous` (+ candidates) or `unknown` (+ nearest) |

## Colours and palettes

Every style except `line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint` and `sketch` paints several colours (`list_styles` marks them `palette: true`), and `duo` (tint `--with-duo` + one accent detail `--with-duo-accent`) and `blueprint` have accent colours. Every
colour is a CSS variable with a default (`var(--with-retro-1, #F4B53F)`); the outline follows `currentColor`. A palette gives a
colour to each of ten roles, and the server maps the roles onto the variables that icon actually uses in that style:

| role | paints |
|---|---|
| `ink` | outline / line work (sets `color`) |
| `c1` · `c2` · `c3` · `c4` | the main colour, then the 2nd-4th colours (sticker / kawaii parts, retro stripes) |
| `tint` · `accent` · `shadow` · `shine` · `edge` | glass front pane · blush and sparkles · drop shadows · highlights · sticker border |

- `get_icon({ name: 'heart', style: 'sticker', palette: 'neon-love' })`: one of the icon's palettes (ids are in `colors.suggestions`).
- `get_icon({ name: 'heart', style: 'retro', colors: { c1: '#22c55e', c2: '#facc15', ink: '#111827' } })`: change any colour
  (merged over `palette` when both are given; `--with-*` variable names work too).
- `svg` keeps the variables and sets them on the root `<svg style="…">` (add `flat: true` to bake them in, for `<img>` and design tools);
  `data-uri` is always baked; `web-component` gets an inline `style`; React, Vue, Svelte, Solid and Angular get a class plus the CSS rule
  (`.icon-heart-neon-love { color: …; --with-sticker-bubblegum: …; }`). CSS-class icons bake their palette into a data URI, so only the ink applies.

## Choosing a style, festivals and avatars

`recommend_styles({ for: 'Diwali sale banner', icon: 'diya' })` ranks `rangoli` and `utsav` first, with
`<with-icon name="diya" variant="rangoli">`, `import { Diya as DiyaRangoli } from '@withicons/react/rangoli'`, the raw-file
packages (`@withicons/holiday`, `@withicons/static-plus`), the style's festival palettes (`diwali`, `holi`, `navratri` …:
CSS variable sets) and `list_categories({ category: 'indian-festivals' })` for the festival icons. Avatars (category
`avatars`: people, animals, friendly monsters): people come with true-to-life palettes for many skin tones and hair colours
(`list_palettes({ name: 'avatar-woman', tag: 'true-to-life' })`); offer several. Every style also ships as one zip:
`https://withicons.com/downloads/with-icons-<style>.zip` (every SVG plus an offline searchable viewer) and
`with-icons-all.zip`.

## Animated icons for slides and docs

`export_icon({ name: 'bell', style: 'luxe', format: 'gif', background: '#ffffff', out_dir: 'slides/icons' })` writes
`bell-luxe-ring.gif`: the icon's own animation (the same keyframes as the website), looping forever. GIF plays in PowerPoint,
Keynote, Google Slides, Slack, email and Notion. GIF transparency is 1-bit, so pass the slide colour as `background` (or
keep it transparent with `matte: '<slide colour>'`); colours are baked in, so choose `palette` / `colors` before exporting.
`format: 'pptx-animated'` gives a ready 16:9 slide with the moving icon; `apng` has smooth see-through edges for web pages;
`lottie` / `dotlottie` stay vector for apps, After Effects and Canva. `motion: 'swap', to: 'pause'` records an icon turning
into another one.

Resources: `icon://<style>/<name>.svg` (e.g. `icon://solid/home.svg`) and `icon://about`.

## Install in your client

All local configs run the same command: `npx -y @withicons/mcp` (Node 18+).

**Claude Code**

```sh
claude mcp add withicons -- npx -y @withicons/mcp
```

**Claude Desktop** — Settings › Developer › Edit config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "withicons": { "command": "npx", "args": ["-y", "@withicons/mcp"] }
  }
}
```

On Windows, if `npx` is not found, use `"command": "cmd", "args": ["/c", "npx", "-y", "@withicons/mcp"]`.

**Cursor** — `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "withicons": { "command": "npx", "args": ["-y", "@withicons/mcp"] }
  }
}
```

**VS Code** (Copilot agent mode) — `.vscode/mcp.json`:

```json
{
  "servers": {
    "withicons": { "type": "stdio", "command": "npx", "args": ["-y", "@withicons/mcp"] }
  }
}
```

**Windsurf** — `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "withicons": { "command": "npx", "args": ["-y", "@withicons/mcp"] }
  }
}
```

### Remote (HTTP) instead of npx

The same server runs as a stateless Streamable-HTTP endpoint, hosted at **https://withicons.com/mcp** (no key,
nothing to install; see withicons.com/ai):

```sh
claude mcp add --transport http withicons https://withicons.com/mcp
```

Cursor / Windsurf: `{ "mcpServers": { "withicons": { "url": "https://withicons.com/mcp" } } }` (Windsurf: `"serverUrl"`).
VS Code: `{ "servers": { "withicons": { "type": "http", "url": "https://withicons.com/mcp" } } }`.

## Try it

> "Find me an icon for deleting things and give me the React code in the solid style."

The assistant calls `search_icons({ query: 'deleting things' })` -> `trash`, then
`get_icon({ name: 'trash', style: 'solid', format: 'react' })`:

```jsx
import { Trash as TrashSolid } from '@withicons/react/solid'

<TrashSolid />
```

> "Make the notification bell ring when I hover the button, in React."

`animate_icon({ name: 'bell', trigger: 'hover', format: 'react' })`:

```jsx
import { Bell } from '@withicons/react'
import '@withicons/motion/motion.css'
import '@withicons/motion/icons.css'

<button type="button" className="wm-trigger" aria-label="Bell"><span className="wm wm-hover" data-wm="bell"><Bell /></span></button>
```

> "Give me the kawaii heart in Vue, but in a strawberry-milk pastel."

`list_palettes({ name: 'heart', style: 'kawaii', tag: 'pastel' })` -> `strawberry-milk`, then
`get_icon({ name: 'heart', style: 'kawaii', format: 'vue', palette: 'strawberry-milk' })`:

```vue
<script setup>
import { Heart as HeartKawaii } from '@withicons/vue/kawaii'
</script>

<template>
  <HeartKawaii class="icon-heart-strawberry-milk" />
</template>

<style>
.icon-heart-strawberry-milk { color: #5A2A3A; --with-kawaii-fill-1: #FFA3C0; --with-kawaii-blush: #FF6F91; --with-kawaii-shine: #FFE5ED; --with-kawaii-face: #5A2A3A; }
</style>
```

## HTTP API

The hosted endpoint at https://withicons.com also answers plain GET requests (JSON, CORS open). The remote MCP server
and this API make vector, code and Lottie files; for PNG and animated formats `export_icon` answers with the
`npx withicons export …` command to run locally. Large remote exports come in pages: a result with `next: { cursor, remaining }` has more to come, so call `export_icon` again with the same arguments plus `cursor`. Plain `svg-flat` files (no colour or size options) then come back as `urls[]` to the prebuilt `@withicons/static` SVGs on jsDelivr (colours baked in, ink follows `currentColor`, no `<title>`).

Routes:

| route | |
|---|---|
| `POST /mcp` | MCP JSON-RPC, stateless (no session id, JSON responses, no SSE). `GET`/`DELETE /mcp` -> 405. |
| `GET /api/search?q=&limit=&style=&category=&format=` | same as `search_icons` |
| `GET /api/icon/<name>?style=&format=&size=&color=&palette=` | same as `get_icon` (JSON). Custom colours: one parameter per role (`&c1=22c55e&ink=111827`, `#` optional). `&raw=1` returns the bare code; `/api/icon/<name>.svg` returns `image/svg+xml` with the colours baked in (`&flat=0` keeps the CSS variables) |
| `GET /api/palettes/<name>?style=&tag=&limit=` | same as `list_palettes` |
| `GET /api/motion/<name>?trigger=&preset=&to=&effect=&style=&format=&duration=` | same as `animate_icon` (JSON; `&raw=1` for the bare code). `GET /api/motion` lists triggers, presets and effects |
| `GET /api/recommend?for=&use=&icon=&limit=` | same as `recommend_styles` |
| `GET /api/resolve/<name>` · `GET /api/styles` · `GET /api/categories[/<category>]` | catalogue |
| `GET /api` | status + version + endpoints |

GET responses carry `Cache-Control: public, max-age=…` (1 h for search, 24 h for icons). Example: `https://withicons.com/api/icon/home.svg?style=duo`.

The Lambda bundle behind it is not part of this npm package; it is built from the repository (`node forge/build.mjs mcp`, `infra/`).

## Programmatic use

```js
import { searchIcons, getIcon, resolveIcon, snippet, animateIcon, listPalettes, recommendStyles, stylePalette } from '@withicons/mcp/lib'
searchIcons({ query: 'trash can', limit: 3 })
getIcon({ name: 'home', style: 'solid', format: 'vue' })
getIcon({ name: 'heart', style: 'sticker', format: 'svg', palette: 'neon-love', flat: true })
listPalettes({ name: 'pizza', style: 'retro' })
animateIcon({ name: 'bell', trigger: 'hover', format: 'react' })
recommendStyles({ for: 'Christmas email' })        // -> christmas first, its palettes, notes
stylePalette('christmas', 'nordic').css           // '--with-christmas-ink: #2E2620; --with-christmas-c1: #B5523B; …'
```

TypeScript types ship in `dist/lib.d.ts`. Errors are `IconError`s with a `code` (`unknown_icon` + `nearest`, `unknown_palette` + `palettes`, …).

The terminal CLI is the unscoped package [`withicons`](https://www.npmjs.com/package/withicons): `npx withicons search "throw away"`.

MIT © with icons — powered by Evergrow · https://withicons.com
