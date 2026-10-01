// emit-core — @withicons/core: standalone SVGs, metadata, IconNode data, resolve() and search().
// Also exports the helpers shared by emit-react / emit-vue / emit-web / emit-static (named exports;
// build.mjs only calls the default export).
//
//   packages/core/dist/svg/<style>/<name>.svg   optimized standalone SVGs
//   packages/core/dist/icons.json               [{ name, category, description, aliases, tags, styles }]
//   packages/core/dist/aliases.json             { alias: [canonical names] }
//   packages/core/dist/nodes/<style>.{js,cjs,d.ts,d.cts}   { name: IconNode }
//   packages/core/dist/index.{js,cjs,d.ts,d.cts}           icons, styles, resolve, search, toSvg

// ---------------------------------------------------------------- shared helpers
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

export const J = v => JSON.stringify(v)
export const SVG_NS = 'http://www.w3.org/2000/svg'

// Collects files for one dist directory, then writes them in parallel and deletes stale files
// (icons that were renamed or removed) so deep imports never serve outdated output.
export function distWriter(ctx, distRel) {
  const files = new Map()
  return {
    add(rel, text) { files.set(rel, text) },
    get size() { return files.size },
    async flush() {
      const root = path.join(ctx.root, distRel)
      const want = new Set([...files.keys()].map(r => path.join(root, r)))
      const dirs = new Set([...want].map(f => path.dirname(f)))
      for (const d of dirs) fs.mkdirSync(d, { recursive: true })
      const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : []
      const stale = walk(root).filter(f => !want.has(f))
      // unchanged files are left alone: far fewer writes (and virus-scanner hits) on rebuilds
      const jobs = [...files].map(([rel, text]) => async () => {
        const f = path.join(root, rel)
        const old = await fsp.readFile(f, 'utf8').catch(() => null)
        if (old !== text) await fsp.writeFile(f, text)
      })
        .concat(stale.map(f => () => fsp.unlink(f).catch(() => {})))
      let i = 0
      const worker = async () => { while (i < jobs.length) await jobs[i++]() }
      await Promise.all(Array.from({ length: 48 }, worker))
      return files.size
    },
  }
}

export const LICENSE = year => `MIT License

Copyright (c) ${year} with icons contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`

// The render of `icon` in `style`; falls back to the default style if that style failed for this icon,
// so every package always exports the full name set in every style.
export function renderOf(ctx, icon, style) {
  const r = icon.render[style]
  if (r) return { ...r, style }
  const fb = icon.render[ctx.defaultStyle] || Object.values(icon.render)[0]
  if (fb) return { ...fb, style: icon.render[ctx.defaultStyle] ? ctx.defaultStyle : Object.keys(icon.render)[0] }
  return { nodes: [], inner: '', svg: '', style }
}
// Inner markup of icon in style; a fallback render is wrapped in <g> carrying its own style's root attributes.
export function innerOf(ctx, icon, style) {
  const r = renderOf(ctx, icon, style)
  if (r.style === style) return r.inner
  const st = ctx.styles.find(s => s.name === r.style)
  const a = Object.entries((st && st.root) || {}).map(([k, v]) => ` ${k}="${String(v).replace(/"/g, '&quot;')}"`).join('')
  return `<g${a}>${r.inner}</g>`
}
export function fallbackCount(ctx) {
  let n = 0
  for (const i of ctx.icons) for (const s of ctx.styles) if (!i.render[s.name]) n++
  return n
}

// Standard package.json scaffolding shared by every @withicons/* package.
export const REPO = 'https://github.com/withevergrow/withicons'
export const HOMEPAGE = 'https://withicons.com'
export const AUTHOR = 'with icons — powered by Evergrow'
export function basePkg(ctx, name, description, keywords) {
  return {
    name, version: ctx.version, description, license: 'MIT',
    author: { name: AUTHOR, url: 'https://withevergrow.com' },
    homepage: HOMEPAGE,
    repository: { type: 'git', url: `git+${REPO}.git`, directory: `packages/${name.split('/').pop()}` },
    bugs: { url: `${REPO}/issues` },
    keywords: ['icons', 'svg', 'icon-library', 'withicons', 'with-icons', ...keywords],
  }
}
export function writePkg(ctx, dir, pkg, readme) {
  ctx.write(`packages/${dir}/package.json`, JSON.stringify(pkg, null, 2) + '\n')
  ctx.write(`packages/${dir}/README.md`, readme)
  ctx.write(`packages/${dir}/LICENSE`, LICENSE(new Date().getFullYear()))
}

// Conditional export entry with separate ESM / CJS type files.
export const dual = (base) => ({
  import: { types: `./${base}.d.ts`, default: `./${base}.js` },
  require: { types: `./${base}.d.cts`, default: `./${base}.cjs` },
})
export const esmOnly = (base) => ({ types: `./${base}.d.ts`, default: `./${base}.js` })

// Exports map for a component package: '.', './<style>', './icons/*', './<style>/icons/*', './icon'.
export function componentExports(ctx) {
  const ex = { '.': dual('dist/index') }
  for (const s of ctx.styles) ex['./' + s.name] = dual(`dist/${s.name}/index`)
  ex['./icon'] = esmOnly('dist/icon')
  ex['./icons/*'] = esmOnly(`dist/${ctx.defaultStyle}/icons/*`)
  for (const s of ctx.styles) ex[`./${s.name}/icons/*`] = esmOnly(`dist/${s.name}/icons/*`)
  ex['./package.json'] = './package.json'
  const tv = { icon: ['./dist/icon.d.ts'], 'icons/*': [`./dist/${ctx.defaultStyle}/icons/*.d.ts`] }
  for (const s of ctx.styles) { tv[s.name] = [`./dist/${s.name}/index.d.ts`]; tv[`${s.name}/icons/*`] = [`./dist/${s.name}/icons/*.d.ts`] }
  return { exports: ex, typesVersions: { '*': tv } }
}

// Types shared by every component package's d.ts.
export function unionOf(list) { return list.length ? list.map(J).join(' | ') : 'never' }
export function namesAndAliasesDts(ctx) {
  const unamb = Object.keys(ctx.aliasIndex).filter(a => ctx.aliasIndex[a].length === 1).sort()
  return `/** Every canonical icon name. */
export type IconName = ${unionOf(ctx.icons.map(i => i.name))}
/** Aliases that resolve to exactly one icon (e.g. 'bin' -> 'trash'). */
export type IconAlias = ${unionOf(unamb)}
/** The ${ctx.styles.length} styles. 'line' is the default. */
export type StyleName = ${unionOf(ctx.styles.map(s => s.name))}
/** Icon data: a list of [tag, attributes] pairs rendered inside a 24x24 <svg>. */
export type IconNode = [tag: string, attrs: Record<string, string | number>][]
`
}

// Style table used by the runtimes: { name: { root, strokeWidth } }
export function styleTable(ctx, mapAttrs = a => a) {
  const t = {}
  for (const s of ctx.styles) t[s.name] = { root: mapAttrs(s.root || {}), strokeWidth: typeof s.strokeWidth === 'number' ? s.strokeWidth : false }
  return t
}

// ---------------------------------------------------------------- runtime (embedded via .toString())
// These functions are serialized into generated modules. Keep them self-contained.

// Levenshtein distance with adjacent transpositions (optimal string alignment): 'hoem' -> 'home' = 1.
function withLevenshtein(a, b) {
  if (a === b) return 0
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let pp = [], prev = []
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      let d = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, pp[j - 2] + 1)
      cur[j] = d
    }
    pp = prev
    prev = cur
  }
  return prev[n]
}
function withKeys(input) {
  const raw = String(input == null ? '' : input).trim()
  const k = raw.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_./:]+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
  const out = [raw, raw.toLowerCase(), k]
  if (/-icon$/.test(k)) out.push(k.slice(0, -5))
  if (/^icon-/.test(k)) out.push(k.slice(5))
  const d = k.replace(/([a-z])(\d)/g, '$1-$2')
  if (d !== k) out.push(d)
  return out
}
function withNearest(input, names, aliases, count) {
  const q = withKeys(input)[2]
  const best = {}
  const consider = (key, name, penalty) => {
    const d = withLevenshtein(q, key) + penalty
    if (!(name in best) || d < best[name]) best[name] = d
  }
  for (const n of names) consider(n, n, 0)
  for (const a in aliases) for (const n of aliases[a]) consider(a, n, 0.5)
  return Object.keys(best).sort((x, y) => best[x] - best[y] || (x < y ? -1 : 1)).slice(0, count || 3)
}
// Tiered resolution: canonical name -> unambiguous alias -> (ambiguous alias: throw with candidates)
// -> (unknown: throw with the 3 nearest names).
function withLookup(input, has, names, aliases) {
  const keys = withKeys(input)
  for (const k of keys) if (has(k)) return k
  for (const k of keys) {
    const hit = Object.prototype.hasOwnProperty.call(aliases, k) ? aliases[k] : null
    if (!hit) continue
    if (hit.length === 1) return hit[0]
    const e = new Error('with icons: "' + input + '" is ambiguous; it is an alias of ' + hit.join(', ') + '. Use one of these canonical names.')
    e.code = 'WITH_AMBIGUOUS_ICON'
    e.candidates = hit.slice()
    throw e
  }
  const s = withNearest(input, names, aliases, 3)
  const e = new Error('with icons: unknown icon "' + input + '". Did you mean: ' + s.join(', ') + '?')
  e.code = 'WITH_UNKNOWN_ICON'
  e.suggestions = s
  throw e
}
export const LOOKUP_SRC = [withLevenshtein, withKeys, withNearest, withLookup].map(f => f.toString()).join('\n')

function withScore(icon, q, tokens) {
  let total = 0
  if (icon.name === q) total += 100
  const parts = icon.name.split('-')
  for (const t of tokens) {
    let s = 0
    if (icon.name === t) s += 40
    else if (parts.indexOf(t) >= 0) s += 30
    else if (icon.name.indexOf(t) === 0) s += 20
    else if (icon.name.indexOf(t) > 0) s += 10
    for (const a of icon.aliases) {
      if (a === t) { s += 25; break }
      if (a.indexOf(t) === 0) { s += 12; break }
      if (t.length > 2 && a.indexOf(t) > 0) { s += 6; break }
    }
    for (const g of icon.tags) {
      if (g === t) { s += 15; break }
      if (g.indexOf(t) === 0) { s += 8; break }
    }
    if (icon.category === t) s += 8
    if (t.length > 2 && (' ' + icon.description.toLowerCase()).indexOf(' ' + t) >= 0) s += 3
    if (!s) return 0
    total += s
  }
  return total
}
function withSearch(icons, query, options) {
  const opts = options || {}
  const q = String(query == null ? '' : query).trim().toLowerCase()
  let list = icons
  if (opts.category) list = list.filter(i => i.category === opts.category)
  if (!q) return list.slice(0, opts.limit || list.length)
  const tokens = q.split(/[\s,_-]+/).filter(Boolean)
  const joined = tokens.join('-')
  const scored = []
  for (const i of list) { const s = withScore(i, joined, tokens); if (s > 0) scored.push([s, i]) }
  scored.sort((a, b) => b[0] - a[0] || (a[1].name < b[1].name ? -1 : 1))
  return scored.slice(0, opts.limit || 50).map(x => x[1])
}
function withToSvg(iconNode, style, options) {
  const o = options || {}
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const st = STYLES[style || 'line'] || STYLES.line
  const size = o.size == null ? 24 : o.size
  const color = o.color || 'currentColor'
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
  for (const k in st.root) a[k] = st.root[k] === 'currentColor' ? color : st.root[k]
  if (color !== 'currentColor') a.color = color
  if (typeof st.strokeWidth === 'number') {
    const w = o.strokeWidth == null || isNaN(Number(o.strokeWidth)) ? st.strokeWidth : Number(o.strokeWidth)
    const px = /^\s*\d*\.?\d+(px)?\s*$/.test(String(size)) ? parseFloat(size) : 0
    a['stroke-width'] = o.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
  }
  if (o.class) a.class = o.class
  if (o.title) a.role = 'img'
  else a['aria-hidden'] = 'true'
  const attrs = obj => Object.keys(obj).filter(k => obj[k] != null && obj[k] !== false).map(k => ' ' + k + '="' + esc(obj[k]) + '"').join('')
  return '<svg' + attrs(a) + '>' + (o.title ? '<title>' + esc(o.title) + '</title>' : '') +
    iconNode.map(n => '<' + n[0] + attrs(n[1]) + '/>').join('') + '</svg>'
}

// ---------------------------------------------------------------- core emitter

export default async function emit(ctx) {
  const P = 'packages/core'
  const out = distWriter(ctx, P + '/dist')
  const W = (rel, text) => out.add(rel.slice(P.length + 6), text)
  const styleNames = ctx.styles.map(s => s.name)
  const meta = ctx.icons.map(i => ({
    name: i.name, category: i.category, description: i.description, aliases: i.aliases, tags: i.tags,
    styles: styleNames.filter(s => i.render[s]),
  }))
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const stylesMeta = ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root }))
  const categories = [...new Set(meta.map(m => m.category))]

  let svgCount = 0
  for (const s of styleNames) {
    const nodes = {}
    for (const i of ctx.icons) {
      const r = renderOf(ctx, i, s)
      if (i.render[s]) { W(`${P}/dist/svg/${s}/${i.name}.svg`, r.svg + '\n'); svgCount++ }
      if (i.render[s]) nodes[i.name] = r.nodes
    }
    const body = `const style = ${J(stylesMeta.find(x => x.name === s))}\nconst nodes = ${J(nodes)}\n`
    W(`${P}/dist/nodes/${s}.js`, `// @withicons/core — ${s} IconNode data\n${body}export { style, nodes }\nexport default nodes\n`)
    W(`${P}/dist/nodes/${s}.cjs`, `'use strict'\n${body}module.exports = nodes\nmodule.exports.default = nodes\nmodule.exports.nodes = nodes\nmodule.exports.style = style\n`)
    const dts = ext => `import type { IconName, IconNode, StyleMeta } from '../index.${ext}'\n/** ${s} style metadata */\nexport declare const style: StyleMeta\n/** IconNode data for every icon in the ${s} style, keyed by canonical name. */\nexport declare const nodes: Record<IconName, IconNode>\n`
    W(`${P}/dist/nodes/${s}.d.ts`, dts('js') + 'export default nodes\n')
    W(`${P}/dist/nodes/${s}.d.cts`, `import type { IconName, IconNode, StyleMeta } from '../index.cjs'\ntype Nodes = Record<IconName, IconNode>\n/** IconNode data for every icon in the ${s} style, keyed by canonical name. */\ndeclare const nodes: Nodes & { nodes: Nodes; style: StyleMeta; default: Nodes }\nexport = nodes\n`)
  }
  W(`${P}/dist/icons.json`, JSON.stringify(meta, null, 1) + '\n')
  W(`${P}/dist/aliases.json`, JSON.stringify(aliases, null, 1) + '\n')

  const body = `const VERSION = ${J(ctx.version)}
const DEFAULT_STYLE = ${J(ctx.defaultStyle)}
const styles = ${J(stylesMeta)}
const STYLES = ${J(styleTable(ctx))}
const icons = ${J(meta)}
const aliases = ${J(aliases)}
const categories = ${J(categories)}
const iconNames = icons.map(i => i.name)
const styleNames = styles.map(s => s.name)
const BY_NAME = Object.create(null)
for (const i of icons) BY_NAME[i.name] = i
${LOOKUP_SRC}
${withScore}
${withSearch}
${withToSvg}
/** Resolve a name or alias to its icon. Throws on ambiguous aliases and unknown names. */
function resolve(name) { return BY_NAME[withLookup(name, k => k in BY_NAME, iconNames, aliases)] }
/** Like resolve() but returns null instead of throwing. */
function find(name) { try { return resolve(name) } catch (e) { return null } }
/** Rank icons by name, alias, tag, category and description. */
function search(query, options) { return withSearch(icons, query, options) }
/** Nearest canonical names by edit distance. */
function suggest(name, count) { return withNearest(name, iconNames, aliases, count || 3) }
/** Render an IconNode (from @withicons/core/nodes/<style>) to an SVG string. */
function toSvg(iconNode, style, options) { return withToSvg(iconNode, style, options) }
`
  const names = 'VERSION as version, DEFAULT_STYLE as defaultStyle, styles, styleNames, icons, iconNames, aliases, categories, resolve, find, search, suggest, toSvg'
  W(`${P}/dist/index.js`, `// @withicons/core ${ctx.version}\n${body}export { ${names} }\n`)
  W(`${P}/dist/index.cjs`, `'use strict'\n// @withicons/core ${ctx.version}\n${body}` +
    names.split(', ').map(n => { const [a, b] = n.split(' as '); return `exports.${b || a} = ${a}` }).join('\n') + '\n')

  const dts = `${namesAndAliasesDts(ctx)}
export interface StyleMeta {
  name: StyleName
  title: string
  kind: 'universal' | 'creative'
  description: string
  /** Default stroke width when the style has live strokes, else false. */
  strokeWidth: number | false
  /** Attributes set on the root <svg>. */
  root: Record<string, string | number>
}
export interface IconMeta {
  name: IconName
  category: string
  description: string
  aliases: string[]
  tags: string[]
  styles: StyleName[]
}
export interface SearchOptions { limit?: number; category?: string }
export interface ToSvgOptions {
  size?: number | string
  color?: string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  title?: string
  class?: string
}
/** Error thrown by resolve(): code 'WITH_AMBIGUOUS_ICON' (see candidates) or 'WITH_UNKNOWN_ICON' (see suggestions). */
export interface IconResolveError extends Error {
  code: 'WITH_AMBIGUOUS_ICON' | 'WITH_UNKNOWN_ICON'
  candidates?: IconName[]
  suggestions?: IconName[]
}
export declare const version: string
export declare const defaultStyle: 'line'
export declare const styles: StyleMeta[]
export declare const styleNames: StyleName[]
export declare const icons: IconMeta[]
export declare const iconNames: IconName[]
/** alias -> canonical names (more than one name means the alias is ambiguous) */
export declare const aliases: Record<string, IconName[]>
export declare const categories: string[]
/**
 * Resolve a canonical name, PascalCase name or alias to its icon.
 * resolve('bin').name === 'trash'. Throws IconResolveError for ambiguous aliases and unknown names.
 */
export declare function resolve(name: IconName | IconAlias | (string & {})): IconMeta
/** Like resolve() but returns null instead of throwing. */
export declare function find(name: string): IconMeta | null
/** Icons ranked by name, alias, tag, category and description matches. */
export declare function search(query: string, options?: SearchOptions): IconMeta[]
/** The nearest canonical names by edit distance. */
export declare function suggest(name: string, count?: number): IconName[]
/** Render IconNode data to an SVG string. */
export declare function toSvg(iconNode: IconNode, style?: StyleName, options?: ToSvgOptions): string
`
  W(`${P}/dist/index.d.ts`, dts)
  W(`${P}/dist/index.d.cts`, dts)

  const ex = { '.': dual('dist/index') }
  for (const s of styleNames) ex[`./nodes/${s}`] = dual(`dist/nodes/${s}`)
  ex['./svg/*'] = './dist/svg/*'
  ex['./icons.json'] = './dist/icons.json'
  ex['./aliases.json'] = './dist/aliases.json'
  ex['./dist/*'] = './dist/*'
  ex['./package.json'] = './package.json'
  const tv = {}
  for (const s of styleNames) tv[`nodes/${s}`] = [`./dist/nodes/${s}.d.ts`]
  const pkg = {
    ...basePkg(ctx, '@withicons/core', `${ctx.icons.length} icons x ${styleNames.length} styles as standalone SVGs, IconNode data, metadata, alias resolution and search.`, ['svg-icons', 'icon-search']),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
  }
  await out.flush()
  writePkg(ctx, 'core', pkg, coreReadme(ctx))
  return `${svgCount} svgs, ${meta.length} icons, ${Object.keys(aliases).length} aliases, nodes for ${styleNames.length} styles`
}

function coreReadme(ctx) {
  const styles = ctx.styles.map(s => '`' + s.name + '`').join(', ')
  return `# @withicons/core

Framework-free data for with icons: ${ctx.icons.length} icons in ${ctx.styles.length} styles (${styles}) as standalone SVG files, IconNode data, metadata, alias resolution and search.

\`\`\`bash
npm i @withicons/core
\`\`\`

\`\`\`js
import { resolve, search, toSvg, icons } from '@withicons/core'
import solid from '@withicons/core/nodes/solid'

resolve('trash').name        // 'trash'   (canonical name)
resolve('bin').name          // 'trash'   (alias with one match)
resolve('ArrowRight').name   // 'arrow-right'
resolve('expand')            // throws: ambiguous alias, err.candidates = ['chevron-down', ...]
resolve('hoem')              // throws: unknown icon, err.suggestions = ['home', ...]

search('delete')             // ranked IconMeta[] (name, alias, tag, category, description)
toSvg(solid.home, 'solid', { size: 32, color: '#e11d48', title: 'Home' })  // '<svg ...>'
\`\`\`

## Files

| path | contents |
|---|---|
| \`dist/svg/<style>/<name>.svg\` | optimized standalone SVG (\`currentColor\`, 24x24) |
| \`dist/icons.json\` | \`[{ name, category, description, aliases, tags, styles }]\` |
| \`dist/aliases.json\` | \`{ alias: [canonical names] }\` (more than one name = ambiguous) |
| \`dist/nodes/<style>.js\` | \`{ [name]: IconNode }\` where IconNode = \`[tag, attrs][]\` |

Import a file: \`import url from '@withicons/core/svg/solid/home.svg'\`.
CDN: \`https://cdn.jsdelivr.net/npm/@withicons/core@${ctx.version}/dist/svg/line/home.svg\`

## API

| export | description |
|---|---|
| \`resolve(name)\` | canonical name, PascalCase or alias -> \`IconMeta\`. Throws \`code: 'WITH_AMBIGUOUS_ICON'\` (\`candidates\`) or \`'WITH_UNKNOWN_ICON'\` (\`suggestions\`, 3 nearest) |
| \`find(name)\` | like \`resolve\`, returns \`null\` instead of throwing |
| \`search(query, { limit, category })\` | ranked \`IconMeta[]\` |
| \`suggest(name, count = 3)\` | nearest canonical names |
| \`toSvg(iconNode, style, { size, color, strokeWidth, absoluteStrokeWidth, title, class })\` | SVG string |
| \`icons\`, \`iconNames\`, \`styles\`, \`styleNames\`, \`aliases\`, \`categories\` | metadata |

## Styles

${ctx.styles.map(s => `- \`${s.name}\` (${s.kind}) — ${s.description}`).join('\n')}

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}

// ---------------------------------------------------------------- component packages (react, vue, ...)
// Shared dist layout for framework packages. The framework supplies its runtime as source strings.
//   dist/types.d.ts|.d.cts        IconName, IconAlias, StyleName, IconNode + framework types
//   dist/base.{js,cjs,d.ts}       createWithIcon(name, style, displayName, iconNode)
//   dist/meta.{js,cjs}            iconNames, styleNames, aliases
//   dist/<style>/icons/<name>.{js,d.ts}   one component per icon per style (ESM)
//   dist/<style>/index.{js,cjs,d.ts,d.cts}
//   dist/icon.{js,d.ts}           generic <Icon name variant> (loads every style)
//   dist/index.{js,cjs,d.ts,d.cts} default style + Icon + createWithIcon + iconNames/styleNames
//
// spec: { dir, importEsm, importCjs, mapAttrs, baseSrc, iconSrc, typesDts, iconType }
//   baseSrc defines function createWithIcon (free vars: STYLES, DEFAULT_STYLE)
//   iconSrc defines const Icon (free vars: withFindComponent)
function withPascal(n) { return n.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') }
function withFindComponent(name, variant) {
  let v = variant || DEFAULT_STYLE
  let set = getSet(v)
  if (!set) {
    withWarn('with icons: unknown variant "' + v + '". Use one of: ' + styleNames.join(', ') + '. Falling back to "' + DEFAULT_STYLE + '".')
    set = getSet(DEFAULT_STYLE)
  }
  let canonical
  try { canonical = withLookup(name, k => ICON_SET.has(k), iconNames, aliases) } catch (e) { withWarn(e.message); return null }
  return set[withPascal(canonical)] || null
}
const WITH_WARNED = {}
function withWarn(msg) { if (!WITH_WARNED[msg] && typeof console !== 'undefined') { WITH_WARNED[msg] = 1; console.warn(msg) } }
const FIND_SRC = [LOOKUP_SRC, withPascal, withFindComponent, 'const WITH_WARNED = {}', withWarn].map(String).join('\n')

export async function emitComponentPackage(ctx, spec) {
  const P = `packages/${spec.dir}/dist`
  const out = distWriter(ctx, P)
  const W = (rel, text) => out.add(rel.slice(P.length + 1), text)
  const D = ctx.defaultStyle
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/${spec.dir} ${ctx.version} — generated, do not edit\n`
  const types = namesAndAliasesDts(ctx) + spec.typesDts
  W(`${P}/types.d.ts`, types)
  W(`${P}/types.d.cts`, types)

  const baseBody = `const DEFAULT_STYLE = ${J(D)}\nconst STYLES = ${J(styleTable(ctx, spec.mapAttrs))}\n${spec.baseSrc}\n`
  W(`${P}/base.js`, `${header}${spec.importEsm}\n${baseBody}export { createWithIcon, STYLES as styles }\n`)
  W(`${P}/base.cjs`, `'use strict'\n${header}${spec.importCjs}\n${baseBody}exports.createWithIcon = createWithIcon\nexports.styles = STYLES\n`)
  const baseDts = ext => `import type { WithIcon, IconNode, StyleName } from './types.${ext}'\n/** Build a component from IconNode data (use it for your own icons). */\nexport declare function createWithIcon(name: string, style: StyleName, displayName: string, iconNode: IconNode): WithIcon\nexport declare const styles: Record<StyleName, { root: Record<string, string | number>; strokeWidth: number | false }>\n`
  W(`${P}/base.d.ts`, baseDts('js'))
  W(`${P}/base.d.cts`, baseDts('cjs'))

  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const metaBody = `const iconNames = ${J(ctx.icons.map(i => i.name))}\nconst styleNames = ${J(styleNames)}\nconst aliases = ${J(aliases)}\n`
  W(`${P}/meta.js`, `${header}${metaBody}export { iconNames, styleNames, aliases }\n`)
  W(`${P}/meta.cjs`, `'use strict'\n${metaBody}exports.iconNames = iconNames\nexports.styleNames = styleNames\nexports.aliases = aliases\n`)
  const metaDts = ext => `import type { IconName, StyleName } from './types.${ext}'\nexport declare const iconNames: IconName[]\nexport declare const styleNames: StyleName[]\n/** alias -> canonical names (more than one = ambiguous) */\nexport declare const aliases: Record<string, IconName[]>\n`
  W(`${P}/meta.d.ts`, metaDts('js'))
  W(`${P}/meta.d.cts`, metaDts('cjs'))

  let files = 0
  for (const s of styleNames) {
    const idx = [], idxDts = [], cjs = [], cjsExp = []
    for (const i of ctx.icons) {
      const r = renderOf(ctx, i, s)
      const nodes = J(r.nodes.map(([t, a]) => [t, spec.mapAttrs(a)]))
      const call = `createWithIcon(${J(i.name)}, ${J(r.style)}, ${J(i.pascal)}, ${nodes})`
      W(`${P}/${s}/icons/${i.name}.js`, `import { createWithIcon } from '../../base.js'\nconst ${i.pascal} = /*#__PURE__*/ ${call}\nexport { ${i.pascal}, ${i.pascal} as ${i.pascal}Icon }\nexport default ${i.pascal}\n`)
      W(`${P}/${s}/icons/${i.name}.d.ts`, `import type { WithIcon } from '../../types.js'\n/** ${i.name} (${s}) — ${i.description.replace(/\*\//g, '')} */\ndeclare const ${i.pascal}: WithIcon\nexport { ${i.pascal}, ${i.pascal} as ${i.pascal}Icon }\nexport default ${i.pascal}\n`)
      files += 2
      idx.push(`export { ${i.pascal}, ${i.pascal}Icon } from './icons/${i.name}.js'`)
      idxDts.push(`/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${i.pascal}: WithIcon\nexport declare const ${i.pascal}Icon: WithIcon`)
      cjs.push(`const ${i.pascal} = ${call}`)
      cjsExp.push(`exports.${i.pascal} = ${i.pascal}\nexports.${i.pascal}Icon = ${i.pascal}`)
    }
    W(`${P}/${s}/index.js`, `${header}${idx.join('\n')}\n`)
    W(`${P}/${s}/index.d.ts`, `import type { WithIcon } from '../types.js'\n${idxDts.join('\n')}\n`)
    W(`${P}/${s}/index.cjs`, `'use strict'\n${header}const { createWithIcon } = require('../base.cjs')\n${cjs.join('\n')}\n${cjsExp.join('\n')}\n`)
    W(`${P}/${s}/index.d.cts`, `import type { WithIcon } from '../types.cjs'\n${idxDts.join('\n')}\n`)
  }

  const findHead = `const DEFAULT_STYLE = ${J(D)}\nconst ICON_SET = new Set(iconNames)\n${FIND_SRC}\n`
  W(`${P}/icon.js`, `${header}${spec.importEsm}\n` +
    styleNames.map(s => `import * as ${'with_' + s} from './${s}/index.js'`).join('\n') +
    `\nimport { iconNames, styleNames, aliases } from './meta.js'\nconst SETS = { ${styleNames.map(s => `${J(s)}: with_${s}`).join(', ')} }\nconst getSet = v => Object.prototype.hasOwnProperty.call(SETS, v) ? SETS[v] : undefined\n${findHead}${spec.iconSrc}\nexport { Icon }\nexport default Icon\n`)
  const iconDts = ext => `import type { IconProps } from './types.${ext}'\n${spec.iconTypeImport(ext)}\n/**\n * Generic icon: <Icon name="home" variant="solid" />. Accepts canonical names and unambiguous aliases.\n * Bundle cost: imports every icon in every style (${ctx.icons.length} x ${styleNames.length}); prefer named imports.\n */\nexport declare const Icon: ${spec.iconType}\n`
  W(`${P}/icon.d.ts`, iconDts('js') + 'export default Icon\n')

  const idxEsm = `${header}export * from './${D}/index.js'\nexport { Icon } from './icon.js'\nexport { createWithIcon } from './base.js'\nexport { iconNames, styleNames } from './meta.js'\n`
  W(`${P}/index.js`, idxEsm)
  const idxDts = ext => `export * from './${D}/index.${ext}'\nexport { createWithIcon } from './base.${ext}'\nexport { iconNames, styleNames } from './meta.${ext}'\nexport type { IconName, IconAlias, StyleName, IconNode, ${spec.typeNames.join(', ')} } from './types.${ext}'\n`
  W(`${P}/index.d.ts`, idxDts('js') + `export { Icon } from './icon.js'\n`)
  W(`${P}/index.d.cts`, idxDts('cjs') + iconDts('cjs'))
  W(`${P}/index.cjs`, `'use strict'\n${header}${spec.importCjs}\nconst { createWithIcon } = require('./base.cjs')\nconst { iconNames, styleNames, aliases } = require('./meta.cjs')\n` +
    `const LOAD = { ${styleNames.map(s => `${J(s)}: () => require('./${s}/index.cjs')`).join(', ')} }\nconst SETS = {}\n` +
    `const getSet = v => SETS[v] || (Object.prototype.hasOwnProperty.call(LOAD, v) ? (SETS[v] = LOAD[v]()) : undefined)\n${findHead}${spec.iconSrc}\n` +
    `const def = getSet(DEFAULT_STYLE)\nfor (const k in def) exports[k] = def[k]\nexports.Icon = Icon\nexports.createWithIcon = createWithIcon\nexports.iconNames = iconNames\nexports.styleNames = styleNames\n`)
  await out.flush()
  return files
}
