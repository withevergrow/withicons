// recommend_styles: compact output, "exact brand colours" ranks flat styles first, several festivals rank by coverage.
// node --test packages/mcp/test/recommend.test.mjs   (needs dist/: cd packages/mcp && npm run build)
// Finding #11 of docs/MCP-AGENT-EVAL.md.
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
const parse = r => r.structuredContent || JSON.parse(r.content[0].text)
const size = v => JSON.stringify(v).length
const styles = r => r.recommendations.map(x => x.style)

// styles that draw with the ink and flat role colours only: what a brand hex needs (checked against the data below)
const FLAT = ['solid', 'line', 'duo', 'gloss', 'engrave', 'sketch', 'bauhaus', 'brutal', 'retro', 'pixel']

describe('compact', () => {
  const JOBS = ['pitch deck for a dentist', 'Diwali sale banner', 'an avatar picker for a kids app', 'animated 3D icons for an AI product landing page']
  test('per style: name, group, one line on what it suits, the React import and the <with-icon> snippet', () => {
    for (const q of JOBS) {
      const full = lib.recommendStyles({ for: q })
      const c = lib.recommendStyles({ for: q, compact: true })
      assert.deepEqual(styles(c), styles(full), `${q}: same styles in the same order`)
      for (const x of c.recommendations) {
        assert.deepEqual(Object.keys(x).sort(), ['group', 'react', 'style', 'suits', 'webComponent'], `${q}: ${x.style}`)
        assert.ok(x.suits.length > 5 && !x.suits.includes('\n'), 'one line')
        assert.match(x.react, /^import \{ \w+( as \w+)? \} from '@withicons\/react/)
        assert.match(x.webComponent, /^<with-icon name="[a-z0-9-]+"/)
      }
      assert.doesNotMatch(JSON.stringify(c), /stylePalettes|"colors"|"files"|"zip"|"presets"|"classes"|"downloads"/, `${q}: no palette lists, packages or downloads`)
      assert.ok(size(c) < size(full) * 0.45, `${q}: compact ${size(c)} B vs ${size(full)} B`)
    }
  })
  test('compact keeps the festival and avatar facts an agent needs, and the icon in the snippets', () => {
    const d = lib.recommendStyles({ for: 'Diwali sale banner', icon: 'diya', compact: true })
    assert.equal(d.recommendations[0].style, 'rangoli')
    assert.match(d.recommendations[0].webComponent, /name="diya" variant="rangoli"/)
    assert.equal(d.festivals[0].category, 'indian-festivals')
    assert.ok(d.notes.length >= 1 && d.notes.join(' ').length < 500, 'short notes')
    const a = lib.recommendStyles({ for: 'an avatar picker for a kids app', compact: true })
    assert.equal(a.avatars.category, 'avatars')
    assert.ok(a.notes.some(n => /skin tone/.test(n)))
  })
  test('compact budgets', () => {
    assert.ok(size(lib.recommendStyles({ for: 'pitch deck for a dentist', compact: true })) < 1500)
    assert.ok(size(lib.recommendStyles({ for: 'Diwali sale banner', icon: 'diya', compact: true })) < 1800)
    assert.ok(size(lib.recommendStyles({ for: 'Diwali, Eid, Holi and Christmas gift boxes', compact: true })) < 2800)
  })
  test('nothing recognised: compact lists the use ids, not every group and style', () => {
    const c = lib.recommendStyles({ for: 'zzz', compact: true })
    assert.equal(c.matched, false)
    assert.ok(c.allUses.length >= 7)
    for (const u of c.allUses) assert.deepEqual(Object.keys(u).sort(), ['id', 'title'])
    assert.equal(c.groups, undefined)
    assert.ok(size(c) < 1000, `${size(c)} B`)
  })
  test('compact: false and omitted are the full answer', () => {
    const a = lib.recommendStyles({ for: 'pitch deck', compact: false }), b = lib.recommendStyles({ for: 'pitch deck' })
    assert.deepEqual(a, b)
    assert.ok(b.recommendations[0].files && b.recommendations[0].zip)
  })
})

describe('default output', () => {
  test('keeps what it had: files, zip, snippets, palettes, presets', () => {
    const d = lib.recommendStyles({ for: 'Diwali sale banner', icon: 'diya' })
    const r = d.recommendations[0]
    assert.equal(r.style, 'rangoli')
    assert.equal(r.files.svgAndNodes, '@withicons/holiday')
    assert.ok(r.stylePalettes.length >= 6 && r.stylePalettes[0].colors.c1)
    assert.match(r.zip, /downloads\/with-icons-rangoli\.zip$/)
    assert.match(r.webComponent, /name="diya" variant="rangoli"/)
    assert.match(r.classes, /with-rangoli/)
    const duo = lib.recommendStyles({ for: 'duo icons for a dashboard' }).recommendations.find(x => x.style === 'duo')
    assert.deepEqual(duo.presets.map(p => p.id), ['accent', 'gradient'])
  })
  test('how to apply a style palette is said once, not once per style', () => {
    const d = lib.recommendStyles({ for: 'Diwali sale banner', icon: 'diya' })
    assert.ok(d.recommendations.length >= 2)
    for (const r of d.recommendations) assert.equal(r.stylePalettesHow, undefined, r.style)
    assert.match(d.stylePalettesHow, /colors/)
    assert.match(d.stylePalettesHow, /--with-<style>-<role>/)
  })
  // before: 4029 B and 7047 B (the four-festival job was 10413 B and now also lists a neutral style: solid)
  test('smaller than before', () => {
    const slides = size(lib.recommendStyles({ for: 'pitch deck for a dentist' }))
    const diwali = size(lib.recommendStyles({ for: 'Diwali sale banner', icon: 'diya' }))
    assert.ok(slides <= 3800, `slides ${slides} B`)
    assert.ok(diwali <= 6700, `diwali ${diwali} B`)
    const four = size(lib.recommendStyles({ for: 'Diwali, Eid, Holi and Christmas gift boxes' }))
    assert.ok(four <= 11000, `four festivals ${four} B`)
  })
})

describe('exact brand colours', () => {
  const EXACT = [
    'pitch deck icons in our exact brand colours',
    'icons for a bakery slide deck, exact brand colours please',
    'an AI product landing page with icons that match our brand colours exactly',
    'sales deck, use the exact hex #0A7B6C for every icon',
    'client presentation: icons must match our brand palette',
  ]
  test('the flat styles come first, solid and line among them', () => {
    for (const q of EXACT) {
      const r = lib.recommendStyles({ for: q })
      const order = styles(r)
      assert.ok(['solid', 'line'].includes(order[0]), `${q}: ${order.join(', ')}`)
      assert.ok(order.includes('solid') && order.includes('line'), q)
      const firstShaded = order.findIndex(s => !FLAT.includes(s))
      assert.ok(firstShaded === -1 || order.slice(firstShaded).every(s => !FLAT.includes(s)), `${q}: no flat style after a shaded one (${order.join(', ')})`)
      for (const x of r.recommendations) assert.equal(x.exactColours, FLAT.includes(x.style), `${q}: ${x.style}`)
    }
  })
  test('a note says gradient and shadow styles cannot match a hex exactly, and how to get one', () => {
    const r = lib.recommendStyles({ for: 'pitch deck icons in our exact brand colours' })
    const note = r.notes.find(n => /exact/i.test(n) && /gradient/i.test(n))
    assert.ok(note, r.notes.join(' | '))
    assert.match(note, /hex/)
    assert.match(note, /solid/)
    for (const s of styles(r).filter(x => !FLAT.includes(x))) assert.match(note, new RegExp(`\\b${s}\\b`), `names ${s}`)
  })
  test('a gradient style the text names stays in the list, flagged', () => {
    const r = lib.recommendStyles({ for: 'clay icons in our exact brand colours' })
    assert.ok(['solid', 'line'].includes(styles(r)[0]))
    const clay = r.recommendations.find(x => x.style === 'clay')
    assert.ok(clay, styles(r).join(', '))
    assert.equal(clay.exactColours, false)
    assert.ok(styles(r).indexOf('clay') > styles(r).indexOf('solid'))
  })
  test('a festival with exact colours: flat first, the festival style flagged', () => {
    const r = lib.recommendStyles({ for: 'Halloween party app in our exact brand colours' })
    assert.ok(FLAT.includes(styles(r)[0]), styles(r).join(', '))
    const h = r.recommendations.find(x => x.style === 'halloween')
    assert.ok(h && h.exactColours === false)
  })
  test('compact keeps the flag and a one-line note', () => {
    const c = lib.recommendStyles({ for: 'pitch deck icons in our exact brand colours', compact: true })
    assert.ok(c.recommendations.every(x => typeof x.exactColours === 'boolean'))
    assert.deepEqual(Object.keys(c.recommendations[0]).sort(), ['exactColours', 'group', 'react', 'style', 'suits', 'webComponent'])
    assert.ok(c.notes.some(n => /gradient/i.test(n) && /hex/.test(n)))
    assert.ok(size(c) < 1800)
  })
  test('without the request nothing changes', () => {
    for (const q of ['pitch deck icons', 'premium brand fintech pricing page', 'our brand new landing page', 'a brand story deck']) {
      const r = lib.recommendStyles({ for: q })
      assert.ok(r.recommendations.every(x => !('exactColours' in x)), q)
      assert.ok(!r.notes.some(n => /hex/.test(n)), q)
    }
    assert.deepEqual(styles(lib.recommendStyles({ for: 'pitch deck icons' })).slice(0, 4), ['solid', 'duo', 'suite', 'clay'])
    assert.deepEqual(styles(lib.recommendStyles({ use: 'app' })).slice(0, 2), ['line', 'duo'])
  })
  test('the flat list is true to the data: no gradients, one ink or flat role colours', () => {
    const d = lib.data()
    for (const s of FLAT) {
      assert.ok(d.styleNames.includes(s), s)
      for (const icon of ['home', 'heart', 'bell']) assert.doesNotMatch(d.svg(s)[icon], /Gradient/, `${s} ${icon}`)
    }
    // and the styles recommended as shaded do use gradients or soft shading somewhere
    for (const s of ['clay', 'suite', 'bento', 'dock', 'liquid', 'chrome', 'soft3d']) assert.match(d.svg(s).home, /Gradient/, s)
  })
})

describe('several festivals', () => {
  const FOUR = 'Diwali, Eid, Holi and Christmas gift boxes'
  test('ranks by how many of the named festivals a style covers: christmas covers one, rangoli and utsav two', () => {
    const r = lib.recommendStyles({ for: FOUR })
    assert.deepEqual(styles(r).slice(0, 3), ['rangoli', 'utsav', 'christmas'])
    const c = lib.recommendStyles({ for: 'Christmas, Diwali and Holi cards' })
    assert.notEqual(styles(c)[0], 'christmas', 'naming christmas does not outweigh two festivals')
    assert.deepEqual(styles(c).slice(0, 3), ['rangoli', 'utsav', 'christmas'])
  })
  test('says which style covers which festival, that Eid has no style, and the two ways out', () => {
    const r = lib.recommendStyles({ for: FOUR })
    const note = r.notes.find(n => /several festivals/i.test(n))
    assert.ok(note, r.notes.join(' | '))
    for (const w of ['Diwali', 'Eid', 'Holi', 'Christmas']) assert.match(note, new RegExp(w))
    assert.match(note, /rangoli and utsav cover Diwali and Holi/)
    assert.match(note, /christmas covers Christmas/)
    assert.match(note, /no (dedicated )?style for Eid/i)
    assert.match(note, /one festival style per festival/i)
    assert.match(note, /one neutral style/i)
    assert.deepEqual(r.otherFestivals, ['Eid'])
    assert.deepEqual(r.festivals.map(f => f.named), [['Diwali', 'Holi'], ['Christmas']])
    assert.equal(r.festivals[0].category, 'indian-festivals')
    // a neutral style is on the list too
    assert.ok(styles(r).includes('solid'), styles(r).join(', '))
  })
  test('two festivals with a style each: both lead, the note says so', () => {
    const r = lib.recommendStyles({ for: 'Halloween and Christmas party' })
    assert.deepEqual(new Set(styles(r).slice(0, 2)), new Set(['halloween', 'christmas']))
    assert.ok(r.notes.some(n => /several festivals/i.test(n) && /halloween covers Halloween/.test(n) && /christmas covers Christmas/.test(n)))
    assert.equal(r.otherFestivals, undefined)
  })
  test('one festival is unchanged: no coverage note, same first style', () => {
    for (const [q, st] of [['Christmas email', 'christmas'], ['Diwali sale', 'rangoli'], ['Halloween party app', 'halloween'], ['Lunar New Year promo', 'lunar'], ['Diwali wedding invitations', 'rangoli']]) {
      const r = lib.recommendStyles({ for: q })
      assert.equal(styles(r)[0], st, q)
      assert.ok(!r.notes.some(n => /several festivals/i.test(n)), q)
    }
    // Eid alone: no style for it, said once
    const eid = lib.recommendStyles({ for: 'Eid gift guide' })
    assert.deepEqual(eid.otherFestivals, ['Eid'])
  })
  test('compact keeps the several-festivals note short', () => {
    const c = lib.recommendStyles({ for: FOUR, compact: true })
    assert.deepEqual(styles(c).slice(0, 3), ['rangoli', 'utsav', 'christmas'])
    const note = c.notes.find(n => /several festivals/i.test(n))
    assert.ok(note && note.length < 450, note)
  })
})

describe('recommend_styles over MCP (stdio)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })
  const call = args => client.callTool({ name: 'recommend_styles', arguments: args })

  test('schema and description: compact, exact brand colours, several festivals', async () => {
    const { tools } = await client.listTools()
    const t = tools.find(x => x.name === 'recommend_styles')
    assert.equal(t.inputSchema.properties.compact.type, 'boolean')
    assert.match(t.inputSchema.properties.compact.description, /palette/i)
    assert.match(t.description, /compact/)
    assert.match(t.description, /exact|brand colou?rs?/i)
    assert.match(t.description, /several festivals|coverage|covers/i)
  })
  test('compact: true over the wire', async () => {
    const full = parse(await call({ for: 'pitch deck for a dentist' }))
    const raw = await call({ for: 'pitch deck for a dentist', compact: true })
    const c = parse(raw)
    assert.deepEqual(styles(c), styles(full))
    assert.ok(size(c) < size(full) * 0.45, `${size(c)} vs ${size(full)}`)
    assert.ok(raw.content[0].text.length < 2000, 'the text block is the compact JSON, not the full one')
  })
  test('exact brand colours and several festivals over the wire', async () => {
    const b = parse(await call({ for: 'pitch deck icons in our exact brand colours' }))
    assert.ok(['solid', 'line'].includes(b.recommendations[0].style))
    const f = parse(await call({ for: 'Diwali, Eid, Holi and Christmas gift boxes' }))
    assert.equal(f.recommendations[0].style, 'rangoli')
    assert.ok(f.notes.some(n => /several festivals/i.test(n)))
  })
  test('the old behaviour is intact (mcp.test.mjs covers it in detail)', async () => {
    const r = parse(await call({ for: 'Christmas email' }))
    assert.equal(r.recommendations[0].style, 'christmas')
  })
})
