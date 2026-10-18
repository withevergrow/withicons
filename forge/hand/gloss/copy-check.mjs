// forge/hand/gloss/copy-check.mjs — two glossy sheets, the front one carrying a bold knocked-out check exactly like
// the gloss check-square / clipboard-check family. The generated drawing raised the check as a tube inside a thin
// moat, so it read as a hollow outline that disappeared at 16px. Same inflated vinyl recipe as the generator
// (forge/styles/gloss.mjs models and lights it); only the skeleton is redrawn: the check is a groove, larger.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const FRONT = 'M11 9 H19 A2 2 0 0 1 21 11 V19 A2 2 0 0 1 19 21 H11 A2 2 0 0 1 9 19 V11 A2 2 0 0 1 11 9 Z'
const BACK = 'M15 5 A2 2 0 0 0 13 3 H5 A2 2 0 0 0 3 5 V13 A2 2 0 0 0 5 15'
const BACK_FILL = 'M5 3 H13 A2 2 0 0 1 15 5 V7 H11 L9.47 7.3 L8.17 8.17 L7.3 9.47 L7 11 V15 H5 A2 2 0 0 1 3 13 V5 A2 2 0 0 1 5 3 Z'
const CHECK = 'M12.25 15.25 L14.4 17.4 L17.75 12.9'

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'copy-check', [
    { d: FRONT, plate: 'K' },
    { d: BACK, plate: 'A' },
  ], [FRONT, BACK_FILL], [CHECK])
  return gloss.render(sk).map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }])
}
