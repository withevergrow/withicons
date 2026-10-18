// forge/hand/gloss/satellite.mjs — a glossy satellite on the diagonal: a rounded square body, two solar panels each held
// 2u off the body by a thin strut (so white gaps frame the strut), a half-disc dish
// hanging from the body, and one broadcast arc around the dish (the moving signal, wm-s).
// The generated drawing closed body, panels, dish and arc into one black blob. Same vinyl recipe as the generator
// (forge/styles/gloss.mjs models the masses); only the skeleton is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

// fills may be rings (sets) or path data
function prep(name, fills = [], cutouts = []) {
  const F = fills.map(f => ({ d: '', subs: f.map(r => ({ pts: r, closed: true })), set: f }))
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths: [], fills: F, cutouts: C, lines: [], fillSet: F.length ? unionSets(F.map(f => f.set)) : [] }
}
const f2 = v => Math.round(v * 100) / 100
// axis runs from the upper left to the lower right; (u, v) = along it, across it (v up and to the right)
const C = [12.2, 11.6], D = [Math.SQRT1_2, Math.SQRT1_2], N = [Math.SQRT1_2, -Math.SQRT1_2]
const xy = (u, v) => [f2(C[0] + D[0] * u + N[0] * v), f2(C[1] + D[1] * u + N[1] * v)]
const fillOf = ring => setOf([ring])
// a rounded block u0..u1 x -hw..hw in (u, v), corner radius r
function block(u0, u1, hw, r, vc = 0) {
  const pts = [], n = 8
  const arc = (cu, cv, a0) => { for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; pts.push(xy(cu + r * Math.cos(a), cv + r * Math.sin(a))) } }
  arc(u1 - r, vc + hw - r, 0); arc(u0 + r, vc + hw - r, 90); arc(u0 + r, vc - hw + r, 180); arc(u1 - r, vc - hw + r, 270)
  return pts
}
const seg = (u0, v0, u1, v1) => `M${xy(u0, v0).join(' ')}L${xy(u1, v1).join(' ')}`

export default function render(icon) {
  const name = (icon && icon.name) || 'satellite'
  const tag = (sk, cls) => gloss.render(sk).map(([t, a]) => [t, { ...a, class: cls }])
  // body, struts and panels as one mass
  const main = prep(name, [
    fillOf(block(-2.3, 2.3, 2.3, 1.2)),
    fillOf(block(1.8, 4.9, 0.6, 0.3)), fillOf(block(-4.9, -1.8, 0.6, 0.3)),
    fillOf(block(4.4, 9.8, 3, 0.9)), fillOf(block(-9.8, -4.4, 3, 0.9)),
  ])
  // dish: a half disc facing away from the body, on a short stem
  const dish = []
  for (let i = 0; i <= 18; i++) { const a = Math.PI * i / 18; dish.push(xy(2.7 * Math.cos(a), -3.9 - 2.7 * Math.sin(a))) }
  const dishP = prep(name, [fillOf(dish), fillOf(block(-0.65, 0.65, 0.95, 0.3, -2.95))])
  // broadcast arc around the dish
  const dc = xy(0, -3.9), arcPts = []
  for (let i = 0; i <= 16; i++) { const a = (85 + 100 * i / 16) * Math.PI / 180; arcPts.push([dc[0] + 5.4 * Math.cos(a), dc[1] + 5.4 * Math.sin(a)]) }
  const signal = prep(name, [roundStrokeSet(arcPts, 1.6)])
  return [...tag(main, 'wm-k'), ...tag(dishP, 'wm-k'), ...tag(signal, 'wm-s')]
}
