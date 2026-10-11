// preview_icons: one picture of several icons in several styles (rows = icons, columns = styles), so an agent can look before it
// chooses. Local server: a PNG (inline image content, and a file with out_dir). Hosted server: a self-contained SVG sheet.
// node --test packages/mcp/test/preview.test.mjs   (needs the bundles: cd packages/mcp && npm run build)
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const parse = r => r.structuredContent || JSON.parse(r.content[0].text)
let hasRenderer = true
try { createRequire(path.join(dist, 'stdio.mjs')).resolve('@resvg/resvg-js') } catch {
  try { createRequire(path.join(dist, '..', '..', '..', 'package.json')).resolve('@resvg/resvg-js') } catch { hasRenderer = false }
}
const R = { skip: !hasRenderer && 'no @resvg/resvg-js' }

const BAKERY = ['cake', 'cookie', 'donut', 'chef-hat']
const STYLES = ['line', 'duo', 'clay', 'kawaii']
const ICONS = ['cake', 'cookie', 'donut', 'chef-hat', 'coffee', 'bell', 'home', 'heart', 'star', 'moon', 'sun', 'cloud', 'key', 'lock', 'mail', 'phone', 'camera', 'book', 'clock', 'flag', 'gift', 'globe', 'map', 'music', 'pizza']   // 25 icons: one more than a sheet takes

// ---- a small PNG decoder (8-bit RGBA / RGB, no interlace): enough to look at pixels ----
function decodePng(buf) {
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'PNG signature')
  let pos = 8, w = 0, h = 0, depth = 0, type = 0
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), kind = buf.toString('ascii', pos + 4, pos + 8), data = buf.subarray(pos + 8, pos + 8 + len)
    if (kind === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; assert.equal(data[12], 0, 'not interlaced') }
    if (kind === 'IDAT') idat.push(data)
    if (kind === 'IEND') break
    pos += 12 + len
  }
  assert.equal(depth, 8)
  assert.ok(type === 6 || type === 2, 'RGBA or RGB')
  const bpp = type === 6 ? 4 : 3, stride = w * bpp
  const raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(h * stride)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, row = y * stride
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[row + x - bpp] : 0, b = y ? px[row - stride + x] : 0, c = x >= bpp && y ? px[row - stride + x - bpp] : 0
      let v = raw[src + x]
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      px[row + x] = v & 255
    }
  }
  const at = (x, y) => { const i = y * stride + x * bpp; return [px[i], px[i + 1], px[i + 2], bpp === 4 ? px[i + 3] : 255] }
  return { w, h, at }
}
const pngDims = buf => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) })
const imageOf = r => { const c = r.content.find(x => x.type === 'image'); assert.ok(c, 'an image content block'); assert.equal(c.mimeType, 'image/png'); return Buffer.from(c.data, 'base64') }
const textBlocks = r => r.content.filter(c => c.type === 'text').map(c => c.text)
const svgOf = r => { const t = textBlocks(r).find(x => x.startsWith('<svg')); assert.ok(t, 'an SVG text block'); return t }

// ---- well-formed XML, without a parser: every tag closes, attributes are quoted, nothing else is in the tags ----
function assertWellFormed(svg) {
  const stack = []
  const re = /<(\/?)([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g
  let last = 0, m
  while ((m = re.exec(svg))) {
    const between = svg.slice(last, m.index)
    assert.ok(!between.includes('<') && !between.includes('>'), 'stray < or > near ' + between.slice(0, 40))
    last = re.lastIndex
    const [, close, tag, , self] = m
    if (close) assert.equal(stack.pop(), tag, `</${tag}> closes ${tag}`)
    else if (!self) stack.push(tag)
  }
  assert.equal(svg.slice(last).trim(), '')
  assert.deepEqual(stack, [], 'every tag is closed')
}
const idsOf = svg => [...svg.matchAll(/\bid="([^"]*)"/g)].map(m => m[1])
const refsOf = svg => [...svg.matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]).concat([...svg.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))
function assertSelfContained(svg) {
  assertWellFormed(svg)
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
  assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"', ''), /https?:|\/\/|href="(?!#)|xlink|@import|<image|<script|<foreignObject|<style|<link|<use|data:/i, 'no external reference')
  assert.doesNotMatch(svg, /var\(|currentColor/, 'CSS variables and currentColor are baked in')
  assert.doesNotMatch(svg, /class="[^"]*wm-/, 'no motion hooks')
  const ids = idsOf(svg)
  assert.equal(new Set(ids).size, ids.length, 'ids are unique')
  for (const r of refsOf(svg)) assert.ok(ids.includes(r), `url(#${r}) has a target`)
}

describe('preview_icons on the local server (stdio)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })
  const call = args => client.callTool({ name: 'preview_icons', arguments: args })

  test('is listed: not read-only locally (out_dir writes a file), with the documented arguments', async () => {
    const { tools } = await client.listTools()
    const t = tools.find(x => x.name === 'preview_icons')
    assert.ok(t, 'preview_icons is a tool')
    assert.equal(t.annotations.readOnlyHint, false)   // like export_icon: only the hosted server (no out_dir) is read-only
    for (const k of ['names', 'styles', 'size', 'background', 'labels', 'columns', 'format', 'out_dir', 'palette', 'colors']) assert.ok(t.inputSchema.properties[k], k)
    assert.deepEqual(t.inputSchema.required, ['names'])
    assert.match(t.description, /rows/i)
    assert.match(t.description, /PNG/)
    assert.equal(t.inputSchema.properties.names.maxItems, 24)
    assert.equal(t.inputSchema.properties.styles.maxItems, 6)
    assert.equal(t.inputSchema.properties.size.default, undefined, 'defaults are in the description, not enforced by the schema')
  })
  test('server instructions tell agents to look before choosing', async () => {
    assert.match(client.getInstructions(), /preview_icons/)
  })

  test('PNG sheet: bakery icons in four styles, a valid PNG whose size is the grid', R, async () => {
    const r = await call({ names: BAKERY, styles: STYLES })
    assert.ok(!r.isError, JSON.stringify(r.content))
    const s = parse(r), png = imageOf(r)
    assert.equal(s.format, 'png')
    assert.equal(s.mime, 'image/png')
    assert.deepEqual(s.icons, BAKERY)
    assert.deepEqual(s.styles, STYLES)
    assert.equal(s.layout, 'matrix')
    assert.equal(s.rows, 4)
    assert.equal(s.columns, 4)
    assert.equal(s.cells, 16)
    assert.equal(s.size, 64)
    assert.equal(s.background, '#ffffff')
    assert.match(s.reading, /rows are icons/i)
    assert.deepEqual(pngDims(png), { w: s.width, h: s.height })
    const img = decodePng(png)
    assert.equal(img.w, s.width)
    assert.deepEqual(img.at(2, 2), [255, 255, 255, 255], 'light background')
    assert.ok(s.width > 4 * s.grid.cell && s.height > 4 * s.grid.cell, 'room for every cell and the labels')
    assert.ok(png.length < 1.5 * 1024 * 1024)
    // the summary text block is the same JSON
    assert.equal(JSON.parse(r.content[0].text).width, s.width)
  })

  test('the sheet grows by exactly one tile per style (wide) and per icon (tall); icons are drawn at size', R, async () => {
    const dims = async a => { const s = parse(await call({ labels: false, ...a })); return s }
    const a = await dims({ names: ['cake', 'cookie'], styles: ['line', 'duo'] })
    const wide = await dims({ names: ['cake', 'cookie'], styles: ['line', 'duo', 'solid'] })
    const tall = await dims({ names: ['cake', 'cookie', 'donut'], styles: ['line', 'duo'] })
    const { cell, gap, margin } = a.grid
    assert.equal(a.width, 2 * margin + 2 * cell + gap)
    assert.equal(a.height, 2 * margin + 2 * cell + gap)
    assert.equal(wide.width - a.width, cell + gap)
    assert.equal(wide.height, a.height)
    assert.equal(tall.height - a.height, cell + gap)
    assert.equal(tall.width, a.width)
    const small = await dims({ names: ['cake', 'cookie'], styles: ['line', 'duo'], size: 32 })
    const big = await dims({ names: ['cake', 'cookie'], styles: ['line', 'duo'], size: 128 })
    assert.ok(small.grid.cell > 32 && small.grid.cell < 64 && big.grid.cell > 128, 'the tile is the icon plus its padding')
    assert.ok(small.width < a.width && a.width < big.width)
    assert.equal(big.size, 128)
  })

  test('labels: a row name per icon and a column name per style; labels: false is the bare grid', R, async () => {
    const withLabels = parse(await call({ names: ['cake', 'cookie'], styles: ['line', 'duo'] }))
    const bare = parse(await call({ names: ['cake', 'cookie'], styles: ['line', 'duo'], labels: false }))
    assert.equal(withLabels.labels, true)
    assert.equal(bare.labels, false)
    assert.ok(withLabels.width > bare.width && withLabels.height > bare.height)
    // the label column and header row are drawn: pixels other than the background where a bare grid has none
    const r = await call({ names: ['cake', 'cookie'], styles: ['line', 'duo'] })
    const img = decodePng(imageOf(r))
    let ink = 0
    for (let x = withLabels.grid.margin; x < withLabels.grid.margin + 40; x++) for (let y = withLabels.grid.margin + 30; y < withLabels.height - 10; y++) if (img.at(x, y)[0] < 160) ink++
    assert.ok(ink > 20, 'row labels are drawn at the left')
  })

  test('a dark background changes the pixels: dark page, light ink', R, async () => {
    const args = { names: ['cake', 'chef-hat'], styles: ['line', 'solid'] }
    const light = await call(args), dark = await call({ ...args, background: 'dark' })
    const sl = parse(light), sd = parse(dark)
    assert.equal(sd.background === '#ffffff', false)
    assert.equal(sl.width, sd.width)
    assert.equal(sl.height, sd.height)
    assert.notDeepEqual(imageOf(light), imageOf(dark))
    const il = decodePng(imageOf(light)), id = decodePng(imageOf(dark))
    const corner = id.at(2, 2)
    assert.ok(corner[0] < 60 && corner[1] < 60 && corner[2] < 80, 'dark page ' + corner)
    // the line icons are drawn in a light ink on dark: some pixel in the first icon cell is bright
    const lum = p => (p[0] + p[1] + p[2]) / 3
    const cellBox = { x0: sd.grid.margin + 60, y0: sd.grid.margin + 30 }
    let brightest = 0, darkest = 255, brightestL = 0, darkestL = 255
    for (let x = cellBox.x0; x < sd.width - sd.grid.margin; x++) for (let y = cellBox.y0; y < cellBox.y0 + sd.grid.cell; y++) {
      brightest = Math.max(brightest, lum(id.at(x, y))); darkest = Math.min(darkest, lum(id.at(x, y)))
      brightestL = Math.max(brightestL, lum(il.at(x, y))); darkestL = Math.min(darkestL, lum(il.at(x, y)))
    }
    assert.ok(brightest > 200, 'light ink on the dark sheet: ' + brightest)
    assert.ok(darkestL < 80, 'dark ink on the light sheet: ' + darkestL)
    assert.ok(sd.notes.some(n => /dark/i.test(n)), 'a note on the dark background')
  })

  test('a hex background is used as given; its brightness picks the ink', R, async () => {
    const r = await call({ names: ['cake'], styles: ['line'], background: '#fde68a' })
    const s = parse(r)
    assert.equal(s.background, '#fde68a')
    assert.deepEqual(decodePng(imageOf(r)).at(1, 1), [0xfd, 0xe6, 0x8a, 255])
    const navy = parse(await call({ names: ['cake'], styles: ['line'], background: '#0b1b3a', format: 'svg' }))
    assert.equal(navy.background, '#0b1b3a')
    assert.notEqual(navy.ink, s.ink)
  })

  test('palette styles show their default colours', R, async () => {
    const r = await call({ names: ['heart'], styles: ['line', 'kawaii'] })
    const img = decodePng(imageOf(r)), s = parse(r)
    // kawaii paints a colour: the second tile holds a saturated pixel; line is all ink
    const sat = p => Math.max(p[0], p[1], p[2]) - Math.min(p[0], p[1], p[2])
    let line = 0, kawaii = 0
    const x1 = Math.round(s.width / 2)
    for (let x = 0; x < s.width; x++) for (let y = s.grid.margin + 30; y < s.height; y++) if (sat(img.at(x, y)) > 40) { if (x < x1) line++; else kawaii++ }
    assert.ok(kawaii > 200, 'kawaii heart is coloured: ' + kawaii)
    assert.ok(line < kawaii / 4, 'line heart is ink: ' + line)
  })

  test('one style is a gallery: icons in a grid, a name under each', R, async () => {
    const names = ['cake', 'cookie', 'donut', 'chef-hat', 'coffee', 'bell', 'home', 'heart']
    const s = parse(await call({ names, styles: ['solid'] }))
    assert.equal(s.layout, 'grid')
    assert.equal(s.columns * s.rows >= names.length, true)
    assert.ok(s.columns <= 6 && s.rows >= 2, `balanced: ${s.columns} x ${s.rows}`)
    assert.deepEqual(s.icons, names)
    assert.match(s.reading, /left to right/i)
    const wide = parse(await call({ names, styles: ['solid'], columns: 4 }))
    assert.equal(wide.columns, 4)
    assert.equal(wide.rows, 2)
    const one = parse(await call({ names: ['cake'], styles: ['solid'] }))
    assert.equal(one.cells, 1)
    // `style` (as in get_icon) is a shortcut for one style; no style at all: line
    assert.deepEqual(parse(await call({ names: ['cake'], style: 'clay', format: 'svg' })).styles, ['clay'])
    const dflt = parse(await call({ names: ['cake', 'cookie'] }))
    assert.deepEqual(dflt.styles, ['line'])
  })

  test('aliases resolve to the canonical icon; duplicates collapse', R, async () => {
    const s = parse(await call({ names: ['delete', 'trash', 'cake'], styles: ['line'], format: 'svg' }))
    assert.deepEqual(s.icons, ['trash', 'cake'])
    assert.deepEqual(s.aliases, { delete: 'trash' })
  })

  test('out_dir saves the sheet and says where; the file is the inline image', R, async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-preview-'))
    try {
      const r = await call({ names: BAKERY, styles: ['line', 'duo'], out_dir: path.join(dir, 'sheets') })
      const s = parse(r)
      assert.ok(s.path && s.path.startsWith(path.join(dir, 'sheets')) && s.path.endsWith('.png'), s.path)
      assert.equal(path.basename(s.path), s.filename)
      assert.deepEqual(fs.readFileSync(s.path), imageOf(r))
      const svg = parse(await call({ names: ['cake'], styles: ['line'], format: 'svg', out_dir: dir }))
      assert.ok(svg.path.endsWith('.svg'))
      assert.equal(fs.readFileSync(svg.path, 'utf8').slice(0, 4), '<svg')
    } finally { fs.rmSync(dir, { recursive: true, force: true }) }
  })

  test('format svg: a self-contained vector sheet as text', async () => {
    const r = await call({ names: BAKERY, styles: STYLES, format: 'svg' })
    assert.ok(!r.isError, JSON.stringify(r.content))
    const s = parse(r)
    assert.equal(s.format, 'svg')
    assert.equal(s.mime, 'image/svg+xml')
    assert.ok(!r.content.some(c => c.type === 'image'))
    const svg = svgOf(r)
    assertSelfContained(svg)
    assert.match(svg, new RegExp(`width="${s.width}" height="${s.height}"`))
  })

  test('colors recolour the multi-colour styles; palette not on every icon is a note, not a failure', async () => {
    const base = svgOf(await call({ names: ['heart'], styles: ['kawaii'], format: 'svg' }))
    const red = svgOf(await call({ names: ['heart'], styles: ['kawaii'], format: 'svg', colors: { c1: '#12ab34' } }))
    assert.doesNotMatch(base, /#12ab34/i)
    assert.match(red, /#12ab34/i)
    const r = await call({ names: ['heart', 'cake'], styles: ['kawaii'], format: 'svg', palette: 'no-such-palette' })
    assert.ok(!r.isError, JSON.stringify(r.content))
    assert.ok(parse(r).notes.some(n => /no-such-palette/.test(n)))
    const bad = await call({ names: ['heart'], styles: ['kawaii'], format: 'svg', colors: { c1: 'not a colour!' } })
    assert.equal(bad.isError, true)
  })

  test('a size under a style\'s minSize still renders, with a note', async () => {
    const s = parse(await call({ names: ['cake'], styles: ['line', 'kawaii', 'clay'], size: 24, format: 'svg' }))
    assert.equal(s.size, 24)
    const note = s.notes.find(n => /minSize|reads best|smallest/i.test(n))
    assert.ok(note, JSON.stringify(s.notes))
    assert.match(note, /kawaii/)
    assert.match(note, /clay/)
    assert.doesNotMatch(note, /\bline\b/)
    const fine = parse(await call({ names: ['cake'], styles: ['line'], size: 24, format: 'svg' }))
    assert.ok(!fine.notes.some(n => /minSize|reads best|smallest/i.test(n)))
  })

  test('unknown icons: one error naming each with its nearest icons', async () => {
    const r = await call({ names: ['cake', 'croisant', 'zzzqqq'], styles: ['line'] })
    assert.equal(r.isError, true)
    const e = JSON.parse(r.content[0].text)
    assert.match(e.error, /croisant/)
    assert.match(e.error, /zzzqqq/)
    assert.match(e.error, /Did you mean/)
    assert.equal(e.code, 'unknown_icon')
    assert.ok(e.unknown.find(x => x.name === 'croisant').nearest.length > 0)
    assert.match(e.error, /search_icons|resolve_icon/)
  })
  test('unknown styles: the style list and the closest style', async () => {
    const r = await call({ names: ['cake'], styles: ['line', 'glas'] })
    assert.equal(r.isError, true)
    const e = JSON.parse(r.content[0].text)
    assert.equal(e.code, 'unknown_style')
    assert.match(e.error, /"glas"/)
    assert.match(e.error, /Did you mean glass/)
    assert.match(e.error, /kawaii/, 'lists the styles')
    // case does not matter, and a comma list is understood
    const ok = parse(await call({ names: ['cake'], styles: ['Line, DUO'], format: 'svg' }))
    assert.deepEqual(ok.styles, ['line', 'duo'])
  })
  test('limits: 24 icons, 6 styles, size 12-256, a sheet no larger than 4096 px; clear messages', async () => {
    const many = ICONS
    const tooMany = await call({ names: many, styles: ['line'] })
    assert.equal(tooMany.isError, true)
    assert.match(tooMany.content[0].text, /24/)
    const seven = await call({ names: ['cake'], styles: ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch'] })
    assert.equal(seven.isError, true)
    assert.match(seven.content[0].text, /6/)
    for (const size of [8, 300]) {
      const r = await call({ names: ['cake'], size })
      assert.equal(r.isError, true, 'size ' + size)
      assert.match(r.content[0].text, /12|256|size/i)
    }
    const huge = await call({ names: ICONS.slice(0, 24), styles: ['line', 'solid', 'duo', 'gloss'], size: 256 })
    assert.equal(huge.isError, true)
    const e = JSON.parse(huge.content[0].text)
    assert.equal(e.code, 'sheet_too_large')
    assert.match(e.error, /4096/)
    assert.match(e.error, /smaller size|fewer icons|fewer styles/i)
    assert.equal((await call({ names: [] })).isError, true)
    assert.equal((await call({})).isError, true)
    const bg = await call({ names: ['cake'], background: 'rainbow' })
    assert.equal(bg.isError, true)
    assert.match(bg.content[0].text, /light|dark|#/)
    assert.equal((await call({ names: ['cake'], styles: ['line'], columns: 40 })).isError, true)
  })

  test('without a PNG renderer the sheet comes back as SVG with a note', { skip: !hasRenderer && 'no @resvg/resvg-js' }, async () => {
    const c = new Client({ name: 'withicons-test-norenderer', version: '1.0.0' })
    await c.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore', env: { ...process.env, WITHICONS_NO_RESVG: '1' } }))
    try {
      const r = await c.callTool({ name: 'preview_icons', arguments: { names: ['cake'], styles: ['line'] } })
      assert.ok(!r.isError, JSON.stringify(r.content))
      const s = parse(r)
      assert.equal(s.format, 'svg')
      assert.equal(s.requestedFormat, 'png')
      assert.ok(s.notes.some(n => /resvg/.test(n)))
      assertSelfContained(svgOf(r))
    } finally { await c.close() }
  })
})

describe('preview_icons on the hosted server (Lambda handler): an SVG sheet', () => {
  let handler
  before(async () => { ({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href)) })
  const ev = (body) => ({
    version: '2.0', routeKey: '$default', rawPath: '/mcp', rawQueryString: '',
    headers: { host: 'abc.lambda-url.us-east-1.on.aws', 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    requestContext: { domainName: 'abc.lambda-url.us-east-1.on.aws', http: { method: 'POST', path: '/mcp', protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'test' } },
    body: JSON.stringify(body), isBase64Encoded: false,
  })
  let id = 100
  const rpc = async (method, params) => { const r = await handler(ev({ jsonrpc: '2.0', id: ++id, method, params })); assert.equal(r.statusCode, 200); return JSON.parse(r.body).result }
  const call = args => rpc('tools/call', { name: 'preview_icons', arguments: args })

  test('is listed, read-only, without out_dir; the instructions mention it', async () => {
    const { tools } = await rpc('tools/list', {})
    const t = tools.find(x => x.name === 'preview_icons')
    assert.ok(t)
    assert.equal(t.annotations.readOnlyHint, true)
    assert.ok(!t.inputSchema.properties.out_dir, 'a hosted server has nowhere to save')
    assert.match(t.description, /SVG/)
    const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } })
    assert.match(init.instructions, /preview_icons/)
  })

  test('returns a valid, self-contained SVG: no external references, variables flattened, ids unique', async () => {
    const r = await call({ names: BAKERY, styles: ['line', 'duo', 'clay', 'glass', 'liquid', 'chrome'] })
    assert.ok(!r.isError, JSON.stringify(r.content).slice(0, 300))
    assert.ok(!r.content.some(c => c.type === 'image'), 'no PNG here')
    const s = r.structuredContent
    assert.equal(s.format, 'svg')
    assert.equal(s.mime, 'image/svg+xml')
    const svg = svgOf(r)
    assertSelfContained(svg)
    assert.match(svg, new RegExp(`width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}"`))
    // the rich styles' gradients are there, one set per cell, each with its own id
    const grads = idsOf(svg).filter(x => /^wg-/.test(x))
    assert.ok(grads.length >= 4 * 4, 'gradients from the rich styles: ' + grads.length)
    for (const st of ['clay', 'glass', 'liquid', 'chrome']) assert.ok(grads.some(x => x.startsWith('wg-' + st + '-')), st)
    assert.ok(svg.length < 3 * 1024 * 1024)
  })
  test('ids are unique across cells even when one sheet is pasted next to another in one page', async () => {
    const a = svgOf(await call({ names: ['cake', 'cookie'], styles: ['clay', 'glass'] }))
    const b = svgOf(await call({ names: ['cake', 'cookie'], styles: ['clay', 'glass'], background: 'dark' }))
    const c = svgOf(await call({ names: ['cake', 'donut'], styles: ['clay', 'liquid'] }))
    const A = idsOf(a), B = idsOf(b), C = idsOf(c)
    assert.ok(A.length >= 4)
    for (const [x, y] of [[A, B], [A, C], [B, C]]) assert.deepEqual(x.filter(i => y.includes(i)), [], 'no id appears in two sheets')
    assertWellFormed(a + b + c)
    assert.equal(new Set([...A, ...B, ...C]).size, A.length + B.length + C.length)
  })
  test('deterministic: the same call gives the same bytes', async () => {
    const args = { names: ['cake', 'donut'], styles: ['line', 'clay'], background: '#fff7ed' }
    assert.equal(svgOf(await call(args)), svgOf(await call(args)))
  })
  test('the sheet is drawn: the paths and the background are there; a dark sheet inks light', async () => {
    const light = svgOf(await call({ names: ['cake'], styles: ['line', 'solid'] }))
    const dark = svgOf(await call({ names: ['cake'], styles: ['line', 'solid'], background: 'dark' }))
    assert.match(light, /<rect [^>]*fill="#ffffff"/)
    assert.doesNotMatch(dark, /<rect [^>]*fill="#ffffff"/)
    assert.match(dark, /#f1f5f9/i)
    assert.ok((light.match(/<path /g) || []).length >= 5, 'the icons are drawn as paths')
    assert.notEqual(light, dark)
  })
  test('format png on the hosted server: an SVG, with a note on how to get a PNG', async () => {
    const r = await call({ names: ['cake'], styles: ['line'], format: 'png' })
    assert.ok(!r.isError)
    const s = r.structuredContent
    assert.equal(s.format, 'svg')
    assert.equal(s.requestedFormat, 'png')
    assert.ok(s.notes.some(n => /PNG/.test(n) && /local|npx/i.test(n)), JSON.stringify(s.notes))
    assertSelfContained(svgOf(r))
  })
  test('renders: resvg draws the hosted sheet at the size it reports', R, async () => {
    const { Resvg } = createRequire(path.join(dist, 'stdio.mjs'))('@resvg/resvg-js')
    const r = await call({ names: ['cake', 'chef-hat'], styles: ['clay', 'glass', 'pixel'] })
    const png = new Resvg(svgOf(r)).render()
    assert.equal(png.width, r.structuredContent.width)
    assert.equal(png.height, r.structuredContent.height)
  })
  test('the same errors as the other tools, and the same limits', async () => {
    const bad = await call({ names: ['croisant'], styles: ['line'] })   // a typo of an icon: unknown, with a nearest name
    assert.equal(bad.isError, true)
    assert.match(bad.content[0].text, /Did you mean/)
    const badStyle = await call({ names: ['cake'], styles: ['nope'] })
    assert.equal(badStyle.isError, true)
    assert.match(badStyle.content[0].text, /unknown_style/)
    const many = await call({ names: Array.from({ length: 25 }, (_, i) => 'cake' + i), styles: ['line'] })
    assert.equal(many.isError, true)
  })
})

describe('previewSheet in @withicons/mcp/lib: the same sheet as a function', () => {
  let lib, handler
  before(async () => {
    lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
    ;({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href))
  })
  test('returns the SVG, its size and how to read it; the hosted tool returns the same bytes', async () => {
    const args = { names: ['delete', 'cake'], styles: ['line', 'clay'], size: 48, background: '#fff7ed' }
    const r = lib.previewSheet(args)
    assert.equal(r.layout, 'matrix')
    assert.deepEqual(r.icons, ['trash', 'cake'])
    assert.deepEqual(r.aliases, { delete: 'trash' })
    assert.equal(r.background, '#fff7ed')
    assert.equal(r.size, 48)
    assert.match(r.svg, new RegExp(`^<svg xmlns="http://www.w3.org/2000/svg" width="${r.width}" height="${r.height}"`))
    assertSelfContained(r.svg)
    assert.ok(lib.PREVIEW_LIMITS.names === 24 && lib.PREVIEW_LIMITS.styles === 6)
    const via = await handler({ version: '2.0', routeKey: '$default', rawPath: '/mcp', rawQueryString: '', headers: { host: 'x', 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      requestContext: { domainName: 'x', http: { method: 'POST', path: '/mcp', protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 't' } }, isBase64Encoded: false,
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'preview_icons', arguments: args } }) })
    assert.equal(JSON.parse(via.body).result.content[1].text, r.svg)
  })
  test('throws IconError with a code for what to change', () => {
    const code = a => { try { lib.previewSheet(a) } catch (e) { assert.ok(e instanceof lib.IconError); return e.code } assert.fail('should throw') }
    assert.equal(code({ names: ['croisant'] }), 'unknown_icon')
    assert.equal(code({ names: ['cake'], styles: ['glas'] }), 'unknown_style')
    assert.equal(code({ names: [] }), 'missing_name')
    assert.equal(code({ names: ['cake'], size: 5 }), 'invalid_size')
    assert.equal(code({ names: ['cake'], background: 'rainbow' }), 'invalid_background')
    assert.equal(code({ names: ['cake'], columns: 0 }), 'invalid_columns')
    assert.equal(code({ names: ICONS }), 'too_many_icons')
    assert.equal(code({ names: ['cake'], styles: ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch'] }), 'too_many_styles')
    assert.equal(code({ names: ICONS.slice(0, 24), styles: ['line', 'solid', 'duo'], size: 256 }), 'sheet_too_large')
  })
  test('notes: an oversized picture, a dark page, a style below its minSize, columns in a matrix', () => {
    const tall = lib.previewSheet({ names: ICONS.slice(0, 20), styles: ['line', 'duo'] })
    assert.ok(tall.height > 1600)
    assert.ok(tall.notes.some(n => /shrink/.test(n)), JSON.stringify(tall.notes))
    assert.deepEqual(lib.previewSheet({ names: ['cake'], styles: ['line'] }).notes, [])
    assert.ok(lib.previewSheet({ names: ['cake'], styles: ['line', 'solid'], columns: 3 }).notes.some(n => /columns only applies/.test(n)))
  })
})
