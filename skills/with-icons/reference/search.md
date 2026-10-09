# with icons: finding icons (MCP, CLI, HTTP, files)

Search understands canonical names, aliases (`bin` finds `trash`), related words / synonyms (`throw away` finds `trash`),
tags, categories and descriptions, and tolerates typos (`settigns` finds `settings`).

Never guess an import name: look it up first. Common mappings: delete/bin -> `trash`, settings/gear -> `settings`,
x/dismiss -> `close`, hamburger -> `menu`, house -> `home`, magnifier -> `search`, avatar -> `user-circle`.

## Search tips

- **One concept per query.** Search `delivery` (truck, motorcycle, package) rather than a whole tagline: every extra
  word is evidence too, and an adjective (`fast`, `easy`, `smart`) can pull in an icon that matches only it. Search each
  idea of a feature list separately, and if a two-word query looks off, search the noun alone.
- **Try words by meaning, then by object.** No hit for `revenue growth`? Try `revenue` (dollar-sign, trending-up,
  hand-coins), then `growth`, then the object you would draw (`chart`, `coins`). `kpi` finds chart-bar, chart-line, gauge.
- **Browse the category** when a domain word has no icon: `list_categories` (MCP), `npx withicons categories charts`,
  or the headings in [icons.md](icons.md). The closest generic icon plus a text label beats a wrong specific one.
- **Trust `confidence`.** Every result has `confidence` (`high`, `medium`, `low`; low ones also carry `weak: true` in
  `@withicons/search`, and their `reason` ends "(related, low confidence)"). Use high and medium; treat low as
  "related", not the thing itself, and say so. The response's top-level `confidence` is the best result's; when every
  result is low, `hint` says so.
- **Read `reason` / `match`.** `reason` ("matched alias \"fitness\"") and `match: { field, term, typo, kind }` (kind:
  exact, prefix, stem, typo, concept, similar, phonetic) say why it matched. A loose related word is weaker than a
  name or alias, and a match whose meaning is unrelated is noise even at high confidence: `bean` returns `paw-print`
  ("toe beans"), not a coffee bean.
- **Nothing honest, nothing returned.** Words with no fitting icon return no results (`grinder`, `mat`, `shirt`, `pram`;
  CLI exit code 1) with a browse `hint` and often `didYouMean`. Do not force a pick from the suggestions.
- **Query understanding.** Filler words such as "icon" or "logo" are dropped ("home icon" = `home`), "x or y" searches
  both, and British and American spellings both work (`colour`, `favourites`).
- **Category filter.** With `category` (MCP, HTTP, `--category`), strong matches in other categories come back as
  `outside` (MCP and `--json`) instead of being hidden.
- **Prefer the object you would draw.** People read the picture, not the tag: for a coffee bean, search `coffee`
  (a cup reads as coffee) rather than taking whatever matched `bean`.
- **Content gaps.** These subjects have no icon yet (stand-in in brackets; label it in visible text or `aria-label`,
  never present it as the exact thing):
  - health and family: yoga, yoga mat, meditation (`flower`), swimming (`droplet`), baby, pram / stroller, nappy, kids
    (`school`, `backpack`), pregnancy (`heart-pulse`);
  - food: tea (`coffee`), cocktail (`wine`), bread (`cake`), milk (`cup-soda`), meat (`utensils`), coffee bean or
    grinder (`coffee`);
  - fashion: shirt, dress (`shopping-bag`), shoe, glasses, lipstick;
  - money: bitcoin / crypto (`coins`), ATM, cheque (`banknote`);
  - places and nature: church / mosque / temple (`landmark`), elevator, stairs, traffic light (`traffic-cone`), van
    (`truck`), waves / ocean, recycle (`refresh`), farm animals (`paw-print`);
  - leisure and devices: wedding rings (`heart`, `gem`), halloween, guitar / piano (`music-note`), chess, CCTV
    (`webcam`), copyright mark.
  Dice exist only as a live icon (`dice` in `@withicons/dynamic`).
- **Style words pick the style** (`cute heart` -> kawaii): leave them out when you only want the name.
- There are no brand or company logos (Instagram, X, GitHub …); see [files.md](files.md#brand-and-social-logos).

## MCP server (`@withicons/mcp`)

Remote (no install, Streamable HTTP, stateless): **`https://withicons.com/mcp`**
Local (stdio): **`npx -y @withicons/mcp`**

The hosted server and `/api/*` share a per-IP limit (about 200 requests every 5 minutes). Over it, they answer
HTTP 429 with `Retry-After: 300` and a JSON-RPC error (code -32029) whose message points to the local server. The local
server, the CLI and the npm packages have no limit and work offline, so use them for batch work (many exports, whole
icon sets) and switch to them when you see a 429.

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
| `search_icons` | `query`, optional `limit`, `style`, `category`, `format`. The text reply is a short summary (one line per icon, the top icon's snippet); `structuredContent` has every result with `confidence`, `reason`, `match`, `snippet` and `url` (low-confidence ones are noted as related), plus `outside` (strong matches outside a `category` filter), `didYouMean` (the query as corrected, when the top hit needed a spelling fix) and, with no results, `hint` (where to browse) |
| `get_icon` | `colors.mainRole` names the role that paints the icon body (set it for a brand colour). Args: `name` (alias ok), `style`, `format` (`svg` default, `react`, `vue`, `svelte`, `angular`, `solid`, `html-class`, `web-component`, `data-uri`), optional `size` (8-1024), `color` (replaces currentColor; svg / data-uri), `flat` (svg: bake the CSS-variable colours in, for `<img>`, Figma, slides), `palette` (a palette id from `list_palettes`), `colors` (roles `ink c1 c2 c3 c4 tint accent shadow shine edge` or `--with-*` names -> colour, merged over the palette), `include_palettes` (list the icon's palette ids). `warnings` lists colours that change nothing in that style and the roles it uses. No stroke-width argument: set `strokeWidth` / `stroke-width` on the pasted component or element (or use `export_icon`'s `stroke_width`) |
| `list_palettes` | `name` (alias ok), optional `style` (also lists the exact `--with-*` variables each palette sets in that style), `tag` (pastel, neon, retro, true-to-life …), `limit`. The 20-30 palettes picked for that icon, each with its ten role colours; apply one with `get_icon(…, palette: "<id>")` |
| `recommend_styles` | which style for a job. Args: `for` (plain words: "Diwali sale banner", "avatar picker for a kids app", "AI landing page"), or `use` (`app`, `slides`, `saas`, `ai`, `brand`, `kids`, `print`, `festive`), optional `icon` (the icon its snippets show), `limit` (6). Returns `recommendations` (best first: `style`, `group`, `goodFor`, `looks`, `react` import, `webComponent`, `classes`, `files` (the npm packages holding the raw SVGs, nodes and classes), `zip`, `motion3d`, holiday `stylePalettes`, Duo `presets`), `festivals` (festival + icon category), `avatars` (category + palette tag) and `notes`; when nothing matched, `allUses` and `groups` |
| `animate_icon` | returns the code plus `alternates` (the icon's other tuned presets) and `lively` (its most energetic presets, for title slides); in a 3D style also `motion3d: true` (the code adds `wm-3d`) and `moves` (the moves the icon offers in that style; soft3d 3-5). Args: `name`, `trigger` (`loop`, `hover`, `once`, `inview`, `swap`), optional `preset`, `to` (swap target, `name` or `name@style`), `effect`, `style`, `format` (`html`, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), `duration`. Returns animation code for `@withicons/motion` |
| `export_icon` | `name` or `names` (up to 50 icons, same options; or a map to file names, `{ receipt: "orders" }`), `style`, `format` (one or a comma list: `svg`, `svg-flat`, `pdf`, `eps`, `png`, `png-set`, `ico`, `favicon-pack`, `android`, `ios`, `pptx`, `pptx-sheet`, `docx`, `lottie`, `dotlottie`, `gif`, `apng`, `animated-svg`, `pptx-animated`, code formats), optional `size`, `background`, `matte`, `palette`, `colors`, `color`, `motion` (`loop`, `hover`, `once`, `swap`, `none` or a preset), `to`, `effect`, `hold` (swap: seconds to rest on each icon), `duration` (seconds per motion cycle), `fps`, `seconds`, `loop` (0 = forever), `padding` (empty space around the icon, 0-0.6 of its size; a minimum for animated formats), `stroke_width` (outline styles, at most 4), `filename` (template with `{name}` `{style}` `{format}` `{variant}` `{default}`, or an exact name for one file), `strict_palette` (fail when an icon lacks the palette instead of borrowing it), `all_styles`; local server only: `out_dir` (folder to save into) and `inline` (also return the files inline; default only when there is no `out_dir`). Makes files: saved to `out_dir`, small ones also inline (GIF / PNG as image content). The remote server makes vector / code / Lottie files and answers PNG-based and animated formats with the `npx withicons export …` command; remote only: `cursor` (the `next.cursor` of the previous page). Large remote exports come in pages (`next: { cursor, remaining }`); plain `svg-flat` files then come back as `urls[]` (jsDelivr `@withicons/static`) |
| `resolve_icon` | `status`: `resolved` (canonical name, `via` name or alias), `ambiguous` (`candidates`), `synonym` (a word that means an icon but is not its name or alias: `favourites` -> star / heart, `orders` -> receipt; `name`, `candidates`, `note`: use the canonical name), or `unknown` (`nearest`, `didYouMean`, `hint`) |
| `list_styles` | the 34 styles with descriptions, `group`, `goodFor`, `minSize` (a conservative floor: 16 line, solid, duo; 32 the single-colour illustration styles and the five older palette styles; 48 the role-named styles; styles.md has per-style sizes), `onDark` (how to use it on dark backgrounds), `motion3d`; palette styles list their colour variables. Also `groups` and `uses` (the "What are you making?" picks) |
| `list_categories` | categories, or the icons in one category (festivals: `indian-festivals`, `christmas`, `lunar-new-year`, `valentines`, `halloween`; `avatars`; `ai`) |

Typical agent loop: `search_icons("upload file")`, pick the top result that fits, then `get_icon(name, style, format: "react")`.
Paste the import and keep the canonical name.

`export_icon` with `out_dir` writes the same file names as the CLI: `<name>-<style>.svg` (svg-flat),
`<name>-<style>-themable.svg` (svg), `<name>-<style>-<px>.png`, `<name>-<style>-<preset>.gif` (animated),
`<name>-<style>-animated.pptx`; the full table is in [files.md](files.md#file-names). Exported SVGs contain a `<title>`:
add `aria-hidden="true"` (or `alt=""` on an `<img>`) when the icon sits next to visible text.

Large remote exports come in pages: a result with `next: { cursor, remaining }` has more to come, so call `export_icon` again with the same arguments plus `cursor`. Plain `svg-flat` files (no colour or size options) then come back as `urls[]` to the prebuilt `@withicons/static` SVGs on jsDelivr (colours baked in, ink follows `currentColor`, no `<title>`).

## CLI

```bash
npx withicons search "throw away"        # ranked names + aliases
npx withicons search cart --limit 5
npx withicons search "cute heart"        # style words pick the style: kawaii
npx withicons search diya --style rangoli # festival icons in a holiday style
npx withicons categories avatars         # people, animals, friendly monsters
npx withicons styles --for "christmas email"   # the best styles for a job
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
| `/api/motion/<name>` | `trigger` (`loop`, `hover`, `once`, `inview`, `swap`), `preset`, `to`, `effect`, `style`, `format` (`html` default, `react`, `vue`, `svelte`, `solid`, `angular`, `web-component`, `js`), `duration`, `raw=1` | animation code for `@withicons/motion` (as `animate_icon`; with a 3D `style`, also `moves`: `/api/motion/camera?style=soft3d`) |
| `/api/resolve/<name>` | none | canonical name, ambiguous candidates or nearest names (as `resolve_icon`) |
| `/api/recommend` | `for` (or `q`), `use`, `icon`, `limit` | the best styles for a job (as `recommend_styles`) |
| `/api/styles`, `/api/categories[/<category>]` | none | as `list_styles` / `list_categories` |

**If the API is slow.** The API is cached at the edge; the first request after a quiet period can take a few seconds.
If a request times out, retry once, or use the static https://withicons.com/icons.json (all names, aliases,
categories; CORS `*`) or the per-icon pages `https://withicons.com/icons/<name>.html`: no server involved.
Plain `?q=<words>` (no `limit`) is the form most likely to be cached already.

## Static files

| file | contents |
|---|---|
| https://withicons.com/icons.json | every icon: name, category, description, aliases, tags, styles |
| https://withicons.com/llms.txt | short index for LLMs; `llms-full.txt` is the full reference (usage, styles, motion, Ask AI briefs, every icon) |
| https://withicons.com/skill/SKILL.md | this skill |
| [icons.md](icons.md) | all 734 canonical names with categories and aliases (offline) |
| https://withicons.com/downloads/with-icons-<style>.zip | one style, every SVG (colours baked in) + an offline searchable viewer; `with-icons-all.zip` has every style |

## In code

```js
import { resolve, search } from '@withicons/core'          // in-memory, no network
import { create } from '@withicons/search'                  // the same engine the site and MCP use
import index from '@withicons/search/data'
const engine = create(index)
engine.search('throw away', { limit: 5 })  // [{ name: 'trash', score, match: { field: 'synonym', ... } }]
engine.resolve('bin')                      // { name: 'trash', alias: 'bin' }
```
