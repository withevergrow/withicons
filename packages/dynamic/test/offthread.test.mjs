// Off-main-thread rendering (warm, renderAsync, the render worker) and the element's param precedence.
// A real worker_threads worker runs dist/worker.js behind a tiny adapter shaped like a browser Worker.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { pathToFileURL } from 'node:url'
import { load, dist } from './_setup.mjs'

const L = await load('lite.js')
const FULL = await load('index.js')
const heavy = L.styleNames().filter(s => s !== 'line').sort((a, b) => L.cost(b) - L.cost(a))[0]
const name = 'battery-level' in Object.fromEntries(L.list().map(n => [n, 1])) ? 'battery-level' : L.list()[0]
const meta = L.get(name)
const levelKey = Object.keys(meta.params).find(k => meta.params[k].type === 'level' || meta.params[k].type === 'int')

const BOOT = `
const { parentPort, workerData } = require('node:worker_threads')
let handler = null
globalThis.self = { set onmessage(f) { handler = f }, get onmessage() { return handler }, postMessage: m => parentPort.postMessage(m) }
parentPort.on('message', d => handler && handler({ data: d }))
import(workerData.url)
`
function nodeWorker(counter) {
  const w = new Worker(BOOT, { eval: true, workerData: { url: pathToFileURL(path.join(dist, 'worker.js')).href } })
  const o = { posted: 0, onmessage: null, onerror: null }
  w.on('message', d => o.onmessage && o.onmessage({ data: d }))
  w.on('error', e => o.onerror && o.onerror(e))
  o.postMessage = m => { o.posted++; if (counter) counter.n++; w.postMessage(m) }
  o.terminate = () => w.terminate()
  return o
}

test('cost() ranks rich styles above a frame, line below', () => {
  assert.ok(L.cost('line') <= 16)
  assert.ok(L.cost(heavy) > 16, heavy)
})

test('warm() renders in a worker; render() is then a byte-identical cache hit', async () => {
  const counter = { n: 0 }
  L.setWorker(() => nodeWorker(counter))
  try {
    const p = { [levelKey]: meta.params[levelKey].type === 'level' ? 0.37 : meta.params[levelKey].min }
    assert.equal(L.cached(name, p, heavy), false)
    assert.equal(await L.warm(name, p, heavy), true)
    assert.ok(counter.n >= 1, 'the job went to the worker')
    assert.ok(L.cached(name, p, heavy))
    await L.load(heavy)
    assert.equal(L.render(name, p, heavy), FULL.render(name, p, heavy), 'worker output equals a main-thread render')
    // renderAsync goes through the worker for a rich style too
    const q = { ...p, [levelKey]: meta.params[levelKey].type === 'level' ? 0.81 : meta.params[levelKey].max }
    const before = counter.n
    assert.equal(await L.renderAsync(name, q, heavy, { size: 40 }), FULL.render(name, q, heavy, { size: 40 }))
    assert.ok(counter.n > before)
  } finally { L.setWorker(null) }
})

test('renderAsync({ latest: true }) drops calls replaced before they start; plain calls all resolve', async () => {
  L.setWorker(null)
  L.clearCache()
  const vals = [0.11, 0.22, 0.33, 0.44].map(v => ({ [levelKey]: meta.params[levelKey].type === 'level' ? v : Math.round(meta.params[levelKey].min + v * (meta.params[levelKey].max - meta.params[levelKey].min)) }))
  const latest = await Promise.allSettled(vals.map(v => L.renderAsync(name, v, heavy, { latest: true })))
  assert.equal(latest.at(-1).status, 'fulfilled')
  assert.ok(latest.slice(0, -1).some(r => r.status === 'rejected' && r.reason.code === 'WITH_SUPERSEDED'))
  L.clearCache()
  const all = await Promise.all(vals.map(v => L.renderAsync(name, v, heavy)))
  all.forEach((svg, i) => assert.equal(svg, FULL.render(name, vals[i], heavy)))
})

test('a worker that fails to start falls back to the main thread', async () => {
  L.clearCache()
  L.setWorker(() => { const o = { postMessage() { setTimeout(() => o.onerror && o.onerror({ preventDefault() {} }), 5) }, terminate() {} }; return o })
  try {
    const p = { [levelKey]: meta.params[levelKey].default }
    assert.equal(await L.warm(name, p, heavy), true)
    assert.equal(L.workers(), false)
    assert.equal(L.render(name, p, heavy), FULL.render(name, p, heavy))
  } finally { L.setWorker(null) }
  L.setWorker(() => { throw new Error('blocked by CSP') })
  try { L.clearCache(); assert.equal(await L.warm(name, {}, heavy), true) } finally { L.setWorker(null) }
})

test('warm() with an owner keeps only that owner\'s newest pending job', async () => {
  L.clearCache()
  const owner = {}
  const a = L.warm(name, { [levelKey]: meta.params[levelKey].type === 'level' ? 0.05 : meta.params[levelKey].min }, heavy, { owner })
  const b = L.warm(name, { [levelKey]: meta.params[levelKey].type === 'level' ? 0.95 : meta.params[levelKey].max }, heavy, { owner })
  assert.deepEqual(await Promise.all([a, b]), [false, true])
})

// ---- element: rich styles draw in the background; the last-set param source wins
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
globalThis.HTMLElement ??= FakeElement
const registry = globalThis.customElements ? null : new Map()
if (registry) globalThis.customElements = { define: (n, c) => registry.set(n, c), get: n => registry.get(n) }
globalThis.CustomEvent ??= class CustomEvent { constructor(type, o) { this.type = type; this.detail = o?.detail } }
const E = await load('element.js')
const until = async (fn, ms = 20000) => { const t = Date.now(); while (!fn()) { if (Date.now() - t > ms) throw new Error('timeout'); await new Promise(r => setTimeout(r, 10)) } }

test('element: `params` set after an attribute wins, and an attribute set after `params` wins', () => {
  const C = customElements.get('with-live-icon')
  const cal = L.catalog().find(m => 'day' in m.params) || null
  if (!cal) return
  const el = new C()
  el.setAttribute('name', cal.name)
  el.setAttribute('day', '17')
  el.connect()
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(cal.name, { day: 17 }, 'line').inner))
  el.params = { day: 3 }
  assert.equal(el.params.day, 3)
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(cal.name, { day: 3 }, 'line').inner), 'params wins when set last')
  el.setAttribute('day', '21')
  assert.equal(el.params.day, '21')
  assert.ok(el.shadowRoot.innerHTML.includes(L.parts(cal.name, { day: 21 }, 'line').inner), 'attribute wins when set last')
})

test('element: a rich style keeps the old drawing, then shows the newest params only', async () => {
  const C = customElements.get('with-live-icon')
  L.clearCache()
  const el = new C()
  el.setAttribute('name', name)
  el.setAttribute('variant', heavy)
  el.connect()
  await until(() => el.shadowRoot.innerHTML.includes('<path'))
  const steps = [0.1, 0.3, 0.5, 0.7, 0.9].map(v => meta.params[levelKey].type === 'level' ? v : Math.round(meta.params[levelKey].min + v * (meta.params[levelKey].max - meta.params[levelKey].min)))
  const n0 = el.events.length
  for (const v of steps) el.setAttribute(L.paramAttr(levelKey), String(v))
  const want = L.parts(name, { [levelKey]: steps.at(-1) }, heavy).inner
  await until(() => el.shadowRoot.innerHTML.includes(want))
  assert.ok(el.events.length - n0 <= 2, `drew ${el.events.length - n0} times for 5 quick changes`)
})
