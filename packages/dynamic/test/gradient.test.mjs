// Rich styles (gradients) in live icons: nested defs markup, per-copy ids (idSuffix / uniqueIds), nodes() keeps children.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const L = await load('index.js')
const name = L.list()[0]
// the styles of this build that draw gradients for this icon
const rich = L.styles.map(s => s.name).filter(s => { try { return L.render(name, {}, s).includes('<defs>') } catch { return false } })

test('uniqueIds suffixes ids and url(#…) together; markup without gradients is unchanged', () => {
  const inner = '<defs><radialGradient id="wg-a-b-0"><stop offset="0"/></radialGradient></defs><path fill="url(#wg-a-b-0)"/>'
  const u = L.uniqueIds(inner, 'x1')
  assert.ok(u.includes('id="wg-a-b-0-x1"') && u.includes('fill="url(#wg-a-b-0-x1)"'))
  assert.equal(L.uniqueIds('<path d="M1 1"/>', 'x1'), '<path d="M1 1"/>')
  assert.equal(L.uniqueIds(inner, ''), inner)
})

test('rich styles: nested defs, idSuffix per copy, nodes() keeps the children', { skip: !rich.length && 'no rich style in this build' }, () => {
  for (const s of rich) {
    const a = L.render(name, {}, s), b = L.render(name, {}, s, { idSuffix: 'k2' })
    assert.match(a, /<defs><(linear|radial)Gradient id="wg-[^"]+"[^>]*>(<stop [^>]*\/>)+<\/(linear|radial)Gradient>/, s)
    const ids = [...b.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])
    assert.ok(ids.length && ids.every(id => id.endsWith('-k2')), s)
    for (const m of b.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(m[1]), `${s}: url(#${m[1]})`)
    const { nodes } = L.nodes(name, {}, s)
    const defs = nodes.find(n => n[0] === 'defs')
    assert.ok(defs && Array.isArray(defs[2]) && defs[2].length, `${s}: nodes() keeps the gradient children`)
    assert.ok(!L.render(name, {}, s, { flat: true }).includes('var('), `${s}: flat resolves stop colours`)
  }
})
