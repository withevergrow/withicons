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
//   dist/<style>/index.mjs                  every icon of that style
//   dist/index.mjs                          component + default-style icons + iconNames/styleNames
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { J, distWriter, basePkg, writePkg, renderOf, fallbackCount, styleTable } from './emit-core.mjs'

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
  W('types/withicons-angular.d.ts', fs.readFileSync(pre('withicons-angular.d.ts'), 'utf8'))

  const id = n => 'with_' + n.replace(/[^A-Za-z0-9_$]/g, '_')
  const table = styleTable(ctx)
  W('styles.mjs', header + styleNames.map(s => `export const ${id(s)} = ${J({ name: s, ...table[s] })}`).join('\n') +
    `\nexport const styles = { ${styleNames.map(s => `${J(s)}: ${id(s)}`).join(', ')} }\n`)
  W('styles.d.ts', `import type { WithIconStyle } from './types/withicons-angular'\n` +
    styleNames.map(s => `export declare const ${id(s)}: WithIconStyle`).join('\n') +
    `\nexport declare const styles: Record<${styleNames.map(J).join(' | ') || 'string'}, WithIconStyle>\n`)

  for (const s of styleNames) {
    const idx = [], idxDts = []
    for (const i of ctx.icons) {
      const r = renderOf(ctx, i, s) // a style that failed for this icon falls back to the default style
      const N = i.pascal
      W(`${s}/icons/${i.name}.mjs`, `import { ${id(r.style)} as style } from '../../styles.mjs'
const ${N} = { name: ${J(i.name)}, variant: ${J(s)}, style, node: ${J(r.nodes)} }
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
    ...basePkg(ctx, '@withicons/angular', `${ctx.icons.length} icons x ${ctx.styles.length} styles for Angular: a standalone <with-icon> component plus tree-shakable icon data.`, ['angular', 'angular-icons', 'standalone', 'svg-icons']),
    type: 'module', sideEffects: false,
    module: './dist/index.mjs', typings: './dist/index.d.ts',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
    peerDependencies: { '@angular/core': `>=${major}.0.0` },
  }
  writePkg(ctx, 'angular', pkg, angularReadme(ctx, info))
  if (stale) console.log(`  emit-angular: WARNING ${P}/prebuilt is older than ${P}/src — run: node ${P}/scripts/build-component.mjs`)
  const fb = fallbackCount(ctx)
  return `${files} files, ${ctx.icons.length} icons x ${styleNames.length} styles${fb ? `, ${fb} fell back to ${D}` : ''}${stale ? ' (STALE prebuilt component)' : ''}`
}

function angularReadme(ctx, info) {
  const major = (info.partialMinVersion || '17.0.0').split('.')[0]
  const styleRows = ctx.styles.map(s => `| \`${s.name}\` | \`@withicons/angular${s.name === ctx.defaultStyle ? '' : '/' + s.name}\` | ${s.kind} | ${s.description} |`).join('\n')
  const live = ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')
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

\`name\` takes canonical names (\`arrow-right\`). An unregistered name renders an empty \`<svg>\` and warns once in dev mode.

## Inputs

| input | type | default | notes |
|---|---|---|---|
| \`icon\` | \`WithIconData\` | — | \`Home\`, \`HomeIcon\`, \`@withicons/angular/<style>/icons/<name>\`; wins over \`name\` |
| \`name\` | \`string\` | — | resolved against \`provideWithIcons(...)\` |
| \`variant\` | \`string\` | \`'line'\` | style used with \`name\` |
| \`size\` | \`number \\| string\` | \`24\` | width and height |
| \`color\` | \`string\` | \`'currentColor'\` | inherits the CSS text color by default |
| \`strokeWidth\` | \`number \\| string\` | style default (\`1.75\`) | only styles with live strokes (${live}) |
| \`absoluteStrokeWidth\` | \`boolean\` | \`false\` | keep the stroke width constant in px at any size |
| \`title\` | \`string\` | — | renders \`<title>\` and sets \`role="img"\`; otherwise \`aria-hidden="true"\` |

\`class\`, \`style\`, \`id\` and event bindings apply to the \`<with-icon>\` host element (\`display: inline-flex\`), as with
any Angular component. The inner \`<svg>\` carries \`class="withi withi-<name>"\`.

## Styles

| style | import | kind | look |
|---|---|---|---|
${styleRows}

- Every icon is exported twice: \`Home\` and \`HomeIcon\`. Deep imports (one file per icon):
  \`@withicons/angular/icons/home\`, \`@withicons/angular/solid/icons/home\`.
- Duo's tint can be recoloured with the CSS variable \`--with-duo\`.

## No Angular compiler?

\`@withicons/web\` is a framework-free \`<with-icon>\` custom element; use it (instead of this package, never both)
with \`schemas: [CUSTOM_ELEMENTS_SCHEMA]\`.

## Maintainers

\`src/\` is the component source. \`node packages/angular/scripts/build-component.mjs\` compiles it with ng-packagr
in an isolated toolchain (\`.tmp/angular-toolchain\`) into \`prebuilt/\`; \`node forge/build.mjs angular\` writes
\`dist/\` (prebuilt component + generated icon data) and warns when \`prebuilt/\` is older than \`src/\`.

MIT licensed. Part of [with icons](https://withicons.com): one skeleton per icon, seven deterministic styles. [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}
