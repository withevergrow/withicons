// forge/hand/sketch/popcorn.mjs — a striped popcorn bucket with a lip wider than its walls and heap of five overlapping
// puffed kernels above it; the generated drawing ran the rim through a three-bump cloud, so the
// kernels merged into the bucket. Redrawn skeleton through the sketch renderer itself (same pen, pencil and hachure).
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

const BUCKET = 'M4.75 10.5L6.6 20.3A1.4 1.4 0 0 0 8 21.5H16A1.4 1.4 0 0 0 17.4 20.3L19.25 10.5'
const BUCKET_FILL = 'M4.75 10.5H19.25L17.4 20.3A1.4 1.4 0 0 1 16 21.5H8A1.4 1.4 0 0 1 6.6 20.3Z'
const RIM = 'M3.5 10.5H20.5'
const STRIPES = 'M9.6 10.5L10.3 21.5M14.4 10.5L13.7 21.5'
// kernels: a heap of separate puffs, each drawn only where it shows (front middle, two flanking, two peeking behind)
const FRONT = 'M10 10.5A2.9 2.9 0 1 1 14 10.5'
const SIDES = 'M5.31 10.5A2.6 2.6 0 0 1 9.33 7.26M14.67 7.26A2.6 2.6 0 0 1 18.69 10.5'
const BACK = 'M7.46 6.5A2.2 2.2 0 1 1 11.49 5.55M12.51 5.55A2.2 2.2 0 1 1 16.54 6.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'popcorn'
  const sk = prep(name, [
    { d: BUCKET + RIM, plate: 'K' },
    { d: STRIPES, plate: 'K' },
    { d: BACK, plate: 'A' },
    { d: SIDES, plate: 'A' },
    { d: FRONT, plate: 'A' },
  ], [BUCKET_FILL], ['M3 10.5H21', 'M9.6 10.5L10.3 21.5', 'M14.4 10.5L13.7 21.5'])
  return sketch.render(sk)
}
