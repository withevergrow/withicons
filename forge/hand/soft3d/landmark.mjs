// forge/hand/soft3d/landmark.mjs — one clear bank: a terracotta pediment roof, a cream facade whose four even columns
// stand between deep recesses, and a wide plinth, all one solid, instead of the generated loose roof slab floating over
// four sausage columns.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// a prepared skeleton (as forge/lib/load.mjs prepares one), named after the icon so the style's palette, mode and ids apply
function skel(name, category, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name, category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

// pediment roof with a little overhang; everything above y 10 takes the roof colour
const ROOF = 'M11.15 2.75 A1.6 1.6 0 0 1 12.85 2.75 L20.6 8.2 A1 1 0 0 1 20.05 10 H3.95 A1 1 0 0 1 3.4 8.2 Z'
const FACADE = 'M5 9.5 H19 V18.5 H5 Z'
const PLINTH = 'M4 18 H20 A1 1 0 0 1 21 19 V20.25 A1 1 0 0 1 20 21.25 H4 A1 1 0 0 1 3 20.25 V19 A1 1 0 0 1 4 18 Z'
// deep recesses between four 1.5u columns (x 5-6.5, 9.25-10.75, 13.25-14.75, 17.5-19), given as ONE cutout of three
// rings so the style recesses them as wells (a single big ring would become a glass pane, which read as windows)
const GAPS = [[[6.5, 9.25], [10.75, 13.25], [14.75, 17.5]].map(([a, b]) => 'M' + a + ' 11.25 H' + b + ' V18.5 H' + a + ' Z').join(' ')]

export default function render() {
  // 'school' is a building with the same depth as a bank and a cap colour above y 10 (the roof)
  return fix(build(skel('school', 'commerce', { paths: [], fills: [ROOF, FACADE, PLINTH], cutouts: GAPS })))
}
const fix = n => Array.isArray(n) ? n.map(fix) : n && typeof n === 'object' ? Object.fromEntries(Object.entries(n).map(([k, v]) => [k, fix(v)]))
  : typeof n === 'string' ? n.replace(/wg-soft3d-school-/g, 'wg-soft3d-landmark-') : n
