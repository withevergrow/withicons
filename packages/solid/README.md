# @withicons/solid

300 icons x 7 styles for SolidJS. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/solid
```

```tsx
import { Home, Search } from '@withicons/solid'        // line (default style)
import { Home as HomeSolid } from '@withicons/solid/solid'

export function Toolbar() {
  return (
    <nav>
      <Home />
      <Search size={20} strokeWidth={1.5} class="text-slate-500" />
      <HomeSolid size={32} color="#e11d48" title="Home" />
    </nav>
  )
}

// Plain ESM, no JSX inside the package: works in the browser, with hydration and with
// renderToString / SolidStart. ref, onClick, style and aria-* spread onto the <svg>.
```

- Default import path = **line** style. Every other style is a subpath: `@withicons/solid/solid`, `@withicons/solid/duo`, ...
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports (one file per icon): `@withicons/solid/icons/home`, `@withicons/solid/solid/icons/home`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | style default (`1.75`) | only styles with live strokes (line, duo, blueprint, sketch) |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` and sets `role="img"`; otherwise `aria-hidden="true"` |
| `class` | `string` | — | appended to `withi withi-<name>` |
| ...rest | | | spread onto the `<svg>` |

## Styles

| style | import | kind | look |
|---|---|---|---|
| `line` | `@withicons/solid` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/solid/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/solid/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/solid/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/solid/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/solid/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/solid/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |

Duo's tint can be recoloured with the CSS variable `--with-duo`.

## Generic icon (dynamic names)

```tsx
import { Icon } from '@withicons/solid'

<Icon name="home" variant="solid" size={20} />   // name and variant are reactive
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.
**Bundle cost:** `Icon` references every icon in every style (300 x 7). It is tree-shaken away when unused; when used, prefer named imports wherever the name is static.

## Custom icons

`createWithIcon(name, style, displayName, iconNode)` builds a component from IconNode data (`[tag, attrs][]`, 24x24 grid).

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, seven deterministic styles. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
