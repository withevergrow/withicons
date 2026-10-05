// with icons — the STROKE FONT for Live icons (forge/DYNAMIC.md).
//
// Centreline glyphs (no outlines, no font files): every glyph is ordinary SVG path data that each style
// renderer strokes, fills around, knocks out or pixelates exactly like any other skeleton line. Geometric,
// friendly, round-ended, built for 1.75–2.5u strokes and for 24px and 16px.
//
// ── API ────────────────────────────────────────────────────────────────────────────────────────────────
//   text(str, { x = 12, y = 12, size = 'large', align = 'center', valign = 'middle', tracking = 0 })
//       -> { paths: [d, ...], width, height, box: {x0, y0, x1, y1}, cap, size, chars, missing }
//     size     'large' (cap 7u, for 1–3 chars: "17", "99+", "72°") | 'small' (cap 5u, up to 4 chars:
//              "MON", "PDF", "-50%") | a number = cap height in u (>= 6 uses the large drawings scaled,
//              below 6 the simplified small drawings scaled).
//     x, y     anchor. align 'left' | 'center' | 'right' sets what x is; valign 'middle' (y = middle of the
//              caps, default) | 'top' (y = cap top) | 'baseline' (y = baseline).
//     tracking extra space in u added between letters (negative tightens; spacing is already optically kerned).
//     paths    one d string per visible glyph (open subpaths only: ring glyphs like 0 O 8 are emitted as two
//              open arcs, so no renderer ever mistakes a counter for an area). Put them on plate A (S in badges).
//     width    centreline width; height = cap height; box = centreline bbox (ink reaches strokeWidth/2 further).
//     missing  characters that are not in the charset (they are skipped, never thrown on).
//   fitText(str, box{x0, y0, x1, y1}, { prefer, minCap = 4, maxCap, align, valign, tracking })
//       -> same as text(), centred in box (or aligned), using the largest legible size whose CENTRELINES fit
//          the box; null when even minCap does not fit -> the caller must fall back (shorter text, "99+", ...).
//          prefer 'large' (default for <= 3 chars) tries the large drawings first, 'small' starts at cap 5.
//          Give the box as the area centrelines may use: inset your frame by >= strokeWidth/2 + 1.5u.
//   measure(str, opts)   -> { width, height, box, cap, size } without building paths (cheap).
//   asCutouts(paths)     -> paths for a skeleton's `cutouts`: every subpath open (so solid & co knock text
//                           out as 1.5u lines, never as filled areas). Pass text().paths straight in.
//   coverage(str)        -> { ok, missing: [...] } after upper-casing.  supports(ch) -> bool.
//   clean(str, maxLength = 4) -> upper-cased, accents folded (fold()), unsupported chars dropped, clipped.
//   CHARSET, LARGE, SMALL (metrics objects), snap(n)
//   live(generator)      -> the generator, its build() wrapped so every glyph path in the skeleton gets the id
//                           "text:<char>:<cap>:<n>". EVERY generator exports `export default live({...})`: style
//                           renderers read the id (forge/styles/_live-text.mjs) to keep text legible (pixel re-sets
//                           it in a bitmap font, gloss/glass/sticker draw free text crisp, kawaii puts no face on it).
//   markText(d, ch, cap) -> d, remembered as a glyph (for a sign a generator draws by hand, e.g. the "+" of 4G+).
//   text().glyphs        -> the character of each entry of text().paths.
//
// ── Charset ────────────────────────────────────────────────────────────────────────────────────────────
//   0-9  A-Z  % ° : - + / . , ! ? $ € £ ₹ # & * '  and space. Lowercase input is upper-cased.
//
// ── Metrics (u = 1/24 of the icon) ─────────────────────────────────────────────────────────────────────
//   LARGE  cap 7, digits 4.5 wide (1 is 2), letters 3.5–7.5, min ink gap 0.75, mean gap 1.5
//   SMALL  cap 5, digits 3.5 wide, letters 2.75–6, min ink gap 0.6, mean gap 1.15; simplified drawings
//          (open 4, lighter € $ ₹ #, shallower M/W vertices, shorter middle bars)
//   Spacing is automatic optical kerning from each glyph's ink profile at a 2u reference stroke
//   (min gap + mean gap + a max-kern clamp), so pairs like "LT", "7A", "1%", "T." just work.
//   Every output coordinate is snapped to 0.25. Deterministic; no Math.random, no dates.
import { parsePath } from '../kernel/geom.mjs'

export const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ%°:-+/.,!?$€£₹#&*' "
export const LARGE = { name: 'large', cap: 7, gapMin: 0.75, gapMean: 1.35, gapCap: 3, maxKern: 0.75, space: 2.75 }
export const SMALL = { name: 'small', cap: 5, gapMin: 0.6, gapMean: 1.05, gapCap: 2.25, maxKern: 0.5, space: 2 }
const REF_SW = 2 // reference stroke for spacing

export const snap = (n, q = 0.25) => { const r = Math.round(n / q) * q; return Object.is(r, -0) ? 0 : +r.toFixed(4) }
const f = n => String(snap(n))
const rad = d => d * Math.PI / 180

// ── pen: absolute commands, serialised with 0.25 snapping ────────────────────────────────────────────────
class Pen {
  constructor() { this.c = []; this.x = null; this.y = null }
  M(x, y) { this.c.push(['M', x, y]); this.x = x; this.y = y; return this }
  L(x, y) { if (this.x === null) return this.M(x, y); this.c.push(['L', x, y]); this.x = x; this.y = y; return this }
  H(x) { return this.L(x, this.y) }
  V(y) { return this.L(this.x, y) }
  C(a, b, c, d, x, y) { this.c.push(['C', a, b, c, d, x, y]); this.x = x; this.y = y; return this }
  A(rx, ry, large, sweep, x, y) { this.c.push(['A', rx, ry, large, sweep, x, y]); this.x = x; this.y = y; return this }
  // elliptical arc by angles in degrees (0 = right, 90 = down: y-down, increasing = clockwise on screen)
  E(cx, cy, rx, ry, a0, a1) {
    const pt = a => [cx + rx * Math.cos(rad(a)), cy + ry * Math.sin(rad(a))]
    const [sx, sy] = pt(a0)
    if (this.x === null) this.M(sx, sy)
    else if (Math.hypot(this.x - sx, this.y - sy) > 1e-6) this.L(sx, sy)
    const span = a1 - a0, n = Math.max(1, Math.ceil(Math.abs(span) / 179.9))
    for (let k = 1; k <= n; k++) {
      const a = a0 + span * k / n, [ex, ey] = pt(a)
      this.A(rx, ry, Math.abs(span / n) > 180 ? 1 : 0, span > 0 ? 1 : 0, ex, ey)
    }
    return this
  }
  map(fn, flip = false) { // fn: [x,y] -> [x,y]
    const p = new Pen()
    for (const c of this.c) {
      if (c[0] === 'A') { const [x, y] = fn([c[5], c[6]]); p.c.push(['A', c[1], c[2], c[3], flip ? 1 - c[4] : c[4], x, y]) }
      else { const o = [c[0]]; for (let i = 1; i < c.length; i += 2) o.push(...fn([c[i], c[i + 1]])); p.c.push(o) }
    }
    return p
  }
  d(ox = 0, oy = 0) {
    let s = ''
    for (const c of this.c) {
      if (c[0] === 'A') s += `A${f(c[1])} ${f(c[2])} 0 ${c[3]} ${c[4]} ${f(c[5] + ox)} ${f(c[6] + oy)}`
      else { s += c[0]; for (let i = 1; i < c.length; i += 2) s += (i > 1 ? ' ' : '') + f(c[i] + ox) + ' ' + f(c[i + 1] + oy) }
      s += ' '
    }
    return s.trim().replace(/ ([MLCA])/g, ' $1')
  }
}
const pen = () => new Pen()
// a closed ellipse as two open half arcs (top half, bottom half)
const ring = (cx, cy, rx, ry) => [pen().E(cx, cy, rx, ry, 180, 360), pen().E(cx, cy, rx, ry, 0, 180)]
// a stadium (rounded-end rectangle) as two open halves
function stadium(x0, y0, x1, y1, r) {
  const cx = (x0 + x1) / 2
  return [
    pen().M(cx, y0).E(x1 - r, y0 + r, r, r, -90, 0).V(y1 - r).E(x1 - r, y1 - r, r, r, 0, 90).H(cx),
    pen().M(cx, y1).E(x0 + r, y1 - r, r, r, 90, 180).V(y0 + r).E(x0 + r, y0 + r, r, r, 180, 270).H(cx),
  ]
}
// tangent from external point P to circle (c, r): returns angle (deg) of the tangent point; side +1 / -1
function tangentAngle(px, py, cx, cy, r, side) {
  const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy)
  const phi = Math.atan2(dy, dx) * 180 / Math.PI, a = Math.acos(Math.min(1, r / d)) * 180 / Math.PI
  return phi + side * a
}
const dot = (x, y) => pen().M(x, y - 0.25).V(y) // a dot: a 0.25u stub that every stroke rounds into a disc
const rot180 = (ps, w, h) => ps.map(p => p.map(([x, y]) => [w - x, h - y]))
// ── open terminals ─────────────────────────────────────────────────────────────────────────────────────
// A terminal that curls back toward its own glyph (the tail of 5 S 3 2, the mouth of G, the hook of ?) closes a FALSE
// counter as soon as the stroke is wider than the gap: a 5 reads as a 6, an S as an 8, a G as an O. open() walks a
// terminal back (in `step` increments of the builder's parameter, from `from` to `to`) until its round end stays CLEAR
// of every other part of the glyph by a heavy stroke (2.5u + antialiasing), measured on the SNAPPED path data. Parts of
// the terminal's own stroke within 1.25 x clear of it along the path are its neighbours, not a closure, and are skipped.
// `clear` defaults to CLEAR; a terminal facing a long straight stroke (2, ?) asks for more, since antialiasing joins
// two parallel-ish edges sooner than a point and a curve.
// Pure geometry: deterministic, and a no-op wherever the drawing is already open (most large glyphs).
const CLEAR = 2.6, CLEAR_FLAT = 3.1
function terminalClear(pens, idx, atStart, clear = CLEAR) {
  // straight segments come back as their two end points only: resample every run to <= 0.1u so the middle of a
  // straight stroke (the diagonal of a 2, the stem of a ?) counts as much as its ends
  const dense = pts => pts.flatMap((q, i) => {
    if (!i) return [q]
    const a = pts[i - 1], n = Math.max(1, Math.ceil(Math.hypot(q[0] - a[0], q[1] - a[1]) / 0.1))
    return Array.from({ length: n }, (_, k) => [a[0] + (q[0] - a[0]) * (k + 1) / n, a[1] + (q[1] - a[1]) * (k + 1) / n])
  })
  const subsOf = p => { const d = p.d(); return d ? parsePath(d, 0.1).map(s => ({ ...s, pts: dense(s.pts) })) : [] }
  const own = subsOf(pens[idx]).flatMap(s => s.pts)
  if (own.length < 2) return true
  const seq = atStart ? own : [...own].reverse(), T = seq[0]
  const far = [] // own points beyond 1.25 x clear (by arc length from the terminal)
  for (let i = 1, acc = 0; i < seq.length; i++) {
    acc += Math.hypot(seq[i][0] - seq[i - 1][0], seq[i][1] - seq[i - 1][1])
    if (acc > clear * 1.25) far.push(seq[i])
  }
  const others = pens.flatMap((p, i) => i === idx ? [] : subsOf(p).flatMap(s => s.pts))
  return [...far, ...others].every(q => Math.hypot(q[0] - T[0], q[1] - T[1]) >= clear)
}
function open(make, from, to, step, idx = -1, atStart = false, clear = CLEAR) {
  const dir = Math.sign(to - from) || 1
  for (let v = from; dir * (to - v) >= -1e-9; v += dir * step) {
    const pens = make(v)
    if (terminalClear(pens, idx < 0 ? pens.length + idx : idx, atStart, clear)) return pens
  }
  return make(to)
}

// ── glyph drawings ────────────────────────────────────────────────────────────────────────────────────
// Each builder gets (h = cap height, w = design width, s = small drawing?) and returns an array of pens,
// drawn in a box x ∈ [0, w], y ∈ [0, h] (y = 0 cap top, y = h baseline). Widths: [large @cap7, small @cap5].
const WIDTH = {
  0: [4.5, 3.25], 1: [2, 1.5], 2: [4.5, 3.25], 3: [4.25, 3], 4: [4.75, 3.5], 5: [4.25, 3], 6: [4.5, 3.25], 7: [4.5, 3.25], 8: [4.5, 3.25], 9: [4.5, 3.25],
  A: [5.5, 4], B: [4.25, 3], C: [5, 3.5], D: [4.75, 3.25], E: [3.75, 2.75], F: [3.5, 2.5], G: [5.25, 3.75], H: [4.5, 3.25], I: [0, 0], J: [3.5, 2.5],
  K: [4.5, 3.25], L: [3.5, 2.5], M: [6, 4.5], N: [4.75, 3.5], O: [6, 4], P: [4.25, 3], Q: [6, 4], R: [4.5, 3.25], S: [4.25, 3], T: [5, 3.5],
  U: [4.5, 3.25], V: [5.5, 4], W: [7.5, 5.5], X: [5, 3.5], Y: [5.25, 3.75], Z: [4.5, 3.25],
  '%': [5, 3.5], '°': [3, 2.5], ':': [0, 0], '-': [2.75, 2], '+': [4.5, 3.25], '/': [3, 2.5], '.': [0, 0], ',': [0.75, 0.5], '!': [0, 0], '?': [4, 3],
  $: [4.25, 3], '€': [5, 3.75], '£': [4.5, 3.25], '₹': [4.25, 3], '#': [5.5, 4.25], '&': [5, 3.75], '*': [3.5, 3], "'": [0, 0], ' ': [0, 0],
}

const G = {
  0: (h, w) => stadium(0, 0, w, h, w / 2),
  1: (h, w, s) => [pen().M(0, s ? h * 0.27 : h * 0.25).L(w, 0).V(h)],
  2: (h, w) => {
    const r = w / 2, t = tangentAngle(0, h, r, r, r, -1) + 360
    // the top terminal curls toward the diagonal: walk it back until a heavy stroke cannot close the counter
    return open(a0 => [pen().E(r, r, r, r, a0, t).L(0, h).H(w)], 172, 222, 2.5, 0, true, CLEAR_FLAT)
  },
  3: (h, w, s) => {
    const m = h * 0.45, c1 = w / 2 - 0.125, arm = w * (s ? 0.42 : 0.38)
    if (s) { // flat-top 3: a top bar and a diagonal into the bowl; no small upper bowl to blob, no crowded junction
      const mm = h * 0.42, cx = w / 2, ry = (h - mm) / 2
      return open(e => [pen().M(0, 0).H(w).L(cx - 0.25, mm).H(cx).E(cx, (mm + h) / 2, w / 2, ry, 270, e)], 515, 470, 2.5)
    }
    const top = a0 => pen().E(c1, m / 2, c1, m / 2, a0, 450).H(arm)
    const t0 = open(a0 => [top(a0), pen().M(arm, m)], 205, 235, 2.5, 0, true)[0]
    return open(e => [t0, pen().M(arm, m).H(w / 2).E(w / 2, (m + h) / 2, w / 2, (h - m) / 2, 270, e)], 515, 480, 2.5)
  },
  4: (h, w, s) => {
    const stem = w - (s ? 1 : 1.25), bar = h * (s ? 0.66 : 0.68)
    return [pen().M(s ? 0.75 : 1, 0).L(0, bar).H(w), pen().M(stem, s ? h * 0.3 : 0).V(h)]
  },
  5: (h, w, s) => {
    const rx = w / 2, ry = h * 0.31, cy = h - ry
    const a = 215, sx = rx + rx * Math.cos(rad(a)), sy = cy + ry * Math.sin(rad(a))
    return open(e => [pen().M(w, 0).H(sx + 0.15).L(sx, sy).E(rx, cy, rx, ry, a, e)], 505, 460, 2.5)
  },
  6: (h, w) => {
    const r = w / 2, cy = h - r, px = w * 0.78
    const t = tangentAngle(px, 0, r, cy, r, -1)
    return [pen().M(px, 0).E(r, cy, r, r, t, t - 360)]
  },
  7: (h, w, s) => [pen().M(0, 0).H(w).L(w * (s ? 0.3 : 0.28), h)],
  8: (h, w, s) => {
    const m = h * 0.46, inset = s ? 0.125 : 0.25
    return [...ring(w / 2, m / 2, w / 2 - inset, m / 2), ...ring(w / 2, (m + h) / 2, w / 2, (h - m) / 2)]
  },
  9: (h, w, s) => rot180(G[6](h, w, s), w, h),

  A: (h, w, s) => {
    const cb = h * (s ? 0.68 : 0.66), k = cb / h
    return [pen().M(0, h).L(w / 2, 0).L(w, h), pen().M(w / 2 * (1 - k) + 0.1, cb).H(w - w / 2 * (1 - k) - 0.1)]
  },
  B: (h, w, s) => {
    const m = h * 0.46, r1 = m / 2, r2 = (h - m) / 2
    return [pen().M(0, m).V(0).H(w - 0.25 - r1).E(w - 0.25 - r1, r1, r1, r1, -90, 90).H(0),
      pen().M(0, m).V(h).H(w - r2).E(w - r2, m + r2, r2, r2, 90, -90).H(0)]
  },
  C: (h, w) => [pen().E(w / 2, h / 2, w / 2, h / 2, -42, -318)],
  D: (h, w) => {
    const r = Math.min(w * 0.62, h / 2)
    return [pen().M(0, h / 2).V(0).H(w - r).E(w - r, r, r, r, -90, 0).V(h - r).E(w - r, h - r, r, r, 0, 90).H(0).V(h / 2)]
  },
  E: (h, w, s) => [pen().M(w, 0).H(0).V(h).H(w), pen().M(0, h / 2).H(w * (s ? 0.75 : 0.85))],
  F: (h, w, s) => [pen().M(w, 0).H(0).V(h), pen().M(0, h * 0.5).H(w * (s ? 0.8 : 0.85))],
  G: (h, w, s) => { // spur: never a 6. The bar shortens until it cannot touch the bowl, then the mouth (top terminal vs
    // spur) opens until a heavy stroke cannot close it: a G must never close into an O
    const g = (a0, bx) => [pen().E(w / 2, h / 2, w / 2, h / 2, a0, -335).V(h * 0.54).H(w * bx)]
    let bx = s ? 0.55 : 0.5
    while (bx < 0.75 && !terminalClear(g(-40, bx), 0, false)) bx += 0.05
    return open(a0 => g(a0, bx), -40, -75, 2.5, 0, true)
  },
  H: (h, w) => [pen().M(0, 0).V(h), pen().M(w, 0).V(h), pen().M(0, h / 2).H(w)],
  I: h => [pen().M(0, 0).V(h)],
  J: (h, w) => { const r = w / 2; return [pen().M(w, 0).V(h - r).E(r, h - r, r, r, 0, 170)] },
  K: (h, w) => {
    const jy = h * 0.6, ky = (x) => jy * (1 - x / w), lx = w * 0.32
    return [pen().M(0, 0).V(h), pen().M(w, 0).L(0, jy), pen().M(lx, ky(lx)).L(w, h)]
  },
  L: (h, w) => [pen().M(0, 0).V(h).H(w)],
  M: (h, w, s) => [pen().M(0, h).V(0).L(w / 2, h * (s ? 0.58 : 0.66)).L(w, 0).V(h)],
  N: (h, w) => [pen().M(0, h).V(0).L(w, h).V(0)],
  O: (h, w) => ring(w / 2, h / 2, w / 2, h / 2),
  P: (h, w, s) => {
    const r = h * (s ? 0.29 : 0.285)
    return [pen().M(0, h).V(0).H(w - r).E(w - r, r, r, r, -90, 90).H(0)]
  },
  Q: (h, w) => [...ring(w / 2, h / 2, w / 2, h / 2), pen().M(w * 0.62, h * 0.68).L(w, h)],
  R: (h, w, s) => {
    const r = h * (s ? 0.29 : 0.285), bx = w - 0.25
    return [pen().M(0, h).V(0).H(bx - r).E(bx - r, r, r, r, -90, 90).H(0), pen().M(bx - r, 2 * r).L(w, h)]
  },
  S: (h, w, s) => {
    const m = h * 0.48, c1 = w / 2 - 0.125
    const S = (a0, e) => [pen().E(c1, m / 2, c1, m / 2, a0, -270).H(w / 2).E(w / 2, (m + h) / 2, w / 2, (h - m) / 2, -90, e)]
    let end = 155 // the lower tail first, then the upper terminal
    while (end > 110 && !terminalClear(S(-25, end), 0, false)) end -= 2.5
    return open(a0 => S(a0, end), -25, -55, 2.5, 0, true)
  },
  T: (h, w) => [pen().M(0, 0).H(w), pen().M(w / 2, 0).V(h)],
  U: (h, w) => { const r = w / 2; return [pen().M(0, 0).V(h - r).E(r, h - r, r, r, 180, 0).V(0)] },
  V: (h, w) => [pen().M(0, 0).L(w / 2, h).L(w, 0)],
  W: (h, w, s) => [pen().M(0, 0).L(w * 0.25, h).L(w / 2, h * (s ? 0.4 : 0.32)).L(w * 0.75, h).L(w, 0)],
  X: (h, w) => [pen().M(0, 0).L(w, h), pen().M(w, 0).L(0, h)],
  Y: (h, w) => [pen().M(0, 0).L(w / 2, h * 0.5).V(h), pen().M(w, 0).L(w / 2, h * 0.5)],
  Z: (h, w) => [pen().M(0, 0).H(w).L(0, h).H(w)],

  '%': (h, w, s) => {
    const r = s ? 0.75 : 1
    return [pen().M(w, 0).L(0, h), ...ring(r, r, r, r), ...ring(w - r, h - r, r, r)]
  },
  '°': (h, w) => ring(w / 2, w / 2, w / 2, w / 2),
  ':': (h, w, s) => [dot(0, h * (s ? 0.3 : 0.32)), dot(0, h)],
  '-': (h, w) => [pen().M(0, h * 0.55).H(w)],
  '+': (h, w) => [pen().M(0, h * 0.55).H(w), pen().M(w / 2, h * 0.55 - w / 2).V(h * 0.55 + w / 2)],
  '/': (h, w) => [pen().M(w, 0).L(0, h)],
  '.': h => [dot(0, h)],
  ',': (h, w) => [pen().M(w, h - 0.25).L(0, h + (h > 6 ? 1.5 : 1.25))],
  '!': (h, w, s) => [pen().M(0, 0).V(h - (s ? 2.75 : 3.25)), dot(0, h)],
  '?': (h, w, s) => {
    const r = w / 2, low = h - (s ? 2.75 : 3.25)
    // the hook's left terminal curls toward the stem: walk it back until the hook stays open
    return open(a0 => [pen().E(r, r, r, r, a0, 395).C(r + r * 0.55, r * 1.6, r, r * 1.7, r, low), dot(r, h)], 180, 260, 2.5, 0, true, CLEAR_FLAT)
  },
  $: (h, w, s) => {
    const pk = s ? 0.75 : 1
    return [...G.S(h, w, s), pen().M(w / 2, -pk).V(0.25), pen().M(w / 2, h - 0.25).V(h + pk)]
  },
  '€': (h, w, s) => {
    const ox = 0.75
    const arc = pen().E(w / 2 + ox / 2, h / 2, w / 2 - ox / 2, h / 2, -42, -318)
    return s ? [arc, pen().M(0, h / 2).H(w * 0.62)]
      : [arc, pen().M(0, h * 0.4).H(w * 0.62), pen().M(0, h * 0.62).H(w * 0.56)]
  },
  '£': (h, w, s) => {
    const r = s ? 1.25 : 1.75, sx = w * 0.3 + 0.25
    return [pen().E(sx + r, r, r, r, -10, -180).V(h - (s ? 0.75 : 1)).C(sx, h - 0.25, sx - 0.25, h, 0, h).H(w),
      pen().M(0, h * 0.52).H(w * 0.7)]
  },
  '₹': (h, w, s) => {
    const r = h * (s ? 0.26 : 0.27), bx = w - r - 0.25
    const p = [pen().M(0, 0).H(w), pen().M(0, 0).H(bx).E(bx, r, r, r, -90, 90).H(0).L(w * 0.8, h)]
    if (!s) p.push(pen().M(0, r).H(w))
    return p
  },
  '#': (h, w, s) => {
    const a = s ? 0.4 : 0.5, y1 = h * 0.33, y2 = h * 0.67, x1 = w * 0.3, x2 = w * 0.75
    return [pen().M(x1 + a, 0).L(x1 - a, h), pen().M(x2 + a, 0).L(x2 - a, h), pen().M(0, y1).H(w), pen().M(0, y2).H(w)]
  },
  '&': (h, w, s) => {
    // a loop on top, a crossing diagonal into a round bowl, a short kick out to the right
    const lr = s ? 1.2 : 1.55, cx = w * 0.42, cy = lr, br = (h - lr * 2) * 0.6, bx = br + 0.1, by = h - br
    const pt = (x, y, r, a) => [x + r * Math.cos(rad(a)), y + r * Math.sin(rad(a))]
    const [lx, ly] = pt(cx, cy, lr, 150)
    return [pen().M(w, h).L(lx, ly).E(cx, cy, lr, lr, 150, 395).E(bx, by, br, br, 215, -30).L(w, by - br * 0.35)]
  },
  '*': (h, w) => {
    const c = [w / 2, w / 2], r = w / 2, p = a => [c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a))]
    return [-90, -30, 30].map(a => { const [x0, y0] = p(a), [x1, y1] = p(a + 180); return pen().M(x0, y0).L(x1, y1) })
  },
  "'": (h, w, s) => [pen().M(0, 0).V(s ? 1.5 : 2)],
  ' ': () => [],
}

// ── glyph cache: drawing + ink profile at a given cap ────────────────────────────────────────────────────
const BIN = 0.25
const cache = new Map()
function glyph(ch, cap) {
  const key = ch + '@' + cap
  if (cache.has(key)) return cache.get(key)
  const small = cap < 6, M = small ? SMALL : LARGE, k = cap / M.cap
  const w = WIDTH[ch][small ? 1 : 0] * k
  const pens = G[ch](cap, w, small)
  const d = pens.map(p => p.d()).filter(Boolean).join(' ')
  // ink profile (left/right extent per y bin) at the reference stroke, from the snapped drawing
  const lo = -3, n = Math.ceil((cap + 6) / BIN), L = new Float64Array(n).fill(Infinity), R = new Float64Array(n).fill(-Infinity)
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  const hw = REF_SW / 2
  for (const sub of d ? parsePath(d, 0.1) : []) {
    const pts = sub.pts.length === 1 ? sub.pts : sub.pts
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[i + 1] || a
      const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.1))
      for (let j = 0; j <= steps; j++) {
        const x = a[0] + (b[0] - a[0]) * j / steps, y = a[1] + (b[1] - a[1]) * j / steps
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y)
        const b0 = Math.max(0, Math.floor((y - hw - lo) / BIN)), b1 = Math.min(n - 1, Math.ceil((y + hw - lo) / BIN))
        for (let q = b0; q <= b1; q++) {
          const dy = lo + q * BIN - y; if (Math.abs(dy) > hw) continue
          const half = Math.sqrt(hw * hw - dy * dy)
          if (x - half < L[q]) L[q] = x - half
          if (x + half > R[q]) R[q] = x + half
        }
      }
    }
  }
  if (x0 === Infinity) { x0 = 0; x1 = 0; y0 = 0; y1 = 0 }
  const g = { ch, d, pens, w, x0, x1, y0, y1, L, R, lo, n, empty: !d, small, M }
  cache.set(key, g)
  return g
}

// horizontal offset of b's origin relative to a's origin (optical kerning)
function pairOffset(a, b, M, k) {
  if (a.empty || b.empty) return null
  let dmin = Infinity
  const ds = []
  for (let q = 0; q < a.n; q++) {
    const y = a.lo + q * BIN
    const inA = a.R[q] > -Infinity, inB = b.L[q] < Infinity
    if (inA && inB) { const d = b.L[q] - a.R[q]; dmin = Math.min(dmin, d); ds.push(d) }
    else if ((inA || inB) && y >= 0 && y <= M.cap * k) ds.push(null)
  }
  const gapMin = M.gapMin, gapMean = M.gapMean * Math.sqrt(k), gapCap = M.gapCap * k
  const inkA = Math.max(...a.R.filter(v => v > -Infinity)), inkB = Math.min(...b.L.filter(v => v < Infinity))
  let X = inkA - inkB - M.maxKern * k
  if (dmin < Infinity) X = Math.max(X, gapMin - dmin)
  const mean = X => ds.reduce((s, d) => s + (d === null ? gapCap : Math.min(gapCap, X + d)), 0) / (ds.length || 1)
  if (ds.length && mean(X) < gapMean) {
    let lo = X, hi = X + gapMean + gapCap + 4
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (mean(mid) < gapMean) lo = mid; else hi = mid }
    X = hi
  }
  return X
}

const capOf = size => typeof size === 'number' ? size : size === 'small' ? SMALL.cap : LARGE.cap
export const supports = ch => Object.prototype.hasOwnProperty.call(G, String(ch).toUpperCase())
// Accented and ligature letters fold to the plain letters the font draws ("café" -> "CAFE", "Zoë" -> "ZOE",
// "Straße" -> "STRASSE", "Ø" -> "O"), so initials and labels keep every letter instead of silently losing it.
const FOLD = { 'ß': 'SS', 'ẞ': 'SS', 'Ø': 'O', 'Æ': 'AE', 'Œ': 'OE', 'Ð': 'D', 'Þ': 'TH', 'Ł': 'L', 'Đ': 'D', 'Ħ': 'H', 'İ': 'I', 'ı': 'I' }
export const fold = str => String(str ?? '').toUpperCase().replace(/[ßẞØÆŒÐÞŁĐĦİı]/g, c => FOLD[c] ?? c)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
export function coverage(str) {
  const missing = [...fold(str)].filter(c => !supports(c))
  return { ok: missing.length === 0, missing: [...new Set(missing)] }
}
export const clean = (str, maxLength = 4) => [...fold(str)].filter(supports).slice(0, maxLength).join('')

function layout(str, opts = {}) {
  const cap = Math.max(2, Math.min(12, snap(capOf(opts.size ?? 'large'))))
  const small = cap < 6, M = small ? SMALL : LARGE, k = cap / M.cap
  const chars = [...fold(str)]
  const missing = [...new Set(chars.filter(c => !supports(c)))]
  const glyphs = chars.filter(supports).map(c => glyph(c, cap))
  const track = Number(opts.tracking) || 0
  const placed = []
  let pen = 0, prev = null, pendingSpace = 0
  for (const g of glyphs) {
    if (g.ch === ' ') { if (prev) pendingSpace += M.space * k; continue }
    let x = 0
    if (prev) {
      const off = pairOffset(prev.g, g, M, k)
      x = prev.x + off + pendingSpace + track
    }
    x = snap(x)
    placed.push({ g, x }); prev = { g, x }; pendingSpace = 0
  }
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const { g, x } of placed) {
    x0 = Math.min(x0, x + g.x0); x1 = Math.max(x1, x + g.x1); y0 = Math.min(y0, g.y0); y1 = Math.max(y1, g.y1)
  }
  if (!placed.length) { x0 = x1 = 0; y0 = 0; y1 = cap }
  return { cap, small, placed, missing, x0, x1, y0, y1, chars: placed.map(p => p.g.ch).join('') }
}

function place(lay, opts) {
  const { x = 12, y = 12, align = 'center', valign = 'middle' } = opts
  const w = lay.x1 - lay.x0
  const ox = snap((align === 'left' ? x : align === 'right' ? x - w : x - w / 2) - lay.x0)
  const oy = snap(valign === 'top' ? y : valign === 'baseline' ? y - lay.cap : y - lay.cap / 2)
  return { ox, oy }
}

function result(lay, ox, oy, withPaths = true) {
  const box = { x0: snap(lay.x0 + ox), y0: snap(lay.y0 + oy), x1: snap(lay.x1 + ox), y1: snap(lay.y1 + oy) }
  const out = {
    width: snap(box.x1 - box.x0), height: lay.cap, box, cap: lay.cap, size: lay.small ? 'small' : 'large',
    chars: lay.chars, missing: lay.missing, baseline: snap(oy + lay.cap), top: snap(oy),
  }
  if (withPaths) {
    const vis = lay.placed.filter(p => !p.g.empty)
    out.paths = vis.map(p => p.g.pens.map(pn => pn.d(p.x + ox, oy)).join(' '))
    out.glyphs = vis.map(p => p.g.ch)
    out.paths.forEach((d, i) => EMITTED.set(d, { ch: out.glyphs[i], cap: lay.cap }))
  }
  return out
}

export function text(str, opts = {}) {
  const lay = layout(str, opts)
  const { ox, oy } = place(lay, opts)
  return result(lay, ox, oy)
}
export function measure(str, opts = {}) {
  const lay = layout(str, opts)
  const { ox, oy } = place(lay, opts)
  return result(lay, ox, oy, false)
}

// candidate caps from largest to smallest for fitText
function caps(prefer, minCap, maxCap) {
  const out = []
  if (prefer !== 'small') for (let c = LARGE.cap; c >= 6; c -= 0.25) out.push(c)
  for (let c = SMALL.cap + (prefer === 'small' ? 0 : 0.75); c >= minCap; c -= 0.25) out.push(c)
  return [...new Set(out)].filter(c => c <= maxCap + 1e-9)
}
export function fitText(str, box, opts = {}) {
  const s = [...fold(str)].filter(supports).join('')
  if (!s.trim()) return null
  const prefer = opts.prefer || (s.length <= 3 ? 'large' : 'small')
  const minCap = opts.minCap ?? 4, maxCap = opts.maxCap ?? Infinity
  const bw = box.x1 - box.x0, bh = box.y1 - box.y0
  for (const cap of caps(prefer, minCap, maxCap)) {
    const lay = layout(s, { size: cap, tracking: opts.tracking })
    // a round letter overshooting the cap by a hair (S, O: < 0.125u, under the 0.25 grid measure() reports) must
    // not make fitText refuse what measure() and fitLabel() say fits; widths are compared exactly
    const w = lay.x1 - lay.x0, h = lay.y1 - lay.y0 - Math.min(0.125, Math.max(0, lay.y1 - lay.y0 - lay.cap))
    if (w > bw + 1e-9 || h > bh + 1e-9) continue
    // centre the actual centreline box (descenders/degree included) in the given box
    const align = opts.align || 'center'
    const x = align === 'left' ? box.x0 : align === 'right' ? box.x1 : (box.x0 + box.x1) / 2
    const lx = snap((align === 'left' ? x : align === 'right' ? x - w : x - w / 2) - lay.x0)
    let ly
    if (opts.valign === 'top') ly = box.y0 - lay.y0
    else if (opts.valign === 'bottom' || opts.valign === 'baseline') ly = box.y1 - lay.y1
    else ly = (box.y0 + box.y1) / 2 - lay.cap / 2 // optical: centre the caps, then keep inside
    ly = Math.min(Math.max(ly, box.y0 - lay.y0), box.y1 - lay.y1)
    return result(lay, lx, snap(ly))
  }
  return null
}

// ── text tagging: lets style renderers recognise text ───────────────────────────────────────────────────
// Every glyph path text()/fitText() emits is remembered (d -> character, cap) while a generator builds.
// live(gen) wraps a generator's build(): it clears that memory, builds, then gives every output path whose d is
// a glyph path the id "text:<char>:<cap>:<n>" (n = path index, keeps ids unique). Style renderers read it
// (forge/styles/_live-text.mjs) to keep text legible in their own way. A glyph a generator draws by hand can be
// tagged with markText(d, char, cap). The memory only lives for one build() call, so builds stay deterministic.
const EMITTED = new Map()
export const markText = (d, ch = '?', cap = 5) => { EMITTED.set(d, { ch, cap }); return d }
export function live(gen) {
  const build = gen && gen.build
  if (typeof build !== 'function' || build.__live) return gen
  const wrapped = function (params) {
    EMITTED.clear()
    try {
      const sk = build.call(this, params)
      if (!sk || !Array.isArray(sk.paths)) return sk
      const paths = sk.paths.map((p, i) => {
        const d = typeof p === 'string' ? p : p && p.d
        const g = d ? EMITTED.get(d) : undefined
        if (!g || (p && p.id)) return p
        const id = `text:${g.ch}:${g.cap}:${i}`
        return typeof p === 'string' ? { d, plate: 'A', id } : { ...p, id }
      })
      return { ...sk, paths }
    } finally { EMITTED.clear() }
  }
  Object.defineProperty(wrapped, '__live', { value: true })
  gen.build = wrapped
  return gen
}

// paths for `cutouts`: every subpath open (closed rings split in two), so they knock out as lines
export function asCutouts(paths) {
  const out = []
  for (const d of [].concat(paths || [])) {
    for (const sub of String(d).split(/(?=M)/).map(s => s.trim()).filter(Boolean)) {
      const z = /[Zz]\s*$/.test(sub)
      if (!z) { out.push(sub); continue }
      // closed with Z: reopen by ending exactly at the start point via an explicit L, split at the middle command
      const body = sub.replace(/[Zz]\s*$/, '').trim()
      const m = body.match(/^M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/)
      const cmds = body.split(/(?=[LHVCSQTA])/)
      const half = Math.max(1, Math.floor(cmds.length / 2))
      const first = cmds.slice(0, half + 1).join('')
      const endPt = parsePath(first).at(-1).pts.at(-1)
      out.push(first, `M${f(endPt[0])} ${f(endPt[1])} ${cmds.slice(half + 1).join('')} L${m[1]} ${m[2]}`.replace(/\s+/g, ' '))
    }
  }
  return out
}
