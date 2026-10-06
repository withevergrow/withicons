# with icons: finding icons (MCP, CLI, HTTP, files)

Search understands canonical names, aliases (`bin` finds `trash`), related words / synonyms (`throw away` finds `trash`),
tags, categories and descriptions, and tolerates typos (`settigns` finds `settings`).

## MCP server (`@withicons/mcp`)

Remote (no install, Streamable HTTP, stateless): **`https://withicons.com/mcp`**
Local (stdio): **`npx -y @withicons/mcp`**

One command for the skill + server: `npx withicons init [claude-code|codex|cursor|opencode|vscode|windsurf|claude-desktop|lovable] [--global] [--mcp local|remote]`
(no tool name = the ones found in the project; `--dry-run` shows the changes first).

| client | config |
|---|---|
| Claude Code | `claude mcp add --transport http withicons https://withicons.com/mcp` (or `claude mcp add withicons -- npx -y @withicons/mcp`) |
| Claude Desktop | Customize, then Connectors, then *Add custom connector*: `https://withicons.com/mcp` |
| Codex | `codex mcp add withicons --url https://withicons.com/mcp` |
| OpenCode (`opencode.json`) | `{ "mcp": { "withicons": { "type": "remote", "url": "https://withicons.com/mcp" } } }` |
| Windsurf / Devin Desktop (user `mcp_config.json`) | `{ "mcpServers": { "withicons": { "serverUrl": "https://withicons.com/mcp" } } }` |
| Lovable | Connectors, then + then *MCP server*: `https://withicons.com/mcp` |
| Cursor (`.cursor/mcp.json`) | `{ "mcpServers": { "withicons": { "url": "https://withicons.com/mcp" } } }` |
| VS Code (`.vscode/mcp.json`) | `{ "servers": { "withicons": { "type": "http", "url": "https://withicons.com/mcp" } } }` |
| any stdio client | `{ "command": "npx", "args": ["-y", "@withicons/mcp"] }` |

Tools (confirm with `tools/list`; arguments are documented in each tool's schema):

| tool | what it does |
|---|---|
| `search_icons` | `query`, optional `limit`, `style`, `category`, `format`. Returns ranked icons with why they matched and a ready-to-paste import/usage line |
| `get_icon` | `name` (alias ok), `style`, `format` (`svg` default, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri`), optional `size` (8-1024), `color` (replaces currentColor; svg / data-uri), `flat` (svg: bake the CSS-variable colours in, for `<img>`, Figma, slides), `palette` (a palette id from `list_palettes`), `colors` (roles `ink c1 c2 c3 c4 tint accent shadow shine edge` or `--with-*` names -> colour, merged over the palette). No stroke-width argument: set `strokeWidth` / `stroke-width` on the pasted component or element |
| `list_palettes` | `name` (alias ok), optional `style` (also lists the exact `--with-*` variables each palette sets in that style), `tag` (pastel, neon, retro, true-to-life …), `limit`. The 20-30 palettes picked for that icon, each with its ten role colours; apply one with `get_icon(…, palette: "<id>")` |
| `animate_icon` | `name`, `trigger` (`loop`, `hover`, `once`, `inview`, `swap`), optional `preset`, `to` (swap target, `name` or `name@style`), `effect`, `style`, `format` (`html`, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), `duration`. Returns animation code for `@withicons/motion` |
| `export_icon` | `name`, `style`, `format` (one or a comma list: `svg`, `svg-flat`, `pdf`, `eps`, `png`, `png-set`, `ico`, `favicon-pack`, `android`, `ios`, `pptx`, `pptx-sheet`, `docx`, `lottie`, `dotlottie`, `gif`, `apng`, `animated-svg`, `pptx-animated`, code formats), optional `size`, `background`, `matte`, `palette`, `colors`, `color`, `motion` (`loop`, `hover`, `once`, `swap`, `none` or a preset), `to`, `effect`, `hold` (swap: seconds to rest on each icon), `duration` (seconds per motion cycle), `fps`, `seconds`, `loop` (0 = forever), `padding` (empty space around the icon, 0-0.4 of its size), `all_styles`; local server only: `out_dir` (folder to save into) and `inline` (also return the files inline; default only when there is no `out_dir`). Makes files: saved to `out_dir`, small ones also inline (GIF / PNG as image content). The remote server makes vector / code / Lottie files and answers PNG-based and animated formats with the `npx withicons export …` command |
| `resolve_icon` | alias, PascalCase or typo, which returns the canonical name, or candidates if ambiguous |
| `list_styles` | the 20 styles with descriptions (palette styles list their colour variables) |
| `list_categories` | categories, or the icons in one category |

Typical agent loop: `search_icons("upload file")`, pick the top result that fits, then `get_icon(name, style, format: "react")`.
Paste the import and keep the canonical name.

## CLI

```bash
npx withicons search "throw away"        # ranked names + aliases
npx withicons search cart --limit 5
npx withicons search "cute heart"        # style words pick the style: kawaii
npx withicons animate bell --trigger hover --format react
npx withicons export bell --format gif --background "#ffffff"   # an animated GIF for slides
npx withicons export home --format svg,png,pdf --out icons      # files
```

## HTTP API (GET only, cached at the edge, CORS enabled)

```bash
curl "https://withicons.com/api/search?q=throw+away&limit=5"
curl "https://withicons.com/api/icon/trash"                                   # JSON with code, url, colours, motion
curl "https://withicons.com/api/icon/bin?style=solid&format=react&raw=1"     # alias ok; raw=1 returns the bare code
curl "https://withicons.com/api/icon/heart.svg?style=kawaii&palette=classic-red"  # image/svg+xml, colours baked in
curl "https://withicons.com/api/palettes/heart?style=kawaii&limit=3"
curl "https://withicons.com/api/motion/bell?trigger=hover&format=react"      # animation code
```

| endpoint | parameters | returns |
|---|---|---|
| `/api/search` | `q` (or `query`), `limit` (default 24, max 100), `style`, `category`, `format` (snippet format, default `react`) | `{ query, style, count, results, suggestions }`; each result has `name`, `title`, `category`, `score`, `reason` (why it matched), `match: { field, term, typo }`, `snippet` (ready-to-paste usage), `url` (icon page) |
| `/api/icon/<name>` (alias ok) | `style` (default `line`), `format` (`svg` default, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri`), `size`, `color`, `palette` (id from `/api/palettes`), one param per colour role (`ink`, `c1`…`c4`, `tint`, `accent`, `shadow`, `shine`, `edge`; `?c1=e11d48`, the `#` is optional), `flat=1` (bake CSS-variable colours in), `raw=1` (bare code instead of JSON) | the same JSON as the MCP `get_icon` tool. `<name>.svg` is short for `format=svg&raw=1&flat=1`: an image you can put in `<img src>` |
| `/api/palettes/<name>` | `style`, `tag`, `limit` | the icon's colour palettes (as `list_palettes`) |
| `/api/motion` | none | how many icons have a tuned motion, plus the triggers, presets, effects and formats |
| `/api/motion/<name>` | `trigger` (`loop`, `hover`, `once`, `inview`, `swap`), `preset`, `to`, `effect`, `style`, `format` (`html` default, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), `duration`, `raw=1` | animation code for `@withicons/motion` (as `animate_icon`) |
| `/api/resolve/<name>` | none | canonical name, ambiguous candidates or nearest names (as `resolve_icon`) |
| `/api/styles`, `/api/categories[/<category>]` | none | as `list_styles` / `list_categories` |

## Static files

| file | contents |
|---|---|
| https://withicons.com/icons.json | every icon: name, category, description, aliases, tags, styles |
| https://withicons.com/llms.txt | short guide for LLMs; `llms-full.txt` adds the complete list |
| https://withicons.com/skill/SKILL.md | this skill |
| [icons.md](icons.md) | all 500 canonical names with categories and aliases (offline) |

## In code

```js
import { resolve, search } from '@withicons/core'          // in-memory, no network
import { create } from '@withicons/search'                  // the same engine the site and MCP use
import index from '@withicons/search/data'
const engine = create(index)
engine.search('throw away', { limit: 5 })  // [{ name: 'trash', score, match: { field: 'synonym', ... } }]
engine.resolve('bin')                      // { name: 'trash', alias: 'bin' }
```
