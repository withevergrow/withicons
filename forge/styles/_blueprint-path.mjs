// Blueprint helper: exact path geometry. Parses SVG path data into absolute
// segments that keep their true curve type (L / C / circular A), so the object
// line can be split and trimmed at nodes without flattening, and re-emitted
// compactly. Pure functions, no dependencies beyond the kernel's formatter.
import { fmt } from '../kernel/geom.mjs'

const TAU = Math.PI * 2
const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const unit = v => { const l = Math.hypot(v[0], v[1]); return l < 1e-12 ? [0, 0] : [v[0] / l, v[1] / l] }

// ---------------------------------------------------------------------------
// parse -> [{ segs: [seg], closed }]
// seg: { k:'L', a, b } | { k:'C', a, c1, c2, b } | { k:'A', a, b, cx, cy, r, t0, dt }
export function parseSegs(d) {
  const subs = []
  const n = d.length
  let i = 0
  const isCmd = c => 'MmLlHhVvCcSsQqTtAaZz'.includes(c)
  const skip = () => { while (i < n && (d[i] === ' ' || d[i] === ',' || d[i] === '\n' || d[i] === '\t' || d[i] === '\r')) i++ }
  const RE = /[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y
  const num = () => { skip(); RE.lastIndex = i; const m = RE.exec(d); if (!m) return NaN; i = RE.lastIndex; return parseFloat(m[0]) }
  const flag = () => { skip(); const c = d[i]; if (c === '0' || c === '1') { i++; return c === '1' } const v = num(); return !!v }
  const more = () => { skip(); return i < n && !isCmd(d[i]) }
  let cmd = '', x = 0, y = 0, sx = 0, sy = 0, lc = null, lq = null, prev = ''
  let cur = null
  const open = () => { cur = { segs: [], closed: false, start: [x, y] }; subs.push(cur) }
  const ensure = () => { if (!cur || cur.closed) open() }
  const L = (bx, by) => { ensure(); if (Math.hypot(bx - x, by - y) > 1e-6) cur.segs.push({ k: 'L', a: [x, y], b: [bx, by] }); x = bx; y = by }
  const C = (c1, c2, b) => {
    ensure()
    if (d2([x, y], b) + d2([x, y], c1) + d2([x, y], c2) > 1e-6) cur.segs.push({ k: 'C', a: [x, y], c1, c2, b })
    x = b[0]; y = b[1]
  }
  const A = (rx, ry, phi, fa, fs, bx, by) => {
    ensure()
    if (Math.hypot(bx - x, by - y) < 1e-6) return
    rx = Math.abs(rx); ry = Math.abs(ry)
    if (rx < 1e-6 || ry < 1e-6) return L(bx, by)
    const p = phi * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p)
    const dx = (x - bx) / 2, dy = (y - by) / 2
    const x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy
    const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s }
    const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    let co = Math.sqrt(Math.max(0, num2 / (den || 1e-12))); if (fa === fs) co = -co
    const cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx
    const cx = cp * cxp - sp * cyp + (x + bx) / 2, cy = sp * cxp + cp * cyp + (y + by) / 2
    const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
    const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if (!fs && dt > 0) dt -= TAU; else if (fs && dt < 0) dt += TAU
    if (Math.abs(rx - ry) < 1e-6 * Math.max(rx, ry)) {
      const t0 = Math.atan2(y - cy, x - cx)
      cur.segs.push({ k: 'A', a: [x, y], b: [bx, by], cx, cy, r: rx, t0, dt })
      x = bx; y = by; return
    }
    // elliptical arc -> cubic pieces of <= 90 degrees
    const pieces = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9))
    const h = dt / pieces, k = 4 / 3 * Math.tan(h / 4)
    const E = t => [cx + rx * Math.cos(t) * cp - ry * Math.sin(t) * sp, cy + rx * Math.cos(t) * sp + ry * Math.sin(t) * cp]
    const Ed = t => [-rx * Math.sin(t) * cp - ry * Math.cos(t) * sp, -rx * Math.sin(t) * sp + ry * Math.cos(t) * cp]
    for (let q = 0; q < pieces; q++) {
      const ta = t1 + h * q, tb = ta + h
      const pa = q === 0 ? [x, y] : E(ta), pb = q === pieces - 1 ? [bx, by] : E(tb)
      const da = Ed(ta), db = Ed(tb)
      C([pa[0] + k * da[0], pa[1] + k * da[1]], [pb[0] - k * db[0], pb[1] - k * db[1]], pb)
    }
    x = bx; y = by
  }
  let guard = 0
  while (i < n && guard++ < 100000) {
    skip(); if (i >= n) break
    if (isCmd(d[i])) cmd = d[i++]
    else if (!cmd) { i++; continue }
    const rel = cmd === cmd.toLowerCase(), K = cmd.toUpperCase()
    const ox = rel ? x : 0, oy = rel ? y : 0
    const at = i
    if (K === 'Z') {
      if (cur && !cur.closed) {
        if (Math.hypot(cur.start[0] - x, cur.start[1] - y) > 1e-6) cur.segs.push({ k: 'L', a: [x, y], b: [...cur.start] })
        x = cur.start[0]; y = cur.start[1]; cur.closed = true
      }
      prev = 'Z'; cmd = ''; continue
    }
    if (K === 'M') {
      const nx = ox + num(), ny = oy + num()
      if (Number.isNaN(nx) || Number.isNaN(ny)) { i = Math.max(i, at + 1); continue }
      x = nx; y = ny; sx = x; sy = y; open(); cur.start = [sx, sy]
      cmd = rel ? 'l' : 'L'; prev = 'M'
      if (!more()) cmd = ''
      continue
    }
    let ok = true
    if (K === 'L') { const a = num(), b = num(); ok = !Number.isNaN(a + b); if (ok) L(ox + a, oy + b) }
    else if (K === 'H') { const a = num(); ok = !Number.isNaN(a); if (ok) L(ox + a, y) }
    else if (K === 'V') { const a = num(); ok = !Number.isNaN(a); if (ok) L(x, oy + a) }
    else if (K === 'C') {
      const v = [num(), num(), num(), num(), num(), num()]; ok = !v.some(Number.isNaN)
      if (ok) { const c2 = [ox + v[2], oy + v[3]]; C([ox + v[0], oy + v[1]], c2, [ox + v[4], oy + v[5]]); lc = c2 }
    } else if (K === 'S') {
      const v = [num(), num(), num(), num()]; ok = !v.some(Number.isNaN)
      if (ok) {
        const c1 = (prev === 'C' || prev === 'S') && lc ? [2 * x - lc[0], 2 * y - lc[1]] : [x, y]
        const c2 = [ox + v[0], oy + v[1]]; C(c1, c2, [ox + v[2], oy + v[3]]); lc = c2
      }
    } else if (K === 'Q' || K === 'T') {
      let q, b
      if (K === 'Q') { const v = [num(), num(), num(), num()]; ok = !v.some(Number.isNaN); q = [ox + v[0], oy + v[1]]; b = [ox + v[2], oy + v[3]] }
      else { const v = [num(), num()]; ok = !v.some(Number.isNaN); q = (prev === 'Q' || prev === 'T') && lq ? [2 * x - lq[0], 2 * y - lq[1]] : [x, y]; b = [ox + v[0], oy + v[1]] }
      if (ok) { const a = [x, y]; C(lerp(a, q, 2 / 3), lerp(b, q, 2 / 3), b); lq = q }
    } else if (K === 'A') {
      const rx = num(), ry = num(), ph = num(), fa = flag(), fs = flag(), bx = num(), by = num()
      ok = !Number.isNaN(rx + ry + ph + bx + by)
      if (ok) A(rx, ry, ph, fa, fs, ox + bx, oy + by)
    } else ok = false
    if (!ok) { i = Math.max(i, at + 1); cmd = ''; continue }
    prev = K
    if (!more()) cmd = cmd // keep; loop re-reads a command letter
  }
  return subs.filter(s => s.segs.length)
}

// ---------------------------------------------------------------------------
// segment geometry
const cub = (s, t) => {
  const m = 1 - t
  return [m * m * m * s.a[0] + 3 * m * m * t * s.c1[0] + 3 * m * t * t * s.c2[0] + t * t * t * s.b[0],
          m * m * m * s.a[1] + 3 * m * m * t * s.c1[1] + 3 * m * t * t * s.c2[1] + t * t * t * s.b[1]]
}
export function segPt(s, t) {
  if (s.k === 'L') return lerp(s.a, s.b, t)
  if (s.k === 'A') { const th = s.t0 + s.dt * t; return [s.cx + s.r * Math.cos(th), s.cy + s.r * Math.sin(th)] }
  return cub(s, t)
}
// unit tangent (direction of travel)
export function segTan(s, t) {
  if (s.k === 'L') return unit([s.b[0] - s.a[0], s.b[1] - s.a[1]])
  if (s.k === 'A') { const th = s.t0 + s.dt * t, g = Math.sign(s.dt) || 1; return [-Math.sin(th) * g, Math.cos(th) * g] }
  const m = 1 - t
  let v = [3 * m * m * (s.c1[0] - s.a[0]) + 6 * m * t * (s.c2[0] - s.c1[0]) + 3 * t * t * (s.b[0] - s.c2[0]),
           3 * m * m * (s.c1[1] - s.a[1]) + 6 * m * t * (s.c2[1] - s.c1[1]) + 3 * t * t * (s.b[1] - s.c2[1])]
  if (Math.hypot(v[0], v[1]) < 1e-6) {
    // degenerate handle: look a little inward
    const e = t < 0.5 ? 1e-3 : -1e-3, p = cub(s, t), q = cub(s, t + e)
    v = e > 0 ? [q[0] - p[0], q[1] - p[1]] : [p[0] - q[0], p[1] - q[1]]
  }
  return unit(v)
}
export function segFlat(s, step = 0.25) {
  if (s.k === 'L') return [s.a, s.b]
  const L = segLen(s), n = Math.max(s.k === 'A' ? 2 : 4, Math.ceil(L / step))
  const out = []
  for (let k = 0; k <= n; k++) out.push(segPt(s, k / n))
  return out
}
const lenCache = new WeakMap()
export function segLen(s) {
  if (s.k === 'L') return d2(s.a, s.b)
  if (s.k === 'A') return Math.abs(s.dt) * s.r
  if (lenCache.has(s)) return lenCache.get(s)
  let L = 0, p = s.a
  for (let k = 1; k <= 24; k++) { const q = cub(s, k / 24); L += d2(p, q); p = q }
  lenCache.set(s, L); return L
}
// parameter at arclength `len` from the start
function tAt(s, len) {
  const L = segLen(s); if (L < 1e-9) return 0
  if (s.k !== 'C') return Math.max(0, Math.min(1, len / L))
  let acc = 0, p = s.a
  for (let k = 1; k <= 48; k++) {
    const q = cub(s, k / 48), l = d2(p, q)
    if (acc + l >= len) return (k - 1 + (len - acc) / (l || 1)) / 48
    acc += l; p = q
  }
  return 1
}
export function segSplit(s, t) {
  if (s.k === 'L') { const m = lerp(s.a, s.b, t); return [{ k: 'L', a: s.a, b: m }, { k: 'L', a: m, b: s.b }] }
  if (s.k === 'A') {
    const m = segPt(s, t)
    return [{ ...s, b: m, dt: s.dt * t }, { ...s, a: m, t0: s.t0 + s.dt * t, dt: s.dt * (1 - t) }]
  }
  const p01 = lerp(s.a, s.c1, t), p12 = lerp(s.c1, s.c2, t), p23 = lerp(s.c2, s.b, t)
  const p012 = lerp(p01, p12, t), p123 = lerp(p12, p23, t), m = lerp(p012, p123, t)
  return [{ k: 'C', a: s.a, c1: p01, c2: p012, b: m }, { k: 'C', a: m, c1: p123, c2: p23, b: s.b }]
}
// trim `len` of arclength off the start / end of a chain of segments
export function trimStart(segs, len) {
  const out = segs.slice()
  while (len > 1e-6 && out.length) {
    const L = segLen(out[0])
    if (L <= len + 0.02) { out.shift(); len -= L; continue }
    out[0] = segSplit(out[0], tAt(out[0], len))[1]; len = 0
  }
  return out
}
export function trimEnd(segs, len) {
  const out = segs.slice()
  while (len > 1e-6 && out.length) {
    const s = out.at(-1), L = segLen(s)
    if (L <= len + 0.02) { out.pop(); len -= L; continue }
    out[out.length - 1] = segSplit(s, tAt(s, L - len))[0]; len = 0
  }
  return out
}
export const chainLen = segs => segs.reduce((a, s) => a + segLen(s), 0)

// ---------------------------------------------------------------------------
// compact emission
const nf = v => { const s = fmt(v); return s.replace(/^(-?)0\./, '$1.') }
// join numbers with the fewest separators the SVG grammar allows
export function nums(arr) {
  let out = ''
  for (const v of arr) {
    const s = typeof v === 'string' ? v : nf(v)
    if (!out) { out = s; continue }
    if (s[0] === '-') out += s
    else if (s[0] === '.' && lastTokHasDot(out)) out += s
    else out += ' ' + s
  }
  return out
}
function lastTokHasDot(out) {
  let j = out.length - 1
  while (j >= 0 && /[\d.]/.test(out[j])) j--
  return out.slice(j + 1).includes('.')
}
export function chainD(segs, closed = false) {
  if (!segs.length) return ''
  let d = 'M' + nums([segs[0].a[0], segs[0].a[1]])
  let px = segs[0].a[0], py = segs[0].a[1]
  segs.forEach((s, idx) => {
    if (closed && idx === segs.length - 1 && s.k === 'L') { d += 'Z'; return }
    const [bx, by] = s.b
    if (s.k === 'L') {
      if (fmt(bx) === fmt(px)) d += 'V' + nums([by])
      else if (fmt(by) === fmt(py)) d += 'H' + nums([bx])
      else d += 'L' + nums([bx, by])
    } else if (s.k === 'A') {
      const large = Math.abs(s.dt) > Math.PI ? 1 : 0, sweep = s.dt > 0 ? 1 : 0
      if (Math.abs(s.dt) > TAU - 1e-3) {
        // full circle: split in two
        const m = segPt(s, 0.5)
        d += 'A' + nums([s.r, s.r, 0, '0', String(sweep), m[0], m[1]]) + 'A' + nums([s.r, s.r, 0, '0', String(sweep), bx, by])
      } else {
        // near a half-turn the radius equals half the chord; round it DOWN so
        // the renderer scales it back up to an exact half circle
        let r = s.r
        if (Math.abs(Math.abs(s.dt) - Math.PI) < 0.05) {
          const hc = Math.hypot(+fmt(bx) - +fmt(px), +fmt(by) - +fmt(py)) / 2
          r = Math.min(r, Math.floor(hc * 100) / 100)
        }
        d += 'A' + nums([r, r, 0, String(large), String(sweep), bx, by])
      }
    } else d += 'C' + nums([s.c1[0], s.c1[1], s.c2[0], s.c2[1], bx, by])
    px = bx; py = by
  })
  if (closed && segs.at(-1).k !== 'L') d += 'Z'
  return d
}
