import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, read } from './_setup.mjs'

// ---- a minimal DOM stub: enough for motion(), swap() and prepareDraw()
class ClassList {
  constructor(el) { this.el = el }
  get set() { return new Set((this.el.attrs.class || '').split(/\s+/).filter(Boolean)) }
  write(s) { if (s.size) this.el.attrs.class = [...s].join(' '); else delete this.el.attrs.class }
  contains(c) { return this.set.has(c) }
  add(...cs) { const s = this.set; cs.forEach(c => s.add(c)); this.write(s) }
  remove(...cs) { const s = this.set; cs.forEach(c => s.delete(c)); this.write(s) }
  toggle(c, force) { const on = force === undefined ? !this.contains(c) : !!force; on ? this.add(c) : this.remove(c); return on }
}
class Style {
  constructor() { this.m = new Map() }
  setProperty(k, v) { this.m.set(k, String(v)) }
  getPropertyValue(k) { return this.m.get(k) || '' }
  removeProperty(k) { this.m.delete(k) }
}
const matches = (n, sel) => sel.split(',').some(s => {
  s = s.trim()
  const a = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(s)
  if (a) return n.hasAttribute(a[1]) && (a[2] === undefined || n.getAttribute(a[1]) === a[2])
  if (s.startsWith('.')) return n.classList.contains(s.slice(1))
  return n.localName === s
})
class El {
  constructor(tag, attrs) {
    this.localName = tag; this.nodeType = 1; this.attrs = { ...attrs }; this.children = []; this.parentNode = null
    this.classList = new ClassList(this); this.style = new Style(); this.listeners = {}; this._html = ''
  }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null }
  setAttribute(k, v) { this.attrs[k] = String(v) }
  hasAttribute(k) { return k in this.attrs }
  removeAttribute(k) { delete this.attrs[k] }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f) }
  removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter(x => x !== f) }
  fire(t, e) { (this.listeners[t] || []).slice().forEach(f => f({ type: t, ...e })) }
  closest(sel) { for (let n = this; n; n = n.parentNode) if (n.nodeType === 1 && matches(n, sel)) return n; return null }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c }
  get offsetWidth() { return 0 }
  get innerHTML() { return this._html }
  set innerHTML(v) { this._html = v; this.children = [] }
  set textContent(v) { this._html = ''; this.children = [] }
  querySelectorAll(sel) {
    const out = []
    const walk = n => n.children.forEach(c => { if (matches(c, sel)) out.push(c); walk(c) })
    walk(this)
    return out
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null }
}
const h = (tag, attrs, ...kids) => { const e = new El(tag, attrs); kids.forEach(k => e.appendChild(k)); return e }
const lineSvg = () => h('svg', { fill: 'none', stroke: 'currentColor' }, h('path', { d: 'M4 12h16' }), h('circle', { cx: 12, cy: 12, r: 3, fill: 'currentColor', stroke: 'none' }))

// getComputedStyle for the stub: what icons.css gives [data-wm="<name>"] / with-icon[name="<name>"]
const ICON_VARS = {}
for (const m of read('icons.css').matchAll(/^\[data-wm="([^"]+)"\][^{]*\{([^}]*)\}/gm)) {
  ICON_VARS[m[1]] = Object.fromEntries(m[2].split(';').map(d => [d.slice(0, d.indexOf(':')), d.slice(d.indexOf(':') + 1)]))
}
globalThis.getComputedStyle = el => {
  const n = el.getAttribute('data-wm') || (el.localName === 'with-icon' ? el.getAttribute('name') : null)
  return { getPropertyValue: k => (ICON_VARS[n] || {})[k] || '' }
}

const M = await load('index.js')

test('motionFor returns specs, null for unknown', () => {
  const s = M.motionFor('bell')
  assert.ok(s && s.loop && s.hover && s.intent)
  assert.equal(M.motionFor('definitely-not-an-icon'), null)
  assert.equal(M.motionFor(undefined), null)
})

test('PRESETS / EFFECTS are the closed vocabulary', () => {
  assert.equal(M.PRESETS.length, 32)
  assert.equal(M.EFFECTS.length, 12)
  assert.ok(M.PRESETS.includes('spin-once') && M.EFFECTS.includes('slide-up'))
})

test('specVars maps a spec to slot variables', () => {
  const v = M.specVars({ loop: { preset: 'ring', origin: [12, 3], amount: 0.7, duration: 2.4 }, hover: { preset: 'nudge', dir: 270 } })
  assert.equal(v['--wmL'], 'wm-ring-loop')
  assert.equal(v['--wmL-d'], '2.4s')
  assert.equal(v['--wmL-oy'], '12.5%')
  assert.equal(v['--wmL-k'], '.7')
  assert.equal(v['--wmH'], 'wm-nudge')
  assert.equal(v['--wmH-d'], '.9s')
  assert.equal(v['--wmH-dx'], '0')
  assert.equal(v['--wmH-dy'], '-1')
  assert.equal(M.specVars({ loop: { preset: 'tick', steps: 8 }, hover: { preset: 'spin' } })['--wmL-e'], 'steps(8)')
  assert.equal(M.keyframeName('pop', true), 'wm-pop-loop')
  assert.equal(M.keyframeName('spin', true), 'wm-spin')
})

test('motion(): loop classes, data-wm, options as variables, destroy restores', () => {
  const el = h('span', {}, lineSvg())
  const m = M.motion(el, 'bell', { duration: 2, amount: 1.5, origin: [12, 6], steps: 4, delay: 0.2 })
  assert.ok(el.classList.contains('wm') && el.classList.contains('wm-loop'))
  assert.equal(el.getAttribute('data-wm'), 'bell')
  assert.equal(el.style.getPropertyValue('--wm-dur'), '2s')
  assert.equal(el.style.getPropertyValue('--wm-k'), '1.5')
  assert.equal(el.style.getPropertyValue('--wm-oy'), '25%')
  assert.equal(el.style.getPropertyValue('--wm-ease'), 'steps(4)')
  assert.equal(el.style.getPropertyValue('--wm-delay'), '0.2s')
  m.pause(); assert.ok(el.classList.contains('wm-paused'))
  m.play(); assert.ok(!el.classList.contains('wm-paused'))
  m.destroy()
  assert.equal(el.getAttribute('class'), null)
  assert.equal(el.getAttribute('data-wm'), null)
  assert.equal(el.style.m.size, 0)
})

test('motion(): explicit preset carries the icon direction for directional presets', () => {
  const el = h('span', {}, lineSvg())
  M.motion(el, 'arrow-up-right', { preset: 'pass' })
  assert.ok(el.classList.contains('wm-p-pass'))
  assert.equal(el.style.getPropertyValue('--wm-dx'), '0.7071')
  assert.equal(el.style.getPropertyValue('--wm-dy'), '-0.7071')
})

test('motion(): reads the icon defaults from icons.css (draw icons prepare their strokes)', () => {
  const el = h('span', {}, lineSvg())
  const m = M.motion(el, 'check')
  assert.equal(el.getAttribute('data-wm'), 'check')
  assert.ok(el.classList.contains('wm-drawing'), 'check loops with draw')
  m.destroy()
  assert.ok(!el.classList.contains('wm-drawing'))
  const pre = h('span', { 'data-wm': 'check' }, lineSvg())
  M.motion(pre)
  assert.ok(pre.classList.contains('wm-drawing'), 'the name can come from data-wm')
  const bell = h('span', {}, lineSvg())
  M.motion(bell, 'bell')
  assert.ok(!bell.classList.contains('wm-drawing'))
  const saved = globalThis.getComputedStyle
  globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' })
  try {
    const bare = h('span', {}, lineSvg())
    M.motion(bare, 'check')
    assert.ok(bare.classList.contains('wm-loop') && !bare.classList.contains('wm-drawing'), 'no icons.css: classes only')
  } finally { globalThis.getComputedStyle = saved }
})

test('cssSlot(): keyframe names map back to presets', async () => {
  const meta = await load('meta.js')
  const cs = vars => ({ getAttribute: () => null, localName: 'span', vars })
  const saved = globalThis.getComputedStyle
  globalThis.getComputedStyle = el => ({ getPropertyValue: k => el.vars[k] || '' })
  try {
    assert.deepEqual(meta.cssSlot(cs({ '--wmL': 'wm-spin-once-loop' }), true), { preset: 'spin-once' })
    assert.deepEqual(meta.cssSlot(cs({ '--wmH': ' wm-spin-once' }), false), { preset: 'spin-once' })
    assert.deepEqual(meta.cssSlot(cs({ '--wmL': 'wm-ring-loop' }), true), { preset: 'ring' })
    assert.equal(meta.cssSlot(cs({ '--wmL': 'none' }), true), null)
    assert.equal(meta.cssSlot(cs({ '--wmL': 'wm-nope' }), true), null)
    const d = meta.cssSlot(cs({ '--wmH': 'wm-pass', '--wmH-dx': '0', '--wmH-dy': '-1' }), false)
    assert.equal(d.preset, 'pass'); assert.equal(Math.round(d.dir), 270)
  } finally { globalThis.getComputedStyle = saved }
})

test('motion(): hover trigger plays from the .wm-trigger ancestor and re-arms on animationend', () => {
  const icon = h('span', {}, lineSvg())
  const btn = h('button', { class: 'wm-trigger' }, icon)
  const m = M.motion(icon, 'bell', { trigger: 'hover' })
  assert.ok(icon.classList.contains('wm-hover') && icon.classList.contains('wm-js'))
  assert.ok(!icon.classList.contains('wm-run'))
  btn.fire('pointerenter', {})
  assert.ok(icon.classList.contains('wm-run'))
  icon.fire('animationend', { animationName: 'wm-ring' })
  assert.ok(!icon.classList.contains('wm-run'))
  btn.fire('pointerdown', { pointerType: 'touch' })
  assert.ok(icon.classList.contains('wm-run'))
  m.destroy()
  btn.fire('pointerenter', {})
  assert.ok(!icon.classList.contains('wm-run'), 'listeners removed')
})

test('motion(): custom spec objects are written inline', () => {
  const el = h('span', {}, lineSvg())
  M.motion(el, { name: 'x', intent: 'x', loop: { preset: 'float', amount: 0.5 }, hover: { preset: 'pop' } })
  assert.equal(el.style.getPropertyValue('--wmL'), 'wm-float')
  assert.equal(el.style.getPropertyValue('--wmH'), 'wm-pop')
  assert.equal(el.getAttribute('data-wm'), null)
})

test('draw: strokes get pathLength, fills are marked, undo restores', () => {
  const el = h('span', {}, lineSvg())
  const m = M.motion(el, null, { preset: 'draw' })
  assert.ok(el.classList.contains('wm-drawing'))
  const svg = el.children[0]
  assert.equal(svg.children[0].getAttribute('pathLength'), '1')
  assert.ok(svg.children[1].hasAttribute('data-wm-fill'))
  m.destroy()
  assert.equal(svg.children[0].getAttribute('pathLength'), null)
  assert.ok(!svg.children[1].hasAttribute('data-wm-fill'))
  const solid = h('span', {}, h('svg', { fill: 'currentColor' }, h('path', { d: 'M0 0h4v4z' })))
  M.motion(solid, null, { preset: 'draw' })
  assert.ok(!solid.classList.contains('wm-drawing'), 'filled styles fall back to the element animation (pop)')
})

test('swap(): stacks A and B, click toggles aria-pressed, destroy restores', () => {
  const btn = h('button', { class: 'btn' })
  btn.innerHTML = '<svg>old</svg>'
  const a = lineSvg(), b = lineSvg()
  const s = M.swap(btn, { from: a, to: b, effect: 'flip', trigger: 'click' })
  assert.deepEqual(btn.children, [a, b])
  assert.ok(a.classList.contains('wm-a') && b.classList.contains('wm-b'))
  assert.ok(btn.classList.contains('wm-swap') && btn.classList.contains('wm-fx-flip'))
  assert.equal(btn.getAttribute('aria-pressed'), 'false')
  btn.fire('click', {})
  assert.equal(btn.getAttribute('aria-pressed'), 'true')
  assert.ok(btn.classList.contains('is-on') && s.on)
  assert.equal(s.toggle(), false)
  assert.equal(s.toggle(true), true)
  s.destroy()
  assert.equal(btn.getAttribute('class'), 'btn')
  assert.equal(btn.innerHTML, '<svg>old</svg>')
  assert.equal(btn.getAttribute('aria-pressed'), null)
})

test('swap(): hover adds .wm-trigger, unknown effect falls back to fade, draw prepares strokes', () => {
  const w = h('span', {})
  M.swap(w, { from: lineSvg(), to: lineSvg(), effect: 'nope' })
  assert.ok(w.classList.contains('wm-trigger') && w.classList.contains('wm-fx-fade'))
  const d = h('span', {})
  M.swap(d, { from: lineSvg(), to: lineSvg(), effect: 'draw', trigger: 'manual' })
  assert.ok(d.classList.contains('wm-drawable') && !d.classList.contains('wm-trigger'))
})

test('imports are SSR-safe (no DOM touched on import)', async () => {
  assert.equal(typeof globalThis.document, 'undefined')
  await load('element.js')
  const { upgradeMotion } = await load('element.js')
  assert.equal(typeof upgradeMotion, 'function')
  upgradeMotion()
})

test('motionAttrs(): markup attributes for frameworks', () => {
  assert.deepEqual(M.motionAttrs('bell', { trigger: 'hover', preset: 'shake', amount: 1.5 }), { class: 'wm wm-hover wm-p-shake', 'data-wm': 'bell', style: '--wm-k:1.5' })
  assert.deepEqual(M.motionAttrs('bell'), { class: 'wm wm-loop', 'data-wm': 'bell' })
  assert.deepEqual(M.motionAttrs(null, { preset: 'spin', duration: 2, force: true }), { class: 'wm wm-loop wm-p-spin wm-force', style: '--wm-dur:2s' })
})

test('motion() / swap() on the same element replace the previous one', () => {
  const el = h('span', {}, lineSvg())
  M.motion(el, 'bell', { preset: 'spin', duration: 3 })
  M.motion(el, 'heart', { trigger: 'hover' })
  assert.ok(!el.classList.contains('wm-p-spin') && !el.classList.contains('wm-loop'))
  assert.equal(el.style.getPropertyValue('--wm-dur'), '')
  assert.equal(el.getAttribute('data-wm'), 'heart')
  const w = h('span', {})
  w.innerHTML = '<svg>orig</svg>'
  M.swap(w, { from: lineSvg(), to: lineSvg(), effect: 'flip' })
  const b = lineSvg()
  M.swap(w, { from: lineSvg(), to: b, effect: 'scale' })
  assert.ok(w.classList.contains('wm-fx-scale') && !w.classList.contains('wm-fx-flip'))
  assert.equal(w.children[1], b)
})

test('swap(): only the visible icon is exposed to assistive tech; decorative icons stay hidden', () => {
  const btn = h('button', {})
  const a = lineSvg(), b = lineSvg()
  const s = M.swap(btn, { from: a, to: b, trigger: 'click' })
  assert.equal(a.getAttribute('aria-hidden'), null)
  assert.equal(b.getAttribute('aria-hidden'), 'true')
  s.toggle(true)
  assert.equal(a.getAttribute('aria-hidden'), 'true')
  assert.equal(b.getAttribute('aria-hidden'), null)
  const deco = h('svg', { 'aria-hidden': 'true' })
  const w = h('span', {})
  const s2 = M.swap(w, { from: deco, to: lineSvg(), trigger: 'manual' })
  s2.toggle(true); s2.toggle(false)
  assert.equal(deco.getAttribute('aria-hidden'), 'true', 'an aria-hidden icon is never un-hidden')
})

test('loops pause while offscreen (shared IntersectionObserver), opt out with offscreen: run', () => {
  const seen = []
  globalThis.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; seen.push(this); this.els = new Set() }
    observe(el) { this.els.add(el) }
    unobserve(el) { this.els.delete(el) }
    disconnect() { this.els.clear() }
    emit(el, on) { this.cb([{ target: el, isIntersecting: on }]) }
  }
  try {
    const el = h('span', {}, lineSvg())
    const m = M.motion(el, 'bell')
    const io = seen[0]
    assert.ok(io && io.els.has(el))
    io.emit(el, false)
    assert.ok(el.classList.contains('wm-offscreen'))
    io.emit(el, true)
    assert.ok(!el.classList.contains('wm-offscreen'))
    io.emit(el, false)
    m.destroy()
    assert.ok(!io.els.has(el) && !el.classList.contains('wm-offscreen'), 'destroy stops watching and unpauses')
    const run = h('span', {}, lineSvg())
    M.motion(run, 'bell', { offscreen: 'run' })
    assert.ok(!io.els.has(run))
    const hov = h('span', {}, lineSvg())
    M.motion(hov, 'bell', { trigger: 'hover' })
    assert.ok(!io.els.has(hov), 'only loops are watched')
    const sw = h('span', {})
    const s = M.swap(sw, { from: lineSvg(), to: lineSvg(), trigger: 'loop' })
    assert.ok(io.els.has(sw), 'swap loops too')
    s.destroy()
    assert.ok(!io.els.has(sw))
    assert.equal(seen.length, 1, 'one observer for the page')
  } finally { delete globalThis.IntersectionObserver }
})
