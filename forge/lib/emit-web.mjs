// emit-web — @withicons/web: a dependency-free <with-icon> custom element.
//   dist/index.js         element + lazy per-style data chunks (auto-defines <with-icon>; SSR-safe)
//   dist/full.js          element + every style inline, single file, for a CDN <script type="module">
//   dist/data/<style>.js  { name: '<inner svg markup>' }   (lazy chunk)
//   dist/data/meta.js     { names, aliases }                (lazy chunk, only for alias/typo resolution)
import { J, LOOKUP_SRC, distWriter, basePkg, writePkg, styleTable, innerOf, namesAndAliasesDts } from './emit-core.mjs'

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
function loadVariant(variant) {
  const v = variant || DEFAULT_STYLE
  if (WITH_DATA[v]) return Promise.resolve(WITH_DATA[v])
  if (!withHas(LOADERS, v)) return Promise.reject(new Error('with icons: unknown variant "' + v + '". Use one of: ' + Object.keys(STYLES).join(', ') + '.'))
  return WITH_PENDING[v] || (WITH_PENDING[v] = LOADERS[v]().then(m => (WITH_DATA[v] = Object.assign(m.default, WITH_DATA[v] || {}))))
}
function registerVariant(variant, map) { WITH_DATA[variant] = Object.assign(WITH_DATA[variant] || {}, map) }
function withLoadMeta() {
  if (WITH_META.value) return Promise.resolve(WITH_META.value)
  return WITH_META.pending || (WITH_META.pending = LOAD_META().then(m => (WITH_META.value = m.default)))
}
function withResolveName(name, variant) {
  return loadVariant(variant).then(map => withHas(map, name) ? name
    : withLoadMeta().then(meta => withLookup(name, k => withHas(map, k), meta.names, meta.aliases)))
}
function loadSvg(name, options) {
  const o = options || {}
  const v = o.variant || DEFAULT_STYLE
  return withResolveName(name, v).then(n => withRenderSvg(WITH_DATA[v][n], v, o))
}
const WithBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement
class WithIconElement extends WithBase {
  static get observedAttributes() { return ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label'] }
  connectedCallback() { this._withRender() }
  attributeChangedCallback() { if (this.isConnected) this._withRender() }
  _withRender() {
    const name = this.getAttribute('name') || ''
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
      label: this.getAttribute('label'), part: 'svg',
    }
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' })
    const token = this._withToken = (this._withToken || 0) + 1
    const paint = inner => {
      if (token !== this._withToken) return
      root.innerHTML = '<style>:host{display:inline-block;width:' + css + ';height:' + css + ';line-height:0;vertical-align:middle;flex-shrink:0}svg{display:block;width:100%;height:100%}</style>' +
        (inner == null ? '' : withRenderSvg(inner, v, o))
    }
    const map = WITH_DATA[v]
    if (withHas(map, name)) return paint(map[name])
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
  const map = { name: 'name', variant: 'variant', size: 'size', color: 'color', strokeWidth: 'stroke-width', label: 'label' }
  for (const p in map) {
    Object.defineProperty(WithIconElement.prototype, p, {
      configurable: true,
      get() { return this.getAttribute(map[p]) },
      set(val) { if (val == null || val === false) this.removeAttribute(map[p]); else this.setAttribute(map[p], String(val)) },
    })
  }
}

const RUNTIME = [LOOKUP_SRC, withWarnOnce, 'withWarnOnce.seen = {}', withHas, withRenderSvg,
  'const WITH_DATA = {}', 'const WITH_PENDING = {}', 'const WITH_META = { value: null, pending: null }',
  loadVariant, registerVariant, withLoadMeta, withResolveName, loadSvg,
  "const WithBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement", WithIconElement, defineWithIcon, withProps, 'withProps()',
].map(String).join('\n')

export default async function emit(ctx) {
  const P = 'packages/web'
  const out = distWriter(ctx, P + '/dist')
  const styleNames = ctx.styles.map(s => s.name)
  const header = `// @withicons/web ${ctx.version} — generated, do not edit. MIT.\n`
  const head = `const DEFAULT_STYLE = ${J(ctx.defaultStyle)}\nconst STYLES = ${J(styleTable(ctx))}\nconst styleNames = ${J(styleNames)}\n`
  const aliases = {}
  for (const k of Object.keys(ctx.aliasIndex).sort()) aliases[k] = ctx.aliasIndex[k]
  const meta = { names: ctx.icons.map(i => i.name), aliases }
  const data = {}
  for (const s of styleNames) {
    data[s] = {}
    for (const i of ctx.icons) data[s][i.name] = innerOf(ctx, i, s)
    out.add(`data/${s}.js`, `${header}export default ${J(data[s])}\n`)
    out.add(`data/${s}.d.ts`, `import type { IconName } from '../index.js'\ndeclare const data: Record<IconName, string>\nexport default data\n`)
  }
  out.add('data/meta.js', `${header}export default ${J(meta)}\n`)
  out.add('data/meta.d.ts', `import type { IconName } from '../index.js'\ndeclare const meta: { names: IconName[]; aliases: Record<string, IconName[]> }\nexport default meta\n`)

  const exportsList = 'WithIconElement, defineWithIcon, loadVariant, registerVariant, loadSvg, styleNames'
  out.add('index.js', `${header}${head}const LOADERS = { ${styleNames.map(s => `${J(s)}: () => import('./data/${s}.js')`).join(', ')} }\n` +
    `const LOAD_META = () => import('./data/meta.js')\n${RUNTIME}\ndefineWithIcon()\nexport { ${exportsList} }\n`)
  const fullData = styleNames.map(s => `registerVariant(${J(s)}, ${J(data[s])})`).join('\n')
  out.add('full.js', `${header}${head}const LOADERS = {}\nconst LOAD_META = () => Promise.resolve({ default: WITH_META_FULL })\nconst WITH_META_FULL = ${J(meta)}\n${RUNTIME}\n${fullData}\n` +
    `/** Synchronous SVG string (full bundle only). Throws on unknown or ambiguous names. */\n` +
    `function svg(name, options) {\n  const o = options || {}\n  const v = withHas(STYLES, o.variant) ? o.variant : DEFAULT_STYLE\n  const map = WITH_DATA[v]\n  const n = withHas(map, name) ? name : withLookup(name, k => withHas(map, k), WITH_META_FULL.names, WITH_META_FULL.aliases)\n  return withRenderSvg(map[n], v, o)\n}\n` +
    `defineWithIcon()\nexport { ${exportsList}, svg }\n`)

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
/** <with-icon name="home" variant="solid" size="24" color="" stroke-width="" absolute-stroke-width label=""> */
export declare class WithIconElement extends HTMLElement {
  name: string | null
  variant: StyleName | null
  size: string | null
  color: string | null
  strokeWidth: string | null
  label: string | null
}
/** Registers the element (done automatically for 'with-icon'; safe to call again, no-op without a DOM). */
export declare function defineWithIcon(tagName?: string): void
/** Load (once) the data chunk for a style: { name: inner svg markup }. */
export declare function loadVariant(variant: StyleName): Promise<Record<IconName, string>>
/** Register your own icons (inner svg markup on a 24x24 grid) under a style. */
export declare function registerVariant(variant: StyleName, icons: Record<string, string>): void
/** Resolve a name or alias and return a complete <svg> string. */
export declare function loadSvg(name: IconName | IconAlias | (string & {}), options?: SvgOptions): Promise<string>
export declare const styleNames: StyleName[]
declare global {
  interface HTMLElementTagNameMap { 'with-icon': WithIconElement }
}
`
  out.add('index.d.ts', dts)
  out.add('full.d.ts', `export * from './index.js'\nimport type { IconName, IconAlias, SvgOptions } from './index.js'\n/** Synchronous SVG string. Throws on unknown or ambiguous names. */\nexport declare function svg(name: IconName | IconAlias | (string & {}), options?: SvgOptions): string\n`)
  await out.flush()

  const pkg = {
    ...basePkg(ctx, '@withicons/web', `<with-icon> custom element: ${ctx.icons.length} icons x ${styleNames.length} styles, zero dependencies, lazy per-style data.`, ['web-components', 'custom-elements', 'cdn']),
    type: 'module',
    sideEffects: ['./dist/index.js', './dist/full.js'],
    main: './dist/index.js', module: './dist/index.js', types: './dist/index.d.ts',
    exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
      './full': { types: './dist/full.d.ts', default: './dist/full.js' },
      './data/*': { types: './dist/data/*.d.ts', default: './dist/data/*.js' },
      './package.json': './package.json',
    },
    typesVersions: { '*': { full: ['./dist/full.d.ts'], 'data/*': ['./dist/data/*.d.ts'] } },
    files: ['dist', 'README.md', 'LICENSE'],
    unpkg: './dist/full.js', jsdelivr: './dist/full.js',
  }
  const kb = f => Math.round(Buffer.byteLength(f) / 1024)
  writePkg(ctx, 'web', pkg, readme(ctx, kb(J(data[ctx.defaultStyle])), kb(styleNames.map(s => J(data[s])).join(''))))
  return `index.js + full.js + ${styleNames.length} lazy chunks`
}

function readme(ctx, lineKb, fullKb) {
  const v = ctx.version
  return `# @withicons/web

\`<with-icon>\`: a dependency-free custom element for ${ctx.icons.length} icons x ${ctx.styles.length} styles. Works in any framework or none.

\`\`\`html
<script type="module" src="https://cdn.jsdelivr.net/npm/@withicons/web@${v}/dist/index.js"></script>

<with-icon name="home"></with-icon>
<with-icon name="home" variant="solid" size="32" color="#e11d48" label="Home"></with-icon>
\`\`\`

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
| \`label\` | — | accessible name (\`role="img"\`); otherwise \`aria-hidden\` |

The same names work as JS properties (\`el.variant = 'solid'\`). Style the inner svg with \`with-icon::part(svg)\`.

## Entry points

| import | what | size |
|---|---|---|
| \`@withicons/web\` (\`dist/index.js\`) | element + lazy per-style chunks (\`dist/data/<style>.js\`) | tiny + ~${lineKb} KB per style used |
| \`@withicons/web/full\` (\`dist/full.js\`) | one file, every style inline, adds sync \`svg(name, opts)\` | ~${fullKb} KB |

SSR-safe: importing never touches the DOM; the element is only defined when \`customElements\` exists.

\`\`\`js
import { loadSvg } from '@withicons/web'
const markup = await loadSvg('home', { variant: 'solid', size: 20 })
\`\`\`

MIT licensed. [withicons.com](https://withicons.com) · [GitHub](https://github.com/withevergrow/withicons) · Powered by [Evergrow](https://withevergrow.com).
`
}
