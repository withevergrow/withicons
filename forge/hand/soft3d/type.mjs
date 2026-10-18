// forge/hand/soft3d/type.mjs — the type glyph as one flat front-facing soft slab: a square T with short straight
// serifs at the bar ends and a foot, cut as one filled outline (no K stroke, so it
// is not fattened), with the foot serif raised as its own block (wm-a, so the motion's foot serif still lands a beat later). The generated T was three round-capped bars whose
// flared ends and walls read skewed; here stem and bar are flat and square like the other styles.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

function skeleton(icon, paths, fills, cutouts) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fs = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: icon.name, category: icon.category, paths: ps, fills: fs,
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fs.length ? unionSets(fs.map(f => f.set)) : [],
  }
}
function fit(sk) {
  let last = null
  for (const lite of [0, 1, 2, 3]) {
    try { const n = build(sk, lite); if (n && n.length > 1) { last = n; if (JSON.stringify(n).length < 18500) return n } } catch { /* next */ }
  }
  return last
}

// fallback colours by role (type: the foot in the body's blue)
const HEX = { c2: '#3D7EE0' }
const recolour = n => Array.isArray(n) ? n.map(recolour) : n && typeof n === 'object'
  ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, typeof v === 'string'
    ? v.replace(/var\(--with-soft3d-(\w+), #[0-9A-Fa-f]{3,8}\)/g, (m, r) => HEX[r] ? `var(--with-soft3d-${r}, ${HEX[r]})` : m) : recolour(v)]))
  : n

const T = 'M5 3.5H19A1 1 0 0 1 20 4.5V7.5A1 1 0 0 1 19 8.5H18A1 1 0 0 1 17 7.5V6.5H13.5V18H15.5A1 1 0 0 1 16.5 19V20A1 1 0 0 1 15.5 21H8.5A1 1 0 0 1 7.5 20V19A1 1 0 0 1 8.5 18H10.5V6.5H7V7.5A1 1 0 0 1 6 8.5H5A1 1 0 0 1 4 7.5V4.5A1 1 0 0 1 5 3.5Z'
export default function render(icon) {
  return recolour(fit(skeleton({ name: 'type', category: 'text', ...icon }, [
    { d: 'M8.75 19.5H15.25', plate: 'A' },
  ], [T], [])))
}
