# @withicons/svelte

300 icons x 7 styles for Svelte 4 and Svelte 5. Tree-shakable, typed, `currentColor` by default.

```bash
npm i @withicons/svelte
```

```svelte
<script>
  import { Home, Search } from '@withicons/svelte';       // line (default style)
  import { Home as HomeSolid } from '@withicons/svelte/solid';
</script>

<nav>
  <Home />
  <Search size={20} strokeWidth={1.5} class="text-slate-500" />
  <HomeSolid size={32} color="#e11d48" title="Home" />
</nav>
```

- Default import path = **line** style. Every other style is a subpath: `@withicons/svelte/solid`, `@withicons/svelte/duo`, ...
- Every icon is exported twice: `Home` and `HomeIcon`. Names are the PascalCase of the kebab-case icon name (`arrow-right` -> `ArrowRight`).
- Deep imports (one file per icon): `@withicons/svelte/icons/home`, `@withicons/svelte/solid/icons/home`.

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
| `line` | `@withicons/svelte` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/svelte/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/svelte/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/svelte/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/svelte/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/svelte/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/svelte/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |

Duo's tint can be recoloured with the CSS variable `--with-duo`.

## Generic icon (dynamic names)

```svelte
<script>
  import { Icon } from '@withicons/svelte';   // or: import Icon from '@withicons/svelte/icon'
</script>

<Icon name="home" variant="solid" size={20} />
```

`name` accepts canonical names and unambiguous aliases (`bin` -> `trash`); unknown names warn with the 3 nearest names and render nothing.
**Bundle cost:** `Icon` references every icon in every style (300 x 7). It is tree-shaken away when unused; when used, prefer named imports wherever the name is static.

## Custom icons

`<IconBase iconNode={[['path', { d: 'M4 12h16' }]]} name="my-icon" variant="line" />` renders your own IconNode data
(`[tag, attrs][]`, 24x24 grid) with the same props.

## Svelte notes

- Components are shipped as `.svelte` source in the classic syntax, which both Svelte 4 and Svelte 5 compile
  (Svelte 5 runs them in legacy mode; they work inside runes components). Do not force `compilerOptions.runes: true`
  on `node_modules` — use `dynamicCompileOptions` for your own files instead.
- Svelte 5 event props (`onclick`) spread onto the `<svg>`; Svelte 4 `on:click` is not forwarded — wrap the icon in a `<button>`.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, seven deterministic styles. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
