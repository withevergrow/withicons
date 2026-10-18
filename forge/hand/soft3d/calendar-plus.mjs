// forge/hand/soft3d/calendar-plus.mjs — a white soft 3D calendar with a big chunky blue plus raised on the page.
// The generated plus was short and silver (grey on white), so it vanished at 16px; here it spans the page, is drawn as
// two crossing bars (so the model keeps it upright as a symbol) and takes the c2 role in blue (red on white read as first aid), the rings c3.
// Same model, camera and light as the generator (_soft3d-core.mjs); only the skeleton is redrawn.
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

// fallback colours by role: the plus in blue (a red cross on white reads as first aid), rings graphite
const HEX = { c2: '#3F7FE6' }
const recolour = n => Array.isArray(n) ? n.map(recolour) : n && typeof n === 'object'
  ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, typeof v === 'string'
    ? v.replace(/var\(--with-soft3d-(\w+), #[0-9A-Fa-f]{3,8}\)/g, (m, r) => HEX[r] ? `var(--with-soft3d-${r}, ${HEX[r]})` : m) : recolour(v)]))
  : n

const BODY = 'M5 5H19A2 2 0 0 1 21 7V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V7A2 2 0 0 1 5 5Z'

export default function render(icon) {
  return recolour(fit(skeleton({ name: 'calendar-plus', category: 'time', ...icon }, [
    { d: BODY, plate: 'K' },
    { d: 'M12 12.25V18.75', plate: 'A' },
    { d: 'M8.75 15.5H15.25', plate: 'A' },
    { d: 'M8 3V7M16 3V7', plate: 'A' },
  ], [BODY], ['M3 10H21'])))
}
