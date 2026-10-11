// The slide recipe: the server instructions (local and hosted), the export_icon format description and
// recommend_styles({ use: 'slides' }) say which file to put in a deck and how to make a whole set in one call.
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const parse = r => r.structuredContent || JSON.parse(r.content[0].text)

// what both servers must say about slides
function checkRecipe(text, where) {
  const m = /Making slides and docs:([^\n]+)/.exec(text)
  assert.ok(m, `${where}: a "Making slides and docs" paragraph`)
  const p = m[1]
  for (const [re, what] of [
    [/recommend_styles\(\{ use: 'slides' \}\)/, 'recommend_styles({ use: \'slides\' }) first'],
    [/export_icon/, 'export_icon'], [/format: 'png'/, "format: 'png'"], [/size: 512/, 'size: 512'], [/transparent/i, 'transparent background'],
    [/names: \[/, 'names: [...]'], [/colors/, 'one colors'], [/one call/i, 'a single call'],
    [/0\.5.{1,8}3 in/i, 'display sizes 0.5 to 3 inches'], [/PNG, not SVG/, 'embed PNG, not SVG'], [/pptxgenjs/, 'pptxgenjs'], [/python-pptx/, 'python-pptx'],
    [/'pptx'/, 'what pptx is for'], [/'pptx-sheet'/, 'what pptx-sheet is for'], [/'pptx-animated'/, 'what pptx-animated is for'],
    [/solid.{0,12}line|line.{0,12}solid/, 'single-colour styles'], [/brand (hex|colour)/i, 'brand hex'], [/gradient/i, 'gradient styles do not match exactly'],
  ]) assert.match(p, re, `${where}: ${what}`)
  return p
}

describe('slide recipe: local server (stdio)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })

  test('instructions: a concrete "Making slides and docs" paragraph with out_dir', () => {
    const p = checkRecipe(client.getInstructions(), 'local')
    assert.match(p, /out_dir/)
  })
  test('export_icon format says in one line what goes in a deck', async () => {
    const x = (await client.listTools()).tools.find(t => t.name === 'export_icon')
    const d = x.inputSchema.properties.format.description
    assert.match(d, /slides/i)
    assert.match(d, /png/)
    assert.match(d, /512/)
    assert.doesNotMatch(d, /\n/)
  })
  test('recommend_styles({ use: "slides" }) carries the slide note', async () => {
    const r = parse(await client.callTool({ name: 'recommend_styles', arguments: { use: 'slides' } }))
    const note = r.notes.find(n => /^Slides/.test(n))
    assert.ok(note, JSON.stringify(r.notes))
    for (const re of [/export_icon/, /png/, /512/, /names/, /PNG, not SVG/, /solid/, /gradient/i]) assert.match(note, re)
    // a deck named in plain words gets it too; another job does not
    assert.ok(parse(await client.callTool({ name: 'recommend_styles', arguments: { for: 'pitch deck for a bakery' } })).notes.some(n => /^Slides/.test(n)))
    assert.ok(!parse(await client.callTool({ name: 'recommend_styles', arguments: { use: 'kids' } })).notes.some(n => /^Slides/.test(n)))
  })
})

describe('slide recipe: hosted server (Lambda handler)', () => {
  let handler
  before(async () => { ({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href)) })
  const ev = (method, rawPath, rawQueryString = '', body) => ({
    version: '2.0', rawPath, rawQueryString, headers: { host: 'withicons.com', 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    requestContext: { http: { method, path: rawPath, sourceIp: '1.2.3.4' } }, body: body == null ? undefined : JSON.stringify(body), isBase64Encoded: false,
  })
  const rpc = (method, params) => handler(ev('POST', '/mcp', '', { jsonrpc: '2.0', id: 1, method, params })).then(r => JSON.parse(r.body).result)

  test('instructions: the same recipe, true for the hosted server (PNG made here, no "local server" detour)', async () => {
    const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } })
    const p = checkRecipe(init.instructions, 'hosted')
    assert.doesNotMatch(p, /out_dir/)
    assert.match(p, /inline|base64/i)
    assert.doesNotMatch(init.instructions, /PNG-based and animated formats come back as the exact/)
    assert.doesNotMatch(init.instructions, /local server for PNG|use the local server/i)
  })
  test('export_icon format description and /api/recommend?use=slides', async () => {
    const x = (await rpc('tools/list', {})).tools.find(t => t.name === 'export_icon')
    assert.match(x.inputSchema.properties.format.description, /png/)
    const r = JSON.parse((await handler(ev('GET', '/api/recommend', 'use=slides'))).body)
    assert.ok(r.notes.some(n => /^Slides/.test(n) && /export_icon/.test(n)), JSON.stringify(r.notes))
  })
})
