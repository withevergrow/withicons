// node --test packages/motion/test/swap-timing.test.mjs — per-swap timing, auto and focus triggers, swap exports
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const M = await load('index.js')
const X = await load('export.js')
const K = await load('keyframes.js')

// tiny DOM stub (same shape as api.test.mjs, only what swap() touches)
class ClassList {
  constructor(el) { this.el = el }
  get set() { return new Set((this.el.attrs.class || '').split(/\s+/).filter(Boolean)) }
  write(s) { if (s.size) this.el.attrs.class = [...s].join(' '); else delete this.el.attrs.class }
  contains(c) { return this.set.has(c) }
  add(...cs) { const s = this.set; cs.forEach(c => s.add(c)); this.write(s) }
  remove(...cs) { const s = this.set; cs.forEach(c => s.delete(c)); this.write(s) }
  toggle(c, force) { const on = force === undefined ? !this.contains(c) : !!force; on ? this.add(c) : this.remove(c); return on }
}
class Style { constructor() { this.m = new Map() } setProperty(k, v) { this.m.set(k, String(v)) } getPropertyValue(k) { return this.m.get(k) || '' } removeProperty(k) { this.m.delete(k) } }
class El {
  constructor(tag) { this.localName = tag; this.nodeType = 1; this.attrs = {}; this.children = []; this.classList = new ClassList(this); this.style = new Style(); this.listeners = {}; this._html = '' }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null }
  setAttribute(k, v) { this.attrs[k] = String(v) }
  hasAttribute(k) { return k in this.attrs }
  removeAttribute(k) { delete this.attrs[k] }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f) }
  removeEventListener(t, f) { this.listeners[t] = (this.listeners[t] || []).filter(x => x !== f) }
  closest() { return null }
  appendChild(c) { this.children.push(c); return c }
  querySelectorAll() { return [] }
  get innerHTML() { return this._html }
  set innerHTML(v) { this._html = v; this.children = [] }
  set textContent(v) { this._html = ''; this.children = [] }
}
const icon = () => new El('svg')

test('swap(): duration, ease, delay and hold become --wm-swap-* variables', () => {
  const w = new El('span')
  M.swap(w, { from: icon(), to: icon(), effect: 'morph', trigger: 'click', duration: 0.8, ease: 'springy', delay: 0.2, hold: 1.5 })
  assert.equal(w.style.getPropertyValue('--wm-swap-dur'), '0.8s')
  assert.equal(w.style.getPropertyValue('--wm-swap-ease'), M.SWAP_EASES.springy)
  assert.equal(w.style.getPropertyValue('--wm-swap-delay'), '0.2s')
  assert.equal(w.style.getPropertyValue('--wm-swap-hold'), '1.5s')
  const n = new El('span')
  M.swap(n, { from: icon(), to: icon(), ease: 'natural' })
  assert.equal(n.style.getPropertyValue('--wm-swap-ease'), '', 'natural keeps the effect’s own easing')
  assert.equal(n.style.getPropertyValue('--wm-swap-dur'), '', 'no duration: the effect default from motion.css')
  const c = new El('span')
  M.swap(c, { from: icon(), to: icon(), ease: 'cubic-bezier(.1,.2,.3,.4)' })
  assert.equal(c.style.getPropertyValue('--wm-swap-ease'), 'cubic-bezier(.1,.2,.3,.4)')
})

test('swap(): focus trigger marks the wrapper; auto trigger toggles on a timer and stops on destroy', async () => {
  const f = new El('span')
  M.swap(f, { from: icon(), to: icon(), trigger: 'focus' })
  assert.ok(f.classList.contains('wm-swap-focus') && !f.classList.contains('wm-trigger'))
  const a = new El('span')
  const s = M.swap(a, { from: icon(), to: icon(), trigger: 'auto', duration: 0.01, hold: 0.01 })
  assert.ok(a.classList.contains('wm-swap-auto') && a.classList.contains('wm-js'), 'script-timed, so the CSS keyframes stay off')
  assert.equal(s.on, false)
  await new Promise(r => setTimeout(r, 60))
  const flips = []
  for (let i = 0; i < 4; i++) { flips.push(s.on); await new Promise(r => setTimeout(r, 22)) }
  assert.ok(flips.includes(true) && flips.includes(false), 'it turns back and forth')
  s.pause()
  const held = s.on
  await new Promise(r => setTimeout(r, 60))
  assert.equal(s.on, held, 'pause() holds the current icon')
  s.destroy()
})

test('swapCycle / swapEase / swapLoopStops with a hold', () => {
  assert.equal(M.swapCycle(0.3), 2.4, 'default fade cycle is the classic 2.4 s')
  assert.equal(M.swapCycle(0.5, 1), 3)
  assert.equal(M.swapEase('natural'), null)
  assert.equal(M.swapEase('linear'), 'linear')
  const { a, b } = K.swapLoopStops('scale', M.swapCycle(1, 0.2), 1, { hold: 0.2, ease: 'linear' })
  // a long transition with a short hold is not squeezed to 24% of the cycle
  const leave = a.find(s => s[2] === K.SWAP_EASE.exit)[0] / 100, gone = a[2][0] / 100
  assert.ok(Math.abs(leave - 0.2 / 2.4) < 1e-6, 'A rests for hold / cycle')
  assert.ok(gone - leave > 0.24 * 0.62, 'the exit keeps its share of a long transition')
  assert.ok(b.some(s => s[2] === 'linear'), 'the incoming icon uses the chosen easing')
})

test('animatedSwapSvg: hold sets the cycle, ease reaches the keyframes, legacy cycle unchanged', () => {
  const A = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 12h16"/></svg>'
  const B = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>'
  const s = X.animatedSwapSvg(A, B, { effect: 'scale', duration: 0.6, hold: 1.2, ease: 'smooth' })
  assert.match(s, /animation:wm\w+-a 3.6s linear/)
  assert.ok(s.includes('cubic-bezier(.65,0,.35,1)'))
  assert.equal(X.exportDuration({ swapTo: B, effect: 'scale', duration: 0.6, hold: 1.2 }), 3.6)
  assert.equal(X.exportDuration({ swapTo: B }), 2.4)
  assert.match(X.animatedSwapSvg(A, B, { effect: 'scale' }), /animation:wm\w+-a 2.4s linear/)
})
