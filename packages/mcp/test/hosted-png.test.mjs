// The hosted server (dist/lambda.mjs, called in process like the Lambda runtime does) makes PNG-based files itself:
// @resvg/resvg-wasm (dist/resvg.wasm) renders them with the same export engine as the local server. Every PNG here is
// decoded and checked (signature, size, transparency, baked colours), not just counted.
import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')
const cli = path.join(here, '..', '..', 'cli', 'dist', 'cli.mjs')
// the local renderer (optional dependency): when present, hosted files must equal the CLI's byte for byte
let native = fs.existsSync(cli)
try { createRequire(cli).resolve('@resvg/resvg-js') } catch { native = false }
const LAMBDA_MAX = 6 * 1024 * 1024
const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10]

/** PNG bytes -> { width, height, type, pixels: straight RGBA } (8-bit greyscale, RGB, grey+alpha or RGBA; no palette) */
export function decodePng(buf) {
  assert.deepEqual([...buf.subarray(0, 8)], PNG_SIG, 'PNG signature')
  let pos = 8, width = 0, height = 0, depth = 0, type = -1
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), kind = buf.toString('latin1', pos + 4, pos + 8), body = buf.subarray(pos + 8, pos + 8 + len)
    if (kind === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); depth = body[8]; type = body[9] }
    else if (kind === 'IDAT') idat.push(body)
    else if (kind === 'IEND') break
    pos += 12 + len
  }
  assert.equal(depth, 8, 'bit depth')
  const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[type]
  assert.ok(bpp, `colour type ${type}`)
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = width * bpp, pixels = new Uint8Array(width * height * 4)
  let prev = new Uint8Array(stride)
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), cur = new Uint8Array(stride)
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0
      let v = line[x]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      cur[x] = v & 255
    }
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4, s = x * bpp
      if (bpp === 4) pixels.set(cur.subarray(s, s + 4), i)
      else if (bpp === 3) { pixels.set(cur.subarray(s, s + 3), i); pixels[i + 3] = 255 }
      else if (bpp === 2) { pixels[i] = pixels[i + 1] = pixels[i + 2] = cur[s]; pixels[i + 3] = cur[s + 1] }
      else { pixels[i] = pixels[i + 1] = pixels[i + 2] = cur[s]; pixels[i + 3] = 255 }
    }
    prev = cur
  }
  return { width, height, type, pixels }
}
const pixel = (img, x, y) => [...img.pixels.subarray((y * img.width + x) * 4, (y * img.width + x) * 4 + 4)]
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
/** how many fully opaque pixels have exactly (within tol) this colour */
function countColour(img, h, tol = 1) {
  const [r, g, b] = hex(h)
  let n = 0
  for (let i = 0; i < img.pixels.length; i += 4) {
    const p = img.pixels
    if (p[i + 3] === 255 && Math.abs(p[i] - r) <= tol && Math.abs(p[i + 1] - g) <= tol && Math.abs(p[i + 2] - b) <= tol) n++
  }
  return n
}
const opaque = img => { let n = 0; for (let i = 3; i < img.pixels.length; i += 4) if (img.pixels[i] === 255) n++; return n }

const ev = (method, rawPath, rawQueryString = '', body, headers = {}) => ({
  version: '2.0', routeKey: '$default', rawPath, rawQueryString,
  headers: { host: 'abc.lambda-url.us-east-1.on.aws', ...headers },
  requestContext: { domainName: 'abc.lambda-url.us-east-1.on.aws', http: { method, path: rawPath, protocol: 'HTTP/1.1', sourceIp: '1.2.3.4', userAgent: 'test' } },
  body: body == null ? undefined : JSON.stringify(body), isBase64Encoded: false,
})
const rpc = (method, params) => ev('POST', '/mcp', '', { jsonrpc: '2.0', id: 1, method, params }, { 'content-type': 'application/json', accept: 'application/json, text/event-stream' })
async function exportVia(handler, args) {
  const t = performance.now()
  const r = await handler(rpc('tools/call', { name: 'export_icon', arguments: args }))
  const ms = performance.now() - t
  assert.equal(r.statusCode, 200)
  const res = JSON.parse(r.body).result
  // the files come back as resource blobs, named by their file names
  const blobs = new Map(res.content.filter(c => c.type === 'resource' && c.resource.blob).map(c => [decodeURIComponent(c.resource.uri.replace('withicons://files/', '')), Buffer.from(c.resource.blob, 'base64')]))
  return { res, s: res.structuredContent, blobs, size: Buffer.byteLength(r.body), ms }
}

describe('hosted export_icon makes PNG (resvg-wasm in the Lambda)', () => {
  let handler
  before(async () => { ({ handler } = await import(pathToFileURL(path.join(dist, 'lambda.mjs')).href)) })
  const call = args => exportVia(handler, args)

  test('the build ships the wasm renderer next to lambda.mjs, not on npm', () => {
    assert.ok(fs.statSync(path.join(dist, 'resvg.wasm')).size > 1024 * 1024)
    const files = JSON.parse(fs.readFileSync(path.join(here, '..', 'package.json'), 'utf8')).files
    assert.ok(files.includes('!dist/resvg.wasm'), 'dist/resvg.wasm is Lambda-only')
  })

  test('png: one icon at 512 px with a transparent background', async () => {
    const { s, blobs, ms } = await call({ name: 'home', format: 'png', size: 512 })
    assert.equal(s.made, true, JSON.stringify(s))
    assert.equal(s.count, 1)
    assert.equal(s.command, 'npx withicons export home --format png --size 512 --out .')
    const f = s.files[0]
    assert.deepEqual({ format: f.format, mime: f.mime, filename: f.filename, inline: f.inline }, { format: 'png', mime: 'image/png', filename: 'home-line-512.png', inline: 'resource' })
    const img = decodePng(blobs.get('home-line-512.png'))
    assert.equal(f.bytes, blobs.get('home-line-512.png').length)
    assert.deepEqual([img.width, img.height, img.type], [512, 512, 6])
    assert.equal(pixel(img, 0, 0)[3], 0, 'transparent corner')
    assert.equal(pixel(img, 511, 511)[3], 0, 'transparent corner')
    assert.ok(opaque(img) > 512 * 512 * 0.04, 'the icon itself is drawn')
    assert.ok(ms < 9000, `${ms.toFixed(0)} ms`)
  })

  test('png in a palette style with colors: the colour is baked into the pixels', async () => {
    const { s, blobs } = await call({ name: 'heart', style: 'retro', format: 'png', size: 256, colors: { c1: '#00ff00' } })
    assert.equal(s.made, true)
    const img = decodePng(blobs.get('heart-retro-256.png'))
    assert.deepEqual([img.width, img.height], [256, 256])
    assert.equal(pixel(img, 0, 0)[3], 0)
    assert.ok(countColour(img, '#00ff00') > 500, 'c1 #00ff00 paints the body')
    // the default colours do not: the same export without colors has no pure green
    const plain = await call({ name: 'heart', style: 'retro', format: 'png', size: 256 })
    assert.equal(countColour(decodePng(plain.blobs.get('heart-retro-256.png')), '#00ff00'), 0)
  })

  test('the same bytes as the local renderer (the CLI with the native @resvg/resvg-js)', { skip: !native && 'no @resvg/resvg-js' }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-png-parity-'))
    try {
      const r = spawnSync(process.execPath, [cli, 'export', 'heart', '--style', 'retro', '--format', 'png,animated-svg', '--size', '256', '--colors', 'c1=#00ff00', '--out', out], { encoding: 'utf8' })
      assert.equal(r.status, 0, r.stderr)
      const { s, blobs, res } = await call({ name: 'heart', style: 'retro', format: 'png,animated-svg', size: 256, colors: { c1: '#00ff00' } })
      assert.equal(s.made, true)
      assert.ok(blobs.get('heart-retro-256.png').equals(fs.readFileSync(path.join(out, 'heart-retro-256.png'))), 'png identical')
      const svg = s.files.find(f => f.format === 'animated-svg').filename
      const text = res.content.find(c => c.type === 'text' && c.text.startsWith(`--- ${svg} ---`)).text
      assert.equal(text.slice(text.indexOf('\n') + 1), fs.readFileSync(path.join(out, svg), 'utf8'), 'animated-svg identical (motion measured by the renderer)')
    } finally { fs.rmSync(out, { recursive: true, force: true }) }
  })

  test('the slide recipe in one call: names[] + one colour, solid matches a brand hex exactly', async () => {
    const brand = '#1d4ed8'
    const { s, blobs } = await call({ names: ['home', 'bell', 'rocket'], style: 'solid', format: 'png', size: 512, color: brand })
    assert.equal(s.made, true)
    assert.equal(s.count, 3)
    assert.deepEqual(s.files.map(f => f.filename), ['home-solid-512.png', 'bell-solid-512.png', 'rocket-solid-512.png'])
    for (const f of s.files) {
      const img = decodePng(blobs.get(f.filename))
      assert.deepEqual([img.width, img.height], [512, 512], f.filename)
      assert.equal(pixel(img, 0, 0)[3], 0, f.filename)
      assert.ok(countColour(img, brand, 0) > 512 * 512 * 0.04, `${f.filename}: exact ${brand}`)
    }
  })

  test('background: a solid slide colour fills the corners', async () => {
    const { blobs } = await call({ name: 'bell', style: 'solid', format: 'png', size: 128, background: '#0f172a', color: '#ffffff' })
    const img = decodePng(blobs.get('bell-solid-128.png'))
    assert.deepEqual(pixel(img, 0, 0), [15, 23, 42, 255])
    assert.ok(countColour(img, '#ffffff', 0) > 100)
  })

  test('the other PNG-based still formats are made too', async () => {
    const { s, blobs } = await call({ name: 'rocket', style: 'duo', format: 'png-set,ico,favicon-pack,pptx,docx' })
    assert.equal(s.made, true, JSON.stringify(s))
    assert.deepEqual(s.files.map(f => f.format), ['png-set', 'ico', 'favicon-pack', 'pptx', 'docx'])
    for (const f of s.files) {
      const b = blobs.get(f.filename)
      assert.ok(b && b.length === f.bytes, f.filename)
      if (f.format === 'ico') assert.deepEqual([...b.subarray(0, 4)], [0, 0, 1, 0], 'ICO header')
      else assert.equal(b.toString('latin1', 0, 4), 'PK\x03\x04', `${f.filename} is a zip`)
    }
    // the deck holds a real PNG of the icon
    const pptx = blobs.get(s.files.find(f => f.format === 'pptx').filename)
    assert.ok(pptx.includes(Buffer.from('ppt/media/')), 'pptx has a picture')
    const set = blobs.get(s.files.find(f => f.format === 'png-set').filename)
    assert.ok(set.includes(Buffer.from('rocket-duo-24px@4x.png')) || set.includes(Buffer.from('@4x.png')), 'png set has @4x')
  })

  test('a large PNG export comes in pages, every page under the 6 MB response limit', { timeout: 300000 }, async () => {
    const names = []
    for (const c of JSON.parse((await handler(ev('GET', '/api/categories'))).body).categories) {
      for (const ic of JSON.parse((await handler(ev('GET', '/api/categories/' + c.name))).body).icons || []) if (names.length < 40 && !names.includes(ic.name || ic)) names.push(ic.name || ic)
    }
    assert.equal(names.length, 40)
    const args = { names, style: 'liquid', format: 'png', size: 1024 }
    let cursor, pages = 0, made = 0
    const seen = new Set()
    do {
      const { s, size, ms, blobs } = await call(cursor === undefined ? args : { ...args, cursor })
      assert.equal(s.made, true)
      assert.ok(size < LAMBDA_MAX - 512 * 1024, `page ${pages}: ${size} bytes`)
      assert.ok(ms < 9000, `page ${pages}: ${ms.toFixed(0)} ms`)
      assert.ok(s.count > 0, 'every page makes progress')
      for (const f of s.files) {
        assert.ok(!seen.has(f.filename), 'no file twice: ' + f.filename); seen.add(f.filename)
        if (f.inline) assert.equal(decodePng(blobs.get(f.filename)).width, 1024)
      }
      made += s.count
      cursor = s.next && s.next.cursor
      pages++
    } while (cursor !== undefined && pages < 100)
    assert.equal(made, 40)
    assert.ok(pages > 1, 'more than one page')
  })

  test('tools/list: the hosted export_icon makes PNG itself (no "run the command" for png)', async () => {
    const tools = JSON.parse((await handler(rpc('tools/list', {}))).body).result.tools
    const x = tools.find(t => t.name === 'export_icon')
    assert.doesNotMatch(x.description, /for png-based and animated formats it returns the exact/i)
    assert.match(x.description, /png/i)
  })
})

// A Lambda package without resvg.wasm (an old zip, a broken build): PNG falls back to the command answer instead of failing.
describe('hosted export_icon without the wasm file', () => {
  let dir, handler
  before(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-nowasm-'))
    fs.mkdirSync(path.join(dir, 'data'))
    fs.copyFileSync(path.join(dist, 'lambda.mjs'), path.join(dir, 'lambda.mjs'))
    fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}\n')
    for (const f of ['svg-line.json', 'palettes.json']) fs.copyFileSync(path.join(dist, 'data', f), path.join(dir, 'data', f))
    ;({ handler } = await import(pathToFileURL(path.join(dir, 'lambda.mjs')).href))
  })
  test('png answers with the exact command, svg is still made', async () => {
    const { s } = await exportVia(handler, { name: 'home', format: 'png', size: 512 })
    assert.equal(s.made, false)
    assert.equal(s.command, 'npx withicons export home --format png --size 512 --out .')
    const svg = await exportVia(handler, { name: 'home', format: 'svg-flat' })
    assert.equal(svg.s.made, true)
    try { fs.rmSync(dir, { recursive: true, force: true }) } catch { /* Windows: the data file may still be open */ }
  })
})
