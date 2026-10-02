// @withicons/motion — tiny, dependency-free runtime for the with icons motion system.
// The animations themselves are pure CSS (motion.css + icons.css); this file only toggles classes and
// CSS variables, prepares strokes for `draw`, and builds swaps. SSR-safe: nothing touches the DOM on import.
import SPECS from './icons.js'
import { PRESETS, EFFECTS, PRESET_DEFAULTS, EFFECT_DEFAULTS, DIRECTIONAL, SWAP_HOLD, SWAP_EASES, swapEase, swapCycle, specVars, slotVars, dirVec, pct, keyframeName, cssSlot, DECO_KINDS } from './meta.js'

export { PRESETS, EFFECTS, PRESET_DEFAULTS, EFFECT_DEFAULTS, SWAP_HOLD, SWAP_EASES, swapEase, swapCycle, specVars, slotVars, keyframeName }

// The spec table (500 icons, ~29 KB gzipped) is only reached through motionFor() and motionAttrs(). motion(), swap() and
// the element read an icon's defaults from icons.css on the live element instead (cssSlot), so a bundler drops the
// table from apps that only animate.
const specTable = () => SPECS
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k)
const TRIGGERS = ['loop', 'hover', 'once', 'inview']

/** The icon's motion spec ({ intent, loop, hover, alt?, swap? }), or null. */
export function motionFor(name) {
  const t = specTable()
  return typeof name === 'string' && own(t, name) ? t[name] : null
}

function resolveEl(target) {
  const el = typeof target === 'string' ? (typeof document !== 'undefined' ? document.querySelector(target) : null) : target
  if (!el || !el.classList) throw new Error('with icons motion: no element for ' + String(target))
  return el
}

const SHAPES = 'path,line,polyline,polygon,circle,ellipse,rect'
// Prepares inline SVG strokes for the `draw` preset / effect: every stroked shape gets pathLength="1"
// (so all strokes draw at the same pace), filled shapes are marked data-wm-fill (they fade in at the end).
// Returns true when at least one stroke can be drawn. Undo with unprepareDraw(root).
export function prepareDraw(root) {
  if (!root || !root.querySelectorAll) return false
  const scope = root.shadowRoot || root
  const svgs = root.localName === 'svg' ? [root] : Array.from(scope.querySelectorAll('svg'))
  let ok = false
  for (const svg of svgs) {
    for (const shape of Array.from(svg.querySelectorAll(SHAPES))) {
      if (shape.hasAttribute('data-wm-pl') || shape.hasAttribute('data-wm-fill')) { ok = ok || shape.hasAttribute('data-wm-pl'); continue }
      let stroke = null, dashed = false
      for (let n = shape; n && n !== svg.parentNode; n = n.parentNode) {
        if (!n.getAttribute) break
        if (n.getAttribute('stroke-dasharray') && n.getAttribute('stroke-dasharray') !== 'none') dashed = true
        if (stroke == null && n.getAttribute('stroke') != null) stroke = n.getAttribute('stroke')
      }
      if (!stroke || stroke === 'none' || dashed || shape.hasAttribute('pathLength')) { shape.setAttribute('data-wm-fill', ''); continue }
      shape.setAttribute('pathLength', '1')
      shape.setAttribute('data-wm-pl', '')
      ok = true
    }
  }
  return ok
}
export function unprepareDraw(root) {
  if (!root || !root.querySelectorAll) return
  const scope = root.shadowRoot || root
  for (const n of Array.from(scope.querySelectorAll('[data-wm-pl]'))) { n.removeAttribute('pathLength'); n.removeAttribute('data-wm-pl') }
  for (const n of Array.from(scope.querySelectorAll('[data-wm-fill]'))) n.removeAttribute('data-wm-fill')
}

// Shared mapping of motion options -> { classes, vars, preset (effective), name }.
// slotOf(name, loop) gives a named icon's own { preset, dir } for the slot (from the table or from icons.css).
function plan(nameOrSpec, o, fallbackName, slotOf) {
  const trigger = TRIGGERS.includes(o.trigger) ? o.trigger : 'loop'
  const spec = nameOrSpec && typeof nameOrSpec === 'object' ? nameOrSpec : null
  const name = typeof nameOrSpec === 'string' ? nameOrSpec : (spec ? null : fallbackName || null)
  const classes = ['wm', 'wm-' + trigger]
  const vars = {}
  // a spec object that is not in the table: its slot variables go inline (icons.css only knows the table)
  if (spec) Object.assign(vars, specVars(spec))
  const slot = spec ? (trigger === 'loop' ? spec.loop : spec.hover) : (name ? slotOf(name, trigger === 'loop') : null)
  const preset = PRESET_DEFAULTS[o.preset] ? o.preset : null
  if (preset) classes.push('wm-p-' + preset)
  let dir = o.dir
  if (dir == null && preset && DIRECTIONAL.includes(preset) && slot && slot.dir != null) dir = slot.dir
  const has = v => v != null && v !== ''
  if (has(o.duration)) vars['--wm-dur'] = Number(o.duration) + 's'
  if (has(o.amount)) vars['--wm-k'] = String(Number(o.amount))
  if (o.origin) { vars['--wm-ox'] = pct(o.origin[0]); vars['--wm-oy'] = pct(o.origin[1]) }
  if (has(dir)) { const [dx, dy] = dirVec(dir); vars['--wm-dx'] = String(dx); vars['--wm-dy'] = String(dy) }
  if (o.steps > 0) vars['--wm-ease'] = 'steps(' + Math.round(o.steps) + ')'
  if (has(o.delay)) vars['--wm-delay'] = Number(o.delay) + 's'
  if (DECO_KINDS.includes(o.deco)) vars['--wm-deco'] = o.deco === 'still' ? 'none' : 'wm-deco-' + o.deco
  if (o.force) classes.push('wm-force')
  return { trigger, name, classes, vars, preset: preset || (slot && slot.preset) || null }
}

/**
 * The attributes that make an icon wrapper move, for markup you write yourself (frameworks, SSR, copy-paste):
 * motionAttrs('bell', { trigger: 'hover', preset: 'shake', amount: 1.5 })
 *   -> { class: 'wm wm-hover wm-p-shake', 'data-wm': 'bell', style: '--wm-k:1.5' }
 * Note: 'inview', hover that always finishes, and 'draw' strokes also need motion() at runtime.
 */
export function motionAttrs(nameOrSpec, options) {
  const p = plan(nameOrSpec, options || {}, null, (n, loop) => { const s = motionFor(n); return s && (loop ? s.loop : s.hover) })
  const out = { class: p.classes.join(' ') }
  if (p.name) out['data-wm'] = p.name
  const style = Object.keys(p.vars).map(k => k + ':' + p.vars[k]).join(';')
  if (style) out.style = style
  return out
}

// Parts choreography: an inline SVG whose renderer tagged its nodes (wm-deco, wm-shadow, wm-a, wm-s) animates per part.
const PART_SEL = ':scope>:is(.wm-deco,.wm-shadow,.wm-a,.wm-s)'
/** The element's own icon <svg> (itself, a child, or in its shadow root) when its nodes carry part tags, else null. */
export function partsSvg(el) {
  if (!el || !el.querySelector) return null
  const scope = el.shadowRoot || el
  const svg = el.localName === 'svg' ? el : Array.from(scope.children || []).find(n => n.localName === 'svg')
  try { return svg && svg.querySelector(PART_SEL) ? svg : null } catch { return null }
}
// true while any animation of the element or of its parts is still running (a one-shot's parts end at different times)
const busy = el => { try { return !!el.getAnimations && el.getAnimations({ subtree: true }).some(a => a.playState === 'running') } catch { return false } }

const HANDLES = typeof WeakMap !== 'undefined' ? new WeakMap() : null

// One shared IntersectionObserver pauses loops while they are out of view (class wm-offscreen), so a page full of
// looping icons only animates the ones on screen. Hidden tabs need nothing: browsers stop painting them already.
let OFFSCREEN = null
/**
 * Pauses the animations of `el` (and of a swap loop inside it) while it is scrolled out of view.
 * motion() and <with-icon motion="loop"> do this for loops by default. Returns a function that stops watching.
 */
export function pauseWhenOffscreen(el) {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {}
  if (!OFFSCREEN) OFFSCREEN = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('wm-offscreen', !e.isIntersecting)), { rootMargin: '64px' })
  OFFSCREEN.observe(el)
  return () => { OFFSCREEN.unobserve(el); el.classList.remove('wm-offscreen') }
}

/**
 * Animate an element that holds an icon (inline <svg>, <with-icon>, <i class="with ...">, or any wrapper).
 * motion(el, 'bell')                                  the icon's own loop
 * motion(el, 'bell', { trigger: 'hover' })            its one-shot on hover / focus / tap (finishes even if the pointer leaves)
 * motion(el, null, { preset: 'spin', duration: 2 })   any preset
 * Loops pause while scrolled out of view (pass { offscreen: 'run' } to keep them running).
 * Calling motion() again on the same element replaces the previous motion.
 * Returns { el, play(), pause(), destroy() }.
 */
export function motion(target, nameOrSpec, options) {
  const el = resolveEl(target)
  const o = options || {}
  const prev = HANDLES && HANDLES.get(el)
  if (prev) prev.destroy()
  const ownName = el.getAttribute('data-wm') || (el.localName === 'with-icon' ? el.getAttribute('name') : null)
  const name = typeof nameOrSpec === 'string' ? nameOrSpec : (nameOrSpec && typeof nameOrSpec === 'object' ? null : ownName)
  let addedData = false, io = null, running = false, drawn = false
  // data-wm first: icons.css then hands the element the icon's own defaults, which plan() reads back (cssSlot)
  if (name && !el.hasAttribute('data-wm') && el.localName !== 'with-icon') { el.setAttribute('data-wm', name); addedData = true }
  const p = plan(nameOrSpec, o, ownName, (n, loop) => cssSlot(el, loop))
  const { trigger } = p
  const added = [], vars = [], offs = []
  const add = c => { if (!el.classList.contains(c)) { el.classList.add(c); added.push(c) } }
  const setVar = (k, v) => { vars.push([k, el.style.getPropertyValue(k)]); el.style.setProperty(k, String(v)) }
  const on = (t, type, fn, opt) => { t.addEventListener(type, fn, opt); offs.push(() => t.removeEventListener(type, fn, opt)) }

  p.classes.forEach(add)
  for (const k in p.vars) setVar(k, p.vars[k])
  if (p.preset === 'draw' && prepareDraw(el)) { add('wm-drawing'); drawn = true }
  else if (el.localName !== 'with-icon' && partsSvg(el)) add('wm-parts')

  const restart = () => {
    el.classList.remove('wm-run')
    if (trigger === 'once') el.classList.remove('wm-once')
    void el.offsetWidth // reflow so the same animation starts again
    el.classList.add('wm-run')
    running = true
  }
  const play = () => {
    el.classList.remove('wm-paused')
    if (trigger === 'loop') return
    if (!running) restart()
  }
  const stop = () => { running = false; el.classList.remove('wm-run') }
  on(el, 'animationend', e => { if (String(e.animationName).indexOf('wm-') === 0 && !(el.classList.contains('wm-parts') && busy(el))) { running = false; el.classList.remove('wm-run') } })
  if (trigger === 'hover') {
    add('wm-js')
    const t = (el.closest && el.closest('.wm-trigger')) || el
    on(t, 'pointerenter', play)
    on(t, 'focusin', play)
    on(t, 'pointerdown', e => { if (e.pointerType !== 'mouse') play() })
  }
  if (trigger === 'loop' && o.offscreen !== 'run') offs.push(pauseWhenOffscreen(el))
  if (trigger === 'inview' && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) play()
      else if (o.repeat !== false) stop()
    }), { threshold: 0.35 })
    io.observe(el)
  }
  const handle = {
    el,
    play() { if (trigger === 'loop') el.classList.remove('wm-paused'); else restart() },
    pause() { add('wm-paused') },
    destroy() {
      offs.forEach(f => f()); offs.length = 0
      if (io) io.disconnect()
      el.classList.remove('wm-run', ...added); added.length = 0
      for (let i = vars.length - 1; i >= 0; i--) { const [k, v] = vars[i]; if (v) el.style.setProperty(k, v); else el.style.removeProperty(k) }
      vars.length = 0
      if (addedData) el.removeAttribute('data-wm')
      if (drawn) unprepareDraw(el)
      if (HANDLES && HANDLES.get(el) === handle) HANDLES.delete(el)
    },
  }
  if (HANDLES) HANDLES.set(el, handle)
  return handle
}

function toNode(x, cls) {
  let node
  if (x && typeof x === 'object' && x.nodeType === 1) node = x
  else {
    const tpl = document.createElement('template')
    tpl.innerHTML = String(x == null ? '' : x).trim()
    const kids = tpl.content.childNodes
    if (kids.length === 1 && kids[0].nodeType === 1) node = kids[0]
    else { node = document.createElement('span'); node.appendChild(tpl.content) }
  }
  node.classList.add(cls)
  return node
}
const SWAPS = typeof WeakMap !== 'undefined' ? new WeakMap() : null
const isButton = el => el.localName === 'button' || el.getAttribute('role') === 'button'

/**
 * Stack two icons and transition between them.
 * swap(button, { from: playSvg, to: pauseSvg, effect: 'flip', trigger: 'click' })
 *   from     svg/html string or element (default: the element's current content)
 *   to       svg/html string or element
 *   effect   one of EFFECTS (default 'fade')
 *   trigger  'hover' (default) | 'click' (toggles, sets aria-pressed on buttons) | 'focus' (B while it, or the
 *            .wm-trigger around it, holds focus) | 'auto' (turns into B and back on its own, resting `hold` seconds on
 *            each) | 'manual' | 'loop' (CSS-only alternation, --wm-swap-cycle)
 *            hover only previews B on devices with a real hover, and never on a control that has aria-pressed /
 *            -expanded / -checked: use 'click' (or your own state) for anything that must work on touch
 *   on       start showing `to`
 *   duration seconds for one transition (--wm-swap-dur)
 *   ease     easing of the incoming icon: a CSS easing or a SWAP_EASES name ('springy', 'smooth', 'snappy', 'gentle',
 *            'linear'; 'natural' = the effect's own) (--wm-swap-ease)
 *   delay    seconds to wait before switching (--wm-swap-delay); for 'auto', before the first switch
 *   hold     'auto': seconds to rest on each icon (default SWAP_HOLD, 0.9)
 *   force    'auto' keeps going even when the user prefers reduced motion
 * Returns { el, on, toggle(on?) -> boolean, play(), pause(), destroy() } (play / pause start and stop 'auto').
 */
export function swap(target, options) {
  const el = resolveEl(target)
  const prevSwap = SWAPS && SWAPS.get(el)
  if (prevSwap) prevSwap.destroy()
  const o = options || {}
  const effect = EFFECTS.includes(o.effect) ? o.effect : 'fade'
  const trigger = ['hover', 'click', 'focus', 'auto', 'manual', 'loop'].includes(o.trigger) ? o.trigger : 'hover'
  const before = { html: el.innerHTML, cls: el.getAttribute('class'), pressed: el.getAttribute('aria-pressed'), style: el.getAttribute('style') }
  const a = toNode(o.from != null ? o.from : before.html, 'wm-a')
  const b = toNode(o.to, 'wm-b')
  el.textContent = ''
  el.appendChild(a); el.appendChild(b)
  el.classList.add('wm-swap', 'wm-fx-' + effect)
  if (trigger === 'hover') el.classList.add('wm-trigger')
  if (trigger === 'loop') el.classList.add('wm-loop')
  if (trigger === 'focus') el.classList.add('wm-swap-focus')
  if (trigger === 'auto') el.classList.add('wm-swap-auto', 'wm-js')   // wm-js: this script times it, not the CSS keyframes
  const num = v => v != null && v !== '' && isFinite(Number(v))
  const dur = num(o.duration) ? Math.max(0, Number(o.duration)) : EFFECT_DEFAULTS[effect].dur
  const hold = num(o.hold) ? Math.max(0, Number(o.hold)) : SWAP_HOLD
  const delay = num(o.delay) ? Math.max(0, Number(o.delay)) : 0
  const ease = swapEase(o.ease)
  if (num(o.duration)) el.style.setProperty('--wm-swap-dur', dur + 's')
  if (ease) el.style.setProperty('--wm-swap-ease', ease)
  if (delay && trigger !== 'auto') el.style.setProperty('--wm-swap-delay', delay + 's')
  if (num(o.hold)) el.style.setProperty('--wm-swap-hold', hold + 's')
  if (effect === 'draw') { const da = prepareDraw(a), db = prepareDraw(b); if (da || db) el.classList.add('wm-drawable') }
  const aria = isButton(el) && (trigger === 'click' || before.pressed != null)
  // only the visible icon is exposed to assistive tech (a labelled A and B would both be read out);
  // an icon that came in already aria-hidden (decorative) stays hidden in both states
  const hiddenA = a.getAttribute('aria-hidden'), hiddenB = b.getAttribute('aria-hidden')
  const expose = (n, show, orig) => {
    if (!show) n.setAttribute('aria-hidden', 'true')
    else if (orig == null) n.removeAttribute('aria-hidden')
    else n.setAttribute('aria-hidden', orig)
  }
  let state = !!o.on
  const apply = () => {
    el.classList.toggle('is-on', state)
    if (aria) el.setAttribute('aria-pressed', String(state))
    expose(a, !state, hiddenA); expose(b, state, hiddenB)
  }
  const onClick = () => { state = !state; apply() }
  if (trigger === 'click') el.addEventListener('click', onClick)
  const stopOffscreen = (trigger === 'loop' || trigger === 'auto') && o.offscreen !== 'run' ? pauseWhenOffscreen(el) : null
  // auto: the real transitions, timed here (exact for any duration / hold, reversible, eased like a click)
  let timer = null, running = false
  const reduced = () => !o.force && typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const idle = () => (typeof document !== 'undefined' && document.visibilityState === 'hidden') || el.classList.contains('wm-offscreen') || el.classList.contains('wm-paused')
  const tick = () => {
    timer = null
    if (!running) return
    if (reduced()) { if (state) { state = false; apply() } }
    else if (!idle()) { state = !state; apply() }
    timer = setTimeout(tick, (dur + hold) * 1000)
  }
  const play = () => { if (trigger !== 'auto' || running) return; running = true; el.classList.remove('wm-paused'); timer = setTimeout(tick, (delay + hold) * 1000) }
  const pause = () => { if (timer) clearTimeout(timer); timer = null; running = false }
  apply()
  if (trigger === 'auto' && o.autoplay !== false) play()
  const handle = {
    el,
    toggle(v) { state = v === undefined ? !state : !!v; apply(); return state },
    get on() { return state },
    play, pause,
    destroy() {
      pause()
      el.removeEventListener('click', onClick)
      if (stopOffscreen) stopOffscreen()
      el.innerHTML = before.html
      if (before.cls == null) el.removeAttribute('class'); else el.setAttribute('class', before.cls)
      if (before.style == null) el.removeAttribute('style'); else el.setAttribute('style', before.style)
      if (before.pressed == null) el.removeAttribute('aria-pressed'); else el.setAttribute('aria-pressed', before.pressed)
      if (SWAPS && SWAPS.get(el) === handle) SWAPS.delete(el)
    },
  }
  if (SWAPS) SWAPS.set(el, handle)
  return handle
}
