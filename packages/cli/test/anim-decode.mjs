// Test helpers: independent GIF and APNG decoders (full LZW / inflate + unfilter + compositing) and a tiny PNG writer,
// so the tests check that the animated files really decode, frame by frame, instead of only sniffing headers.
import zlib from 'node:zlib'

/** GIF89a -> { width, height, loop (NETSCAPE repeat count, 0 = forever, null = play once), frames: [{ rgba, delay (cs), disposal, box }] } */
export function decodeGif(buf) {
  let p = 0
  const u8 = () => buf[p++], u16 = () => { const v = buf[p] | buf[p + 1] << 8; p += 2; return v }
  const sig = buf.toString('latin1', 0, 6); p = 6
  if (sig !== 'GIF89a' && sig !== 'GIF87a') throw new Error('not a GIF')
  const W = u16(), H = u16(), flags = u8(); u8(); u8()
  let gct = null
  if (flags & 0x80) { const n = 2 << (flags & 7); gct = buf.subarray(p, p + 3 * n); p += 3 * n }
  const canvas = new Uint8ClampedArray(W * H * 4), frames = []
  let gce = { disposal: 0, delay: 0, tidx: -1 }, loop = null, ended = false
  while (p < buf.length) {
    const b = u8()
    if (b === 0x3b) { ended = true; break }
    if (b === 0x21) {
      const label = u8()
      if (label === 0xf9) { u8(); const f = u8(); const delay = u16(); const t = u8(); u8(); gce = { disposal: (f >> 2) & 7, delay, tidx: f & 1 ? t : -1 } }
      else if (label === 0xff) {
        const n = u8(); const id = buf.toString('latin1', p, p + n); p += n
        let s
        while ((s = u8())) { if (id === 'NETSCAPE2.0' && buf[p] === 1) loop = buf[p + 1] | buf[p + 2] << 8; p += s }
      } else { let s; while ((s = u8())) p += s }
      continue
    }
    if (b !== 0x2c) throw new Error('bad GIF block 0x' + b.toString(16) + ' at ' + (p - 1))
    const x = u16(), y = u16(), w = u16(), h = u16(), f = u8()
    let ct = gct
    if (f & 0x80) { const n = 2 << (f & 7); ct = buf.subarray(p, p + 3 * n); p += 3 * n }
    if (f & 0x40) throw new Error('interlaced GIF frames are not expected')
    if (x + w > W || y + h > H) throw new Error('frame outside the canvas')
    const min = u8(), chunks = []
    let s
    while ((s = u8())) { chunks.push(buf.subarray(p, p + s)); p += s }
    const data = Buffer.concat(chunks), out = new Uint8Array(w * h)
    const clear = 1 << min, eoi = clear + 1
    let size = min + 1, dict, prev = null, bit = 0, o = 0
    const reset = () => { dict = []; for (let i = 0; i < clear; i++) dict[i] = [i]; dict[clear] = []; dict[eoi] = null; size = min + 1; prev = null }
    reset()
    for (;;) {
      if (bit + size > data.length * 8) throw new Error('LZW stream ended without EOI')
      let code = 0
      for (let i = 0; i < size; i++) code |= ((data[(bit + i) >> 3] >> ((bit + i) & 7)) & 1) << i
      bit += size
      if (code === clear) { reset(); continue }
      if (code === eoi) break
      let entry
      if (code < dict.length && dict[code]) entry = dict[code]
      else if (code === dict.length && prev) entry = prev.concat(prev[0])
      else throw new Error('bad LZW code ' + code)
      for (const v of entry) { if (o >= out.length) throw new Error('too many pixels in a frame'); out[o++] = v }
      if (prev && dict.length < 4096) { dict.push(prev.concat(entry[0])); if (dict.length === (1 << size) && size < 12) size++ }
      prev = entry
    }
    if (o !== w * h) throw new Error(`frame has ${o} pixels, expected ${w * h}`)
    const before = gce.disposal === 3 ? canvas.slice() : null
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const idx = out[yy * w + xx]
      if (idx === gce.tidx) continue
      if (idx * 3 + 2 >= ct.length) throw new Error('palette index out of range')
      const j = ((y + yy) * W + x + xx) * 4
      canvas[j] = ct[idx * 3]; canvas[j + 1] = ct[idx * 3 + 1]; canvas[j + 2] = ct[idx * 3 + 2]; canvas[j + 3] = 255
    }
    frames.push({ rgba: canvas.slice(), delay: gce.delay, disposal: gce.disposal, box: [x, y, w, h] })
    if (gce.disposal === 2) for (let yy = 0; yy < h; yy++) canvas.fill(0, ((y + yy) * W + x) * 4, ((y + yy) * W + x + w) * 4)
    if (before) canvas.set(before)
    gce = { disposal: 0, delay: 0, tidx: -1 }
  }
  if (!ended) throw new Error('GIF has no trailer')
  return { width: W, height: H, frames, loop }
}

/** PNG / APNG -> { width, height, plays (null for a still PNG), declared (acTL frame count), frames: [{ rgba, delay (s) }] } */
export function decodeApng(buf) {
  let at = 8, ihdr = null, actl = null, cur = null
  const frames = [], idat = []
  while (at < buf.length) {
    const len = buf.readUInt32BE(at), type = buf.toString('latin1', at + 4, at + 8), body = buf.subarray(at + 8, at + 8 + len)
    if (type === 'IHDR') ihdr = { w: body.readUInt32BE(0), h: body.readUInt32BE(4), color: body[9] }
    if (type === 'acTL') actl = { frames: body.readUInt32BE(0), plays: body.readUInt32BE(4) }
    if (type === 'fcTL') { if (cur) frames.push(cur); cur = { w: body.readUInt32BE(4), h: body.readUInt32BE(8), x: body.readUInt32BE(12), y: body.readUInt32BE(16), num: body.readUInt16BE(20), den: body.readUInt16BE(22), data: [] } }
    if (type === 'IDAT') (cur || { data: idat }).data.push(body)
    if (type === 'fdAT') cur.data.push(body.subarray(4))
    at += 12 + len
    if (type === 'IEND') break
  }
  if (cur) frames.push(cur)
  if (!frames.length) frames.push({ w: ihdr.w, h: ihdr.h, x: 0, y: 0, num: 1, den: 1, data: idat })
  const bpp = ihdr.color === 6 ? 4 : 3
  const full = new Uint8ClampedArray(ihdr.w * ihdr.h * 4), out = []
  for (const f of frames) {
    const raw = zlib.inflateSync(Buffer.concat(f.data)), rl = f.w * bpp
    if (raw.length !== (rl + 1) * f.h) throw new Error('APNG frame data length')
    let prev = new Uint8Array(rl)
    for (let y = 0; y < f.h; y++) {
      const ft = raw[y * (rl + 1)], line = Uint8Array.from(raw.subarray(y * (rl + 1) + 1, (y + 1) * (rl + 1)))
      if (ft > 4) throw new Error('bad PNG filter ' + ft)
      for (let i = 0; i < rl; i++) {
        const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0
        let pr = 0
        if (ft === 1) pr = a; else if (ft === 2) pr = b; else if (ft === 3) pr = (a + b) >> 1
        else if (ft === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
        line[i] = (line[i] + pr) & 255
      }
      for (let x = 0; x < f.w; x++) {
        const j = ((f.y + y) * ihdr.w + f.x + x) * 4
        full[j] = line[x * bpp]; full[j + 1] = line[x * bpp + 1]; full[j + 2] = line[x * bpp + 2]; full[j + 3] = bpp === 4 ? line[x * bpp + 3] : 255
      }
      prev = line
    }
    out.push({ rgba: full.slice(), delay: f.num / (f.den || 100) })
  }
  return { width: ihdr.w, height: ihdr.h, frames: out, plays: actl ? actl.plays : null, declared: actl ? actl.frames : 1 }
}

const CRC = (() => { const t = new Uint32Array(256); for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[i] = c >>> 0 } return t })()
const crc32 = b => { let c = 0xFFFFFFFF; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }
/** RGBA -> PNG bytes (for contact sheets) */
export function writePng(rgba, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1)
  const chunk = (t, d) => { const b = Buffer.alloc(12 + d.length); b.writeUInt32BE(d.length); b.write(t, 4, 'latin1'); d.copy(b, 8); b.writeUInt32BE(crc32(b.subarray(4, 8 + d.length)), 8 + d.length); return b }
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}
