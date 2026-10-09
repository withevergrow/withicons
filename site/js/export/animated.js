/* with icons — animated exports: gif, apng, webp-animated, webm, mp4, animated-svg, png-sequence
 * (classic script + CommonJS/UMD, dependency-free).
 *
 * Browser: registers itself on window.WithExport (load registry.js first). The motion runtime
 * (site/vendor/motion/motion.js = window.WithMotion) draws every frame; if it is not on the page it is loaded on demand
 * from next to this script. Frames are the exact CSS animation: WithMotion.frameSvg() freezes the icon's own keyframes
 * (same data as motion.css) at time t with a negative, paused animation-delay, and the browser rasterizes that SVG.
 *
 * Node: require('./animated.js') -> { register(WithExport, env?), encodeGif, encodeApng, muxWebp, fixWebmDuration, ... }
 * The encoders are pure functions over RGBA frames, so they can be tested (and reused) without a browser.
 * register(WithExport, env) with env = { motion: WithMotion-like { frameSvg, exportDuration, resolveMotion, animatedSvg },
 * raster: (svg, px, background) -> RGBA Uint8Array (or a Promise of one; straight alpha, px x px) } makes gif and apng
 * run without a DOM: the same frame sampling, padding measurement and encoders, with frames drawn by the injected
 * rasteriser (the withicons CLI: resvg, after freezing the paused CSS keyframes into attributes). In a browser no env is
 * given and nothing changes: the motion runtime is loaded on demand and frames are drawn by <img> + canvas.
 *
 * Frame list format used by the encoders: [{ data: Uint8ClampedArray RGBA, width, height, t0, t1 }] (t in seconds;
 * a frame is shown from t0 to t1). Identical consecutive frames are merged (longer delay) before encoding.
 *
 * Swaps ("Turn into"): with ctx.swap = { name, style, title, inner, root, color, vars, effect, duration, ease, delay, hold,
 * cycle, trigger } (the editor's exportCtx()), every animated format records Before turning into After and back, each
 * with its own drawing, style and colours, timed like the page: one transition = duration, a rest of `hold` on each
 * icon, so one loop = 2 x (duration + hold); ease is the incoming icon's easing. Without ctx.swap, ctx.motion.swapTo
 * ("name" / "name@style" / an <svg> string) still works, in Before's colours and the effect's default timing.
 */
(function (root, factory) {
  var mod = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = mod
  else if (root.WithExport && root.WithExport.register) mod.register(root.WithExport)
  else if (root.addEventListener) root.addEventListener('DOMContentLoaded', function () { if (root.WithExport && root.WithExport.register) mod.register(root.WithExport) })
})(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict'
  // where this script lives (to load the motion runtime / style data on demand); captured while the script runs
  var BASE = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || ''

  /* ───────────────────────── bytes ───────────────────────── */
  function Writer(n) { this.buf = new Uint8Array(n || 65536); this.len = 0 }
  Writer.prototype.room = function (k) {
    if (this.len + k <= this.buf.length) return
    var b = new Uint8Array(Math.max(this.buf.length * 2, this.len + k)); b.set(this.buf.subarray(0, this.len)); this.buf = b
  }
  Writer.prototype.u8 = function (v) { this.room(1); this.buf[this.len++] = v & 255; return this }
  Writer.prototype.u16 = function (v) { this.room(2); this.buf[this.len++] = v & 255; this.buf[this.len++] = (v >>> 8) & 255; return this }
  Writer.prototype.u24 = function (v) { this.room(3); this.buf[this.len++] = v & 255; this.buf[this.len++] = (v >>> 8) & 255; this.buf[this.len++] = (v >>> 16) & 255; return this }
  Writer.prototype.u32 = function (v) { this.u16(v & 0xffff); return this.u16((v >>> 16) & 0xffff) }
  Writer.prototype.u32be = function (v) { this.room(4); var b = this.buf, i = this.len; b[i] = (v >>> 24) & 255; b[i + 1] = (v >>> 16) & 255; b[i + 2] = (v >>> 8) & 255; b[i + 3] = v & 255; this.len += 4; return this }
  Writer.prototype.u16be = function (v) { return this.u8(v >>> 8).u8(v) }
  Writer.prototype.str = function (s) { for (var i = 0; i < s.length; i++) this.u8(s.charCodeAt(i)); return this }
  Writer.prototype.bytes = function (a) { this.room(a.length); this.buf.set(a, this.len); this.len += a.length; return this }
  Writer.prototype.out = function () { return this.buf.slice(0, this.len) }

  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
  function crc32(a, c) { c = c === undefined ? 0xFFFFFFFF : c; for (var i = 0; i < a.length; i++) c = CRC[(c ^ a[i]) & 255] ^ (c >>> 8); return c }
  function adler32(a) { var s1 = 1, s2 = 0; for (var i = 0; i < a.length;) { var n = Math.min(3800, a.length - i); for (; n--; i++) { s1 += a[i]; s2 += s1 } s1 %= 65521; s2 %= 65521 } return ((s2 << 16) | s1) >>> 0 }
  var ascii = function (s) { var a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a }

  function hexRgb(h, def) {
    var m = /^#?([0-9a-f]{3,8})$/i.exec(String(h || '').trim())
    if (!m) return def || [255, 255, 255]
    var s = m[1]
    if (s.length === 3 || s.length === 4) s = s.replace(/./g, function (c) { return c + c })
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
  }

  /* ───────────────────────── frames ───────────────────────── */
  function sameData(a, b) {
    if (a.length !== b.length) return false
    var A = new Uint32Array(a.buffer, a.byteOffset, a.length >> 2), B = new Uint32Array(b.buffer, b.byteOffset, b.length >> 2)
    for (var i = 0; i < A.length; i++) if (A[i] !== B[i]) return false
    return true
  }
  // merge identical consecutive frames into one longer frame
  function dedupe(frames) {
    var out = []
    frames.forEach(function (f) {
      var last = out[out.length - 1]
      if (last && sameData(last.data, f.data)) last.t1 = f.t1
      else out.push({ data: f.data, width: f.width, height: f.height, t0: f.t0, t1: f.t1 })
    })
    return out
  }
  // bounding box of pixels that differ between two RGBA frames (null when equal)
  function diffBox(a, b, w, h) {
    var A = new Uint32Array(a.buffer, a.byteOffset, w * h), B = new Uint32Array(b.buffer, b.byteOffset, w * h)
    var x0 = w, y0 = h, x1 = -1, y1 = -1
    for (var y = 0; y < h; y++) {
      var r = y * w
      for (var x = 0; x < w; x++) if (A[r + x] !== B[r + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y }
    }
    return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
  }

  /* ───────────────────────── GIF ─────────────────────────
   * GIF89a, global palette, infinite loop (NETSCAPE2.0). Transparency is 1-bit: pixels under 50% alpha become the
   * transparent index; partly transparent edge pixels are blended over a matte colour (pick the colour of the page
   * the GIF will sit on for perfectly clean edges). Palette: every colour exactly when there are <= 256; otherwise the
   * dominant flat colours (the ones a palette style is painted with) are kept exact and the rest (anti-aliasing,
   * gradients) are median-cut. No dithering: flat icon colours stay flat and the file stays small. */
  function quantize(hist, max) {
    var entries = []
    hist.forEach(function (n, key) { entries.push([key, n]) })
    entries.sort(function (a, b) { return b[1] - a[1] || a[0] - b[0] })
    if (entries.length <= max) return entries.map(function (e) { return e[0] })
    var total = 0
    entries.forEach(function (e) { total += e[1] })
    var anchors = []
    for (var i = 0; i < entries.length && anchors.length < (max >> 1); i++) {
      if (entries[i][1] < total * 0.002) break
      anchors.push(entries[i][0])
    }
    var rest = entries.slice(anchors.length).map(function (e) { return [e[0] >> 16 & 255, e[0] >> 8 & 255, e[0] & 255, e[1]] })
    return anchors.concat(medianCut(rest, max - anchors.length))
  }
  function boxOf(items) {
    var lo = [255, 255, 255], hi = [0, 0, 0], w = 0
    items.forEach(function (it) { for (var c = 0; c < 3; c++) { if (it[c] < lo[c]) lo[c] = it[c]; if (it[c] > hi[c]) hi[c] = it[c] } w += it[3] })
    var r = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]], axis = r[1] >= r[0] && r[1] >= r[2] ? 1 : r[0] >= r[2] ? 0 : 2
    return { items: items, w: w, axis: axis, range: r[axis] }
  }
  function medianCut(items, k) {
    if (k <= 0 || !items.length) return []
    var boxes = [boxOf(items)]
    while (boxes.length < k) {
      var best = -1, score = 0
      for (var i = 0; i < boxes.length; i++) {
        var s = boxes[i].items.length > 1 ? boxes[i].range * Math.sqrt(boxes[i].w) : 0
        if (s > score) { score = s; best = i }
      }
      if (best < 0) break
      var b = boxes[best], ax = b.axis
      b.items.sort(function (p, q) { return p[ax] - q[ax] || p[0] - q[0] || p[1] - q[1] || p[2] - q[2] })
      var half = b.w / 2, acc = 0, m = 1
      for (var j = 0; j < b.items.length - 1; j++) { acc += b.items[j][3]; if (acc >= half) { m = j + 1; break } m = j + 1 }
      boxes.splice(best, 1, boxOf(b.items.slice(0, m)), boxOf(b.items.slice(m)))
    }
    return boxes.map(function (bx) {
      var r = 0, g = 0, bl = 0
      bx.items.forEach(function (it) { r += it[0] * it[3]; g += it[1] * it[3]; bl += it[2] * it[3] })
      return Math.round(r / bx.w) << 16 | Math.round(g / bx.w) << 8 | Math.round(bl / bx.w)
    })
  }
  function lzw(idx, minSize, w) {
    var clear = 1 << minSize, eoi = clear + 1, size = minSize + 1, next = eoi + 1
    var table = new Map(), bits = new Writer(idx.length + 64), cur = 0, shift = 0
    var emit = function (code) { cur |= code << shift; shift += size; while (shift >= 8) { bits.u8(cur & 255); cur >>>= 8; shift -= 8 } }
    emit(clear)
    var prefix = idx[0]
    for (var i = 1; i < idx.length; i++) {
      var k = idx[i], key = prefix * 256 + k, code = table.get(key)
      if (code !== undefined) { prefix = code; continue }
      emit(prefix)
      if (next === 4096) { emit(clear); next = eoi + 1; size = minSize + 1; table = new Map() }
      else { if (next >= (1 << size)) size++; table.set(key, next++) }
      prefix = k
    }
    emit(prefix); emit(eoi)
    if (shift > 0) bits.u8(cur & 255)
    var data = bits.out()
    w.u8(minSize)
    for (var j = 0; j < data.length; j += 255) { var n = Math.min(255, data.length - j); w.u8(n); w.bytes(data.subarray(j, j + n)) }
    w.u8(0)
  }
  // nearest palette index for a 0xRRGGBB colour (exact hits are a map lookup; the rest are weighted by how the eye sees them)
  function nearestOf(pal) {
    var lut = new Map()
    pal.forEach(function (c, i) { lut.set(c, i) })
    return function (c) {
      var v = lut.get(c)
      if (v !== undefined) return v
      var r = c >> 16 & 255, g = c >> 8 & 255, b = c & 255, best = 0, bd = Infinity
      for (var i = 0; i < pal.length; i++) {
        var q = pal[i], dr = (q >> 16 & 255) - r, dg = (q >> 8 & 255) - g, db = (q & 255) - b
        var rm = ((q >> 16 & 255) + r) / 2, d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db
        if (d < bd) { bd = d; best = i }
      }
      lut.set(c, best)
      return best
    }
  }
  function tableBits(n) { var b = 1; while ((1 << b) < n) b++; return b }
  function writeTable(w, pal, bits) { for (var i = 0; i < (1 << bits); i++) { var c = i < pal.length ? pal[i] : 0; w.u8(c >> 16 & 255).u8(c >> 8 & 255).u8(c & 255) } }
  /**
   * frames -> Uint8Array GIF.
   * o: { matte: '#hex' (default white), loop: 0 = forever (default) | n plays,
   *      colors: most colours per frame (2-256, default 256), local: true = a palette per frame when the animation has
   *      more colours than one palette holds (gradients, glass, gloss), release: true = free each frame's RGBA as it goes }
   * One palette index is always kept free as the transparent index: see-through pixels, and (for opaque files) pixels
   * that did not change since the previous frame, so each frame only sends what moved and LZW packs the rest into runs.
   */
  function encodeGif(frames, o) {
    o = o || {}
    frames = dedupe(frames)
    var W = frames[0].width, H = frames[0].height, N = W * H
    var matte = hexRgb(o.matte, [255, 255, 255])
    var cap = Math.max(2, Math.min(256, Math.round(Number(o.colors) || 256)))
    var transparent = false
    // 1. composite: -1 = transparent, else 0xRRGGBB (edge pixels blended over the matte)
    var keys = frames.map(function (f) {
      var p = f.data, k = new Int32Array(N)
      if (o.release) f.data = null   // the caller hands the frames over: keep one copy of each in memory, not two
      for (var i = 0, j = 0; j < N; i += 4, j++) {
        var a = p[i + 3]
        if (a < 128) { k[j] = -1; transparent = true; continue }
        if (a === 255) { k[j] = p[i] << 16 | p[i + 1] << 8 | p[i + 2]; continue }
        var t = a / 255, u = 1 - t
        k[j] = Math.round(p[i] * t + matte[0] * u) << 16 | Math.round(p[i + 1] * t + matte[1] * u) << 8 | Math.round(p[i + 2] * t + matte[2] * u)
      }
      return k
    })
    // 2. the global palette (cap - 1 colours: one index stays free for transparency)
    var hist = new Map()
    keys.forEach(function (k) { for (var j = 0; j < N; j++) { var c = k[j]; if (c >= 0) hist.set(c, (hist.get(c) || 0) + 1) } })
    var gpal = quantize(hist, cap - 1)
    if (!gpal.length) gpal.push(0)
    var local = !!o.local && hist.size > cap - 1
    var gbits = tableBits(gpal.length + 1), gT = gpal.length, gnear = nearestOf(gpal)
    // 3. stream
    var w = new Writer(N * frames.length / 3 + 2048)
    w.str('GIF89a').u16(W).u16(H).u8(0x80 | 0x70 | (gbits - 1)).u8(transparent ? gT : 0).u8(0)
    writeTable(w, gpal, gbits)
    var loop = o.loop == null ? 0 : o.loop
    if (loop !== 1) w.u8(0x21).u8(0xff).u8(11).str('NETSCAPE2.0').u8(3).u8(1).u16(loop > 1 ? loop - 1 : 0).u8(0)
    var prev = null, clock = 0
    frames.forEach(function (f, fi) {
      var k = keys[fi], box
      if (transparent) {
        // every frame is drawn on a cleared canvas (disposal 2), so it only needs its own opaque area
        var x0 = W, y0 = H, x1 = -1, y1 = -1
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (k[y * W + x] >= 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y }
        box = x1 < 0 ? { x: 0, y: 0, w: 1, h: 1 } : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
      } else {
        // opaque: keep the previous frame (disposal 1) and only send the rectangle that changed
        box = prev ? diffBox(new Uint8Array(prev.buffer), new Uint8Array(k.buffer), W, H) || { x: 0, y: 0, w: 1, h: 1 } : { x: 0, y: 0, w: W, h: H }
      }
      // what this frame sends: -1 = the transparent index (see-through, or the same as the frame already showing)
      var px = new Int32Array(box.w * box.h), any = false
      for (var yy = 0, n = 0; yy < box.h; yy++) {
        var row = (box.y + yy) * W + box.x
        for (var xx = 0; xx < box.w; xx++, n++) {
          var cc = k[row + xx]
          if (!transparent && prev && prev[row + xx] === cc) cc = -1
          if (cc < 0) any = true
          px[n] = cc
        }
      }
      var pal = gpal, near = gnear, bits = gbits, tI = gT
      if (local) {
        var fh = new Map()
        for (var q = 0; q < px.length; q++) if (px[q] >= 0) fh.set(px[q], (fh.get(px[q]) || 0) + 1)
        pal = quantize(fh, cap - 1); if (!pal.length) pal.push(0)
        near = nearestOf(pal); bits = tableBits(pal.length + 1); tI = pal.length
      }
      // delays come from a running clock in hundredths, so rounding never drifts over the loop (2 is the shortest every
      // viewer honours; browsers slow 0 and 1 down to a tenth of a second)
      var end = Math.round(f.t1 * 100), delay = Math.max(2, end - clock); clock += delay
      w.u8(0x21).u8(0xf9).u8(4).u8((transparent ? 2 : 1) << 2 | (transparent || any ? 1 : 0)).u16(delay).u8(tI).u8(0)
      w.u8(0x2c).u16(box.x).u16(box.y).u16(box.w).u16(box.h).u8(local ? 0x80 | (bits - 1) : 0)
      if (local) writeTable(w, pal, bits)
      var idx = new Uint8Array(px.length)
      for (var m = 0; m < px.length; m++) idx[m] = px[m] < 0 ? tI : near(px[m])
      lzw(idx, Math.max(2, bits), w)
      prev = k
    })
    w.u8(0x3b)
    return w.out()
  }
  // GIF quality levels (the studio's Quality control, the free pages and the CLI): frames a second, colours, supersampling
  var GIF_QUALITY = {
    light: { fps: 15, colors: 128, label: 'Light' },
    standard: { fps: 25, label: 'Standard' },
    smooth: { fps: 50, label: 'Smooth' },
    best: { fps: 50, ss: 2, local: true, label: 'Best' }
  }

  /* ───────────────────────── PNG / APNG ───────────────────────── */
  function zlib(raw) {
    if (typeof CompressionStream !== 'undefined' && typeof Response !== 'undefined' && typeof Blob !== 'undefined') {
      try {
        var s = new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate'))
        return new Response(s).arrayBuffer().then(function (ab) { return new Uint8Array(ab) }, function () { return stored(raw) })
      } catch (e) { /* fall through */ }
    }
    return Promise.resolve(stored(raw))
  }
  // zlib stream of stored (uncompressed) deflate blocks: valid everywhere, just bigger
  function stored(raw) {
    var w = new Writer(raw.length + Math.ceil(raw.length / 65535) * 5 + 16)
    w.u8(0x78).u8(0x01)
    if (!raw.length) w.u8(1).u16(0).u16(0xffff)
    for (var i = 0; i < raw.length; i += 65535) {
      var n = Math.min(65535, raw.length - i)
      w.u8(i + n >= raw.length ? 1 : 0).u16(n).u16(~n & 0xffff).bytes(raw.subarray(i, i + n))
    }
    return w.u32be(adler32(raw)).out()
  }
  // PNG scanlines of a rectangle with an adaptive filter per row (minimum sum of absolute differences)
  function scanlines(p, W, box, bpp) {
    var rl = box.w * bpp, out = new Uint8Array((rl + 1) * box.h)
    var prev = new Uint8Array(rl), cur = new Uint8Array(rl), cand = [0, 1, 2, 3, 4].map(function () { return new Uint8Array(rl) })
    for (var y = 0; y < box.h; y++) {
      var s = ((box.y + y) * W + box.x) * 4
      for (var x = 0, j = 0; x < box.w; x++, s += 4) { cur[j++] = p[s]; cur[j++] = p[s + 1]; cur[j++] = p[s + 2]; if (bpp === 4) cur[j++] = p[s + 3] }
      var best = 0, bestSum = Infinity
      for (var f = 0; f < 5; f++) {
        var c = cand[f], sum = 0
        for (var i = 0; i < rl; i++) {
          var a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], cc = i >= bpp ? prev[i - bpp] : 0, v
          if (f === 0) v = cur[i]
          else if (f === 1) v = cur[i] - a
          else if (f === 2) v = cur[i] - b
          else if (f === 3) v = cur[i] - ((a + b) >> 1)
          else { var pp = a + b - cc, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - cc); v = cur[i] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : cc) }
          v &= 255; c[i] = v; sum += v < 128 ? v : 256 - v
          if (sum >= bestSum) break
        }
        if (sum < bestSum) { bestSum = sum; best = f }
      }
      out[y * (rl + 1)] = best
      out.set(cand[best], y * (rl + 1) + 1)
      var t = prev; prev = cur; cur = t
    }
    return out
  }
  function chunk(w, type, data) {
    var t = ascii(type)
    w.u32be(data.length).bytes(t).bytes(data).u32be((crc32(data, crc32(t)) ^ 0xFFFFFFFF) >>> 0)
  }
  function be32(v) { return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255] }
  function be16(v) { return [(v >>> 8) & 255, v & 255] }
  /** frames -> Promise<Uint8Array> APNG (true 8-bit alpha; RGB when every pixel is opaque). o: { loop: 0 = forever } */
  function encodeApng(frames, o) {
    o = o || {}
    frames = dedupe(frames)
    var W = frames[0].width, H = frames[0].height
    var opaque = frames.every(function (f) { for (var i = 3; i < f.data.length; i += 4) if (f.data[i] !== 255) return false; return true })
    var bpp = opaque ? 3 : 4
    var w = new Writer(W * H * frames.length / 4 + 1024)
    w.bytes(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))
    chunk(w, 'IHDR', Uint8Array.from([].concat(be32(W), be32(H), [8, opaque ? 2 : 6, 0, 0, 0])))
    if (frames.length > 1) chunk(w, 'acTL', Uint8Array.from([].concat(be32(frames.length), be32(o.loop == null ? 0 : o.loop))))
    var seq = 0
    return frames.reduce(function (p, f, i) {
      return p.then(function () {
        // frame 0 must cover the canvas; later frames only the rectangle that changed (blend: source, dispose: none)
        var box = i === 0 ? { x: 0, y: 0, w: W, h: H } : diffBox(frames[i - 1].data, f.data, W, H) || { x: 0, y: 0, w: 1, h: 1 }
        var ms = Math.max(1, Math.round(f.t1 * 1000) - Math.round(f.t0 * 1000))
        if (frames.length > 1) chunk(w, 'fcTL', Uint8Array.from([].concat(be32(seq++), be32(box.w), be32(box.h), be32(box.x), be32(box.y), be16(ms), be16(1000), [0, 0])))
        return zlib(scanlines(f.data, W, box, bpp)).then(function (z) {
          if (i === 0) chunk(w, 'IDAT', z)
          else { var d = new Uint8Array(z.length + 4); d.set(be32(seq++)); d.set(z, 4); chunk(w, 'fdAT', d) }
        })
      })
    }, Promise.resolve()).then(function () { chunk(w, 'IEND', new Uint8Array(0)); return w.out() })
  }

  /* ───────────────────────── WebP (animated, muxed) ───────────────────────── */
  function riffChunks(b) {
    if (String.fromCharCode(b[0], b[1], b[2], b[3]) !== 'RIFF' || String.fromCharCode(b[8], b[9], b[10], b[11]) !== 'WEBP') throw new Error('not a WebP file')
    var out = [], at = 12
    while (at + 8 <= b.length) {
      var id = String.fromCharCode(b[at], b[at + 1], b[at + 2], b[at + 3])
      var n = (b[at + 4] | b[at + 5] << 8 | b[at + 6] << 16 | b[at + 7] << 24) >>> 0
      out.push({ id: id, data: b.subarray(at + 8, at + 8 + n) })
      at += 8 + n + (n & 1)
    }
    return out
  }
  function riffChunk(w, id, data) { w.str(id).u32(data.length).bytes(data); if (data.length & 1) w.u8(0) }
  /** [{ bytes: Uint8Array (a still .webp from canvas), t0, t1 }] -> Uint8Array animated WebP. o: { width, height, loop, background } */
  function muxWebp(frames, o) {
    o = o || {}
    var alpha = false
    var parts = frames.map(function (f) {
      var cs = riffChunks(f.bytes).filter(function (c) { return c.id === 'ALPH' || c.id === 'VP8 ' || c.id === 'VP8L' })
      if (cs.some(function (c) { return c.id === 'ALPH' || (c.id === 'VP8L' && (c.data[4] & 0x10)) })) alpha = true
      return cs
    })
    var W = o.width, H = o.height, body = new Writer(64 + frames.reduce(function (n, f) { return n + f.bytes.length + 32 }, 0))
    var x = new Writer(10); x.u8(0x02 | (alpha ? 0x10 : 0)).u24(0).u24(W - 1).u24(H - 1)
    riffChunk(body, 'VP8X', x.out())
    var bg = o.background ? hexRgb(o.background) : null
    var an = new Writer(6); an.u8(bg ? bg[2] : 255).u8(bg ? bg[1] : 255).u8(bg ? bg[0] : 255).u8(bg ? 255 : 0).u16(o.loop == null ? 0 : o.loop)
    riffChunk(body, 'ANIM', an.out())
    frames.forEach(function (f, i) {
      var ms = Math.max(1, Math.round(f.t1 * 1000) - Math.round(f.t0 * 1000))
      var fr = new Writer(f.bytes.length + 32)
      // full-canvas frame at 0,0; flags 0x02 = do not blend (overwrite, so transparent pixels stay transparent), no disposal
      fr.u24(0).u24(0).u24(W - 1).u24(H - 1).u24(ms).u8(0x02)
      parts[i].forEach(function (c) { riffChunk(fr, c.id, c.data) })
      riffChunk(body, 'ANMF', fr.out())
    })
    var b = body.out(), w = new Writer(b.length + 12)
    return w.str('RIFF').u32(b.length + 4).str('WEBP').bytes(b).out()
  }

  /* ───────────────────────── WebM duration fix ─────────────────────────
   * MediaRecorder writes WebM without a Duration (it records live), so some players and editors show no length
   * or cannot seek. This adds Segment > Info > Duration when it is missing and nothing after it depends on offsets. */
  function vint(b, at) {
    var first = b[at], len = 1, mask = 0x80
    while (len <= 8 && !(first & mask)) { len++; mask >>= 1 }
    if (len > 8) return null
    var v = first & (mask - 1), all1 = v === mask - 1
    for (var i = 1; i < len; i++) { v = v * 256 + b[at + i]; if (b[at + i] !== 255) all1 = false }
    return { len: len, value: v, unknown: all1 }
  }
  function readId(b, at) { var r = vint(b, at); if (!r) return null; var id = 0; for (var i = 0; i < r.len; i++) id = id * 256 + b[at + i]; return { len: r.len, id: id } }
  function fixWebmDuration(b, ms) {
    try {
      var at = 0, h = readId(b, at)
      if (!h || h.id !== 0x1A45DFA3) return b
      var hs = vint(b, at + h.len); at += h.len + hs.len + hs.value
      var sid = readId(b, at); if (!sid || sid.id !== 0x18538067) return b
      var ssz = vint(b, at + sid.len), segStart = at + sid.len + ssz.len, p = segStart
      while (p < b.length) {
        var id = readId(b, p); if (!id) return b
        var sz = vint(b, p + id.len); if (!sz || sz.unknown) return b
        var dataAt = p + id.len + sz.len
        if (id.id === 0x114D9B74) return b               // SeekHead: offsets would move, leave the file alone
        if (id.id === 0x1F43B675) return b               // reached a Cluster without Info
        if (id.id === 0x1549A966) {
          var q = dataAt, end = dataAt + sz.value, scale = 1000000
          while (q < end) {
            var cid = readId(b, q), csz = vint(b, q + cid.len), cat = q + cid.len + csz.len
            if (cid.id === 0x4489) return b               // already has a duration
            if (cid.id === 0x2AD7B1) { scale = 0; for (var k = 0; k < csz.value; k++) scale = scale * 256 + b[cat + k] }
            q = cat + csz.value
          }
          var dur = new Uint8Array(11); dur[0] = 0x44; dur[1] = 0x89; dur[2] = 0x88
          new DataView(dur.buffer).setFloat64(3, ms * 1000000 / (scale || 1000000))
          var newSize = sz.value + 11, sizeBytes = new Uint8Array(8); sizeBytes[0] = 0x01
          for (var s = 7, v = newSize; s >= 1; s--) { sizeBytes[s] = v % 256; v = Math.floor(v / 256) }
          var head = b.subarray(0, p + id.len), payload = b.subarray(dataAt, end), tail = b.subarray(end)
          var segFix = null
          if (!ssz.unknown) {
            // known Segment size: grow it in place (same vint length)
            var segNew = ssz.value + (8 - sz.len) + 11
            if (segNew > Math.pow(2, 7 * ssz.len) - 2) return b
            segFix = { at: at + sid.len, len: ssz.len, value: segNew }
          }
          var out = new Uint8Array(head.length + 8 + payload.length + 11 + tail.length)
          out.set(head); out.set(sizeBytes, head.length); out.set(payload, head.length + 8); out.set(dur, head.length + 8 + payload.length)
          out.set(tail, head.length + 8 + payload.length + 11)
          if (segFix) { var vv = segFix.value; for (var j = segFix.len - 1; j >= 0; j--) { out[segFix.at + j] = vv % 256; vv = Math.floor(vv / 256) } out[segFix.at] |= 0x80 >> (segFix.len - 1) }
          return out
        }
        p = dataAt + sz.value
      }
    } catch (e) { /* leave untouched */ }
    return b
  }

  // timestamps (ms) of every video block in a WebM (to check a real-time recording did not drop frames)
  function webmBlockTimes(b) {
    var times = [], cluster = 0
    var walk = function (at, end) {
      while (at < end) {
        var i = readId(b, at); if (!i) return
        var s = vint(b, at + i.len); if (!s) return
        var d = at + i.len + s.len, size = s.unknown ? end - d : s.value
        if (i.id === 0x18538067 || i.id === 0x1F43B675 || i.id === 0xA0) walk(d, Math.min(end, d + size))
        else if (i.id === 0xE7) { cluster = 0; for (var k = 0; k < size; k++) cluster = cluster * 256 + b[d + k] }
        else if (i.id === 0xA1 || i.id === 0xA3) times.push(cluster + ((b[d + 1] << 24 | b[d + 2] << 16) >> 16))
        if (s.unknown) return
        at = d + size
      }
    }
    try { walk(0, b.length) } catch (e) { /* partial */ }
    return times
  }

  /* ───────────────────────── MP4 (H.264, progressive) ─────────────────────────
   * A plain (non-fragmented) MP4 with the index up front ("fast start"): the most compatible kind for PowerPoint,
   * Keynote, QuickTime, social sites and video editors. Samples come from WebCodecs (AVC format: length-prefixed NALs). */
  function box(type, parts) {
    var n = 8; parts.forEach(function (p) { n += p.length })
    var w = new Writer(n); w.u32be(n).str(type); parts.forEach(function (p) { w.bytes(p) })
    return w.out()
  }
  function full(type, version, flags, parts) { return box(type, [Uint8Array.from([version, (flags >> 16) & 255, (flags >> 8) & 255, flags & 255])].concat(parts)) }
  function bytesOf(fn) { var w = new Writer(64); fn(w); return w.out() }
  var MATRIX = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000]
  /** samples: [{ data: Uint8Array, key: bool, t0, t1 }] (seconds), o: { width, height, avcC: Uint8Array } -> Uint8Array */
  function muxMp4(samples, o) {
    var TS = 90000, W = o.width, H = o.height
    var deltas = samples.map(function (s) { return Math.max(1, Math.round(s.t1 * TS) - Math.round(s.t0 * TS)) })
    var total = deltas.reduce(function (a, b) { return a + b }, 0), ms = Math.round(total / TS * 1000)
    var stts = []; deltas.forEach(function (d) { var l = stts[stts.length - 1]; if (l && l[1] === d) l[0]++; else stts.push([1, d]) })
    var keys = []; samples.forEach(function (s, i) { if (s.key) keys.push(i + 1) })
    var mdatLen = samples.reduce(function (n, s) { return n + s.data.length }, 0)
    var ftyp = box('ftyp', [bytesOf(function (w) { w.str('isom').u32be(512).str('isomiso2avc1mp41') })])
    var build = function (offset) {
      var avc1 = box('avc1', [bytesOf(function (w) {
        w.u32be(0).u16be(0).u16be(1)                       // reserved, data_reference_index
        for (var i = 0; i < 4; i++) w.u32be(0)              // pre_defined + reserved
        w.u16be(W).u16be(H).u32be(0x00480000).u32be(0x00480000).u32be(0).u16be(1)
        var name = 'with icons'; w.u8(name.length).str(name); for (var j = name.length; j < 31; j++) w.u8(0)
        w.u16be(0x18).u16be(0xffff)
      }), box('avcC', [o.avcC])])
      var stbl = box('stbl', [
        full('stsd', 0, 0, [bytesOf(function (w) { w.u32be(1) }), avc1]),
        full('stts', 0, 0, [bytesOf(function (w) { w.u32be(stts.length); stts.forEach(function (e) { w.u32be(e[0]).u32be(e[1]) }) })]),
        full('stss', 0, 0, [bytesOf(function (w) { w.u32be(keys.length); keys.forEach(function (k) { w.u32be(k) }) })]),
        full('stsc', 0, 0, [bytesOf(function (w) { w.u32be(1).u32be(1).u32be(samples.length).u32be(1) })]),
        full('stsz', 0, 0, [bytesOf(function (w) { w.u32be(0).u32be(samples.length); samples.forEach(function (s) { w.u32be(s.data.length) }) })]),
        full('stco', 0, 0, [bytesOf(function (w) { w.u32be(1).u32be(offset) })]),
      ])
      var minf = box('minf', [full('vmhd', 0, 1, [new Uint8Array(8)]), box('dinf', [full('dref', 0, 0, [bytesOf(function (w) { w.u32be(1) }), full('url ', 0, 1, [])])]), stbl])
      var mdia = box('mdia', [
        full('mdhd', 0, 0, [bytesOf(function (w) { w.u32be(0).u32be(0).u32be(TS).u32be(total).u16be(0x55c4).u16be(0) })]),
        full('hdlr', 0, 0, [bytesOf(function (w) { w.u32be(0).str('vide').u32be(0).u32be(0).u32be(0).str('VideoHandler').u8(0) })]),
        minf])
      var tkhd = full('tkhd', 0, 3, [bytesOf(function (w) {
        w.u32be(0).u32be(0).u32be(1).u32be(0).u32be(ms).u32be(0).u32be(0).u16be(0).u16be(0).u16be(0).u16be(0)
        MATRIX.forEach(function (m) { w.u32be(m) }); w.u32be(W * 65536).u32be(H * 65536)
      })])
      var mvhd = full('mvhd', 0, 0, [bytesOf(function (w) {
        w.u32be(0).u32be(0).u32be(1000).u32be(ms).u32be(0x00010000).u16be(0x0100).u16be(0).u32be(0).u32be(0)
        MATRIX.forEach(function (m) { w.u32be(m) }); for (var i = 0; i < 6; i++) w.u32be(0); w.u32be(2)
      })])
      return box('moov', [mvhd, box('trak', [tkhd, mdia])])
    }
    var moov = build(0)
    moov = build(ftyp.length + moov.length + 8)            // same size, now with the real mdat offset
    var out = new Writer(ftyp.length + moov.length + 8 + mdatLen)
    out.bytes(ftyp).bytes(moov).u32be(8 + mdatLen).str('mdat')
    samples.forEach(function (s) { out.bytes(s.data) })
    return out.out()
  }

  /* ───────────────────────── browser: motion + frames ───────────────────────── */
  var W_ = function () { return typeof window !== 'undefined' ? window : root || {} }
  var env = null // Node: { motion, raster } from register(WE, env); null in browsers
  var hasDom = function () { return typeof document !== 'undefined' && typeof Image !== 'undefined' && !!document.createElement }
  var loading = {}
  function loadScript(rel) {
    if (!BASE) return Promise.reject(new Error('cannot locate ' + rel))
    var url = new URL(rel, BASE).href
    if (loading[url]) return loading[url]
    return (loading[url] = new Promise(function (resolve, reject) {
      var s = document.createElement('script'); s.src = url; s.async = true
      s.onload = function () { resolve() }
      s.onerror = function () { delete loading[url]; reject(new Error('could not load ' + rel)) }
      document.head.appendChild(s)
    }))
  }
  function ensureMotion() {
    if (env && env.motion) return Promise.resolve(env.motion)
    var w = W_()
    if (w.WithMotion && w.WithMotion.frameSvg) return Promise.resolve(w.WithMotion)
    return loadScript('../../vendor/motion/motion.js').then(function () {
      if (!w.WithMotion || !w.WithMotion.frameSvg) throw new Error('The motion runtime did not load.')
      return w.WithMotion
    })
  }
  function styleRoot(st, ctx) {
    var w = W_(), list = (w.WITH && w.WITH.styles) || []
    for (var i = 0; i < list.length; i++) if (list[i].name === st) return list[i].root
    return st === ctx.style ? ctx.root : null
  }
  // the other icon of a swap as a flat 24px SVG: ctx.swap (the editor's "Turn into": its own style, colours and
  // drawing) first, else ctx.motion.swapTo ("name", "name@style", or a ready <svg> string) in Before's colours
  function swapSvg(WE, ctx, m) {
    var s = ctx.swap
    if (s && s.inner) {
      return Promise.resolve(WE.svgString({ name: s.name, style: s.style, inner: s.inner, root: s.root || ctx.root, color: s.color || ctx.color, vars: s.vars || {} }, { size: 24, flat: true }))
    }
    var to = m && (m.swapSvg || m.swapTo)
    if (!to) return Promise.resolve(null)
    if (/^\s*<svg/i.test(to)) return Promise.resolve(to)
    var parts = String(to).split('@'), name = parts[0], st = parts[1] || ctx.style, w = W_()
    var have = function () { return w.WITH_SVG && w.WITH_SVG[st] && w.WITH_SVG[st][name] }
    var ready = have() ? Promise.resolve() : loadScript('../../data/style-' + st + '.js').catch(function () {})
    return ready.then(function () {
      var inner = have(), rootAttrs = styleRoot(st, ctx)
      if (!inner || !rootAttrs) return null
      return WE.svgString({ name: name, style: st, inner: inner, root: rootAttrs, color: ctx.color, vars: ctx.vars }, { size: 24, flat: true })
    })
  }
  // a swap's timing for the motion runtime: effect, one transition (duration), the rest on each icon (hold), easing
  function swapTiming(ctx, m, mo) {
    var s = ctx.swap || {}
    mo.effect = s.effect || m.effect || 'fade'
    if (s.duration) mo.duration = s.duration; else if (m.swapDuration) mo.duration = m.swapDuration; else delete mo.duration
    if (s.hold != null) mo.hold = s.hold; else if (m.hold != null) mo.hold = m.hold
    if (s.ease) mo.ease = s.ease
    if (m.cycle && mo.hold == null) mo.cycle = m.cycle
    delete mo.preset; delete mo.trigger
    return mo
  }
  // file-name part for a swap: "to-pause", "to-heart-solid" (just "swap" when the target came as raw SVG)
  function swapLabel(m, ctx) {
    if (ctx && ctx.swap && ctx.swap.name) return 'to-' + ctx.swap.name + (ctx.swap.style && ctx.swap.style !== ctx.style ? '-' + ctx.swap.style : '')
    var t = String(m.swapTo || '')
    return !t || /^\s*</.test(t) ? 'swap' : 'to-' + t.replace(/@/g, '-').replace(/[^\w-]/g, '').slice(0, 40)
  }
  // ctx.motion -> WithMotion export options
  function motionOpts(ctx, keepHover) {
    var m = ctx.motion || {}, w = W_()
    var trig = m.trigger === 'hover' ? (keepHover ? 'hover' : 'once') : m.trigger === 'once' || m.trigger === 'inview' ? 'once' : 'loop'
    var o = { trigger: trig, spec: ctx.motionSpec || (w.WITH_MOTION && w.WITH_MOTION[ctx.name]) || undefined }
    ;['preset', 'origin', 'dir', 'amount', 'duration', 'steps'].forEach(function (k) { if (m[k] != null && m[k] !== '') o[k] = m[k] })
    if (ctx.color) o.color = ctx.color
    // 3D motion: a 3D style plays the spec's 3D counterpart, a backdrop style keeps its tile still (forge/MOTION.md)
    if (ctx.style) o.style = ctx.style
    return o
  }
  // Headroom so motion that leaves the 24 grid (bounce, glow, zoom, spin corners...) is not cut off at the file's edge.
  // A quick low-resolution pass over the animation measures how far it really travels (every part: object, plates,
  // shadow, decorations). opts.padding is the space wanted around the icon; it is a floor, never a crop: when the motion
  // travels further (a bounce of 0.14 clipped the coffee's steam), the measured headroom wins.
  // -> Promise<number> (share of the icon's size per side, 0-PAD_MAX)
  var PAD_MAX = 0.6
  function padding(opts, WM, a, mo, seconds) {
    var asked = opts && opts.padding != null && opts.padding !== '' ? Math.max(0, Math.min(PAD_MAX, Number(opts.padding) || 0)) : null
    return travel(WM, a, mo, seconds).then(function (need) { return asked == null ? need : Math.max(asked, need) })
  }
  function travel(WM, a, mo, seconds) {
    var S = 120, M = 0.75, unit = S / (24 * (1 + 2 * M)), N = 48, ext = 0, i = 0
    var c = env ? null : document.createElement('canvas'), g = null
    if (c) { c.width = c.height = S; g = c.getContext('2d', { willReadFrequently: true }) }
    // the frame's RGBA at S x S: injected rasteriser (Node) or <img> + canvas (browser)
    var pixels = function (svg) {
      if (env) return Promise.resolve(env.raster(svg, S, null))
      return loadImg(svg).then(function (img) { g.clearRect(0, 0, S, S); g.drawImage(img, 0, 0, S, S); return g.getImageData(0, 0, S, S).data })
    }
    var step = function () {
      if (i >= N) return Promise.resolve()
      var t = i * seconds / N; i++
      return pixels(wrap(WM.frameSvg(a, Object.assign({}, mo, { size: 24 }), t), S, M, null)).then(function (d) {
        var x0 = S, y0 = S, x1 = -1, y1 = -1
        for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) if (d[(y * S + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; y1 = y }
        if (x1 >= 0) {
          var off = 24 * M
          ext = Math.max(ext, off - x0 / unit, off - y0 / unit, (x1 + 1) / unit - off - 24, (y1 + 1) / unit - off - 24)
        }
        return step()
      })
    }
    return step().then(function () { return ext > 0.05 ? Math.min(PAD_MAX, Math.round((ext / 24 + 0.015) * 1000) / 1000) : 0 })
  }
  // put a 24-grid animated/frozen SVG inside a px x px file with padding; the nested <svg> keeps transform-box:view-box
  // meaning the 24 grid, and overflow="visible" lets motion spill into the padding
  function wrap(svg24, px, pad, bg) {
    var a = Math.round(24 * pad * 1000) / 1000, s = Math.round((24 + 2 * a) * 1000) / 1000
    var inner = svg24.replace(/^\s*<svg\b/, '<svg x="0" y="0" overflow="visible"')
    var esc = function (v) { return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + px + '" height="' + px + '" viewBox="' + (-a) + ' ' + (-a) + ' ' + s + ' ' + s + '">' +
      (bg ? '<rect x="' + (-a) + '" y="' + (-a) + '" width="' + s + '" height="' + s + '" fill="' + esc(bg) + '"/>' : '') + inner + '</svg>'
  }
  function loadImg(svg) {
    return new Promise(function (resolve, reject) {
      var img = new Image()
      img.onload = function () { resolve(img) }
      img.onerror = function () { reject(new Error('A frame failed to render.')) }
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    })
  }
  // Limits. Frames are kept as RGBA until encoded (4 bytes a pixel; the GIF encoder frees each frame as it converts it),
  // so the budget is memory: ~640 MB of frames in Node (the CLI), ~440 MB in a browser tab. 1080 px (Instagram) at the
  // default frame rate fits for every icon's own loop; larger sizes or long loops ask for a lower --fps / --seconds.
  // A size is never changed silently: out of range is an error that says what fits.
  var MAX_PX = 2048, MIN_PX = 8, MAX_FRAMES = 600
  var pixelBudget = function () { return env ? 160e6 : 110e6 }
  function sizeOf(opts, def) {
    var want = Math.round((Number(opts && opts.size) || def) * (Number(opts && opts.scale) || 1))
    if (want > MAX_PX) throw new Error('A ' + want + ' px animation is too many pixels; animated files go up to ' + MAX_PX + ' px. Use a size of ' + MAX_PX + ' or less.')
    if (want < MIN_PX) throw new Error('A ' + want + ' px animation is too small to draw; the smallest is ' + MIN_PX + ' px.')
    return want
  }
  /**
   * Render the animation as frames.
   * fo: { size, fps, background, keep: 'data' (ImageData RGBA, default) | 'canvas' }
   * -> Promise<{ frames: [{ data?, canvas?, width, height, t0, t1 }], seconds, fps, size, preset, label }>
   */
  function renderFrames(WE, ctx, opts, fo) {
    opts = opts || {}
    return ensureMotion().then(function (WM) {
      var mo = motionOpts(ctx)
      var m = ctx.motion || {}
      return swapSvg(WE, ctx, m).then(function (b) {
        if (b) { mo.swapTo = b; swapTiming(ctx, m, mo) }
        var a = WE.svgString(ctx, { size: 24, flat: true })
        var px = fo.size, fps = fo.fps
        var seconds = Number(opts.seconds) > 0 ? Number(opts.seconds) : WM.exportDuration(mo, a)
        var n = Math.max(1, Math.round(seconds * fps))
        if (n > MAX_FRAMES) throw new Error('That is ' + n + ' frames; the limit is ' + MAX_FRAMES + '. Use a lower frame rate or a shorter duration.')
        var budget = pixelBudget()
        if (n * px * px > budget) {
          var fitFps = Math.floor(budget / (px * px) / seconds), fitPx = Math.floor(Math.sqrt(budget / n))
          throw new Error('Too many pixels for one animation (' + n + ' frames of ' + px + ' x ' + px + ' px, ' + (Math.round(seconds * 100) / 100) + ' s at ' + fps + ' fps). ' +
            (fitFps >= 1 ? 'At ' + px + ' px use a frame rate of ' + Math.min(fitFps, fps - 1) + ' or less (fps), or a shorter loop (seconds); ' : '') + 'at ' + fps + ' fps the largest size is ' + fitPx + ' px.')
        }
        var frames = [], pad = 0, ss = Math.max(1, Math.min(3, Math.round(Number(fo.ss) || 1)))
        if (px * ss > MAX_PX * 2) ss = 1
        var step = function (i) {
          if (i >= n) return Promise.resolve()
          var t0 = i * seconds / n, t1 = (i + 1) * seconds / n
          var frozen = WM.frameSvg(a, Object.assign({}, mo, { size: 24 }), t0)
          if (env && fo.keep !== 'canvas') {
            return Promise.resolve(env.raster(wrap(frozen, px, pad, null), px, fo.background || null)).then(function (data) {
              frames.push({ data: data, width: px, height: px, t0: t0, t1: t1 })
              return step(i + 1)
            })
          }
          return loadImg(wrap(frozen, ss > 1 ? px * ss : px, pad, null)).then(function (img) {
            var c = document.createElement('canvas'); c.width = c.height = px
            var g = c.getContext('2d', { willReadFrequently: fo.keep !== 'canvas' })
            if (fo.background) { g.fillStyle = fo.background; g.fillRect(0, 0, px, px) }
            if (ss > 1) {
              // drawn at ss x the size, then scaled down: finer edges, and no hairline seams where two shapes meet
              var big = document.createElement('canvas'); big.width = big.height = px * ss
              big.getContext('2d').drawImage(img, 0, 0, px * ss, px * ss)
              g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'
              g.drawImage(big, 0, 0, px, px)
            } else g.drawImage(img, 0, 0, px, px)
            var f = { width: px, height: px, t0: t0, t1: t1 }
            if (fo.keep === 'canvas') f.canvas = c
            else f.data = g.getImageData(0, 0, px, px).data
            frames.push(f)
            return step(i + 1)
          })
        }
        return padding(opts, WM, a, mo, seconds).then(function (p) { pad = p; return step(0) }).then(function () {
          var r = WM.resolveMotion(mo)
          return { frames: frames, seconds: seconds, fps: fps, size: px, preset: b ? 'swap' : r.preset, label: b ? swapLabel(m, ctx) : r.preset }
        })
      })
    })
  }

  /* ───────────────────────── feature detection ───────────────────────── */
  var cache = {}
  function canEncode(mime) {
    if (mime in cache) return cache[mime]
    var ok = false
    try { if (hasDom()) { var c = document.createElement('canvas'); c.width = c.height = 2; ok = c.toDataURL(mime).indexOf('data:' + mime) === 0 } } catch (e) { ok = false }
    return (cache[mime] = ok)
  }
  function recorderType(list) {
    try {
      if (typeof MediaRecorder === 'undefined' || !hasDom() || !HTMLCanvasElement.prototype.captureStream) return null
      for (var i = 0; i < list.length; i++) if (MediaRecorder.isTypeSupported(list[i])) return list[i]
    } catch (e) { /* none */ }
    return null
  }
  var WEBM_TYPES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
  var MP4_TYPES = ['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1.4D401F', 'video/mp4;codecs=avc1', 'video/mp4']
  // Chromium's MediaRecorder keeps the canvas alpha channel in VP8/VP9 WebM; other engines flatten it to black.
  function webmAlpha() {
    try { var n = navigator; return !!(n.userAgentData && n.userAgentData.brands && n.userAgentData.brands.some(function (b) { return /Chromium/.test(b.brand) })) || /\bChrome\/\d/.test(n.userAgent) } catch (e) { return false }
  }
  var sleepUntil = function (t) { return new Promise(function (r) { setTimeout(r, Math.max(0, t - performance.now())) }) }
  // Real-time recording of canvases through MediaRecorder (one frame per tick, timestamps from the wall clock).
  function record(frames, fps, mime, loops) {
    var c = document.createElement('canvas'); c.width = frames[0].width; c.height = frames[0].height
    var g = c.getContext('2d')
    g.drawImage(frames[0].canvas, 0, 0)
    var manual = true, stream
    try { stream = c.captureStream(0); if (!stream.getVideoTracks()[0].requestFrame) throw 0 } catch (e) { manual = false; stream = c.captureStream(fps) }
    var track = stream.getVideoTracks()[0]
    var px = c.width * c.height
    var rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.min(2e7, Math.max(3e6, Math.round(px * fps * 0.5))) })
    var chunks = []
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data) }
    var done = new Promise(function (resolve, reject) {
      rec.onstop = function () { resolve(new Blob(chunks, { type: mime.split(';')[0] })) }
      rec.onerror = function (e) { reject(e.error || new Error('recording failed')) }
    })
    rec.start()
    var t0 = performance.now(), seq = []
    for (var l = 0; l < loops; l++) frames.forEach(function (f) { seq.push(f) })
    var i = 0
    var tick = function () {
      if (i >= seq.length) {
        // hold the last frame for its full duration, then stop
        return sleepUntil(t0 + loops * frames[frames.length - 1].t1 * 1000).then(function () { if (manual) track.requestFrame(); rec.stop(); track.stop(); return done })
      }
      var f = seq[i], loop = Math.floor(i / frames.length), at = t0 + (loop * frames[frames.length - 1].t1 + f.t0) * 1000
      return sleepUntil(at).then(function () {
        g.clearRect(0, 0, c.width, c.height); g.drawImage(f.canvas, 0, 0)
        if (manual) track.requestFrame()
        i++
        return tick()
      })
    }
    return tick()
  }

  // The first MediaRecorder session in a page can stall while the encoder starts up (dropped frames), so warm it up once.
  var warmed = {}
  function warmUp(mime) {
    if (warmed[mime]) return warmed[mime]
    return (warmed[mime] = new Promise(function (resolve) {
      try {
        var c = document.createElement('canvas'); c.width = c.height = 64
        var g = c.getContext('2d'), st = c.captureStream(30), rec = new MediaRecorder(st, { mimeType: mime }), n = 0
        rec.onstop = function () { st.getTracks().forEach(function (t) { t.stop() }); resolve() }
        rec.start()
        var iv = setInterval(function () { g.fillStyle = n++ % 2 ? '#000' : '#fff'; g.fillRect(0, 0, 64, 64); if (n > 12) { clearInterval(iv); rec.stop() } }, 33)
      } catch (e) { resolve() }
    }))
  }
  // Record, then check the WebM really holds every frame (a busy tab can drop some); retry up to twice.
  function recordChecked(frames, fps, mime, loops) {
    var expected = frames.length * loops, isWebm = /webm/.test(mime)
    var attempt = function (k, best) {
      return record(frames, fps, mime, loops).then(function (blob) { return blob.arrayBuffer() }).then(function (ab) {
        var bytes = new Uint8Array(ab), got = isWebm ? webmBlockTimes(bytes).length : expected
        var cand = { bytes: bytes, got: got }
        if (!best || cand.got > best.got) best = cand
        if (best.got >= expected * 0.95 || k >= 2) return best.bytes
        return attempt(k + 1, best)
      })
    }
    return warmUp(mime).then(function () { return attempt(0, null) })
  }

  /* WebCodecs H.264 (exact frame timing, faster than real time) -> progressive MP4 */
  var AVC = ['avc1.42E028', 'avc1.42001f', 'avc1.4D0028', 'avc1.640028']
  function avcConfig(w, h, fps) {
    if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') return Promise.resolve(null)
    var bitrate = Math.min(2e7, Math.max(2e6, Math.round(w * h * fps * 0.6)))
    var tryAt = function (i) {
      if (i >= AVC.length) return Promise.resolve(null)
      var cfg = { codec: AVC[i], width: w, height: h, bitrate: bitrate, framerate: fps, avc: { format: 'avc' } }
      return VideoEncoder.isConfigSupported(cfg).then(function (r) { return r && r.supported ? cfg : tryAt(i + 1) }, function () { return tryAt(i + 1) })
    }
    return tryAt(0)
  }
  function encodeMp4(frames, fps, loops, cfg) {
    return new Promise(function (resolve, reject) {
      var samples = [], avcC = null, failed = null
      var enc = new VideoEncoder({
        output: function (chunk, meta) {
          var d = new Uint8Array(chunk.byteLength); chunk.copyTo(d)
          samples.push({ data: d, key: chunk.type === 'key', ts: chunk.timestamp })
          if (meta && meta.decoderConfig && meta.decoderConfig.description) avcC = new Uint8Array(meta.decoderConfig.description.buffer ? meta.decoderConfig.description.buffer.slice(meta.decoderConfig.description.byteOffset || 0, (meta.decoderConfig.description.byteOffset || 0) + meta.decoderConfig.description.byteLength) : meta.decoderConfig.description)
        },
        error: function (e) { failed = e },
      })
      enc.configure(cfg)
      var cycle = frames[frames.length - 1].t1, times = []
      for (var l = 0; l < loops; l++) frames.forEach(function (f, i) {
        var t0 = l * cycle + f.t0, t1 = l * cycle + f.t1
        times.push([t0, t1])
        var vf = new VideoFrame(f.canvas, { timestamp: Math.round(t0 * 1e6), duration: Math.round((t1 - t0) * 1e6) })
        enc.encode(vf, { keyFrame: (l * frames.length + i) % (fps * 2) === 0 })
        vf.close()
      })
      enc.flush().then(function () {
        enc.close()
        if (failed) throw failed
        if (!avcC || samples.length !== times.length) throw new Error('The video encoder returned ' + samples.length + ' of ' + times.length + ' frames.')
        samples.sort(function (a, b) { return a.ts - b.ts })
        samples.forEach(function (s, i) { s.t0 = times[i][0]; s.t1 = times[i][1] })
        resolve(muxMp4(samples, { width: cfg.width, height: cfg.height, avcC: avcC }))
      }).catch(function (e) { try { enc.close() } catch (x) { /* closed */ } reject(failed || e) })
    })
  }

  function fpsOf(opts, def, max) { return Math.max(1, Math.min(max || 60, Math.round(Number(opts && opts.fps) || def))) }

  return {
    encodeGif: encodeGif, GIF_QUALITY: GIF_QUALITY, encodeApng: encodeApng, muxWebp: muxWebp, riffChunks: riffChunks, fixWebmDuration: fixWebmDuration, muxMp4: muxMp4, webmBlockTimes: webmBlockTimes,
    quantize: quantize, dedupe: dedupe, zlibStored: stored, adler32: adler32,
    register: function (WE, nodeEnv) {
      if (nodeEnv) env = nodeEnv
      // browsers hand back a Blob (for the download button); Node callers get the bytes
      var out = function (bytes, mime) { return env ? bytes : new Blob([bytes], { type: mime }) }
      var frameSet = function (ctx, opts, def, extra) {
        return renderFrames(WE, ctx, opts, Object.assign({ size: sizeOf(opts, 256), fps: fpsOf(opts, def.fps, def.maxFps) }, extra))
      }
      var name = function (ctx, r, ext) { return WE.filename(ctx, r.label, ext) }

      WE.register({
        id: 'gif', label: 'GIF (animated)', ext: 'gif', mime: 'image/gif', group: 'animated',
        audience: ['presentations', 'designers', 'web'], transparent: '1-bit', animated: true,
        note: 'Plays everywhere: Slack, email, Notion, Google Slides, PowerPoint. Edges are blended with a matte colour (white, or your background), so pick the colour it will sit on.',
        available: function () { return hasDom() || !!env },
        // opts.quality: 'light' | 'standard' (default) | 'smooth' | 'best' (GIF_QUALITY); an explicit fps wins over its rate
        qualities: GIF_QUALITY,
        run: function (ctx, opts) {
          opts = opts || {}
          var q = GIF_QUALITY[opts.quality] || GIF_QUALITY.standard
          return frameSet(ctx, opts, { fps: q.fps, maxFps: 50 }, { background: opts.background || null, ss: q.ss || 1 }).then(function (r) {
            var bytes = encodeGif(r.frames, { matte: opts.background || opts.matte || '#ffffff', loop: opts.loop, release: true, colors: q.colors, local: q.local })
            return { data: out(bytes, 'image/gif'), filename: name(ctx, r, 'gif'), mime: 'image/gif' }
          })
        },
      })
      WE.register({
        id: 'apng', label: 'APNG (animated PNG)', ext: 'png', mime: 'image/png', group: 'animated',
        audience: ['web', 'designers', 'developers'], transparent: true, animated: true,
        note: 'An animated PNG with smooth, truly see-through edges on any background. Plays in every modern browser; elsewhere it shows the still icon.',
        available: function () { return hasDom() || !!env },
        run: function (ctx, opts) {
          opts = opts || {}
          return frameSet(ctx, opts, { fps: 30 }, { background: opts.background || null }).then(function (r) {
            return encodeApng(r.frames, { loop: opts.loop }).then(function (bytes) {
              return { data: out(bytes, 'image/png'), filename: name(ctx, r, 'png').replace(/\.png$/, '.apng.png'), mime: 'image/png' }
            })
          })
        },
      })
      WE.register({
        id: 'webp-animated', label: 'WebP (animated)', ext: 'webp', mime: 'image/webp', group: 'animated',
        audience: ['web', 'developers'], transparent: true, animated: true,
        note: 'An animated image for websites and apps: smooth see-through edges and lossless by default, often smaller than GIF. Only offered where your browser can create WebP.',
        available: function () { return canEncode('image/webp') },
        run: function (ctx, opts) {
          opts = opts || {}
          var q = opts.quality == null || opts.quality === '' ? 1 : Math.max(0, Math.min(1, Number(opts.quality) > 1 ? Number(opts.quality) / 100 : Number(opts.quality)))
          return frameSet(ctx, opts, { fps: 30 }, { background: opts.background || null, keep: 'canvas' }).then(function (r) {
            // merge identical frames, then encode each remaining frame with the browser's WebP encoder
            var px = r.size, list = r.frames.map(function (f) { return { data: f.canvas.getContext('2d').getImageData(0, 0, px, px).data, canvas: f.canvas, width: px, height: px, t0: f.t0, t1: f.t1 } })
            var merged = []
            list.forEach(function (f) { var l = merged[merged.length - 1]; if (l && sameData(l.data, f.data)) l.t1 = f.t1; else merged.push(f) })
            return merged.reduce(function (p, f) {
              return p.then(function (acc) {
                return new Promise(function (res, rej) { f.canvas.toBlob(function (b) { b && b.type === 'image/webp' ? res(b) : rej(new Error('WebP encoding failed.')) }, 'image/webp', q) })
                  .then(function (b) { return b.arrayBuffer() }).then(function (ab) { acc.push({ bytes: new Uint8Array(ab), t0: f.t0, t1: f.t1 }); return acc })
              })
            }, Promise.resolve([])).then(function (enc) {
              var bytes = muxWebp(enc, { width: px, height: px, loop: opts.loop, background: opts.background })
              return { data: new Blob([bytes], { type: 'image/webp' }), filename: name(ctx, r, 'webp'), mime: 'image/webp' }
            })
          })
        },
      })
      WE.register({
        id: 'webm', label: 'WebM video', ext: 'webm', mime: 'video/webm', group: 'animated',
        audience: ['web', 'developers', 'presentations'], transparent: true, animated: true,
        note: 'A tiny looping video for websites and video editors. Keeps the see-through background in Chrome and Edge (VP9 alpha); other browsers record it on your background colour.',
        available: function () { return !!recorderType(WEBM_TYPES) },
        run: function (ctx, opts) {
          opts = opts || {}
          var type = recorderType(WEBM_TYPES)
          var bg = opts.background || (webmAlpha() ? null : (opts.matte || '#ffffff'))
          return frameSet(ctx, opts, { fps: 30 }, { background: bg, keep: 'canvas' }).then(function (r) {
            var loops = Math.max(1, Math.min(10, Math.round(Number(opts.loops) || 1)))
            return recordChecked(r.frames, r.fps, type, loops).then(function (raw) {
              var bytes = fixWebmDuration(raw, r.seconds * loops * 1000)
              return { data: new Blob([bytes], { type: 'video/webm' }), filename: name(ctx, r, 'webm'), mime: 'video/webm' }
            })
          })
        },
      })
      WE.register({
        id: 'mp4', label: 'MP4 video', ext: 'mp4', mime: 'video/mp4', group: 'animated',
        audience: ['presentations', 'designers'], transparent: false, animated: true,
        note: 'A short video for Keynote, PowerPoint, social posts and video editors. No transparency: it plays on your background colour (white unless you pick one).',
        available: function () { return typeof VideoEncoder !== 'undefined' || !!recorderType(MP4_TYPES) },
        run: function (ctx, opts) {
          opts = opts || {}
          var px = Math.round(sizeOf(opts, 256) / 2) * 2                         // H.264 needs even sizes
          var o2 = Object.assign({}, opts, { size: px, scale: 1 })
          var fps = fpsOf(opts, 30)
          return frameSet(ctx, o2, { fps: 30 }, { background: opts.background || '#ffffff', keep: 'canvas' }).then(function (r) {
            var loops = Math.max(1, Math.min(10, Math.round(Number(opts.loops) || 1)))
            var viaRecorder = function () {
              var type = recorderType(MP4_TYPES)
              if (!type) throw new Error('This browser cannot create MP4 video.')
              return recordChecked(r.frames, r.fps, type, loops)
            }
            return avcConfig(px, px, fps).then(function (cfg) {
              return cfg ? encodeMp4(r.frames, r.fps, loops, cfg).catch(viaRecorder) : viaRecorder()
            }).then(function (bytes) {
              return { data: new Blob([bytes], { type: 'video/mp4' }), filename: name(ctx, r, 'mp4'), mime: 'video/mp4' }
            })
          })
        },
      })
      WE.register({
        id: 'png-sequence', label: 'PNG frames (ZIP)', ext: 'zip', mime: 'application/zip', group: 'animated',
        audience: ['designers', 'developers'], transparent: true, animated: true,
        note: 'Every frame as a numbered, see-through PNG: import as an image sequence in After Effects, Premiere, DaVinci Resolve, Blender or a game engine.',
        available: function () { return hasDom() },
        run: function (ctx, opts) {
          opts = opts || {}
          return frameSet(ctx, opts, { fps: 30 }, { background: opts.background || null, keep: 'canvas' }).then(function (r) {
            var stem = name(ctx, r, 'png').replace(/\.png$/, ''), digits = String(r.frames.length).length < 4 ? 4 : String(r.frames.length).length
            return r.frames.reduce(function (p, f, i) {
              return p.then(function (files) {
                return new Promise(function (res) { f.canvas.toBlob(res, 'image/png') }).then(function (b) { return b.arrayBuffer() }).then(function (ab) {
                  var num = String(i); while (num.length < digits) num = '0' + num
                  files.push({ name: stem + '_' + num + '.png', data: new Uint8Array(ab) }); return files
                })
              })
            }, Promise.resolve([])).then(function (files) {
              files.push({ name: 'README.txt', data: [
                (ctx.title || ctx.name) + ' (' + ctx.style + ') - ' + r.preset + ' animation from with icons (withicons.com)', '',
                r.frames.length + ' frames, ' + r.size + ' x ' + r.size + ' px, ' + r.fps + ' fps, ' + (Math.round(r.seconds * 1000) / 1000) + ' s per loop. ' +
                  (opts.background ? 'Background: ' + opts.background + '.' : 'Transparent background (straight alpha).'),
                'The last frame flows back into the first, so the sequence loops seamlessly.', '',
                'After Effects: File > Import, pick the first frame, tick "PNG Sequence", then set the frame rate to ' + r.fps + ' (Interpret Footage).',
                'Premiere / DaVinci Resolve: import the folder as an image sequence at ' + r.fps + ' fps.',
                'Game engines / CSS: use the frames as a sprite animation at ' + r.fps + ' fps.', ''].join('\r\n') })
              return { data: new Blob([WE.zip(files)], { type: 'application/zip' }), filename: WE.filename(ctx, r.label + '-frames', 'zip'), mime: 'application/zip' }
            })
          })
        },
      })
      WE.register({
        id: 'animated-svg', label: 'Animated SVG', ext: 'svg', mime: 'image/svg+xml', group: 'animated',
        audience: ['web', 'developers', 'designers'], transparent: true, animated: true,
        note: 'One small, sharp-at-any-size file that animates by itself: in an <img>, opened in a browser, or pasted into a page. Uses the same motion as the site (CSS keyframes inside).',
        available: function () { return hasDom() || !!env || !!(W_().WithMotion && W_().WithMotion.animatedSvg) },
        run: function (ctx, opts) {
          opts = opts || {}
          return ensureMotion().then(function (WM) {
            var m = ctx.motion || {}, mo = motionOpts(ctx, true)
            return swapSvg(WE, ctx, m).then(function (b) {
              if (b) { mo.swapTo = b; swapTiming(ctx, m, mo) }
              var a = WE.svgString(ctx, { size: 24, flat: true })
              var px = Math.max(1, Math.round(Number(opts.size) || 256))
              // measure the travel of the played motion (a hover export measures its one-shot)
              var still = Object.assign({}, mo, { trigger: mo.trigger === 'hover' ? 'once' : mo.trigger })
              var measure = hasDom() || env ? padding(opts, WM, a, still, WM.exportDuration(still, a)) : Promise.resolve(Math.max(0, Math.min(0.4, Number(opts.padding) || 0)))
              return measure.then(function (pad) {
                var anim = WM.animatedSvg(a, Object.assign({}, mo, { size: 24 }))
                var out = pad || opts.background ? wrap(anim, px, pad, opts.background) : WM.animatedSvg(a, Object.assign({}, mo, { size: px }))
                if (ctx.title && out.indexOf('<title>') < 0) out = out.replace(/(<svg\b[^>]*>)/, '$1<title>' + String(ctx.title).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</title>')
                var label = b ? swapLabel(m, ctx) : WM.resolveMotion(mo).preset
                return { data: '<?xml version="1.0" encoding="UTF-8"?>\n' + out + '\n', filename: WE.filename(ctx, label, 'svg'), mime: 'image/svg+xml' }
              })
            })
          })
        },
      })
    },
  }
})
