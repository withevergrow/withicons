// forge/hand/sketch/door-closed.mjs — a shut door with a round knob, a floor line and dense hachure down its shadow
// side; the generated drawing hatched it so lightly the door vanished on white, and its dash handle read as a slot.
// Redrawn skeleton through the sketch renderer itself (same pen, pencil and hachure).
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

const DOOR = 'M5 21V5A2 2 0 0 1 7 3H17A2 2 0 0 1 19 5V21'
const DOOR_FILL = 'M5 21V5A2 2 0 0 1 7 3H17A2 2 0 0 1 19 5V21Z'
const FLOOR = 'M2.5 21H21.5'
const KNOB = [15.5, 12.25]

export default function render(icon) {
  const name = (icon && icon.name) || 'door-closed'
  const sk = prep(name, [
    { d: DOOR, plate: 'K' },
    { d: FLOOR, plate: 'K' },
    { d: dot(KNOB[0], KNOB[1], 1), plate: 'A' },
  ], [DOOR_FILL], [dot(KNOB[0], KNOB[1], 1.7)])
  // one more hachure stroke above the generated run, so the shut door keeps its tone on white
  return sketch.render(sk).map(([t, a]) => a['stroke-width'] === 0.8 ? [t, { ...a, d: a.d + 'M10.5 9.5l5-3.9' }] : [t, a])
}
