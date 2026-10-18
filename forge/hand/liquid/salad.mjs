// forge/hand/liquid/salad.mjs: a deep clear glass bowl on a foot, two violet glass leaves and a pink glass tomato rising above the rim.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects. part: { d, plate, fill, stroke }.
// stroke:false = fill only (the glass outline is the shape itself); fills keep a tiny inner line so they claim their plate (a dot inside the fill)
function skeleton(name, parts, cuts = []) {
  const paths = [], fills = []
  parts.forEach((p, i) => {
    const subs = parsePath(p.d), plate = p.plate || 'K'
    if (p.fill) fills.push({ d: p.d, subs, set: setOf(subs.map(s => s.pts)) })
    if (p.stroke !== false) paths.push({ id: 'p' + i, d: p.d, plate, subs })
    else {
      const pts = subs[0].pts, cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length
      const d = p.core || `M${cx.toFixed(2)} ${cy.toFixed(2)}h.3v.3z`
      paths.push({ id: 'p' + i, d, plate, subs: parsePath(d) })
    }
  })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
// polygon with rounded corners (quadratic through each vertex); r may be a number or a per-vertex array
function rpoly(pts, r) {
  const n = pts.length, f = v => +v.toFixed(2)
  let d = ''
  pts.forEach((p, i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const ka = Math.min(ri, la / 2) / la, kb = Math.min(ri, lb / 2) / lb
    const p1 = [p[0] + (a[0] - p[0]) * ka, p[1] + (a[1] - p[1]) * ka], p2 = [p[0] + (b[0] - p[0]) * kb, p[1] + (b[1] - p[1]) * kb]
    d += (i ? 'L' : 'M') + f(p1[0]) + ' ' + f(p1[1]) + 'Q' + f(p[0]) + ' ' + f(p[1]) + ' ' + f(p2[0]) + ' ' + f(p2[1])
  })
  return d + 'Z'
}

const BOWL = 'M2.8 12.6Q2.8 12 3.4 12H20.6Q21.2 12 21.2 12.6C21.2 17 18 19.4 14.5 19.4H9.5C6 19.4 2.8 17 2.8 12.6Z'
const LEAF_L = 'M10.2 12C5.6 12 3.4 8.6 3.8 4C8.6 4.2 11.4 7.6 10.2 12Z'
const LEAF_R = 'M13.8 12C18.4 12 20.6 8.6 20.2 4C15.4 4.2 12.6 7.6 13.8 12Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'salad'
  return build(skeleton(name, [
    { d: BOWL, plate: 'K', fill: true, stroke: false, core: 'M6 14.6H18V14.7Z' },
    { d: rr(8.4, 18.4, 15.6, 21.4, 1.2), plate: 'K', fill: true, stroke: false, core: 'M10 19.9H14V20Z' },
    { d: LEAF_L, plate: 'A', fill: true, stroke: false, core: 'M6.6 8.4h.1v.1Z' },
    { d: LEAF_R, plate: 'A', fill: true, stroke: false, core: 'M17.4 8.4h.1v.1Z' },
    { d: circ(12, 8.4, 3.3), plate: 'S', fill: true, stroke: false, core: circ(12, 8.4, 2.2) },
  ]))
}
