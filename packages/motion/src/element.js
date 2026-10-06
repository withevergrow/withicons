// @withicons/motion/element — upgrades <with-icon> (from @withicons/web) with motion attributes:
//   <with-icon name="bell" motion="loop|hover|once|inview" [preset="ring"] [paused]>
//   <with-icon name="play" swap-to="pause" swap-effect="flip" [swap-trigger="hover|click|focus|auto|manual"]
//              [swap-duration="0.6"] [swap-ease="springy"] [swap-delay="0.1"] [swap-hold="1.2"]
//              [swap-color="#hex"] [swap-colors="--with-kawaii-1:#hex;…"]>
//   swap-color / swap-colors paint B on its own (its ink and its palette variables); without them B wears the host's.
// motion="loop|once" and preset="…" already work with motion.css alone (attribute selectors on the host);
// this module adds: hover that finishes its one-shot, inview, `draw` strokes inside the shadow root, swaps, and
// pausing loops while they are scrolled out of view (offscreen="run" keeps them running).
// Swap state: inside a control with aria-pressed / -expanded / -checked the icon follows that state (whatever the
// swap-trigger). swap-trigger="click" inside a plain <button> gives the button aria-pressed and toggles it; with no
// button around, the icon itself becomes a focusable toggle button (Enter / Space). Hover previews need a real
// hover; on touch a tap toggles instead.
// Import once, anywhere: import '@withicons/motion/element'
import { prepareDraw, pauseWhenOffscreen, partsSvg, EFFECTS, EFFECT_DEFAULTS, SWAP_HOLD, swapEase } from './runtime.js'
import { cssSlot } from './meta.js'
import { SHADOW_CSS } from './shadow-css.js'
import { shadowPartsCss } from './parts-css.js'

const TIMING = ['swap-duration', 'swap-ease', 'swap-delay', 'swap-hold']
const ATTRS = ['motion', 'preset', 'swap-to', 'swap-effect', 'swap-trigger', 'name', 'variant', 'offscreen', 'swap-color', 'swap-colors'].concat(TIMING)
const numAttr = (host, a) => { const v = host.getAttribute(a); return v != null && v !== '' && isFinite(Number(v)) ? Math.max(0, Number(v)) : null }
const STATE = typeof WeakMap !== 'undefined' ? new WeakMap() : null
const STATEFUL = '[aria-pressed],[aria-expanded],[aria-checked]'
const STATE_ATTRS = ['aria-pressed', 'aria-expanded', 'aria-checked']
const OWNED = typeof WeakSet !== 'undefined' ? new WeakSet() : null   // buttons whose aria-pressed this module manages

// Each icon's own loop / hover defaults. With icons.css on the page (every icon, ~18 KB gzipped) nothing more loads.
// Without it, an animated <with-icon name="bell"> links just icons/bell.css (a few hundred bytes) next to this module,
// when this module is served unbundled from a package path (a CDN such as jsDelivr or unpkg, /node_modules/...).
// Bundled apps import icons.css themselves; setMotionIconBase() points elsewhere (a self-hosted copy) or turns it off.
let ICON_BASE = (() => {
  try {
    const u = String(import.meta.url)
    return /^(https?|file):/.test(u) && /\/@withicons\/motion(@[^/]*)?\/dist\/element\.js([?#].*)?$/.test(u) ? u.replace(/element\.js([?#].*)?$/, 'icons/') : null
  } catch { return null }
})()
const ICON_CSS = new Set()
/** Where per-icon defaults (<name>.css) load from when icons.css is not on the page; null turns it off. */
export function setMotionIconBase(url) { ICON_BASE = url ? String(url).replace(/\/?$/, '/') : null }
function iconDefaults(host) {
  const name = host.getAttribute('name')
  if (!ICON_BASE || !name || ICON_CSS.has(name) || !/^[a-z0-9-]+$/.test(name) || typeof document === 'undefined') return
  ICON_CSS.add(name)
  // already styled (icons.css, or the file linked by hand): nothing to fetch
  if (cssSlot(host, true) || cssSlot(host, false)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = ICON_BASE + name + '.css'
  l.setAttribute('data-wm-icon', name)
  // the defaults decide draw strokes and the parts plan: decorate again once they apply
  l.onload = () => document.querySelectorAll('with-icon[motion]').forEach(h => { if (h.getAttribute('name') === name) decorate(h) })
  ;(document.head || document.documentElement).appendChild(l)
}

function stateOf(host) {
  let s = STATE.get(host)
  if (!s) { s = { offs: [], io: null, mo: null, key: '' }; STATE.set(host, s) }
  return s
}
function teardown(host, s) {
  s.offs.forEach(f => f()); s.offs = []
  if (s.io) { s.io.disconnect(); s.io = null }
  host.classList.remove('wm-js', 'wm-run', 'wm-drawing', 'wm-parts')
  host.removeAttribute('data-wm-on')
}
const isPlaying = a => a.playState === 'running'
// true while the host or any node in its shadow root still plays a motion
function hostBusy(host) {
  try { return host.getAnimations().some(isPlaying) || (!!host.shadowRoot && !!host.shadowRoot.getAnimations && host.shadowRoot.getAnimations().some(isPlaying)) } catch { return false }
}
function listen(s, t, type, fn) { t.addEventListener(type, fn); s.offs.push(() => t.removeEventListener(type, fn)) }
const setOn = (host, on) => { if (on) host.setAttribute('data-wm-on', ''); else host.removeAttribute('data-wm-on') }
// the swap follows the state of the control around it (no :host-context(), which Firefox and Safari lack)
function mirror(s, host, owner) {
  const sync = () => setOn(host, owner.classList.contains('is-on') || STATE_ATTRS.some(a => owner.getAttribute(a) === 'true'))
  sync()
  if (typeof MutationObserver === 'undefined') return
  const mo = new MutationObserver(sync)
  mo.observe(owner, { attributes: true, attributeFilter: STATE_ATTRS.concat('class') })
  s.offs.push(() => mo.disconnect())
}
const focusVisible = el => { try { return el.matches(':focus-visible') } catch { return true } }

function effectivePreset(host) {
  const p = host.getAttribute('preset')
  if (p) return p
  // the icon's own preset, from icons.css on the host (with-icon[name="…"]); no spec table needed
  const s = cssSlot(host, host.getAttribute('motion') === 'loop')
  return s ? s.preset : null
}

// Re-applied after every paint of the host's shadow root (the icon element rewrites it on attribute changes).
function decorate(host) {
  const root = host.shadowRoot
  if (!root) return
  const svg = Array.from(root.children).find(n => n.localName === 'svg')
  const to = host.getAttribute('swap-to')
  const motion = host.getAttribute('motion')
  if (!root.querySelector('style[data-wm]') && (to || motion)) {
    const st = document.createElement('style')
    st.setAttribute('data-wm', '')
    st.textContent = SHADOW_CSS
    root.appendChild(st)
  }
  if (motion && effectivePreset(host) === 'draw' && svg && prepareDraw(svg)) host.classList.add('wm-drawing')
  else host.classList.remove('wm-drawing')
  // parts choreography: tagged nodes move on their own (each with its spec lag); the document's @keyframes are not
  // visible in a shadow root, so it gets its own copy (one shared string, built on first use). An icon without part
  // tags plays the same way: all its nodes are the object, about the same origin, so the host box itself never
  // moves (a moving host would add its own turn to the parts', and drag the hit area around under the pointer).
  const parts = !!motion && !to && !host.classList.contains('wm-drawing') && !!(svg && (partsSvg(host) || svg.firstElementChild))
  host.classList.toggle('wm-parts', parts)
  if (parts && !root.querySelector('style[data-wm-parts]')) {
    const st = document.createElement('style')
    st.setAttribute('data-wm-parts', '')
    st.textContent = shadowPartsCss()
    root.appendChild(st)
  }
  if (to && svg && !root.querySelector('.wm-swap')) {
    const wrap = document.createElement('span')
    wrap.setAttribute('part', 'swap')
    svg.classList.add('wm-a')
    const b = document.createElement('with-icon')
    b.className = 'wm-b'
    b.setAttribute('size', '100%')
    b.setAttribute('aria-hidden', 'true')
    svg.replaceWith(wrap)
    wrap.appendChild(svg); wrap.appendChild(b)
  }
  const wrap = to && root.querySelector('.wm-swap, [part="swap"]')
  if (wrap) dressSwap(host, wrap)
}
// effect, trigger, timing and B (name, style, colours) follow the attributes on every repaint, so changing any of
// them updates the live swap in place
function dressSwap(host, wrap) {
  const effect = EFFECTS.includes(host.getAttribute('swap-effect')) ? host.getAttribute('swap-effect') : 'fade'
  const trig = host.getAttribute('swap-trigger')
  const draw = wrap.classList.contains('wm-drawable')
  wrap.className = 'wm-swap wm-fx-' + effect + (trig === 'auto' ? ' wm-swap-auto wm-js' : '') + (draw && effect === 'draw' ? ' wm-drawable' : '')
  const dur = numAttr(host, 'swap-duration'), delay = numAttr(host, 'swap-delay'), hold = numAttr(host, 'swap-hold'), ease = swapEase(host.getAttribute('swap-ease'))
  const css = (k, v) => { if (v == null || v === '') wrap.style.removeProperty(k); else wrap.style.setProperty(k, v) }
  css('--wm-swap-dur', dur != null ? dur + 's' : null)
  css('--wm-swap-ease', ease)
  css('--wm-swap-delay', delay && trig !== 'auto' ? delay + 's' : null)
  css('--wm-swap-hold', hold != null ? hold + 's' : null)
  const b = wrap.querySelector('.wm-b')
  const [name, variant] = String(host.getAttribute('swap-to')).split('@')
  const set = (k, v) => { if (v == null) { if (b.hasAttribute(k)) b.removeAttribute(k) } else if (b.getAttribute(k) !== v) b.setAttribute(k, v) }
  set('name', name)
  set('variant', variant || host.getAttribute('variant') || 'line')
  for (const a of ['stroke-width', 'absolute-stroke-width']) set(a, host.getAttribute(a))
  // B's own colours: its ink, and palette variables set on B itself (they win over the ones it inherits from the host)
  const own = host.getAttribute('swap-color')
  set('color', own || host.getAttribute('color'))
  b.style.cssText = ''
  if (own) b.style.color = own
  const bv = host.getAttribute('swap-colors')
  if (bv) String(bv).split(';').forEach(d => { const i = d.indexOf(':'); if (i > 0) { const k = d.slice(0, i).trim(); if (/^--[\w-]+$/.test(k)) b.style.setProperty(k, d.slice(i + 1).trim()) } })
  if (effect === 'draw' && !wrap._wmDraw) {
    wrap._wmDraw = true
    const a = wrap.querySelector('.wm-a')
    if (a) prepareDraw(a)
    const mark = () => { if (prepareDraw(b)) wrap.classList.add('wm-drawable') }
    if (b.shadowRoot) mark()
    setTimeout(mark, 60)
  }
}

function upgrade(host) {
  if (!STATE || host.localName !== 'with-icon') return
  const s = stateOf(host)
  const key = ATTRS.map(a => host.getAttribute(a)).join('|')
  if (key === s.key) { observe(host, s); decorate(host); return }
  s.key = key
  teardown(host, s)
  const motion = host.getAttribute('motion')
  const to = host.getAttribute('swap-to')
  if (motion) iconDefaults(host)
  const play = () => {
    if (host.classList.contains('wm-run')) return
    void host.offsetWidth
    host.classList.add('wm-run')
  }
  if (motion === 'hover' || motion === 'inview') {
    // the parts animate inside the shadow root, whose animation events stop at the root (not composed); the
    // one-shot is over when the last part (a lagging plate, a decoration answering a beat later) has finished
    const done = e => { if (String(e.animationName).indexOf('wm-') === 0 && !hostBusy(host)) host.classList.remove('wm-run') }
    listen(s, host, 'animationend', done)
    if (host.shadowRoot) listen(s, host.shadowRoot, 'animationend', done)
  }
  if (motion === 'hover') {
    host.classList.add('wm-js')
    const t = host.closest('.wm-trigger') || host
    listen(s, t, 'pointerenter', play)
    listen(s, t, 'focusin', play)
    listen(s, t, 'pointerdown', e => { if (e.pointerType !== 'mouse') play() })
  }
  if (motion === 'inview' && typeof IntersectionObserver !== 'undefined') {
    s.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) play(); else host.classList.remove('wm-run') }), { threshold: 0.35 })
    s.io.observe(host)
  }
  if (motion === 'loop' && host.getAttribute('offscreen') !== 'run') s.offs.push(pauseWhenOffscreen(host))
  if (to) {
    const trig = host.getAttribute('swap-trigger') || 'hover'
    const up = host.parentElement
    // click inside a <button> that has no state of its own: the button gets aria-pressed (as swap() does) and the
    // whole button toggles it: its padding, Enter and Space included
    const btn = trig === 'click' && up ? up.closest('button,[role="button"]') : null
    if (btn && OWNED && (OWNED.has(btn) || !btn.matches(STATEFUL))) {
      if (!btn.hasAttribute('aria-pressed')) btn.setAttribute('aria-pressed', 'false')
      OWNED.add(btn)
      listen(s, btn, 'click', () => btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true')))
    }
    const owner = trig !== 'manual' && up ? up.closest(STATEFUL) : null
    if (owner) mirror(s, host, owner)
    else if (trig === 'focus') {
      // B while the icon (or the control around it) holds focus: from a click, a tap or the keyboard
      const t = host.closest('.wm-trigger') || up || host
      listen(s, t, 'focusin', () => setOn(host, true))
      listen(s, t, 'focusout', e => { if (!t.contains(e.relatedTarget)) setOn(host, false) })
    } else if (trig === 'auto') {
      // turns into B and back on its own: real transitions, timed here; rests swap-hold on each icon, pauses while
      // scrolled away or in a hidden tab, and stays on A for visitors who prefer reduced motion
      const effect = EFFECTS.includes(host.getAttribute('swap-effect')) ? host.getAttribute('swap-effect') : 'fade'
      const dur = numAttr(host, 'swap-duration'), hold = numAttr(host, 'swap-hold'), delay = numAttr(host, 'swap-delay') || 0
      const step = ((dur != null ? dur : EFFECT_DEFAULTS[effect].dur) + (hold != null ? hold : SWAP_HOLD)) * 1000
      const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
      if (host.getAttribute('offscreen') !== 'run') s.offs.push(pauseWhenOffscreen(host))
      let timer = 0
      const tick = () => {
        const reduce = mq && mq.matches && !host.classList.contains('wm-force')
        const idle = document.visibilityState === 'hidden' || host.classList.contains('wm-offscreen') || host.hasAttribute('paused') || host.classList.contains('wm-paused')
        if (reduce) setOn(host, false)
        else if (!idle) setOn(host, !host.hasAttribute('data-wm-on'))
        timer = setTimeout(tick, step)
      }
      timer = setTimeout(tick, delay * 1000 + (hold != null ? hold : SWAP_HOLD) * 1000)
      s.offs.push(() => clearTimeout(timer))
    } else if (trig === 'hover') {
      // mouse / pen: preview while hovered; keyboard: while focus-visible; touch: a tap toggles (a touch
      // pointerleave fires right after the tap, so enter/leave would only flash B)
      const t = host.closest('.wm-trigger') || host
      listen(s, t, 'pointerenter', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setOn(host, true) })
      listen(s, t, 'pointerleave', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') setOn(host, false) })
      listen(s, t, 'pointerdown', e => { if (e.pointerType === 'touch') setOn(host, !host.hasAttribute('data-wm-on')) })
      listen(s, t, 'focusin', e => { if (focusVisible(e.target)) setOn(host, true) })
      listen(s, t, 'focusout', () => setOn(host, false))
    } else if (trig === 'click') {
      // no button around: the icon itself is the toggle button
      const own = (k, v) => { if (!host.hasAttribute(k)) { host.setAttribute(k, v); s.offs.push(() => host.removeAttribute(k)) } }
      own('role', 'button'); own('tabindex', '0')
      if (!host.hasAttribute('aria-pressed')) host.setAttribute('aria-pressed', host.classList.contains('is-on') ? 'true' : 'false')
      const toggle = () => {
        const on = host.getAttribute('aria-pressed') !== 'true'
        host.setAttribute('aria-pressed', String(on)); host.classList.toggle('is-on', on)
      }
      listen(s, host, 'click', toggle)
      listen(s, host, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); if (!e.repeat) toggle() }
      })
    }
  }
  observe(host, s)
  decorate(host)
}
// the icon element repaints its shadow root asynchronously: watch it and re-decorate
function observe(host, s) {
  if (host.shadowRoot && !s.mo && typeof MutationObserver !== 'undefined') {
    s.mo = new MutationObserver(() => decorate(host))
    s.mo.observe(host.shadowRoot, { childList: true })
  }
}

function scan(root) {
  if (!root || !root.querySelectorAll) return
  if (root.localName === 'with-icon') upgrade(root)
  root.querySelectorAll('with-icon[motion],with-icon[swap-to]').forEach(upgrade)
}

export function upgradeMotion(root) {
  if (typeof document === 'undefined' || typeof customElements === 'undefined') return
  const run = () => scan(root || document)
  customElements.whenDefined('with-icon').then(() => setTimeout(run, 0))
  run()
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined' && typeof customElements !== 'undefined' && !globalThis.__withMotionElement) {
  globalThis.__withMotionElement = true
  const start = () => {
    upgradeMotion(document)
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'attributes') { if (m.target.localName === 'with-icon') upgrade(m.target) }
        else m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n) })
      }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ATTRS })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
}
