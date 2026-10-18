// forge/hand/liquid/motorcycle.mjs: a glass motorcycle with two solid glass wheels, a big coloured tank-and-engine body, a raked fork
// and a handlebar. The generated drawing had a small body and hollow wheels that read as a bicycle.
// Same glass model and light as the generator (_liquid-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton for the liquid model: parts [{ d, plate, fill }]
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
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
const circ = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'motorcycle'
  return build(skeleton(name, [
    { d: circ(4.8, 17.2, 3.3), plate: 'K', fill: true },
    { d: circ(19.2, 17.2, 3.3), plate: 'K', fill: true },
    { d: 'M16.6 6.4L19 14', plate: 'K' },
    { d: 'M14 6H18.2', plate: 'K' },
    { d: roundPoly([[4, 10], [9.4, 9.8], [11, 8], [16, 8.2], [16.6, 11.6], [14.8, 14.8], [9.6, 14.8], [8.4, 12.4], [4, 12.2]], 1.2), plate: 'A', fill: true },
  ]))
}
