// forge/hand/soft3d/store.mjs — a shop: a red scalloped awning with two white stripes over a cream front with a glass
// door in a red frame, instead of the generated awning that the cap line cut through (cream scallops like a wig, dark
// stripe bars) and a grey door blob that muddied at 16px.
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

// awning: everything above y 10 takes the cap colour, so its scallops end exactly there
const AWNING = 'M6.2 3 H17.8 A1 1 0 0 1 18.7 3.55 L21 8 A3 2 0 0 1 15 8 A3 2 0 0 1 9 8 A3 2 0 0 1 3 8 L5.3 3.55 A1 1 0 0 1 6.2 3 Z'
const FRONT = 'M4.5 10 H19.5 V19 A2 2 0 0 1 17.5 21 H6.5 A2 2 0 0 1 4.5 19 Z'
const DOOR = 'M9.75 21 V16.25 A2.25 2.25 0 0 1 14.25 16.25 V21 Z'
const FRAME = 'M9.25 20.5 V16.25 A2.75 2.75 0 0 1 14.75 16.25 V20.5'
const STRIPES = 'M10.1 3.4 L9.15 8.4 M13.9 3.4 L14.85 8.4'
// shop colours: a red awning and door frame (c2), white stripes (c3)
const PAL = { c2: '#E5483F', c3: '#EEF1F5' }

export default function render() {
  // 'school' is a building with a shop's depth and a cap colour above y 10 (the awning)
  return fix(build(skel('school', 'commerce', { paths: [[FRAME, 'A'], [STRIPES, 'A']], fills: [AWNING, FRONT], cutouts: [DOOR] })))
}
function fix(n) {
  if (Array.isArray(n)) return n.map(fix)
  if (n && typeof n === 'object') return Object.fromEntries(Object.entries(n).map(([k, v]) => [k, fix(v)]))
  if (typeof n !== 'string') return n
  return n.replace(/wg-soft3d-school-/g, 'wg-soft3d-store-')
    .replace(/var\(--with-soft3d-([a-z0-9]+), #[0-9A-Fa-f]+\)/g, (m, r) => PAL[r] ? 'var(--with-soft3d-' + r + ', ' + PAL[r] + ')' : m)
}
