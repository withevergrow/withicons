// forge/hand/soft3d/watch.mjs — a soft 3D wristwatch: a bright blue case with a raised white dial dish and cream hands, a crown
// on the right and a silver bracelet above and below. The generated watch fused case and straps into one dark blob; here the
// bracelet stands apart in its own colour and the white dial and crown make it read as a watch at 16px.
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

// fallback colours by role
const HEX = { c1: '#5B8DEF', c2: '#F4F7FB', c3: '#FFB347' }
const recolour = n => Array.isArray(n) ? n.map(recolour) : n && typeof n === 'object'
  ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, typeof v === 'string'
    ? v.replace(/var\(--with-soft3d-(\w+), #[0-9A-Fa-f]{3,8}\)/g, (m, r) => HEX[r] ? `var(--with-soft3d-${r}, ${HEX[r]})` : m) : recolour(v)]))
  : n

const CASE = 'M18 12A6 6 0 1 1 6 12A6 6 0 1 1 18 12Z'
export default function render(icon) {
  return recolour(fit(skeleton({ name: 'watch', category: 'devices', ...icon }, [
    { d: CASE, plate: 'K' },
    { d: 'M15.5 12A3.5 3.5 0 1 1 8.5 12A3.5 3.5 0 1 1 15.5 12Z', plate: 'A' },
    { d: 'M12 9.5V12L13.75 13.25', plate: 'A' },
    { d: 'M9.75 5.25L10.25 3H13.75L14.25 5.25Z', plate: 'A' },
    { d: 'M9.75 18.75L10.25 21H13.75L14.25 18.75Z', plate: 'A' },
    { d: 'M19.25 12H19.75', plate: 'A' },
  ], [CASE], [])))
}
