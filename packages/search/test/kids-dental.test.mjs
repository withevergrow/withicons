// node --test packages/search/test/kids-dental.test.mjs
// Icons for day cares and dental clinics (manifest batch new-38). Pitch-deck agents searched for these and found
// nothing ("playground", "stroller", "anxious") or the wrong thing ("dental crown" gave the royal crown).
// Each query must now find its icon with high confidence, without taking the base words from existing icons.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)

// [query, icon, top N it must appear in]
const CASES = [
  ['playground', 'playground', 1],
  ['slide', 'playground', 2], // "slide" also means a presentation slide: presentation may stay first
  ['swing', 'playground', 1],
  ['crayon', 'crayon', 1],
  ['stroller', 'stroller', 1],
  ['pram', 'stroller', 1],
  ['baby bottle', 'baby-bottle', 1],
  ['feeding bottle', 'baby-bottle', 1],
  ['dental chair', 'dental-chair', 1],
  ['dentist chair', 'dental-chair', 1],
  ['dental crown', 'tooth-crown', 1],
  ['tooth cap', 'tooth-crown', 1],
  ['crown tooth', 'tooth-crown', 1],
  ['same day crowns', 'tooth-crown', 1],
  ['anxious', 'worried', 1],
  ['nervous', 'worried', 1],
  ['worried', 'worried', 1],
  ['dental anxiety', 'worried', 1],
]

describe('day care and dental icons', () => {
  for (const [q, name, n] of CASES) {
    test(`"${q}" -> ${name} in top ${n}, high confidence`, () => {
      const r = engine.search(q, { limit: 5 })
      const i = r.findIndex(x => x.name === name)
      assert.ok(i >= 0 && i < n, `got ${r.map(x => x.name).join(', ')}`)
      assert.equal(r[i].confidence, 'high', `${q}: ${name} is ${r[i].confidence}`)
    })
  }

  test('existing icons keep their own words', () => {
    const KEEP = [['crown', 'crown'], ['tooth', 'tooth'], ['dentist', 'tooth'], ['dental', 'tooth'], ['baby', 'baby'],
      ['slides', 'presentation'], ['formula', 'sigma'], ['pencil', 'pencil'], ['sad', 'frown'], ['frown', 'frown'],
      ['art', 'palette'], ['family', 'users'], ['surgery', 'hospital'], ['kindergarten', 'school']]
    for (const [q, name] of KEEP) assert.equal(engine.search(q, { limit: 1 })[0]?.name, name, q)
  })

  test('the royal crown no longer answers "dental crown" first', () => {
    assert.equal(engine.search('dental crown', { limit: 1 })[0].name, 'tooth-crown')
  })

  test('resolve() maps the new aliases to one icon each', () => {
    const ALIASES = [['pram', 'stroller'], ['pushchair', 'stroller'], ['feeding-bottle', 'baby-bottle'],
      ['dentist-chair', 'dental-chair'], ['dental-crown', 'tooth-crown'], ['tooth-cap', 'tooth-crown'],
      ['anxious', 'worried'], ['nervous', 'worried'], ['play-area', 'playground'], ['jungle-gym', 'playground'],
      ['wax-crayon', 'crayon']]
    for (const [alias, name] of ALIASES) assert.deepEqual(engine.resolve(alias), { name, alias }, alias)
  })
})
