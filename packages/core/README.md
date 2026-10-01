# @withicons/core

Framework-free data for with icons: 300 icons in 7 styles (`line`, `solid`, `duo`, `gloss`, `engrave`, `blueprint`, `sketch`) as standalone SVG files, IconNode data, metadata, alias resolution and search.

```bash
npm i @withicons/core
```

```js
import { resolve, search, toSvg, icons } from '@withicons/core'
import solid from '@withicons/core/nodes/solid'

resolve('trash').name        // 'trash'   (canonical name)
resolve('bin').name          // 'trash'   (alias with one match)
resolve('ArrowRight').name   // 'arrow-right'
resolve('expand')            // throws: ambiguous alias, err.candidates = ['chevron-down', ...]
resolve('hoem')              // throws: unknown icon, err.suggestions = ['home', ...]

search('delete')             // ranked IconMeta[] (name, alias, tag, category, description)
toSvg(solid.home, 'solid', { size: 32, color: '#e11d48', title: 'Home' })  // '<svg ...>'
```

## Files

| path | contents |
|---|---|
| `dist/svg/<style>/<name>.svg` | optimized standalone SVG (`currentColor`, 24x24) |
| `dist/icons.json` | `[{ name, category, description, aliases, tags, styles }]` |
| `dist/aliases.json` | `{ alias: [canonical names] }` (more than one name = ambiguous) |
| `dist/nodes/<style>.js` | `{ [name]: IconNode }` where IconNode = `[tag, attrs][]` |

Import a file: `import url from '@withicons/core/svg/solid/home.svg'`.
CDN: `https://cdn.jsdelivr.net/npm/@withicons/core@0.1.0/dist/svg/line/home.svg`

## API

| export | description |
|---|---|
| `resolve(name)` | canonical name, PascalCase or alias -> `IconMeta`. Throws `code: 'WITH_AMBIGUOUS_ICON'` (`candidates`) or `'WITH_UNKNOWN_ICON'` (`suggestions`, 3 nearest) |
| `find(name)` | like `resolve`, returns `null` instead of throwing |
| `search(query, { limit, category })` | ranked `IconMeta[]` |
| `suggest(name, count = 3)` | nearest canonical names |
| `toSvg(iconNode, style, { size, color, strokeWidth, absoluteStrokeWidth, title, class })` | SVG string |
| `icons`, `iconNames`, `styles`, `styleNames`, `aliases`, `categories` | metadata |

## Styles

- `line` (universal) — A precise 1.75px outline with round caps and joins. The default for any interface.
- `solid` (universal) — The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap.
- `duo` (universal) — The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo.
- `gloss` (creative) — Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour.
- `engrave` (creative) — Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow.
- `blueprint` (creative) — A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint.
- `sketch` (creative) — Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching.

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
