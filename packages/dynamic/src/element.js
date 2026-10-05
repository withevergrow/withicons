// <with-live-icon>: a dependency-free custom element for Live icons.
//   <with-live-icon name="calendar-date" day="17" month="MAR" variant="glass" size="48" label="17 March"></with-live-icon>
// Params are attributes (camelCase params as kebab-case: maxLength -> max-length) or one JSON `params` attribute.
// `today` on a date-like icon fills day/month/weekday from the viewer's clock. Styles load on first use.
// When a param is set more than once (an attribute, the JSON `params`, `today`), the one set last wins.
// Styles slower than a frame (glass, luxe, bauhaus...) draw off the main thread when the build has a worker, else one
// icon per task; the previous drawing stays up meanwhile, so a page of rich icons never freezes on one long task.
import * as L from './core.js'

const BASE_ATTRS = ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'params', 'today', 'vars']
const warned = Object.create(null)
const warnOnce = m => { if (warned[m] || typeof console === 'undefined') return; warned[m] = 1; console.warn(m) }
// a param whose attribute would clash with a built-in one (size, color, label...) is read from param-<name>
const attrFor = a => BASE_ATTRS.includes(a) ? 'param-' + a : a
const Base = typeof HTMLElement === 'undefined' ? class {} : HTMLElement
let SEQ = 0

export class WithLiveIconElement extends Base {
  static get observedAttributes() { return BASE_ATTRS.concat(L.paramAttributes().map(attrFor)) }
  connectedCallback() { this._render() }
  disconnectedCallback() { clearTimeout(this._timer); this._timer = 0 }
  attributeChangedCallback(n) { (this._seq || (this._seq = Object.create(null)))[n] = ++SEQ; if (this.isConnected) this._render() }
  // `today`: redraw at the next minute boundary, so clocks and calendars stay current while on screen
  _schedule(meta) {
    clearTimeout(this._timer); this._timer = 0
    const on = this.hasAttribute('today') && this.getAttribute('today') !== 'false'
    if (!on || !meta || !this.isConnected || typeof setTimeout !== 'function') return
    if (!['time', 'day', 'month', 'weekday', 'year'].some(k => k in meta.params)) return
    this._timer = setTimeout(() => { this._timer = 0; if (this.isConnected) this._render() }, 60000 - (Date.now() % 60000) + 50)
  }
  /** the params this element currently asks for (before defaults are filled in) */
  get params() {
    const name = (this.getAttribute('name') || '').trim()
    let meta = null
    try { meta = L.get(name) } catch (e) { /* ambiguous: reported on render */ }
    const out = {}, seq = this._seq || {}
    // sources in the order they were set (ties: params, then today, then single attributes)
    const layers = []
    const json = this.getAttribute('params')
    if (json) {
      try { const v = JSON.parse(json); if (v && typeof v === 'object') layers.push([seq.params || 0, 0, v]) } catch (e) { warnOnce('with icons live: params="' + json + '" is not JSON') }
    }
    if (meta) {
      if (this.hasAttribute('today') && this.getAttribute('today') !== 'false') {
        const n = L.now(), v = {}
        for (const k in n) if (k in meta.params) v[k] = n[k]
        layers.push([seq.today || 0, 1, v])
      }
      for (const k in meta.params) { const a = attrFor(L.paramAttr(k)); if (this.hasAttribute(a)) layers.push([seq[a] || 0, 2, { [k]: this.getAttribute(a) }]) }
    }
    layers.sort((x, y) => x[0] - y[0] || x[1] - y[1])
    for (const l of layers) Object.assign(out, l[2])
    return out
  }
  set params(v) { if (v == null) this.removeAttribute('params'); else this.setAttribute('params', typeof v === 'string' ? v : JSON.stringify(v)) }
  _a11y() {
    const named = !this.getAttribute('label') && (this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby'))
    let i = this._internals
    if (i === undefined) {
      try { i = typeof this.attachInternals === 'function' ? this.attachInternals() : null } catch (e) { i = null }
      this._internals = i
    }
    if (i && 'role' in i) i.role = named ? 'img' : null
    else if (named && !this.hasAttribute('role')) { this.setAttribute('role', 'img'); this._role = 1 }
    else if (!named && this._role) { this.removeAttribute('role'); this._role = 0 }
    return named
  }
  _render() {
    const named = this._a11y()
    const name = (this.getAttribute('name') || '').trim()
    let v = this.getAttribute('variant') || L.defaultStyle
    if (!L.styles.some(s => s.name === v)) { warnOnce('with icons live: unknown variant "' + v + '". Use one of: ' + L.styleNames().join(', ') + '. Falling back to "' + L.defaultStyle + '".'); v = L.defaultStyle }
    const size = this.getAttribute('size') || 24
    const css = /^\s*\d*\.?\d+\s*$/.test(String(size)) ? parseFloat(size) + 'px' : String(size).replace(/[;{}<>]/g, '')
    let vars
    const rawVars = this.getAttribute('vars')
    if (rawVars) { try { vars = JSON.parse(rawVars) } catch (e) { warnOnce('with icons live: vars="' + rawVars + '" is not JSON') } }
    const o = {
      size, color: this.getAttribute('color'), strokeWidth: this.getAttribute('stroke-width'), vars,
      absoluteStrokeWidth: this.hasAttribute('absolute-stroke-width') && this.getAttribute('absolute-stroke-width') !== 'false',
      label: named ? null : this.getAttribute('label'), part: 'svg',
    }
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' })
    const token = this._token = (this._token || 0) + 1
    const paint = svg => {
      if (token !== this._token) return
      const html = '<style>:host{display:inline-block;width:' + css + ';height:' + css + ';line-height:0;vertical-align:middle;flex-shrink:0}svg{display:block;width:100%;height:100%}</style>' + svg
      if (html !== this._html) { root.innerHTML = html; this._html = html }
    }
    if (!name) return paint('')
    let params
    try {
      if (!L.resolveName(name)) throw Object.assign(new Error('with icons live: unknown live icon "' + name + '". Did you mean: ' + L.suggest(name).join(', ') + '?'), { code: 'WITH_UNKNOWN_ICON' })
      params = this.params
    } catch (e) { warnOnce(e.message); return paint('') }
    this._schedule(L.get(name))
    const draw = () => {
      if (token !== this._token) return
      try { paint(L.render(name, params, v, o)) } catch (e) { warnOnce(e.message); paint('') }
      if (typeof this.dispatchEvent === 'function' && typeof CustomEvent === 'function') this.dispatchEvent(new CustomEvent('with-live-render', { detail: { name, variant: v, params: L.resolve(name, params) } }))
    }
    // cheap or already drawn: now. Otherwise keep what is shown and draw in the background (newest request wins).
    if (L.loaded(v) && (L.cached(name, params, v) || (L.iconLoaded(name) && L.cost(v) <= 16))) return draw()
    if (!this._html) paint(L.placeholder(o))
    // cheap styles draw here once the style (and, in the CDN lite script, the icon's code) is loaded; rich ones in the background
    const job = L.cost(v) <= 16 ? Promise.all([L.load(v), L.loadIcon(name)]).then(() => true) : L.warm(name, params, v, { owner: this })
    job.then(ok => { if (ok) draw() }, e => { if (token === this._token) { warnOnce(e.message); paint('') } })
  }
}
// JS properties mirror the attributes: el.variant = 'glass', el.size = 48
for (const [p, a] of Object.entries({ name: 'name', variant: 'variant', size: 'size', color: 'color', strokeWidth: 'stroke-width', label: 'label', today: 'today' })) {
  Object.defineProperty(WithLiveIconElement.prototype, p, {
    configurable: true,
    get() { return p === 'today' ? this.hasAttribute(a) && this.getAttribute(a) !== 'false' : this.getAttribute(a) },
    set(val) { if (val == null || val === false) this.removeAttribute(a); else this.setAttribute(a, val === true ? '' : String(val)) },
  })
}
/** Define the element (default tag with-live-icon). Safe to call twice and in Node (no-op without customElements). */
export function defineLiveIcon(tagName) {
  const tag = tagName || 'with-live-icon'
  if (typeof customElements === 'undefined' || customElements.get(tag)) return
  customElements.define(tag, tag === 'with-live-icon' ? WithLiveIconElement : class extends WithLiveIconElement {})
}
