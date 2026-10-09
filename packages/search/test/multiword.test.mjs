// node --test packages/search/test/*.test.mjs
// Multi-word evidence, typo suppression and domain coverage: queries blank AI agents typed and found weak.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const top = (q, n = 5) => engine.search(q, { limit: n }).map(r => r.name)
const has = (q, names, n = 5) => {
  const got = top(q, n)
  for (const w of [].concat(names)) assert.ok(got.includes(w), `"${q}": wanted ${w} in top ${n}, got ${got.join(', ')}`)
}
const lacks = (q, names, n = 5) => {
  const got = top(q, n)
  for (const w of [].concat(names)) assert.ok(!got.includes(w), `"${q}": ${w} should not be in top ${n}, got ${got.join(', ')}`)
}

describe('several words combine their evidence', () => {
  test('"fast delivery" -> truck and motorcycle (each word adds up, not just the "fast food" phrase)', () => has('fast delivery', ['truck', 'motorcycle']))
  test('"live tracking" -> map-pin and navigation', () => has('live tracking', ['map-pin', 'navigation']))
  test('"secure payment" -> credit-card, lock and shield-check', () => has('secure payment', ['credit-card', 'lock', 'shield-check']))
  test('"credit card lock" -> credit-card first, lock close behind', () => {
    const got = top('credit card lock')
    assert.equal(got[0], 'credit-card')
    assert.ok(got.slice(0, 3).includes('lock'), got.join(', '))
    assert.ok(engine.search('credit card lock', { limit: 2 })[1].score > 25, 'lock is a real second answer, not a crumb')
  })
  test('"choose food" -> food icons with a real score', () => {
    const r = engine.search('choose food', { limit: 5 })
    assert.ok(r.every(x => ['utensils', 'salad', 'burger', 'pizza', 'soup', 'apple', 'chef-hat', 'cooking-pot', 'chopsticks'].includes(x.name)), r.map(x => x.name).join(', '))
    assert.ok(r[0].score > 30)
  })
  test('"yoga mat" -> fitness, not calculator / football (math, match)', () => {
    has('yoga mat', 'dumbbell')
    lacks('yoga mat', ['calculator', 'football'], 3)
  })
  test('a full match still beats a strong partial one', () => {
    assert.equal(top('package delivery')[0], 'package')
    assert.equal(top('recycle bin')[0], 'trash')
    assert.equal(top('shopping cart')[0], 'shopping-cart')
  })
  test('partial matches fill in after a short list of full matches', () => {
    assert.ok(top('fast delivery', 10).includes('package'))
    assert.ok(top('credit card lock', 5).length === 5)
  })
})

describe('typo noise is suppressed when the word is real', () => {
  test('"prenatal" is not "rental" (key, hotel, bike, car)', () => {
    lacks('prenatal', ['key', 'hotel', 'bike', 'car'], 10)
    has('prenatal', ['hospital', 'stethoscope'])
    assert.ok(engine.search('prenatal', { limit: 3 }).every(r => !r.match.typo))
  })
  test('"towel" is not "tower" (building)', () => {
    assert.equal(top('towel')[0], 'bath')
    lacks('towel', 'building', 10)
  })
  test('"tracking" -> location and delivery, not music tracks or cookies first', () => {
    has('tracking', ['map-pin', 'navigation', 'truck'])
    lacks('tracking', 'music-note', 8)
    lacks('tracking', 'cookie', 5)
  })
  test('real typos are still corrected and marked', () => {
    const [r] = engine.search('trcuk', { limit: 1 })
    assert.equal(r.name, 'truck')
    assert.equal(r.match.typo, true)
    assert.equal(engine.didYouMean('trcuk'), 'truck')
  })
  test('a misspelling the data carries still wins ("notificaton" -> bell)', () => has('notificaton', 'bell', 3))
  test('a word typed as is is not corrected ("towel", "prenatal", "tracking")', () => {
    for (const q of ['towel', 'prenatal', 'tracking']) assert.equal(engine.didYouMean(q), null, q)
  })
})

describe('domain coverage (honest matches only)', () => {
  const CASES = [
    ['yoga', ['dumbbell']],
    ['meditation', ['brain']],
    ['mindfulness', ['brain']],
    ['wellness', ['flower', 'dumbbell', 'bath']],
    ['spa', ['bath']],
    ['pregnancy', ['hospital']],
    ['shower', ['bath']],
    ['locker', ['lock']],
    ['delivery', ['truck', 'motorcycle', 'package']],
    ['courier', ['truck', 'motorcycle']],
    ['gps', ['map-pin', 'navigation', 'crosshair']],
    ['payment', ['credit-card', 'wallet']],
    ['checkout', ['shopping-cart', 'credit-card']],
    ['secure', ['lock', 'shield-check']],
    ['food', ['utensils']],
    ['restaurant', ['utensils', 'chef-hat']],
    ['menu', ['menu']],
    ['order', ['receipt']],
    ['orders', ['receipt', 'shopping-bag']],
    ['favourite', ['star', 'heart']],
    ['favourites', ['star', 'heart']],
    ['favorites', ['star', 'heart']],
    ['profile', ['user']],
    ['onboarding', ['user-plus', 'list-checks']],
    ['breathing', ['wind']],
  ]
  for (const [q, want] of CASES) test(`"${q}" -> ${want.join(', ')} in top 5`, () => has(q, want))
  test('no baby icon: "baby" never pretends (no person / user icon)', () => lacks('baby', ['user', 'users', 'smile'], 10))
  test('gibberish returns nothing rather than noise', () => assert.deepEqual(top('qzxjvw'), []))
})

describe('latency', () => {
  test('multi-word queries stay fast', () => {
    engine.warm()
    const qs = ['fast delivery', 'live tracking', 'secure payment', 'credit card lock', 'choose food', 'yoga mat', 'prenatal', 'towel']
    const t0 = performance.now()
    for (let r = 0; r < 20; r++) for (const q of qs) engine.search(q, { limit: 24 })
    const per = (performance.now() - t0) / (20 * qs.length)
    assert.ok(per < 5, `${per.toFixed(2)} ms per query`)
  })
})
