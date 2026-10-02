// The full build: styles, determinism, options, nodes/parts, CJS parity.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const L = await load('index.js')

test('bundle has live icons and every style', () => {
  assert.ok(L.list().length > 0, 'no live icons bundled')
  assert.ok(L.styles.length >= 12, 'styles missing')
  assert.equal(L.styles[0].name, 'line')
  for (const s of L.styles) assert.ok(L.loaded(s.name), `${s.name} not bundled in the full build`)
})

// per-style rendering of every icon: styles-*.test.mjs

test('deterministic: same input, byte-identical output (cache cleared)', () => {
  for (const name of L.list()) for (const style of ['line', 'solid', 'pixel']) {
    const ex = L.get(name).examples[0] || {}
    const a = L.render(name, ex, style)
    L.clearCache()
    assert.equal(L.render(name, ex, style), a, `${name}/${style}`)
  }
})

test('examples differ from each other (params reach the drawing)', () => {
  for (const name of L.list()) {
    const exs = L.get(name).examples
    if (exs.length < 2) continue
    const outs = new Set(exs.map(e => L.render(name, e, 'line')))
    assert.ok(outs.size > 1, `${name}: every example renders the same`)
  }
})

test('options: size, color, label, class, vars, strokeWidth, flat, dataUri', () => {
  const name = L.list()[0]
  const s = L.render(name, {}, 'line', { size: 48, color: '#e11d48', label: 'Hi <there>', class: 'a b', strokeWidth: 2 })
  assert.match(s, /width="48" height="48"/)
  assert.match(s, /style="color:#e11d48"/)
  assert.match(s, /role="img" aria-label="Hi &lt;there&gt;"/)
  assert.match(s, /class="a b"/)
  assert.match(s, /stroke-width="2"/)
  assert.doesNotMatch(L.render(name, {}, 'line'), /role=/)
  assert.match(L.render(name, {}, 'line'), /aria-hidden="true"/)
  const abs = L.render(name, {}, 'line', { size: 48, absoluteStrokeWidth: true })
  assert.match(abs, /stroke-width="0.875"/)
  const g = L.render(name, {}, 'glass', { vars: { 'glass-pane': '#123456', '--with-x': 'red;}' } })
  assert.match(g, /--with-glass-pane:#123456/)
  assert.doesNotMatch(g, /red;\}/)
  const flat = L.render(name, {}, 'glass', { flat: true, vars: { 'glass-pane': '#123456' }, color: '#0a0' })
  assert.doesNotMatch(flat, /var\(/)
  assert.doesNotMatch(flat, /currentColor/)
  assert.ok(L.dataUri(name, {}, 'solid').startsWith('data:image/svg+xml;charset=utf-8,%3Csvg'))
  assert.equal(L.placeholder({ size: 32 }), '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"></svg>')
})

test('nodes() and parts() agree with render()', () => {
  const name = L.list()[0]
  const { root, nodes } = L.nodes(name, {}, 'solid')
  assert.equal(root.fill, 'currentColor')
  assert.ok(nodes.length && nodes.every(n => typeof n[0] === 'string' && typeof n[1] === 'object'))
  const { attrs, inner } = L.parts(name, {}, 'solid')
  assert.equal(attrs.viewBox, '0 0 24 24')
  assert.ok(L.render(name, {}, 'solid').includes(inner))
})

test('CJS build matches ESM', async () => {
  const { createRequire } = await import('node:module')
  const { dist } = await import('./_setup.mjs')
  const C = createRequire(import.meta.url)(dist + '/index.cjs')
  assert.deepEqual(C.list(), L.list())
  const name = L.list()[0]
  for (const style of ['line', 'retro']) assert.equal(C.render(name, {}, style), L.render(name, {}, style))
})
