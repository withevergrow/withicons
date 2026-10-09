// Rich styles (gradients): every rendered copy of an icon gets its own gradient ids, and every url(#id) follows them.
// Runs the generated runtime (dist/base.cjs) against a tiny stand-in for solid-js (no Solid install needed):
// Dynamic elements become plain { component, props } objects.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import Module, { createRequire } from 'node:module'

const dist = path.resolve(import.meta.dirname, '..', 'dist')
const skip = !fs.existsSync(path.join(dist, 'base.cjs')) && 'build first: node forge/build.mjs solid --no-site'

let n = 0
const Dynamic = p => p
const fakeSolid = {
  createComponent: (C, p) => C(p),
  createMemo: f => f,
  createUniqueId: () => 'cl-' + n++,
  lazy: f => f,
  mergeProps: (...a) => Object.assign({}, ...a.map(x => typeof x === 'function' ? x() : x)),
  splitProps: (p, keys) => [Object.fromEntries(keys.map(k => [k, p[k]])), Object.fromEntries(Object.entries(p).filter(([k]) => !keys.includes(k)))],
}
const fakeWeb = { Dynamic, insert() {}, isServer: true, template() {}, getNextElement() {} }
function load(file) {
  const orig = Module._load
  Module._load = function (req, ...rest) { return req === 'solid-js' ? fakeSolid : req === 'solid-js/web' ? fakeWeb : orig.call(this, req, ...rest) }
  try { return createRequire(import.meta.url)(file) } finally { Module._load = orig }
}
function refs(el) {
  const out = { ids: [], urls: [], tags: [] }
  const walk = x => {
    if (!x || typeof x !== 'object') return
    if (Array.isArray(x)) return x.forEach(walk)
    out.tags.push(x.component)
    for (const [k, v] of Object.entries(x)) {
      if (k === 'id') out.ids.push(v)
      else if (k !== 'children' && typeof v === 'string') for (const m of v.matchAll(/url\(#([^)]+)\)/g)) out.urls.push(m[1])
    }
    walk(x.children)
  }
  walk(el.children)
  return out
}
const RICH = [
  ['defs', {}, [['linearGradient', { id: 'wg-test-x-0', x1: 0, y1: 0, x2: 24, y2: 0, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': '#f00' }], ['stop', { offset: 1, 'stop-color': '#00f' }]]]]],
  ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-test-x-0)' }],
]

test('a gradient icon rendered twice has unique, consistent ids (createUniqueId)', { skip }, () => {
  const { createWithIcon } = load(path.join(dist, 'base.cjs'))
  const X = createWithIcon('x', 'line', 'X', RICH)
  const a = refs(X({})), b = refs(X({}))
  assert.notEqual(a.ids[0], b.ids[0])
  for (const r of [a, b]) {
    assert.match(r.ids[0], /^wg-test-x-0-[\w-]+$/)
    assert.deepEqual(r.urls, r.ids)
    assert.deepEqual(r.tags.slice(0, 4), ['defs', 'linearGradient', 'stop', 'stop'])
  }
})
