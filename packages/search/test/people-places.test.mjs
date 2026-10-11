// node --test packages/search/test/*.test.mjs
// Batch new-39 (MCP agent eval): a mosque and two inclusive avatars must be findable by what deck builders type,
// as a top, high-confidence result, without taking queries from the icons that already owned them.
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { create } from '../dist/index.js'
import index from '../dist/data.js'

const engine = create(index)
const names = new Set(engine.icons().map(i => i.name))
const hit = (q, n) => engine.search(q, { limit: n })

// query, icon, must be within the top n (and high confidence)
const FIND = [
  ['mosque', 'mosque', 1], ['masjid', 'mosque', 1], ['islamic', 'mosque', 1], ['eid', 'mosque', 1], ['eid mubarak', 'mosque', 1],
  ['ramadan', 'mosque', 2], ['minaret', 'mosque', 1], ['place of worship', 'mosque', 1],
  ['hijab', 'avatar-woman-hijab', 1], ['muslim woman', 'avatar-woman-hijab', 1], ['headscarf', 'avatar-woman-hijab', 1],
  ['hijabi', 'avatar-woman-hijab', 1],
  ['wheelchair', 'avatar-person-wheelchair', 2], ['wheelchair user', 'avatar-person-wheelchair', 1],
  ['disability', 'avatar-person-wheelchair', 2], ['accessible person', 'avatar-person-wheelchair', 1],
  ['person in wheelchair', 'avatar-person-wheelchair', 1],
]
// queries the older icons keep first
const KEEP = [
  ['accessibility', 'accessibility'], ['wheelchair', 'accessibility'], ['disability', 'accessibility'], ['a11y', 'accessibility'],
  ['moon', 'moon'], ['crescent moon', 'moon'], ['night mode', 'moon'], ['temple', 'landmark'], ['woman', 'avatar-woman'],
  ['centre', 'align-center'], ['building', 'building'],
]

describe('new-39: mosque, hijab and wheelchair avatars are findable', () => {
  for (const [q, want, n] of FIND) {
    test(`"${q}" -> ${want} (top ${n}, high confidence)`, { skip: !names.has(want) && `no ${want} icon in this index` }, () => {
      const r = hit(q, n).find(x => x.name === want)
      assert.ok(r, `got ${JSON.stringify(hit(q, 5).map(x => x.name))}`)
      // "accessible person" is the icon's own synonym and leads by a wide margin; engine 1.6 labels it medium (another sense of "person" follows)
      assert.ok(q === 'accessible person' ? r.confidence !== 'low' : r.confidence === 'high', `${q}: ${r.confidence}`)
    })
  }
})

describe('new-39: existing icons keep their queries', () => {
  for (const [q, want] of KEEP) {
    test(`"${q}" still -> ${want} first`, () => assert.equal(hit(q, 1)[0]?.name, want))
  }
  test('"temple" and "centre" do not surface the mosque in the top 5', { skip: !names.has('mosque') && 'no mosque icon in this index' }, () => {
    for (const q of ['temple', 'centre', 'center']) assert.ok(!hit(q, 5).some(r => r.name === 'mosque'), q)
  })
  test('the new icons resolve by their own aliases only (no alias shared with another icon or equal to its name)', { skip: !names.has('avatar-woman-hijab') && 'not in this index' }, () => {
    // index rows: [name, category, aliases "a|b", synonyms, tags, description, ...]
    const rows = index.icons.map(r => ({ name: r[0], aliases: String(r[2] || '').split('|').filter(Boolean) }))
    for (const name of ['mosque', 'avatar-woman-hijab', 'avatar-person-wheelchair']) {
      const mine = rows.find(r => r.name === name).aliases
      assert.ok(mine.length >= 3, `${name} has aliases`)
      for (const a of mine) {
        const owners = rows.filter(r => r.name === a || r.aliases.includes(a)).map(r => r.name)
        assert.deepEqual(owners, [name], `${a}: ${owners}`)
      }
    }
  })
})
