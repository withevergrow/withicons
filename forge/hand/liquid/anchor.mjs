// forge/hand/liquid/anchor.mjs — a glass anchor: a coloured-glass ring, a clear-glass shank and stock, and a deep
// curved crown ending in two broad filled flukes. The generated anchor ended its arms in small open barbs and sat
// high and thin, so on a light page it faded to a pale wire; the broad flukes, a lower, deeper crown and a larger
// ring hole give it a bold anchor silhouette that holds at 16px. Same glass model and light as the generator
// (_liquid-core.mjs); only the geometry is drawn here.
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

// centrelines (the glass grows round them: K 1.3u, A 1.15u)
const RING = circ(12, 4.9, 2.2)                         // A: coloured glass ring (it rocks from the top, forge/motion)
const SHANK = 'M12 8.4V19.8'
const STOCK = 'M8.1 11.3H15.9'
const CROWN = 'M5 14.3A7 7 0 0 0 19 14.3'
// broad flukes: filled arrowheads at the crown's tips
const FLUKES = ['M2.8 16.5L5 12.4L7.3 16Z', 'M21.2 16.5L19 12.4L16.7 16Z']

export default function render(icon) {
  const name = (icon && icon.name) || 'anchor'
  const sk = skeleton(name, [
    { d: SHANK, plate: 'K' },
    { d: STOCK, plate: 'K' },
    { d: CROWN, plate: 'K' },
    ...FLUKES.map(d => ({ d, plate: 'K', fill: true })),
    { d: RING, plate: 'A' },
  ])
  return build(sk)
}
