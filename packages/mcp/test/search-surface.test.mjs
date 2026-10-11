// search_icons / searchIcons: how much code a result carries (format "none") and which no-match suggestions are offered.
// node --test packages/mcp/test/search-surface.test.mjs   (needs dist/: cd packages/mcp && npm run build)
// Findings #9 and #12 of docs/MCP-AGENT-EVAL.md.
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
const parse = r => r.structuredContent || JSON.parse(r.content[0].text)
const size = v => JSON.stringify(v).length

// ---------------------------------------------------------------- format: "none" (names only)
describe('searchIcons format', () => {
  test('format "none": no snippet on any result, everything else stays', () => {
    const r = lib.searchIcons({ query: 'trash can', limit: 5, format: 'none' })
    assert.ok(r.results.length >= 1)
    assert.equal(r.results[0].name, 'trash')
    for (const x of r.results) {
      // name, title, category, confidence, reason and url: nothing else
      assert.deepEqual(Object.keys(x).sort(), ['category', 'confidence', 'name', 'reason', 'title', 'url'], x.name)
      for (const k of Object.keys(x)) assert.ok(x[k], `${x.name}.${k}`)
    }
    const json = JSON.stringify(r)
    assert.doesNotMatch(json, /<svg|import \{|<with-icon|<i class/, 'no code anywhere in the result')
    assert.equal(r.format, 'none')
  })
  test('every other format still gives every exact match a snippet, and says which format', () => {
    for (const format of lib.FORMATS) {
      const r = lib.searchIcons({ query: 'trash can', limit: 4, format })
      assert.ok(r.results.length >= 1, format)
      assert.equal(r.format, format, format)
      for (const x of r.results) assert.ok(typeof x.snippet === 'string' && x.snippet.length > 10, `${format} ${x.name}`)
    }
    // the default is still react
    const d = lib.searchIcons({ query: 'trash can', limit: 2 })
    assert.equal(d.format, 'react')
    assert.match(d.results[0].snippet, /import \{ Trash \} from '@withicons\/react'/)
    // aliases of a format keep working
    assert.match(lib.searchIcons({ query: 'trash can', limit: 1, format: 'jsx' }).results[0].snippet, /@withicons\/react/)
  })
  test('additional and outside results never carry a snippet, in any format', () => {
    for (const format of ['svg', 'react', 'none']) {
      const r = lib.searchIcons({ query: 'bread', format })
      for (const x of [...(r.additional || []), ...(r.outside || [])]) assert.equal('snippet' in x, false, `${format} ${x.name}`)
    }
    const hid = lib.searchIcons({ query: 'trash', category: 'food', format: 'svg' })
    for (const x of hid.outside || []) assert.equal('snippet' in x, false)
  })
  test('an unknown format is still an error (none is the only extra value)', () => {
    assert.throws(() => lib.searchIcons({ query: 'trash', format: 'nope' }), /Unknown format/)
  })
  test('format "none" with no match is fine, and with a style/category filter', () => {
    const r = lib.searchIcons({ query: 'xqzvk', format: 'none' })
    assert.equal(r.count, 0)
    const s = lib.searchIcons({ query: 'check', style: 'kawaii', category: 'status', format: 'none' })
    assert.equal(s.style, 'kawaii')
    for (const x of s.results) assert.equal('snippet' in x, false)
  })
  test('lib.d.ts documents the rule', () => {
    const d = fs.readFileSync(path.join(dist, 'lib.d.ts'), 'utf8')
    assert.match(d, /SearchFormat = Format \| 'none'/, 'none is a search format')
    assert.match(d, /searchIcons\(opts: \{[^}]*format\?: SearchFormat/, 'searchIcons accepts it')
    assert.match(d, /snippet\?: string/, 'snippet is optional on a result')
    assert.match(d, /Which results carry code[\s\S]{0,500}with format 'none' no result has one/, 'the rule is written down')
  })
})

describe('search_icons over MCP (stdio)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })
  const search = args => client.callTool({ name: 'search_icons', arguments: args })

  test('schema and description: format accepts none and the rule is written down', async () => {
    const { tools } = await client.listTools()
    const t = tools.find(x => x.name === 'search_icons')
    const f = t.inputSchema.properties.format
    assert.ok(f.enum.includes('none'), 'format enum has none')
    for (const k of lib.FORMATS) assert.ok(f.enum.includes(k), k)
    assert.match(t.description, /format.{0,40}none|none.{0,80}(names|no (snippet|code))/i)
    assert.match(t.description, /snippet/i)
    assert.match(f.description || '', /none/)
  })
  test('format none: structuredContent and text carry no code, only names with category and confidence', async () => {
    const raw = await search({ query: 'trash can', limit: 6, format: 'none' })
    assert.ok(!raw.isError)
    const r = parse(raw)
    assert.equal(r.results[0].name, 'trash')
    for (const x of r.results) assert.equal('snippet' in x, false, x.name)
    const text = raw.content[0].text
    assert.doesNotMatch(text, /<svg|import \{|<with-icon/, 'the text block has no code either')
    assert.match(text, /^\d+ icons? for "trash can"/)
    assert.match(text, /\n1\. trash \(/)
    assert.match(text, /get_icon/, 'it says where the code comes from')
    assert.doesNotMatch(text, /no snippet|snippets? (of|for) all/i)
  })
  test('the rule is the same in every format: structuredContent has a snippet for each exact match, the text shows the first only', async () => {
    const raw = await search({ query: 'cloud', limit: 6, format: 'svg' })
    const r = parse(raw)
    assert.ok(r.results.length >= 3)
    for (const x of r.results) assert.match(x.snippet, /^<svg/, x.name)
    const text = raw.content[0].text
    assert.equal((text.match(/<svg/g) || []).length, 1, 'the text shows one snippet: the first result')
    assert.ok(text.includes(`\n${r.results[0].name}:\n<svg`), 'and it is the first result')
    const react = await search({ query: 'cloud', limit: 6, format: 'react' })
    assert.equal((react.content[0].text.match(/import \{/g) || []).length, 1)
  })
  test('size: names only is a fraction of the svg answer', async () => {
    const queries = ['trash can', 'home', 'settings', 'user', 'calendar', 'heart', 'cloud', 'lock', 'camera', 'bell']
    let svg = 0, none = 0
    for (const q of queries) {
      const a = await search({ query: q, limit: 10, format: 'svg' })
      const b = await search({ query: q, limit: 10, format: 'none' })
      svg += size(a.structuredContent) + a.content[0].text.length
      none += size(b.structuredContent) + b.content[0].text.length
    }
    assert.ok(none < svg / 3, `none ${none} B vs svg ${svg} B for ${queries.length} queries`)
    assert.ok(none / queries.length < 4000, `names only stays small: ${Math.round(none / queries.length)} B per search`)
  })
  test('an unknown format is a tool error, not a crash', async () => {
    const raw = await search({ query: 'trash', format: 'nope' })
    assert.equal(raw.isError, true)
  })
})

// ---------------------------------------------------------------- suggestions only above a similarity floor
describe('no-match suggestions', () => {
  // words no icon carries today; when one is added the case skips itself (pick another word no icon carries)
  const unmatched = (t, q, opts = {}) => {
    const r = lib.searchIcons({ query: q, ...opts })
    if (r.count || (r.additional || []).length) { t.skip(`"${q}" now matches an icon: choose another word`); return null }
    return r
  }
  for (const q of ['nervous', 'wheat', 'playground', 'crayon', 'stroller', 'mosque', 'hijab', 'anxious', 'xylophone', 'pacifier', 'wheat field', 'nervous face']) {
    test(`"${q}": nothing is close enough to suggest`, t => {
      const r = unmatched(t, q)
      if (!r) return
      assert.deepEqual(r.suggestions, [], `"${q}" -> ${r.suggestions.join(', ')}`)
      assert.ok(r.hint, 'it still says where to browse')
    })
  }
  test('junk suggestions are gone from the MCP text too', async t => {
    const r = unmatched(t, 'nervous')
    if (!r) return
    const client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
    try {
      const raw = await client.callTool({ name: 'search_icons', arguments: { query: 'nervous' } })
      assert.doesNotMatch(raw.content[0].text, /Did you mean/)
      assert.deepEqual(parse(raw).suggestions, [])
    } finally { await client.close() }
  })

  // typos that match nothing on their own: the right icon is the first suggestion
  const TYPOS = [['hme', 'home'], ['caendr', 'calendar'], ['gaepd', 'gamepad'], ['arhie', 'archive'], ['maigod', 'marigold'], ['pakig', 'parking'], ['miimie', 'minimize'], ['cuidbw', 'cupid-bow']]
  for (const [typo, want] of TYPOS) {
    test(`typo "${typo}" still suggests ${want}`, t => {
      const r = unmatched(t, typo)
      if (!r) return
      assert.equal(r.suggestions[0], want, r.suggestions.join(', '))
      assert.ok(r.suggestions.length <= 5)
    })
  }
  // a category filter that hides the real match leaves the same situation: no result, but the name is one typo away
  for (const [typo, cat, want] of [['calandar', 'food', 'calendar'], ['keybord', 'food', 'keyboard'], ['bluetoth', 'food', 'bluetooth'], ['umbrela', 'food', 'umbrella'], ['notifcation', 'food', 'bell']]) {
    test(`typo "${typo}" in category ${cat} suggests ${want}`, t => {
      const r = unmatched(t, typo, { category: cat })
      if (!r) return
      assert.ok(r.suggestions.includes(want), `${want} in ${r.suggestions.join(', ')}`)
    })
  }
  test('suggestions are short and all above the floor: no unrelated name rides along', t => {
    const r = unmatched(t, 'keybord', { category: 'food' })
    if (!r) return
    assert.deepEqual(r.suggestions, ['keyboard'], 'tag, key-round, baby and lock-keyhole are not suggestions')
    const c = unmatched(t, 'calandar', { category: 'food' })
    if (!c) return
    assert.ok(!c.suggestions.includes('database'), c.suggestions.join(', '))
  })
  test('typos that find icons keep working (spell-corrected results, no suggestions needed)', () => {
    for (const [q, want] of [['setings', 'settings'], ['calandar', 'calendar'], ['settigns', 'settings'], ['bluetoth', 'bluetooth']]) {
      const r = lib.searchIcons({ query: q })
      assert.equal(r.results[0].name, want, q)
      assert.deepEqual(r.suggestions, [], q)
    }
  })
  test('resolve_icon and get_icon unknown-name paths are untouched by this change', () => {
    const r = lib.resolveIcon('hme')
    assert.ok(Array.isArray(r.nearest))
    assert.throws(() => lib.getIcon({ name: 'qqqqzzzz' }), /No icon named/)
  })
})
