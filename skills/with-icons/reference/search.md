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
| `get_icon` | `name` (alias ok), `style`, `format` (`svg`, `react`, `vue`, `svelte`, `angular`, `solid`, `web-component`, `html-class`, `data-uri`), optional `size`, `color`, `strokeWidth` |
| `animate_icon` | `name`, `trigger` (`loop`, `hover`, `once`, `inview`, `swap`), optional `preset`, `to` (swap target, `name` or `name@style`), `effect`, `style`, `format` (`html`, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), `duration`. Returns animation code for `@withicons/motion` |
| `export_icon` | `name`, `style`, `format` (one or a comma list: `svg`, `svg-flat`, `pdf`, `eps`, `png`, `png-set`, `ico`, `favicon-pack`, `android`, `ios`, `pptx`, `pptx-sheet`, `docx`, `lottie`, `dotlottie`, `gif`, `apng`, `animated-svg`, `pptx-animated`, code formats), optional `size`, `background`, `matte`, `palette`, `colors`, `color`, `motion` (`loop`, `hover`, `once`, `swap`, `none` or a preset), `to`, `effect`, `fps`, `seconds`, `loop`, `all_styles`, `out_dir` (local server). Makes files: saved to `out_dir`, small ones also inline (GIF / PNG as image content). The remote server makes vector / code / Lottie files and answers PNG-based and animated formats with the `npx withicons export …` command |
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

## HTTP API (cached at the edge, CORS enabled)

```bash
curl "https://withicons.com/api/search?q=throw+away&limit=5"
curl "https://withicons.com/api/icon/trash"
curl "https://withicons.com/api/icon/heart.svg?style=kawaii"          # image/svg+xml, palette baked in
curl "https://withicons.com/api/motion/bell?trigger=hover&format=react" # animation code
```

`/api/search` takes `q`, `limit`, `style`, `category` and returns JSON results
(`name`, `title`, `category`, `score`, `match: { field, term, typo }`).

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
