# @withicons/mcp

An [MCP](https://modelcontextprotocol.io) server for **with icons** — 300 MIT icons, each drawn in 7 styles
(line, solid, duo, gloss, engrave, blueprint, sketch). Your AI assistant can search icons in plain English
("throw away", "settigns", "money") and get paste-ready SVG, React, Vue, Svelte, Angular, Solid, web-component,
CSS-class or data-URI code.

> Not published to npm yet — launching soon. The commands below are what you will use.

Self-contained: the search engine, the MCP SDK and every icon are bundled — no runtime dependencies, no network.

## Tools

| tool | arguments | returns |
|---|---|---|
| `search_icons` | `query`, `limit?` (10), `style?`, `category?`, `format?` (react) | ranked names, why each matched (`matched alias "bin"`, typo-tolerant), a ready snippet, a link |
| `get_icon` | `name` (name **or alias**), `style?` (line), `format?` (svg), `size?` (24), `color?` | the code: `svg`, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri` |
| `list_styles` | — | the 7 styles and what they look like |
| `list_categories` | `category?` | categories with counts, or every icon in one category |
| `resolve_icon` | `name` | `resolved` (+ via alias), `ambiguous` (+ candidates) or `unknown` (+ nearest) |

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

## AWS Lambda (Function URL)

`dist/lambda.mjs` is **one self-contained ES module** (MCP SDK, search engine and all 2,100 SVGs inlined, ~3.3 MB,
~0.8 MB gzipped). It exports `handler` (also the default export).

| setting | value |
|---|---|
| runtime | Node.js 20.x or 22.x (x86_64 or arm64 — no native code) |
| handler | `lambda.handler` (file `lambda.mjs` at the zip root) |
| memory | 512 MB recommended (256 MB works; peak RSS ≈ 90 MB — more memory = faster CPU = faster cold start) |
| timeout | 10 s (requests take 1–20 ms warm; cold start ≈ 200–400 ms) |
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
| `GET /api/icon/<name>?style=&format=&size=&color=` | same as `get_icon` (JSON). `&raw=1` returns the bare code; `/api/icon/<name>.svg` returns `image/svg+xml` |
| `GET /api/resolve/<name>` · `GET /api/styles` · `GET /api/categories[/<category>]` | catalogue |
| `GET /` (`/health`) | status + version + endpoints |

GET responses carry `Cache-Control: public, max-age=…` (1 h for search, 24 h for icons) so a CDN in front works well.

## Programmatic use

```js
import { searchIcons, getIcon, resolveIcon, snippet } from '@withicons/mcp/lib'
searchIcons({ query: 'trash can', limit: 3 })
getIcon({ name: 'home', style: 'solid', format: 'vue' })
```

The terminal CLI is the unscoped package [`withicons`](https://www.npmjs.com/package/withicons): `npx withicons search "throw away"`.

MIT © with icons — powered by Evergrow · https://withicons.com
