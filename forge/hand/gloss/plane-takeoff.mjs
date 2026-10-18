// forge/hand/gloss/plane-takeoff.mjs — a glossy climbing plane: a round tube fuselage with crisp swept wings and
// tail fins laid on exactly (no inflation), so wing and tail stay apart, and a slimmer runway bar well below the wing tip.
// The generated drawing inflated the whole outline by a 2.7u tube: wings, tail and fuselage fused into one blob and
// the lower wing tip ran into the ground line. Same vinyl recipe as the generator (forge/styles/gloss.mjs models and
// lights it); only the skeleton is redrawn for this style, in the plane's own axis frame.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const f2 = v => Math.round(v * 100) / 100
// polygon with every corner filleted (radius r, shrunk on short edges) -> path data with arcs
function roundPoly(pts, r) {
  const n = pts.length, out = []
  for (let i = 0; i < n; i++) {
    const A = pts[(i - 1 + n) % n], B = pts[i], C = pts[(i + 1) % n]
    const la = Math.hypot(A[0] - B[0], A[1] - B[1]), lc = Math.hypot(C[0] - B[0], C[1] - B[1])
    const a = [(A[0] - B[0]) / la, (A[1] - B[1]) / la], c = [(C[0] - B[0]) / lc, (C[1] - B[1]) / lc]
    const th = Math.acos(Math.max(-1, Math.min(1, a[0] * c[0] + a[1] * c[1])))
    const t = Math.tan(th / 2)
    const d = Math.min(r / t, 0.45 * la, 0.45 * lc), rr = d * t
    const p1 = [B[0] + a[0] * d, B[1] + a[1] * d], p2 = [B[0] + c[0] * d, B[1] + c[1] * d]
    const cross = (B[0] - A[0]) * (C[1] - B[1]) - (B[1] - A[1]) * (C[0] - B[0])
    out.push(`${i ? 'L' : 'M'}${f2(p1[0])} ${f2(p1[1])}A${f2(rr)} ${f2(rr)} 0 0 ${cross > 0 ? 1 : 0} ${f2(p2[0])} ${f2(p2[1])}`)
  }
  return out.join('') + 'Z'
}

// plane frame: nose N, axis u (towards the tail), w perpendicular (towards the lower wing)
const N = [19.4, 5.75], U = [-0.892, 0.452], W = [0.452, 0.892]
const P = (t, v) => [N[0] + U[0] * t + W[0] * v, N[1] + U[1] * t + W[1] * v]
const poly = tv => tv.map(([t, v]) => P(t, v))

const FUSE = (() => { const a = P(0.35, 0), b = P(14.6, 0); return `M${f2(a[0])} ${f2(a[1])} L${f2(b[0])} ${f2(b[1])}` })()
const WING_LO = roundPoly(poly([[4.5, 0], [9.9, 0], [10.75, 8.1], [9.0, 8.1]]), 0.55)
const WING_HI = roundPoly(poly([[4.7, 0], [10.1, 0], [11.75, -8.3], [10.0, -8.3]]), 0.55)
const TAIL_LO = roundPoly(poly([[12.8, 0], [15.2, 0], [15.9, 4.0], [14.6, 4.0]]), 0.45)
const TAIL_HI = roundPoly(poly([[13.0, 0], [15.4, 0], [16.4, -3.4], [15.1, -3.4]]), 0.45)
const RUNWAY = 'M3.5 20H20.5A1 1 0 0 1 20.5 22H3.5A1 1 0 0 1 3.5 20Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'plane-takeoff'
  const plane = gloss.render(prep(name, [{ d: FUSE, plate: 'K' }], [WING_LO, WING_HI, TAIL_LO, TAIL_HI]))
  const strip = gloss.render(prep(name, [], [RUNWAY]))
  return [
    ...plane.map(([t, a]) => [t, { ...a, class: 'wm-k' }]),
    ...strip.map(([t, a]) => [t, { ...a, class: 'wm-a' }]),
  ]
}
