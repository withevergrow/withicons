// forge/hand/liquid/rewind.mjs: two clear glass triangles pointing left with a visible gap, so the double chevron never fuses.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects. part: { d, plate, fill, stroke }.
// stroke:false = fill only (the glass outline is the shape itself); A / S fills keep a tiny inner line so they claim their plate
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

const T1 = rpoly([[11.6, 4.8], [11.6, 19.2], [1.6, 12]], [2.4, 2.4, 3.6])
const T2 = rpoly([[22.4, 4.8], [22.4, 19.2], [12.4, 12]], [2.4, 2.4, 3.6])

export default function render(icon) {
  const name = (icon && icon.name) || 'rewind'
  return build(skeleton(name, [
    { d: T1, plate: 'K', fill: true, stroke: false },
    { d: T2, plate: 'K', fill: true, stroke: false },
  ]))
}
