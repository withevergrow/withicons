// <with-live-icon>: a dependency-free custom element for Live icons.
//   <with-live-icon name="calendar-date" day="17" month="MAR" variant="glass" size="48" label="17 March"></with-live-icon>
// Params are attributes (camelCase params as kebab-case: maxLength -> max-length) or one JSON `params` attribute.
// `today` on a date-like icon fills day/month/weekday from the viewer's clock. Styles load on first use.
// When a param is set more than once (an attribute, the JSON `params`, `today`), the one set last wins.
// Styles slower than a frame (glass, luxe, bauhaus...) draw off the main thread when the build has a worker, else one
// icon per task; the previous drawing stays up meanwhile, so a page of rich icons never freezes on one long task.
// `animate` (or animate="900", in ms): param changes move to the new value instead of jumping (core.js transition():
// numbers roll, levels ease, clock hands take the short way, words and choices cross-fade); el.animateTo({ ... }) and
// animateTo(el, { ... }) do it for one change. Several attributes set in the same task make one transition.
// Without a label the icon is named by what it shows (describe(): "Calendar date, March 17"); label="" makes it decorative.
import * as L from './core.js'

const BASE_ATTRS = ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'aria-hidden', 'params', 'today', 'vars', 'animate']
const warned = Object.create(null)
const warnOnce = m => { if (warned[m] || typeof console === 'undefined') return; warned[m] = 1; console.warn(m) }
// a param whose attribute would clash with a built-in one (size, color, label...) is read from param-<name>
const attrFor = a => BASE_ATTRS.includes(a) ? 'param-' + a : a
const Base = typeof HTMLElement === 'undefined' ? class {} : HTMLElement
const now = () => typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now()
const FADE_MS = 240
let SEQ = 0
let PARAM_ATTRS = null
const isParamAttr = n => n === 'params' || n === 'today' || (PARAM_ATTRS || (PARAM_ATTRS = new Set(L.paramAttributes().map(attrFor)))).has(n)
const msOf = v => { const n = parseFloat(v); return v != null && v !== '' && isFinite(n) && n >= 0 ? n : undefined }

export class WithLiveIconElement extends Base {
  static get observedAttributes() { return BASE_ATTRS.concat(L.paramAttributes().map(attrFor)) }
  connectedCallback() { this._render() }
  disconnectedCallback() { clearTimeout(this._timer); this._timer = 0; if (this._tr) this._tr.cancel(); this._tr = null; this._settle() }
  attributeChangedCallback(n) {
    (this._seq || (this._seq = Object.create(null)))[n] = ++SEQ
    if (!this.isConnected) return
    // a param change on an icon already on screen, with animate on: one transition for everything set in this task
    if (this._shown && isParamAttr(n) && (this._force || this._animateOn())) return this._queue()
    if (this._tr) { this._tr.cancel(); this._tr = null }
    this._render()
  }
  _animateOn() { return this.hasAttribute('animate') && this.getAttribute('animate') !== 'false' }
  /** Move to new param values with a transition (whatever `animate` says). Resolves when the new values are drawn. */
  animateTo(values, options) {
    const o = options || {}
    this._force = { ms: o.ms, ease: o.ease }
    try {
      for (const k in values || {}) {
        const v = values[k], a = attrFor(L.paramAttr(k))
        if (v == null) this.removeAttribute(a)
        else this.setAttribute(a, v === true ? '' : String(v))
      }
    } finally { this._forceOpts = this._force; this._force = null }
    const p = new Promise(res => (this._waiters || (this._waiters = [])).push(res))
    if (!this._q && !this._tr) this._settle()
    return p
  }
  _settle() { const w = this._waiters; this._waiters = null; if (w) for (const r of w) r() }
  _queue() {
    if (this._q) return
    this._q = 1
    Promise.resolve().then(() => { this._q = 0; this._tween() })
  }
  _tween() {
    const opts = this._forceOpts || {}
    this._forceOpts = null
    const name = (this.getAttribute('name') || '').trim(), v = this._variant()
    let to
    try { to = L.resolve(name, this.params) } catch (e) { return this._render() }
    const cur = this._shown
    if (!cur || cur.name !== name || cur.variant !== v) { if (this._tr) this._tr.cancel(); this._tr = null; return this._render() }
    // from what is on screen now (mid-transition too): a new value retargets smoothly
    const from = this._tr ? this._tr.params : cur.params
    this._schedule(L.get(name))
    const ms = opts.ms != null ? opts.ms : msOf(this.getAttribute('animate'))
    const ctl = this._tr = L.transition(name, from, to, v, {
      ms, ease: opts.ease, owner: this,
      paint: (p, info) => this._paintParams(name, p, v, info),
      // cancelled by a newer transition: that one takes over; otherwise draw the exact target (and fire with-live-render)
      done: completed => { if (this._tr !== ctl) return; this._tr = null; if (completed) this._render(); else this._settle() },
    })
  }
  _variant() {
    const v = this.getAttribute('variant') || L.defaultStyle
    if (L.styles.some(s => s.name === v)) return v
    warnOnce('with icons live: unknown variant "' + v + '". Use one of: ' + L.styleNames().join(', ') + '. Falling back to "' + L.defaultStyle + '".')
    return L.defaultStyle
  }
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
  // render options; the accessible name: label, else (unless named from outside, hidden or label="") what it shows
  _opts(name, params, named) {
    const size = this.getAttribute('size') || 24
    let vars
    const rawVars = this.getAttribute('vars')
    if (rawVars) { try { vars = JSON.parse(rawVars) } catch (e) { warnOnce('with icons live: vars="' + rawVars + '" is not JSON') } }
    let label = null
    if (!named && this.getAttribute('aria-hidden') !== 'true') {
      if (this.hasAttribute('label')) label = this.getAttribute('label') || null
      else { try { label = L.describe(name, params) } catch (e) { label = null } }
    }
    return {
      size, color: this.getAttribute('color'), strokeWidth: this.getAttribute('stroke-width'), vars,
      absoluteStrokeWidth: this.hasAttribute('absolute-stroke-width') && this.getAttribute('absolute-stroke-width') !== 'false',
      label, part: 'svg',
    }
  }
  _paint(svg, fade) {
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' })
    const size = this.getAttribute('size') || 24
    const css = /^\s*\d*\.?\d+\s*$/.test(String(size)) ? parseFloat(size) + 'px' : String(size).replace(/[;{}<>]/g, '')
    // a cross-fade (a word or a choice changed): the old drawing on top, fading out, for FADE_MS
    if (fade && this._svg && !L.reducedMotion()) this._fade = { svg: this._svg, t0: now() }
    const f = this._fade, age = f ? now() - f.t0 : FADE_MS
    if (f && age >= FADE_MS) this._fade = null
    const fading = f && age < FADE_MS && svg
    const html = '<style>:host{display:inline-block;width:' + css + ';height:' + css + ';line-height:0;vertical-align:middle;flex-shrink:0' + (fading ? ';position:relative' : '') + '}svg{display:block;width:100%;height:100%}' +
      (fading ? '.wl-out{position:absolute;inset:0;pointer-events:none}' : '') + '</style>' + svg + (fading ? '<span class="wl-out" aria-hidden="true">' + f.svg.replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"') + '</span>' : '')
    this._svg = svg
    if (html === this._html) return
    root.innerHTML = html
    this._html = html
    if (fading && root.querySelector) {
      const out = root.querySelector('.wl-out'), cur = root.querySelector('svg')
      const o = { duration: FADE_MS, delay: -age, easing: 'ease-out', fill: 'both' }
      if (out && out.animate) out.animate([{ opacity: 1 }, { opacity: 0 }], o)
      if (cur && cur.animate) cur.animate([{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], o)
    }
  }
  // one frame of a transition (params are drawable at once: cached or cheap)
  _paintParams(name, p, v, info) {
    try { this._paint(L.render(name, p, v, this._opts(name, p, this._a11y())), info && info.swap) } catch (e) { warnOnce(e.message) }
  }
  _render() {
    const named = this._a11y()
    const name = (this.getAttribute('name') || '').trim()
    const v = this._variant()
    const token = this._token = (this._token || 0) + 1
    const paint = (svg, params) => {
      if (token !== this._token) return
      this._paint(svg)
      this._shown = params ? { name, variant: v, params } : null
    }
    if (!name) { paint(''); return this._settle() }
    let params
    try {
      if (!L.resolveName(name)) throw Object.assign(new Error('with icons live: unknown live icon "' + name + '". Did you mean: ' + L.suggest(name).join(', ') + '?'), { code: 'WITH_UNKNOWN_ICON' })
      params = this.params
    } catch (e) { warnOnce(e.message); paint(''); return this._settle() }
    this._schedule(L.get(name))
    const o = this._opts(name, params, named)
    const draw = () => {
      if (token !== this._token) return
      try { paint(L.render(name, params, v, o), L.resolve(name, params)) } catch (e) { warnOnce(e.message); paint('') }
      if (typeof this.dispatchEvent === 'function' && typeof CustomEvent === 'function') this.dispatchEvent(new CustomEvent('with-live-render', { detail: { name, variant: v, params: L.resolve(name, params) } }))
      this._settle()
    }
    // cheap or already drawn: now. Otherwise keep what is shown and draw in the background (newest request wins).
    if (L.cached(name, params, v) || (L.loaded(v) && L.iconLoaded(name) && L.cost(v) <= 16)) return draw()
    if (!this._html) this._paint(L.placeholder(o))
    // cheap styles draw here once the style (and, in the CDN lite script, the icon's code) is loaded; rich ones in the background
    const job = L.cost(v) <= 16 ? Promise.all([L.load(v), L.loadIcon(name)]).then(() => true) : L.warm(name, params, v, { owner: this })
    job.then(ok => { if (ok) draw() }, e => { if (token === this._token) { warnOnce(e.message); paint(''); this._settle() } })
  }
}
// JS properties mirror the attributes: el.variant = 'glass', el.size = 48 (there is no `animate` property: that name is
// the Web Animations el.animate() method, so use the attribute or el.animateTo())
for (const [p, a] of Object.entries({ name: 'name', variant: 'variant', size: 'size', color: 'color', strokeWidth: 'stroke-width', label: 'label', today: 'today' })) {
  Object.defineProperty(WithLiveIconElement.prototype, p, {
    configurable: true,
    get() { return p === 'today' ? this.hasAttribute(a) && this.getAttribute(a) !== 'false' : this.getAttribute(a) },
    set(val) { if (val == null || val === false) this.removeAttribute(a); else this.setAttribute(a, val === true ? '' : String(val)) },
  })
}
/**
 * Animate a <with-live-icon> to new values: animateTo(el, { count: 13 }, { ms: 700 }). Numbers roll, levels ease, clock
 * hands take the short way round, words and choices cross-fade; instant with reduced motion. Resolves when drawn.
 * On any other element it just sets the attributes.
 */
export function animateTo(el, values, options) {
  if (el && typeof el.animateTo === 'function') return el.animateTo(values, options)
  if (el && typeof el.setAttribute === 'function') for (const k in values || {}) { const a = attrFor(L.paramAttr(k)); if (values[k] == null) el.removeAttribute(a); else el.setAttribute(a, String(values[k])) }
  return Promise.resolve()
}
/** Define the element (default tag with-live-icon). Safe to call twice and in Node (no-op without customElements). */
export function defineLiveIcon(tagName) {
  const tag = tagName || 'with-live-icon'
  if (typeof customElements === 'undefined' || customElements.get(tag)) return
  customElements.define(tag, tag === 'with-live-icon' ? WithLiveIconElement : class extends WithLiveIconElement {})
}
