# @withicons/angular

300 icons x 7 styles for Angular: one standalone `<with-icon>` component plus
tree-shakable icon data. Works with SSR and hydration. `currentColor` by default.

```bash
npm i @withicons/angular
```

Angular 17+. The component ships as partial Ivy (Angular Package Format, built with Angular 22.2.0),
linked by the Angular CLI like any Angular library.

## 1. Pass the icon (tree-shaken, no setup)

```ts
import { Component } from '@angular/core'
import { WithIconComponent, Home, Search } from '@withicons/angular'   // line (default style)
import { Home as HomeSolid } from '@withicons/angular/solid'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: `
    <with-icon [icon]="Home" />
    <with-icon [icon]="Search" [size]="20" [strokeWidth]="1.5" class="text-slate-500" />
    <with-icon [icon]="HomeSolid" [size]="32" color="#e11d48" title="Home" />
  `,
})
export class ToolbarComponent {
  Home = Home; Search = Search; HomeSolid = HomeSolid
}
```

## 2. By name + variant

Register the icons once, then use them by name anywhere below that injector:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideWithIcons, Home, Search } from '@withicons/angular'
import { Home as HomeSolid } from '@withicons/angular/solid'
// import * as solid from '@withicons/angular/solid'   // a whole style: provideWithIcons(solid)

export const appConfig: ApplicationConfig = { providers: [provideWithIcons(Home, Search, HomeSolid)] }
```

```html
<with-icon name="home" />
<with-icon name="home" variant="solid" [size]="20" />
```

`name` takes canonical names (`arrow-right`). An unregistered name renders an empty `<svg>` and warns once in dev mode.

## Inputs

| input | type | default | notes |
|---|---|---|---|
| `icon` | `WithIconData` | — | `Home`, `HomeIcon`, `@withicons/angular/<style>/icons/<name>`; wins over `name` |
| `name` | `string` | — | resolved against `provideWithIcons(...)` |
| `variant` | `string` | `'line'` | style used with `name` |
| `size` | `number \| string` | `24` | width and height |
| `color` | `string` | `'currentColor'` | inherits the CSS text color by default |
| `strokeWidth` | `number \| string` | style default (`1.75`) | only styles with live strokes (line, duo, blueprint, sketch) |
| `absoluteStrokeWidth` | `boolean` | `false` | keep the stroke width constant in px at any size |
| `title` | `string` | — | renders `<title>` and sets `role="img"`; otherwise `aria-hidden="true"` |

`class`, `style`, `id` and event bindings apply to the `<with-icon>` host element (`display: inline-flex`), as with
any Angular component. The inner `<svg>` carries `class="withi withi-<name>"`.

## Styles

| style | import | kind | look |
|---|---|---|---|
| `line` | `@withicons/angular` | universal | A precise 1.75px outline with round caps and joins. The default for any interface. |
| `solid` | `@withicons/angular/solid` | universal | The filled companion to Line: bold mass, crisp knockouts, solid arrowheads, and parts, badges and slashes set apart by a precise gap. |
| `duo` | `@withicons/angular/duo` | universal | The line drawing over a soft tonal fill of the object's mass. Recolour the tone with --with-duo. |
| `gloss` | `@withicons/angular/gloss` | creative | Inflated, glossy and pillowy: soft-vinyl forms with carved specular highlights, in one flat colour. |
| `engrave` | `@withicons/angular/engrave` | creative | Banknote intaglio: a crisp contour that swells on its shadow side, swelling burin hatching that models light and shade, and a hatched cast shadow. |
| `blueprint` | `@withicons/angular/blueprint` | creative | A drafting-table drawing that shows its work: chain-dash centre lines, fillet construction, a dimension line and open control nodes around a precise 1.25px line. Set --with-accent for a two-tone blueprint. |
| `sketch` | `@withicons/angular/sketch` | creative | Marker ink over pencil: loose hand-drawn strokes that cross at corners and overshoot their loops, with light shadow-side hatching. |

- Every icon is exported twice: `Home` and `HomeIcon`. Deep imports (one file per icon):
  `@withicons/angular/icons/home`, `@withicons/angular/solid/icons/home`.
- Duo's tint can be recoloured with the CSS variable `--with-duo`.

## No Angular compiler?

`@withicons/web` is a framework-free `<with-icon>` custom element; use it (instead of this package, never both)
with `schemas: [CUSTOM_ELEMENTS_SCHEMA]`.

## Maintainers

`src/` is the component source. `node packages/angular/scripts/build-component.mjs` compiles it with ng-packagr
in an isolated toolchain (`.tmp/angular-toolchain`) into `prebuilt/`; `node forge/build.mjs angular` writes
`dist/` (prebuilt component + generated icon data) and warns when `prebuilt/` is older than `src/`.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, seven deterministic styles. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
