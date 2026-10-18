// <with-loader> — the zero-config way to drop a loader anywhere (HTML, Markdown that allows HTML, any framework).
//
//   <with-loader name="spinner"></with-loader>
//   <with-loader name="orbit" variant="glass" size="48" speed="1.4" color="#7c5cff" label="Loading results"></with-loader>
//   <with-loader morph="file,cloud-upload,check-circle" variant="line" effect="bloom" hold="1"></with-loader>
//
// Attributes: name | morph (comma list of library icon names; "loader:<name>" puts a loader in the chain), variant
// (style, default line), size (24), color, speed (1), effect + hold (morph), label ("Loading"; label="" = decorative), paused.
// Methods: el.pause(), el.play(), el.done(icon = 'check-circle', { effect, label }) turns the loader into that library
// icon (always an icon, never a loader) and stops. The host is role="progressbar" (indeterminate) while busy; done()
// makes it role="img" named by `label` ("Done") and says that label through one shared, visually hidden
// role="status" live region, so screen readers announce the finish.
import * as L from './core.js'

const ATTRS = ['name', 'morph', 'variant', 'size', 'color', 'speed', 'effect', 'hold', 'label', 'paused']
const Base = typeof HTMLElement === 'function' ? HTMLElement : class {}
let UID = 0
// one polite live region per document, created before it is needed (a region that appears together with its text is
// often not announced): done() writes its label there
let LIVE = null
const HIDE = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap'
function liveRegion() {
  if (typeof document === 'undefined' || !document.body) return null
  if (LIVE && LIVE.isConnected) return LIVE
  LIVE = document.createElement('span')
  LIVE.setAttribute('role', 'status')
  LIVE.setAttribute('aria-live', 'polite')
  LIVE.setAttribute('aria-atomic', 'true')
  LIVE.setAttribute('data-with-loader-status', '')
  LIVE.style.cssText = HIDE
  document.body.appendChild(LIVE)
  return LIVE
}
function announce(text) {
  const r = liveRegion()
  if (!r) return
  r.textContent = ''
  // a fresh text node after a beat: repeated "Done"s are announced too
  setTimeout(() => { if (r.isConnected) r.textContent = text }, 60)
}

export class WithLoaderElement extends Base {
  static get observedAttributes() { return ATTRS }
  constructor() { super(); this._uid = 'x' + (++UID).toString(36); this._job = 0; this._done = null }
  connectedCallback() {
    if (!this.style.display) this.style.display = 'inline-flex'
    this.style.lineHeight = '0'
    this.style.verticalAlign = this.style.verticalAlign || 'middle'
    if (this.getAttribute('label') !== '') liveRegion()
    this._draw()
  }
  attributeChangedCallback() { if (this.isConnected) this._draw() }
  _opts() {
    const g = k => this.getAttribute(k)
    const size = g('size')
    return {
      style: g('variant') || 'line', size: size == null || size === '' ? 24 : (/^\d+(\.\d+)?$/.test(size) ? Number(size) : size),
      color: g('color') || undefined, speed: g('speed') || undefined, paused: this.hasAttribute('paused'),
      effect: g('effect') || undefined, hold: g('hold') || undefined, label: '', idSuffix: this._uid,
    }
  }
  _a11y(busy) {
    const label = this.getAttribute('label')
    const text = label == null ? 'Loading' : label
    if (text === '') { this.setAttribute('aria-hidden', 'true'); this.removeAttribute('role'); return }
    this.removeAttribute('aria-hidden')
    this.setAttribute('role', busy ? 'progressbar' : 'img')
    this.setAttribute('aria-label', busy ? text : (this._done && this._done.label) || 'Done')
    this.setAttribute('aria-busy', busy ? 'true' : 'false')
  }
  _draw() {
    const job = ++this._job, o = this._opts()
    if (this._done) return this._paint(job, L.morphAsync(this._done.items, { ...o, ...this._done.opts }), false)
    const morph = this.getAttribute('morph')
    const name = this.getAttribute('name') || (morph ? null : 'spinner')
    this._paint(job, morph ? L.morphAsync(morph, o) : L.svgAsync(name, o), true)
  }
  _paint(job, p, busy) {
    this._a11y(busy)
    p.then(markup => { if (job === this._job) this.innerHTML = markup }, e => { if (job === this._job) console.warn(e.message) })
  }
  pause() { this.setAttribute('paused', '') }
  play() { this.removeAttribute('paused') }
  /** Finish: the loader blooms into `icon` (a library icon name, or its <svg> markup) and stays there. */
  done(icon = 'check-circle', opts) {
    const o = opts || {}
    // always an icon: a name like "download" or "rocket" is also a loader, and a finished state must not keep spinning
    const s = String(icon || 'check-circle').trim()
    const item = s[0] === '<' ? s : { icon: s.replace(/^icon:\s*/i, '') }
    this._done = { items: [item], opts: { effect: o.effect || 'bloom' }, label: o.label || 'Done' }
    this._draw()
    if (this.getAttribute('label') !== '') announce(this._done.label)
    return this
  }
  /** Back to loading. */
  reset() { this._done = null; this._draw(); return this }
}
export function defineLoader(tag = 'with-loader') {
  if (typeof customElements === 'undefined' || customElements.get(tag)) return
  customElements.define(tag, class extends WithLoaderElement {})
}
