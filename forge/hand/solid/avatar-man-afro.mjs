// forge/hand/solid/avatar-man-afro.mjs — Afro man redrawn for solid: the generated drawing fused hair and face into one
// black blob split only by a hairline cut, so the afro read as a helmet at 16px. Here the cloud of hair is one mass with
// a wide paper channel around the face (as the cap and beard siblings separate their parts), the face is its own solid
// oval with knocked-out eyes and smile, and the shoulders are the family's standard bust. Geometry is cut with the kernel
// booleans so the channel width is exact. Motion: head wm-k, shoulders wm-a (breathe).
import { parsePath, area, polyD, simplify, circle } from '../../kernel/geom.mjs'
import { normalize, setOf, roundStrokeSet, differenceSets, intersectSets, dilate } from '../../kernel/bool.mjs'

const GAP = 1.1
const CLOUD = 'M6.5 13 C4.5 13.5 2.75 11.75 3.25 10 C2.25 8.25 3.25 5.75 5.5 5.25 C6 3 8.25 1.75 10.25 2.5 C11.25 1.5 12.75 1.5 13.75 2.5 C15.75 1.75 18 3 18.5 5.25 C20.75 5.75 21.75 8.25 20.75 10 C21.25 11.75 19.5 13.5 17.5 13 Z'
const BELOW_HAIRLINE = 'M4 9.75 C7.5 7.5 16.5 7.5 20 9.75 V20 H4 Z'
const SMILE = 'M10 14 C11 15 13 15 14 14'
const BODY = 'M7.28 17.12L6.48 17.33L5.92 17.56L5.44 17.83L4.96 18.19L4.64 18.5L4.11 19.2L3.86 19.68L3.69 20.16L3.53 20.96L3.5 21.44L3.54 21.76L3.64 22L3.76 22.17L4 22.36L4.24 22.46L4.48 22.5L4.96 22.39L5.31 22.08L5.43 21.84L5.51 21.52L5.6 21.5L18.4 21.5L18.49 21.52L18.59 21.92L18.8 22.21L19.12 22.42L19.44 22.5L19.76 22.46L20.06 22.32L20.25 22.16L20.44 21.84L20.5 21.52L20.46 20.88L20.33 20.24L20.07 19.52L19.74 18.96L19.28 18.41L18.8 18L18.24 17.64L17.52 17.33L16.88 17.15L16.56 17.12L15.36 17.9L14.32 18.36L13.68 18.54L12.96 18.68L11.76 18.74L10.56 18.6L9.44 18.27L8.48 17.81L7.44 17.12Z'

const ring = d => parsePath(d, 0.12)[0].pts
const ellipse = (cx, cy, rx, ry) => circle(0, 0, 1, 0.02).map(([x, y]) => [cx + x * rx, cy + y * ry])
const keep = set => set.filter(r => Math.abs(area(r)) > 1.2)
const D = set => set.filter(r => r.length > 2).map(r => polyD(simplify(r, 0.02, true), true)).join('')

export default function render() {
  const faceOval = normalize(ellipse(12, 11.25, 5, 5.75))
  const face = intersectSets(faceOval, normalize(ring(BELOW_HAIRLINE)))
  const hair = keep(differenceSets(normalize(ring(CLOUD)), dilate(face, GAP)))
  let faceInk = differenceSets(face, setOf([ellipse(9.75, 11.25, 0.8, 1), ellipse(14.25, 11.25, 0.8, 1)]))
  faceInk = differenceSets(faceInk, roundStrokeSet(ring(SMILE), 1.5))
  return [
    ['path', { d: D(hair) + D(faceInk), 'fill-rule': 'evenodd' }],
    ['path', { d: BODY, 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
