# @withicons/mcp

An [MCP](https://modelcontextprotocol.io) server for **with icons** — {{icons}} MIT icons, each drawn in {{styles}} styles
({{styleList}}). Your AI assistant can search icons in plain English
("throw away", "settigns", "money", "cute heart", "8-bit star") and get paste-ready SVG, React, Vue, Svelte, Angular,
Solid, web-component, CSS-class or data-URI code, plus animation code for the optional `@withicons/motion` package
({{animated}} icons have a tuned animation; every icon can use any preset), every icon's 20-30 hand-picked colour
palettes for the multi-colour styles, and **files**: SVG, PNG, PDF, PowerPoint, Word, Lottie, app assets and animated
GIF / APNG / SVG / PowerPoint for slides and docs (`export_icon`).

> Not published to npm yet — launching soon. The commands below are what you will use.

Self-contained: the search engine, the MCP SDK, the export formats and every icon are bundled — no network. PNG-based and
animated files use `@resvg/resvg-js`, an optional dependency installed with the server where your platform has a prebuilt binary.

## Tools

| tool | arguments | returns |
|---|---|---|
| `search_icons` | `query`, `limit?` (10), `style?`, `category?`, `format?` (react) | ranked names, why each matched (`matched alias "bin"`, typo-tolerant), a ready snippet, a link |
| `get_icon` | `name` (name **or alias**), `style?` (line), `format?` (svg), `size?` (24), `color?`, `flat?`, `palette?`, `colors?` | the code: `svg`, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri`; for multi-colour styles the icon's colour variables (role + default) and its palette ids; with `palette` / `colors`, the code recoloured (every colour, not just one) plus the CSS; a `motion` summary when the icon has a tuned animation |
| `list_palettes` | `name`, `style?`, `tag?`, `limit?` | the icon's 20-30 palettes (id, name, tags, ten role colours); with `style`, the exact `--with-*` variables and a CSS rule per palette |
| `animate_icon` | `name`, `trigger?` (`loop` · `hover` · `once` · `inview` · `swap`), `preset?`, `to?`, `effect?`, `style?`, `format?` (html), `duration?` | paste-ready animation code (`html`, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), the icon's motion spec and install lines. `inview` and the `draw` preset come wired to the JS runtime (`motion(el, name, options)` in a mount hook / module script) |
| `export_icon` | `name`, `style?`, `format?` (svg; one or a comma list), `size?`, `background?`, `matte?`, `palette?`, `colors?`, `color?`, `motion?` (loop · hover · once · swap · none · a preset), `to?`, `effect?`, `fps?`, `seconds?`, `loop?`, `all_styles?`, `out_dir?`, `inline?` | files: `svg`, `svg-flat`, `pdf`, `eps`, `png`, `png-set`, `ico`, `favicon-pack`, `android`, `ios`, `pptx`, `pptx-sheet`, `docx`, `lottie`, `dotlottie`, the code formats, and animated `gif`, `apng`, `animated-svg`, `pptx-animated`. Saved to `out_dir` when given; small files also come back inline (PNG / GIF as image content, text as text, the rest as base64 resources). The remote server makes the vector, code and Lottie formats and answers PNG-based / animated ones with the exact `npx withicons export …` command |
| `list_styles` | — | the {{styles}} styles, what they look like, and the colour variables of palette styles |
| `list_categories` | `category?` | categories with counts, or every icon in one category |
| `resolve_icon` | `name` | `resolved` (+ via alias), `ambiguous` (+ candidates) or `unknown` (+ nearest) |

## Colours and palettes

`glass`, `kawaii`, `sticker`, `pixel`, `retro`, `luxe`, `bauhaus`, `skeuo`, `anime`, `gothic`, `pastel`, `coquette` and `plush` paint several colours, and `duo` and `blueprint` have an accent colour. Every
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

The same server also runs as a stateless Streamable-HTTP endpoint (`POST <endpoint>/mcp`). Use the URL of the
hosted endpoint once it is live (it will be listed on withicons.com/ai), or your own deployment:

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

## AWS Lambda (Function URL)

`dist/lambda.mjs` is **one self-contained ES module** (MCP SDK, search engine, all {{total}} SVGs and the palettes inlined as JSON strings that are parsed on first use). It exports `handler` (also the default export).

| setting | value |
|---|---|
| runtime | Node.js 20.x or 22.x (x86_64 or arm64 — no native code) |
| handler | `lambda.handler` (file `lambda.mjs` at the zip root) |
| memory | 512 MB recommended (256 MB works; peak RSS ≈ 130 MB — more memory = faster CPU = faster cold start) |
| timeout | 10 s (requests take 1–20 ms warm; cold start ≈ 300–600 ms) |
| Function URL | auth `NONE`, invoke mode `BUFFERED` (responses are plain JSON — no streaming needed) |
| CORS | the handler sends `Access-Control-Allow-Origin: *` and answers `OPTIONS` itself; leave the Function URL CORS config off (or mirror these headers) |
| env | none required |

**Event**: Lambda Function URL payload **version 2.0** (`rawPath`, `rawQueryString`, `headers` (lower-case),
`requestContext.http.method`, `body`, `isBase64Encoded`). API Gateway HTTP API v2 events work too.
**Response**: `{ statusCode, headers, body, isBase64Encoded: false }`.

Routes:

| route | |
|---|---|
| `POST /mcp` | MCP JSON-RPC, stateless (no session id, JSON responses, no SSE). `GET`/`DELETE /mcp` -> 405. |
| `GET /api/search?q=&limit=&style=&category=&format=` | same as `search_icons` |
| `GET /api/icon/<name>?style=&format=&size=&color=&palette=` | same as `get_icon` (JSON). Custom colours: one parameter per role (`&c1=22c55e&ink=111827`, `#` optional). `&raw=1` returns the bare code; `/api/icon/<name>.svg` returns `image/svg+xml` with the colours baked in (`&flat=0` keeps the CSS variables) |
| `GET /api/palettes/<name>?style=&tag=&limit=` | same as `list_palettes` |
| `GET /api/motion/<name>?trigger=&preset=&to=&effect=&style=&format=&duration=` | same as `animate_icon` (JSON; `&raw=1` for the bare code). `GET /api/motion` lists triggers, presets and effects |
| `GET /api/resolve/<name>` · `GET /api/styles` · `GET /api/categories[/<category>]` | catalogue |
| `GET /` (`/health`) | status + version + endpoints |

GET responses carry `Cache-Control: public, max-age=…` (1 h for search, 24 h for icons) so a CDN in front works well.

## Programmatic use

```js
import { searchIcons, getIcon, resolveIcon, snippet, animateIcon, listPalettes } from '@withicons/mcp/lib'
searchIcons({ query: 'trash can', limit: 3 })
getIcon({ name: 'home', style: 'solid', format: 'vue' })
getIcon({ name: 'heart', style: 'sticker', format: 'svg', palette: 'neon-love', flat: true })
listPalettes({ name: 'pizza', style: 'retro' })
animateIcon({ name: 'bell', trigger: 'hover', format: 'react' })
```

TypeScript types ship in `dist/lib.d.ts`. Errors are `IconError`s with a `code` (`unknown_icon` + `nearest`, `unknown_palette` + `palettes`, …).

The terminal CLI is the unscoped package [`withicons`](https://www.npmjs.com/package/withicons): `npx withicons search "throw away"`.

MIT © with icons — powered by Evergrow · https://withicons.com
