// node --test packages/search/test/*.test.mjs
import { test, describe, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { create, words, stem, distance, fold, phonetic, weightedDistance } from '../dist/index.js'
import index from '../dist/data.js'
import { CASES, HARD, MISSPELL } from './cases.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')
const engine = create(index)
const top = (q, n = 5, o = {}) => engine.search(q, { limit: n, ...o }).map(r => r.name)

for (const [label, LIST] of [['real user queries', CASES], ['hard queries (unseen typos, intent)', HARD], ['misspellings (similarity layer)', MISSPELL]]) describe('ranking: ' + label, () => {
  let hits = 0, top1 = 0
  const misses = []
  for (const [q, want, n] of LIST) {
    const ok = [].concat(want)
    test(`"${q}" -> ${ok.join('|')} in top ${n}`, () => {
      const got = top(q, Math.max(n, 5))
      const rank = got.findIndex(g => ok.includes(g))
      if (rank === 0) top1++
      if (rank >= 0 && rank < n) hits++
      else misses.push(`"${q}" wanted ${ok.join('|')} top ${n}, got ${got.slice(0, 5).join(', ')}`)
      assert.ok(rank >= 0 && rank < n, `got ${got.join(', ')}`)
    })
  }
  after(() => {
    console.log(`\n# ranking, ${label}: hit rate ${hits}/${LIST.length} (${(100 * hits / LIST.length).toFixed(1)}%), top-1 ${top1}/${LIST.length}`)
    for (const m of misses) console.log('#   MISS ' + m)
  })
})

describe('API shape', () => {
  test('search returns the documented fields', () => {
    const [r] = engine.search('trash can', { limit: 1 })
    assert.deepEqual(Object.keys(r).sort(), ['category', 'confidence', 'match', 'name', 'score', 'title'])
    assert.equal(r.name, 'trash')
    assert.equal(r.title, 'Trash')
    assert.equal(typeof r.score, 'number')
    assert.ok(['name', 'alias', 'synonym', 'tag', 'category', 'description'].includes(r.match.field))
    assert.equal(typeof r.match.term, 'string')
    assert.equal(typeof r.match.typo, 'boolean')
  })
  test('typo flag is set for fuzzy matches only', () => {
    assert.equal(engine.search('umbrelal', { limit: 1 })[0].match.typo, true)
    assert.equal(engine.search('umbrella', { limit: 1 })[0].match.typo, false)
  })
  test('match.kind names how the query matched', () => {
    const kind = q => engine.search(q, { limit: 1 })[0].match.kind
    assert.equal(kind('calendar'), 'exact')
    assert.equal(kind('calen'), 'prefix')
    assert.equal(kind('deleting'), 'stem')
    assert.equal(kind('settinsg'), 'typo')
    assert.equal(kind('skedule'), 'phonetic')
    assert.equal(kind('hrgglass'), 'similar')
    assert.ok(engine.search('money', { limit: 24 }).some(r => r.match.kind === 'concept'))
    for (const q of ['settinsg', 'skedule', 'hrgglass', 'calender']) assert.equal(engine.search(q, { limit: 1 })[0].match.typo, true, q)
    for (const q of ['calendar', 'calen', 'folders', 'money']) assert.equal(engine.search(q, { limit: 1 })[0].match.typo, false, q)
    const kinds = new Set(['exact', 'prefix', 'stem', 'typo', 'similar', 'phonetic', 'concept'])
    for (const [q] of MISSPELL) for (const r of engine.search(q, { limit: 10 })) assert.ok(kinds.has(r.match.kind), q + ' ' + r.match.kind)
  })
  test('similarity never pollutes short prefixes and real words', () => {
    // short prefixes: names that start with the letters lead; everything is a plain prefix match
    for (const n of top('tr', 3)) assert.ok(n.startsWith('tr'), `tr: ${n}`)
    assert.ok(top('tr', 4).includes('trash'))
    for (const r of engine.search('tr', { limit: 8 })) assert.equal(r.match.kind, 'prefix', `tr: ${r.name}`)
    for (const q of ['tr', 'ca', 'cat', 'hom', 'arr', 'calen', 'sett', 'home', 'arrow right', 'trash can']) {
      for (const r of engine.search(q, { limit: 10 })) assert.ok(!['similar', 'phonetic', 'typo'].includes(r.match.kind), `${q}: ${r.name} ${r.match.kind}`)
    }
    assert.ok(!top('cat', 10).includes('chart-bar') && !top('cat', 10).includes('car'))
    assert.deepEqual(engine.search('xqzvwk'), [])
    assert.deepEqual(engine.search('zzzqqq'), [])
  })
  test('similarity matches rank below real matches of the same word', () => {
    // "lok": the cheap typo (lock) leads; phonetic look-alikes follow
    assert.equal(top('lok', 1)[0], 'lock')
    // "calen" is a prefix: nothing sound-alike may outrank calendar icons
    // ("calendula", marigold's alias, is a real completion too: it may follow the calendar icons)
    assert.ok(top('calen', 3).every(n => n.startsWith('calendar')))
    // a correctly spelled word never gets similarity hits ahead of its exact match
    for (const q of ['heart', 'phone', 'brain', 'clock']) assert.equal(engine.search(q, { limit: 1 })[0].match.kind, 'exact', q)
  })
  test('limit is honoured', () => {
    assert.equal(engine.search('arrow', { limit: 3 }).length, 3)
    assert.ok(engine.search('arrow').length > 3)
  })
  test('category filter', () => {
    const r = engine.search('cloud', { limit: 50, category: 'weather' })
    assert.ok(r.length > 0 && r.every(x => x.category === 'weather'))
    assert.ok(!r.some(x => x.name === 'cloud-upload'))
  })
  test('empty query + category lists the category', () => {
    const r = engine.search('', { limit: 100, category: 'weather' })
    assert.ok(r.length >= 5 && r.every(x => x.category === 'weather'))
    assert.deepEqual(engine.search(''), [])
    assert.deepEqual(engine.search('   '), [])
  })
  test('style filter: known style keeps results, unknown style empties them', () => {
    assert.ok(engine.search('home', { style: 'solid' }).length > 0)
    assert.deepEqual(engine.search('home', { style: 'nope' }), [])
    assert.ok(engine.search('home', { style: 'all' }).length > 0)
  })
  test('deterministic ordering', () => {
    const a = JSON.stringify(engine.search('arrow', { limit: 50 }))
    const b = JSON.stringify(create(index).search('arrow', { limit: 50 }))
    assert.equal(a, b)
    const r = engine.search('arrow', { limit: 50 })
    for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].score > r[i].score || (r[i - 1].score === r[i].score && r[i - 1].name < r[i].name))
  })
  test('nonsense returns nothing', () => {
    assert.deepEqual(engine.search('xqzvwk'), [])
  })
  test('AND first, graceful OR fallback', () => {
    // both words present -> only icons carrying both
    assert.equal(top('folder plus', 1)[0], 'folder-plus')
    // an unknown word does not wipe out the known one
    assert.equal(top('home zzzqqq', 1)[0], 'home')
  })
  test('field priority: name beats alias beats synonym', () => {
    const r = engine.search('lock', { limit: 3 })
    assert.equal(r[0].name, 'lock')
    assert.equal(r[0].match.field, 'name')
  })
})

describe('resolve', () => {
  test('canonical names', () => {
    assert.deepEqual(engine.resolve('home'), { name: 'home' })
    assert.deepEqual(engine.resolve('ArrowRight'), { name: 'arrow-right' })
    assert.deepEqual(engine.resolve('arrow_right'), { name: 'arrow-right' })
    assert.deepEqual(engine.resolve('HomeIcon'), { name: 'home' })
  })
  test('unique alias resolves', () => {
    assert.equal(engine.resolve('house').name, 'home')
    assert.equal(engine.resolve('trash-can').name, 'trash')
    assert.equal(engine.resolve('trashcan').name, 'trash')
  })
  test('shared alias is ambiguous', () => {
    const counts = {}
    for (const ic of index.icons) for (const a of ic[2].split('|').filter(Boolean)) (counts[words(a).join('-')] ||= new Set()).add(ic[0])
    const names = new Set(index.icons.map(i => i[0]))
    const shared = Object.entries(counts).find(([a, s]) => s.size > 1 && !names.has(a))
    if (!shared) return
    const r = engine.resolve(shared[0])
    assert.deepEqual(r.ambiguous, [...shared[1]].sort())
  })
  test('resolve ignores synonyms', () => {
    const r = engine.resolve('throw away')
    assert.equal(r.unknown, true)
  })
  test('unknown gives nearest', () => {
    const r = engine.resolve('setings')
    assert.equal(r.unknown, true)
    assert.equal(r.nearest[0], 'settings')
  })
})

describe('suggest (did-you-mean)', () => {
  for (const [q, want] of [['settigns', 'settings'], ['calender', 'calendar'], ['umbrela', 'umbrella'], ['keybord', 'keyboard'], ['shoping cart', 'shopping-cart'], ['hous', 'home']]) {
    test(`${q} -> ${want}`, () => assert.ok(engine.suggest(q, 3).includes(want), engine.suggest(q, 3).join(',')))
  }
  test('returns n names', () => assert.equal(engine.suggest('arr', 4).length, 4))
})

describe('didYouMean', () => {
  const cases = [
    ['calandar', 'calendar'], ['calender', 'calendar'], ['kalender', 'calendar'], ['setings', 'settings'], ['tresh', 'trash'],
    ['dowload', 'download'], ['sesrch', 'search'], ['homr', 'home'], ['fone', 'phone'], ['skedule', 'schedule'], ['hart', 'heart'],
    ['umbrela', 'umbrella'], ['wifii', 'wifi'], ['lighbulb', 'lightbulb'], ['sizzors', 'scissors'], ['lok', 'lock'], ['ksy', 'key'],
    ['shoping cart', 'shopping cart'], ['comment buble', 'comment bubble'], ['magnifing glass', 'magnifying glass'],
    ['lightbulbidea', 'lightbulb idea'], ['creditcrad', 'credit card'], ['red hart', 'red heart'], ['arrow rigth', 'arrow right'],
    ['shoppng bagg', 'shopping bag'],
  ]
  for (const [q, want] of cases) test(`${q} -> ${want}`, () => assert.equal(engine.didYouMean(q), want))
  test('null when nothing needs correcting', () => {
    for (const q of ['', '   ', 'home', 'calendar', 'arrow right', 'trash can', 'key board', 'calen', 'tr', 'colour', 'favourite', 'grey', 'folders', 'money', 'xqzvwk'])
      assert.equal(engine.didYouMean(q), null, q)
  })
  test('agrees with the top result', () => {
    for (const q of ['brane', 'kalender', 'tresh', 'sesrch']) {
      const fixed = engine.didYouMean(q)
      assert.ok(fixed, q)
      assert.equal(top(fixed, 1)[0], top(q, 1)[0], q)
    }
  })
})

describe('text primitives', () => {
  test('phonetic keys', () => {
    for (const [a, b] of [['fone', 'phone'], ['nite', 'night'], ['kalender', 'calendar'], ['skedule', 'schedule'], ['sizzors', 'scissors'],
      ['skware', 'square'], ['rench', 'wrench'], ['brane', 'brain'], ['kloud', 'cloud'], ['trofee', 'trophy'], ['sirkle', 'circle']]) assert.equal(phonetic(a), phonetic(b), `${a} ${b}`)
    assert.notEqual(phonetic('sad'), phonetic('sat'))
    assert.equal(phonetic(''), '')
  })
  test('keyboard-weighted distance', () => {
    assert.equal(weightedDistance('homr', 'home'), 0.5)          // r next to e
    assert.equal(weightedDistance('setttings', 'settings'), 0.5) // doubled letter
    assert.equal(weightedDistance('lok', 'lock'), 0.5)           // silent c of ck
    assert.ok(weightedDistance('homx', 'home') > weightedDistance('homr', 'home'))
    assert.ok(weightedDistance('kat', 'cat') < 1)                 // sound-alike
    assert.equal(weightedDistance('abc', 'abc'), 0)
    assert.ok(weightedDistance('abcdef', 'uvwxyz', 2) > 2)
  })

  test('words: kebab, camel, snake, diacritics', () => {
    assert.deepEqual(words('ArrowRight'), ['arrow', 'right'])
    assert.deepEqual(words('arrow-right_now'), ['arrow', 'right', 'now'])
    assert.deepEqual(words('Crème Brûlée'), ['creme', 'brulee'])
    assert.deepEqual(words("user's QRCode"), ['user', 'qr', 'code'])
    assert.equal(fold('Straße'), 'Strasse')
  })
  test('stem: delete family collapses', () => {
    const s = new Set(['delete', 'deletes', 'deleting', 'deleted'].map(stem))
    assert.equal(s.size, 1)
    assert.equal(stem('folders'), stem('folder'))
    assert.equal(stem('boxes'), stem('box'))
    assert.equal(stem('batteries'), stem('battery'))
    assert.equal(stem('user'), 'user')
  })
  test('damerau-levenshtein', () => {
    assert.equal(distance('settigns', 'settings'), 1)
    assert.equal(distance('calender', 'calendar'), 1)
    assert.equal(distance('abc', 'abc'), 0)
    assert.ok(distance('abcdef', 'uvwxyz', 2) > 2)
  })
})

describe('performance and size', () => {
  // budgets scale with the set: ~400 bytes per icon (the 300-icon set fit in 120 KB)
  const perIcon = () => fs.statSync(path.join(dist, 'index.json')).size / index.icons.length
  test('index < 410 bytes per icon raw', () => {
    assert.ok(perIcon() < 410, `${perIcon().toFixed(0)} bytes per icon`)
  })
  test('index < 440 bytes per icon raw (similarity data is derived at runtime)', () => {
    assert.ok(perIcon() < 440)
  })
  test('misspelled queries: < 2 ms average, < 8 ms worst', () => {
    const e = create(index)
    e.warm()
    const qs = [...CASES, ...HARD, ...MISSPELL].map(c => c[0])
    for (const q of qs) e.search(q)
    // worst case = the slowest query's best of 5 runs, so a GC pause or a busy CI machine is not blamed on one query
    const fastest = new Float64Array(qs.length).fill(Infinity)
    const t = performance.now()
    for (let r = 0; r < 5; r++) qs.forEach((q, k) => { const s = performance.now(); e.search(q); fastest[k] = Math.min(fastest[k], performance.now() - s) })
    const per = (performance.now() - t) / (qs.length * 5)
    const worst = Math.max(...fastest)
    console.log(`# avg query ${per.toFixed(3)} ms, worst ${worst.toFixed(2)} ms over ${qs.length} queries incl. misspellings`)
    assert.ok(per < 2, `${per} ms`)
    assert.ok(worst < 8, `${worst} ms`)
  })
  test('< 2 ms per query', () => {
    const qs = CASES.map(c => c[0])
    for (const q of qs) engine.search(q) // warm
    const t = performance.now()
    for (let r = 0; r < 5; r++) for (const q of qs) engine.search(q)
    const per = (performance.now() - t) / (qs.length * 5)
    console.log(`# avg query ${per.toFixed(3)} ms over ${qs.length} queries`)
    assert.ok(per < 2, `${per} ms`)
  })
})

describe('module formats agree', () => {
  test('CJS build', () => {
    const require = createRequire(import.meta.url)
    const cjs = require('../dist/index.cjs')
    const data = require('../dist/data.cjs')
    assert.deepEqual(cjs.create(data).search('trash can', { limit: 5 }), engine.search('trash can', { limit: 5 }))
  })
  test('browser global build + site files', () => {
    const ctx = { window: {} }
    ctx.self = ctx.window
    vm.createContext(ctx)
    const root = path.join(here, '..', '..', '..')
    vm.runInContext(fs.readFileSync(path.join(root, 'site', 'vendor', 'with', 'search.js'), 'utf8').replace(/typeof module === 'object'/, 'false'), ctx)
    vm.runInContext(fs.readFileSync(path.join(root, 'site', 'data', 'search-index.js'), 'utf8'), ctx)
    const W = ctx.WithSearch || ctx.window.WithSearch
    assert.ok(W, 'window.WithSearch defined')
    const e = W.create(ctx.window.WITH_SEARCH_INDEX)
    assert.equal(e.search('throw away', { limit: 1 })[0].name, 'trash')
  })
})
