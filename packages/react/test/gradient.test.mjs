// Rich styles (gradients): every rendered copy of an icon gets its own gradient ids, and every url(#id) follows them.
// Runs the generated runtime (dist/base.cjs) against a tiny stand-in for React (no React install needed): createElement
// builds a plain tree, useId hands out ids like React's.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Module, { createRequire } from 'node:module'

const dist = path.resolve(import.meta.dirname, '..', 'dist')
const skip = !fs.existsSync(path.join(dist, 'base.cjs')) && 'build first: node forge/build.mjs react --no-site'

let ids = 0
const fakeReact = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat().filter(c => c != null) }),
  forwardRef: render => ({ render }),
  lazy: f => f,
  useId: () => ':r' + (ids++).toString(32) + ':',
  useMemo: f => f(),
  useState: f => [typeof f === 'function' ? f() : f],
}
function load(file) {
  const orig = Module._load
  Module._load = function (req, ...rest) { return req === 'react' ? fakeReact : orig.call(this, req, ...rest) }
  try { return createRequire(import.meta.url)(file) } finally { Module._load = orig }
}
const render = (C, props = {}) => C.render(props, null)
// every element's id / url(#…) references in a rendered tree
function refs(tree) {
  const out = { ids: [], urls: [] }
  const walk = n => {
    if (!n || typeof n !== 'object') return
    for (const [k, v] of Object.entries(n.props || {})) {
      if (k === 'id') out.ids.push(v)
      else if (typeof v === 'string') for (const m of v.matchAll(/url\(#([^)]+)\)/g)) out.urls.push(m[1])
    }
    ;(n.children || []).forEach(walk)
  }
  walk(tree)
  return out
}
const RICH = [
  ['defs', {}, [['linearGradient', { id: 'wg-test-x-0', x1: 0, y1: 0, x2: 24, y2: 24, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, stopColor: 'var(--with-test-c1, #f00)' }], ['stop', { offset: 1, stopColor: 'var(--with-test-c2, #00f)' }]]]]],
  ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-test-x-0)' }],
  ['path', { d: 'M8 8h8v8H8z', stroke: 'url(#wg-test-x-0)', fill: 'none' }],
]

test('a gradient icon rendered twice has unique, consistent ids', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const X = createWithIcon('x', 'line', 'X', RICH)
  const a = refs(render(X)), b = refs(render(X))
  assert.equal(a.ids.length, 1)
  assert.notEqual(a.ids[0], b.ids[0], 'two copies, two ids')
  for (const r of [a, b]) {
    assert.match(r.ids[0], /^wg-test-x-0-[\w-]+$/)
    assert.deepEqual([...new Set(r.urls)], r.ids, 'every url(#…) points at this copy\'s gradient')
  }
  // the data itself is never changed
  assert.equal(RICH[0][2][0][1].id, 'wg-test-x-0')
})

test('nested children render as nested elements (defs > linearGradient > stop)', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const tree = render(createWithIcon('x', 'line', 'X', RICH))
  const defs = tree.children.find(c => c.type === 'defs')
  assert.ok(defs, 'defs rendered')
  assert.equal(defs.children[0].type, 'linearGradient')
  assert.deepEqual(defs.children[0].children.map(c => c.type), ['stop', 'stop'])
})

test('flat icons keep their shared children (no per-copy work)', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const X = createWithIcon('y', 'line', 'Y', [['path', { d: 'M1 1h2' }]])
  const before = ids
  const t1 = render(X), t2 = render(X)
  assert.equal(ids, before, 'useId is not called for flat icons')
  assert.equal(t1.children[0], t2.children[0])
})

test('rich styles in this build ship nested gradient data and React-cased stop attributes', { skip }, () => {
  const styles = fs.readdirSync(dist).filter(d => fs.existsSync(path.join(dist, d, 'index.js')))
  const rich = styles.filter(s => fs.readFileSync(path.join(dist, s, 'index.js'), 'utf8').includes('["defs",{},['))
  if (!rich.length) return   // no rich style rendered in this build
  for (const s of rich) {
    const src = fs.readFileSync(path.join(dist, s, 'index.js'), 'utf8')
    assert.ok(!src.includes('"stop-color"'), `${s}: stop-color is camelCased for React`)
    assert.ok(/[{,]"?stopColor"?:/.test(src), s)   // compact data: keys unquoted
  }
})
