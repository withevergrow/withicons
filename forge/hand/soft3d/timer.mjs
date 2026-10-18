// forge/hand/soft3d/timer.mjs — a red soft 3D stopwatch: a big cream crown button on a stem and a long cream hand
// from the centre. The generated hand was a short blob and the pusher a stub, which
// together read as an apple's seed and leaf; here the crown and hand are enlarged and the leaf-like pusher dropped, so it
// reads as a stopwatch, apart from the clock.
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
const HEX = {}
const recolour = n => Array.isArray(n) ? n.map(recolour) : n && typeof n === 'object'
  ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, typeof v === 'string'
    ? v.replace(/var\(--with-soft3d-(\w+), #[0-9A-Fa-f]{3,8}\)/g, (m, r) => HEX[r] ? `var(--with-soft3d-${r}, ${HEX[r]})` : m) : recolour(v)]))
  : n

export default function render(icon) {
  return recolour(fit(skeleton({ name: 'timer', category: 'time', ...icon }, [
    { d: 'M20 14A8 8 0 1 1 4 14A8 8 0 1 1 20 14Z', plate: 'K' },
    { d: 'M12 14L16 9.25', plate: 'A' },
    { d: 'M9.75 2.25H14.25M12 2.25V6', plate: 'A' },
  ], ['M20 14A8 8 0 1 1 4 14A8 8 0 1 1 20 14Z'], [])))
}
