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
import { groupOfStyle } from '../tools/style-groups.mjs'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import { resolveVars } from './load.mjs'

export const J = v => JSON.stringify(v)
export const SVG_NS = 'http://www.w3.org/2000/svg'

// ---------------------------------------------------------------- styles: order, palettes, counts
// The ONE style order used everywhere (build, packages, search index, site data). Unknown styles sort last, by name.
export const STYLE_ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush',
  'clay', 'bento', 'suite', 'dock', 'liquid', 'chrome', 'soft3d', 'brutal', 'utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine']
// Styles that paint a default multi-colour palette: every colour is var(--with-<style>-<role>, #hex), the ink stays currentColor.
export const PALETTE_STYLES = ['glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush', 'clay', 'bento', 'suite', 'dock', 'liquid', 'chrome', 'soft3d', 'brutal',
  'utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine']
// Rich styles (forge/CONTRACT.md "Rich styles") may draw gradients: one ['defs', {}, [gradients]] node whose ids
// (wg-<style>-<icon>-<n>) are referenced as url(#id). Every inline output makes those ids unique per rendered instance
// (withUniq below); standalone files keep the deterministic ids. Detection is by data (hasDefs); this list is for docs.
export const RICH_STYLES = ['glass', 'clay', 'bento', 'suite', 'dock', 'liquid', 'chrome', 'soft3d', 'brutal', 'utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine']
// Split packages (jsDelivr serves at most 150 MB per package). @withicons/core and @withicons/classes keep the 20
// older styles (glass included), so no import path or CDN URL of an older style changes. The run 12 styles live in
// companions with the SAME layout (dist/svg/<style>/<name>.svg, dist/nodes/<style>.js, dist/<style>/<name>.css):
//   STYLE_PACKAGE  the ONE style -> package map for styles with a package of their own (one or several styles each):
//                  core files in dist/, class files in dist/classes/
//   PLUS_STYLES    every other style after 'plush' in STYLE_ORDER: @withicons/core-plus and @withicons/classes-plus
// Every other package (react, vue, svelte, angular, solid, web, static, dynamic, mcp) holds every style.
export const STYLE_PACKAGE = {
  soft3d: 'soft3d',
  utsav: 'holiday', rangoli: 'holiday', halloween: 'holiday', christmas: 'holiday', lunar: 'holiday', valentine: 'holiday',
}
export const OWN_STYLES = Object.keys(STYLE_PACKAGE)
// the run 12 styles: everything after 'plush' in STYLE_ORDER (so the list follows STYLE_ORDER), own-package styles excepted
export const PLUS_STYLES = STYLE_ORDER.slice(STYLE_ORDER.indexOf('plush') + 1).filter(s => !OWN_STYLES.includes(s))
export const isPlusStyle = style => PLUS_STYLES.includes(style)
export const isOwnStyle = style => Object.prototype.hasOwnProperty.call(STYLE_PACKAGE, style)
/** true for a package name from STYLE_PACKAGE ('soft3d', 'holiday'): core files in dist/, class files in dist/classes/ */
export const isOwnPackage = pkg => Object.values(STYLE_PACKAGE).includes(pkg)
/** The npm package (without scope) that holds a style's files of a split package ('core' or 'classes'):
 *  cdnPkg('clay') -> 'core-plus', cdnPkg('soft3d', 'classes') -> 'soft3d', cdnPkg('line', 'classes') -> 'classes'. */
export const cdnPkg = (style, base = 'core') => !SPLIT_BASES.includes(base) ? base
  : (base === 'core' || base === 'classes') && isOwnStyle(style) ? STYLE_PACKAGE[style]
  : isPlusStyle(style) || isOwnStyle(style) ? base + '-plus' : base
// the packages that are split: core and classes (companions: -plus and the STYLE_PACKAGE packages), web and static
// (every newer style, own-package ones included, in web-plus / static-plus: one package each keeps them under the limit)
export const SPLIT_BASES = ['core', 'classes', 'web', 'static']
/** true when a style's files of a split package live outside it */
export const isAwayStyle = style => isPlusStyle(style) || isOwnStyle(style)
/** That package's folder for those files, relative to the package root: 'dist' or (own packages' classes) 'dist/classes'. */
export const cdnDir = (style, base = 'core') => base === 'classes' && isOwnStyle(style) ? 'dist/classes' : 'dist'
/** CDN base URL (no trailing slash) of a style's files: cdnBase('clay', 'classes') -> https://…/@withicons/classes-plus@latest/dist */
export const cdnBase = (style, base = 'core', version = 'latest') => `https://cdn.jsdelivr.net/npm/@withicons/${cdnPkg(style, base)}@${version}/${cdnDir(style, base)}`
/** CDN URL of a standalone SVG in the package that holds the style. */
export const cdnSvgUrl = (style, name, version = 'latest') => `${cdnBase(style, 'core', version)}/svg/${style}/${name}.svg`
/** The packages a split base package's styles go to: { 'core': [...], 'core-plus': [...], soft3d: ['soft3d'] } */
export const splitPackages = (styleNames, base = 'core') => {
  const out = {}
  for (const s of styleNames) (out[cdnPkg(s, base)] ||= []).push(s)
  return out
}
// true when an IconNode list carries nested children (a defs node with gradients)
export const hasDefs = nodes => Array.isArray(nodes) && nodes.some(n => Array.isArray(n[2]) && n[2].length)
// Deep-map the attributes of an IconNode list (children included): component packages rename attributes per framework.
export const mapNodes = (nodes, fn) => nodes.map(n => Array.isArray(n[2]) && n[2].length ? [n[0], fn(n[1]), mapNodes(n[2], fn)] : [n[0], fn(n[1])])
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

// ---------------------------------------------------------------- compact icon data (package size)
// IconNode lists written as JS source instead of JSON, for the packages that ship every style as code (react, vue,
// solid, svelte, angular): identifier keys unquoted, numbers without a leading zero, and every attribute value that
// repeats across one style (palette variables, class names, stroke attributes, paths drawn twice) declared ONCE as a
// const ($0, $1, ...). Same data at runtime, about a fifth smaller, and bundlers still keep only the icons imported
// (a const is side-effect free). nodePool(lists) -> { lit(nodes, used?), decl(only?, exported?), ids }
//   lit(nodes, used)   the literal; adds every pooled const it references to the Set `used` (per-icon files import them)
//   decl(only, exp)    'const $0 = "…"\n…' for all pooled values (or only the names in `only`); exp: 'export const'
const POOL_MIN = 4
// shared pools: values of at most SHARED_MAX chars that at least SHARED_USERS (or 1 in 50) icons use: colours, classes,
// stroke attributes, never one icon's path, so a style's values module stays a few KB
const SHARED_MAX = 80, SHARED_USERS = 3
const keyLit = k => /^[A-Za-z_$][\w$]*$/.test(k) && k !== '__proto__' ? k : J(k)
const numLit = v => { const s = J(v); return s.replace(/^(-?)0\./, '$1.') }
//   shared             per-icon files import the pool from one small values module: pool only short values that
//                      many lists use (SHARED_MAX, SHARED_USERS)
//   local(nodes, used) for a per-icon file: { decl, lit } with the values this one icon repeats (a path drawn twice) as
//                      file-local consts (_0, _1, ...) and the pool's values as imports (their names added to `used`)
export function nodePool(lists, { prefix = '$', shared = false, skip = null } = {}) {
  const count = new Map(), users = new Map(), last = new Map()   // users: how many lists use a value
  const visit = (nodes, li) => { for (const n of nodes) {
    for (const v of Object.values(n[1] || {})) if (typeof v === 'string' && v.length >= POOL_MIN) {
      count.set(v, (count.get(v) || 0) + 1)
      if (last.get(v) !== li) { last.set(v, li); users.set(v, (users.get(v) || 0) + 1) }
    }
    if (Array.isArray(n[2])) visit(n[2], li)
  } }
  lists.forEach((l, li) => visit(l, li))
  // biggest saving first (ties: by value), so the shortest names go to the values that repeat most: deterministic
  const cand = [...count].filter(([v, c]) => c > 1 && !(skip && skip.has(v)) && (!shared || (v.length <= SHARED_MAX && users.get(v) >= Math.max(SHARED_USERS, lists.length / 50)))).map(([v, c]) => [v, c, c * (J(v).length - 3) - J(v).length - 8])
    .filter(x => x[2] > 0).sort((a, b) => b[2] - a[2] || (a[0] < b[0] ? -1 : 1))
  const ids = new Map(cand.map(([v], i) => [v, prefix + i.toString(36)]))
  const val = (v, used, more) => {
    if (typeof v === 'string') {
      const id = ids.get(v)
      if (id) { if (used) used.add(id); return id }
      return (more && more.get(v)) || J(v)
    }
    return typeof v === 'number' ? numLit(v) : J(v)
  }
  const obj = (o, used, more) => '{' + Object.entries(o || {}).filter(([, v]) => v !== undefined).map(([k, v]) => keyLit(k) + ':' + val(v, used, more)).join(',') + '}'
  const lit = (nodes, used, more) => '[' + nodes.map(n => '[' + J(n[0]) + ',' + obj(n[1], used, more) + (Array.isArray(n[2]) ? ',' + lit(n[2], used, more) : '') + ']').join(',') + ']'
  const decl = (only, exp) => [...ids].filter(([, id]) => !only || only.has(id)).map(([v, id]) => `${exp ? 'export ' : ''}const ${id} = ${J(v)}`).join('\n')
  const local = (nodes, used) => {
    const own = nodePool([nodes], { prefix: '_', skip: ids })
    return { decl: own.decl(), lit: lit(nodes, used, own.ids) }
  }
  return { lit, decl, ids, local }
}

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
      // folders the prune emptied (a removed style, a layout change) go too
      const prune = d => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(d, e.name))
        if (d !== root && !kept.some(k => (d + path.sep).startsWith(k)) && !fs.readdirSync(d).length) fs.rmdirSync(d)
      }
      if (stale.length) prune(root)
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
  // every package runs its tests, at least test/size.test.mjs (the jsDelivr size budget, scripts/package-budget.mjs)
  if (!pkg.scripts?.test) pkg = { ...pkg, scripts: { ...pkg.scripts, test: 'node --test test/*.test.mjs' } }
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
  const deep = s => ({ types: `./dist/${s}/deep.d.ts`, default: `./dist/${s}/icons/*.js` })
  ex['./icons/*'] = deep(ctx.defaultStyle)
  for (const s of ctx.styles) ex[`./${s.name}/icons/*`] = deep(s.name)
  ex['./package.json'] = './package.json'
  const tv = { icon: ['./dist/icon.d.ts'], 'icons/*': [`./dist/${ctx.defaultStyle}/deep.d.ts`] }
  for (const s of ctx.styles) { tv[s.name] = [`./dist/${s.name}/index.d.ts`]; tv[`${s.name}/icons/*`] = [`./dist/${s.name}/deep.d.ts`] }
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
/** One element: [tag, attributes], or [tag, attributes, children] for the gradient definitions of rich styles. */
export type IconNodeElement = [tag: string, attrs: Record<string, string | number>, children?: IconNodeElement[]]
/** Icon data: a list of [tag, attributes] pairs rendered inside a 24x24 <svg> (rich styles start with ['defs', {}, [...]]). */
export type IconNode = IconNodeElement[]
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

// Gives the gradient ids of one rendered icon a per-instance suffix, and every url(#id) that points at them, so two
// copies of a rich icon on one page never paint with each other's gradients (or palettes). Flat nodes come back as is.
// Serialized into every component runtime (UNIQ_SRC); keep it self-contained.
function withUniq(iconNode, suffix) {
  const sfx = '-' + String(suffix).replace(/[^\w-]/g, '')
  const fix = v => typeof v === 'string' && v.indexOf('url(#') >= 0 ? v.replace(/url\(#([^)\s]+)\)/g, 'url(#$1' + sfx + ')') : v
  const walk = list => list.map(n => {
    const a = n[1]
    let b = null
    for (const k in a) {
      const v = k === 'id' ? a[k] + sfx : fix(a[k])
      if (v !== a[k]) { if (!b) b = Object.assign({}, a); b[k] = v }
    }
    return n[2] ? [n[0], b || a, walk(n[2])] : b ? [n[0], b] : n
  })
  return walk(iconNode)
}
export const UNIQ_SRC = String(withUniq)
// The same for inner SVG markup (strings): id="x" and url(#x) get the suffix. ES5 (classic scripts serialize it too).
export function withUniqMarkup(markup, suffix) {
  var s = String(markup == null ? '' : markup)
  if (s.indexOf('url(#') < 0 && s.indexOf(' id="') < 0) return s
  var sfx = '-' + String(suffix).replace(/[^\w-]/g, '')
  return s.replace(/(\sid="|url\(#)([^")\s]+)/g, '$1$2' + sfx)
}

// Runs in the browser (inlined by its source into cdn.js, with-loader.js, with-icons.js and the dynamic CDN scripts).
// A bare package URL (https://cdn.jsdelivr.net/npm/@withicons/web, …/web@latest, …/web@0.2, unpkg.com/@withicons/web)
// serves the package's "jsdelivr" / "unpkg" entry file, but relative URLs then resolve against …/npm/@withicons/.
// Returns this exact version's folder `dir` (e.g. 'dist/') on the same host, or null when `src` is a real file path
// (pinned or @latest …/dist/x.js, node_modules, a self-hosted copy), which then resolves next to itself as before.
export function withBareBase(src, pkg, version, dir) {
  var m = /^(https?:\/\/[^?#]*\/)@withicons\/([\w.-]+)(@[^/?#]*)?\/?([?#].*)?$/.exec(String(src || ''))
  return m && m[2] === pkg ? m[1] + '@withicons/' + pkg + '@' + version + '/' + dir : null
}

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
  const el = n => '<' + n[0] + attrs(n[1]) + (n[2] && n[2].length ? '>' + n[2].map(el).join('') + '</' + n[0] + '>' : '/>')
  const nodes = o.idSuffix != null && o.idSuffix !== '' ? withUniq(iconNode, o.idSuffix) : iconNode
  let out = '<svg' + attrs(a) + '>' + (o.title ? '<title>' + esc(o.title) + '</title>' : '') + nodes.map(el).join('') + '</svg>'
  // flat: CSS variables -> their default colours (for files, <img>, design tools and rasterizers)
  if (o.flat) { let p; do { p = out; out = out.replace(/var\(\s*--[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1').replace(/var\(\s*--[\w-]+\s*\)/g, 'currentColor') } while (out !== p) }
  return out
}

// ---------------------------------------------------------------- core emitter

export default async function emit(ctx) {
  const P = 'packages/core'
  const out = distWriter(ctx, P + '/dist', { keep: ['palettes'] })   // dist/palettes/** belongs to emit-palettes
  const W0 = (rel, text) => out.add(rel.slice(P.length + 6), text)
  const W = W0
  const styleNames = ctx.styles.map(s => s.name)
  const meta = ctx.icons.map(i => ({
    name: i.name, category: i.category, description: i.description, aliases: i.aliases, tags: i.tags,
    styles: styleNames.filter(s => i.render[s]),
  }))
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const stylesMeta = ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: !!s.palette, vars: s.vars || {}, package: '@withicons/' + cdnPkg(s.name) }))
  // the run 12 styles' files go to the companion packages (core-plus, and a package per OWN_STYLES style)
  const homes = splitPackages(styleNames, 'core')
  const writers = { core: out }
  // an own-style package also holds the class icons (emit-classes writes its dist/classes/)
  for (const p of Object.keys(homes)) if (p !== 'core') writers[p] = distWriter(ctx, `packages/${p}/dist`, { keep: isOwnPackage(p) ? ['classes'] : [] })
  const plusNames = homes['core-plus'] || [], baseNames = homes.core || []
  const categories = [...new Set(meta.map(m => m.category))]

  let svgCount = 0
  for (const s of styleNames) {
    const home = cdnPkg(s)
    const W = home === 'core' ? W0 : (rel, text) => writers[home].add(rel.slice(P.length + 6), text)
    const NAME = '@withicons/' + home
    // companions have no index of their own: their type files take the shared types from @withicons/core
    const TYPES = ext => home === 'core' ? `../index.${ext}` : '@withicons/core'
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
    // compact JS (nodePool): the values the style repeats (palette variables, classes) are declared once
    const list = ctx.icons.filter(i => nodes[i.name])
    const pool = nodePool(list.map(i => nodes[i.name]))
    const consts = (pool.ids.size ? pool.decl() + '\n' : '') + list.map(i => `const ${i.pascal} = ${pool.lit(nodes[i.name])}`).join('\n')
    const map = `{ ${list.map(i => `${J(i.name)}: ${i.pascal}`).join(', ')} }`
    const styleJson = J(stylesMeta.find(x => x.name === s))
    W(`${P}/dist/nodes/${s}.js`, `// ${NAME} ${ctx.version} — ${s} IconNode data\nconst style = ${styleJson}\n${consts}\n` +
      `/** every ${s} icon, keyed by canonical name */\nconst nodes = ${map}\n` +
      `export { style, nodes, ${list.map(i => i.pascal).join(', ')} }\nexport default nodes\n`)
    // CJS: the canonical-name map is module.exports; style, nodes, default and the PascalCase names are non-enumerable,
    // so Object.keys(require('@withicons/core/nodes/line')) is exactly the icon names.
    // the data lives once, in the ES module next to it: require() loads it (Node 20.19+ / 22.12+, every bundler). A second
    // copy here would push the CDN packages over jsDelivr's 150 MB limit. Same API as before: the canonical-name map, with
    // style, nodes, default and the PascalCase names non-enumerable.
    W(`${P}/dist/nodes/${s}.cjs`, `'use strict'\n// ${NAME} ${ctx.version} — ${s} IconNode data for require(): loads ./${s}.js (ES module)\n` +
      `let m\ntry { m = require('./${s}.js') } catch (e) {\n` +
      `  if (e && (e.code === 'ERR_REQUIRE_ESM' || e.code === 'ERR_REQUIRE_ASYNC_MODULE')) throw new Error(${J(`${NAME}/nodes/${s}: require() needs Node 20.19+ or 22.12+ (it loads the ES module next to it). Use import, or a newer Node.`)})\n` +
      `  throw e\n}\nconst nodes = Object.assign({}, m.nodes)\nconst hide = (k, v) => Object.defineProperty(nodes, k, { value: v, enumerable: false })\n` +
      `for (const k of Object.keys(m)) if (k !== 'nodes' && k !== 'style' && k !== 'default') hide(k, m[k])\nhide('style', m.style)\nhide('nodes', nodes)\nhide('default', nodes)\nhide('__esModule', true)\nmodule.exports = nodes\n`)
    const named = list.map(i => `/** ${i.name} — ${i.description.replace(/\*\//g, '')} */\nexport declare const ${i.pascal}: IconNode`).join('\n')
    const dts = ext => `import type { IconName, IconNode, StyleMeta } from '${TYPES(ext)}'\n/** ${s} style metadata */\nexport declare const style: StyleMeta\n/** IconNode data for every icon in the ${s} style, keyed by canonical name. Prefer the named exports to keep bundles small. */\nexport declare const nodes: Record<IconName, IconNode>\n${named}\n`
    W(`${P}/dist/nodes/${s}.d.ts`, dts('js') + 'export default nodes\n')
    W(`${P}/dist/nodes/${s}.d.cts`, `import type { IconName, IconNode, StyleMeta } from '${TYPES('cjs')}'\ntype Nodes = Record<IconName, IconNode>\n` +
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
${UNIQ_SRC}
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
  /** The package with this style's SVG files and IconNode data: '@withicons/core' or '@withicons/core-plus'. */
  package: string
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
  /**
   * Appended to the gradient ids of rich styles (and to every url(#id) that points at them). Give each copy you put
   * inline in one page its own value (e.g. a counter); files and <img> need none.
   */
  idSuffix?: string | number
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
  for (const s of baseNames) ex[`./nodes/${s}`] = dual(`dist/nodes/${s}`)
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
  for (const s of baseNames) tv[`nodes/${s}`] = [`./dist/nodes/${s}.d.ts`]
  tv['palettes/*'] = ['./dist/palettes/*']   // TypeScript without "exports" support (moduleResolution node10)
  const pkg = {
    ...basePkg(ctx, '@withicons/core', `${countText(ctx)} as standalone SVGs, IconNode data, metadata, colour palettes, alias resolution and search.`, ['svg-icons', 'icon-search', 'multicolor-icons', 'color-palettes', ...baseNames]),
    type: 'module', sideEffects: false,
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    exports: ex, typesVersions: { '*': tv },
    files: ['dist', 'README.md', 'LICENSE'],
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  await out.flush()
  writePkg(ctx, 'core', pkg, coreReadme(ctx))
  // companions: the run 12 styles' SVG files and IconNode data (same paths as in core)
  for (const [p, list] of Object.entries(homes)) {
    if (p === 'core') continue
    const own = isOwnPackage(p)
    const pex = {}
    // an own-style package: the bare import is its IconNode data, './classes/*' its CSS class icons (emit-classes)
    if (own && list.length === 1) pex['.'] = dual(`dist/nodes/${list[0]}`)
    for (const st of list) pex[`./nodes/${st}`] = dual(`dist/nodes/${st}`)
    pex['./svg/*'] = './dist/svg/*'
    if (own) pex['./classes/*'] = './dist/classes/*'
    pex['./dist/*'] = './dist/*'
    pex['./package.json'] = './package.json'
    const ptv = {}
    for (const st of list) ptv[`nodes/${st}`] = [`./dist/nodes/${st}.d.ts`]
    const desc = own
      ? `${list.length === 1 ? `The ${list[0]} style` : `The ${p} styles (${list.join(', ')})`} of with icons (${ctx.icons.length} icons): standalone SVGs, IconNode data and CSS class icons. Companion of @withicons/core.`
      : `${list.length} newer with icons styles (${list.join(', ')}) for ${ctx.icons.length} icons: standalone SVGs and IconNode data. Companion of @withicons/core.`
    const ppkg = {
      ...basePkg(ctx, '@withicons/' + p, desc, ['svg-icons', 'multicolor-icons', 'gradient-icons', ...list, ...(own ? ['css-icons'] : [])]),
      type: 'module', sideEffects: own ? ['*.css'] : false,
      ...(own && list.length === 1 ? { main: `./dist/nodes/${list[0]}.cjs`, module: `./dist/nodes/${list[0]}.js`, types: `./dist/nodes/${list[0]}.d.ts` } : {}),
      // the bare CDN URL shows the package manifest instead of a 404
      jsdelivr: './package.json', unpkg: './package.json',
      exports: pex, typesVersions: { '*': ptv },
      files: ['dist', 'README.md', 'LICENSE'],
      dependencies: { '@withicons/core': ctx.version },
    }
    await writers[p].flush()
    writePkg(ctx, p, ppkg, companionReadme(ctx, p, list))
  }
  return `${svgCount} svgs (${Object.entries(homes).filter(([p]) => p !== 'core').map(([p, l]) => `${l.length} in ${p}`).join(', ')}), ${meta.length} icons, ${Object.keys(aliases).length} aliases, nodes for ${styleNames.length} styles`
}

function companionReadme(ctx, pkg, list) {
  const ex = list[0], own = isOwnPackage(pkg), N = '@withicons/' + pkg, t = '`', fence = '```'
  const one = own && list.length === 1, nodesPath = one ? N : `${N}/nodes/${ex}`
  return `# ${N}

${one ? `The ${t}${ex}${t} style` : `${list.length} ${own ? '' : 'newer '}styles (${list.map(x => t + x + t).join(', ')})`} of with icons for all ${ctx.icons.length} icons:
standalone SVG files and IconNode data${own ? ', plus their CSS class icons' : ''}, laid out like [${t}@withicons/core${t}](https://www.npmjs.com/package/@withicons/core),
which holds the older styles and the shared API (${t}toSvg${t}, ${t}resolve${t}, ${t}search${t}, metadata, palettes; its ${t}styles.json${t}
says which package holds each style). The newest styles have packages of their own because jsDelivr serves at most 150 MB per package.

${fence}bash
npm i @withicons/core ${N}
${fence}

${fence}js
import { toSvg } from '@withicons/core'
import { Home } from '${nodesPath}'
toSvg(Home, '${ex}', { size: 32, idSuffix: 'a' })   // gradients: give each inline copy its own idSuffix
import url from '${N}/svg/${ex}/home.svg'
${fence}

CDN: ${t}https://cdn.jsdelivr.net/npm/${N}@latest/dist/svg/${ex}/home.svg${t}

| path | contents |
|---|---|
| ${t}dist/svg/<style>/<name>.svg${t} | standalone SVG (CSS variables flattened to their defaults) |
| ${t}dist/nodes/<style>.js${t} (${t}.cjs${t}) | IconNode data: one tree-shakable named export per icon plus ${t}nodes${t} / default |
${own ? `| ${t}dist/classes/with-<style>.css${t}, ${t}dist/classes/<style>/<name>.css${t} | CSS class icons (${t}<i class="with with-home with-${ex}">${t}); the @withicons/classes loader finds them by itself |
` : ''}
Every framework package (${t}@withicons/react${t}, ${t}vue${t}, ${t}svelte${t}, ${t}angular${t}, ${t}solid${t}) and ${t}@withicons/web${t}, ${t}@withicons/static${t}
hold every style, these included.
${gradientDoc(ctx)}
MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}


function coreReadme(ctx) {
  const plus = ctx.styles.map(s => s.name).filter(n => cdnPkg(n) !== 'core')
  const plusOnly = plus.filter(isPlusStyle)
  // own packages: [package, [styles]] ('soft3d' -> ['soft3d'], 'holiday' -> ['utsav', ...])
  const own = Object.entries(splitPackages(plus.filter(isOwnStyle), 'core'))
  const camel = x => x[0].toUpperCase() + x.slice(1)
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
| \`dist/nodes/<style>.js\` | IconNode data (\`[tag, attrs][]\`; gradient styles add one \`['defs', {}, [...]]\` node with children; keeps the CSS variables): one tree-shakable named export per icon (\`Home\`, \`ArrowRight\`) plus \`nodes\` / default \`{ [name]: IconNode }\` |
| \`dist/palettes/<name>.json\` | \`{ name, auto, palettes: [{ id, name, tags, colors }] }\`: colour palettes picked for that icon (see below) |
| \`dist/palettes/index.json\` | \`{ roles, roleLabels, tags, icons: { [name]: { count, auto, tags } } }\` |
| \`dist/palettes/palette-map.mjs\` (import it as \`@withicons/core/palettes/palette-map.js\`) | \`rolesFor\`, \`applyPalette\`, \`bakePalette\` (also \`palette-map.cjs\` and \`palette-map.d.ts\`) |

Import a file: \`import url from '@withicons/core/svg/solid/home.svg'\`.
CDN: \`https://cdn.jsdelivr.net/npm/@withicons/core@latest/dist/svg/line/home.svg\`
${plus.length ? `
### Where the newest styles live

jsDelivr serves at most 150 MB per package, so the SVG files and IconNode data of the newest styles live in companion
packages with the same paths: ${plusOnly.length ? `${plusOnly.map(s => '\`' + s + '\`').join(', ')} in
[\`@withicons/core-plus\`](https://www.npmjs.com/package/@withicons/core-plus)` : ''}${plusOnly.length && own.length ? ', and ' : ''}${own.map(([p, l]) => `${l.map(x => '\`' + x + '\`').join(', ')} in [\`@withicons/${p}\`](https://www.npmjs.com/package/@withicons/${p})`).join(', ')}.
This package keeps their metadata (\`styles\`; \`styles.json\` names each style's \`package\`) and \`toSvg\` draws them:

\`\`\`bash
${plusOnly.length ? 'npm i @withicons/core-plus\n' : ''}${own.map(([p]) => `npm i @withicons/${p}\n`).join('')}\`\`\`

\`\`\`js
${plusOnly.length ? `import { Home } from '@withicons/core-plus/nodes/${plusOnly[0]}'
toSvg(Home, '${plusOnly[0]}')
// CDN: https://cdn.jsdelivr.net/npm/@withicons/core-plus@latest/dist/svg/${plusOnly[0]}/home.svg
` : ''}${own.map(([p, l]) => `import { Home as ${camel(l[0])}Home } from '@withicons/${l.length === 1 ? p : p + '/nodes/' + l[0]}'
// CDN: https://cdn.jsdelivr.net/npm/@withicons/${p}@latest/dist/svg/${l[0]}/home.svg
`).join('')}\`\`\`
` : ''}

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

${ctx.styles.map(s => `- \`${s.name}\` (${groupOfStyle(s.name).title}${s.palette ? ', palette' : ''}): ${s.description}`).join('\n')}
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
${gradientDoc(ctx)}`
}

// The styles of this build that draw SVG gradients (rich styles), found in the renders
export const gradientStyles = ctx => ctx.styles.filter(s => ctx.icons.some(i => i.render[s.name] && hasDefs(i.render[s.name].nodes))).map(s => s.name)
function gradientDoc(ctx) {
  const g = gradientStyles(ctx)
  if (!g.length) return ''
  return `
${g.map(s => '`' + s + '`').join(', ')} draw real SVG gradients: a \`<defs>\` of \`linearGradient\` / \`radialGradient\` whose stop
colours are the same CSS variables, so palettes and \`--with-*\` overrides recolour them too. Every inline copy gets its own
gradient ids (components, \`<with-icon>\`, \`with-icons.js\`), so one page can show the same icon many times in different
colours. When you inline SVG strings yourself, pass \`idSuffix\` (\`toSvg\` in \`@withicons/core\`, \`svg\` / \`loadSvg\` in
\`@withicons/web\`, \`render\` in \`@withicons/dynamic\`) with a different value per copy. Files and \`<img>\` need nothing.
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/motion.css">
<!-- each animated icon's own motion: one small file per icon (icons.css has all of them) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@withicons/motion@latest/dist/icons/bell.css">

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
//   dist/<style>/index.{js,cjs}   ONE module per style holding all its icons (/*#__PURE__*/ consts, so bundlers keep
//                                 only what is imported; Node, Jest and Vitest parse one file instead of 500); the
//                                 drawings are compact JS (nodePool: repeated values once), the .cjs a thin require()
//                                 of the .js (thinCjs) or, for solid, both formats read them from <style>/nodes.js
//   dist/<style>/index.{d.ts,d.cts}
//   dist/<style>/icons/<name>.js  deep import path: re-exports one icon of the style module (all typed by <style>/deep.d.ts)
//   dist/icon-lazy.{js,d.ts}      the root's generic <Icon>: default style eager, any other style loaded on first use
//   dist/icon.{js,d.ts}           generic <Icon> with every style imported up front (synchronous everywhere; heavy)
//   dist/index.{js,cjs,d.ts,d.cts} default style + Icon + preloadStyles + createWithIcon + iconNames/styleNames
//
// spec: { dir, importEsm, importCjs, mapAttrs, baseSrc, iconSrc, typesDts, iconType }
//   baseSrc defines function createWithIcon (free vars: STYLES, DEFAULT_STYLE)
//   iconSrc defines const Icon (free vars: withFindComponent -> component | null | name of a style still to load,
//   withLoadStyle(style) -> Promise); for a pending style it renders the framework's lazy component, resolving to Icon
function withPascal(n) { return n.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') }
// -> the component, null (unknown name: warned), or a style name (string) whose module is not loaded yet
function withFindComponent(name, variant) {
  let v = variant || DEFAULT_STYLE
  if (!Object.prototype.hasOwnProperty.call(LOAD, v)) {
    withWarn('with icons: unknown variant "' + v + '". Use one of: ' + styleNames.join(', ') + '. Falling back to "' + DEFAULT_STYLE + '".')
    v = DEFAULT_STYLE
  }
  let canonical
  try { canonical = withLookup(name, k => ICON_SET.has(k), iconNames, aliases) } catch (e) { withWarn(e.message); return null }
  const set = getSet(v)
  return set ? set[withPascal(canonical)] || null : v
}
// loads styles for <Icon> (no argument = every style); resolves once they render synchronously
function preloadStyles() {
  const list = arguments.length ? [].concat.apply([], arguments) : styleNames
  for (const v of list) if (!Object.prototype.hasOwnProperty.call(LOAD, v)) return Promise.reject(new Error('with icons: unknown style "' + v + '". Use one of: ' + styleNames.join(', ') + '.'))
  return Promise.all(list.map(withLoadStyle)).then(() => {})
}
const WITH_WARNED = {}
function withWarn(msg) { if (!WITH_WARNED[msg] && typeof console !== 'undefined') { WITH_WARNED[msg] = 1; console.warn(msg) } }
const FIND_SRC = [LOOKUP_SRC, withPascal, withFindComponent, preloadStyles, 'const WITH_WARNED = {}', withWarn].map(String).join('\n')

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

  const baseBody = `const DEFAULT_STYLE = ${J(D)}\nconst STYLES = ${J(styleTable(ctx, spec.mapAttrs))}\n${UNIQ_SRC}\n${spec.baseSrc}\n`
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
  const doc = i => i.description.replace(/\*\//g, '')
  for (const s of styleNames) {
    const consts = [], names = [], idxDts = [], data = []
    const renders = ctx.icons.map(i => [i, renderOf(ctx, i, s)]).map(([i, r]) => [i, r, mapNodes(r.nodes, spec.mapAttrs)])
    const pool = nodePool(renders.map(x => x[2]))
    for (const [i, r, mapped] of renders) {
      // thinCjs: the drawings live in index.js (its require() twin loads that file). Otherwise (solid: two module
      // formats with their own framework instance) they live once in nodes.js, plain data both formats load.
      const nodes = spec.thinCjs ? pool.lit(mapped) : `N.${i.pascal}`
      if (!spec.thinCjs) data.push(`export const ${i.pascal} = ${pool.lit(mapped)}`)
      consts.push(`const ${i.pascal} = /*#__PURE__*/ createWithIcon(${J(i.name)}, ${J(r.style)}, ${J(i.pascal)}, ${nodes})`)
      names.push(i.pascal)
      // deep path = a re-export: the drawing ships once per module format, and the style module tree-shakes
      W(`${P}/${s}/icons/${i.name}.js`, `export { ${i.pascal}, ${i.pascal}Icon, ${i.pascal} as default } from '../index.js'\n`)
      files++
      idxDts.push(`/** ${i.name} — ${doc(i)} */\nexport declare const ${i.pascal}: WithIcon\nexport declare const ${i.pascal}Icon: WithIcon`)
    }
    const prelude = spec.thinCjs ? pool.decl() + '\n' : ''
    W(`${P}/${s}/index.js`, `${header}import { createWithIcon } from '../base.js'\n${spec.thinCjs ? '' : `import * as N from './nodes.js'\n`}${prelude}${consts.join('\n')}\nexport {\n${names.map(n => `  ${n}, ${n} as ${n}Icon,`).join('\n')}\n}\n`)
    W(`${P}/${s}/index.d.ts`, `import type { WithIcon } from '../types.js'\n${idxDts.join('\n')}\n`)
    const needEsm = (what, file) => `  if (e && (e.code === 'ERR_REQUIRE_ESM' || e.code === 'ERR_REQUIRE_ASYNC_MODULE')) throw new Error(${J(`@withicons/${spec.dir}: require() of the ${s} icons needs Node 20.19+ or 22.12+ (${what} load from the ES module ${file}). Use import, or a newer Node.`)})\n`
    // require(): the icons live once, in an ES module (Node 20.19+ / 22.12+ and every bundler load it with require()).
    // A second copy of every drawing would push the package over jsDelivr's 150 MB limit.
    // Solid ships two builds with their own solid-js instance, so its CommonJS components stay CommonJS and only the
    // drawings (plain data, no framework import) come from nodes.js; react and vue share one instance (thinCjs).
    if (!spec.thinCjs) {
      W(`${P}/${s}/nodes.js`, `${header}// the ${s} drawings (IconNode data), shared by index.js and index.cjs\n${pool.decl()}\n${data.join('\n')}\n`)
      W(`${P}/${s}/index.cjs`, `'use strict'\n${header}const { createWithIcon } = require('../base.cjs')\nlet N\ntry { N = require('./nodes.js') } catch (e) {\n${needEsm('the drawings', 'nodes.js')}  throw e\n}\n${consts.join('\n')}\n${names.map(n => `exports.${n} = exports.${n}Icon = ${n}`).join('\n')}\n`)
    }
    else W(`${P}/${s}/index.cjs`, `'use strict'\n${header}// require() of this file loads ./index.js (ES module): the ${s} icons live there once\n` +
      `try { module.exports = require('./index.js') } catch (e) {\n` +
      `  if (e && (e.code === 'ERR_REQUIRE_ESM' || e.code === 'ERR_REQUIRE_ASYNC_MODULE')) throw new Error(${J(`@withicons/${spec.dir}: require() of the ${s} icons needs Node 20.19+ or 22.12+ (they load from the ES module). Use import, or a newer Node.`)})\n` +
      `  throw e\n}\n`)
    // one declaration file types every deep path of the style (exports './<style>/icons/*' -> deep.d.ts): no per-icon .d.ts
    W(`${P}/${s}/deep.d.ts`, `import type { WithIcon } from '../types.js'\nexport * from './index.js'\n/** The icon named in the deep import path ('@withicons/${spec.dir}/${s === D ? '' : s + '/'}icons/home'). */\ndeclare const Icon: WithIcon\nexport default Icon\n`)
    W(`${P}/${s}/index.d.cts`, `import type { WithIcon } from '../types.cjs'\n${idxDts.join('\n')}\n`)
  }

  // Generic <Icon>: LOAD has a key per style, getSet(style) returns the loaded style module (sync), withLoadStyle loads one.
  const iconRuntime = `const DEFAULT_STYLE = ${J(D)}\nconst ICON_SET = new Set(iconNames)\n${FIND_SRC}\n${spec.iconSrc}\n`
  // icon.js (subpath /icon): every style imported up front, so it renders synchronously in every style (and weighs every icon)
  W(`${P}/icon.js`, `${header}${spec.importEsm}\n` +
    styleNames.map(s => `import * as with_${s} from './${s}/index.js'`).join('\n') +
    `\nimport { iconNames, styleNames, aliases } from './meta.js'\nconst LOAD = { ${styleNames.map(s => `${J(s)}: with_${s}`).join(', ')} }\n` +
    `const getSet = v => LOAD[v]\nconst withLoadStyle = v => Promise.resolve(LOAD[v])\n${iconRuntime}export { Icon, preloadStyles }\nexport default Icon\n`)
  // icon-lazy.js (the root's Icon): the default style is already loaded by the root; any other style is one dynamic
  // import (one file in Node, one chunk in a bundle), fetched on first render or by preloadStyles()
  W(`${P}/icon-lazy.js`, `${header}${spec.importEsm}\nimport * as with_${D} from './${D}/index.js'\nimport { iconNames, styleNames, aliases } from './meta.js'\n` +
    `const LOAD = { ${styleNames.map(s => s === D ? `${J(s)}: () => Promise.resolve(with_${s})` : `${J(s)}: () => import('./${s}/index.js')`).join(', ')} }\n` +
    `const SETS = { ${J(D)}: with_${D} }\nconst PENDING = {}\nconst getSet = v => SETS[v]\n` +
    `const withLoadStyle = v => SETS[v] ? Promise.resolve(SETS[v]) : PENDING[v] || (PENDING[v] = LOAD[v]().then(m => (SETS[v] = m), e => { delete PENDING[v]; throw e }))\n` +
    `${iconRuntime}export { Icon, preloadStyles }\n`)
  const iconDts = (ext, how) => `import type { IconProps, StyleName } from './types.${ext}'\n${spec.iconTypeImport(ext)}\n/**\n * Generic icon: <Icon name="home" variant="solid" />. Accepts canonical names and unambiguous aliases.\n${how}\n * Prefer named imports (import { Home } ...) wherever the name is static.\n */\nexport declare const Icon: ${spec.iconType}\n` +
    `/**\n * Loads styles for <Icon> ahead of time (no argument = every style). Await it before a synchronous server render\n * (e.g. renderToString) so icons in other styles than ${D} are in the HTML.\n */\nexport declare function preloadStyles(...styles: StyleName[]): Promise<void>\n`
  W(`${P}/icon.d.ts`, iconDts('js', ` * This entry imports every icon of every style (${ctx.icons.length} x ${styleNames.length}) and always renders synchronously.\n * The root <Icon> loads each style on first use instead.`) + 'export default Icon\n')
  W(`${P}/icon-lazy.d.ts`, iconDts('js', ` * The ${D} style renders at once; any other style is loaded on first use (one chunk per style), or up front\n * with preloadStyles(). For every style synchronously, import Icon from '@withicons/${spec.dir}/icon'.`))

  W(`${P}/index.js`, `${header}export * from './${D}/index.js'\nexport { Icon, preloadStyles } from './icon-lazy.js'\nexport { createWithIcon } from './base.js'\nexport { iconNames, styleNames } from './meta.js'\n`)
  const idxDts = ext => `export * from './${D}/index.${ext}'\nexport { createWithIcon } from './base.${ext}'\nexport { iconNames, styleNames } from './meta.${ext}'\nexport type { IconName, IconAlias, StyleName, IconNode, ${spec.typeNames.join(', ')} } from './types.${ext}'\n`
  W(`${P}/index.d.ts`, idxDts('js') + `export { Icon, preloadStyles } from './icon-lazy.js'\n`)
  W(`${P}/index.d.cts`, idxDts('cjs') + iconDts('cjs', ` * With require() a style is loaded synchronously the first time it renders.`))
  // CommonJS: require() is synchronous, so <Icon> loads a style when it first renders and never suspends
  W(`${P}/index.cjs`, `'use strict'\n${header}${spec.importCjs}\nconst { createWithIcon } = require('./base.cjs')\nconst { iconNames, styleNames, aliases } = require('./meta.cjs')\n` +
    `const LOAD = { ${styleNames.map(s => `${J(s)}: () => require('./${s}/index.cjs')`).join(', ')} }\nconst SETS = {}\n` +
    `const getSet = v => SETS[v] || (Object.prototype.hasOwnProperty.call(LOAD, v) ? (SETS[v] = LOAD[v]()) : undefined)\n` +
    `const withLoadStyle = v => new Promise(r => r(getSet(v)))\n${iconRuntime}` +
    `const def = getSet(DEFAULT_STYLE)\nfor (const k in def) exports[k] = def[k]\nexports.Icon = Icon\nexports.preloadStyles = preloadStyles\nexports.createWithIcon = createWithIcon\nexports.iconNames = iconNames\nexports.styleNames = styleNames\n`)
  await out.flush()
  return files
}
