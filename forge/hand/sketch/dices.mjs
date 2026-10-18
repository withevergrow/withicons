// forge/hand/sketch/dices.mjs — two dice with big round marker pips and the hachure kept on the back die's shaded
// strip; the generated drawing gave dash-length pips that the hatch strokes on the front face mimicked, so at 16px
// the faces read as scribbles. Redrawn skeleton through the sketch renderer itself (same pen, pencil and hachure).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import sketch from '../../styles/sketch.mjs'

// a skeleton-shaped object for the sketch renderer (same shape forge/lib/load.mjs prepare() builds)
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
const dot = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const FRONT = 'M5 10H12A2 2 0 0 1 14 12V19A2 2 0 0 1 12 21H5A2 2 0 0 1 3 19V12A2 2 0 0 1 5 10Z'
const BACK = 'M10 6.75V5A2 2 0 0 1 12 3H19A2 2 0 0 1 21 5V12A2 2 0 0 1 19 14H17.25'
const BACK_FILL = 'M12 3H19A2 2 0 0 1 21 5V12A2 2 0 0 1 19 14H16.25V7.75H10V5A2 2 0 0 1 12 3Z'
const PIPS = [[5.75, 12.75], [8.5, 15.5], [11.25, 18.25]]
const BPIP = [[14, 6.5], [18, 10.5]]

export default function render(icon) {
  const name = (icon && icon.name) || 'dices'
  const sk = prep(name, [
    { d: FRONT, plate: 'K' },
    { d: BACK, plate: 'A' },
    ...PIPS.map(([x, y]) => ({ d: dot(x, y, 1), plate: 'K' })),
    ...BPIP.map(([x, y]) => ({ d: dot(x, y, 1), plate: 'A' })),
  ], [BACK_FILL], BPIP.map(([x, y]) => dot(x, y, 1.6)))
  return sketch.render(sk)
}
