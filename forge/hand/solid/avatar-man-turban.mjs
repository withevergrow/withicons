// forge/hand/solid/avatar-man-turban.mjs — Turbaned man redrawn for solid: the generated wrap sat on the face with only a
// hairline cut between them, so wrap and head merged into one dark dome at small sizes. Here the wrap is a full solid
// dome slightly wider than the face, parted from it by a wide paper seam that follows its pointed lower edge, with the
// two crossed pleats knocked out so it reads as a dastar; the face is its own oval with knocked-out eyes and smile and
// the shoulders are the family's standard bust. Geometry is cut with the kernel booleans. Motion: head wm-k, shoulders wm-a.
import { parsePath, area, polyD, simplify, circle } from '../../kernel/geom.mjs'
import { normalize, setOf, roundStrokeSet, differenceSets, intersectSets } from '../../kernel/bool.mjs'

const WRAP = 'M6.5 9.5 C4.5 8.5 3.75 6.5 4.5 4.75 C5.75 2.25 8.75 1.25 12 1.25 C15.25 1.25 18.25 2.25 19.5 4.75 C20.25 6.5 19.5 8.5 17.5 9.5 C15.75 8.75 13.75 8.25 12 7.25 C10.25 8.25 8.25 8.75 6.5 9.5 Z'
const PLEAT_L = 'M4.25 7 C7.5 6.25 10.5 4.75 12.75 2.25'
const PLEAT_R = 'M19.75 7 C16.5 6.25 13.5 4.75 11.25 2.25'
const BELOW_SEAM = 'M3 11.25 L6.5 10.6 C8.5 9.9 10.5 9.6 12 8.6 C13.5 9.6 15.5 9.9 17.5 10.6 L21 11.25 V20 H3 Z'
const SMILE = 'M10 14 C11 15 13 15 14 14'
const BODY = 'M6.96 17.19L5.92 17.56L5.2 18L4.56 18.58L4.06 19.28L3.83 19.76L3.63 20.4L3.52 21.04L3.5 21.52L3.54 21.76L3.64 22L3.76 22.17L4 22.36L4.24 22.46L4.48 22.5L4.96 22.39L5.31 22.08L5.43 21.84L5.51 21.52L5.6 21.5L18.4 21.5L18.49 21.52L18.59 21.92L18.8 22.21L19.12 22.42L19.44 22.5L19.76 22.46L20.06 22.32L20.25 22.16L20.44 21.84L20.5 21.52L20.46 20.88L20.33 20.24L20.07 19.52L19.74 18.96L19.28 18.41L18.8 18L18.24 17.64L17.52 17.33L17.04 17.19L16.8 17.2L16.18 17.68L15.6 18.05L14.56 18.56L13.68 18.83L12.96 18.97L11.92 19.04L10.72 18.92L10.08 18.77L9.44 18.56L8.4 18.05L7.76 17.64L7.2 17.2Z'

const ring = d => parsePath(d, 0.12)[0].pts
const ellipse = (cx, cy, rx, ry) => circle(0, 0, 1, 0.02).map(([x, y]) => [cx + x * rx, cy + y * ry])
const keep = set => set.filter(r => Math.abs(area(r)) > 1.2)
const D = set => set.filter(r => r.length > 2).map(r => polyD(simplify(r, 0.02, true), true)).join('')

export default function render() {
  const wrap = normalize(ring(WRAP))
  let wrapInk = differenceSets(wrap, roundStrokeSet(ring(PLEAT_L), 1.25))
  wrapInk = differenceSets(wrapInk, roundStrokeSet(ring(PLEAT_R), 1.25)).filter(r => Math.abs(area(r)) > 0.3)
  const face = intersectSets(normalize(ellipse(12, 11.25, 5, 5.75)), normalize(ring(BELOW_SEAM)))
  let faceInk = differenceSets(face, setOf([ellipse(9.75, 11.5, 0.8, 1), ellipse(14.25, 11.5, 0.8, 1)]))
  faceInk = differenceSets(faceInk, roundStrokeSet(ring(SMILE), 1.5))
  return [
    ['path', { d: D(wrapInk) + D(faceInk), 'fill-rule': 'evenodd' }],
    ['path', { d: BODY, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
