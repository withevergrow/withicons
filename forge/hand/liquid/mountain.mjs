// forge/hand/liquid/mountain.mjs — two glass peaks: a tall clear-glass peak in front with a snow cap parted off by a
// zigzag groove, and a smaller coloured-glass peak standing behind it on the right, parted by a hairline. The
// generated mountain was a pale outlined triangle with a thin purple stick down its right side, so the second peak
// never read and the whole drawing faded on a light page; solid peaks give it mass, contrast and a clear skyline.
// Same glass model and light as the generator (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton for the liquid model: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d), fillOnly: p.line === false }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.filter(p => !p.fillOnly).flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
// polygon with rounded corners (radius per vertex)
function roundPoly(pts, rs) {
  const n = pts.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const v = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], r = Array.isArray(rs) ? rs[i] : rs
    const la = Math.hypot(a[0] - v[0], a[1] - v[1]), lb = Math.hypot(b[0] - v[0], b[1] - v[1])
    const ka = Math.min(r, la / 2) / la, kb = Math.min(r, lb / 2) / lb
    const p1 = [v[0] + (a[0] - v[0]) * ka, v[1] + (a[1] - v[1]) * ka], p2 = [v[0] + (b[0] - v[0]) * kb, v[1] + (b[1] - v[1]) * kb]
    d += `${i ? 'L' : 'M'}${r2(p1[0])} ${r2(p1[1])}Q${r2(v[0])} ${r2(v[1])} ${r2(p2[0])} ${r2(p2[1])}`
  }
  return d + 'Z'
}
// a tiny closed seed inside a filled piece: it tells the model which plate the fill belongs to
const seed = (x, y) => `M${r2(x)} ${r2(y)}l0.1 0l-0.05 0.1Z`
const incenter = ([A, B, C]) => {
  const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1])
  const s = a + b + c
  return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]
}

// the front peak (K) and the back peak (A); the back peak keeps only what shows right of the front's slope
const FRONT = [[8.4, 3], [15, 20.9], [1.2, 20.9]]
const GAP = 0.65
const meet = (p, u, q, v) => { const den = u[0] * v[1] - u[1] * v[0], t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den; return [p[0] + u[0] * t, p[1] + u[1] * t] }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const slope = sub(FRONT[1], FRONT[0]), sl = Math.hypot(...slope)
const off = [FRONT[0][0] + slope[1] / sl * GAP, FRONT[0][1] - slope[0] / sl * GAP]   // the slope moved right by GAP
const APEX = [17, 9.3], FOOT = [23, 20.9]
const BACK = [APEX, FOOT, meet(off, slope, FOOT, [-1, 0]), meet(off, slope, APEX, [-0.75, 1])]
// snow line: a narrow zigzag groove (a closed 0.85u band) right across the front peak's upper third
const ZIG = [[3.2, 12.7], [5.9, 11], [7.5, 12.7], [9.2, 11], [10.7, 12.5], [13.4, 11.3]]
const SNOW = 'M' + ZIG.map(p => p.join(' ')).join('L') + 'L' + ZIG.slice().reverse().map(([x, y]) => `${x} ${Math.round((y + 0.85) * 100) / 100}`).join('L') + 'Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'mountain'
  const sk = skeleton(name, [
    { d: roundPoly(FRONT, [1.3, 0.9, 0.9]), plate: 'K', fill: true, line: false },
    { d: roundPoly(BACK, [1.2, 0.9, 0.5, 0.7]), plate: 'A', fill: true, line: false },
  ], [SNOW])
  for (const [pl, x, y] of [['K', 8.2, 17], ['A', 19.4, 17.4]]) {
    sk.lines.push(...parsePath(seed(x, y)).map(s => ({ pts: s.pts, closed: s.closed, plate: pl, pathId: 'seed' + pl })))
  }
  return build(sk)
}
