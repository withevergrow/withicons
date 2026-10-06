// Motion: interpolate / plan / transition (core) and the element's `animate`, animateTo(), coalescing, the default label.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

// ---- a tiny DOM stub (same shape as element.test.mjs)
class FakeShadow { constructor() { this.innerHTML = '' } }
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
const mins = s => +s.slice(0, 2) * 60 + +s.slice(3)
const until = async (fn, ms = 5000) => { const t = Date.now(); while (!fn()) { if (Date.now() - t > ms) throw new Error('timeout'); await new Promise(r => setTimeout(r, 5)) } }
const make = (name, attrs) => { const el = new (registry.get('with-live-icon'))(); el.setAttribute('name', name); for (const k in attrs) el.setAttribute(k, attrs[k]); el.connect(); return el }

test('clock hands take the short way round the 12-hour face: 10:10 -> 03:00 goes forward 4 h 50 min', () => {
  let prev = mins('10:10'), total = 0
  for (let i = 1; i <= 40; i++) {
    const t = L.interpolate('clock-time', { time: '10:10' }, { time: '03:00' }, i / 40, { ease: 'linear' }).time
    const step = (((mins(t) - prev) % 720) + 720) % 720   // on the dial: 15:00 and 03:00 are the same place
    assert.ok(step >= 0 && step < 30, `forward at ${i}: ${t}`)
    total += step; prev = mins(t)
  }
  assert.equal(total, 4 * 60 + 50)
  assert.equal(L.interpolate('clock-time', { time: '10:10' }, { time: '03:00' }, 0.5, { ease: 'linear' }).time, '12:35')
  assert.equal(L.interpolate('clock-time', { time: '10:10' }, { time: '03:00' }, 1).time, '03:00', 'the end is exactly the target (03:00, not 15:00)')
  // 11:50 -> 00:10 crosses twelve forwards (20 min), 03:00 -> 10:10 goes back 4 h 50 min
  assert.equal(L.interpolate('watch-time', { time: '11:50' }, { time: '00:10' }, 0.5, { ease: 'linear' }).time, '12:00')
  assert.equal(L.interpolate('clock-time', { time: '03:00' }, { time: '10:10' }, 0.5, { ease: 'linear' }).time, '00:35')
})

test('a digital clock takes the short way round 24 hours', () => {
  assert.equal(L.interpolate('digital-clock', { time: '23:50' }, { time: '00:10' }, 0.5, { ease: 'linear' }).time, '00:00')
  // 10:10 -> 03:00 on digits: back 7 h 10 min, not forward 16 h 50 min
  assert.equal(L.interpolate('digital-clock', { time: '10:10' }, { time: '03:00' }, 0.5, { ease: 'linear' }).time, '06:35')
})

test('numbers roll through every value, levels spring, the last frame is exact', () => {
  const p = L.plan('bell-count', { count: 3 }, { count: 7 }, 'line', { ms: 600 })
  assert.deepEqual(p.frames.map(f => f.params.count), [4, 5, 6, 7])
  assert.deepEqual(p.frames.at(-1).params, L.resolve('bell-count', { count: 7 }))
  assert.equal(p.swap, false)
  const lv = L.plan('battery-level', { level: 0.2 }, { level: 0.8 }, 'line', { ms: 600 })
  const vals = lv.frames.map(f => f.params.level)
  assert.ok(vals.every(v => v >= 0 && v <= 1))
  assert.ok(Math.max(...vals) <= 0.8 + 0.6 * 0.08 + 0.01, 'a light spring: under 8% overshoot')
  assert.equal(vals.at(-1), 0.8)
  for (let i = 0; i <= 20; i++) { const v = L.interpolate('battery-level', { level: 0 }, { level: 1 }, i / 20).level; assert.ok(v >= 0 && v <= 1) }
})

test('choices and words swap once, on the first frame', () => {
  const p = L.plan('weather', { condition: 'sunny', temperature: 20 }, { condition: 'rain', temperature: 12 }, 'line', { ms: 600 })
  assert.equal(p.swap, true)
  assert.ok(p.frames.every(f => f.params.condition === 'rain'))
  assert.equal(p.frames.at(-1).params.temperature, 12)
})

test('slow styles plan fewer frames (none in between without a worker)', () => {
  const rich = L.styles.map(s => s.name).find(n => L.cost(n) > 40)
  const p = L.plan('bell-count', { count: 3 }, { count: 30 }, rich, { ms: 600 })
  assert.ok(p.frames.length <= 12)
  assert.equal(p.frames.at(-1).params.count, 30)
})

test('reduced motion: no frames, the target at once', async () => {
  L.setMotion({ reduced: true })
  try {
    let painted = 0
    const t = L.transition('bell-count', { count: 1 }, { count: 9 }, 'line', { paint: () => painted++ })
    assert.equal(await t.done, true)
    assert.equal(painted, 0)
    assert.deepEqual(t.params, L.resolve('bell-count', { count: 9 }))
    const el = make('bell-count', { count: '1', animate: '' })
    el.setAttribute('count', '9')
    await new Promise(r => setTimeout(r, 30))
    assert.ok(el.shadowRoot.innerHTML.includes(L.parts('bell-count', { count: 9 }, 'line').inner))
  } finally { L.setMotion({ reduced: null }) }
})

test('transition paints frames in order and ends on the exact target', async () => {
  L.setMotion({ reduced: false })
  try {
    const seen = []
    const t = L.transition('bell-count', { count: 2 }, { count: 6 }, 'line', { ms: 120, paint: p => seen.push(p.count) })
    assert.equal(await t.done, true)
    assert.equal(seen.at(-1), 6)
    for (let i = 1; i < seen.length; i++) assert.ok(seen[i] > seen[i - 1])
  } finally { L.setMotion({ reduced: null }) }
})

test('element `animate`: one transition for attributes set together, exact final drawing, retargets mid-way', async () => {
  L.setMotion({ reduced: false })
  try {
    const el = make('weather', { condition: 'sunny', temperature: '20', animate: '120' })
    const base = el.events.length
    el.setAttribute('condition', 'rain')
    el.setAttribute('temperature', '12')
    assert.ok(!el._tr, 'nothing starts until the task ends (coalesced)')
    await Promise.resolve(); await Promise.resolve()
    assert.ok(el._tr, 'one transition')
    const first = el._tr
    await until(() => !el._tr)
    assert.equal(el.events.length - base, 1, 'one final render event')
    assert.deepEqual(el.events.at(-1).detail.params, L.resolve('weather', { condition: 'rain', temperature: 12 }))
    assert.ok(el.shadowRoot.innerHTML.includes(L.parts('weather', { condition: 'rain', temperature: 12 }, 'line').inner))
    assert.ok(first)
    // retarget: 12 -> 40, then 5 while that transition runs (it starts from what is on screen)
    el.setAttribute('temperature', '40')
    await until(() => el._tr)
    await new Promise(r => setTimeout(r, 40))
    el.setAttribute('temperature', '5')
    await until(() => !el._tr)
    assert.ok(el.shadowRoot.innerHTML.includes(L.parts('weather', { condition: 'rain', temperature: 5 }, 'line').inner))
  } finally { L.setMotion({ reduced: null }) }
})

test('animateTo() moves without the attribute and resolves when drawn', async () => {
  L.setMotion({ reduced: false })
  try {
    const el = make('battery-level', { level: '0.2' })
    await E.animateTo(el, { level: 0.9 }, { ms: 80 })
    assert.equal(el.getAttribute('level'), '0.9')
    assert.ok(el.shadowRoot.innerHTML.includes(L.parts('battery-level', { level: 0.9 }, 'line').inner))
    // without animate, a plain attribute change still draws at once (synchronously)
    el.setAttribute('level', '0.4')
    assert.ok(el.shadowRoot.innerHTML.includes(L.parts('battery-level', { level: 0.4 }, 'line').inner))
  } finally { L.setMotion({ reduced: null }) }
})

test('default accessible name says what the icon shows; label="" is decorative', () => {
  assert.equal(L.describe('calendar-date', { day: 17, month: 'MAR' }), 'Calendar date, March 17')
  assert.match(L.describe('bell-count', { count: 3 }), /, 3$/)
  assert.match(L.describe('battery-level', { level: 0.42 }), /, 42%$/)
  assert.match(L.describe('clock-time', { time: '10:10' }), /, 10:10$/)
  const el = make('calendar-date', { day: '17', month: 'MAR' })
  assert.match(el.shadowRoot.innerHTML, /role="img" aria-label="Calendar date, March 17"/)
  el.setAttribute('label', '')
  assert.match(el.shadowRoot.innerHTML, /aria-hidden="true"/)
  assert.doesNotMatch(el.shadowRoot.innerHTML, /aria-label=/)
  el.setAttribute('label', 'Due date')
  assert.match(el.shadowRoot.innerHTML, /aria-label="Due date"/)
})
