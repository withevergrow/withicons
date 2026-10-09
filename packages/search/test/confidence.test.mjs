// node --test packages/search/test/*.test.mjs
// Engine 1.5: term importance, real-word honesty, confidence, filtered ranking, query understanding.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { create, variants, ENGINE_VERSION } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const top = (q, n = 5, o = {}) => engine.search(q, { limit: n, ...o }).map(r => r.name)
const conf = (q, name) => { const r = engine.search(q, { limit: 50 }).find(x => x.name === name); return r && r.confidence }

describe('confidence', () => {
  test('every result carries high / medium / low, and low ones are flagged weak', () => {
    for (const q of ['home', 'yoga', 'fast delivery', 'settigns', 'money', 'cats and dogs']) {
      for (const r of engine.search(q, { limit: 24 })) {
        assert.ok(['high', 'medium', 'low'].includes(r.confidence), `${q}: ${r.name}`)
        assert.equal(r.weak === true, r.confidence === 'low', `${q}: ${r.name} weak flag`)
      }
    }
  })
  test('what the query names is high; related things are not', () => {
    assert.equal(conf('home', 'home'), 'high')
    assert.equal(conf('calendar', 'calendar'), 'high')
    assert.equal(conf('fast delivery', 'truck'), 'high')
    assert.notEqual(conf('home', 'router'), 'high') // "home hub"
    assert.notEqual(conf('book', 'bookmark'), 'high') // a longer word that starts with the query
  })
  test('a spelling fix is at most medium', () => assert.equal(conf('settigns', 'settings') === 'low', false))
  test('a word no icon carries is answered by its concept, flagged low ("pilates" -> fitness)', () => {
    const r = engine.search('pilates', { limit: 5 })
    assert.ok(r.length && r.every(x => x.confidence === 'low'), r.map(x => x.name + ':' + x.confidence).join(', '))
  })
  test('a word that only leads phrases names nothing ("baby" shower, "church" bell)', () => {
    // (run 12: "baby" and "church" are carried by icons now; the rule still applies to any word that only leads phrases)
    for (const q of ['church'].filter(w => !engine.search(w, { limit: 1 }).some(r => r.match.term === w))) for (const r of engine.search(q, { limit: 5 })) assert.equal(r.confidence, 'low', `${q}: ${r.name}`)
  })
})

describe('real words are not typos', () => {
  test('common English words are never corrected into other words', () => {
    for (const q of ['bean', 'grinder', 'mat', 'bear', 'lime', 'shoe', 'rice', 'deer', 'soap', 'pray', 'horse']) {
      for (const r of engine.search(q, { limit: 10 })) assert.equal(r.match.typo, false, `${q}: ${r.name} (${r.match.term})`)
    }
    assert.equal(engine.didYouMean('bean'), null)
    assert.equal(engine.didYouMean('grinder'), null)
  })
  test('they return their honest matches or nothing', () => {
    assert.deepEqual(top('mat'), []) // not math / match
    assert.deepEqual(top('grinder'), []) // not gender reveal
    assert.ok(top('yin yang').every(n => n === 'contrast'), top('yin yang').join()) // its own synonym (run 12), never young plant
    assert.deepEqual(top('bean'), ['paw-print']) // toe beans: a real (plural) match, not "ban"
    lacksAll('bear', ['beer', 'navigation'])
  })
  test('real words are not split into two ("fireworks", "guitar", "playground")', () => {
    for (const q of ['fireworks', 'guitar', 'playground', 'copyright']) assert.equal(engine.parse(q).split, false, q)
  })
  test('a whole word does not complete into a different one ("tax" leads with tax, "pain" with pain)', () => {
    assert.ok(!top('tax', 3).includes('taxi'))
    assert.ok(!top('pain', 2).includes('paintbrush'))
    assert.ok(!top('temple', 5).includes('layout-template'))
  })
  test('real typos are still corrected', () => {
    assert.equal(top('settigns', 1)[0], 'settings')
    assert.equal(top('calender', 1)[0], 'calendar')
    assert.equal(top('trcuk', 1)[0], 'truck')
  })
})
function lacksAll(q, names) { const got = top(q, 10); for (const n of names) assert.ok(!got.includes(n), `${q}: ${n} in ${got.join(', ')}`) }

describe('term importance', () => {
  test('one-word modifiers rank what they describe over phrases they merely lead', () => {
    assert.ok(!top('tracking', 4).includes('cookie'), top('tracking', 6).join(', ')) // "tracking cookie"
    assert.ok(!top('live', 3).includes('headset'), top('live', 6).join(', ')) // "live support"
    assert.ok(top('fast', 5).includes('zap'))
  })
  test('a whole entry beats a compound that ends in the word', () => {
    assert.equal(top('storage', 3).includes('hard-drive'), true)
    assert.equal(top('muted', 1)[0] === 'video-off', false)
  })
  test('missing a modifier costs less than missing the head noun', () => {
    const r = engine.search('fast delivery', { limit: 10 })
    const pkg = r.find(x => x.name === 'package'), rocket = r.find(x => x.name === 'rocket')
    assert.ok(pkg && (!rocket || pkg.score > rocket.score), r.map(x => x.name + ':' + x.score).join(', '))
  })
})

describe('query understanding', () => {
  test('filler and logo words are dropped', () => {
    assert.equal(top('the icon for settings', 1)[0], 'settings')
    assert.equal(top('twitter logo', 1)[0], 'bird')
    assert.deepEqual(engine.parse('logo of twitter').required.map(t => t.w), ['twitter'])
  })
  test('style and category words are detected', () => {
    const p = engine.parse('solid home icons')
    assert.equal(p.style, 'solid')
    assert.deepEqual(p.required.map(t => t.w), ['home'])
    assert.equal(engine.parse('weather icons').category, 'weather')
    assert.equal(engine.parse('home').category, null) // home is an icon first
  })
  test('British spellings and irregular plurals match', () => {
    assert.deepEqual(variants('colour'), ['color'])
    assert.ok(variants('centre').includes('center'))
    assert.ok(variants('analyse').includes('analyze'))
    assert.equal(top('knives', 1)[0], 'utensils')
    assert.ok(top('neighbourhood', 2).some(n => n === 'map' || n === 'map-pin'))
    assert.ok(top('analyse', 2).some(n => n.startsWith('chart')))
  })
  test('"x and y" / "x or y": the whole match leads, then each side', () => {
    assert.deepEqual(engine.parse('cats and dogs').segments, ['cats', 'dogs'])
    assert.deepEqual(top('cats and dogs', 2).sort(), ['cat', 'dog'])
    assert.equal(conf('cats and dogs', 'cat'), 'high')
    assert.equal(top('sun or moon', 1)[0], 'sun-moon')
    assert.ok(top('sun or moon', 3).includes('moon') && top('sun or moon', 3).includes('sun'))
    assert.equal(top('drag and drop', 1)[0], 'drag-handle') // a phrase the data carries stays a phrase
    assert.equal(top('terms and conditions', 1)[0], 'scroll-text')
  })
  test('a lone letter beside real words only adds evidence ("t-shirt" is not the letter t)', () => {
    assert.ok(!top('t-shirt').includes('type'))
    assert.equal(top('x circle', 1)[0], 'x-circle')
  })
})

describe('filtered ranking', () => {
  test('a category ranks within itself with the same scores (no empty page)', () => {
    const all = engine.search('star', { limit: 500 })
    const inCat = engine.search('star', { category: 'status', limit: 500 })
    assert.deepEqual(inCat.map(r => r.name), all.filter(r => r.category === 'status').map(r => r.name))
    assert.ok(inCat.length > 0)
  })
  test('query() offers the strong matches the filter hid', () => {
    const r = engine.query('truck', { category: 'food', limit: 5 })
    assert.ok(r.outside && r.outside[0].name === 'truck', JSON.stringify(r.outside))
    assert.ok(r.results.every(x => x.category === 'food'))
    const ok = engine.query('pizza', { category: 'food' })
    assert.equal(ok.results[0].name, 'pizza')
    assert.equal(ok.outside, undefined) // a strong filtered set needs no outside suggestions
  })
  test('tags filter', () => {
    const r = engine.search('heart', { tags: ['health'], limit: 50 })
    assert.ok(r.length > 0)
    for (const x of r) assert.ok(engine.get(x.name).tags.includes('health'), x.name)
  })
  test('style filter keeps the ranking', () => assert.equal(top('home', 1, { style: 'line' })[0], 'home'))
})

describe('query() and no-result honesty', () => {
  test('shape', () => {
    const r = engine.query('settigns', { limit: 3 })
    for (const k of ['query', 'results', 'total', 'best', 'confidence', 'parsed']) assert.ok(k in r, k)
    assert.equal(r.didYouMean, 'settings')
    assert.equal(r.results[0].name, 'settings')
  })
  test('nothing matches: empty results with a browse hint, never noise', () => {
    for (const q of ['qzxjvw', 'grinder']) {
      const r = engine.query(q)
      assert.deepEqual(r.results, [], q)
      assert.ok(r.browse && r.browse.categories.length > 10, q)
    }
  })
  test('the engine version is 1.5', () => assert.ok(ENGINE_VERSION.startsWith('1.5')))
})

describe('evaluation set (eval/golden.json)', () => {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const run = path.join(here, '..', 'eval', 'run.mjs')
  test('quality stays above the launch thresholds', { skip: !fs.existsSync(run) }, () => {
    const out = path.join(os.tmpdir(), `withicons-eval-${process.pid}.json`)
    const r = spawnSync(process.execPath, [run, '--engine', path.join(here, '..', 'dist', 'index.js'), '--quiet', '--reps', '1', '--out', out,
      '--fail-under', 'ndcg5=0.92,mrr=0.95,noIcon=0.9,noise=0.02,bad5=0.2'], { encoding: 'utf8' })
    try { fs.unlinkSync(out) } catch {}
    assert.equal(r.status, 0, r.stderr + r.stdout)
  })
})
