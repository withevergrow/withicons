// STICKER helper — exact path-data transforms and the little decorations.
//
// The art is the author's own path data, scaled about the centre and shifted, so
// curves stay exact and files stay small. `subpaths(d)` splits any SVG path into
// absolute subpaths (H/V -> L, S/T -> C/Q with reflection, relative -> absolute,
// compact arc flags handled); `emit(subs, T)` writes them back through a
// similarity transform T = {s, ox, oy}.
import { fmt } from '../kernel/geom.mjs'

const NUM = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/
const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }

function tokenize(d) {
  const out = []
  let i = 0, cmd = '', argi = 0
  const s = String(d || '')
  while (i < s.length) {
    const ch = s[i]
    if (/[\s,]/.test(ch)) { i++; continue }
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(ch)) { out.push(ch); cmd = ch.toUpperCase(); argi = 0; i++; continue }
    // arc flags are single characters and may be packed ("0110 10")
    if (cmd === 'A' && (argi % 7 === 3 || argi % 7 === 4) && (ch === '0' || ch === '1')) { out.push(+ch); argi++; i++; continue }
    const m = s.slice(i).match(NUM)
    if (!m) { i++; continue }
    out.push(parseFloat(m[0])); argi++; i += m[0].length
  }
  return out
}

// -> [{ cmds: [[C, ...absArgs]], closed }]
export function subpaths(d) {
  const t = tokenize(d)
  const subs = []
  let cur = null, x = 0, y = 0, sx = 0, sy = 0, lc = null, lq = null, k = 0, cmd = ''
  const isNum = () => typeof t[k] === 'number'
  while (k < t.length) {
    if (!isNum()) cmd = t[k++]
    const C = cmd.toUpperCase(), rel = cmd !== C
    if (C === 'Z') {
      if (cur) { cur.closed = true; cur.cmds.push(['Z']); x = sx; y = sy }
      lc = lq = null
      if (isNum()) cmd = 'L' // tolerate numbers after Z
      continue
    }
    const n = ARGS[C]
    if (n === undefined) { k++; continue }
    const a = []
    for (let q = 0; q < n; q++) { if (!isNum()) break; a.push(t[k++]) }
    if (a.length < n) { if (k < t.length && !isNum()) continue; break }
    const ox = rel ? x : 0, oy = rel ? y : 0
    if (C === 'M') {
      x = a[0] + ox; y = a[1] + oy; sx = x; sy = y
      cur = { cmds: [['M', x, y]], closed: false }; subs.push(cur)
      cmd = rel ? 'l' : 'L'; lc = lq = null; continue
    }
    if (!cur || cur.closed) { cur = { cmds: [['M', x, y]], closed: false }; subs.push(cur) }
    if (C === 'L') { x = a[0] + ox; y = a[1] + oy; cur.cmds.push(['L', x, y]); lc = lq = null }
    else if (C === 'H') { x = a[0] + ox; cur.cmds.push(['L', x, y]); lc = lq = null }
    else if (C === 'V') { y = a[0] + oy; cur.cmds.push(['L', x, y]); lc = lq = null }
    else if (C === 'C' || C === 'S') {
      let x1, y1, x2, y2, x3, y3
      if (C === 'C') { x1 = a[0] + ox; y1 = a[1] + oy; x2 = a[2] + ox; y2 = a[3] + oy; x3 = a[4] + ox; y3 = a[5] + oy }
      else { x1 = lc ? 2 * x - lc[0] : x; y1 = lc ? 2 * y - lc[1] : y; x2 = a[0] + ox; y2 = a[1] + oy; x3 = a[2] + ox; y3 = a[3] + oy }
      cur.cmds.push(['C', x1, y1, x2, y2, x3, y3]); lc = [x2, y2]; lq = null; x = x3; y = y3
    } else if (C === 'Q' || C === 'T') {
      let x1, y1, x2, y2
      if (C === 'Q') { x1 = a[0] + ox; y1 = a[1] + oy; x2 = a[2] + ox; y2 = a[3] + oy }
      else { x1 = lq ? 2 * x - lq[0] : x; y1 = lq ? 2 * y - lq[1] : y; x2 = a[0] + ox; y2 = a[1] + oy }
      cur.cmds.push(['Q', x1, y1, x2, y2]); lq = [x1, y1]; lc = null; x = x2; y = y2
    } else if (C === 'A') {
      x = a[5] + ox; y = a[6] + oy
      cur.cmds.push(['A', a[0], a[1], a[2], a[3] ? 1 : 0, a[4] ? 1 : 0, x, y]); lc = lq = null
    }
  }
  return subs
}

// similarity transform of a point
export const tp = (T, p) => [12 + (p[0] - 12) * T.s + T.ox, 12 + (p[1] - 12) * T.s + T.oy]

// serialise absolute subpaths through T (absolute commands, 2 decimals, minimal separators)
export function emit(subs, T) {
  let out = ''
  const P = (x, y) => { const q = tp(T, [x, y]); return [q[0], q[1]] }
  const nums = arr => arr.map(fmt).join(' ').replace(/ -/g, '-')
  for (const sp of subs) {
    for (const c of sp.cmds) {
      const C = c[0]
      if (C === 'Z') { out += 'Z'; continue }
      if (C === 'M' || C === 'L') out += C + nums(P(c[1], c[2]))
      else if (C === 'C') out += 'C' + nums([...P(c[1], c[2]), ...P(c[3], c[4]), ...P(c[5], c[6])])
      else if (C === 'Q') out += 'Q' + nums([...P(c[1], c[2]), ...P(c[3], c[4])])
      else if (C === 'A') out += 'A' + nums([c[1] * T.s, c[2] * T.s, c[3]]) + ' ' + c[4] + ' ' + c[5] + ' ' + nums(P(c[6], c[7]))
    }
  }
  return out
}

// an absolute subpath back to plain path data (unscaled), for the kernel's flattener
export function raw(sp) { return emit([sp], { s: 1, ox: 0, oy: 0 }) }

// ---------------------------------------------------------------------------
// compact closed path through points: a quadratic B-spline (midpoint form) —
// smooth, never overshoots the polygon, written relative on a 1/q grid
const short = v => { const t = String(v); return t.replace(/^(-?)0./, '$1.') }
export function splineD(pts, q = 10) {
  const n = pts.length
  if (n < 3) return ''
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const m0 = mid(pts[n - 1], pts[0])
  let px = Math.round(m0[0] * q), py = Math.round(m0[1] * q)
  let d = 'M' + short(px / q) + ' ' + short(py / q)
  const num = v => short(Math.round(v) / q)
  for (let i = 0; i < n; i++) {
    const c = pts[i], e = mid(pts[i], pts[(i + 1) % n])
    const cx = Math.round(c[0] * q), cy = Math.round(c[1] * q), ex = Math.round(e[0] * q), ey = Math.round(e[1] * q)
    d += 'q' + [cx - px, cy - py, ex - px, ey - py].map(num).join(' ').replace(/ -/g, '-')
    px = ex; py = ey
  }
  return d.replace(/ -/g, '-') + 'z'
}

// ---------------------------------------------------------------------------
// decorations (absolute final coordinates)

// four-point sparkle: concave diamond, waist k*r
export function sparkleD(cx, cy, r, k = 0.2) {
  const w = r * k
  const P = (x, y) => fmt(x) + ' ' + fmt(y)
  return `M${P(cx, cy - r)}Q${P(cx + w, cy - w)} ${P(cx + r, cy)}Q${P(cx + w, cy + w)} ${P(cx, cy + r)}Q${P(cx - w, cy + w)} ${P(cx - r, cy)}Q${P(cx - w, cy - w)} ${P(cx, cy - r)}Z`.replace(/ -/g, '-')
}
// tiny heart, r = half width
export function heartD(cx, cy, r) {
  const P = (x, y) => fmt(cx + x * r) + ' ' + fmt(cy + y * r)
  return `M${P(0, 0.95)}C${P(-0.35, 0.65)} ${P(-1, 0.25)} ${P(-1, -0.25)}C${P(-1, -0.95)} ${P(-0.2, -1.05)} ${P(0, -0.5)}C${P(0.2, -1.05)} ${P(1, -0.95)} ${P(1, -0.25)}C${P(1, 0.25)} ${P(0.35, 0.65)} ${P(0, 0.95)}Z`.replace(/ -/g, '-')
}
// tiny chubby five-point star
export function starD(cx, cy, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.5 : r
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  return 'M' + pts.map(p => fmt(p[0]) + ' ' + fmt(p[1])).join('L').replace(/ -/g, '-') + 'Z'
}
