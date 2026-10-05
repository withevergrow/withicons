// node --test packages/cli/test/export.test.mjs   (needs dist/cli.mjs from the forge build: node forge/build.mjs mcp --no-site)
// Every `withicons export` format, checked for a valid file: PNG chunks + CRCs + pixel data, ZIP entries + CRCs,
// PDF xref, ICO directory, well-formed XML, parseable JSON / JS / TS, decodable data URIs.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { decodeGif, decodeApng } from './anim-decode.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const cli = path.join(here, '..', 'dist', 'cli.mjs')
let tmp
const run = (args, env = {}) => spawnSync(process.execPath, [cli, ...args], { encoding: 'buffer', cwd: tmp, env: { ...process.env, NO_COLOR: '1', ...env } })
const text = r => ({ status: r.status, stdout: r.stdout.toString('utf8'), stderr: r.stderr.toString('utf8') })
// export into a fresh folder, return { files: [{ format, filename, file, bytes }] } from --json
let n = 0
function exp(...args) {
  const out = path.join(tmp, 'out' + n++)
  const r = text(run(['export', ...args, '--out', out, '--json']))
  assert.equal(r.status, 0, r.stderr + r.stdout)
  return JSON.parse(r.stdout)
}
const read = f => fs.readFileSync(f.file)
const one = (j, format) => { const f = j.files.find(x => x.format === format); assert.ok(f, 'no ' + format); return f }
let hasRenderer = true
const req = createRequire(cli)
try { req.resolve('@resvg/resvg-js') } catch {
  try { createRequire(path.join(here, '..', '..', '..', 'package.json')).resolve('@resvg/resvg-js') } catch { hasRenderer = false }
}

before(() => { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-export-')) })
after(() => { fs.rmSync(tmp, { recursive: true, force: true }) })

// ---------------------------------------------------------------- validators
const CRC = (() => { const t = new Uint32Array(256); for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[i] = c >>> 0 } return t })()
const crc32 = b => { let c = 0xFFFFFFFF; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }

function checkPng(buf, size) {
  assert.deepEqual([...buf.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'PNG signature')
  let at = 8, ihdr = null, idat = [], end = false
  while (at < buf.length) {
    const len = buf.readUInt32BE(at), type = buf.toString('latin1', at + 4, at + 8), body = buf.subarray(at + 8, at + 8 + len)
    assert.equal(buf.readUInt32BE(at + 8 + len), crc32(buf.subarray(at + 4, at + 8 + len)), `PNG ${type} CRC`)
    if (type === 'IHDR') ihdr = { w: body.readUInt32BE(0), h: body.readUInt32BE(4), depth: body[8], color: body[9] }
    if (type === 'IDAT') idat.push(body)
    if (type === 'IEND') { end = true; break }
    at += 12 + len
  }
  assert.ok(ihdr && end, 'IHDR and IEND')
  if (size) { assert.equal(ihdr.w, size); assert.equal(ihdr.h, size) }
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.color]
  const raw = zlib.inflateSync(Buffer.concat(idat))
  assert.equal(raw.length, ihdr.h * (1 + Math.ceil(ihdr.w * ch * ihdr.depth / 8)), 'PNG pixel data length')
  return ihdr
}
// STORE / DEFLATE zip reader -> { name: Buffer }
function unzip(buf) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  assert.ok(eocd >= 0, 'ZIP end record')
  const count = buf.readUInt16LE(eocd + 10), cd = buf.readUInt32LE(eocd + 16), out = {}
  let at = cd
  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(at), 0x02014b50, 'ZIP central header')
    const method = buf.readUInt16LE(at + 10), crc = buf.readUInt32LE(at + 16), csize = buf.readUInt32LE(at + 20)
    const nl = buf.readUInt16LE(at + 28), el = buf.readUInt16LE(at + 30), cl = buf.readUInt16LE(at + 32), off = buf.readUInt32LE(at + 42)
    const name = buf.toString('utf8', at + 46, at + 46 + nl)
    assert.equal(buf.readUInt32LE(off), 0x04034b50, 'ZIP local header ' + name)
    const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28)
    const raw = buf.subarray(start, start + csize), data = method === 8 ? zlib.inflateRawSync(raw) : raw
    assert.equal(crc32(data), crc, 'ZIP CRC ' + name)
    out[name] = data
    at += 46 + nl + el + cl
  }
  return out
}
// minimal well-formedness: every start tag is closed, in order
function checkXml(s, root) {
  s = String(s).replace(/<\?xml[^>]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
  const stack = []
  for (const m of s.matchAll(/<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g)) {
    if (m[1]) assert.equal(stack.pop(), m[2], 'closing tag ' + m[2])
    else if (!m[4]) stack.push(m[2])
  }
  assert.deepEqual(stack, [], 'unclosed tags')
  if (root) assert.match(s.trim(), new RegExp('^<' + root + '[\\s>]'))
}
function checkPdf(buf) {
  const s = buf.toString('latin1')
  assert.match(s, /^%PDF-1\.\d/)
  assert.match(s, /%%EOF\s*$/)
  const sx = +/startxref\s+(\d+)/.exec(s)[1]
  assert.equal(s.slice(sx, sx + 4), 'xref', 'startxref points at the xref table')
  // every xref entry points at "<n> 0 obj"
  const rows = s.slice(sx).split(/\r?\n/).slice(2).filter(l => /^\d{10} \d{5} n/.test(l))
  rows.forEach((l, i) => assert.match(s.slice(+l.slice(0, 10), +l.slice(0, 10) + 12), new RegExp('^' + (i + 1) + ' 0 obj')))
}
// JS / TS / JSX syntax check with esbuild when the monorepo has it (skipped otherwise)
let esbuild = null
try { esbuild = createRequire(path.join(here, '..', '..', 'mcp', 'package.json'))('esbuild') } catch { try { esbuild = createRequire(path.join(here, '..', '..', '..', 'package.json'))('esbuild') } catch { } }
function checkJs(src, loader) { if (esbuild) esbuild.transformSync(src, { loader }) }

// ---------------------------------------------------------------- vector
test('svg keeps currentColor and the colour variables; svg-flat bakes them', () => {
  const j = exp('heart', '--style', 'retro', '--format', 'svg,svg-flat')
  const svg = read(one(j, 'svg')).toString(), flat = read(one(j, 'svg-flat')).toString()
  checkXml(svg, 'svg'); checkXml(flat, 'svg')
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24"/)
  assert.match(svg, /var\(--with-retro-/)
  assert.match(svg, /<title>Heart<\/title>/)
  assert.doesNotMatch(flat, /var\(|currentColor/)
  assert.equal(one(j, 'svg').filename, 'heart-retro-themable.svg')
  assert.equal(one(j, 'svg-flat').filename, 'heart-retro.svg')
})
test('pdf and eps are valid vector files', () => {
  const j = exp('home', '--format', 'pdf,eps', '--size', '256')
  checkPdf(read(one(j, 'pdf')))
  const eps = read(one(j, 'eps')).toString('latin1')
  assert.match(eps, /^%!PS-Adobe-3\.0 EPSF-3\.0/)
  assert.match(eps, /%%BoundingBox: 0 0 256 256/)
  assert.match(eps, /%%EOF\s*$/)
})

// ---------------------------------------------------------------- images (resvg)
test('png at --size, transparent unless --background', { skip: !hasRenderer && 'no @resvg/resvg-js' }, () => {
  const a = read(one(exp('star', '--format', 'png', '--size', '64'), 'png'))
  assert.equal(checkPng(a, 64).color, 6)
  const b = exp('star', '--format', 'png', '--size', '64', '--background', '#ff0000')
  assert.equal(one(b, 'png').filename, 'star-line-64.png')
  checkPng(read(one(b, 'png')), 64)
  assert.notDeepEqual(read(one(b, 'png')), a)
})
test('png-set: @1x-@4x + README', { skip: !hasRenderer && 'no @resvg/resvg-js' }, () => {
  const z = unzip(read(one(exp('home', '--format', 'png-set', '--size', '20'), 'png-set')))
  assert.deepEqual(Object.keys(z), ['home-line.png', 'home-line@2x.png', 'home-line@3x.png', 'home-line@4x.png', 'README.txt'])
  ;[20, 40, 60, 80].forEach((s, i) => checkPng(z[Object.keys(z)[i]], s))
})
test('ico: 5 PNG entries (16-256)', { skip: !hasRenderer && 'no @resvg/resvg-js' }, () => {
  const b = read(one(exp('home', '--format', 'ico'), 'ico'))
  assert.equal(b.readUInt16LE(0), 0); assert.equal(b.readUInt16LE(2), 1)
  const count = b.readUInt16LE(4)
  assert.equal(count, 5)
  const sizes = []
  for (let i = 0; i < count; i++) {
    const e = 6 + 16 * i, len = b.readUInt32LE(e + 8), off = b.readUInt32LE(e + 12)
    sizes.push(checkPng(b.subarray(off, off + len)).w)
    assert.equal(b[e] || 256, sizes[i])
  }
  assert.deepEqual(sizes, [16, 32, 48, 64, 256])
})
test('favicon-pack: every file a site needs', { skip: !hasRenderer && 'no @resvg/resvg-js' }, () => {
  const z = unzip(read(one(exp('star', '--style', 'sticker', '--format', 'favicon-pack'), 'favicon-pack')))
  for (const k of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'site.webmanifest', 'README.txt']) assert.ok(z[k], k)
  checkPng(z['apple-touch-icon.png'], 180); checkPng(z['icon-192.png'], 192); checkPng(z['icon-maskable-512.png'], 512)
  checkXml(z['favicon.svg'].toString(), 'svg')
  assert.equal(JSON.parse(z['site.webmanifest']).icons.length, 3)
})

// ---------------------------------------------------------------- apps
test('android VectorDrawable and iOS imageset', () => {
  const j = exp('heart', '--style', 'retro', '--palette', 'classic-red', '--format', 'android,ios')
  const xml = read(one(j, 'android')).toString()
  checkXml(xml, 'vector')
  assert.equal(one(j, 'android').filename, 'ic_heart_retro.xml')
  assert.match(xml, /android:pathData="M/)
  assert.match(xml, /android:viewportWidth="24"/)
  const z = unzip(read(one(j, 'ios')))
  const contents = JSON.parse(z['heart-retro.imageset/Contents.json'])
  assert.equal(contents.properties['preserves-vector-representation'], true)
  assert.equal(contents.properties['template-rendering-intent'], 'original') // multi-colour
  checkPdf(z['heart-retro.imageset/heart-retro.pdf'])
  // one-colour icons tint like SF Symbols
  const t = unzip(read(one(exp('home', '--format', 'ios'), 'ios')))
  assert.equal(JSON.parse(t['home-line.imageset/Contents.json']).properties['template-rendering-intent'], 'template')
})

// ---------------------------------------------------------------- code
test('code formats: components that parse, snippets that decode', () => {
  const j = exp('bell', '--format', 'jsx,tsx,vue,svelte,react-native,angular,html,css,data-uri,base64')
  const src = f => read(one(j, f)).toString()
  assert.equal(one(j, 'jsx').filename, 'BellLineIcon.jsx')
  checkJs(src('jsx'), 'jsx'); checkJs(src('tsx'), 'tsx'); checkJs(src('react-native'), 'jsx'); checkJs(src('angular'), 'ts')
  assert.match(src('jsx'), /export default function BellLineIcon|export default BellLineIcon/)
  assert.match(src('tsx'), /SVGProps|: number|: string/)
  assert.match(src('vue'), /<template>[\s\S]*<svg[\s\S]*<\/template>/)
  assert.match(src('vue'), /<script setup/)
  assert.match(src('svelte'), /<svg[\s\S]*<\/svg>/)
  assert.match(src('react-native'), /react-native-svg/)
  assert.match(src('angular'), /@Component\(/)
  checkXml(src('html').replace(/<!--[\s\S]*?-->/g, ''), 'svg')
  assert.match(src('css'), /\.with-bell--line \{[\s\S]*url\("data:image\/svg\+xml,/)
  const uri = src('data-uri').trim()
  assert.match(uri, /^data:image\/svg\+xml,/)
  checkXml(decodeURIComponent(uri.slice(19)), 'svg')
  const b64 = src('base64').trim()
  assert.match(b64, /^data:image\/svg\+xml;base64,/)
  checkXml(Buffer.from(b64.slice(26), 'base64').toString(), 'svg')
})
test('--motion adds @withicons/motion to the code formats', () => {
  const plain = read(one(exp('bell', '--format', 'html'), 'html')).toString()
  assert.doesNotMatch(plain, /wm-loop/)
  const moving = read(one(exp('bell', '--format', 'html', '--motion', 'loop'), 'html')).toString()
  assert.match(moving, /class="wm wm-loop/)
  assert.match(moving, /motion\.css/)
  const jsx = read(one(exp('bell', '--format', 'jsx', '--motion', 'hover:shake'), 'jsx')).toString()
  assert.match(jsx, /wm-hover/); assert.match(jsx, /wm-p-shake/)
})

// ---------------------------------------------------------------- office (resvg for the PNG fallback)
test('pptx, pptx-sheet and docx are complete OOXML packages', { skip: !hasRenderer && 'no @resvg/resvg-js' }, () => {
  const j = exp('rocket', '--format', 'pptx,pptx-sheet,docx', '--style', 'kawaii')
  const p = unzip(read(one(j, 'pptx')))
  for (const k of ['[Content_Types].xml', '_rels/.rels', 'ppt/presentation.xml', 'ppt/slides/slide1.xml', 'ppt/media/image1.png', 'ppt/media/image1.svg']) assert.ok(p[k], k)
  for (const [k, v] of Object.entries(p)) if (/\.(xml|rels)$/.test(k)) checkXml(v.toString())
  checkPng(p['ppt/media/image1.png'])
  const sheet = unzip(read(one(j, 'pptx-sheet')))
  const styles = JSON.parse(text(run(['styles', '--json'])).stdout).styles.length
  assert.equal(Object.keys(sheet).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length, styles + 1)
  assert.equal(one(j, 'pptx-sheet').style, 'all')
  const d = unzip(read(one(j, 'docx')))
  for (const k of ['[Content_Types].xml', 'word/document.xml', 'word/media/image1.png', 'word/media/image1.svg']) assert.ok(d[k], k)
  checkXml(d['word/document.xml'].toString())
})

// ---------------------------------------------------------------- lottie
test('lottie and dotlottie follow the icon motion (--motion picks it)', () => {
  const j = exp('bell', '--format', 'lottie,dotlottie')
  const a = JSON.parse(read(one(j, 'lottie')))
  for (const k of ['v', 'fr', 'ip', 'op', 'w', 'h', 'layers']) assert.ok(k in a, k)
  assert.equal(a.w, 512)
  assert.ok(a.op > a.ip)
  assert.match(one(j, 'lottie').filename, /^bell-line-ring\.json$/)
  const z = unzip(read(one(j, 'dotlottie')))
  const m = JSON.parse(z['manifest.json'])
  assert.ok(z[`animations/${m.activeAnimationId}.json`])
  assert.equal(m.animations[0].loop, true)
  assert.equal(one(exp('bell', '--format', 'lottie', '--motion', 'hover'), 'lottie').filename, 'bell-line-ring-hover.json')
  assert.equal(one(exp('bell', '--format', 'lottie', '--motion', 'spin'), 'lottie').filename, 'bell-line-spin.json')
  const still = JSON.parse(read(one(exp('bell', '--format', 'lottie', '--motion', 'none', '--size', '128'), 'lottie')))
  assert.equal(still.w, 128)
  assert.equal(one(exp('bell', '--format', 'lottie', '--motion', 'none'), 'lottie').filename, 'bell-line-still.json')
})

// ---------------------------------------------------------------- options + errors
test('several icons, aliases, --all-styles, palettes, --format all', () => {
  const j = exp('home', 'delete', '--all-styles', '--format', 'svg-flat')
  const styles = JSON.parse(text(run(['styles', '--json'])).stdout).styles.map(s => s.name)
  assert.equal(j.count, styles.length * 2)
  assert.ok(j.files.some(f => f.filename === 'trash-pixel.svg'))
  const red = read(one(exp('heart', '--style', 'sticker', '--format', 'svg-flat', '--c1', '#123456'), 'svg-flat')).toString()
  assert.match(red, /#123456/)
  const pal = read(one(exp('heart', '--style', 'retro', '--format', 'svg', '--palette', 'classic-red'), 'svg')).toString()
  assert.notEqual(pal, read(one(exp('heart', '--style', 'retro', '--format', 'svg'), 'svg')).toString())
  if (hasRenderer) assert.equal(exp('home', '--format', 'all').count, 29)
})
test('--out - prints one file to stdout', () => {
  const r = text(run(['export', 'home', '--format', 'svg', '--out', '-']))
  assert.equal(r.status, 0)
  assert.match(r.stdout, /^<svg /)
  assert.equal(run(['export', 'home', '--format', 'svg,pdf', '--out', '-']).status, 2)
})
test('usage errors exit 2, unknown icons exit 1', () => {
  const r = text(run(['export', 'home', '--format', 'webm']))
  assert.equal(r.status, 2)
  assert.match(r.stderr, /browser/)
  assert.match(r.stderr, /gif, apng or pptx-animated/)
  assert.equal(run(['export', 'home', '--format', 'webp-animated']).status, 2)
  assert.equal(run(['export', 'home', '--format', 'nope']).status, 2)
  assert.equal(run(['export', 'home', '--background', 'tomato-ish']).status, 2)
  assert.equal(run(['export', 'home', '--motion', 'wobble']).status, 2)
  assert.equal(run(['export', 'home', '--padding', '2']).status, 2)
  assert.equal(run(['export']).status, 2)
  assert.equal(run(['export', 'setings']).status, 1)
  const j = JSON.parse(text(run(['export', 'heart', '--palette', 'nope', '--json'])).stdout)
  assert.equal(j.code, 'unknown_palette')
})
test('without @resvg/resvg-js: PNG formats explain how to install it, the rest still work', () => {
  const env = { WITHICONS_NO_RESVG: '1' }
  const r = text(run(['export', 'home', '--format', 'png'], env))
  assert.equal(r.status, 1)
  assert.match(r.stderr, /npm install --save-dev @resvg\/resvg-js/)
  const j = JSON.parse(text(run(['export', 'home', '--format', 'ico', '--json'], env)).stdout)
  assert.equal(j.code, 'missing_renderer')
  assert.equal(JSON.parse(text(run(['export', 'bell', '--format', 'gif', '--json'], env)).stdout).code, 'missing_renderer')
  // animated SVG needs no renderer (a fixed headroom instead of a measured one)
  const as = exp('bell', '--format', 'animated-svg')
  assert.match(read(one(as, 'animated-svg')).toString(), /@keyframes/)
  const ok = text(run(['export', 'home', '--format', 'svg,pdf,android,lottie', '--out', path.join(tmp, 'nr')], env))
  assert.equal(ok.status, 0, ok.stderr)
  assert.equal(fs.readdirSync(path.join(tmp, 'nr')).length, 4)
})
test('--help documents export', () => {
  const h = text(run(['--help'])).stdout
  assert.match(h, /withicons export <name\.\.\.>/)
  assert.match(h, /favicon-pack/)
  assert.match(h, /@resvg\/resvg-js/)
})

// ---------------------------------------------------------------- animated files (frames rendered in Node)
const R = { skip: !hasRenderer && 'no @resvg/resvg-js' }
test('gif: a valid looping GIF89a, every frame decodes, same motion as the site', R, () => {
  const j = exp('bell', '--format', 'gif', '--size', '96')
  const f = one(j, 'gif')
  assert.equal(f.filename, 'bell-line-ring.gif')
  assert.equal(f.mime, 'image/gif')
  const buf = read(f)
  assert.equal(buf.toString('latin1', 0, 6), 'GIF89a')
  const g = decodeGif(buf)
  assert.equal(g.width, 96); assert.equal(g.height, 96)
  assert.equal(g.loop, 0, 'NETSCAPE2.0 loops forever')
  assert.ok(g.frames.length >= 10, 'frames: ' + g.frames.length)
  // the delays add up to the bell's motion cycle (ring: 2.4 s at the default 25 fps)
  const total = g.frames.reduce((n, x) => n + x.delay, 0)
  assert.ok(Math.abs(total - 240) <= g.frames.length, 'loop length ' + total + ' cs')
  // it moves: not every frame is the same picture, and the first frame has the icon in it
  const key = x => Buffer.from(x.rgba.buffer).toString('base64')
  assert.ok(new Set(g.frames.map(key)).size > 5)
  assert.ok(g.frames[0].rgba.some((v, i) => i % 4 === 3 && v === 255))
})
test('gif options: --background is opaque, --fps / --seconds / --loop, --matte keeps it transparent', R, () => {
  const bg = decodeGif(read(one(exp('star', '--format', 'gif', '--size', '64', '--background', '#102030', '--fps', '10', '--seconds', '1.5', '--loop', '3', '--motion', 'spin'), 'gif')))
  assert.equal(bg.loop, 2, 'NETSCAPE repeat count = plays - 1')
  assert.ok(bg.frames.length <= 15)
  assert.equal(bg.frames.reduce((n, x) => n + x.delay, 0), 150)
  const p = bg.frames[0].rgba
  assert.deepEqual([p[0], p[1], p[2], p[3]], [0x10, 0x20, 0x30, 255], 'corner = background')
  const t = decodeGif(read(one(exp('star', '--format', 'gif', '--size', '64', '--matte', '#000000'), 'gif')))
  assert.equal(t.frames[0].rgba[3], 0, 'transparent corner')
  assert.equal(run(['export', 'star', '--format', 'gif', '--fps', '0']).status, 2)
  assert.equal(run(['export', 'star', '--format', 'gif', '--seconds', '99']).status, 2)
  assert.equal(run(['export', 'star', '--format', 'gif', '--matte', 'nope']).status, 2)
  // limits: too many frames is a usage error with a hint, not a crash
  const big = text(run(['export', 'star', '--format', 'gif', '--size', '1024', '--fps', '50', '--seconds', '30', '--json']))
  assert.equal(big.status, 2)
  assert.match(JSON.parse(big.stdout).error, /frames|pixels/)
})
test('apng: valid APNG (acTL / fcTL / fdAT), true alpha, loops', R, () => {
  const f = one(exp('heart', '--style', 'kawaii', '--format', 'apng', '--size', '80'), 'apng')
  assert.match(f.filename, /^heart-kawaii-.+\.apng\.png$/)
  const buf = read(f)
  checkPng(buf, 80)
  const a = decodeApng(buf)
  assert.equal(a.plays, 0)
  assert.equal(a.declared, a.frames.length)
  assert.ok(a.frames.length > 5)
  // soft (partly transparent) edge pixels survive, unlike GIF
  assert.ok(a.frames[0].rgba.some((v, i) => i % 4 === 3 && v > 0 && v < 255))
})
test('--motion swap records the icon turning into another one', R, () => {
  const j = exp('play', '--format', 'gif', '--motion', 'swap', '--to', 'pause', '--effect', 'morph', '--size', '64')
  assert.equal(one(j, 'gif').filename, 'play-line-to-pause.gif')
  const g = decodeGif(read(one(j, 'gif')))
  assert.ok(g.frames.length > 5)
  // default target: the icon's own suggestion
  assert.match(one(exp('play', '--format', 'gif', '--motion', 'swap', '--size', '48'), 'gif').filename, /^play-line-to-/)
  assert.equal(run(['export', 'play', '--format', 'gif', '--motion', 'swap', '--effect', 'wobble']).status, 2)
})
test('pptx-animated: a valid slide whose picture is the animated GIF (no SVG twin)', R, () => {
  const f = one(exp('rocket', '--style', 'luxe', '--format', 'pptx-animated', '--background', '#0f172a', '--size', '160'), 'pptx-animated')
  assert.equal(f.filename, 'rocket-luxe-animated.pptx')
  const p = unzip(read(f))
  for (const k of ['[Content_Types].xml', '_rels/.rels', 'ppt/presentation.xml', 'ppt/_rels/presentation.xml.rels', 'ppt/slides/slide1.xml',
    'ppt/slides/_rels/slide1.xml.rels', 'ppt/slideMasters/slideMaster1.xml', 'ppt/slideLayouts/slideLayout1.xml', 'ppt/theme/theme1.xml', 'ppt/media/image1.gif']) assert.ok(p[k], k)
  for (const [k, v] of Object.entries(p)) if (/\.(xml|rels)$/.test(k)) checkXml(v.toString())
  assert.ok(!Object.keys(p).some(k => /\.(png|svg)$/.test(k)), 'only the GIF')
  assert.match(p['[Content_Types].xml'].toString(), /<Default Extension="gif" ContentType="image\/gif"\/>/)
  // every relationship target exists, and the slide's picture points at the GIF
  for (const [k, v] of Object.entries(p)) {
    if (!/\.rels$/.test(k)) continue
    const base = k.replace(/_rels\/[^/]*\.rels$/, '')
    for (const m of v.toString().matchAll(/Target="([^"]+)"/g)) {
      const t = path.posix.normalize(path.posix.join(base, m[1]))
      assert.ok(p[t], `${k} -> ${t}`)
    }
  }
  const slide = p['ppt/slides/slide1.xml'].toString(), rels = p['ppt/slides/_rels/slide1.xml.rels'].toString()
  const rid = /<a:blip r:embed="(rId\d+)"\/>/.exec(slide)[1]
  assert.match(rels, new RegExp(`Id="${rid}" Type="[^"]+/image" Target="../media/image1.gif"`))
  assert.doesNotMatch(slide, /svgBlip/)
  assert.match(slide, /<p:bg><p:bgPr><a:solidFill><a:srgbClr val="0F172A"\/>/)
  const g = decodeGif(p['ppt/media/image1.gif'])
  assert.equal(g.width, 160)
  assert.ok(g.frames.length > 5)
  assert.equal(g.loop, 0)
})
test('pptx-sheet --motion: every style as an animated GIF', R, () => {
  const f = one(exp('heart', '--format', 'pptx-sheet', '--motion', 'beat', '--size', '64'), 'pptx-sheet')
  assert.equal(f.filename, 'heart-line-styles-animated.pptx')
  const p = unzip(read(f))
  const styles = JSON.parse(text(run(['styles', '--json'])).stdout).styles.length
  const gifs = Object.keys(p).filter(k => /^ppt\/media\/image\d+\.gif$/.test(k))
  assert.equal(gifs.length, styles)
  gifs.forEach(k => assert.ok(decodeGif(p[k]).frames.length > 3, k))
  assert.equal(Object.keys(p).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length, styles + 1)
})
test('animated-svg: keyframes inside, padding measured', R, () => {
  const s = read(one(exp('basketball', '--format', 'animated-svg', '--motion', 'bounce'), 'animated-svg')).toString()
  checkXml(s.replace(/<style>[\s\S]*?<\/style>/, ''))
  assert.match(s, /@keyframes/)
  assert.match(s, /viewBox="-/, 'headroom around the 24 grid')
})
