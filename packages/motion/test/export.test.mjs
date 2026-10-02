import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const X = await load('export.js')
const { PRESETS, EFFECTS } = await load('index.js')
const LINE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 12h16"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>'
const SOLID = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>'

test('animatedSvg: every preset yields one literal, scoped keyframes block (glow / twinkle: plus the halo)', () => {
  for (const p of PRESETS) {
    const s = X.animatedSvg(SOLID, { preset: p })
    assert.equal((s.match(/@keyframes/g) || []).length, ['glow', 'twinkle'].includes(p) ? 2 : 1, p)
    assert.ok(!/var\(--_/.test(s), `${p}: no unresolved internal variables`)
    assert.ok(!/NaN|undefined/.test(s), p)
    const id = /class="(wm[a-z0-9]+)"/.exec(s)[1]
    assert.ok(s.includes(`@keyframes ${id}-${p}{`), p)
    assert.ok(s.includes(`<g class="${id}-g">`), p)
    assert.ok(!s.includes('color-mix') && !/filter:/.test(s), `${p}: no CSS filter on SVG children (Safari ignores it)`)
  }
})

test('animatedSvg: deterministic, uses the icon spec, honours options', () => {
  assert.equal(X.animatedSvg(LINE, { name: 'bell' }), X.animatedSvg(LINE, { name: 'bell' }))
  const bell = X.animatedSvg(LINE, { name: 'bell' })
  assert.match(bell, /-ring\{/)
  assert.match(bell, /animation:wm\w+-ring 2\.4s linear 0s infinite both/)
  const hover = X.animatedSvg(LINE, { name: 'bell', trigger: 'hover' })
  assert.match(hover, /:hover \.wm\w+-g\{animation:wm\w+-ring 1\.4s/)
  const custom = X.animatedSvg(LINE, { preset: 'spin', duration: 3, steps: 6, size: 64, color: '#f00' })
  assert.match(custom, /3s steps\(6\)/)
  assert.match(custom, /width="64" height="64"/)
  assert.match(custom, /color="#f00"/)
  const frozen = X.frameSvg(LINE, { preset: 'pulse' }, 0.5)
  assert.match(frozen, /-0\.5s infinite both;animation-play-state:paused/)
  assert.ok(!frozen.includes('prefers-reduced-motion'))
})

test('animatedSvg: draw marks strokes on stroked styles and falls back to pop on filled ones', () => {
  const d = X.animatedSvg(LINE, { preset: 'draw' })
  assert.match(d, /<path d="M4 12h16" pathLength="1" data-wm-pl=""\/>/)
  assert.match(d, /<circle [^>]*data-wm-fill=""\/>/)
  assert.match(d, /stroke-dasharray:1 1\.5/)
  const f = X.animatedSvg(SOLID, { preset: 'draw' })
  assert.ok(!f.includes('pathLength'))
  assert.match(f, /@keyframes wm\w+-draw\{/)
})

test('animatedSwapSvg: both icons, effect keyframes, clip for slides', () => {
  for (const e of EFFECTS) {
    const s = X.animatedSvg(LINE, { swapTo: SOLID, effect: e })
    assert.equal((s.match(/@keyframes/g) || []).length, 2, e)
    assert.ok(s.includes('M4 12h16') && s.includes('M4 4h16v16H4z'), e)
    assert.equal(s.includes('clipPath'), e.startsWith('slide-'), e)
  }
  // root presentation attributes travel with each icon
  const s = X.animatedSwapSvg(LINE, SOLID, { effect: 'flip' })
  assert.match(s, /-a" fill="none" stroke="currentColor"/)
  assert.match(s, /-b" fill="currentColor" opacity="0"/)
  // B is hidden without CSS (static renderers show A alone); the keyframes still animate it
  assert.ok(!/-a"[^>]*opacity=/.test(s))
  assert.ok(!/\.wm\w+-b\{opacity:0\}/.test(s))
})

test('resolveMotion and exportDuration', () => {
  const r = X.resolveMotion({ name: 'arrow-up-right' })
  assert.equal(r.preset, 'nudge'); assert.equal(r.dir, 315)
  assert.equal(X.resolveMotion({ name: 'arrow-up-right', preset: 'pass' }).dir, 315)
  assert.equal(X.exportDuration({ preset: 'spin' }), 1.2)
  assert.equal(X.exportDuration({ preset: 'pop', trigger: 'once' }), 0.8)
  assert.equal(X.exportDuration({ swapTo: SOLID, cycle: 3 }), 3)
  assert.throws(() => X.parseSvg('<div/>'))
})

// decode a GIF's LZW stream to check the encoder round-trips
function decodeFirstFrame(bytes) {
  let p = 13 + 256 * 3
  const frames = []
  while (p < bytes.length) {
    const b = bytes[p]
    if (b === 0x3b) break
    if (b === 0x21) { p += 2; while (bytes[p]) p += bytes[p] + 1; p++; continue }
    if (b === 0x2c) {
      const w = bytes[p + 5] | bytes[p + 6] << 8, h = bytes[p + 7] | bytes[p + 8] << 8
      p += 10
      const min = bytes[p++]
      const data = []
      while (bytes[p]) { const n = bytes[p++]; for (let i = 0; i < n; i++) data.push(bytes[p++]) }
      p++
      const clear = 1 << min, eoi = clear + 1
      let size = min + 1, dict = [], prev = null, bit = 0
      const out = []
      const reset = () => { dict = []; for (let i = 0; i < clear; i++) dict[i] = [i]; dict[clear] = []; dict[eoi] = []; size = min + 1; prev = null }
      reset()
      for (;;) {
        let code = 0
        for (let i = 0; i < size; i++, bit++) code |= ((data[bit >> 3] >> (bit & 7)) & 1) << i
        if (code === clear) { reset(); continue }
        if (code === eoi) break
        let entry
        if (code < dict.length) entry = dict[code]
        else entry = prev.concat(prev[0])
        out.push(...entry)
        if (prev) dict.push(prev.concat(entry[0]))
        prev = entry
        if (dict.length === (1 << size) && size < 12) size++
      }
      frames.push({ w, h, out })
    } else p++
  }
  return frames
}

test('encodeGif: valid GIF89a that round-trips through LZW', () => {
  const w = 40, h = 30
  const mk = shift => {
    const data = new Uint8ClampedArray(w * h * 4)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const on = ((x + shift) >> 2) % 3
      data[i] = on * 100; data[i + 1] = 40; data[i + 2] = 255 - on * 80; data[i + 3] = x < 3 ? 0 : 255
    }
    return { width: w, height: h, data }
  }
  const frames = [mk(0), mk(5), mk(9)]
  const g = X.encodeGif(frames, { delay: 40 })
  assert.equal(String.fromCharCode(...g.slice(0, 6)), 'GIF89a')
  assert.equal(g[g.length - 1], 0x3b)
  const dec = decodeFirstFrame(g)
  assert.equal(dec.length, 3)
  const pal = []
  for (let i = 0; i < 256; i++) pal.push([g[13 + i * 3], g[14 + i * 3], g[15 + i * 3]])
  for (let f = 0; f < 3; f++) {
    assert.equal(dec[f].out.length, w * h)
    const src = frames[f].data
    for (let j = 0; j < w * h; j += 7) {
      const idx = dec[f].out[j]
      if (src[j * 4 + 3] < 128) { assert.equal(idx, 3, 'transparent index'); continue }
      const c = pal[idx]
      assert.ok(Math.abs(c[0] - src[j * 4]) <= 8 && Math.abs(c[2] - src[j * 4 + 2]) <= 8, `pixel ${j} colour`)
    }
  }
})

test('encodeGif: large noisy frames exercise LZW table resets', () => {
  const w = 160, h = 160
  let seed = 7
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < data.length; i += 4) { data[i] = rnd() * 255; data[i + 1] = rnd() * 255; data[i + 2] = rnd() * 255; data[i + 3] = 255 }
  const g = X.encodeGif([{ width: w, height: h, data }])
  const [f] = decodeFirstFrame(g)
  assert.equal(f.out.length, w * h)
})

test('animatedSvg: glow / twinkle halo is an SVG filter on a <use> copy, hidden at rest', () => {
  for (const p of ['glow', 'twinkle']) {
    const s = X.animatedSvg(LINE, { preset: p, amount: 1.5 })
    const id = /class="(wm[a-z0-9]+)"/.exec(s)[1]
    assert.ok(s.includes(`<filter id="${id}-f"`), p)
    assert.ok(s.includes(`<use href="#${id}-i" xlink:href="#${id}-i" class="${id}-h" filter="url(#${id}-f)" opacity="0"/><g id="${id}-i">`), p)
    assert.ok(s.includes('xmlns:xlink="http://www.w3.org/1999/xlink"'))
    assert.ok(s.includes(`@keyframes ${id}-h{0%{opacity:0`), p)
    assert.match(s, /flood-color:var\(--wm-glow, currentColor\)/)
    assert.match(s, p === 'glow' ? /stdDeviation="3\.6"/ : /stdDeviation="3\.36"/, 'outer blur scales with amount')
  }
  const hover = X.animatedSvg(LINE, { preset: 'glow', trigger: 'hover' })
  assert.match(hover, /:hover \.wm\w+-h\{animation:/)
})

test('exports clamp flicker to its flash-safe minimum', () => {
  assert.equal(X.resolveMotion({ preset: 'flicker', duration: 0.4 }).duration, 1.2)
  assert.equal(X.resolveMotion({ preset: 'flicker', duration: 3 }).duration, 3)
  assert.equal(X.resolveMotion({ preset: 'pop', duration: 0.2 }).duration, 0.2)
  assert.match(X.animatedSvg(SOLID, { preset: 'flicker', duration: 0.3 }), /animation:wm\w+-flicker 1\.2s /)
})

test('video export API: video() + webm() exist', () => {
  assert.equal(typeof X.video, 'function')
  assert.equal(typeof X.webm, 'function')
})
