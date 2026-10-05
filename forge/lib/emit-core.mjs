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
import { resolveVars } from './load.mjs'

export const J = v => JSON.stringify(v)
export const SVG_NS = 'http://www.w3.org/2000/svg'

// ---------------------------------------------------------------- styles: order, palettes, counts
// The ONE style order used everywhere (build, packages, search index, site data). Unknown styles sort last, by name.
export const STYLE_ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
// Styles that paint a default multi-colour palette: every colour is var(--with-<style>-<role>, #hex), the ink stays currentColor.
export const PALETTE_STYLES = ['glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
export const styleRank = name => { const i = STYLE_ORDER.indexOf(name); return i < 0 ? STYLE_ORDER.length : i }
export const sortStyles = (list, key = s => s.name) =>
  list.slice().sort((a, b) => styleRank(key(a)) - styleRank(key(b)) || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0))
// var(--x, #hex) -> #hex, var(--x, currentColor) -> currentColor: for standalone files, data URIs and rasterizers (no CSS cascade there)
export const flattenVars = s => resolveVars(String(s))

// The CSS custom properties a style reads, with their default (fallback) values, found in its rendered output:
// { '--with-retro-1': '#F4B53F', '--with-duo': 'currentColor' }. The most frequent fallback wins per variable.
const VAR_RE = /var\(\s*(--with-[\w-]+)\s*,\s*(#[0-9a-fA-F]{3,8}|currentColor|[a-zA-Z]+)\s*\)/g
export function styleVars(icons, styleName) {
  const seen = {}
  for (const i of icons) {
    const r = i.render && i.render[styleName]
    if (!r) continue
    for (const m of r.inner.matchAll(VAR_RE)) { const c = (seen[m[1]] ||= {}); c[m[2]] = (c[m[2]] || 0) + 1 }
  }
  const out = {}
  for (const k of Object.keys(seen).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
    out[k] = Object.entries(seen[k]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0]
  }
  return out
}
export const isPalette = (style, vars) => PALETTE_STYLES.includes(style.name) || Object.values(vars || style.vars || {}).some(v => v !== 'currentColor')

// "500 icons x 12 styles" and "6,000" — never hard-code the counts in generated text
export const countText = ctx => `${ctx.icons.length} icons x ${ctx.styles.length} styles`
export const totalText = ctx => (ctx.icons.length * ctx.styles.length).toLocaleString('en-US')
export const liveStrokeStyles = ctx => ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name)
export const paletteStyles = ctx => ctx.styles.filter(s => s.palette)

// Collects files for one dist directory, then writes them in parallel and deletes stale files
// (icons that were renamed or removed) so deep imports never serve outdated output.
// keep: top-level subdirectories another emitter owns (e.g. 'palettes', written by emit-palettes), never pruned here
export function distWriter(ctx, distRel, { keep = [] } = {}) {
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
      const kept = keep.map(k => path.join(root, k) + path.sep)
      const stale = walk(root).filter(f => !want.has(f) && !kept.some(k => f.startsWith(k)))
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

// first year of publication (deterministic build: never the clock)
export const FIRST_YEAR = 2026
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
  ctx.write(`packages/${dir}/LICENSE`, LICENSE(FIRST_YEAR))   // fixed year: output must not depend on the clock
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
  let out = '<svg' + attrs(a) + '>' + (o.title ? '<title>' + esc(o.title) + '</title>' : '') +
    iconNode.map(n => '<' + n[0] + attrs(n[1]) + '/>').join('') + '</svg>'
  // flat: CSS variables -> their default colours (for files, <img>, design tools and rasterizers)
  if (o.flat) { let p; do { p = out; out = out.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (out !== p) }
  return out
}

// ---------------------------------------------------------------- core emitter

export default async function emit(ctx) {
  const P = 'packages/core'
  const out = distWriter(ctx, P + '/dist', { keep: ['palettes'] })   // dist/palettes/** belongs to emit-palettes
  const W = (rel, text) => out.add(rel.slice(P.length + 6), text)
  const styleNames = ctx.styles.map(s => s.name)
  const meta = ctx.icons.map(i => ({
    name: i.name, category: i.category, description: i.description, aliases: i.aliases, tags: i.tags,
    styles: styleNames.filter(s => i.render[s]),
  }))
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const stylesMeta = ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: !!s.palette, vars: s.vars || {} }))
  const categories = [...new Set(meta.map(m => m.category))]

  let svgCount = 0
  for (const s of styleNames) {
    const nodes = {}
    for (const i of ctx.icons) {
      const r = renderOf(ctx, i, s)
      // standalone files are flattened (no CSS variables): <img>, design tools and rasterizers cannot see the cascade
      if (i.render[s]) { W(`${P}/dist/svg/${s}/${i.name}.svg`, flattenVars(r.svg) + '\n'); svgCount++ }
      if (i.render[s]) nodes[i.name] = r.nodes
    }
    // ESM: one named export per icon (PascalCase, like the component packages) so a bundler keeps only the icons you
    // import: `import { Home } from '@withicons/core/nodes/line'` is ~1 KB. `nodes` / default (keyed by canonical name)
    // reference the same constants, so they cost nothing when unused.
    const list = ctx.icons.filter(i => nodes[i.name])
    const consts = list.map(i => `const ${i.pascal} = ${J(nodes[i.name])}`).join('\n')
    const map = `{ ${list.map(i => `${J(i.name)}: ${i.pascal}`).join(', ')} }`
    const styleJson = J(stylesMeta.find(x => x.name === s))
    W(`${P}/dist/nodes/${s}.js`, `// @withicons/core ${ctx.version} — ${s} IconNode data\nconst style = ${styleJson}\n${consts}\n` +
      `/** every ${s} icon, keyed by canonical name */\nconst nodes = ${map}\n` +
      `export { style, nodes, ${list.map(i => i.pascal).join(', ')} }\nexport default nodes\n`)
    // CJS: the canonical-name map is module.exports; style, nodes, default and the PascalCase names are non-enumerable,
    // so Object.keys(require('@withicons/core/nodes/line')) is exactly the icon names.
    const pascalMap = J(Object.fromEntries(list.map(i => [i.name, i.pascal])))
    W(`${P}/dist/nodes/${s}.cjs`, `'use strict'\n// @withicons/core ${ctx.version} — ${s} IconNode data\nconst style = ${styleJson}\nconst nodes = ${J(nodes)}\n` +
      `const PASCAL = ${pascalMap}\nconst hide = (k, v) => Object.defineProperty(nodes, k, { value: v, enumerable: false })\n` +
      `for (const k of Object.keys(nodes)) hide(PASCAL[k], nodes[k])\nhide('style', style)\nhide('nodes', nodes)\nhide('default', nodes)\nhide('__esModule', true)\nmodule.exports = nodes\n`)
    const named = list.map(i => `/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${i.pascal}: IconNode`).join('\n')
    const dts = ext => `import type { IconName, IconNode, StyleMeta } from '../index.${ext}'\n/** ${s} style metadata */\nexport declare const style: StyleMeta\n/** IconNode data for every icon in the ${s} style, keyed by canonical name. Prefer the named exports to keep bundles small. */\nexport declare const nodes: Record<IconName, IconNode>\n${named}\n`
    W(`${P}/dist/nodes/${s}.d.ts`, dts('js') + 'export default nodes\n')
    W(`${P}/dist/nodes/${s}.d.cts`, `import type { IconName, IconNode, StyleMeta } from '../index.cjs'\ntype Nodes = Record<IconName, IconNode>\n` +
      `type Named = { ${list.map(i => `${i.pascal}: IconNode`).join('; ')} }\n` +
      `/** IconNode data for every icon in the ${s} style, keyed by canonical name (and by PascalCase name). */\ndeclare const nodes: Nodes & Named & { nodes: Nodes; style: StyleMeta; default: Nodes }\nexport = nodes\n`)
  }
  W(`${P}/dist/icons.json`, JSON.stringify(meta, null, 1) + '\n')
  W(`${P}/dist/aliases.json`, JSON.stringify(aliases, null, 1) + '\n')
  W(`${P}/dist/styles.json`, JSON.stringify(stylesMeta, null, 1) + '\n')

  const body = `const VERSION = ${J(ctx.version)}
const DEFAULT_STYLE = ${J(ctx.defaultStyle)}
const styles = ${J(stylesMeta)}
const STYLES = ${J(styleTable(ctx))}
const icons = ${J(meta)}
const aliases = ${J(aliases)}
const categories = ${J(categories)}
// pure + lazy: a bundle that only imports toSvg drops the metadata
const iconNames = /*#__PURE__*/ icons.map(i => i.name)
const styleNames = /*#__PURE__*/ styles.map(s => s.name)
let BY_NAME = null
function byName() {
  if (!BY_NAME) { BY_NAME = Object.create(null); for (const i of icons) BY_NAME[i.name] = i }
  return BY_NAME
}
${LOOKUP_SRC}
${withScore}
${withSearch}
${withToSvg}
/** Resolve a name or alias to its icon. Throws on ambiguous aliases and unknown names. */
function resolve(name) { const m = byName(); return m[withLookup(name, k => k in m, iconNames, aliases)] }
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
  /** true for multi-colour palette styles (${ctx.styles.filter(s => s.palette).map(s => s.name).join(', ') || 'none'}): colours come from CSS variables, the ink stays currentColor. */
  palette: boolean
  /** CSS custom properties this style reads, with their defaults, e.g. { '--with-duo': 'currentColor' }. */
  vars: Record<string, string>
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
/** A colour role of a palette (see @withicons/core/palettes/palette-map.js and the README, "Colour palettes"). */
export type PaletteRole = 'ink' | 'c1' | 'c2' | 'c3' | 'c4' | 'tint' | 'accent' | 'shadow' | 'shine' | 'edge'
/** One suggested palette, as in @withicons/core/palettes/<name>.json. */
export interface Palette { id: string; name: string; tags: string[]; colors: Partial<Record<PaletteRole, string>> }
/** @withicons/core/palettes/<name>.json: the palettes picked for that icon (auto: true = the general fallback set). */
export interface IconPalettes { name: IconName; auto: boolean; palettes: Palette[] }
export interface ToSvgOptions {
  size?: number | string
  color?: string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  title?: string
  class?: string
  /** Replace CSS variables (palette colours, --with-duo, --with-accent) with their default values. For files, <img> and rasterizers. */
  flat?: boolean
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
  ex['./styles.json'] = './dist/styles.json'
  // exact keys win over the pattern: palette-map ships as .mjs/.cjs (see emit-palettes) but keeps its documented .js path
  ex['./palettes/palette-map'] = ex['./palettes/palette-map.js'] = { types: './dist/palettes/palette-map.d.ts', import: './dist/palettes/palette-map.mjs', require: './dist/palettes/palette-map.cjs' }
  ex['./palettes/*'] = './dist/palettes/*'
  ex['./dist/*'] = './dist/*'
  ex['./package.json'] = './package.json'
  const tv = {}
  for (const s of styleNames) tv[`nodes/${s}`] = [`./dist/nodes/${s}.d.ts`]
  tv['palettes/*'] = ['./dist/palettes/*']   // TypeScript without "exports" support (moduleResolution node10)
  const pkg = {
    ...basePkg(ctx, '@withicons/core', `${countText(ctx)} as standalone SVGs, IconNode data, metadata, colour palettes, alias resolution and search.`, ['svg-icons', 'icon-search', 'multicolor-icons', 'color-palettes', ...styleNames]),
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

Framework-free data for with icons: ${ctx.icons.length} icons in ${ctx.styles.length} styles (${styles}), ${totalText(ctx)} SVGs in all, as standalone SVG files, IconNode data, metadata, alias resolution and search.

\`\`\`bash
npm i @withicons/core
\`\`\`

\`\`\`js
import { resolve, search, toSvg } from '@withicons/core'
import { Home } from '@withicons/core/nodes/solid'       // one icon: only it ends up in your bundle
${ctx.styles.some(s => s.name === 'kawaii') ? "import kawaii from '@withicons/core/nodes/kawaii'        // every kawaii icon, keyed by canonical name\n" : ''}
resolve('trash').name        // 'trash'   (canonical name)
resolve('bin').name          // 'trash'   (alias with one match)
resolve('ArrowRight').name   // 'arrow-right'
resolve('expand')            // throws: ambiguous alias, err.candidates = ['chevron-down', ...]
resolve('hoem')              // throws: unknown icon, err.suggestions = ['home', ...]

search('delete')             // ranked IconMeta[] (name, alias, tag, category, description)
toSvg(Home, 'solid', { size: 32, color: '#e11d48', title: 'Home' })  // '<svg ...>'
${ctx.styles.some(s => s.name === 'kawaii') ? "toSvg(kawaii[resolve('bin').name], 'kawaii', { flat: true })  // palette defaults baked in, for files and rasterizers\n" : ''}\`\`\`

## Files

| path | contents |
|---|---|
| \`dist/svg/<style>/<name>.svg\` | optimized standalone SVG (\`currentColor\`, 24x24; CSS variables flattened to their defaults) |
| \`dist/icons.json\` | \`[{ name, category, description, aliases, tags, styles }]\` |
| \`dist/aliases.json\` | \`{ alias: [canonical names] }\` (more than one name = ambiguous) |
| \`dist/styles.json\` | \`[{ name, title, kind, description, strokeWidth, root, palette, vars }]\` |
| \`dist/nodes/<style>.js\` | IconNode data (\`[tag, attrs][]\`, keeps the CSS variables): one tree-shakable named export per icon (\`Home\`, \`ArrowRight\`) plus \`nodes\` / default \`{ [name]: IconNode }\` |
| \`dist/palettes/<name>.json\` | \`{ name, auto, palettes: [{ id, name, tags, colors }] }\`: colour palettes picked for that icon (see below) |
| \`dist/palettes/index.json\` | \`{ roles, roleLabels, tags, icons: { [name]: { count, auto, tags } } }\` |
| \`dist/palettes/palette-map.mjs\` (import it as \`@withicons/core/palettes/palette-map.js\`) | \`rolesFor\`, \`applyPalette\`, \`bakePalette\` (also \`palette-map.cjs\` and \`palette-map.d.ts\`) |

Import a file: \`import url from '@withicons/core/svg/solid/home.svg'\`.
CDN: \`https://cdn.jsdelivr.net/npm/@withicons/core@${ctx.version}/dist/svg/line/home.svg\`

## API

| export | description |
|---|---|
| \`resolve(name)\` | canonical name, PascalCase or alias -> \`IconMeta\`. Throws \`code: 'WITH_AMBIGUOUS_ICON'\` (\`candidates\`) or \`'WITH_UNKNOWN_ICON'\` (\`suggestions\`, 3 nearest) |
| \`find(name)\` | like \`resolve\`, returns \`null\` instead of throwing |
| \`search(query, { limit, category })\` | ranked \`IconMeta[]\` |
| \`suggest(name, count = 3)\` | nearest canonical names |
| \`toSvg(iconNode, style, { size, color, strokeWidth, absoluteStrokeWidth, title, class, flat })\` | SVG string (\`flat\`: CSS variables -> default colours) |
| \`icons\`, \`iconNames\`, \`styles\`, \`styleNames\`, \`aliases\`, \`categories\` | metadata |

## Styles

${ctx.styles.map(s => `- \`${s.name}\` (${s.kind}${s.palette ? ', palette' : ''}) — ${s.description}`).join('\n')}
${paletteDoc(ctx)}${palettesDoc(ctx)}${rtlDoc('js', "import { ArrowRight } from '@withicons/core/nodes/line'\ntoSvg(ArrowRight, 'line', { class: 'with-rtl' })")}${motionDoc(ctx)}
MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}

// @withicons/core README: the per-icon palette suggestions written by emit-palettes (dist/palettes/**).
function palettesDoc(ctx) {
  const t = '`', fence = '```'
  const multi = ctx.styles.filter(s => Object.keys(s.vars || {}).length).map(s => t + s.name + t).join(', ')
  return [
    '',
    '## Colour palettes',
    '',
    'Every icon ships 20-30 colour palettes picked for it (pizza: Margherita, Pepperoni…; heart: Classic red, Rose…), for the',
    `styles that paint with more than one colour (${multi}). A palette sets colour **roles**; each style maps the roles onto its`,
    'own CSS variables, so one palette works in every style:',
    '',
    '| role | paints |',
    '|---|---|',
    `| ${t}ink${t} | outlines and faces (${t}color${t} / ${t}currentColor${t}) |`,
    `| ${t}c1${t} | the main body colour (duo tint, glass back, kawaii body, sticker 1st colour, pixel fill, retro 1st stripe, luxe / bauhaus / skeuo / anime / gothic / pastel / coquette / plush main surface) |`,
    `| ${t}c2${t} ${t}c3${t} ${t}c4${t} | 2nd-4th colours in order of appearance (sticker, kawaii, retro stripes) or by name (${t}--with-luxe-c2${t}, ${t}--with-bauhaus-c3${t}) |`,
    `| ${t}tint${t} · ${t}accent${t} · ${t}shadow${t} · ${t}shine${t} · ${t}edge${t} | glass pane · blush, sparkles, gold trim · drop shadows and depth · highlights · borders and bevels |`,
    '',
    fence + 'js',
    "import pizza from '@withicons/core/palettes/pizza.json' with { type: 'json' }",
    "import { applyPalette, bakePalette } from '@withicons/core/palettes/palette-map.js'",
    "import retro from '@withicons/core/nodes/retro'",
    "import { toSvg } from '@withicons/core'",
    '',
    "const svg = toSvg(retro.pizza, 'retro')",
    'const colors = pizza.palettes[0].colors   // { ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge }',
    "applyPalette(svg, colors)   // { vars: { '--with-retro-1': '#F4B942', … }, color: '#3B1F12' }: set them as inline CSS",
    'bakePalette(svg, colors)    // the same SVG with the colours written in, for files, design tools and rasterizers',
    fence,
    '',
    `${t}dist/palettes/index.json${t} lists every icon with its palette count and tags (${t}auto: true${t} marks the general fallback set).`,
    '',
  ].join('\n')
}

// Markdown shared by every package README: how palette styles take colour, with the real variable list.
export function paletteDoc(ctx, heading = '##') {
  const pal = ctx.styles.filter(s => s.palette)
  if (!pal.length) return ''
  const vars = s => Object.entries(s.vars || {}).filter(([, v]) => v !== 'currentColor')
  // styles whose outline is its own fixed-colour variable (sticker's dark ink), not currentColor
  const inked = pal.map(s => [s, vars(s).map(([k]) => k).find(k => /-ink$/.test(k))]).filter(([, k]) => k)
  // every variable, including those that default to currentColor (kawaii face, pixel fill): they can be set too
  const rows = pal.map(s => `| \`${s.name}\` | ${Object.entries(s.vars || {}).map(([k, v]) => `\`${k}\` ${v}`).join(', ') || '—'} |`).join('\n')
  // example: a main body colour of two palette styles (kawaii and retro when present)
  const main = s => vars(s).find(([k]) => !/(accent|shine|edge|shadow|frost|etch|sparkle|blush|ink)$/.test(k)) || vars(s)[0]
  const pick = [...pal.filter(s => s.name === 'kawaii' || s.name === 'retro'), ...pal].filter((s, i, a) => a.indexOf(s) === i)
  const ex = pick.map(main).filter(Boolean).slice(0, 2).map(([k], i) => `${k}: ${['#c4b5fd', '#fde047'][i]};`).join(' ')
  return `
${heading} Palette styles

${pal.map(s => '`' + s.name + '`').join(', ')} paint a default multi-colour palette. The main ink stays \`currentColor\`
(so \`color\` still recolours the outline${inked.length ? `; ${inked.map(([s, k]) => `\`${s.name}\` draws its bold outline with \`${k}\` instead`).join(', ')}` : ''}) and every other colour is a CSS custom property with a built-in default,
so you can re-theme a page, a section or one icon without touching the SVG${ex ? `:

\`\`\`css
.brand { ${ex} }
\`\`\`` : '.'}

| style | variables (default) |
|---|---|
${rows}

Inline SVG (components, \`<with-icon>\`, sprites, IconNode data) keeps the variables. Standalone \`.svg\` files have them
flattened to the defaults, because \`<img>\`, design tools and rasterizers cannot see CSS.
`
}

// Markdown for the string/file packages (core, static): mirroring directional icons in right-to-left text.
// `example` is code (in `lang`) that puts the class on an icon. :dir() is Baseline only since Dec 2023 (Safari 16.4),
// so [dir=rtl] is a separate rule (a selector list with :dir() would be dropped whole by older iOS).
export function rtlDoc(lang, example, heading = '##') {
  return `
${heading} Right-to-left

Icons are drawn for left-to-right text. In Arabic, Hebrew, Persian or Urdu layouts, mirror the directional ones (arrows,
chevrons, undo/redo, reply, send, log-in/out) with a class; symmetric icons and logos stay as they are:

\`\`\`css
[dir="rtl"] .with-rtl { transform: scaleX(-1); }   /* every browser */
.with-rtl:dir(rtl) { transform: scaleX(-1); }      /* also follows inherited direction (Chrome 120+, Safari 16.4+, Firefox) */
\`\`\`

\`\`\`${lang}
${example}
\`\`\`
`
}

// Markdown shared by every package README: the separate, optional animation package.
export function motionDoc(ctx, heading = '##') {
  return `
${heading} Animation (optional)

Animations ship separately in [\`@withicons/motion\`](https://www.npmjs.com/package/@withicons/motion), so icons never pay for them.
They work with every style and every package because they animate the element that holds the icon:

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@${ctx.version}/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@${ctx.version}/dist/icons/bell.css">

<span class="wm wm-loop" data-wm="bell"><!-- any bell icon --></span>          <!-- continuous -->
<button class="wm-trigger"><span class="wm wm-hover" data-wm="bell">…</span> Alerts</button>  <!-- on hover/focus -->
<span class="wm-swap wm-fx-flip"><svg class="wm-a">…play…</svg><svg class="wm-b">…pause…</svg></span>  <!-- icon to icon -->
\`\`\`

\`prefers-reduced-motion\` turns every animation off. JS API: \`import { motion, swap, motionFor } from '@withicons/motion'\`.
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
  const types = namesAndAliasesDts(ctx) + spec.typesDts.replace('(line, duo)', `(${liveStrokeStyles(ctx).join(', ')})`)
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
