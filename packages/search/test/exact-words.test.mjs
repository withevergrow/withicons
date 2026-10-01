// A correctly spelled word that exists in the vocabulary must never be "corrected" into
// look-alike words (wallet -> mallet/pallet). Regression for the 2026-10 design review.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const CASES = [
  ['wallet', ['hammer', 'palette']],
  ['purse', ['activity', 'heart-pulse']],
]
for (const [q, banned] of CASES) {
  test(`"${q}" returns no typo look-alikes`, () => {
    const res = engine.search(q, { limit: 10 })
    assert.ok(res.length > 0, 'expected results')
    for (const r of res) assert.ok(!banned.includes(r.name), `${r.name} matched "${q}" via ${r.match.kind}:${r.match.term}`)
    for (const r of res) assert.notEqual(r.match.kind, 'typo', `${r.name} is a typo match for a correctly spelled word`)
  })
}
test('known misspellings in the data are still corrected', () => {
  assert.equal(engine.search('calender', { limit: 1 })[0].name, 'calendar')
  assert.equal(engine.didYouMean('calender'), 'calendar')
})
