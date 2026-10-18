// forge/hand/liquid/mistletoe.mjs: a glass mistletoe sprig: a short stem, two broad leaves splaying down and three round berries at the junction.
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
const circ = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`


export default function render(icon) {
  const name = (icon && icon.name) || 'mistletoe'
  return build(skeleton(name, [
    { d: 'M12 2.2V4.4', plate: 'K' },
    { d: 'M11.4 12.8C8.4 13 4.8 15 4.4 20.2C9.4 20.2 11.8 16.8 11.4 12.8Z', plate: 'K', fill: true },
    { d: 'M12.6 12.8C15.6 13 19.2 15 19.6 20.2C14.6 20.2 12.2 16.8 12.6 12.8Z', plate: 'K', fill: true },
    { d: circ(8.6, 10.2, 1.5), plate: 'A', fill: true },
    { d: circ(15.4, 10.2, 1.5), plate: 'A', fill: true },
    { d: circ(12, 7, 1.5), plate: 'A', fill: true },
  ]))
}
