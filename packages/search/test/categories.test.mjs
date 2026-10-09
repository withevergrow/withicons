// The 2026-10 categories (food, health, nature, travel, home, sports, education): everyday words, plurals and
// typos land on the right icon; real words and style words are never "corrected" into look-alikes.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const names = new Set(engine.icons().map(i => i.name))
const has = new Set(engine.styles().map(s => s.name))

// query, expected icon, must be within the top n
const CASES = [
  // food
  ['pizza slice', 'pizza', 1], ['cheeseburger', 'burger', 1], ['restaurant', 'utensils', 1], ['fork and knife', 'utensils', 1],
  ['birthday cake', 'cake', 1], ['cookies', 'cookie', 1], ['doughnut', 'donut', 1], ['soft drink', 'cup-soda', 1],
  ['ice cream', 'ice-cream', 1], ['icecream', 'ice-cream', 1], ['wine glass', 'wine', 1], ['ramen', 'soup', 1],
  ['piza', 'pizza', 1], ['burgr', 'burger', 1], ['aple', 'apple', 1], ['dinner', 'utensils', 3], ['candy', 'cake', 5],
  // health
  ['doctor', 'stethoscope', 1], ['first aid kit', 'briefcase-medical', 1], ['vaccine', 'syringe', 1], ['dentist', 'tooth', 1],
  ['band aid', 'bandage', 1], ['wheelchair', 'accessibility', 1], ['ambulence', 'ambulance', 1], ['stethoscpe', 'stethoscope', 1],
  // nature
  ['kitten', 'cat', 1], ['puppy', 'dog', 1], ['paw', 'paw-print', 1], ['seedling', 'sprout', 1], ['christmas tree', ['christmas-tree', 'tree-pine'], 1],
  ['palm tree', 'palm-tree', 1], ['bunny', 'rabbit', 1], ['tortoise', 'turtle', 1], ['buterfly', 'butterfly', 1], ['turtel', 'turtle', 1],
  // travel
  ['gas station', 'fuel', 1], ['suitcase', 'luggage', 1], ['motorbike', 'motorcycle', 1], ['car park', 'parking', 1],
  ['departure', 'plane-takeoff', 1], ['arrival', 'plane-landing', 1], ['boat', 'ship', 1], ['cab', 'taxi', 1], ['camping', 'tent', 1],
  ['railway', 'train', 1], ['pasport', 'passport', 1], ['hotle', 'hotel', 1], ['tourism', 'binoculars', 5],
  // home
  ['bathtub', 'bath', 1], ['fridge', 'refrigerator', 1], ['couch', 'sofa', 1], ['laundry', 'washing-machine', 1], ['wc', 'toilet', 1],
  ['refridgerator', 'refrigerator', 1], ['furniture', 'sofa', 1], ['bedroom', 'bed', 1],
  // sports
  ['gym', 'dumbbell', 1], ['soccer', 'football', 1], ['bicycle', 'bike', 1], ['jogging', 'person-running', 1], ['olympics', 'medal', 1],
  ['basketbal', 'basketball', 1], ['dumbell', 'dumbbell', 1], ['bicyle', 'bike', 1], ['nba', 'basketball', 5], ['yoga', 'dumbbell', 3],
  // education
  ['chemistry', 'flask-conical', 1], ['genetics', 'dna', 1], ['astronomy', 'telescope', 1], ['whiteboard', 'presentation', 1],
  ['school bag', 'backpack', 1], ['graduation', 'graduation-cap', 1], ['microscop', 'microscope', 1],
]

describe('new categories', () => {
  for (const [q, want, n] of CASES) {
    test(`"${q}" -> ${want} (top ${n})`, { skip: !names.has(want) && `no ${want} icon` }, () => {
      const got = engine.search(q, { limit: n }).map(r => r.name)
      assert.ok(got.includes(want), `got ${JSON.stringify(got)}`)
    })
  }
})

describe('real words and style words are not misspellings', () => {
  // concept words, style words, compact words typed as is, and real words some icon lists as a synonym
  for (const q of ['dinner', 'plate', 'pool', 'candy', 'tourism', 'fall leaves', 'blueprint', 'kawaii', 'gloss', 'vintage camera', 'cute cat',
    'login', 'email', 'website', 'playlist', 'backup', 'workout', 'suitcase', 'hurt', 'track', 'rose', 'metal', 'story', 'sing', 'real', 'beers', 'gamer', 'gmail']) {
    test(`didYouMean("${q}") is null`, () => assert.equal(engine.didYouMean(q), null))
  }
  test('a style word is never split into two words ("blueprint" is not "blue print")', { skip: !has.has('blueprint') && 'no blueprint style' }, () => {
    const p = engine.parse('blueprint home')
    assert.equal(p.style, 'blueprint')
    assert.deepEqual(p.words, ['blueprint', 'home'])
    assert.equal(engine.search('blueprint home', { limit: 1 })[0].name, 'home')
  })
  test('a lone style word never matches look-alike icons ("kawaii" is not "hawaii")', () => {
    for (const w of ['kawaii', 'gloss', 'engrave', 'blueprint']) for (const r of engine.search(w)) assert.ok(!r.match.typo, `${w} -> ${r.name} (${r.match.kind})`)
  })
})

test('data-carried misspellings are still corrected', () => {
  for (const [q, want] of [['hart', 'heart'], ['setings', 'settings'], ['shoping', 'shopping'], ['calender', 'calendar'], ['fone', 'phone'], ['piza', 'pizza']])
    assert.equal(engine.didYouMean(q), want, q)
})

describe('style words', () => {
  const STY = [['two tone heart', 'duo', 'heart'], ['bicolor star', 'duo', 'star'], ['etched coin', 'engrave', 'coins'], ['shiny star', 'gloss', 'star'],
    ['doodle cat', 'sketch', 'cat'], ['schematic gear', 'blueprint', 'settings'], ['line art heart', 'line', 'heart']]
  for (const [q, style, top] of STY) {
    test(`"${q}" -> ${style}, ${top}`, { skip: !has.has(style) && `no ${style} style` }, () => {
      assert.equal(engine.parse(q).style, style)
      assert.ok(engine.search(q, { limit: 3 }).some(r => r.name === top))
    })
  }
  test('"glass of water" is about water, not the glass style', () => {
    assert.equal(engine.parse('glass of water').style, null)
    // many festival icons are glasses of something (thandai glass, wine glass): water still answers, never the style
    assert.ok(engine.search('glass of water', { limit: 10 }).some(r => r.name === 'droplet' || r.name === 'droplets'))
  })
  test('a style word plus a UI word keeps the UI word as content ("glossy button")', () => {
    const p = engine.parse('glossy button')
    assert.equal(p.style, 'gloss')
    assert.deepEqual(p.required.map(t => t.w), ['button'])
    assert.ok(engine.search('glossy button').length > 0)
  })
})
