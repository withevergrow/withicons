# @withicons/holiday

6 styles (`utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine`) of with icons for all 734 icons:
standalone SVG files and IconNode data, plus their CSS class icons, laid out like [`@withicons/core`](https://www.npmjs.com/package/@withicons/core),
which holds the older styles and the shared API (`toSvg`, `resolve`, `search`, metadata, palettes; its `styles.json`
says which package holds each style). The newest styles have packages of their own because jsDelivr serves at most 150 MB per package.

```bash
npm i @withicons/core @withicons/holiday
```

```js
import { toSvg } from '@withicons/core'
import { Home } from '@withicons/holiday/nodes/utsav'
toSvg(Home, 'utsav', { size: 32, idSuffix: 'a' })   // gradients: give each inline copy its own idSuffix
import url from '@withicons/holiday/svg/utsav/home.svg'
```

CDN: `https://cdn.jsdelivr.net/npm/@withicons/holiday@latest/dist/svg/utsav/home.svg`

| path | contents |
|---|---|
| `dist/svg/<style>/<name>.svg` | standalone SVG (CSS variables flattened to their defaults) |
| `dist/nodes/<style>.js` (`.cjs`) | IconNode data: one tree-shakable named export per icon plus `nodes` / default |
| `dist/classes/with-<style>.css`, `dist/classes/<style>/<name>.css` | CSS class icons (`<i class="with with-home with-utsav">`); the @withicons/classes loader finds them by itself |

Every framework package (`@withicons/react`, `vue`, `svelte`, `angular`, `solid`) and `@withicons/web`, `@withicons/static`
hold every style, these included.

`glass`, `clay`, `bento`, `suite`, `dock`, `liquid`, `chrome`, `soft3d`, `utsav`, `rangoli`, `halloween`, `christmas`, `lunar`, `valentine` draw real SVG gradients: a `<defs>` of `linearGradient` / `radialGradient` whose stop
colours are the same CSS variables, so palettes and `--with-*` overrides recolour them too. Every inline copy gets its own
gradient ids (components, `<with-icon>`, `with-icons.js`), so one page can show the same icon many times in different
colours. When you inline SVG strings yourself, pass `idSuffix` (`toSvg` in `@withicons/core`, `svg` / `loadSvg` in
`@withicons/web`, `render` in `@withicons/dynamic`) with a different value per copy. Files and `<img>` need nothing.

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
