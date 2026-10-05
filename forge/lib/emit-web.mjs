// emit-web — @withicons/web: a dependency-free <with-icon> custom element.
//   dist/index.js         element + lazy per-style data chunks (auto-defines <with-icon>; SSR-safe); per-icon files
//                         instead when it is served unbundled from a CDN / package path
//   dist/cdn.js           element only (a few KB): every icon is fetched from its own file, for a CDN <script type="module">
//   dist/full.js          element + every style registered up front (static imports of data/<style>.js), sync svg()
//   dist/icons/<style>/<name>.js  export default '<inner svg markup>'  (one icon: what a CDN page downloads)
//   dist/data/<style>.js  { name: '<inner svg markup>' }   (lazy chunk; a sharded style's file re-exports its shards)
//   dist/data/<style>/<i>.js  shard i of a heavy style: the icons whose withShard(name, count) === i
//   dist/data/alias/<i>.js    { alias: [names] } for the aliases whose withShard(alias, ALIAS_SHARDS) === i
//   dist/data/meta.js     { names, aliases }                (lazy chunk, only for typo suggestions)
import zlib from 'zlib'
import { J, LOOKUP_SRC, distWriter, basePkg, writePkg, styleTable, innerOf, namesAndAliasesDts, paletteDoc, motionDoc } from './emit-core.mjs'

// A style whose chunk is over SHARD_OVER bytes ships as shards of about SHARD_TARGET bytes (~10 KB gzip) each,
// so one luxe icon costs one shard instead of the whole 3 MB style.
const SHARD_OVER = 400 * 1024
const SHARD_TARGET = 40 * 1024
const ALIAS_SHARDS = 16

// ---- runtime (serialized with .toString(); free vars: STYLES, DEFAULT_STYLE, LOADERS, LOAD_META)
function withWarnOnce(msg) {
  if (withWarnOnce.seen[msg] || typeof console === 'undefined') return
  withWarnOnce.seen[msg] = 1
  console.warn(msg)
}
withWarnOnce.seen = {}
function withHas(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k) }
function withRenderSvg(inner, variant, options) {
  const o = options || {}
  const st = STYLES[variant] || STYLES[DEFAULT_STYLE]
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const size = o.size == null || o.size === '' ? 24 : o.size
  const c = o.color || 'currentColor'
  const a = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24' }
  for (const k in st.root) a[k] = st.root[k] === 'currentColor' ? c : st.root[k]
  if (c !== 'currentColor') a.color = c
  if (st.strokeWidth !== false) {
    const sw = o.strokeWidth
    const w = sw == null || sw === '' || isNaN(Number(sw)) ? st.strokeWidth : Number(sw)
    const px = /^\s*\d*\.?\d+(px)?\s*$/.test(String(size)) ? parseFloat(size) : 0
    a['stroke-width'] = o.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1000) / 1000 : w
  }
  if (o.part) a.part = o.part
  if (o.class) a.class = o.class
  if (o.label) { a.role = 'img'; a['aria-label'] = o.label } else a['aria-hidden'] = 'true'
  let s = '<svg'
  for (const k in a) s += ' ' + k + '="' + esc(a[k]) + '"'
  return s + '>' + (inner || '') + '</svg>'
}
// Heavy styles are split into shards (LOADERS[style] is an array): an icon lives in shard withShard(name, count),
// so one icon of a heavy style costs one small shard, not the whole style. Light styles are one chunk (a function).
function withShard(name, n) {
  let h = 2166136261
  for (let i = 0; i < name.length; i++) { h ^= name.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) % n
}
// loaded data under, then registerVariant() icons over (yours always win)
function withMerge(v, map) { WITH_DATA[v] = Object.assign(WITH_DATA[v] || {}, map, WITH_USER[v] || {}); return WITH_DATA[v] }
function withOnce(key, load, v) {
  return WITH_PENDING[key] || (WITH_PENDING[key] = load().then(m => withMerge(v, m.default), e => { delete WITH_PENDING[key]; throw e }))
}
function loadVariant(variant) {
  const v = variant || DEFAULT_STYLE
  if (WITH_LOADED[v] || (WITH_DATA[v] && !withHas(LOADERS, v))) return Promise.resolve(WITH_DATA[v])
  if (!withHas(LOADERS, v)) return Promise.reject(new Error('with icons: unknown variant "' + v + '". Use one of: ' + Object.keys(STYLES).join(', ') + '.'))
  const L = LOADERS[v]
  return (Array.isArray(L) ? Promise.all(L.map((f, i) => withOnce(v + '/' + i, f, v))) : withOnce(v, L, v))
    .then(() => { WITH_LOADED[v] = 1; return WITH_DATA[v] })
}
// Per-icon files (dist/icons/<style>/<name>.js, a few hundred bytes each): used when the module is served from a CDN
// or a copy of the package (WITH_BASE.url, see withAutoBase / setIconBase), so a page downloads only the icons it shows.
// Bundled apps keep the chunks above (a bundler cannot see these computed URLs).
function withIcon(v, n) {
  const key = 'i:' + v + '/' + n
  return WITH_PENDING[key] || (WITH_PENDING[key] = import(/* webpackIgnore: true */ /* @vite-ignore */ WITH_BASE.url + 'icons/' + v + '/' + n + '.js')
    .then(m => withMerge(v, { [n]: m.default }), e => { delete WITH_PENDING[key]; throw e }))
}
// the data that holds `name` (if that icon exists): its own file on a CDN, else its shard for a sharded style, else
// the whole style
function withLoadFor(v, name) {
  if (withHas(WITH_DATA[v], name)) return Promise.resolve(WITH_DATA[v])
  if (WITH_BASE.url && withHas(STYLES, v) && WITH_NAMES.has(name) && !WITH_LOADED[v]) return withIcon(v, name).catch(() => withChunkFor(v, name))
  return withChunkFor(v, name)
}
function withChunkFor(v, name) {
  const L = withHas(LOADERS, v) ? LOADERS[v] : null
  if (withHas(WITH_DATA[v], name)) return Promise.resolve(WITH_DATA[v])
  if (!Array.isArray(L) || WITH_LOADED[v]) return loadVariant(v)
  const i = withShard(name, L.length)
  return withOnce(v + '/' + i, L[i], v)
}
/** Where per-icon files are fetched from: the URL of a `dist/` folder (CDN or self-hosted copy), or null for chunks. */
function setIconBase(url) {
  WITH_BASE.url = url ? String(url).replace(/\/?$/, '/') : null
}
// aliases: a small shard (dist/data/alias/<i>.js) per lookup key; the full meta only for typos (suggestions)
function withAliases(name) {
  if (!ALIAS_LOADERS.length) return Promise.resolve({})
  const want = {}
  for (const k of withKeys(name)) want[withShard(k, ALIAS_LOADERS.length)] = 1
  return Promise.all(Object.keys(want).map(i => WITH_ALIAS[i] || (WITH_ALIAS[i] = ALIAS_LOADERS[i]().then(m => m.default, e => { delete WITH_ALIAS[i]; throw e }))))
    .then(list => Object.assign({}, ...list))
}
function registerVariant(variant, map) {
  WITH_USER[variant] = Object.assign(WITH_USER[variant] || {}, map)
  WITH_DATA[variant] = Object.assign(WITH_DATA[variant] || {}, map)
}
function withLoadMeta() {
  if (WITH_META.value) return Promise.resolve(WITH_META.value)
  return WITH_META.pending || (WITH_META.pending = LOAD_META().then(m => (WITH_META.value = m.default)))
}
function withResolveName(name, variant) {
  const v = variant || DEFAULT_STYLE
  // canonical names (WITH_NAMES ships in the entry) and icons you registered: no lookup data at all
  const has = k => withHas(WITH_DATA[v], k) || WITH_NAMES.has(k)
  const direct = withHas(WITH_DATA[v], name) || WITH_NAMES.has(name) ? name : null
  const found = direct != null ? Promise.resolve(direct)
    : withAliases(name).then(al => {
      try { return withLookup(name, has, [], al) } catch (e) { if (e.code !== 'WITH_UNKNOWN_ICON') throw e }
      // unknown: the full meta, for the nearest-name suggestions in the error
      return withLoadMeta().then(meta => withLookup(name, has, meta.names, meta.aliases))
    })
  return found.then(n => withLoadFor(v, n).then(map => {
    if (!withHas(map, n) && !withHas(WITH_DATA[v], n)) throw Object.assign(new Error('with icons: unknown icon "' + name + '".'), { code: 'WITH_UNKNOWN_ICON', suggestions: [] })
    return n
  }))
}
function loadSvg(name, options) {
  const o = options || {}
  const v = o.variant || DEFAULT_STYLE
  return withResolveName(name, v).then(n => withRenderSvg(WITH_DATA[v][n], v, o))
}
const WithBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement
class WithIconElement extends WithBase {
  static get observedAttributes() { return ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'mirror-rtl'] }
  connectedCallback() { this._withRender() }
  attributeChangedCallback() { if (this.isConnected) this._withRender() }
  // aria-label / aria-labelledby on the host name the host itself: an autonomous custom element is role=generic,
  // which may not carry a name, so it becomes role=img (ElementInternals; a role attribute in older browsers)
  _withA11y() {
    const named = !this.getAttribute('label') && (this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby'))
    let i = this._withInternals
    if (i === undefined) {
      try { i = typeof this.attachInternals === 'function' ? this.attachInternals() : null } catch (e) { i = null }
      this._withInternals = i
    }
    if (i && 'role' in i) i.role = named ? 'img' : null
    else if (named && !this.hasAttribute('role')) { this.setAttribute('role', 'img'); this._withRole = 1 }
    else if (!named && this._withRole) { this.removeAttribute('role'); this._withRole = 0 }
    return named
  }
  _withRender() {
    const named = this._withA11y()
    const name = (this.getAttribute('name') || '').trim()
    let v = this.getAttribute('variant') || DEFAULT_STYLE
    if (!withHas(STYLES, v)) {
      withWarnOnce('with icons: unknown variant "' + v + '". Use one of: ' + Object.keys(STYLES).join(', ') + '. Falling back to "' + DEFAULT_STYLE + '".')
      v = DEFAULT_STYLE
    }
    const size = this.getAttribute('size') || 24
    const css = /^\s*\d*\.?\d+\s*$/.test(String(size)) ? parseFloat(size) + 'px' : String(size).replace(/[;{}<>]/g, '')
    const o = {
      size, color: this.getAttribute('color'), strokeWidth: this.getAttribute('stroke-width'),
      absoluteStrokeWidth: this.hasAttribute('absolute-stroke-width') && this.getAttribute('absolute-stroke-width') !== 'false',
      label: named ? null : this.getAttribute('label'), part: 'svg',
    }
    // mirror-rtl: flip directional icons in right-to-left text. :dir() where supported (live), else the direction at render time
    let rtl = ''
    if (this.hasAttribute('mirror-rtl') && this.getAttribute('mirror-rtl') !== 'false') {
      rtl = ':host(:dir(rtl)) svg{transform:scaleX(-1)}'
      const dirOk = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('selector(:dir(rtl))')
      if (!dirOk && typeof getComputedStyle === 'function' && getComputedStyle(this).direction === 'rtl') rtl = 'svg{transform:scaleX(-1)}'
    }
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' })
    const token = this._withToken = (this._withToken || 0) + 1
    const paint = inner => {
      if (token !== this._withToken) return
      root.innerHTML = '<style>:host{display:inline-block;width:' + css + ';height:' + css + ';line-height:0;vertical-align:middle;flex-shrink:0}svg{display:block;width:100%;height:100%}' + rtl + '</style>' +
        (inner == null ? '' : withRenderSvg(inner, v, o))
    }
    const map = WITH_DATA[v]
    if (withHas(map, name)) return paint(map[name])
    if (!name) return paint(null)   // no name yet (e.g. created, then configured): nothing to warn about
    if (!root.firstChild) paint(null)
    withResolveName(name, v).then(n => paint(WITH_DATA[v][n]), e => { withWarnOnce(e.message); paint(null) })
  }
}
function defineWithIcon(tagName) {
  const tag = tagName || 'with-icon'
  if (typeof customElements === 'undefined' || customElements.get(tag)) return
  customElements.define(tag, tag === 'with-icon' ? WithIconElement : class extends WithIconElement {})
}
function withProps() {
  const map = { name: 'name', variant: 'variant', size: 'size', color: 'color', strokeWidth: 'stroke-width', label: 'label', mirrorRtl: 'mirror-rtl' }
  for (const p in map) {
    Object.defineProperty(WithIconElement.prototype, p, {
      configurable: true,
      get() { return this.getAttribute(map[p]) },
      set(val) { if (val == null || val === false) this.removeAttribute(map[p]); else this.setAttribute(map[p], String(val)) },
    })
  }
}

// index.js: per-icon files only when this very module is served from a CDN or an unbundled copy of the package
// (https://cdn.jsdelivr.net/npm/@withicons/web@x/dist/index.js, unpkg, /node_modules/@withicons/web/dist/index.js).
// A bundler renames or inlines the module, so bundled apps never match and keep their split chunks.
function withAutoBase() {
  try {
    const u = String(import.meta.url)
    return /^https?:/.test(u) && /\/@withicons\/web(@[^/]*)?\/dist\/index\.js([?#].*)?$/.test(u) ? u.replace(/index\.js([?#].*)?$/, '') : null
  } catch (e) { return null }
}

const RUNTIME = [LOOKUP_SRC, withWarnOnce, 'withWarnOnce.seen = {}', withHas, withRenderSvg,
  'const WITH_DATA = {}', 'const WITH_USER = {}', 'const WITH_LOADED = {}', 'const WITH_PENDING = {}', 'const WITH_ALIAS = {}',
  'const WITH_META = { value: null, pending: null, set: null }',
  'const WITH_NAMES = new Set(NAME_LIST.split(" "))',
  withShard, withMerge, withOnce, loadVariant, withIcon, withLoadFor, withChunkFor, setIconBase, withAliases, registerVariant, withLoadMeta, withResolveName, loadSvg,
  "const WithBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement", WithIconElement, defineWithIcon, withProps, 'withProps()',
].map(String).join('\n')

export default async function emit(ctx) {
  const P = 'packages/web'
  const out = distWriter(ctx, P + '/dist', { keep: ['classes'] })   // dist/classes belongs to emit-web-classes
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/web ${ctx.version} — generated, do not edit. MIT.\n`
  const head = `const DEFAULT_STYLE = ${J(ctx.defaultStyle)}\nconst STYLES = ${J(styleTable(ctx))}\nconst styleNames = ${J(styleNames)}\n`
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const meta = { names: ctx.icons.map(i => i.name), aliases }
  const data = {}
  const shards = {}   // style -> shard count, only for the styles too heavy for one chunk
  const shardJson = []
  for (const s of styleNames) {
    data[s] = {}
    for (const i of ctx.icons) data[s][i.name] = innerOf(ctx, i, s)
    const raw = Buffer.byteLength(J(data[s]))
    if (raw <= SHARD_OVER) out.add(`data/${s}.js`, `${header}export default ${J(data[s])}\n`)
    else {
      const n = shards[s] = Math.ceil(raw / SHARD_TARGET)
      const parts = Array.from({ length: n }, () => ({}))
      for (const i of ctx.icons) parts[withShard(i.name, n)][i.name] = data[s][i.name]
      parts.forEach(p => shardJson.push(J(p)))
      parts.forEach((p, k) => out.add(`data/${s}/${k}.js`, `${header}export default ${J(p)}\n`))
      // the whole style still imports as one module (loadVariant, the class runtime, `@withicons/web/data/<style>`),
      // in canonical icon order
      out.add(`data/${s}.js`, header + parts.map((_, k) => `import p${k} from './${s}/${k}.js'\n`).join('') +
        `const all = Object.assign({}, ${parts.map((_, k) => 'p' + k).join(', ')})\n` +
        `export default Object.fromEntries(${J(ctx.icons.map(i => i.name))}.map(n => [n, all[n]]))\n`)
    }
    out.add(`data/${s}.d.ts`, `import type { IconName } from '../index.js'\ndeclare const data: Record<IconName, string>\nexport default data\n`)
  }
  out.add('data/meta.js', `${header}export default ${J(meta)}\n`)
  out.add('data/meta.d.ts', `import type { IconName } from '../index.js'\ndeclare const meta: { names: IconName[]; aliases: Record<string, IconName[]> }\nexport default meta\n`)
  // alias shards: an alias lives in shard withShard(alias, ALIAS_SHARDS); resolving one alias costs one ~3 KB file
  const aliasParts = Array.from({ length: ALIAS_SHARDS }, () => ({}))
  for (const k of Object.keys(aliases)) aliasParts[withShard(k, ALIAS_SHARDS)][k] = aliases[k]
  aliasParts.forEach((p, k) => out.add(`data/alias/${k}.js`, `export default ${J(p)}\n`))
  // one file per icon and style: what a CDN page downloads (no header: most icons are a few hundred bytes)
  for (const s of styleNames) for (const i of ctx.icons) out.add(`icons/${s}/${i.name}.js`, `export default ${J(data[s][i.name])}\n`)

  const exportsList = 'WithIconElement, defineWithIcon, loadVariant, registerVariant, loadSvg, setIconBase, styleNames'
  const names = `const NAME_LIST = ${J(ctx.icons.map(i => i.name).join(' '))}\n`
  // literal import() paths so every bundler (Vite, webpack, Rollup, esbuild) sees and splits each chunk
  const loader = s => shards[s]
    ? `  ${J(s)}: [${Array.from({ length: shards[s] }, (_, k) => `() => import('./data/${s}/${k}.js')`).join(', ')}],`
    : `  ${J(s)}: () => import('./data/${s}.js'),`
  const aliasLoaders = `const ALIAS_LOADERS = [${aliasParts.map((_, k) => `() => import('./data/alias/${k}.js')`).join(', ')}]\n`
  const indexJs = `${header}${head}${names}const LOADERS = {\n${styleNames.map(loader).join('\n')}\n}\n${aliasLoaders}` +
    `const LOAD_META = () => import('./data/meta.js')\n${withAutoBase}\nconst WITH_BASE = { url: withAutoBase() }\n${RUNTIME}\ndefineWithIcon()\nexport { ${exportsList} }\n`
  out.add('index.js', indexJs)
  // cdn.js: the smallest entry, for <script type="module"> from a CDN or a self-hosted copy of dist/. Every icon is its
  // own file next to it (icons/<style>/<name>.js); no chunk table, so it stays a few KB whatever the style count.
  const ign = '/* webpackIgnore: true */ /* @vite-ignore */ '
  const cdnJs = `${header}${head}${names}const WITH_BASE = { url: new URL('./', import.meta.url).href }\n` +
    `const LOADERS = {}\nfor (const s of styleNames) LOADERS[s] = () => import(${ign}WITH_BASE.url + 'data/' + s + '.js')\n` +
    `const ALIAS_LOADERS = Array.from({ length: ${ALIAS_SHARDS} }, (_, i) => () => import(${ign}WITH_BASE.url + 'data/alias/' + i + '.js'))\n` +
    `const LOAD_META = () => import(${ign}WITH_BASE.url + 'data/meta.js')\n${RUNTIME}\ndefineWithIcon()\nexport { ${exportsList} }\n`
  out.add('cdn.js', cdnJs)
  // full.js: every style registered before the module finishes evaluating (static imports of the same data chunks, so
  // no 27 MB single file: CDNs refuse files over 20 MB, and bundlers produce the same output as before)
  const fullJs = `${header}${head}${names}${styleNames.map((s, k) => `import WITH_D${k} from './data/${s}.js'\n`).join('')}import WITH_META_FULL from './data/meta.js'\n` +
    `const LOADERS = {}\nconst ALIAS_LOADERS = []\nconst LOAD_META = () => Promise.resolve({ default: WITH_META_FULL })\nconst WITH_BASE = { url: null }\n${RUNTIME}\n` +
    styleNames.map((s, k) => `registerVariant(${J(s)}, WITH_D${k})\n`).join('') +
    `/** Synchronous SVG string (full bundle only). Throws on unknown or ambiguous names. */\n` +
    `function svg(name, options) {\n  const o = options || {}\n  const v = withHas(STYLES, o.variant) ? o.variant : DEFAULT_STYLE\n  const map = WITH_DATA[v]\n  const n = withHas(map, name) ? name : withLookup(name, k => withHas(map, k), WITH_META_FULL.names, WITH_META_FULL.aliases)\n  return withRenderSvg(map[n], v, o)\n}\n` +
    `defineWithIcon()\nexport { ${exportsList}, svg }\n`
  out.add('full.js', fullJs)

  const dts = `${namesAndAliasesDts(ctx)}
export interface SvgOptions {
  /** Style. Default 'line'. */
  variant?: StyleName
  /** Width and height (number = px, or any CSS length). Default 24. */
  size?: number | string
  /** Default 'currentColor'. */
  color?: string
  /** Only affects styles with live strokes. */
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  /** Accessible name (role="img" aria-label). Without it the svg is aria-hidden. */
  label?: string
  class?: string
}
/** <with-icon name="home" variant="solid" size="24" color="" stroke-width="" absolute-stroke-width label="" mirror-rtl> */
export declare class WithIconElement extends HTMLElement {
  /** Canonical name or unambiguous alias. */
  name: IconName | IconAlias | (string & {}) | null
  variant: StyleName | null
  size: string | null
  color: string | null
  strokeWidth: string | null
  /** Accessible name on the inner svg (role="img"). aria-label / aria-labelledby on the element work too. */
  label: string | null
  /** Mirror the icon when it sits in right-to-left text (for directional icons). */
  mirrorRtl: string | null
}
/** Registers the element (done automatically for 'with-icon'; safe to call again, no-op without a DOM). */
export declare function defineWithIcon(tagName?: string): void
/** Load (once) the data chunk for a style: { name: inner svg markup }. */
export declare function loadVariant(variant: StyleName): Promise<Record<IconName, string>>
/** Register your own icons (inner svg markup on a 24x24 grid) under a style. */
export declare function registerVariant(variant: StyleName, icons: Record<string, string>): void
/** Resolve a name or alias and return a complete <svg> string. */
export declare function loadSvg(name: IconName | IconAlias | (string & {}), options?: SvgOptions): Promise<string>
/**
 * Where per-icon files load from: the URL of a dist/ folder (a CDN or your own copy of it), e.g.
 * setIconBase('/vendor/withicons/web/dist/'). Detected automatically when this module itself is served from a CDN or an
 * unbundled node_modules copy; null switches back to the per-style chunks (what bundled apps use).
 */
export declare function setIconBase(url: string | null): void
export declare const styleNames: StyleName[]
declare global {
  interface HTMLElementTagNameMap { 'with-icon': WithIconElement }
}
`
  out.add('index.d.ts', dts)
  out.add('cdn.d.ts', `export * from './index.js'
`)
  out.add('full.d.ts', `export * from './index.js'\nimport type { IconName, IconAlias, SvgOptions } from './index.js'\n/** Synchronous SVG string. Throws on unknown or ambiguous names. */\nexport declare function svg(name: IconName | IconAlias | (string & {}), options?: SvgOptions): string\n`)
  await out.flush()

  const pkg = {
    ...basePkg(ctx, '@withicons/web', `<with-icon> custom element: ${ctx.icons.length} icons x ${styleNames.length} styles, zero dependencies, lazy per-style data.`, ['web-components', 'custom-elements', 'cdn', 'css-icons', 'icon-classes', 'font-awesome-alternative',
      ...styleNames, 'multicolor-icons', 'animated-icons']),
    type: 'module',
    sideEffects: ['./dist/index.js', './dist/cdn.js', './dist/full.js'],
    main: './dist/index.js', module: './dist/index.js', types: './dist/index.d.ts',
    exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
      './cdn': { types: './dist/cdn.d.ts', default: './dist/cdn.js' },
      './full': { types: './dist/full.d.ts', default: './dist/full.js' },
      './data/*': { types: './dist/data/*.d.ts', default: './dist/data/*.js' },
      './icons/*': './dist/icons/*',
      './package.json': './package.json',
    },
    typesVersions: { '*': { cdn: ['./dist/cdn.d.ts'], full: ['./dist/full.d.ts'], 'data/*': ['./dist/data/*.d.ts'] } },
    files: ['dist', 'README.md', 'LICENSE'],
    // the bare CDN URL (cdn.jsdelivr.net/npm/@withicons/web) serves the few-KB per-icon entry, never every style
    unpkg: './dist/cdn.js', jsdelivr: './dist/cdn.js',
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  const kb = f => Math.round(Buffer.byteLength(f) / 1024)
  const gz = f => Math.round(zlib.gzipSync(f, { level: 9 }).length / 1024)
  const chunks = styleNames.filter(s => !shards[s]).map(s => J(data[s]))
  const sharded = styleNames.filter(s => shards[s])
  const sizes = {
    entry: kb(indexJs), entryGz: Math.max(1, gz(indexJs)),
    line: kb(J(data[ctx.defaultStyle])), lineGz: gz(J(data[ctx.defaultStyle])),
    max: Math.max(...chunks.map(kb)), maxGz: Math.max(...chunks.map(gz)),
    sharded, shardMax: kb(shardJson.reduce((a, b) => b.length > a.length ? b : a, '')), shardMaxGz: Math.max(0, ...shardJson.map(gz)),
    shardAvg: Math.round(shardJson.reduce((a, b) => a + Buffer.byteLength(b), 0) / Math.max(1, shardJson.length) / 1024),
    meta: kb(J(meta)), metaGz: gz(J(meta)),
    full: kb(styleNames.map(s => J(data[s])).join('')), fullGz: gz(styleNames.map(s => J(data[s])).join('')),
    cdn: kb(cdnJs), cdnGz: Math.max(1, gz(cdnJs)),
    alias: Math.max(...aliasParts.map(p => kb(J(p)))),
  }
  // per-icon files: typical (median) size in the default style and in the heaviest style, in bytes
  const bytes = t => Buffer.byteLength(t), gzb = t => zlib.gzipSync(t, { level: 9 }).length
  const med = a => a.sort((x, y) => x - y)[a.length >> 1]
  const iconFile = (st, n) => `export default ${J(data[st][n])}\n`
  const heavy = styleNames.reduce((a, b) => bytes(J(data[b])) > bytes(J(data[a])) ? b : a)
  sizes.icon = {
    line: med(ctx.icons.map(i => bytes(iconFile(ctx.defaultStyle, i.name)))), lineGz: med(ctx.icons.map(i => gzb(iconFile(ctx.defaultStyle, i.name)))),
    heavy, heavyRaw: med(ctx.icons.map(i => bytes(iconFile(heavy, i.name)))), heavyGz: med(ctx.icons.map(i => gzb(iconFile(heavy, i.name)))),
  }
  writePkg(ctx, 'web', pkg, readme(ctx, sizes))
  return `index.js + cdn.js + full.js + ${styleNames.length} lazy chunks + ${styleNames.length * ctx.icons.length} per-icon files`
}

function readme(ctx, z) {
  const v = ctx.version
  const pal = paletteDoc(ctx)
  // palette variables that default to currentColor (they follow `color`), unless paletteDoc already lists them
  const followers = ctx.styles.filter(s => s.palette)
    .flatMap(s => Object.entries(s.vars || {}).filter(([k, val]) => val === 'currentColor' && !pal.includes(k + '`')).map(([k]) => '`' + k + '`'))
  return `# @withicons/web

\`<with-icon>\`: a dependency-free custom element for ${ctx.icons.length} icons x ${ctx.styles.length} styles. Works in any framework or none.

\`\`\`html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@${v}/dist/cdn.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
\`\`\`

From a CDN the page downloads only what it shows: \`cdn.js\` (${z.cdn} KB, ${z.cdnGz} KB gzip) plus one small file per icon
and style it renders (\`dist/icons/<style>/<name>.js\`). A \`${ctx.defaultStyle}\` icon is typically ${z.icon.line} bytes (${z.icon.lineGz} gzip);
a \`${z.icon.heavy}\` icon, the richest style, about ${(z.icon.heavyRaw / 1024).toFixed(1)} KB (${(z.icon.heavyGz / 1024).toFixed(1)} KB gzip). Five \`${ctx.defaultStyle}\` icons cost about
${Math.round(z.cdnGz + 5 * z.icon.lineGz / 1024)} KB gzipped in all. The URLs are versioned, so the CDN and the browser cache them for good.
\`dist/index.js\` works from a CDN too (it switches to the same per-icon files when it is served from one) but also carries
the bundler chunk table (${z.entry} KB, ${z.entryGz} KB gzip).

Or with a bundler:

\`\`\`bash
npm i @withicons/web
\`\`\`
\`\`\`js
import '@withicons/web'   // registers <with-icon>; each style's data loads on first use
\`\`\`

## Attributes

| attribute | default | notes |
|---|---|---|
| \`name\` | — | canonical name or unambiguous alias (\`bin\` -> \`trash\`) |
| \`variant\` | \`line\` | ${ctx.styles.map(s => '`' + s.name + '`').join(', ')} (\`style\` is reserved in HTML) |
| \`size\` | \`24\` | px number or any CSS length |
| \`color\` | \`currentColor\` | inherits the CSS text color by default |
| \`stroke-width\` | style default | only styles with live strokes (${ctx.styles.filter(s => typeof s.strokeWidth === 'number').map(s => s.name).join(', ')}) |
| \`absolute-stroke-width\` | off | keep the stroke constant in px at any size |
| \`label\` | — | accessible name on the inner svg (\`role="img"\`); otherwise the svg is \`aria-hidden\` |
| \`aria-label\` / \`aria-labelledby\` | — | also work: the element itself becomes \`role="img"\` with that name |
| \`mirror-rtl\` | off | mirror the icon in right-to-left text (\`dir="rtl"\`), for directional icons such as \`arrow-right\` or \`undo\` |

The same names work as JS properties (\`el.variant = 'solid'\`, \`el.strokeWidth = 1.5\`, \`el.mirrorRtl = true\`).
Style the inner svg with \`with-icon::part(svg)\`:

\`\`\`css
with-icon::part(svg) { transition: transform .2s }
button:hover with-icon::part(svg) { transform: scale(1.1) }
\`\`\`

Unknown names render nothing and log one console warning with the nearest matches.

## Entry points

| import | what | size |
|---|---|---|
| \`@withicons/web/cdn\` (\`dist/cdn.js\`) | element; every icon loads its own file (\`dist/icons/<style>/<name>.js\`). For \`<script type="module">\` from a CDN or a self-hosted copy of \`dist/\` | ${z.cdn} KB (${z.cdnGz} KB gzip) + ~${z.icon.lineGz} bytes gzip per \`${ctx.defaultStyle}\` icon shown |
| \`@withicons/web\` (\`dist/index.js\`) | element + lazy per-style chunks (\`dist/data/<style>.js\`); per-icon files when served unbundled from a CDN | ${z.entry} KB (${z.entryGz} KB gzip) + one chunk per style used: \`${ctx.defaultStyle}\` ${z.line} KB (${z.lineGz} KB gzip), the largest ${z.max} KB (${z.maxGz} KB gzip)${z.sharded.length ? `; a heavy style loads one small shard per icon used (~${z.shardAvg} KB, at most ${z.shardMax} KB / ${z.shardMaxGz} KB gzip)` : ''} |
| \`@withicons/web/full\` (\`dist/full.js\`) | every style registered up front (static imports of the chunks), adds sync \`svg(name, opts)\` | every icon of every style: ~${Math.round(z.full / 1024)} MB (${Math.round(z.fullGz / 1024)} MB gzip). For scripts and tools, never for a web page |

A style's chunk loads once, the first time an icon of that style renders.${z.sharded.length ? ` The heavy styles (${z.sharded.map(s => '`' + s + '`').join(', ')})
are split into shards of a few icons each (\`dist/data/<style>/<n>.js\`): an icon loads only its own shard, so one \`luxe\`
icon costs a few KB instead of the whole style. \`loadVariant()\` and \`@withicons/web/data/<style>\` still return the whole style.` : ''} Canonical names resolve with no
extra download (the entry knows every name); an alias loads one small shard (\`dist/data/alias/<n>.js\`, at most ${z.alias} KB), and
only a typo loads \`dist/data/meta.js\` (${z.meta} KB, ${z.metaGz} KB gzip) for the "did you mean" warning. Bundlers (Vite, webpack,
Rollup, esbuild) split the chunks automatically. Use \`full\` only for scripts and tools that need the sync \`svg()\`.

**Per-icon files.** \`cdn.js\` always loads icons from \`icons/<style>/<name>.js\` next to itself. \`index.js\` does the same when
it is served unbundled from a package path (jsDelivr, unpkg, \`/node_modules/@withicons/web/dist/index.js\`); in a bundled app
it uses the chunks. Self-hosting \`dist/\` under another path? Use \`cdn.js\`, or call \`setIconBase('/vendor/withicons/dist/')\`.
Loads are de-duplicated and kept in memory, so ten \`home\` icons cost one request.

SSR-safe: importing never touches the DOM; the element is only defined when \`customElements\` exists, so the same import
works in Node, Deno and edge runtimes, where \`loadSvg\` returns plain markup:

\`\`\`js
import { loadSvg } from '@withicons/web'
const markup = await loadSvg('home', { variant: 'solid', size: 20 })
\`\`\`
${pal}${followers.length ? `
${followers.join(', ')} default to \`currentColor\`, so they follow \`color\` unless you set them.
` : ''}${motionDoc(ctx)}
With \`<with-icon>\`, add the element module once and use attributes (it needs \`motion.css\`; each icon's own defaults come
from \`icons.css\`, or, from a CDN, the element links just \`icons/<name>.css\` for each animated icon):

\`\`\`js
import '@withicons/motion/element'
\`\`\`
\`\`\`html
<with-icon name="bell" motion="loop"></with-icon>
<with-icon name="bell" motion="hover" preset="shake"></with-icon>
<with-icon name="play" swap-to="pause" swap-effect="flip" swap-trigger="click" aria-label="Play"></with-icon>
\`\`\`

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}
