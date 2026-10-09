// Rich styles (gradients): every rendered copy of an icon gets its own gradient ids, and every url(#id) follows them.
// Runs the generated runtime (dist/base.cjs) against a tiny stand-in for Vue (no Vue install needed).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Module, { createRequire } from 'node:module'

const dist = path.resolve(import.meta.dirname, '..', 'dist')
const skip = !fs.existsSync(path.join(dist, 'base.cjs')) && 'build first: node forge/build.mjs vue --no-site'

let n = 0
const fakeVue = {
  h: (type, props, children) => ({ type, props: props || {}, children: Array.isArray(children) ? children.flat() : children == null ? [] : [children] }),
  defineAsyncComponent: f => f,
  useId: () => 'v-' + n++,
}
function load(file) {
  const orig = Module._load
  Module._load = function (req, ...rest) { return req === 'vue' ? fakeVue : orig.call(this, req, ...rest) }
  try { return createRequire(import.meta.url)(file) } finally { Module._load = orig }
}
const props = { size: 24, color: 'currentColor' }
const ctx = { attrs: {}, slots: {} }
const draw = C => typeof C === 'function' ? C(props, ctx) : C.setup(props, ctx)()
function refs(tree) {
  const out = { ids: [], urls: [] }
  const walk = x => {
    if (!x || typeof x !== 'object') return
    for (const [k, v] of Object.entries(x.props || {})) {
      if (k === 'id') out.ids.push(v)
      else if (typeof v === 'string') for (const m of v.matchAll(/url\(#([^)]+)\)/g)) out.urls.push(m[1])
    }
    ;(x.children || []).forEach(walk)
  }
  walk(tree)
  return out
}
const RICH = [
  ['defs', {}, [['radialGradient', { id: 'wg-test-x-0', cx: 12, cy: 12, r: 10, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': 'var(--with-test-c1, #f00)' }], ['stop', { offset: 1, 'stop-color': 'var(--with-test-c2, #00f)' }]]]]],
  ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-test-x-0)' }],
]

test('a gradient icon is a stateful component: two copies, two sets of ids', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const X = createWithIcon('x', 'line', 'X', RICH)
  assert.equal(typeof X.setup, 'function')
  assert.equal(X.iconNode, RICH)
  const a = refs(draw(X)), b = refs(draw(X))
  assert.notEqual(a.ids[0], b.ids[0])
  for (const r of [a, b]) {
    assert.match(r.ids[0], /^wg-test-x-0-[\w-]+$/)
    assert.deepEqual(r.urls, r.ids)
  }
  const tree = draw(X)
  const defs = tree.children.find(c => c.type === 'defs')
  assert.equal(defs.children[0].type, 'radialGradient')
  assert.equal(defs.children[0].children.length, 2)
})

test('flat icons stay functional components', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const Y = createWithIcon('y', 'line', 'Y', [['path', { d: 'M1 1h2' }]])
  assert.equal(typeof Y, 'function')
  assert.equal(draw(Y).children[0].type, 'path')
})
