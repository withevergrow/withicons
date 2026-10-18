// forge/hand/skeuo/boxes.mjs — three separate bevelled blue cubes (two on the bottom row, one stacked on top between
// them), each with its own gap, top face and shaded side faces. The generated drawing fused the cubes into one wide
// slab and capped it in gold. Same model, materials and light as the generator; only the geometry is drawn here.
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

const W = 3.9, T = W * 0.577, V = W * 1.155
const n = v => +v.toFixed(2)
// one isometric cube: top vertex at (cx, y0)
function cube(cx, y0) {
  const a = [cx, y0], b = [cx + W, y0 + T], c = [cx + W, y0 + T + V], d = [cx, y0 + 2 * T + V]
  const e = [cx - W, y0 + T + V], f = [cx - W, y0 + T], m = [cx, y0 + 2 * T]
  const P = pt => n(pt[0]) + ' ' + n(pt[1])
  return {
    body: `M${P(a)}L${P(b)}L${P(c)}L${P(d)}L${P(e)}L${P(f)}Z`,
    groove: `M${P(f)}L${P(m)}L${P(b)}M${P(m)}L${P(d)}`,
  }
}
const cubes = [cube(6.0, 12.7), cube(18.0, 12.7), cube(12, 2.3)]

// the top cube drifts as motion part A, so it is painted on its own
function one(icon, cs, part) {
  const S = skeleton({ name: 'boxes', category: 'objects', ...(icon || {}) },
    cs.map(c => ({ d: c.body })), cs.map(c => c.body), cs.map(c => c.groove))
  const T0 = { screen: true, screenMin: 3, groove: 1.3 }
  const nodes = paint(build(S, T0), materials(S, T0), T0)
  if (!part) return nodes
  return nodes.map(n => {
    const c = n[1].class
    return c === 'wm-shadow' ? n : [n[0], { ...n[1], class: 'wm-a' }, ...n.slice(2)]
  })
}

export default function render(icon) {
  return [...one(icon, cubes.slice(0, 2), false), ...one(icon, cubes.slice(2), true)]
}
