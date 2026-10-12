// Bakery icons (batch new-37: bread, baguette, croissant, wheat, oven, rolling-pin): the words a bakery deck uses find
// them first and with confidence, and the older food icons keep their own queries.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)

// query -> the icon that must come first, named with high confidence
const FIRST = [
  ['bread', 'bread'], ['loaf', 'bread'], ['sourdough', 'bread'], ['loaf of bread', 'bread'], ['loaves', 'bread'],
  ['baguette', 'baguette'], ['french bread', 'baguette'], ['french stick', 'baguette'],
  ['croissant', 'croissant'], ['pastry', 'croissant'], ['croissants', 'croissant'],
  ['wheat', 'wheat'], ['grain', 'wheat'], ['flour', 'wheat'], ['harvest', 'wheat'], ['gluten', 'wheat'], ['ear of wheat', 'wheat'],
  ['oven', 'oven'], ['baking oven', 'oven'], ['stove', 'oven'], ['cooker', 'oven'],
  ['rolling pin', 'rolling-pin'], ['rollingpin', 'rolling-pin'], ['dough', 'rolling-pin'],
]
// spelling slips land on the icon
const TYPOS = [['croisant', 'croissant'], ['bagette', 'baguette'], ['crossant', 'croissant'], ['brede', 'bread']]
// the older icons keep the queries they own
const KEEP = [['cake', 'cake'], ['bakery', 'cake'], ['donut', 'donut'], ['cookie', 'cookie'], ['pin', 'pin'], ['map pin', 'map-pin'],
  ['flower', 'flower'], ['dutch oven', 'cooking-pot'], ['toast', 'wine'], ['crescent', 'moon'], ['cereal', 'soup']]

describe('bakery icons', () => {
  for (const [q, want] of FIRST) test(`"${q}" -> ${want} first, high confidence`, () => {
    const [top] = engine.search(q, { limit: 5 })
    assert.equal(top && top.name, want, `${q}: ${engine.search(q, { limit: 5 }).map(r => r.name).join(', ')}`)
    assert.equal(top.confidence, 'high')
  })
  for (const [q, want] of TYPOS) test(`typo "${q}" -> ${want}`, () => {
    assert.equal(engine.search(q, { limit: 3 })[0]?.name, want)
  })
  for (const [q, want] of KEEP) test(`"${q}" still -> ${want}`, () => {
    assert.equal(engine.search(q, { limit: 3 })[0]?.name, want)
  })
  test('the bread family shows up for bakery and bread', () => {
    const bakery = engine.search('bakery', { limit: 6 }).map(r => r.name)
    for (const n of ['bread', 'baguette']) assert.ok(bakery.includes(n), `bakery: ${bakery.join(', ')}`)
    const bread = engine.search('bread', { limit: 3 }).map(r => r.name)
    assert.ok(bread.includes('baguette'), `bread: ${bread.join(', ')}`)
  })
  test('aliases resolve; pastry is shared with donut', () => {
    assert.equal(engine.resolve('loaf').name, 'bread')
    assert.equal(engine.resolve('french-bread').name, 'baguette')
    assert.equal(engine.resolve('flour').name, 'wheat')
    assert.equal(engine.resolve('baking-oven').name, 'oven')
    assert.equal(engine.resolve('RollingPin').name, 'rolling-pin')
    assert.deepEqual([...engine.resolve('pastry').ambiguous].sort(), ['croissant', 'donut'])
  })
})
