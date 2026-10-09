// Rich styles (gradients): IconBase gives every rendered copy its own gradient ids (uniqueNode + nextUid in attrs.js)
// and renders the nested defs > gradient > stop nodes. No Svelte compiler needed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve(import.meta.dirname, '..', 'dist')
const skip = !fs.existsSync(path.join(dist, 'attrs.js')) && 'build first: node forge/build.mjs svelte --no-site'
const RICH = [
  ['defs', {}, [['linearGradient', { id: 'wg-test-x-0', x1: 0, y1: 0, x2: 24, y2: 0, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': '#f00' }], ['stop', { offset: 1, 'stop-color': '#00f' }]]]]],
  ['path', { d: 'M4 4h16v16H4z', fill: 'url(#wg-test-x-0)' }],
]

test('uniqueNode: per-copy ids, every url(#…) follows, flat nodes untouched', { skip }, async () => {
  const { uniqueNode, nextUid } = await import(pathToFileURL(path.join(dist, 'attrs.js')).href)
  const a = uniqueNode(RICH, nextUid()), b = uniqueNode(RICH, nextUid())
  const id = n => n[0][2][0][1].id
  assert.notEqual(id(a), id(b))
  assert.equal(a[1][1].fill, `url(#${id(a)})`)
  assert.equal(b[1][1].fill, `url(#${id(b)})`)
  assert.equal(RICH[0][2][0][1].id, 'wg-test-x-0', 'the shared data is not changed')
  const flat = [['path', { d: 'M1 1h2' }]]
  assert.equal(uniqueNode(flat, nextUid()), flat)
})

test('IconBase renders nested nodes (defs > gradient > stop) from the per-copy node list', { skip }, () => {
  const src = fs.readFileSync(path.join(dist, 'IconBase.svelte'), 'utf8')
  assert.match(src, /const uid = nextUid\(\);/)
  assert.match(src, /\$: nodes = uniqueNode\(iconNode, uid\);/)
  assert.match(src, /\{#each nodes as \[tag, a, kids\]\}/)
  assert.match(src, /\{#each k2 as \[t3, a3\]\}<svelte:element this=\{t3\} \{\.\.\.a3\} \/>/)
})
