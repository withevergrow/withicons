// forge/hand/skeuo/rolling-pin.mjs — a slim wooden rolling pin on the diagonal: a long barrel with the grain running
// along its length, a groove ring at each end of the barrel and a round-ended handle at each end. The generated pin was
// a fat paddle with stub knobs. Same model, materials and light as the generator; only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_skeuo-core.mjs'
import { materials } from '../../styles/_skeuo-mat.mjs'
import { paint } from '../../styles/_skeuo-render.mjs'

function skeleton(base, paths, fills, cuts) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  return {
    ...base, paths: ps,
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

// local frame: u along the pin (up and to the right), v across it
const K = Math.SQRT1_2
const pt = (u, v) => `${+(12 + K * (u + v)).toFixed(2)} ${+(12 + K * (v - u)).toFixed(2)}`
// rounded rectangle u0..u1 x v0..v1 with corner radius r, drawn with arcs
function rr(u0, u1, v0, v1, r) {
  return `M${pt(u0 + r, v0)}L${pt(u1 - r, v0)}A${r} ${r} 0 0 1 ${pt(u1, v0 + r)}L${pt(u1, v1 - r)}` +
    `A${r} ${r} 0 0 1 ${pt(u1 - r, v1)}L${pt(u0 + r, v1)}A${r} ${r} 0 0 1 ${pt(u0, v1 - r)}` +
    `L${pt(u0, v0 + r)}A${r} ${r} 0 0 1 ${pt(u0 + r, v0)}Z`
}

const BODY = rr(-5.8, 5.8, -3.1, 3.1, 1.6)
const H1 = rr(5.2, 10.2, -1.15, 1.15, 1.15)
const H2 = rr(-10.2, -5.2, -1.15, 1.15, 1.15)
const RING1 = `M${pt(5.4, -2.9)}L${pt(5.4, 2.9)}`
const RING2 = `M${pt(-5.4, -2.9)}L${pt(-5.4, 2.9)}`

export default function render(icon) {
  const S = skeleton({ name: 'rolling-pin', category: 'food', ...(icon || {}) },
    [{ d: BODY }, { d: H1 }, { d: H2 }], [BODY, H1, H2], [RING1, RING2])
  const T = { body: 'wood', part: 'wood', groove: 0.8 }
  return paint(build(S, T), materials(S, T), T)
}
