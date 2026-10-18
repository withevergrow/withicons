// forge/hand/liquid/navigation.mjs — the north-east navigation arrow as one solid glass arrowhead folded along its
// spine: the left facet clear glass, the right facet coloured glass, parted by a hairline. The generated arrow was a
// single pale slab whose thin tip faded into a light page; the folded facets give it a crisp keel and a tip that reads.
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

// arrowhead: tip T, left wing L, notch N, bottom wing B (the skeleton's, scaled up to the optical size the stroked
// glass of the generated icons reaches); the spine T-N splits it into two facets parted by GAP
const Z = 1.22, C = [11.75, 12.25]
const sc = ([x, y]) => [C[0] + (x - C[0]) * Z, C[1] + (y - C[1]) * Z]
const [T, Lw, N, B] = [[20.5, 3.5], [3, 10.5], [10.5, 13.5], [13.5, 21]].map(sc)
const GAP = 0.5
// line-line intersection of p + t*u and q + s*v
const meet = (p, u, q, v) => { const den = u[0] * v[1] - u[1] * v[0], t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den; return [p[0] + u[0] * t, p[1] + u[1] * t] }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const spine = sub(N, T), sl = Math.hypot(...spine), nrm = [-spine[1] / sl, spine[0] / sl]
const side = (nrm[0] * (B[0] - T[0]) + nrm[1] * (B[1] - T[1])) > 0 ? 1 : -1
const T2 = [T[0] + nrm[0] * GAP * side, T[1] + nrm[1] * GAP * side]
const LEFT = [T, Lw, N]
const RIGHT = [meet(T2, spine, T, sub(B, T)), meet(T2, spine, N, sub(B, N)), B]

export default function render(icon) {
  const name = (icon && icon.name) || 'navigation'
  const sk = skeleton(name, [
    { d: roundPoly(LEFT, [1.1, 1.3, 0.7]), plate: 'K', fill: true, line: false },
    { d: roundPoly(RIGHT, [0.8, 0.7, 1.3]), plate: 'A', fill: true, line: false },
  ])
  // seeds (stroked as small round dots well inside each facet) carry the plates
  for (const [pl, tri] of [['K', LEFT], ['A', RIGHT]]) {
    const [x, y] = incenter(tri)
    const subs = parsePath(seed(x, y))
    sk.lines.push(...subs.map(s => ({ pts: s.pts, closed: s.closed, plate: pl, pathId: 'seed' + pl })))
  }
  return build(sk)
}
