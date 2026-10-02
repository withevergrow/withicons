// Style words in queries: "cute heart" -> kawaii, "8-bit star" -> pixel, "frosted bell" -> glass, ...
// A style word only counts when the index has that style; words that also name things ("wine glass") stay content.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const has = new Set(engine.styles().map(s => s.name))
const parsed = q => { const p = engine.parse(q); return { style: p.style, required: p.required.map(t => t.w), soft: p.soft.map(t => t.w) } }

const CASES = [
  // query, style, the content word that must stay required
  ['glassmorphism card', 'glass', 'card'],
  ['frosted bell', 'glass', 'bell'],
  ['frosted glass bell', 'glass', 'bell'],
  ['glass heart', 'glass', 'heart'],
  ['cute heart', 'kawaii', 'heart'],
  ['kawaii star', 'kawaii', 'star'],
  ['kawai cloud', 'kawaii', 'cloud'],
  ['sticker star', 'sticker', 'star'],
  ['y2k heart', 'sticker', 'heart'],
  ['scrapbook camera', 'sticker', 'camera'],
  ['8-bit heart', 'pixel', 'heart'],
  ['8bit star', 'pixel', 'star'],
  ['pixelated home', 'pixel', 'home'],
  ['pixel art star', 'pixel', 'star'],
  ['vintage camera', 'retro', 'camera'],
  ['70s sun', 'retro', 'sun'],
  ['80s music', 'retro', 'music'],
  ['retro camera', 'retro', 'camera'],
  ['home in retro style', 'retro', 'home'],
  ['3d rocket', 'luxe', 'rocket'],
  ['3-d trophy', 'luxe', 'trophy'],
  ['luxury gift', 'luxe', 'gift'],
  ['premium crown', 'luxe', 'crown'],
  ['gold star', 'luxe', 'star'],
  ['luxe heart', 'luxe', 'heart'],
  ['bauhaus home', 'bauhaus', 'home'],
  ['geometric star', 'bauhaus', 'star'],
  ['modernist clock', 'bauhaus', 'clock'],
  ['skeuomorphic camera', 'skeuo', 'camera'],
  ['skeuomorphism calendar', 'skeuo', 'calendar'],
  ['realistic lock', 'skeuo', 'lock'],
  ['tactile button', 'skeuo', 'button'],
  ['skeuo bell', 'skeuo', 'bell'],
]
for (const [q, style, word] of CASES) {
  test(`"${q}" -> style ${style}`, { skip: !has.has(style) && `index has no ${style} style yet` }, () => {
    const p = parsed(q)
    assert.equal(p.style, style)
    assert.ok(p.required.includes(word), `required ${JSON.stringify(p.required)}`)
    const res = engine.search(q, { limit: 5 })
    assert.ok(res.length > 0, 'expected results')
  })
}

test('a style word that names a thing stays content when it does not lead ("magnifying glass")', { skip: !has.has('glass') && 'no glass style' }, () => {
  const p = parsed('magnifying glass')
  assert.notEqual(p.style, 'glass')
  assert.equal(engine.search('magnifying glass', { limit: 1 })[0].name, 'search')
})

test('the original style words parse exactly as before', () => {
  assert.deepEqual(parsed('outline star'), { style: 'line', required: ['star'], soft: ['outline'] })
  assert.deepEqual(parsed('heart gloss'), { style: 'gloss', required: ['heart'], soft: ['gloss'] })
  assert.equal(parsed('glossy heart').style, 'gloss')
  assert.equal(engine.search('line chart', { limit: 1 })[0].name, 'chart-line')
})

test('premium and gold alone still find crowns and coins (the word stays required content)', { skip: !has.has('luxe') && 'no luxe style' }, () => {
  assert.deepEqual(parsed('gold').required, ['gold'])
  assert.ok(engine.search('gold', { limit: 5 }).some(r => r.name === 'coins'))
  assert.ok(engine.search('premium', { limit: 5 }).some(r => r.name === 'crown'))
})

test('style filter accepts every style in the index', () => {
  for (const s of has) assert.ok(engine.search('home', { style: s }).length > 0, s)
})
