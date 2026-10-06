// <with-live-icon> in a tiny DOM stub, the lite build's lazy styles, the classic CDN script, and the React/Vue wrappers
// against stub modules (no react/vue install needed).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { register } from 'node:module'
import { load, read, dist } from './_setup.mjs'

// ---- DOM stub
class FakeShadow { constructor() { this.innerHTML = '' } get firstChild() { return this.innerHTML ? {} : null } }
class FakeElement {
  constructor() { this._attrs = new Map(); this.isConnected = false; this.shadowRoot = null; this.events = [] }
  getAttribute(n) { return this._attrs.has(n) ? this._attrs.get(n) : null }
  hasAttribute(n) { return this._attrs.has(n) }
  setAttribute(n, v) { const old = this.getAttribute(n); this._attrs.set(n, String(v)); this._changed(n, old) }
  removeAttribute(n) { const old = this.getAttribute(n); this._attrs.delete(n); this._changed(n, old) }
  _changed(n, old) { if (this.constructor.observedAttributes.includes(n) && this.attributeChangedCallback) this.attributeChangedCallback(n, old, this.getAttribute(n)) }
  attachShadow() { return (this.shadowRoot = new FakeShadow()) }
  dispatchEvent(e) { this.events.push(e); return true }
  connect() { this.isConnected = true; this.connectedCallback() }
}
const registry = new Map()
globalThis.HTMLElement = FakeElement
globalThis.customElements = { define: (n, c) => registry.set(n, c), get: n => registry.get(n) }
globalThis.CustomEvent ??= class CustomEvent { constructor(type, o) { this.type = type; this.detail = o?.detail } }

const E = await load('element.js')
const L = await load('lite.js')
const name = L.list()[0]
const meta = L.get(name)
const until = async (fn, ms = 5000) => { const t = Date.now(); while (!fn()) { if (Date.now() - t > ms) throw new Error('timeout'); await new Promise(r => setTimeout(r, 10)) } }

test('element is defined once and observes every param attribute', () => {
  const C = registry.get('with-live-icon')
  assert.ok(C)
  E.defineLiveIcon()
  E.defineLiveIcon('my-live-icon')
  assert.ok(registry.get('my-live-icon'))
  for (const k of Object.keys(meta.params)) assert.ok(C.observedAttributes.some(a => a === L.paramAttr(k) || a === 'param-' + L.paramAttr(k)), k)
})

test('element renders params from attributes and re-renders on change', () => {
  const C = registry.get('with-live-icon')
  const el = new C()
  el.setAttribute('name', name)
  el.setAttribute('size', '40')
  el.connect()
  const first = el.shadowRoot.innerHTML
  assert.match(first, /<svg[^>]*width="40"/)
  assert.ok(first.includes(L.parts(name, {}, 'line').inner))
  const ex = meta.examples.find(x => L.render(name, x) !== L.render(name, {})) || meta.examples[0]
  for (const [k, v] of Object.entries(ex)) el.setAttribute(L.paramAttr(k), String(v))
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(name, ex, 'line').inner), 'attributes reach the drawing')
  assert.equal(el.events.at(-1).type, 'with-live-render')
  // JSON params
  const el2 = new C()
  el2.setAttribute('name', name)
  el2.params = ex
  el2.connect()
  assert.ok(el2.shadowRoot.innerHTML.includes(L.parts(name, ex, 'line').inner))
  // label + aria
  el.setAttribute('label', 'Live')
  assert.match(el.shadowRoot.innerHTML, /role="img" aria-label="Live"/)
})

test('element loads other styles lazily and ignores unknown names', async () => {
  const C = registry.get('with-live-icon')
  const el = new C()
  el.setAttribute('name', name)
  el.setAttribute('variant', 'kawaii')
  el.connect()
  await until(() => L.loaded('kawaii') && el.shadowRoot.innerHTML.includes('<path'))
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(name, {}, 'kawaii').inner))
  const warn = console.warn; const seen = []; console.warn = m => seen.push(m)
  try {
    const bad = new C(); bad.setAttribute('name', 'zzz-nope'); bad.connect()
    assert.ok(bad.shadowRoot.innerHTML.indexOf('<svg') < 0)
    const v = new C(); v.setAttribute('name', name); v.setAttribute('variant', 'zzz'); v.connect()
    assert.match(v.shadowRoot.innerHTML, /<svg/)
  } finally { console.warn = warn }
  assert.ok(seen.some(m => /unknown live icon/.test(m)) && seen.some(m => /unknown variant/.test(m)))
})

test('lite: render throws for a style not loaded, load() fixes it, renderAsync works', async () => {
  const s = L.styles.map(x => x.name).find(n => !L.loaded(n))
  if (!s) return
  assert.throws(() => L.render(name, {}, s), e => e.code === 'WITH_STYLE_NOT_LOADED')
  const svg = await L.renderAsync(name, {}, s)
  assert.match(svg, /^<svg/)
  assert.ok(L.loaded(s))
  await assert.rejects(L.load('zzz'), e => e.code === 'WITH_UNKNOWN_STYLE')
})

test('cdn script: window.WithLive in a classic-script sandbox, styles via injected <script>', async () => {
  const appended = []
  const sandbox = {
    console, setTimeout,
    document: { currentScript: { src: 'https://x.test/vendor/dynamic/dynamic.js?v=1' }, createElement: () => ({}), head: { appendChild: s => appended.push(s) } },
  }
  sandbox.globalThis = sandbox; sandbox.window = sandbox
  vm.createContext(sandbox)
  vm.runInContext(read('cdn/dynamic.js'), sandbox)
  const W = sandbox.WithLive
  assert.ok(W && typeof W.render === 'function')
  assert.equal(W.render(name, {}, 'line'), L.render(name, {}, 'line'))
  const p = W.load('solid')
  await until(() => appended.length)
  assert.equal(appended[0].src, 'https://x.test/vendor/dynamic/styles/solid.js')
  vm.runInContext(read('cdn/styles/solid.js'), sandbox)
  appended[0].onload()
  await p
  const E2 = await load('index.js')
  assert.equal(W.render(name, {}, 'solid'), E2.render(name, {}, 'solid'))
})

// ---- framework wrappers against stubs
const stubs = {
  react: `export const createElement = (type, props, ...children) => ({ type, props: props || {}, children })
export const useState = v => [v, () => {}]
export const useEffect = () => {}
export const useRef = v => ({ current: v })`,
  vue: `export const defineComponent = c => c
export const h = (type, props) => ({ type, props })
export const ref = v => ({ value: v })
export const mergeProps = (...ps) => Object.assign({}, ...ps)
export const onBeforeUnmount = () => {}`,
}
register('data:text/javascript,' + encodeURIComponent(`
const stubs = ${JSON.stringify(stubs)}
export async function resolve(spec, ctx, next) { return stubs[spec] ? { url: 'data:text/javascript,' + encodeURIComponent(stubs[spec]), shortCircuit: true } : next(spec, ctx) }`))

test('React wrapper: params are props, the rest goes on the svg', async () => {
  const { LiveIcon } = await import(new URL('file:///' + dist.replace(/\\/g, '/') + '/react.js').href)
  const ex = meta.examples[0]
  const el = LiveIcon({ name, ...ex, size: 32, className: 'x', onClick: 1, 'data-k': 'v', label: 'L' })
  assert.equal(el.type, 'svg')
  assert.equal(el.props.width, 32)
  assert.equal(el.props.className, 'x')
  assert.equal(el.props.onClick, 1)
  assert.equal(el.props['data-k'], 'v')
  assert.equal(el.props['aria-label'], 'L')
  assert.equal(el.props.strokeWidth, 1.75)
  assert.equal(el.props.dangerouslySetInnerHTML.__html, L.parts(name, ex, 'line').inner)
  for (const k of Object.keys(ex)) assert.ok(!(k in el.props) || k === 'size', `param ${k} leaked to the svg`)
  // a style that is not loaded yet: an empty placeholder svg
  const s = L.styles.map(x => x.name).find(n => !L.loaded(n))
  if (s) { const ph = LiveIcon({ name, variant: s }); assert.equal(ph.props.dangerouslySetInnerHTML, undefined) }
})

test('Vue wrapper: attrs that are params become params', async () => {
  const { LiveIcon } = await import(new URL('file:///' + dist.replace(/\\/g, '/') + '/vue.js').href)
  const ex = meta.examples[0]
  const attrs = Object.fromEntries(Object.entries(ex).map(([k, v]) => [L.paramAttr(k), v]))
  attrs.class = 'c'
  const renderFn = LiveIcon.setup({ name, size: 24, variant: 'line' }, { attrs })
  const vnode = renderFn()
  assert.equal(vnode.type, 'svg')
  assert.equal(vnode.props.innerHTML, L.parts(name, ex, 'line').inner)
  assert.equal(vnode.props.class, 'c')
})

test('element `today` uses the clock and redraws each minute until disconnected', () => {
  const dated = L.catalog().find(m => 'day' in m.params && 'month' in m.params)
  if (!dated) return
  const C = registry.get('with-live-icon')
  const el = new C()
  el.setAttribute('name', dated.name)
  el.today = true
  el.connect()
  const n = L.now()
  const want = Object.fromEntries(Object.keys(n).filter(k => k in dated.params).map(k => [k, n[k]]))
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(dated.name, want, 'line').inner))
  assert.ok(el._timer, 'a redraw is scheduled')
  el.isConnected = false
  el.disconnectedCallback()
  assert.ok(!el._timer, 'timer cleared on disconnect')
})
