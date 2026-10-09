// emit-angular — @withicons/angular: a standalone <with-icon> component + per-style icon data.
//
// The component (packages/angular/src) is compiled ONCE to partial Ivy (Angular Package Format,
// ng-packagr) by packages/angular/scripts/build-component.mjs, in an isolated toolchain, into
// packages/angular/prebuilt/. It does not depend on icon data, so this emitter only copies it
// and writes the data as plain ESM: the icon build needs no Angular toolchain.
//
//   dist/fesm2022/withicons-angular.mjs   WithIconComponent, provideWithIcons, ... (from prebuilt/)
//   dist/types/withicons-angular.d.ts
//   dist/styles.mjs                         per-style root attributes + default stroke width
//   dist/<style>/icons/<name>.mjs           one file per icon per style: Home, HomeIcon, default
//   dist/<style>/values.mjs                 the attribute values that style repeats, imported by its icon files
//   dist/<style>/index.mjs                  every icon of that style
//   dist/index.mjs                          component + default-style icons + iconNames/styleNames
import { groupOfStyle } from '../tools/style-groups.mjs'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { J, nodePool, distWriter, basePkg, writePkg, renderOf, fallbackCount, styleTable, paletteDoc, motionDoc, totalText, liveStrokeStyles } from './emit-core.mjs'

// The prebuilt component's d.ts names the styles it was compiled with; the style list is data, so the
// union (and the live-stroke note) are rewritten here from ctx.styles instead of recompiling the component.
function patchTypes(dts, ctx) {
  return dts
    .replace(/(type WithIconVariant = )[^;]+;/, `$1${ctx.styles.map(s => J(s.name).replace(/"/g, "'")).join(' | ')};`)
    .replace(/\/\*\* The \w+ with icons styles\. \*\//, `/** The ${ctx.styles.length} with icons styles. */`)
    .replace(/styles with live strokes \(line, duo\)/g, `styles with live strokes (${liveStrokeStyles(ctx).join(', ')})`)
}

export default async function emit(ctx) {
  const P = 'packages/angular'
  const PKG = path.join(ctx.root, P)
  const pre = f => path.join(PKG, 'prebuilt', f)
  if (!fs.existsSync(pre('withicons-angular.mjs')) || !fs.existsSync(pre('withicons-angular.d.ts')))
    throw new Error(`${P}/prebuilt is missing — run: node ${P}/scripts/build-component.mjs`)
  const info = JSON.parse(fs.readFileSync(pre('build-info.json'), 'utf8'))
  const { srcHash } = await import(pathToFileURL(path.join(PKG, 'scripts', 'build-component.mjs')).href)
  const stale = srcHash() !== info.srcHash

  const out = distWriter(ctx, `${P}/dist`)
  let files = 0
  const W = (rel, text) => { out.add(rel, text); files++ }
  const D = ctx.defaultStyle
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/angular ${ctx.version} — generated, do not edit\n`
  W('fesm2022/withicons-angular.mjs', fs.readFileSync(pre('withicons-angular.mjs'), 'utf8'))
  W('types/withicons-angular.d.ts', patchTypes(fs.readFileSync(pre('withicons-angular.d.ts'), 'utf8'), ctx))

  const id = n => 'with_' + n.replace(/[^A-Za-z0-9_$]/g, '_')
  const table = styleTable(ctx)
  W('styles.mjs', header + styleNames.map(s => `export const ${id(s)} = ${J({ name: s, ...table[s] })}`).join('\n') +
    `\nexport const styles = { ${styleNames.map(s => `${J(s)}: ${id(s)}`).join(', ')} }\n`)
  W('styles.d.ts', `import type { WithIconStyle } from './types/withicons-angular'\n` +
    styleNames.map(s => `export declare const ${id(s)}: WithIconStyle`).join('\n') +
    `\nexport declare const styles: Record<${styleNames.map(J).join(' | ') || 'string'}, WithIconStyle>\n`)

  for (const s of styleNames) {
    const idx = [], idxDts = []
    // a style that failed for an icon falls back to the default style
    const renders = ctx.icons.map(i => [i, renderOf(ctx, i, s)])
    // attribute values the style repeats (palette variables, classes) live once in <style>/values.mjs (package size)
    const pool = nodePool(renders.map(([, r]) => r.nodes), { shared: true })
    W(`${s}/values.mjs`, `${header}${pool.decl(null, true)}\n`)
    for (const [i, r] of renders) {
      const N = i.pascal
      const used = new Set(), own = pool.local(r.nodes, used)
      W(`${s}/icons/${i.name}.mjs`, `import { ${id(r.style)} as style } from '../../styles.mjs'
${used.size ? `import { ${[...used].join(', ')} } from '../values.mjs'\n` : ''}${own.decl ? own.decl + '\n' : ''}const ${N} = { name: ${J(i.name)}, variant: ${J(s)}, style, node: ${own.lit} }
export { ${N}, ${N} as ${N}Icon }
export default ${N}
`)
      W(`${s}/icons/${i.name}.d.ts`, `import type { WithIconData } from '../../types/withicons-angular'
/** ${i.name} (${s}) — ${i.description.replace(/\*\//g, '')} */
declare const ${N}: WithIconData
export { ${N}, ${N} as ${N}Icon }
export default ${N}
`)
      idx.push(`export { ${N}, ${N}Icon } from './icons/${i.name}.mjs'`)
      idxDts.push(`/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${N}: WithIconData\nexport declare const ${N}Icon: WithIconData`)
    }
    W(`${s}/index.mjs`, header + idx.join('\n') + '\n')
    W(`${s}/index.d.ts`, `import type { WithIconData } from '../types/withicons-angular'\n${idxDts.join('\n')}\n`)
  }
  W('meta.mjs', `${header}export const iconNames = ${J(ctx.icons.map(i => i.name))}\nexport const styleNames = ${J(styleNames)}\n`)
  W('meta.d.ts', `export declare const iconNames: Array<${ctx.icons.map(i => J(i.name)).join(' | ') || 'string'}>\nexport declare const styleNames: Array<${styleNames.map(J).join(' | ') || 'string'}>\n`)
  W('index.mjs', `${header}export * from './fesm2022/withicons-angular.mjs'
export * from './${D}/index.mjs'
export { styles } from './styles.mjs'
export { iconNames, styleNames } from './meta.mjs'
`)
  W('index.d.ts', `export * from './types/withicons-angular'
export * from './${D}/index'
export { styles } from './styles'
export { iconNames, styleNames } from './meta'
`)
  await out.flush()

  const e = base => ({ types: `./dist/${base}.d.ts`, default: `./dist/${base}.mjs` })
  const ex = { '.': e('index') }
  for (const s of styleNames) ex['./' + s] = e(`${s}/index`)
  ex['./icons/*'] = e(`${D}/icons/*`)
  for (const s of styleNames) ex[`./${s}/icons/*`] = e(`${s}/icons/*`)
  ex['./package.json'] = './package.json'
  const tv = { 'icons/*': [`./dist/${D}/icons/*.d.ts`] }
  for (const s of styleNames) { tv[s] = [`./dist/${s}/index.d.ts`]; tv[`${s}/icons/*`] = [`./dist/${s}/icons/*.d.ts`] }
  const major = (info.partialMinVersion || '17.0.0').split('.')[0]
  const pkg = {
    ...basePkg(ctx, '@withicons/angular', `${ctx.icons.length} icons x ${ctx.styles.length} styles for Angular: a standalone <with-icon> component plus tree-shakable icon data.`, ['angular', 'angular-icons', 'standalone', 'svg-icons', 'multicolor-icons', 'animated-icons', ...ctx.styles.map(s => `${s.name}-icons`)]),
    type: 'module', sideEffects: false,
    module: './dist/index.mjs', typings: './dist/index.d.ts',
    // the bare CDN URL (cdn.jsdelivr.net/npm/@withicons/angular) shows the entry instead of a 404
    jsdelivr: './dist/index.mjs', unpkg: './dist/index.mjs',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
    scripts: { test: 'node --test test/*.test.mjs' },
    peerDependencies: { '@angular/core': `>=${major}.0.0` },
  }
  writePkg(ctx, 'angular', pkg, angularReadme(ctx, info))
  if (stale) console.log(`  emit-angular: WARNING ${P}/prebuilt is older than ${P}/src — run: node ${P}/scripts/build-component.mjs`)
  const fb = fallbackCount(ctx)
  return `${files} files, ${ctx.icons.length} icons x ${styleNames.length} styles${fb ? `, ${fb} fell back to ${D}` : ''}${stale ? ' (STALE prebuilt component)' : ''}`
}

function angularReadme(ctx, info) {
  const major = (info.partialMinVersion || '17.0.0').split('.')[0]
  const styleRows = ctx.styles.map(s => `| \`${s.name}\` | \`@withicons/angular${s.name === ctx.defaultStyle ? '' : '/' + s.name}\` | ${groupOfStyle(s.name).title} | ${s.description} |`).join('\n')
  const live = ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')
  const variantList = ctx.styles.map(s => '`' + s.name + '`').join(', ')
  // the Angular palette example uses retro + pizza; only print it when both exist
  const pal = ctx.styles.some(s => s.name === 'retro' && s.palette) && ctx.icons.some(i => i.name === 'pizza')
  return `# @withicons/angular

${ctx.icons.length} icons x ${ctx.styles.length} styles for Angular: one standalone \`<with-icon>\` component plus
tree-shakable icon data. Works with SSR and hydration. \`currentColor\` by default.

\`\`\`bash
npm i @withicons/angular
\`\`\`

Angular ${major}+. The component ships as partial Ivy (Angular Package Format, built with Angular ${info.angular}),
linked by the Angular CLI like any Angular library.

## 1. Pass the icon (tree-shaken, no setup)

\`\`\`ts
import { Component } from '@angular/core'
import { WithIconComponent, Home, Search } from '@withicons/angular'   // line (default style)
import { Home as HomeSolid } from '@withicons/angular/solid'

@Component({
  selector: 'app-toolbar',
  imports: [WithIconComponent],
  template: \`
    <with-icon [icon]="Home" />
    <with-icon [icon]="Search" [size]="20" [strokeWidth]="1.5" class="text-slate-500" />
    <with-icon [icon]="HomeSolid" [size]="32" color="#e11d48" title="Home" />
  \`,
})
export class ToolbarComponent {
  Home = Home; Search = Search; HomeSolid = HomeSolid
}
\`\`\`

## 2. By name + variant

Register the icons once, then use them by name anywhere below that injector:

\`\`\`ts
// app.config.ts
import { ApplicationConfig } from '@angular/core'
import { provideWithIcons, Home, Search } from '@withicons/angular'
import { Home as HomeSolid } from '@withicons/angular/solid'
// import * as solid from '@withicons/angular/solid'   // a whole style: provideWithIcons(solid)

export const appConfig: ApplicationConfig = { providers: [provideWithIcons(Home, Search, HomeSolid)] }
\`\`\`

\`\`\`html
<with-icon name="home" />
<with-icon name="home" variant="solid" [size]="20" />
\`\`\`

\`name\` takes canonical names (\`arrow-right\`). An unregistered name renders nothing and warns once in dev mode.

## Inputs

| input | type | default | notes |
|---|---|---|---|
| \`icon\` | \`WithIconData\` | — | \`Home\`, \`HomeIcon\`, \`@withicons/angular/<style>/icons/<name>\`; wins over \`name\` |
| \`name\` | \`string\` | — | resolved against \`provideWithIcons(...)\` |
| \`variant\` | \`WithIconVariant\` | \`'line'\` | style used with \`name\`: ${variantList} |
| \`size\` | \`number \\| string\` | \`24\` | width and height |
| \`color\` | \`string\` | \`'currentColor'\` | inherits the CSS text color by default |
| \`strokeWidth\` | \`number \\| string\` | style default (\`1.75\`) | only styles with live strokes (${live}) |
| \`absoluteStrokeWidth\` | \`boolean\` | \`false\` | keep the stroke width constant in px at any size |
| \`title\` | \`string\` | — | renders \`<title>\` (a tooltip) and sets \`role="img"\`; otherwise \`aria-hidden="true"\` |
| \`aria-label\` | \`string\` | — | accessible name without a tooltip; moved to the \`<svg role="img">\` |
| \`aria-labelledby\` | \`string\` | — | id(s) of the element(s) that name the icon; moved to the \`<svg role="img">\` |

\`class\`, \`style\`, \`id\` and event bindings apply to the \`<with-icon>\` host element (\`display: inline-flex\`), as with
any Angular component. The inner \`<svg>\` carries \`class="withi withi-<name>"\`. \`title\`, \`aria-label\` and
\`aria-labelledby\` are moved from the host to the \`<svg>\`, so a screen reader announces one image with that name:

\`\`\`html
<button type="button" (click)="remove()"><with-icon [icon]="Trash" aria-label="Delete" /></button>
\`\`\`

## Styles

| style | import | group | look |
|---|---|---|---|
${styleRows}

- Every icon is exported twice: \`Home\` and \`HomeIcon\`. Deep imports (one file per icon):
  \`@withicons/angular/icons/home\`, \`@withicons/angular/solid/icons/home\`.
- Duo's tint can be recoloured with the CSS variable \`--with-duo\`.

${paletteDoc(ctx)}${pal ? `
### Change every colour in Angular

CSS variables set on the \`<with-icon>\` host reach the SVG, so a \`[style]\` binding (or any CSS rule) re-themes one icon:

\`\`\`ts
import { Pizza } from '@withicons/angular/retro'
\`\`\`

\`\`\`html
<with-icon [icon]="Pizza" [size]="48" color="#3b1f12"
           [style]="{ '--with-retro-1': '#f4b942', '--with-retro-2': '#d9412b', '--with-retro-3': '#2f8f4e' }" />
\`\`\`

Every icon also has 20-30 colour palettes picked for it in [\`@withicons/core\`](https://www.npmjs.com/package/@withicons/core)
(\`npm i @withicons/core\`). \`applyPalette\` maps a palette onto the variables this icon uses, in any style:

\`\`\`ts
import { Component } from '@angular/core'
import { WithIconComponent } from '@withicons/angular'
import { Pizza } from '@withicons/angular/retro'
import pizza from '@withicons/core/palettes/pizza.json'          // needs "resolveJsonModule": true
import { applyPalette } from '@withicons/core/palettes/palette-map.js'

@Component({
  selector: 'app-menu',
  imports: [WithIconComponent],
  template: \`
    @for (p of looks; track p.id) {
      <with-icon [icon]="Pizza" [size]="40" [style]="p.vars" [color]="p.color" [title]="p.name" />
    }
  \`,
})
export class MenuComponent {
  Pizza = Pizza
  looks = pizza.palettes.map(p => ({ id: p.id, name: p.name, ...applyPalette(JSON.stringify(Pizza.node), p.colors) }))
}
\`\`\`
` : ''}${motionDoc(ctx)}
### Animation in Angular

Put the motion classes on the \`<with-icon>\` host, and add the two stylesheets to \`angular.json\`
(\`"styles": ["src/styles.css", "node_modules/@withicons/motion/dist/motion.css", "node_modules/@withicons/motion/dist/icons.css"]\`):

\`\`\`html
<with-icon class="wm wm-loop" data-wm="bell" [icon]="Bell" />
<button class="wm-trigger"><with-icon class="wm wm-hover" data-wm="bell" [icon]="Bell" /> Alerts</button>
\`\`\`

## Right-to-left layouts

Icons are drawn left to right. Mirror the directional ones (arrows, chevrons, undo/redo, send, log-in/out) in RTL
with one rule on the inner \`<svg>\`, which leaves the host free for motion transforms:

\`\`\`css
[dir="rtl"] with-icon.rtl-mirror > svg { transform: scaleX(-1); }
\`\`\`

\`\`\`html
<with-icon class="rtl-mirror" [icon]="ChevronRight" />
\`\`\`

## No Angular compiler?

\`@withicons/web\` is a framework-free \`<with-icon>\` custom element; use it (instead of this package, never both)
with \`schemas: [CUSTOM_ELEMENTS_SCHEMA]\`.

## Maintainers

\`src/\` is the component source. \`node packages/angular/scripts/build-component.mjs\` compiles it with ng-packagr
in an isolated toolchain (\`.tmp/angular-toolchain\`, or \`WITH_ANGULAR_TOOLCHAIN=<dir>\`) into \`prebuilt/\`;
\`node forge/build.mjs angular\` writes \`dist/\` (prebuilt component + generated icon data) and warns when
\`prebuilt/\` is older than \`src/\`.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, ${ctx.styles.length} deterministic styles, ${totalText(ctx)} icons. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}
