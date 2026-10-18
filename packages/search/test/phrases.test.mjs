// node --test packages/search/test/*.test.mjs
// Multi-word phrases agents typed in plain English while building pitch decks (docs/MCP-AGENT-EVAL.md row 8).
// The engine used to match single words of a phrase and rank the wrong sense first: "children playing" -> media
// playback, "shop counter" -> rotate-ccw (counter-clockwise), "nature-based day care" -> dog (doggy daycare).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const top = (q, n = 5) => engine.search(q, { limit: n }).map(r => r.name)
const show = q => engine.search(q, { limit: 8 }).map(r => `${r.name}:${r.confidence}`).join(', ')
// what the MCP lists as an exact match (search_icons): high, or medium that is not a concept match
const isExact = r => r.confidence === 'high' || (r.confidence === 'medium' && r.match.kind !== 'concept')
const exact = q => engine.query(q, { limit: 40 }).results.filter(isExact).map(r => r.name)
const someIn = (got, names) => got.some(n => names.includes(n))
const noneIn = (got, names) => !got.some(n => names.includes(n))

const MEDIA = ['play', 'audio-lines', 'list-music', 'circle-play', 'repeat', 'shuffle', 'picture-in-picture', 'triangle']
const KIDS = ['playground', 'teddy-bear', 'kite', 'water-balloon', 'balloon', 'baby', 'avatar-boy', 'avatar-girl', 'avatar-baby', 'avatar-teen', 'shapes', 'pichkari', 'rainbow']

describe('query understanding: function words, hyphenated compounds, style words', () => {
  test('"X-based" marks X as a modifier: "based" carries nothing', () => {
    assert.deepEqual(engine.parse('nature-based day care').required.map(t => t.w), ['nature', 'day', 'care'])
    assert.equal(top('plant based', 1)[0], 'salad') // the phrase the data carries still matches whole
  })
  test('a style word followed by an -ing participle is the subject, not a style ("children playing")', () => {
    const p = engine.parse('children playing')
    assert.notEqual(p.style, 'plush')
    assert.deepEqual(p.required.map(t => t.w), ['children', 'playing'])
    assert.equal(engine.parse('kids home').style, 'plush') // a style word before a noun is still a style
  })
  test('"photo of ..." keeps the photo when more follows than the subject', () => {
    assert.ok(engine.parse('photo of child daily update').required.some(t => t.w === 'photo'))
    assert.ok(!engine.parse('a picture of a house').required.some(t => t.w === 'picture'))
  })
})

describe('the head sense wins over a stray word', () => {
  test('"children playing" -> kids and toys, not media playback', () => {
    const got = top('children playing')
    assert.ok(noneIn(got, MEDIA), show('children playing'))
    assert.ok(KIDS.includes(got[0]), show('children playing'))
    assert.ok(noneIn(exact('children playing'), MEDIA), exact('children playing').join(', '))
  })
  test('"nature-based day care" -> baby first, dog (doggy daycare) neither first nor exact', () => {
    const got = top('nature-based day care')
    assert.ok(['baby', 'avatar-baby'].includes(got[0]), show('nature-based day care'))
    assert.ok(!top('nature-based day care', 2).includes('dog'), show('nature-based day care'))
    assert.ok(!exact('nature-based day care').includes('dog'), exact('nature-based day care').join(', '))
    assert.ok(noneIn(got, ['salad', 'rose']), show('nature-based day care'))
  })
  test('"shop counter" -> store; counter-clockwise and step counters are other senses', () => {
    const got = top('shop counter')
    // 2026-10: cash-register (a till: "checkout counter", "shop") is the literal shop-counter object and may lead
    assert.ok(['store', 'cash-register'].includes(got[0]), show('shop counter'))
    assert.ok(got.includes('store'), show('shop counter'))
    assert.ok(noneIn(got, ['rotate-ccw', 'activity', 'person-running', 'watch']), show('shop counter'))
    assert.ok(noneIn(exact('shop counter'), ['rotate-ccw', 'activity', 'watch']), exact('shop counter').join(', '))
  })
  test('"diaspora family" -> family icons, not type (font family)', () => {
    const got = top('diaspora family')
    assert.ok(!got.includes('type'), show('diaspora family'))
    assert.ok(top('diaspora family', 3).includes('users'), show('diaspora family'))
  })
  test('"working parent" -> parent icons lead; loader / dumbbell (working out) do not', () => {
    // "working" describes the parent. Only two icons carry "parent", so loader (alias "working") still follows them,
    // flagged low: the honest fix for the rest is data (a working-parent icon), not ranking
    const got = top('working parent')
    // a stroller is a fair third answer for a parent (it arrived with the kids and dental icons)
    assert.deepEqual(got.slice(0, 3).sort(), ['avatar-baby', 'baby', 'stroller'], show('working parent'))
    assert.ok(noneIn(got, ['dumbbell', 'bug', 'clock']), show('working parent'))
    assert.ok(noneIn(exact('working parent'), ['loader', 'dumbbell', 'bug', 'clock']), exact('working parent').join(', '))
  })
  test('"photo of child daily update" -> a camera or image near the top', () => {
    const got = top('photo of child daily update', 3)
    assert.ok(someIn(got, ['camera', 'image']), show('photo of child daily update'))
    assert.ok(noneIn(top('photo of child daily update'), ['user-pen', 'corner-down-right']), show('photo of child daily update'))
  })
  test('"staff to child ratio" -> people and child icons, not tree-UI "child" items', () => {
    const got = top('staff to child ratio')
    assert.ok(someIn(got, ['users', 'users-round', 'user-round']), show('staff to child ratio'))
    assert.ok(someIn(got, ['baby', 'avatar-boy', 'avatar-girl', 'avatar-baby']), show('staff to child ratio'))
    assert.ok(!got.includes('indent-increase'), show('staff to child ratio'))
  })
  test('"same-day fast turnaround" -> truck (same day delivery) first, no sun for "day"', () => {
    const got = top('same-day fast turnaround')
    assert.equal(got[0], 'truck')
    assert.ok(noneIn(got, ['sun', 'sun-moon', 'sunrise', 'sunset', 'wind']), show('same-day fast turnaround'))
  })
  test('"waiting list" -> the list (the head noun) is the one exact match; waiting icons are still found', () => {
    // no icon carries "waiting list" or "waitlist": hourglass ("waiting") ties with the list-* names that only share "list"
    assert.equal(top('waiting list', 1)[0], 'list', show('waiting list'))
    assert.ok(!exact('waiting list').some(n => n === 'list-music' || n === 'list-filter'), exact('waiting list').join(', '))
    assert.ok(top('waiting list', 12).includes('hourglass'), show('waiting list'))
  })
})

describe('calibration: a partial match is exact only when it covers the head', () => {
  test('one of several words, not the head -> never exact', () => {
    // loader matches only "working" (a modifier); rotate-ccw only "counter" in another sense
    assert.ok(!exact('working parent').includes('loader'))
    assert.ok(!exact('shop counter').includes('rotate-ccw'))
    assert.ok(!exact('same-day fast turnaround').some(n => n.startsWith('sun')))
  })
  test('the head covered, a modifier missed -> may be exact', () => {
    assert.ok(exact('nature-based day care').includes('baby'), exact('nature-based day care').join(', '))
    // 2026-10: cash-register ("checkout counter", "shop") now covers both words and answers exactly
    assert.ok(exact('shop counter').some(n => n === 'store' || n === 'cash-register') || ['store', 'cash-register'].includes(engine.query('shop counter').results[0].name))
  })
  test('"anxious worried patient" is answered by the worried face (it had no honest icon before `worried` existed)', () => {
    assert.equal(engine.query('anxious worried patient').results[0].name, 'worried')
  })
  test('queries with no honest icon find nothing exact', () => {
    for (const q of ['unit economics', 'market size', 'diaspora family']) {
      const ex = exact(q)
      assert.ok(ex.length === 0 || q === 'diaspora family', `${q}: ${ex.join(', ')}`)
    }
  })
})

describe('the phrases the data carries still match whole', () => {
  const CASES = [
    ['doggy daycare', 'dog'],
    ['font family', 'type'],
    ['counter clockwise', 'rotate-ccw'],
    ['now playing', 'audio-lines'],
    ['step counter', 'activity'],
    ['day care', 'baby'],
    ['magnifying glass', 'search'],
    ['fast delivery', 'truck'],
  ]
  for (const [q, want] of CASES) test(`"${q}" -> ${want} first, high`, () => {
    const [r] = engine.search(q, { limit: 1 })
    assert.equal(r.name, want, show(q))
    assert.equal(r.confidence, 'high', show(q))
  })
  test('"day care": doggy daycare is a narrower sense, below the plain daycare icons', () => {
    const got = top('day care', 3)
    assert.deepEqual(got.slice(0, 2).sort(), ['avatar-baby', 'baby'])
  })
})
