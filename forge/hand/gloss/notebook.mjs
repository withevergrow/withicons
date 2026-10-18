// forge/hand/gloss/notebook.mjs — a glossy spiral notebook: a tall cover with a label bar, and three fat binding rings
// that pass through its spine, each sitting in its own moat so it reads as a separate metal loop. The generated
// drawing fused the rings into the cover as three short teeth on a slab (a comb, or a blob at 16px); here the rings
// stand clear, glint along their tops like the style's tube streaks, and the cover carries the bean, glint dot and
// shadow-side hairline of every gloss mass.

// ---- the style's light and highlight recipe (forge/styles/gloss.mjs: LIGHT, beans, glint dots, rim light) ----
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()
const f = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const unit = (a, b) => { const x = b[0] - a[0], y = b[1] - a[1], l = Math.hypot(x, y) || 1; return [x / l, y / l] }
const deg = r => r * 180 / Math.PI
// a polygon (clockwise on screen) with rounded corners -> outline segments: ['L', x, y] | ['A', cx, cy, r, a0, a1]
function roundPoly(P, R) {
  const n = P.length, segs = []
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n], r = Array.isArray(R) ? R[i] : R
    const u1 = unit(b, a), u2 = unit(b, c), th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])))
    const t = r / Math.tan(th / 2), bis = unit([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]), h = r / Math.sin(th / 2)
    const T1 = [b[0] + u1[0] * t, b[1] + u1[1] * t], T2 = [b[0] + u2[0] * t, b[1] + u2[1] * t], C = [b[0] + bis[0] * h, b[1] + bis[1] * h]
    let a0 = deg(Math.atan2(T1[1] - C[1], T1[0] - C[0])), a1 = deg(Math.atan2(T2[1] - C[1], T2[0] - C[0]))
    while (a1 - a0 > 180) a1 -= 360
    while (a1 - a0 < -180) a1 += 360
    segs.push(['L', T1[0], T1[1]], ['A', C[0], C[1], r, a0, a1])
  }
  return segs
}
// mitred offset of a polygon (clockwise on screen: + grows it)
function offsetPoly(P, d) {
  const n = P.length
  return P.map((b, i) => {
    const a = P[(i - 1 + n) % n], c = P[(i + 1) % n], t1 = unit(a, b), t2 = unit(b, c)
    const n1 = [t1[1], -t1[0]], n2 = [t2[1], -t2[0]], k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1])
    return [b[0] + (n1[0] + n2[0]) * k, b[1] + (n1[1] + n2[1]) * k]
  })
}
const ap = (s, a) => [s[1] + s[3] * Math.cos(a * Math.PI / 180), s[2] + s[3] * Math.sin(a * Math.PI / 180)]
function segD(segs) {
  let d = '', first = true
  for (const s of segs) {
    if (s[0] === 'L') { d += (first ? 'M' : 'L') + f(s[1]) + ' ' + f(s[2]); first = false; continue }
    const p0 = ap(s, s[4]), p1 = ap(s, s[5])
    if (first) { d += 'M' + f(p0[0]) + ' ' + f(p0[1]); first = false }
    d += `A${f(s[3])} ${f(s[3])} 0 ${Math.abs(s[5] - s[4]) > 180 ? 1 : 0} ${s[5] > s[4] ? 1 : 0} ${f(p1[0])} ${f(p1[1])}`
  }
  return d + 'Z'
}
// sample an outline every ~0.1u: point, outward normal (clockwise outline), arc length
function walk(segs) {
  const out = []
  let prev = null, s = 0
  const push = (p, t) => { if (prev) s += Math.hypot(p[0] - prev[0], p[1] - prev[1]); out.push({ p, n: [t[1], -t[0]], s }); prev = p }
  const start = segs[segs.length - 1][0] === 'A' ? ap(segs[segs.length - 1], segs[segs.length - 1][5]) : [segs[segs.length - 1][1], segs[segs.length - 1][2]]
  let cur = start
  for (const sg of segs) {
    if (sg[0] === 'L') {
      const e = [sg[1], sg[2]], L = Math.hypot(e[0] - cur[0], e[1] - cur[1]), k = Math.max(1, Math.ceil(L / 0.1)), t = unit(cur, e)
      for (let q = 1; q <= k; q++) push([cur[0] + (e[0] - cur[0]) * q / k, cur[1] + (e[1] - cur[1]) * q / k], t)
      cur = e
    } else {
      const [, cx, cy, r, a0, a1] = sg, k = Math.max(1, Math.ceil(Math.abs(a1 - a0) * Math.PI / 180 * r / 0.1)), dir = Math.sign(a1 - a0)
      for (let q = 1; q <= k; q++) { const a = (a0 + (a1 - a0) * q / k) * Math.PI / 180; push([cx + r * Math.cos(a), cy + r * Math.sin(a)], [-Math.sin(a) * dir, Math.cos(a) * dir]) }
      cur = ap(sg, a1)
    }
  }
  return out
}
// a tapered highlight carved along a centreline (the style's streak/bean profile: sin^0.45, 0.1u tips)
function sweepD(cen, nrm, hmax, tip = 0.1) {
  const m = cen.length
  if (m < 3) return ''
  const L = [], Rr = []
  cen.forEach((c, q) => {
    const u = q / (m - 1), w = tip + (hmax - tip) * Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.45)
    L.push([c[0] + nrm[q][0] * w, c[1] + nrm[q][1] * w]); Rr.push([c[0] - nrm[q][0] * w, c[1] - nrm[q][1] * w])
  })
  const pts = [...L, ...Rr.reverse()].filter((p, i) => i % 2 === 0 || i === m - 1 || i === m)
  return 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z'
}
// bean: inset `depth` from the outline between arc lengths s0..s1
function bean(W, s0, s1, depth = 1.45, hmax = 0.5) {
  const run = W.filter(o => o.s >= s0 && o.s <= s1)
  return sweepD(run.map(o => [o.p[0] - o.n[0] * depth, o.p[1] - o.n[1] * depth]), run.map(o => o.n), hmax)
}
// reflected light: a hairline 0.5u inside the shadow-side outline, as wide as the edge faces away from the light
function rim(W, keep = () => true) {
  const out = []
  let run = []
  const flush = () => {
    if (run.length > 8) {
      const cen = run.map(o => [o.p[0] - o.n[0] * 0.5, o.p[1] - o.n[1] * 0.5])
      const pts = [...run.map((o, q) => [cen[q][0] + o.n[0] * o.w, cen[q][1] + o.n[1] * o.w]), ...run.map((o, q) => [cen[q][0] - o.n[0] * o.w, cen[q][1] - o.n[1] * o.w]).reverse()]
      out.push("M" + pts.filter((p, i) => i % 4 === 0 || i === run.length - 1 || i === run.length).map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z')
    }
    run = []
  }
  for (const o of W) {
    const w = 0.15 * sstep(0.3, 0.8, -(o.n[0] * LIGHT[0] + o.n[1] * LIGHT[1]))
    if (w < 0.04 || !keep(o.p)) { flush(); continue }
    run.push({ ...o, w })
  }
  flush()
  return out.join('')
}
const dot = (x, y, r = 0.45) => `M${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}Z`

// ---- the drawing ------------------------------------------------------------------------------------------------
// cover 6.25..21 x 1.5..22.5 (r2.75); rings: capsules 2.5..9.7 wide, 2.2 tall; each notched into the cover with a
// 0.6u moat (the style's parting gap round an overlay), the notch mouths eased r0.4
const X0 = 6.25, X1 = 21, Y0 = 1.5, Y1 = 22.5, CR = 2.75
const RINGS = [6.55, 12.05, 17.55], RH = 1.1, RX0 = 3.6, RX1 = 8.6, M = RH + 0.6, E = 0.4
const outline = [
  ['L', X1 - CR, Y0], ['A', X1 - CR, Y0 + CR, CR, 270, 360],
  ['L', X1, Y1 - CR], ['A', X1 - CR, Y1 - CR, CR, 0, 90],
  ['L', X0 + CR, Y1], ['A', X0 + CR, Y1 - CR, CR, 90, 180],
  ...[...RINGS].reverse().flatMap(y => [
    ['L', X0, y + M + E], ['A', X0 + E, y + M + E, E, 180, 270],
    ['L', RX1, y + M], ['A', RX1, y, M, 90, -90],
    ['L', X0 + E, y - M], ['A', X0 + E, y - M - E, E, 90, 180],
  ]),
  ['L', X0, Y0 + CR], ['A', X0 + CR, Y0 + CR, CR, 180, 270],
]
const capsule = (x0, x1, y, h) => `M${f(x0)} ${f(y - h)}H${f(x1)}A${h} ${h} 0 0 1 ${f(x1)} ${f(y + h)}H${f(x0)}A${h} ${h} 0 0 1 ${f(x0)} ${f(y - h)}Z`
const line = (x0, x1, y) => { const cen = [], nr = []; for (let x = x0; x <= x1 + 1e-9; x += 0.1) { cen.push([x, y]); nr.push([0, -1]) } return [cen, nr] }
const arcRun = (cx, cy, r, a0, a1) => {
  const cen = [], nr = []
  for (let a = a0; a <= a1 + 1e-9; a += 1.2) { const t = a * Math.PI / 180; cen.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); nr.push([Math.cos(t), Math.sin(t)]) }
  return [cen, nr]
}

export default function render() {
  const W = walk(outline)
  // cover: bean along the lit top edge, glint dot after it, label groove (1.6u, the style's groove), hairline
  const [bc, bn] = arcRun(12.5, 11.5, 8.6, 237, 276)
  const cover = segD(outline) + sweepD(bc, bn, 0.48) + dot(15.25, 3.05, 0.42) + capsule(12.6, 17.4, 7.6, 0.8)
    + rim(W, p => p[0] > X0 + 3)
  // rings: each a 2.2u tube with a streak along its lit top (the style's tube streak: 0.53u above the centreline)
  const rings = RINGS.map(y => capsule(RX0, RX1, y, RH) + sweepD(...line(RX0 - 0.1, RX1 - 1.3, y - 0.5), 0.26)).join('')
  return [
    ['path', { d: cover, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: rings, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
